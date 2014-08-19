var Adopter = require('mongoose').model('Adopter');

exports.getAdopters = function(req, res) {
    Adopter.find({}).exec(function(err, collection) {
        res.send(collection);
    })
};

exports.getAdopterById = function(req, res) {
    Adopter.findOne({_id:req.params.id}).exec(function(err, Adopter) {
        res.send(Adopter);
    })
};