const express=require('express')
const app=express()

const { Router }=express
const routerProduct= Router()
const routerCart=Router()

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/products', routerProduct)
app.use('/api/cart', routerCart)


const Contenedor = require('../utils/products-container')
const fileName='./files/products.json'
const products= new Contenedor(fileName)

const ContainerCart = require('../utils/cart-container')
const cartFileName='./files/cart.json'
const cart= new ContainerCart(cartFileName)

let allProducts
products.getAll()
.then(productos=>{
    allProducts=productos
})

routerProduct.get('/',(req,res)=>{
    res.json(allProducts)
})

routerProduct.get('/:id',(req,res)=>{
    const resultado = products.getById(req.params.id)
    res.json(resultado)
})

routerProduct.post('/',(req,res)=>{
    const resultado = products.saveProduct(req.body)
    res.json(resultado)
})

routerProduct.put('/:id', (req,res)=>{
    const resultado= products.editProduct(req.body)
    res.json(resultado)
})


routerProduct.delete('/:id',(req,res)=>{
    const resultado = products.deleteById(req.params.id)
    res.json(resultado)
})

routerCart.post('/',(req,res)=>{
    const resultado=cart.createCart()
    res.json(resultado)
})

routerCart.delete('/:id',(req,res)=>{
    const resultado=cart.deleteCart(req.params.id)
    res.json(resultado)
})

routerCart.get('/:id/productos',(req,res)=>{
    const resultado=cart.getAllCartProducts(req.params.id)
    res.json(resultado)
})

routerCart.post('/:id/productos',(req,res)=>{
    const resultado=cart.addProductToCart(req.params.id,req.body)
    res.json(resultado)
})


routerCart.delete('/:id/productos/:idProd',(req,res)=>{
    const resultado=cart.deleteProductFromCart(req.params.id,req.params.idProd)
    res.json(resultado)
})


const PORT = 8080

const server= app.listen(PORT,()=>{
    console.log(`Servidor escuchando puerto ${PORT}`)
})