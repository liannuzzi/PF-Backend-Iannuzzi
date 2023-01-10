const ProductService = require("../services/product");

async function getAllProducts(req, res) {
    const _result= await ProductService.getAllProds()
    res.json(_result)
}

async function getproductById(req, res) {
    const _result= await ProductService.getProd(req.params.id)
    console.log(req.body)
    res.json(_result)
}

async function addNewProduct(req, res) {
    const _result= await ProductService.addProd(req.body)
    console.log(req.body)
    res.json(_result)
}

async function updateProductById(req, res) {
    const _result= await ProductService.editProduct(req.body, req.params.id)
    console.log(req.body)
    res.json(_result)
}

async function deleteProductById(req, res) {
    const _result= await ProductService.deleteProd(req.params.id)
    console.log(req.body)
    res.json(_result)
}

module.exports = {
    getAllProducts,
    getproductById,
    addNewProduct,
    updateProductById,
    deleteProductById
};
