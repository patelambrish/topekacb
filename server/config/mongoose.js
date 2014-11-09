var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    adopteeModel = require('../models/Adoptee'),
    adopterModel = require('../models/Adopter'),
    stateModel = require('../models/State'),
    messageModel = require('../models/Message'),
    adopteeApplicationCounterModel = require('../models/AdopteeApplicationCounter'),
    printEmailModel = require('../models/PrintEmail.js');

module.exports = function(config) {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('topekaCb db opened');
  });
  console.log("Environment:  " + process.env.NODE_ENV);
  if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'test'){
    userModel.createDefaultUsers();
    stateModel.createStates();
    adopteeModel.createDefaultAdoptees();
    adopterModel.createDefaultAdopters();
    adopteeApplicationCounterModel.initializeAdopteeApplicationCounter();
    messageModel.createMessages();
  }
  adopteeModel.startOrphanedUpdateChecking();
};

