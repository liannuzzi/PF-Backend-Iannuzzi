const productDAO = require("../../daos/products/productsDaoMongo");
const logger = require("../../logger/logger_config")


class ProductService {

  static async getAllProds() {
    try {
      const result = await productDAO.getAll();
      return result;
    } catch (error) {
      logger.log("error", `Error: ${error}`);
    }
  }

  static async getProd(id) {
    try {
      const result = await productDAO.getById(id);
      return result;
    } catch (error) {
      logger.log("error", `Error: ${error}`);
    }
  }

  static async addProd(product) {
    try {
      const result = await productDAO.saveProduct(product);
      return result;
    } catch (error) {
      logger.log("error", `Error: ${error}`);
    }
  }

  static async editProduct(product,id) {
    try {
      const result = await productDAO.editProduct(product,id);
      return result;
    } catch (error) {
      logger.log("error", `Error: ${error}`);
    }
  }

  static async deleteProd(id) {
    try {
      const result = await productDAO.deleteById(id);
      return result;
    } catch (error) {
      logger.log("error", `Error: ${error}`);
    }
  }

}

module.exports = ProductService;