const express = require('express');
const router = express.Router();

const usersController = require('../controllers/users.controller');

router.get('/profile/:id'  , usersController.profile);
module.exports = router;
