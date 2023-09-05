const nodeMailer = require('../config/nodemailer');
const User  = require('../models/user');
const he = require('he');


exports.newLink = (link) =>{
    console.log('Inside newLink  mailer ');
    console.log(link);
    
    let htmlString = nodeMailer.renderTemplate({link:link} , '/mailers.ejs')
    console.log(htmlString);


    nodeMailer.transporter.sendMail({
        from: 'onidakumar86@gmail.com',
        to: 'pankajpurshotam@gmail.com',
        subject: "Rest link",
        // html: '<h1>Yup your comment is Published </h1>'
        html: htmlString
    }, (err , info) =>{
        if(err){
            console.log('Error in sendig the mail' , err);
            return;
        }

        console.log('Mail is sent' , info);
        return;
    });
}