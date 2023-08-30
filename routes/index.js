const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const home = require('../controllers/homeController')
console.log('router loaded');
router.get('/' , home.home)
router.use('/auth' , require('./auth'));
router.use('/users' , require('./users'));
module.exports = router;

