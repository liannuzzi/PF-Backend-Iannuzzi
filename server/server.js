const express = require("express");
const app = express();
const { dbType } = require("../config");
const { Router } = express;
const routerProduct = Router();
const routerCart = Router();
const cartDAO = require("../daos/carts/cartsDaoMongo");
const productDAO = require("../daos/products/productsDaoMongo");
const usuarioDAO = require("../daos/users/usuariosDao");
const orderDAO = require("../daos/orders/ordersDaoMongo");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { checkPassword, hashPassword } = require("../utils/utils");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { default: mongoose } = require("mongoose");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const {
  sendMailNewUser,
  sendMailNewOrder,
} = require("../notifications/mailing");
const { sendMessageNewOrder } = require("../notifications/messaging");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const clusterMode = process.argv[2] === "CLUSTER";
const logger = require("../logger/logger_config");
const config = require("../config");

if (clusterMode && cluster.isPrimary) {
  console.log("Cluster iniciado");
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/api/products", routerProduct);
  app.use("/api/cart", routerCart);

  passport.use(
    "login",
    new LocalStrategy(async (username, password, done) => {
      const usuario = await usuarioDAO.findUser(username);
      const passHash = usuario.password;
      if (!usuario || !checkPassword(password, passHash)) {
        console.log(`Usuario y/o contraseña invalidos`);
        return done(null, false);
      } else {
        return done(null, usuario);
      }
    })
  );

  passport.use(
    "signup",
    new LocalStrategy(
      {
        passReqToCallback: true,
      },
      async (req, username, password, done) => {
        const usuario = await usuarioDAO.findUser(username);
        if (usuario) {
          return done(null, false, { message: "El usuario ya existe" });
        }
        const address = req.body.address;
        const hashedPassword = hashPassword(password);
        const age = req.body.age;
        const name = req.body.name;
        const telephone = req.body.telephone;

        const newUser = {
          username: username,
          password: hashedPassword,
          address: address,
          age: age,
          name: name,
          telephone: telephone,
        };
        const generateUser = await usuarioDAO.saveUser(newUser);
        if (generateUser) {
          const stringAge = generateUser.age.toString();
          const info = `Se creó el usuario ${generateUser.username} con los siguientes datos:
        Nombre:${generateUser.name}
        Edad:${stringAge},
        Direccion:${generateUser.address},
        Telefono:${generateUser.telephone}
        `;
          sendMailNewUser(info);
        }
        return done(null, generateUser);
      }
    )
  );

  passport.serializeUser((user, done) => {
    logger.log("info", `User serialize: ${user}`);
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    idUser = mongoose.Types.ObjectId(id);
    const user = await usuarioDAO.findUserById(idUser);
    logger.log("info", `User deserialize: ${user}`);
    done(null, user);
  });

  app.use(
    session({
      store: MongoStore.create({
        mongoUrl: config.uriString,
        ttl: 60,
        mongoOptions: advancedOptions,
      }),

      secret: "secret_String",
      resave: false,
      saveUninitialized: true,
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.post(
    "/login",
    passport.authenticate("login", {
      failureRedirect: "/login",
    }),
    (req, res) => {
      req.session.user = req.user;
      res.redirect("/");
    }
  );

  app.post(
    "/signup",
    passport.authenticate("signup", {
      failureRedirect: "/signup",
    }),
    (req, res) => {
      req.session.user = req.user;
      res.redirect("/login");
    }
  );

  app.get("/", async (req, res) => {
    res.json("Bienvenido a la HOME");
  });

  routerProduct.get("/", async (req, res) => {
    try {
      const allProducts = await productDAO.getAll();
      res.json(allProducts);
    } catch (err) {
      res.status(400).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  routerProduct.get("/:id", async (req, res) => {
    try {
      const resultado = await productDAO.getById(req.params.id);
      res.json(resultado);
    } catch (err) {
      res.status(400).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  routerProduct.post("/", async (req, res) => {
    try {
      const resultado = await productDAO.saveProduct(req.body);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  routerProduct.put("/:id", async (req, res) => {
    try {
      const resultado = await productDAO.editProduct(req.body, req.params.id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  routerProduct.delete("/:id", async (req, res) => {
    try {
      const resultado = await productDAO.deleteById(req.params.id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  routerCart.post("/", async (req, res) => {
    try {
      const resultado = await cartDAO.createCart(cartUser);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  routerCart.delete("/:id", async (req, res) => {
    try {
      const resultado = await cartDAO.deleteCart(req.params.id);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  routerCart.get("/:id/productos", async (req, res) => {
    try {
      const resultado = await cartDAO.getAllCartProducts(req.params.id);
      res.json(resultado);
    } catch (err) {
      res.status(400).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  routerCart.post("/:id/productos", async (req, res) => {
    try {
      const resultado = await cartDAO.addProductToCart(req.params.id, req.body);
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  routerCart.delete("/:id/productos/:idProd", async (req, res) => {
    try {
      const resultado = await cartDAO.deleteProductFromCart(
        req.params.id,
        req.params.idProd
      );
      res.json(resultado);
    } catch (err) {
      res.status(500).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  routerCart.post("/:id/confirmOrder", async (req, res) => {
    try {
      const result = await cartDAO.getAllCartProducts(req.params.id);
      if (result[0].products) {
        const cartProducts = result[0].products;
        const resultado = await orderDAO.createOrder(cartProducts);

        sendMailNewOrder(result[0].products, "Nueva orden ingresada");
        sendMessageNewOrder("Nueva orden ingresada!");
        res.json(resultado);
      } else {
        res.json({ Mensaje: "Agregue productos al carrito" });
        logger.log("warn", `Agregue productos al carrito`);
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
      logger.log("error", `Error: ${err}`);
    }
  });

  const PORT = 8080;

  const server = app.listen(PORT, () => {
    logger.log("info", `Servidor escuchando puerto ${PORT}`);
  });
}
