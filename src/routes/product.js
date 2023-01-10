const express = require("express");
const { Router } = express;
const routerProduct = Router();
const {getAllProducts,
    getproductById,
    addNewProduct,
    updateProductById,
    deleteProductById
    } = require('../controllers/product')

routerProduct.get("/", getAllProducts);
routerProduct.get("/:id", getproductById);
routerProduct.post("/", addNewProduct);
routerProduct.put("/:id", updateProductById);
routerProduct.delete("/:id", deleteProductById);

module.exports=routerProduct  