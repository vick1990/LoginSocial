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
	app = express();

var conf = require('./app/config/config');

require('./app/models/usuarios');
require('./app/connections/facebook')(passport,conf);
require('./app/connections/github')(passport,conf);


app.set('port', process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'public/views'));
app.set('view engine', 'jade');
app.use(logger('dev'));


//app.use(favicon());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(methodOverride());
// Ruta de los archivos estáticos (HTML estáticos, JS, CSS,...)
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'myllavesecreta',
	resave: true,
	saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
//app.use( app.Router );

// Si estoy en local, le indicamos que maneje los errores
// y nos muestre un log más detallado
if ('development' == app.get('env')) {
	app.use(errorHandler());
}
app.get('/', routes.index);
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/',
	failureRedirect: '/login'
}));

app.get('/auth/github/callback', passport.authenticate('github', {
		failureRedirect: '/login'
	}),
	function(req, res) {
		// Successful authentication, redirect home.
		res.redirect('/');
	});

app.get('/logout', function(req, res) {
	req.session.destroy();
	res.redirect('/');
});
app.listen(3000, function() {
	console.log('Servidor Corriendo');
});