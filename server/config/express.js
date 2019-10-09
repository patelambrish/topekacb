var express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	mongoose = require('mongoose'),
	MongoStore = require('connect-mongostore')(session),
	compress = require('compression');

module.exports = function(app, config) {
	app.set('views', config.rootPath + '/server/views');
	app.set('view engine', 'jade');
	app.use(compress());
	app.use(logger('dev'));
	app.use(cookieParser());
	app.use(bodyParser());
	app.use(session({
		secret : 'Topeka unicorns',
		saveUninitialized : true,
		resave : true,
		cookie : {
      maxAge : 60 * 60 * 1000,
      secure:true
		},
		rolling : true,
		store : new MongoStore({
			mongooseConnection : mongoose.connections[0],
			collection: 'sessions',
			auto_reconnect: true
		})
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static(config.rootPath + '/public'));
	app.use('*', function(req, res, next) {
		var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
		if (env =='production' && req.headers['x-forwarded-proto'] != 'https') {
			return res.redirect(['https://', req.get('Host'), req.url].join(''));
		} else {
			next();
		}
	});
	mongoose.connection.on('open',function() {		
		app.listen(config.port);
		console.log('Listening on port ' + config.port + '...');
	});
};

