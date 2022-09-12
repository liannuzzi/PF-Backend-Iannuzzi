const mongoose = require("mongoose");
const config = require("../config");
const uriString = config.uriString;

class MongoContainer {
  constructor(model) {
    this.uriString = uriString;
    this.Model = model;
    if (this.Model) {
      this.collection = this.Model.modelName;
    }
  }

  async connect() {
    try {
      return await mongoose.connect(this.uriString);
    } catch (err) {
      throw new Error(`ERROR DE CONEXION + ${err}`);
    }
  }

  async getAll() {
    try {
      const result = await this.Model.find();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL BUSCAR DATOS: ${err}`);
    }
  }

  async getById(id) {
    const objectId = mongoose.Types.ObjectId(id);
    try {
      const result = await this.Model.find({ _id: objectId });
      return result;
    } catch (err) {
      throw new Error(`ERROR AL BUSCAR ID: ${err}`);
    }
  }

  async saveProduct(object) {
    try {
      const document = new this.Model(object);
      const result = await document.save();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL GUARDAR: ${err}`);
    }
  }

  async editProduct(product, id) {
    const objectId = mongoose.Types.ObjectId(id);
    try {
      const result = await this.Model.updateOne(
        { _id: objectId },
        {
          $set: {
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail,
            createdDateProd: product.createdDateProd,
            description: product.description,
            productCode: product.productCode,
            stock: product.stock,
          },
        }
      );
      return result;
    } catch (err) {
      throw new Error(`ERROR AL EDITAR: ${err}`);
    }
  }

  async deleteById(id) {
    const objectId = mongoose.Types.ObjectId(id);
    try {
      const result = await this.Model.deleteOne({ _id: objectId });
      return result;
    } catch (err) {
      throw new Error(`ERROR AL ELIMINAR: ${err}`);
    }
  }

  async createCart() {
    try {
      const document = new this.Model();
      const result = await document.save();
      return result;
    } catch (err) {
      throw new Error(`ERROR AL GUARDAR: ${err}`);
    }
  }

  async deleteCart(id) {
    const objectId = mongoose.Types.ObjectId(id);
    try {
      const result = await this.Model.deleteOne({ _id: objectId });
      return result;
    } catch (err) {
      throw new Error(`ERROR AL ELIMINAR: ${err}`);
    }
  }

  async getAllCartProducts(id) {
    const objectId = mongoose.Types.ObjectId(id);
    try {
      const result = await this.Model.find(
        { _id: objectId },
        { products: 1, _id: 0 }
      );
      return result;
    } catch (err) {
      throw new Error(`ERROR AL BUSCAR ID: ${err}`);
    }
  }

  async addProductToCart(id, product) {
    const objectId = mongoose.Types.ObjectId(id);
    try {
      const result = await this.Model.updateOne(
        { _id: objectId },
        {
          $push: {
            products: {
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail,
              createdDateProd: product.createdDateProd,
              description: product.description,
              productCode: product.productCode,
              stock: product.stock,
            },
          },
        }
      );
      return result;
    } catch (err) {
      throw new Error(`ERROR AL GUARDAR: ${err}`);
    }
  }

  async deleteProductFromCart(id, idProd) {
    const objectId = mongoose.Types.ObjectId(id);
    const idProdInt = parseInt(idProd);

    try {
      const result = await this.Model.updateOne(
        { _id: objectId },
        { $pull: { products: { productCode: idProdInt } } }
      );
      return result;
    } catch (err) {
      throw new Error(`ERROR AL ELIMINAR: ${err}`);
    }
  }
}

module.exports = MongoContainer;
