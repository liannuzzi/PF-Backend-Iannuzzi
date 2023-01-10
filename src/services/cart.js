const cartDao = require("../../daos/carts/cartsDaoMongo");
const logger = require("../../logger/logger_config")
const {sendMailNewOrder} = require("../../notifications/mailing");
const orderDAO = require("../../daos/orders/ordersDaoMongo");

class CartService {
  static async getAllCartProducts(id) {
    try {
      const result = await cartDao.getAllCartProducts(id);

      return result;
    } catch (error) {
        logger.log("error", `Error: ${error}`);
    }
  }

  static async createCart(id) {
    try {
      const result = await cartDao.createCart(id);
      return result;
    } catch (error) {
        logger.log("error", `Error: ${error}`);
    }
  }

  static async deleteCart(id) {
    try {
      const result = await cartDao.deleteCart(id);
      return result;
    } catch (error) {
        logger.log("error", `Error: ${error}`);
    }
  }

  static async addProductToCart(id,product) {
    try {
      const result = await cartDao.addProductToCart(id,product);
      return result;
    } catch (error) {
        logger.log("error", `Error: ${error}`);
    }
  }

  static async deleteProductFromCart(id,prodId) {
    try {
      const result = await cartDao.deleteProductFromCart(id,prodId);
      return result;
    } catch (error) {
        logger.log("error", `Error: ${error}`);
    }   
  }

  static async confirmOrderFromCart(id) {
    try {
      const result = await cartDao.getAllCartProducts(id);
      const user= await cartDao.getUserFromCart(id)
      const userId=user[0].user
      if (result[0].products) {
        const cartProducts = result[0].products;
        const resultado = await orderDAO.createOrder(cartProducts,userId);

        sendMailNewOrder(result[0].products);
        return resultado
      } else {
        logger.log("warn", `Agregue productos al carrito`);
      }
    } catch (err) {
      logger.log("error", `Error: ${err}`);
    }
  }
}

module.exports = CartService;
