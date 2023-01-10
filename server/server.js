const express = require("express");
const app = express();
var path = require('path');
const { Server: HTTPServer } = require("http");
const { Server: SocketServer } = require("socket.io");
const httpServer = new HTTPServer(app);
const socketServer = new SocketServer(httpServer);
const messageDAO = require("../daos/messages/messagesDaoMongo")
const usuarioDAO = require("../daos/users/usuariosDao");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt=require('jsonwebtoken')
const JWTStrategy=require('passport-jwt').Strategy
const ExtractJWT=require('passport-jwt').ExtractJwt
const { checkPassword, hashPassword } = require("../src/utils/utils");
const { default: mongoose } = require("mongoose");
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const {
  sendMailNewUser
} = require("../notifications/mailing");
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;
const clusterMode = process.argv[2] === "CLUSTER";
const logger = require("../logger/logger_config");


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


  // ROUTERS

  const ProductRouter = require("../src/routes/product");
  const CartRouter = require("../src/routes/cart");

  app.use("/products", ProductRouter);
  app.use("/carts", CartRouter);

  // AUTENTICACION

  // LogIn

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

  // SignUp

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
          telephone: telephone
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

passport.use(new JWTStrategy({
  secretOrKey:'top-secret',
  jwtFromRequest:ExtractJWT.fromUrlQueryParameter('secret_token')
}, async(token,done)=>{
  try {
    return done(null,token.user)
  } catch (error) {
    done(error)
  }
}))

  passport.serializeUser((user, done) => {
    logger.log("info", `User serialize: ${user}`);
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const idUser = mongoose.Types.ObjectId(id);
    const user = await usuarioDAO.findUserById(idUser)
    logger.log("info", `User deserialize: ${user}`);
    done(null, user);
  });

  app.use(passport.initialize());

  // LOGIN CON JWT

  app.post(
    "/login",
    passport.authenticate("login", {
      failureRedirect: "/login",
      session:false
    }),
    (req, res) => {
      req.login(req.user,{session:false},async(err)=>{
        if(err) return err
        const body={_id:req.user._id}
        const token=jwt.sign({user:body},'top-secret')
        res.json({message:'Login exitoso',
        token:token})
      })
    }
  );

// SIGN UP

  app.post(
    "/signup",
    passport.authenticate("signup", {
      failureRedirect: "/signup",
      session:false
    }),
    (req, res) => {
      res.json({message:"Registro exitoso"});
    }
  );

  // TEST API
  app.get("/profile", passport.authenticate('jwt',{session:false}), async (req, res) => {
    res.json({message:"Bienvenido a la HOME",
              user:req.user,
            token:req.query.secret_token});
  });


  // WEB SOCKET


  app.get('/chat', (req, res) => {
    res.sendFile( path.join(__dirname , '../webSockets/index.html'));
  })
  
  app.get('/chat/admin', (req, res) => {
    res.sendFile( path.join(__dirname , '../webSockets/indexAdmin.html'));
  })


let messages = "";

async function getMsg(){
    try {
      messages= await messageDAO.getAllMsg()
    } catch (error) {
        console.log("Error:", error);
    }
  }
  
 
  socketServer.on("connection", (socket) => {
    getMsg()
    console.log("Nuevo cliente conectado");
    socketServer.emit("INIT", "Bienvenido al WebSocket", messages);
  
  
    socket.on("POST_MESSAGE", (msg) => {
      messageDAO.saveMsg(msg);
      socketServer.emit("NEW_MESSAGE", msg);
    });
  });

  app.get("*", (req, res) => {
    logger.log(
      "warn",
      `Ruta no encontrada ${req.url} con el metodo ${req.method}`
    );
    res.status(400).send("Ruta no encontrada" + req.url);
  });

  const PORT = 8080;
  httpServer.listen(PORT, () => {
    logger.log("info", `Servidor escuchando puerto ${PORT}`);
  });
}
