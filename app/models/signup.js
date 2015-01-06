var mongoose = require('mongoose'),
	User = mongoose.model('User');

var newUsuario = function(req, res) {
	debugger;
	var name = req.body.user,
		pwd = req.body.pwd;
	User.findOne({
		name: name
	}, function(err, user) {
		if (err)
			return err
		if (!user) {
			var user = new User({
				provider_id: new Date(),
				name: name,
				password: pwd
			});
			user.save(function(err, doc) {
				if (err) {
					console.error(err);
					return err
				}
				console.log(doc);
				res.redirect('/');
			})

		}
		else
			res.status(200,{msg:"Usuario ya registrado"});
	})
}

module.exports.nuevo = newUsuario;