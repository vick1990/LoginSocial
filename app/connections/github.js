var StrategyGithub = require('passport-github').Strategy,
	mongoose = require('mongoose'),
	db = mongoose.model('User');

var LoginTwitter = function(passport,config) {
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	passport.use(new StrategyGithub({
		clientID: config.github.id,
		clientSecret: config.github.secret,
		callbackURL: '/auth/github/callback'

	}, function(accessToken, refreshToken, profile, done) {
		db.findOne({
			provider_id: profile.id
		}, function(err, user) {
			if (err) throw err;
			if (!err && user !== null) return done(null, user);

			var User = new db({
				name: profile.username,
				provider: profile.provider,
				provider_id: profile.id,
				photo: profile._json.avatar_url
			});

			User.save(function(err, user) {
				if (err) throw err;
				done(null, user);
			});
		});
	}));
};

module.exports = LoginTwitter;