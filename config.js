const dotenv = require("dotenv");
dotenv.config({
  path: ".env"
});

const dbType = process.env.DB_TYPE || "mongo"
const uriString = process.env.MONGO_URI_STRING || "mongodb+srv://lucasiannu:wxRk2hMHkRguBXdU@cluster0.l96bh3b.mongodb.net/ecommerce?retryWrites=true&w=majority";
const uriStringDev = process.env.MONGO_URI_STRING_DEV || "mongodb+srv://lucasiannu:wxRk2hMHkRguBXdU@cluster0.l96bh3b.mongodb.net/ecommerceDev?retryWrites=true&w=majority";
const adminMail=process.env.ADMIN_EMAIL || 'iannuzzilucas@hotmail.com'
const enviroment=process.env.NODE_ENV || 'PROD'


module.exports = {
  dbType,
  uriString,
  adminMail,
  enviroment,
  uriStringDev}