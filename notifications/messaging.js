const accountSid = 'AC4ddafc0354f04e31f26acf3b71b6a001'; 
const authToken = 'bfd6b36b953add094207288df668a5e8'; 
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