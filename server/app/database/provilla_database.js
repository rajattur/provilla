var mongoose = require('mongoose');
var config = require('../../config');


var openConnection = function () {
	mongoose.connect(config.database);
	mongoose.connection.on('connected', function () {
		console.log("Connected to ProVilla Database");
	});
	mongoose.connection.on('disconnected', function () {
		console.log("Disconnected")
	});
	mongoose.connection.on('error', function (err) {
		console.log("Connection error: " + err)
	})
};


module.exports = {
	openDataBaseConnection: openConnection
};