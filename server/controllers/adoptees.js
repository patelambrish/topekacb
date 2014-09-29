var Adoptee = require('mongoose').model('Adoptee');

exports.getAdoptees = function(req, res) {
  Adoptee.find({}).exec(function(err, collection) {
    res.send(collection);
  })
};

exports.getAdopteeById = function(req, res) {
    Adoptee.findOne({_id: req.params.id}).exec(function (err, adoptee) {
        res.send(adoptee);
    })
};
exports.updateAdoptee = function(req, res){
    var adopteeUpdates = req.body;
    Adoptee.findOne({_id: adopteeUpdates._id}).exec(function(err, curAdoptee) {
        curAdoptee.firstName = adopteeUpdates.firstName;
        curAdoptee.lastName = adopteeUpdates.lastName;
        curAdoptee.MI = adopteeUpdates.MI;
        curAdoptee.save(function(err){
            if(err) { res.status(400); return res.send({reason:err.toString()});}
            return "success";
            });
        })
    }