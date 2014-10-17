var mongoose = require('mongoose'),
    Adoptee = mongoose.model('Adoptee'),
    AdopteeApplicationCounter = mongoose.model('AdopteeApplicationCounter');

exports.getAdoptees = function(req, res) {
    var searchFilters, nameRegex, query, queryName, sortBy, sortDir;
    if(req.query.filter) {
        searchFilters= JSON.parse(req.query.filter);
    }
    query = Adoptee.find({});
    if(searchFilters) {
        if(searchFilters.households) {
            query = query.where('criteria.householdType').in(searchFilters.households);
        }
        if(searchFilters.special && searchFilters.special.length>0) {
            query = query.where('criteria.specialNeeds').in(searchFilters.special);
        }
        if(searchFilters.status) {
            query = query.where('status').equals(searchFilters.status);
        }

    }
    Adoptee.count(query, function(err, count){
        queryCount = count;

        sortBy = "lastName";
        query = query.sort(sortBy);

        if(req.query.start && req.query.limit) {
            query = query.skip(req.query.start).limit(req.query.limit);
        }
        query.
           populate('_createUser', 'firstName lastName').
           populate('_modifyUser', 'firstName lastName').
            exec(function(err, collection) {
                 res.send({data: collection, totalCount: count});
            });
    });
};

exports.getAdopteeById = function(req, res) {
    Adoptee.findOne({_id: req.params.id}).exec(function (err, adoptee) {
        res.send(adoptee);
    })
};

exports.getAggregateSpecialNeeds = function(req, res) {
  Adoptee.count({'criteria.specialNeeds': []}, function(err, count) {
    Adoptee.
      aggregate([{
        $project: { 'criteria.specialNeeds': 1 }
      }, {
        $unwind: '$criteria.specialNeeds'
      }, {
        $group: {
          _id: '$criteria.specialNeeds',
          count: { $sum: 1 }
        }
      }]).
      exec(function(err, collection) {
        res.send([{_id: 'None', count: count}].concat(collection));
      });
  });
};

exports.getAggregateHouseholdTypes = function(req, res){
  Adoptee.aggregate({$group : { _id: "$criteria.householdType", count: {$sum: 1 }}}).exec(function(err,collection){
        res.send(collection);
    });
};

exports.getAggregateAdoptedCounts = function(req, res){
  Adoptee.aggregate({$group : { _id: "$status", count: {$sum: 1 }}}).exec(function(err,collection){
        res.send(collection);
    })
};


exports.updateAdoptee = function(req, res){
      var update = req.body,
          id = update._id,
          options = { upsert: true },
          userId = req.user ? req.user._id : null;
      if(!id) {
          id = new mongoose.Types.ObjectId();
          update.createDate = new Date();
          update._createUser = userId;
      } else {
          delete update._id;
          delete update._createUser;
          update.modifyDate = new Date();
          update._modifyUser = userId;
      }

      delete update.__v;
      Adoptee.
          findByIdAndUpdate(id, update, options).
          populate('_createUser', 'firstName lastName').
          populate('_modifyUser', 'firstName lastName').
          exec(function(err, adoptee) {
              if(err) { res.status(400); return res.send({error:err.toString()});}
              return res.send(adoptee);
      });
};

exports.deleteAdoptee = function(req, res){
    Adoptee.
        findByIdAndRemove(req.params.id).
        exec(function(err, adoptee) {
            if(err) { res.status(400); return res.send({error:err.toString()});}
            return res.send(adoptee);
        });
};

exports.getEnums = function(req, res) {
    res.send(Adoptee.getEnumValues());
};