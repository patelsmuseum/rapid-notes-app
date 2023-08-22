const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth_controller');

// signup routers
router.get('/signup' , authController.signuppage);
router.post('/signup' , authController.signup);

//signin routers
router.get('/signin' , authController.signinpage);
router.post('/signin' , authController.signin);

//mobile otp page render router
router.get('/verify-mobile' , authController.verifyMobile);
router.post("/mobile/sendotp", authController.sendOtp);
router.post('/mobile/verifyotp' , authController.verifyOtp);

module.exports = router;