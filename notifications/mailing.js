const config = require("../config");
const adminMail=config.adminMail
const nodemailer=require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lilly.kirlin@ethereal.email',
        pass: 'AWY9bbGskGJM5R8yzV'
    }
});

async function sendMailNewUser(userData){
    try{
        const info= await transporter.sendMail({
            to:adminMail,
            from:'lilly.kirlin@ethereal.email',
            subject:'Nuevo Registro',
            html:userData
        })
        console.log(info)
    }catch(err){
        console.log(err)
    }
}

async function sendMailNewOrder(orderData){
    console.log(orderData)
    try{
        const info= await transporter.sendMail({
            to:adminMail,
            from:'lilly.kirlin@ethereal.email',
            subject:'Nueva orden ingresada!',
            html:JSON.stringify(orderData)
        })
        console.log(info)
    }catch(err){
        console.log(err)
    }
}

module.exports={sendMailNewUser,sendMailNewOrder}