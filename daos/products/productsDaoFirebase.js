const FirebaseContainer = require("../../utils/firebaseContainer");

class ProductDAO extends FirebaseContainer {
  constructor() {
    super('products');
  }
}

const productDAO= new ProductDAO()
module.exports = productDAO