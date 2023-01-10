const express = require("express");
const { Router } = express;
const routerCart = Router();
const {
  getCartProducts,
  addNewCart,
  deleteCartById,
  addProductToCart,
  deleteProductFromCart,
  orderConfirmation
} = require("../controllers/cart");

routerCart.get("/:id", getCartProducts);
routerCart.post("/:id", addNewCart);
routerCart.delete("/:id", deleteCartById);
routerCart.post("/:id/addProduct", addProductToCart);
routerCart.delete("/:id/:idProd", deleteProductFromCart);
routerCart.post("/:id/confirmOrder",orderConfirmation);

module.exports = routerCart;
