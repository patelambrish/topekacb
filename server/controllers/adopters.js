var Adopter = require('mongoose').model('Adopter');

exports.getAdopters = function(req, res) {
  Adopter.find({}).exec(function(err, collection) {
    res.send(collection);
  });
};

exports.getAdopterById = function(req, res) {
  Adopter.findOne({_id:req.params.id}).exec(function(err, adopter) {
    res.send(adopter);
  });
};

exports.saveAdopter = function(req, res) {
  delete req.body.__v;

  Adopter.findByIdAndUpdate(req.body._id, req.body, {upsert: true}, function(err, adopter) {
    res.send(adopter);
  });
};