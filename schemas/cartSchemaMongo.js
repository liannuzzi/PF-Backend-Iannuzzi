const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
    createdDate:{type:Date ,required:true,default: Date.now()},
    products:{type:Array,required:true,default:[]},
    user:{type:String,required:true}
}, {timestamps: true});

module.exports = mongoose.model("carts", CartSchema);