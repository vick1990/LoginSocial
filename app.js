var express = require('express'),
	passport = require('passport'),
	cookieParser = require('cookie-parser'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	session = require('express-session'),
	routes = require('./app/routes/router'),
	path = require('path'),
	favicon = require('serve-favicon'),
	logger = require('morgan'),
	errorHandler = require('errorhandler'),
	flash = require('connect-flash'),
	app = express();

var conf = require('./app/config/config');

require('./app/models/usuarios');
require('./app/connections/facebook')(passport, conf);
require('./app/connections/github')(passport, conf);
require('./app/connections/local')(passport, conf);
var usuarios = require('./app/models/signup');

app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');
app.use(logger('dev'));


//app.use(favicon());
app.use(flash());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(methodOverride());

app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'myllavesecreta',
	resave: true,
	saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
//app.enable( "jsonp callback");
//app.use( app.Router );

// Si estoy en local, le indicamos que maneje los errores
// y nos muestre un log más detallado
if ('development' == app.get('env')) {
	app.use(errorHandler());
}

app.get('/', routes.index);

app.get('/auth/facebook', passport.authenticate('facebook', {
	display: 'page',
	scope: ['email'],
	profileFields: ['photos', 'birthday'],
}), function(req, res) {
	debugger;
});

app.get('/auth/github', passport.authenticate('github'));


app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	failureRedirect: '/login'
}), function(req, res) {
	//res.contentType('application/json');
	//res.contentType('text/html');
	req.session.usuario = req.user.name;
	//	res.send('callback(' + JSON.stringify(req.session.passport.user) + ')');
	res.redirect('/');
});


app.get('/auth/github/callback', passport.authenticate('github', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		debugger;
		req.session.usuario = req.user.name;
		console.log(req.session.passport.user);
		res.redirect('/');
	});


app.get('/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
});

app.post('/login', loginPost);
app.post('/usuarios', usuarios.nuevo);

app.listen(3000, function() {
	console.log('Servidor Corriendo');
});
app.get('/activo', function(req, res) {
	debugger;
	res.end('Usuario activo : ' + req.session.usuario);
});

function loginPost() {
	passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/error'
	});
}