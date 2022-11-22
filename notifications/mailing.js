const config = require("../config");
const adminMail=config.adminMail
const nodemailer=require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'osborne.nader@ethereal.email',
        pass: 'kjSfPrqbkSr3CPdtad'
    }
});

async function sendMailNewUser(userData){
    try{
        const info= await transporter.sendMail({
            to:adminMail,
            from:'osborne.nader@ethereal.email',
            subject:'Nuevo Registro',
            html:userData
        })
        console.log(info)
    }catch(err){
        console.log(err)
    }
}

async function sendMailNewOrder(orderData, userInfo){
    console.log(orderData)
    try{
        const info= await transporter.sendMail({
            to:adminMail,
            from:'osborne.nader@ethereal.email',
            subject:userInfo,
            html:JSON.stringify(orderData)
        })
        console.log(info)
    }catch(err){
        console.log(err)
    }
}

module.exports={sendMailNewUser,sendMailNewOrder}