const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    useremail:{type:String ,required:true},
    type:{type:String,required:true},
    message:{type:String,required:true}
}, {timestamps: true});

module.exports = mongoose.model("messages", MessageSchema);