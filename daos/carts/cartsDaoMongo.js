const MongoContainer = require("../../utils/mongoContainer");
const Cart = require("../../schemas/cartSchemaMongo");

class CartDAO extends MongoContainer {
  constructor(Model) {
    super(Model);
    this.connect().catch(err => {
      throw new Error(`ERROR INICIALIZACION DAO ${err}`)
    });
  }
}

const cartDAO = new CartDAO(Cart);

module.exports = cartDAO;
