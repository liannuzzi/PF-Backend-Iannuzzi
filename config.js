const dotenv = require("dotenv");
dotenv.config({
  path: ".env"
});

const dbType = process.env.DB_TYPE || "mongo"
const uriString = process.env.MONGO_URI_STRING || "mongodb+srv://lucasiannu:wxRk2hMHkRguBXdU@cluster0.l96bh3b.mongodb.net/ecommerce?retryWrites=true&w=majority";
const adminMail=process.env.ADMIN_EMAIL || 'iannuzzilucas@hotmail.com'
const adminNum=process.env.ADMIN_NUM || '+5491121727536'
const twilio_sid=TWILIO_SID || 'AC4ddafc0354f04e31f26acf3b71b6a001'
const twilio_token=TWILIO_TOKEN || 'bfd6b36b953add094207288df668a5e8'

module.exports = {
  dbType,
  uriString,
  adminMail,
  adminNum,
  twilio_sid,
  twilio_token
}