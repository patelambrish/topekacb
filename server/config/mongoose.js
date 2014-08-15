var mongoose = require('mongoose'),
    userModel = require('../models/User'),
    adopteeModel = require('../models/Adoptee');

module.exports = function(config) {
  mongoose.connect(config.db);
  var db = mongoose.connection;
  db.on('error', console.error.bind(console, 'connection error...'));
  db.once('open', function callback() {
    console.log('topekaCb db opened');
  });

  userModel.createDefaultUsers();
  adopteeModel.createDefaultAdoptees();

};

