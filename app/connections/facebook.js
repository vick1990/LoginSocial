var FacebookStrategy = require('passport-facebook').Strategy,
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
			if (!err && user !== null) {
				//debugger;
				//user = JSON.parse(profile._raw);
				return done(null, user);
			}

			var User = new db({
				name: profile.displayName,
				provider_id: profile.id,
				provider: profile.provider,
				email:profile.emails[0].value,
				photo:"https://graph.facebook.com/" + profile.id + "/picture" + "?width=200&height=200" + "&access_token=" + accessToken
			});	

			User.save(function(err, doc) {
				if (err) throw err;
				//user = JSON.stringify(profile._raw);
				done(null, user);
			});
		});
	}));
};

module.exports = facebookConections;