const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require('../controllers/auth_controller');

// signup routers
router.get('/signup' , authController.signuppage);
router.post('/signup' , authController.signup);

//signin routers
router.get('/signin' , authController.signinpage);
router.post('/create-session' ,passport.authenticate('local' , {failureRedirect: '/users/sign-in'},) ,authController.createSession);

// log out
router.get('/logOut' ,  authController.destroySession);

//forget password
router.get('/forget-password' , authController.forgetPassword);




//mobile otp page render router
router.get('/verify-mobile' ,passport.checkAuthentication, authController.verifyMobile);
router.post("/mobile/sendotp", authController.sendOtp);
router.post('/mobile/verifyotp' , authController.verifyOtp);

module.exports = router;