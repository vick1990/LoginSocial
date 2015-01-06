var bcrypt = require('bcrypt-nodejs'),
	mongoose = require('mongoose'),
	User = mongoose.model('User');
var errores = {
	notFound: 0,
	passwordErronea: 1
};
User.statics.authenticar = function(user, pwd, callback) {
	var db = this;
	db.findOne({
		name: user
	}, function(err, user) {
		if (err)
			return callback(null, err);
		if (!user)
			return callback(null, false, errores.notFound);

		user.checaPassword(pwd, function(err, pwd) {
			if (err)
				return callback(null, err);
			if (!pwd)
				return callback(null, false, errores.passwordErronea);
		});

	});
};

User.methods.checaPassword = function(pwd, callback) {
	bcrypt.compare(pwd, this.password, function(err, corr) {
		if (err)
			return callback(null, err);
		callback(null, corr);
	});
};

module.exports = authenticar;