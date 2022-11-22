const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    createdDate:{type:Date ,required:true,default: Date.now()},
    products:[{
        title:{type:String,required:true},
        price:{type:Number,required:true},
        thumbnail:{type:String,required:true},
        description:{type:String,required:true},
        productCode:{type:Number,required:true},
        quantity:{type:Number,required:true}
    }]
}, {timestamps: true});

module.exports = mongoose.model("orders", OrderSchema);