const User = require('../models/user');
const crypto = require('crypto');

const linkMailer = require('../mailers/forget_mailes');

// const FAST2SMS_KEY = "mbS0YIiTlqU6Mg2uVBPReK1pfXscE4zydCnHGDANt3FxJ5avw7p5sj37byPh2CakTDOxd0mZuwI4ertJ";
const FAST2SMS_KEY = "bh45nmQSfGAWiX8Nv6ZJHRkpFD0tE37qTPsVCzMlgY2BIdyex9mSQfCvGbs6U9pEXKiY4Rq0BjzWd2oZ"; // from lec

var unirest = require("unirest");

// signup page
module.exports.signuppage = function(req, res) {
    return res.render('signup');
}


//detecting number in password
function hasNumbers(str) {
    let string1 = String(str);
    for (let i in string1) {
      if (!isNaN(string1.charAt(i)) && !(string1.charAt(i) === " ")) {
        return true;
      }
    }
    return false;
}  

//checking password strength
function checkPasswordStrength(password) {
    if (password.length < 3) {
        return {"success": false, "message": "password is too small"};
    } else if (password.length > 15) {
        return {"success": false, "message": "password is too big"};
    } else if (hasNumbers(password)==false) {
        return {"success": false, "message": "password should contain atleast a digit"};
    } else {
        return {"success": true, "message": ""}
    }
}

//signinig up 

module.exports.signup = async function(req, res) {
    console.log(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var confirm_password = req.body.confirm_password;
    try {
       
        if (password!==confirm_password) {
            // alert user that passwords don't match
            console.log("passwords don't match");
            return res.redirect('back');
        } else {
            if (checkPasswordStrength(password).success) {
                // add the user's data to the database
                var user = await User.findOne({email: email});
                if (user) {
                    // alert user that his/her email already exists
                    console.log("Email already exists");
                    return res.redirect("/auth/signin");
                } else {
                    var user = await User.create({name: name, email: email, password: password});
                    console.log(user);
                    return res.redirect('/auth/signin');
                }
            } else {
                // alert user regarding the password
                console.log(checkPasswordStrength(password).message);
            }
        }
    } catch(err) {
        console.log(err);
        return res.redirect('back');
    }
    return res.redirect('back');
}


// sign in page rendering
module.exports.signinpage = function(req, res) {
    if(req.isAuthenticated()){                    //restricting this page once logged in
        return res.redirect('/auth/verify-mobile');
    }
    return res.render("signin");

}


//signing in 
// module.exports.signin = async function(req, res) {
    
//     var email = req.body.email;
//     var password = req.body.password;
//     var user = await User.findOne({email: email});
//     if (user) {
//         console.log(user);
//         if (user.password === password) {
//             return res.redirect('/users/profile/'+user.id);
//         } else {
//             // alert user that password is wrong
//             console.log("password is wrong");
//             return res.redirect("back");
//         }
//     } else {
//         // alert the user that email does not exist, so please signup
//         console.log("email does not exist");
//         return res.redirect("/auth/signup");
//     }
// }

module.exports.createSession = function(req,res){
    
    return res.redirect('/');
}


module.exports.destroySession = function(req , res){
    req.logout(function(err){
      if(err){
        // req.flash('error' , 'failed in logging out');
        console.log('error in logged out successfully');
      }
      
    //   req.flash('success' , 'Logged out succesfully');
    console.log('logged out successfully')
      return res.redirect('/');
  
    });
  
    
}

//rendering mobile otp page
module.exports.verifyMobile = function(req , res){
    return res.render('verify_mobile');
}

// sending otp its get activated after clicking send otp button so js file is also there in assests for this 

module.exports.sendOtp = async function(req, res) {
    // console.log(req.body);
    var mobile = req.body.mobileNumber;
    var id = req.body.user_id;
   
    var user = await User.findById(id);
    console.log(user);
    user.mobile_verified = false;
    console.log(mobile);
    var req = unirest("GET", "https://www.fast2sms.com/dev/bulkV2");
    var OTP = Math.floor(1000 + Math.random() * 9000);
    req.query({
    "authorization": FAST2SMS_KEY,
    "variables_values": OTP,
    "route": "otp",
    "numbers": mobile
    });
    req.headers({
        "cache-control": "no-cache"
    });
    req.end(async function (res) {
        if (res.error) throw new Error(res.error);
        console.log(res.body);
        user.mobile_otp = OTP;
        user.mobile = mobile;
        await user.save();
        setTimeout(async function() {
            var updated_user = await User.findOne({mobile: user.mobile});
            updated_user.mobile_otp = undefined;
            if (updated_user.mobile_verified==false) {
                console.log("mobile verified is false");
                updated_user.mobile = undefined;
            }
            await updated_user.save();
        }, 30*1000);
    });
}

module.exports.verifyOtp = async function(req, res) {
    var OTP = req.body.otp;
    var id = req.body.user_id;
    var user = await User.findById(id);
    console.log(OTP+" "+user.mobile_otp);
    if (user.mobile_otp && OTP==user.mobile_otp) {
        user.mobile_verified = true;
        await user.save();
        console.log("mobile is verified");
        return res.redirect('/users/profile/'+user.id);
    } else {
        user.mobile = undefined;
        await user.save();
        return res.redirect("back");
    }
}


// forget password
module.exports.forgetPassword = function(req , res){
    return res.render('forgetPassword');
}



module.exports.sendResetMail = async function (req, res) {
    try {
      console.log(req.body);
      const email = req.body.email;
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ message: 'User Not Found' });
      }
  
      console.log(user.name);
  
      const resetToken = crypto.randomBytes(20).toString('hex');
      user.resetToken = resetToken;
      await user.save();
  
      console.log(user.resetToken);
  
      const resetLink = `http://localhost:8000/auth/reset-password/${resetToken}`;
      console.log(resetLink);
  
      // Assuming linkMailer.newLink is an asynchronous function, you can use await
      await linkMailer.newLink(resetLink);
      user.passwordEditInitiation = new Date();
      await user.save();
      return res.redirect('/');
    } catch (error) {
      console.error('Error in sendResetMail:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.resetPassword = async function(req , res){
    const token = req.params.token;
    const user = await User.findOne({resetToken: token});

    if(!user){
        return res.status(400).json({message: 'Inavlid Token'});
    }
    console.log(user);
    console.log('You can change your password');
    
    return res.render('resetPassword', {
        userId : user.id,
    });

}

module.exports.changePassword = async  function(req , res){
    
    let userId = req.query.userId;
    let password = req.body.password;
    let confirm = req.body.confirm;
    let user = await User.findById(userId);
    if(user){
        var currentDate = new Date();
        var initiationDate = user.passwordEditInitiation;
        var difference = currentDate.getMinutes() - initiationDate.getMinutes();
        if(password == confirm && difference < 2){
            user.password = password;
            await user.save();
            return res.redirect('/auth/signin');
        }
    }else{
        console.log('user doesnot exists ');
        return res.redirect('/');
    }
    
}