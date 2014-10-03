var mongoose = require('mongoose'),
    Adoptee = mongoose.model('Adoptee');

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
    var userId = req.user ? req.user._id : null;
    var update = req.body,
        id = update._id,
        options = { upsert: true },
        userId = req.user ? req.user._id : null;

    if(!id) {
        id = new mongoose.Types.ObjectId();
        update.createDate = new Date();
        update.createUser = userId;
    } else {
        delete update._id;
        update.modifyDate = new Date();
        update.modifyUser = userId;
    }

    update.birthDate = new Date(update.birthDate);
    delete update.__v; //todo:  tried .select('-__v') with error on put  more research required
    Adoptee.
        findByIdAndUpdate(id, update, options).
        populate('createUser', 'firstName lastName').
        populate('modifyUser', 'firstName lastName').
        exec(function(err, adoptee) {
            if(err) { res.status(400); return res.send({error:err.toString()});}
            return res.send({message: "Adoptee successfully updated!"})
        });

    }