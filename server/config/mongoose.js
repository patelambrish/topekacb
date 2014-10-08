var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    adopteeModel = require('../models/Adoptee'),
    adopterModel = require('../models/Adopter'),
    stateModel = require('../models/State');
    adopteeApplicationCounterModel = require('../models/AdopteeApplicationCounter');

module.exports = function(config) {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('topekaCb db opened');
  });
  userModel.createDefaultUsers();
  stateModel.createStates();
  adopteeModel.createDefaultAdoptees();
  adopterModel.createDefaultAdopters();
  adopteeApplicationCounterModel.initializeAdopteeApplicationCounter();
};

