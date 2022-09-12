const MongoContainer = require("../../utils/mongoContainer");
const Product = require("../../schemas/productSchemaMongo");

class ProductDAO extends MongoContainer {
  constructor(Model) {
    super(Model);
    this.connect().catch(err => {
      throw new Error(`ERROR INICIALIZACION DAO ${err}`)
    });
  }
}

const productDAO = new ProductDAO(Product);

module.exports = productDAO;
