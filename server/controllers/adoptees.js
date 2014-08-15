var Adoptee = require('mongoose').model('Adoptee');

exports.getAdoptees = function(req, res) {
  Adoptee.find({}).exec(function(err, collection) {
    res.send(collection);
  })
};

exports.getAdopteeById = function(req, res) {
  Adoptee.findOne({_id:req.params.id}).exec(function(err, adoptee) {
    res.send(adoptee);
  })
};