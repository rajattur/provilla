var express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user.controller');

//Sign up User route
router.post('/signup', userCtrl.signupUser);

//Sign in User and compares if the password entered matches password in Database. If user exist and password
//matches, user is given a token.
router.post('/signin', userCtrl.signinUser);

module.exports = router;
