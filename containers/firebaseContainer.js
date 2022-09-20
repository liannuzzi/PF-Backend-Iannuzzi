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
      throw new Error(`ERROR AL BUSCAR DATOS: ${err.message}`);
    }
  }

  async getById(id) {
    if (id) {
      try {
        const doc = this.coleccion.doc(`${id}`);
        const product = await doc.get();
        const result = product.data();
        return result;
      } catch (err) {
        throw new Error(`ERROR AL BUSCAR ID: ${err.message}`);
      }
    } else {
      throw new Error(`Debe ingresar el ID`);
    }
  }

  async saveProduct(object) {
    if (object) {
      try {
        const doc = this.coleccion.doc();
        const result = await doc.create(object);
        return result;
      } catch (err) {
        throw new Error(`ERROR AL GUARDAR: ${err.message}`);
      }
    } else {
      throw new Error(`Debe ingresar el producto`);
    }
  }

  async editProduct(product, id) {
    if (product && id) {
      try {
        const doc = this.coleccion.doc(`${id}`);
        const result = await doc.update(product);
        return result;
      } catch (err) {
        throw new Error(`ERROR AL EDITAR: ${err.message}`);
      }
    } else {
      throw new Error(`Debe ingresar el ID y el producto`);
    }
  }

  async deleteById(id) {
    if (id) {
      try {
        const doc = this.coleccion.doc(`${id}`);
        const result = await doc.delete();
        return result;
      } catch (err) {
        throw new Error(`ERROR AL ELIMINAR: ${err.message}`);
      }
    } else {
      throw new Error(`Debe ingresar el ID`);
    }
  }

  async createCart() {
    const createdAt = admin.firestore.Timestamp.fromDate(new Date());
    try {
      const doc = this.coleccion.doc();
      const result = await doc.create({
        createdDate: createdAt,
        products: [],
      });
      return result;
    } catch (err) {
      throw new Error(`ERROR AL GUARDAR: ${err.message}`);
    }
  }

  async deleteCart(id) {
    if (id) {
      try {
        const doc = this.coleccion.doc(`${id}`);
        const result = await doc.delete();
        return result;
      } catch (err) {
        throw new Error(`ERROR AL ELIMINAR: ${err.message}`);
      }
    } else {
      throw new Error(`Debe indicar el ID`);
    }
  }

  async getAllCartProducts(id) {
    if (id) {
      try {
        const doc = this.coleccion.doc(`${id}`);
        const cart = await doc.get();
        const result = cart.data();
        return result;
      } catch (err) {
        throw new Error(`ERROR AL BUSCAR ID: ${err.message}`);
      }
    } else {
      throw new Error(`Debe indicar el ID y el producto`);
    }
  }

  async addProductToCart(id, product) {
    if (id && product) {
      try {
        const doc = this.coleccion.doc(`${id}`);
        const result = await doc.update({
          products: admin.firestore.FieldValue.arrayUnion(product),
        });
        return result;
      } catch (err) {
        throw new Error(`ERROR AL GUARDAR: ${err.message}`);
      }
    } else {
      throw new Error(`Debe indicar el ID y el producto`);
    }
  }

  async deleteProductFromCart(id, idProd) {
    if (id && product) {
      const idProdInt = parseInt(idProd);
      try {
        const doc = this.coleccion.doc(`${id}`);
        const result = await doc.update({
          products: admin.firestore.FieldValue.arrayRemove(idProdInt),
        });
        return result;
      } catch (err) {
        throw new Error(`ERROR AL ELIMINAR: ${err.message}`);
      }
    } else {
      throw new Error(`Debe indicar el ID y el producto`);
    }
  }
}
module.exports = FirebaseContainer;
