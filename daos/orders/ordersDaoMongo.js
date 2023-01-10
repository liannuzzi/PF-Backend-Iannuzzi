const MongoContainer = require("../../src/database/mongoContainer");
const Order = require("../../schemas/orderSchemaMongo");

class OrderDAO extends MongoContainer {
  constructor(Model) {
    super(Model);
    this.connect().catch(err => {
      throw new Error(`ERROR INICIALIZACION DAO ${err}`)
    });
  }
}

const orderDAO = new OrderDAO(Order);

module.exports = orderDAO;