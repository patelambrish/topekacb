var auth = require('./auth'),
    users = require('../controllers/users'),
    adoptees = require('../controllers/adoptees'),
    adopters = require('../controllers/adopters'),
    states = require('../controllers/states'),
    adopteeApplicationCounter = require('../controllers/adopteeApplicationCounter'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    passport = require('passport');

module.exports = function(app) {

  app.get('/api/users', auth.requiresRole(['admin']), users.getUsers);
  app.post('/api/users', auth.requiresRole(['admin']), users.createUser);
  app.put('/api/users', auth.requiresRole(['admin']), users.updateUser);

  app.get('/api/adoptees', auth.requiresRole(['observer','user','manager']), adoptees.getAdoptees);
  app.get('/api/adoptees/:id', auth.requiresRole(['observer','user','manager']), adoptees.getAdopteeById);
  app.put('/api/adoptees', auth.requiresRole(['user','manager']), adoptees.updateAdoptee);
  app.del('/api/adoptees/:id', auth.requiresRole(['manager']), adoptees.deleteAdoptee);


  app.get('/api/adopters', auth.requiresRole(['observer','user','manager']), adopters.getAdopters);
  app.get('/api/adopters/:id', auth.requiresRole(['observer','user','manager']), adopters.getAdopterById);
  app.get('/api/adopters/:id/enums', auth.requiresRole(['observer','user','manager']), adopters.getEnums);
  app.post('/api/adopters', auth.requiresRole(['user','manager']), adopters.saveAdopter);
  app.del('/api/adopters/:id', auth.requiresRole(['manager']), adopters.deleteAdopter);

  app.get('/api/states', states.getStates);
  
  app.get('/api/adopteeapplicationcounter', adopteeApplicationCounter.getNextSequence);
  
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
    failureRedirect: '/facebook/You are registered. Please contact system administrator!', successRedirect: '/facebook/You have successfully signed in!'
  }));

  app.get('*', function(req, res) {
    var rUser;
    if(req.user) {
      rUser = {
        username: req.user.username,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        id: req.user._id,
        roles: req.user.roles
      };
    }
    res.render('index', {
      bootstrappedUser : rUser
    });
  });
};
