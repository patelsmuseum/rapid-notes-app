const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure:false,
    auth:{
        user:'19001009042@jcboseust.ac.in',
        pass:'ymca@2000'
    }
});

let renderTemplate = (data , relativePath) => {
    let mailHTML ;
    ejs.renderFile(
        path.join(__dirname , '../views' , relativePath),
        data,
        function(err , template){
            if(err){
                console.log('error in rendering template', err);
                return;
            }

            mailHTML = template;
        }

    )
    return mailHTML;
}

module.exports ={
    transporter: transporter,
    renderTemplate: renderTemplate
}