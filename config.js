const dotenv = require("dotenv");
dotenv.config({
  path: ".env"
});

const dbType = process.env.DB_TYPE || "mongo"
const uriString = process.env.MONGO_URI_STRING || "mongodb://localhost:27017/ecommerce";

module.exports = {
  dbType,
  uriString
}