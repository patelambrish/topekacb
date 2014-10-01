var mongoose = require('mongoose'),
    Adopter = mongoose.model('Adopter');

exports.getAdopters = function(req, res) {
  Adopter.
    find({}).
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    select('-__v').
    exec(function(err, collection) {
      res.send(collection);
    });
};

exports.getAdopterById = function(req, res) {
  Adopter.
    findById(req.params.id).
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    select('-__v').
    exec(function(err, adopter) {
      res.send(adopter);
    });
};

exports.saveAdopter = function(req, res) {
  var update = req.body,
      id = update._id,
      options = { upsert: true },
      userId = req.user ? req.user._id : null;
      
  if(!id) {
    id = new mongoose.Types.ObjectId();
    update.createDate = new Date();
    update.createdBy = userId;
  } else {
    update.updateDate = new Date();
    update.updatedBy = userId;
  }
  
  Adopter.
    findByIdAndUpdate(id, update, options).
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    select('-__v').
    exec(function(err, adopter) {
      res.send(adopter);
    });
};

exports.getEnums = function(req, res) {
  res.send(Adopter.getEnumValues());
};