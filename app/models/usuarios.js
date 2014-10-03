var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/' + 'loginsocial', function(err, res) {
	if (err) throw err;

	console.log('Conectado a la DB');
});

var userSchema = new Schema({
	name: String,
	provider: String,
	provider_id: {
		type: String,
		unique: true
	},
	photo: String,
	createdAt: {
		type: Date,
		default: Date.now
	}
});

var User = mongoose.model('User', userSchema);