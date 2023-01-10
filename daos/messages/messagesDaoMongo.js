const MongoContainer = require("../../src/database/mongoContainer");
const Message = require("../../schemas/messageSchemaMongo");

class MessageDAO extends MongoContainer {
  constructor(Model) {
    super(Model);
    this.connect().catch(err => {
      throw new Error(`ERROR INICIALIZACION DAO ${err}`)
    });
  }
}

const messageDAO = new MessageDAO(Message);

module.exports = messageDAO;