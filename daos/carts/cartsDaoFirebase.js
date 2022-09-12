const FirebaseContainer = require("../../utils/firebaseContainer");

class CartDAO extends FirebaseContainer {
  constructor() {
    super('carts');
  }
}

const cartDAO= new CartDAO()
module.exports = cartDAO