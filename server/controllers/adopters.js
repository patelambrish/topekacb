var mongoose = require('mongoose'),
    Adopter = mongoose.model('Adopter');

exports.getAdopters = function(req, res) {
  Adopter.
    find({}).
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    select('-__v').
    exec(function(err, collection, next) {
      if(err) {
        console.log(err);
        return next(err);
      }
      res.send(collection);
    });
};

exports.getAdopterById = function(req, res) {
  Adopter.
    findById(req.params.id).
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    select('-__v').
    exec(function(err, adopter, next) {
      if(err) {
        console.log(err);
        return next(err);
      }
      res.send(adopter);
    });
};

exports.saveAdopter = function(req, res) {
  var data = req.body,
      id = data._id,
      options = { upsert: true },
      userId = req.user ? req.user._id : null;
      
  if(!id) {
    id = new mongoose.Types.ObjectId();
    data.createDate = new Date();
    data.createdBy = userId;
  } else {
    delete data.createDate;
    delete data.createdBy;
    data.updateDate = new Date();
    data.updatedBy = userId;
  }
  
  Adopter.
    findByIdAndUpdate(id, data, options).
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    select('-__v').
    exec(function(err, adopter, next) {
      if(err) {
        console.log(err);
        return next(err);
      }
      res.send(adopter);
    });
};

exports.deleteAdopter = function(req, res) {
  Adopter.
    findByIdAndRemove(req.params.id).
    exec(function(err, adopter, next) {
      if(err) {
        console.log(err);
        return next(err);
      }
      res.send(adopter);
    });
};

exports.getEnums = function(req, res) {
  res.send(Adopter.getEnumValues());
};