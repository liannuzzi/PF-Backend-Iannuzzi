const config = require("../config");
const accountSid = config.twilio_sid; 
const authToken = config.twilio_token; 
const client = require('twilio')(accountSid, authToken); 
const config = require("../config");
const adminNum=config.adminNum


async function sendMessageNewOrder(userInfo){
    try{
        const info= await client.messages 
        .create({
            body: `Nueva orden del usuario ${userInfo}`, 
            from:'whatsapp:+14155238886',       
            to:`whatsapp:${adminNum}`   
        })
        console.log(info)
    }catch(err){
        console.log(err)
    }
}



module.exports={sendMessageNewOrder}