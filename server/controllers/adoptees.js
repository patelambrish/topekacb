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
        curAdoptee.middleInitial = adopteeUpdates.middleInitial;
        curAdoptee.birthDate = adopteeUpdates.birthDate;
        curAdoptee.ssnLastFour = adopteeUpdates.ssnLastFour;
        curAdoptee.gender = adopteeUpdates.gender;
        curAdoptee.homeAddress = adopteeUpdates.homeAddress;
        curAdoptee.zip = adopteeUpdates.zip;
        curAdoptee.city = adopteeUpdates.city;
        curAdoptee.homePhone = adopteeUpdates.homePhone;
        curAdoptee.cell1Phone = adopteeUpdates.cell1Phone;
        curAdoptee.cell2Phone = adopteeUpdates.cell2Phone;
        curAdoptee.save(function(err){
            if(err) { res.status(400); return res.send({message:err.toString()});}
            return res.send({message: "Adoptee successfully updated!"})
            });
        })
    }