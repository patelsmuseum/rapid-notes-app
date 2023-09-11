const nodeMailer = require('../config/nodemailer');
const User  = require('../models/user');
const he = require('he');


exports.newLink = async (link) =>{
    console.log('Inside newLink  mailer ');
    console.log(link);
    var token = link.substring(link.indexOf('password')+9);
    console.log(token);
     user = await User.findOne({resetToken : token});
     email = user.email;
     console.log(email);
    
    let htmlString = nodeMailer.renderTemplate({link:link} , '/mailers.ejs')
    console.log(htmlString);


    nodeMailer.transporter.sendMail({
        from: 'onidakumar86@gmail.com',
        to: email,
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