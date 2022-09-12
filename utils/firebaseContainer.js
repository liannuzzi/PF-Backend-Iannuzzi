const admin = require("firebase-admin");
const serviceAccount = require("../firebaseDb/e-commerce-3ecb4-firebase-adminsdk-ngh2s-e45c1ae675.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

class FirebaseContainer {
  constructor(coleccionName) {
    this.coleccion = db.collection(coleccionName);
  }

  async getAll() {
    try {
      const querySnapshot = await this.coleccion.get();
      const docs = querySnapshot.docs;

      const result = docs.map((doc) => ({
        id: doc.id,
        createdDateProd: doc.data().createdDateProd,
        description: doc.data().description,
        price: doc.data().price,
        productCode: doc.data().productCode,
        stock: doc.data().stock,
        thumbnail: doc.data().thumbnail,
        title: doc.data().title,
      }));
      return result;
    } catch (err) {
      throw new Error(`ERROR AL BUSCAR DATOS: ${err}`);
    }
  }

  async getById(id) {
    try {
      const doc = this.coleccion.doc(`${id}`);
      const product = await doc.get();
      const result = product.data();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL BUSCAR ID: ${err}`);
    }
  }

  async saveProduct(object) {
    try {
      const doc = this.coleccion.doc();
      const result = await doc.create(object);
      return result;
    } catch (err) {
      throw new Error(`ERROR AL GUARDAR: ${err}`);
    }
  }

  async editProduct(product, id) {
    try {
      const doc = this.coleccion.doc(`${id}`);
      const result = await doc.update(product);
      return result;
    } catch (err) {
      throw new Error(`ERROR AL EDITAR: ${err}`);
    }
  }

  async deleteById(id) {
    try {
      const doc = this.coleccion.doc(`${id}`);
      const result = await doc.delete();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL ELIMINAR: ${err}`);
    }
  }

  async createCart() {
    try {
      const doc = this.coleccion.doc();
      const result = await doc.create({
        createdDate: Date.now(),
        products: [],
      });
      return result;
    } catch (err) {
      throw new Error(`ERROR AL GUARDAR: ${err}`);
    }
  }

  async deleteCart(id) {
    try {
      const doc = this.coleccion.doc(`${id}`);
      const result = await doc.delete();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL ELIMINAR: ${err}`);
    }
  }

  async getAllCartProducts(id) {
    try {
      const doc = this.coleccion.doc(`${id}`);
      const cart = await doc.get();
      const result = cart.data();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL BUSCAR ID: ${err}`);
    }
  }

  async addProductToCart(id, product) {
    try {
      const doc = this.coleccion.doc(`${id}`);
      const result = await doc.update({
        products: admin.firestore.FieldValue.arrayUnion(product),
      });
      return result;
    } catch (err) {
      throw new Error(`ERROR AL GUARDAR: ${err}`);
    }
  }

  async deleteProductFromCart(id, idProd) {
    const idProdInt = parseInt(idProd);
    try {
      const doc = this.coleccion.doc(`${id}`);
      const result = await doc.update({
        products: admin.firestore.FieldValue.arrayRemove(idProdInt),
      });
      return result;
    } catch (err) {
      throw new Error(`ERROR AL ELIMINAR: ${err}`);
    }
  }
}

module.exports = FirebaseContainer;
