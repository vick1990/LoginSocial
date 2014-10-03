var FacebookStrategy = require('passport-facebook').Strategy,
	//	config = require('../config/config'),
	mongoose = require('mongoose'),
	db = mongoose.model('User');

var facebookConections = function(passport,config) {

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	passport.use(new FacebookStrategy({
		clientID: config.facebook.id,
		clientSecret: config.facebook.secret,
		callbackURL: '/auth/facebook/callback'
	}, function(accessToken, refreshToken, profile, done) {
		db.findOne({
			provider_id: profile.id
		}, function(err, user) {
			if (err) throw err;
			if (!err && user !== null) return done(null, user);

			var User = new db({
				name: profile.displayName,
				provider_id: profile.id,
				provider: profile.provider
				//photo:profile.photos[0].value
			});

			User.save(function(err, doc) {
				if (err) throw err;
				done(null, user);
			});
		});
	}));
};

module.exports = facebookConections;