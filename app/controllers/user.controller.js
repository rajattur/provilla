var User = require('../models/user.model');
var jsonwebtoken = require('jsonwebtoken');
var config = require('../../config');
//Create Token method.
function createToken(user) {
	var token = jsonwebtoken.sign({
		id : user._id,
		firstName : user.firstName
	}, config.secret, {
		expiresIn: 600
	});
	return token;
}

//SignUp new user method.
var signupUser = function (req, res) {
	var user = new User({
		firstName : req.body.firstName,
		lastName : req.body.lastName,
		email: req.body.email,
		password : req.body.password,
		terms : req.body.terms
	});
	user.save(function (err) {
		if (err) {
			console.log(err);
			res.send(err);
			return;
		}
		res.status(201).json({message: 'User '+ user.firstName+ ' has been created'});
	})
};

//SignIn user, find a user by username and select the password from the database. Checks if the user exist and password matches,
//if match createToken function is called and user is given a token.
var signinUser = function (req, res) {
	User.findOne({
		email: req.body.email
	}).select('password').exec(function (err, user) {
		if (err) {
			res.send(err);
			return;
		}
		if (!user) {
			res.status(401).json({message: "user does not exist"})
		} else if (user) {
			var validPassword = user.comparePassword(req.body.password);

			if (!validPassword) {
				res.status(401).json({message : "Invalid Password"});
			}else {
				var token = createToken(user);
				res.status(200).json({
					success: true,
					message: "Successfuly Login",
					token: token
				});
			}
		}
	})
};

//Checks if the token provided to the user when singing in matches.
var checkJwtUser = function (req, res, next) {
	console.log("entered site");

	var token = req.body.token || req.headers['x-access-token'];

	if (token) {
		jsonwebtoken.verify(token, "provilla", function (err, decoded) {
			if (err) {
				res.status(403).send({success: false, message: "Failed to auth."})
			} else {
				req.decoded = decoded;
				next();
			}

		})
	} else {
		res.status(403).send({success: false, message: "No Token Provided"})
	}

};

//Exports the methods.
module.exports = {
	signupUser: signupUser,
	signinUser: signinUser,
	checkJwtUserToken: checkJwtUser
};