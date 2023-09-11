const express = require('express');
const router = express.Router();
const passport = require('passport');

const authController = require('../controllers/auth_controller');

// signup routers
router.get('/signup' , authController.signuppage);
router.post('/signup' , authController.signup);

//signin routers
router.get('/signin' , authController.signinpage);
router.post('/create-session' ,passport.authenticate('local' , {failureRedirect: '/auth/signin'},) ,authController.createSession);

// log out
router.get('/logOut' ,  authController.destroySession);

//forget password
router.get('/forget-password' , authController.forgetPassword);  // rendering forget password page
router.post('/reset-password' , authController.sendResetMail);   // sends mail for change password
router.get('/reset-password/:token' , authController.resetPassword); // opening page after clicking on mail
router.post('/change-password' , authController.changePassword);






//mobile otp page render router
router.get('/verify-mobile' ,passport.checkAuthentication, authController.verifyMobile);
router.post("/mobile/sendotp",passport.checkAuthentication, authController.sendOtp);
router.post('/mobile/verifyotp' , authController.verifyOtp);

module.exports = router;