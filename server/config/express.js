var newrelic = require('newrelic');

var express = require('express'),
	logger = require('morgan'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	passport = require('passport'),
	mongoose = require('mongoose'),
	MongoStore = require('connect-mongostore')(session);

module.exports = function(app, config) {
	app.set('views', config.rootPath + '/server/views');
	app.set('view engine', 'jade');
	app.use(logger('dev'));
	app.use(cookieParser());
	app.use(bodyParser());
	app.use(session({
		secret : 'Topeka unicorns',
		store : new MongoStore({
			mongooseConnection : mongoose.connection
		}),
		saveUninitialized : true,
		resave : true,
		cookie : {
			maxAge : 60 * 60 * 1000
		},
		rolling : true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(express.static(config.rootPath + '/public'));
	app.locals.newrelic = newrelic;

};
