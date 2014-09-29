var auth = require('./auth'), users = require('../controllers/users'), adoptees = require('../controllers/adoptees'), adopters = require('../controllers/adopters'), mongoose = require('mongoose'), User = mongoose.model('User'), passport = require('passport');

module.exports = function(app) {

	app.get('/api/users', auth.requiresRole('admin'), users.getUsers);
	app.post('/api/users', users.createUser);
	app.put('/api/users', users.updateUser);

	app.get('/api/adoptees', auth.requiresRole('user'), adoptees.getAdoptees);
	app.get('/api/adoptees/:id', auth.requiresRole('user'), adoptees.getAdopteeById);
    app.put('/api/adoptees', auth.requiresRole('user'), adoptees.updateAdoptee);

	app.get('/api/adopters', auth.requiresRole('user'), adopters.getAdopters);
	app.get('/api/adopters/:id', adopters.getAdopterById);

	app.get('/partials/*', function(req, res) {
		res.render('../../public/app/' + req.params[0]);
	});

	app.post('/login', auth.authenticate);

	app.post('/logout', function(req, res) {
		req.logout();
		res.end();
	});

	app.all('/api/*', function(req, res) {
		res.send(404);
	});

	app.get('/auth/facebook', passport.authenticate('facebook'));

	app.get('/auth/facebook/callback', passport.authenticate('facebook', {
		failureRedirect : '/facebook/You are registered. Please contact system administrator!',
		successRedirect : '/facebook/You have successfully signed in!'
	}));

	app.get('*', function(req, res) {
		var rUser;
		if (req.user) {
			rUser = {
				username : req.user.username,
				firstName : req.user.firstName,
				lastName : req.user.lastName,
				id : req.user._id,
				roles : req.user.roles
			};
		}
		res.render('index', {
			bootstrappedUser : rUser
		});
	});

}
