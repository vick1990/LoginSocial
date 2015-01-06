var localStrategy = require('passport-local').Strategy,
	mongoose = require('mongoose'),
	auth = require('../models/usuarios');

var localConnection = function(passport, config) {
	console.log('Cargado el login Local');
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	passport.use('local-login',new localStrategy({
		usernameField:"name",
		passwordField:"password"

	}, function(user, pwd, done) {
		auth.authenticar(user,pwd,function(err,doc) {
			if(err)
				return done(null,err)
			done(null,doc);
		})
	}));
}

module.exports = localConnection;