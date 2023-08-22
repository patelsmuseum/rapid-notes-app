const User = require('../models/user');

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
    return res.render("signin");
}


//signing in 
module.exports.signin = async function(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    var user = await User.findOne({email: email});
    if (user) {
        console.log(user);
        if (user.password === password) {
            return res.redirect('/users/profile/'+user.id);
        } else {
            // alert user that password is wrong
            console.log("password is wrong");
            return res.redirect("back");
        }
    } else {
        // alert the user that email does not exist, so please signup
        console.log("email does not exist");
        return res.redirect("/auth/signup");
    }
}

//rendering mobile otp page
module.exports.verifyMobile = function(req , res){
    return res.render('verify_mobile');
}

// sending otp its get activated after clicking send otp button so js file is also there in assests for this 

module.exports.sendOtp = async function(req, res) {
    var mobile = req.body.mobileNumber;
    var id = req.body.user_id;
   
    var user = await User.findById(id);
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
