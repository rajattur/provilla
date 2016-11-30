var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user.controller');

//Sign up User route
router.post('/signup', userCtrl.signupUser);

module.exports = router;
