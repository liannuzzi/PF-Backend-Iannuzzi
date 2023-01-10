const CartService = require("../services/cart");

async function getCartProducts(req, res) {
  const _result = await CartService.getAllCartProducts(req.params.id);
  console.log(req.body);
  res.json(_result);
}

async function addNewCart(req, res) {
  const _result = await CartService.createCart(req.params.id);
  console.log(req.body);
  res.json(_result);
}

async function deleteCartById(req, res) {
  const _result = await CartService.deleteCart(req.params.id);
  console.log(req.body);
  res.json(_result);
}

async function addProductToCart(req, res) {
  const _result = await CartService.addProductToCart(req.params.id,req.body);
  console.log(req.body);
  res.json(_result);
}

async function deleteProductFromCart(req, res) {
  const _result = await CartService.deleteProductFromCart(req.params.id,req.params.idProd);
  console.log(req.body);
  res.json(_result);
}

async function orderConfirmation(req, res) {
  const _result = await CartService.confirmOrderFromCart(req.params.id);
  console.log(req.body);
  res.json(_result);
}

module.exports = {
  getCartProducts,
  addNewCart,
  deleteCartById,
  addProductToCart,
  deleteProductFromCart,
  orderConfirmation
};
