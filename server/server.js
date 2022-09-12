const express = require("express");
const app = express();

// MONGO DB
// let cartDAO = require("../daos/carts/cartsDaoMongo")
// let productDAO = require("../daos/products/productsDaoMongo")

//FIREBASE
let cartDAO = require("../daos/carts/cartsDaoFirebase");
let productDAO = require("../daos/products/productsDaoFirebase");

const { Router } = express;
const routerProduct = Router();
const routerCart = Router();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/products", routerProduct);
app.use("/api/cart", routerCart);

const Contenedor = require("../utils/products-container");
const fileName = "./files/products.json";
const products = new Contenedor(fileName);

const ContainerCart = require("../utils/cart-container");
const cartFileName = "./files/cart.json";
const cart = new ContainerCart(cartFileName);

routerProduct.get("/", async (req, res) => {
  try {
    const allProducts = await productDAO.getAll();
    res.json(allProducts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

routerProduct.get("/:id", async (req, res) => {
  try {
    const resultado = await productDAO.getById(req.params.id);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

routerProduct.post("/", async (req, res) => {
  try {
    const resultado = await productDAO.saveProduct(req.body);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

routerProduct.put("/:id", async (req, res) => {
  try {
    const resultado = await productDAO.editProduct(req.body, req.params.id);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

routerProduct.delete("/:id", async (req, res) => {
  try {
    const resultado = await productDAO.deleteById(req.params.id);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

routerCart.post("/", async (req, res) => {
  try {
    const resultado = await cartDAO.createCart();
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

routerCart.delete("/:id", async (req, res) => {
  try {
    const resultado = await cartDAO.deleteCart(req.params.id);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

routerCart.get("/:id/productos", async (req, res) => {
  try {
    const resultado = await cartDAO.getAllCartProducts(req.params.id);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

routerCart.post("/:id/productos", async (req, res) => {
  try {
    const resultado = await cartDAO.addProductToCart(req.params.id, req.body);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
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
    res.status(400).json({ error: err.message });
  }
});

const PORT = 8080;

const server = app.listen(PORT, () => {
  console.log(`Servidor escuchando puerto ${PORT}`);
});
