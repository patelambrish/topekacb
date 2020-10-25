var express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	mongoose = require('mongoose'),
	MongoStore = require('connect-mongo')(session),
	compress = require('compression');
	path = require('path');

module.exports = function(app, config) {
	app.set('views', path.join(config.rootPath, 'server/views'));
	app.set('view engine', 'pug');
	app.use(compress());
  	app.use(logger('dev'));
  	app.use(express.static(config.rootPath + '/public'));
	app.use(cookieParser());
	app.use(bodyParser());
	app.use(session({
		secret : 'Topeka unicorns',
		saveUninitialized : false,
		resave : true,
		cookie : {
      		maxAge : 60 * 60 * 1000,
      		httpOnly: true
		},
		rolling : true,
		store: new MongoStore({ url: config.db })
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	
	app.use('*', function(req, res, next) {
		var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
		if (env =='production' && req.headers['x-forwarded-proto'] != 'https') {
			return res.redirect(['https://', req.get('Host'), req.url].join(''));
		} else {
			next();
		}
	});
	app.listen(config.port);
	console.log('Listening on port ' + config.port + '...');
	/*db.once('open',function() {		
		app.listen(config.port);
		console.log('Listening on port ' + config.port + '...');
	});*/
	/*mongoose.connection.on('connected',function() {		
		app.listen(config.port);
		console.log('Listening on port ' + config.port + '...');
	});*/
};

