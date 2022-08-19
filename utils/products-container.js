const fs = require("fs");

class Contenedor {
  constructor(filePath) {
    this.filePath = filePath;
  }

  getAll() {
    return fs.promises
      .readFile(this.filePath, "utf-8")
      .then((productos) => {
        const arrayProductos = JSON.parse(productos);
        return arrayProductos;
      })
      .catch((error) => {
        console.log("No se puede leer archivo", error);
      });
  }

  getById(id) {
    const productos = fs.readFileSync(this.filePath, "utf-8");
    const arrayProductos = JSON.parse(productos);
    const resultadoBusqueda = arrayProductos.find(
      (product) => product.id === parseInt(id)
    );
    if (resultadoBusqueda) {
      return resultadoBusqueda;
    } else {
      const error = { error: "producto no encontrado" };
      return error;
    }
  }

  saveProduct(producto) {
    const data = fs.readFileSync(this.filePath, "utf-8");
    let nuevoProducto = "";
    if (data === "") {
      nuevoProducto = Object.assign(producto, { id: 1 });
      fs.writeFileSync(
        "./files/products.json",
        JSON.stringify([nuevoProducto])
      );
    } else {
      const arrayProductos = JSON.parse(data);
      const maxId = Math.max.apply(
        Math,
        arrayProductos.map((item) => item.id)
      );
      nuevoProducto = Object.assign(producto, { id: maxId + 1 });
      arrayProductos.push(nuevoProducto);
      fs.writeFileSync(
        "./files/products.json",
        JSON.stringify(arrayProductos)
      );
    }
    return nuevoProducto;
  }

  editProduct(producto) {
    const data = fs.readFileSync(this.filePath, "utf-8");
    const arrayProductos = JSON.parse(data);
    const resultadoBusqueda = arrayProductos.find(
      (product) => product.id === parseInt(producto.id)
    );

    if (resultadoBusqueda) {
      const updatedArray = arrayProductos.map((product) =>
        product.id === parseInt(producto.id)
          ? {
              ...product,
              title: producto.title,
              price: producto.price,
              thumbnail: producto.thumbnail,
              createdDateProd:producto.createdDateProd,
              description:producto.description,
              productCode:producto.productCode,
              stock:producto.stock
            }
          : product
      );
      fs.writeFileSync("./files/products.json", JSON.stringify(updatedArray));
      return updatedArray;
    } else {
      const error = { error: "producto no encontrado" };
      return error;
    }
  }

  deleteById(id) {
    const productos = fs.readFileSync(this.filePath, "utf-8");
    const arrayProductos = JSON.parse(productos);
    const buscarID = arrayProductos.find(
      (producto) => producto.id === parseInt(id)
    );

    if (buscarID) {
      const nuevoArray = arrayProductos.filter(
        (producto) => producto.id != parseInt(id)
      );
      fs.writeFileSync(this.filePath, JSON.stringify(nuevoArray));
      const productoEliminado = {
        mensaje: `Se elimino el producto con ID ${id}`,
      };
      return productoEliminado;
    } else {
      const error = { error: "producto no encontrado" };
      return error;
    }
  }
}

module.exports = Contenedor;
