const fs = require("fs");

class ContainerCart {
  constructor(filePath) {
    this.filePath = filePath;
  }

  createCart(){
    const data = fs.readFileSync(this.filePath, "utf-8");
    let newCart = "";
    if(data===''){
        newCart=Object.assign({cartId:1,createdDate:Date.now(),products:[]})
        fs.writeFileSync(
            this.filePath,
            JSON.stringify([newCart])
          );
        return newCart.cartId
    }else{
        const carts=JSON.parse(data)
        const maxId = Math.max.apply(
            Math,
            carts.map((cart) => cart.cartId)
          ); 
          newCart=Object.assign({cartId:maxId+1,createdDate:Date.now(),products:[]})
          carts.push(newCart)
          fs.writeFileSync(
            this.filePath,
            JSON.stringify(carts)
          );
          return newCart.cartId
    }
  }

  deleteCart(id){
    const data=fs.readFileSync(this.filePath, "utf-8");
    const carts=JSON.parse(data)
    const searchId=carts.find(
        (cart)=>cart.cartId === parseInt(id)
    )

    if(searchId){
        const newCarts=carts.filter(
            (cart)=>cart.cartId != parseInt(id)
        )
        fs.writeFileSync(this.filePath, JSON.stringify(newCarts));
        const deletedCart={
            message: `Se elimino el carrito con ID ${id}`
        }
        return deletedCart
    }else {
        const error = { error: "producto no encontrado" };
        return error;
  }

}


getAllCartProducts(id){
    const data=fs.readFileSync(this.filePath, "utf-8");
    const carts=JSON.parse(data)
    const searchId=carts.find(
        (cart)=>cart.cartId === parseInt(id)
    )
    if(searchId){
        return searchId.products
    }else{
        const error = { error: "carrito no encontrado" };
        return error;
  }
}

addProductToCart(id,product){
    const data=fs.readFileSync(this.filePath, "utf-8");
    const carts=JSON.parse(data)
    const searchId=carts.find(
        (cart)=>cart.cartId == parseInt(id)
    )
    if(searchId){
       const updatedCart=carts.map((cart)=>
        cart.cartId===searchId.cartId?
            {...cart,products:{...cart.products,product}}
            :
            cart
       )

        fs.writeFileSync(
            this.filePath,
            JSON.stringify(updatedCart)
          );
        return 'Producto agregado con exito'
    }else{
        const error = { error: "carrito no encontrado" };
        return error;
  }
}

deleteProductFromCart(id,productId){
    const data=fs.readFileSync(this.filePath, "utf-8");
    const carts=JSON.parse(data)
    const searchId=carts.filter(
        (cart)=>cart.cartId === parseInt(id)
    )
    const newProductList=searchId[0].products.filter(
        (product)=>product.id!=parseInt(productId)
        
    )

    if(searchId){
        const updatedCart=carts.map((cart)=>
        cart.cartId=== parseInt(id)?
            {...cart,products:newProductList}
            :
            cart
       )
       fs.writeFileSync(
        this.filePath,
        JSON.stringify(updatedCart)
      );
    return 'Producto eliminado con exito'
    }else{
        const error = { error: "carrito no encontrado" };
        return error;
  }
}

}

module.exports = ContainerCart;