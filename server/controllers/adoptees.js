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
    var userId = req.user ? req.user._id : null;
    Adoptee.findOne({_id: adopteeUpdates._id}).exec(function(err, curAdoptee) {
        curAdoptee.firstName = adopteeUpdates.firstName;
        curAdoptee.lastName = adopteeUpdates.lastName;
        curAdoptee.middleInitial = adopteeUpdates.middleInitial;
        curAdoptee.birthDate = adopteeUpdates.birthDate;
        curAdoptee.ssnLastFour = adopteeUpdates.ssnLastFour;
        curAdoptee.gender = adopteeUpdates.gender;
        curAdoptee.address = adopteeUpdates.address;
        curAdoptee.homePhone = adopteeUpdates.homePhone;
        curAdoptee.cell1Phone = adopteeUpdates.cell1Phone;
        curAdoptee.cell2Phone = adopteeUpdates.cell2Phone;
        curAdoptee.email = adopteeUpdates.fax;
        curAdoptee.status = adopteeUpdates.status;
        curAdoptee.applicationNumber = adopteeUpdates.applicationNumber;
        curAdoptee.language = adopteeUpdates.language;
        curAdoptee.englishSpeaker = adopteeUpdates.englishSpeaker;
        curAdoptee.isDisabled = adopteeUpdates.isDisabled;
        curAdoptee.isHomebound = adopteeUpdates.isHomebound;
        curAdoptee.isSenior = adopteeUpdates.isSenior;
        curAdoptee.isVeteran = adopteeUpdates.isVeteran;
        curAdoptee.isDiabetic = adopteeUpdates.isAllergic;
        curAdoptee.reactionFoods = adopteeUpdates.reactionFoods;
        curAdoptee.story = adopteeUpdates.story;
        curAdoptee.volunteerComment = adopteeUpdates.volunteerComment;
        curAdoptee.internalComment = adopteeUpdates.internalComment;
        if(! curAdoptee._id) {
            curAdoptee.createDate = new Date();
            curAdoptee.createdBy = userId;
        } else {
            curAdoptee.modifiedDate = new Date();
            curAdoptee.modifiedBy = userId;
        }
        curAdoptee.save(function(err){
            if(err) { res.status(400); return res.send({message:err.toString()});}
            return res.send({message: "Adoptee successfully updated!"})
            });
        })
    }