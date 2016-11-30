var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var PropertyProfileSchema = new Schema({
	propertyName: {
		type: String,
		required: true
	},
	entityType: {}

});

var UserSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	email: {
		type: String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true,
		select: false
	},
	terms: {
		type: Boolean,
		default: false
	},

});

//Before save hash password.
UserSchema.pre('save', function (next) {
	var user = this;
	if (!user.isModified('password')) return next();

	bcrypt.hash(user.password,null,null, function (err, hash) {
		if (err) {
			return next(err)
		}
		user.password = hash;
		next();
	})
});

//Compare password helper method. Checks to see if password entered matches password in database.
UserSchema.methods.comparePassword = function (password) {
	var user = this;

	return bcrypt.compareSync(password, user.password)
};

//Export UserSchema.
module.exports = mongoose.model('User', UserSchema);