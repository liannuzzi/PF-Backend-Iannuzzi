const dotenv = require("dotenv");
dotenv.config({
  path: ".env"
});

const dbType = process.env.DB_TYPE || "mongo"
const uriString = process.env.MONGO_URI_STRING || "mongodb+srv://lucasiannu:wxRk2hMHkRguBXdU@cluster0.l96bh3b.mongodb.net/ecommerce?retryWrites=true&w=majority";
const adminMail=process.env.ADMIN_EMAIL || 'iannuzzilucas@hotmail.com'
const adminNum=process.env.ADMIN_NUM || '+5491121727536'

module.exports = {
  dbType,
  uriString,
  adminMail,
  adminNum
}