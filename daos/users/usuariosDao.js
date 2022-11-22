const MongoContainer = require("../../containers/mongoContainer");
const Usuario = require("../../schemas/usersSchemaMongo");

class UsuarioDao extends MongoContainer {
  constructor(Model) {
    super(Model);
    this.connect().catch(err => {
      throw new Error(`ERROR INICIALIZACION DAO ${err}`)
    });
  }
}

const usuarioDAO = new UsuarioDao(Usuario);

module.exports = usuarioDAO;