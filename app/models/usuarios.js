var mongoose = require('mongoose'),
	config = require('../config/config'),
	bcrypt = require('bcrypt-nodejs'),
	Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/' + config.db, function(err, res) {
	if (err) throw err;

	console.log('Conectado a la DB');
});

var userSchema = new Schema({
	name: String,
	password: String,
	provider: String,
	provider_id: {
		type: String,
		unique: true
	},
	email:String,
	photo: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
});

userSchema.statics.authenticar = function(user, pwd, callback) {
	var db = this;
	db.findOne({
		name: user
	}, function(err, user) {
		if (err)
			return callback(err);
		if (!user)
			return callback(null, false, errores.notFound);

		user.checaPassword(pwd, function(err, pwd) {
			debugger;
			if (err)
				return callback(err);
			if (!pwd)
				return callback(null, false, errores.passwordErronea);
		});

	});
};

userSchema.methods.checaPassword = function(pwd, callback) {
	bcrypt.compare(pwd, this.password, function(err, corr) {
		if (err)
			return callback(err);
		callback(null, corr);
	});
};



var User = mongoose.model('User', userSchema);