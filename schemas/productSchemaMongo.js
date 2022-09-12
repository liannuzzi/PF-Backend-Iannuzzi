const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    title:{type:String,required:true},
    price:{type:Number,required:true},
    thumbnail:{type:String,required:true},
    stock:{type:Number,required:true},
    createdDateProd:{type:Date ,required:true,default: Date.now()},
    description:{type:String,required:true},
    productCode:{type:Number,required:true}
}, {timestamps: true});

module.exports = mongoose.model("products", ProductSchema);