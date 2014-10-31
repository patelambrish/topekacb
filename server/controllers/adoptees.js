var mongoose = require('mongoose'),
    Adoptee = mongoose.model('Adoptee'),
    AdopteeApplicationCounter = mongoose.model('AdopteeApplicationCounter'),
    fs = require('fs'),
    jade=require('jade'),
    htmlUtil = require('../utilities/adopteeHtml');

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
            populate('_adopterId', 'name').
            select({
              firstName: 1,
              lastName: 1,
              gender: 1,
              agent: 1,
              address: 1,
              status: 1,
              'criteria.story': 1,
              'criteria.specialNeeds': 1,
              'criteria.householdType': 1,
              applicationNumber: 1,
              site: 1,
              createDate: 1,
              '_createUser': 1,
              '_modifyUser': 1,
              '_adopterId': 1
            }).
            exec(function(err, collection) {
                 res.send({data: collection, totalCount: count});
            });
    });
};

exports.getAdopteeById = function(req, res) {
    Adoptee.findOne({_id: req.params.id}).
        populate('_adopterId', 'name').
        select('-image').
        exec(function (err, adoptee) {
        res.send(adoptee);
    });
};

exports.getNextAdoptee = function(req, res) {
    Adoptee.findOne({applicationNumber: req.body.nextNumber}).
        populate('_adopterId', 'name').
        select('-image').
        exec(function (err, adoptee) {
        if (adoptee) {
            res.send(adoptee);
        }
        else {
            res.send({});
        }
    });
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
  });
};


exports.updateAdoptee = function(req, res){
      var update = req.body,
          id = update._id,
          options = { upsert: true },
          userId = req.user ? req.user._id : null;
      if(!id) {
          update.createDate = new Date();
          update._createUser = userId;
      } else {
          delete update._id;
          delete update._createUser;
          update.modifyDate = new Date();
          update._modifyUser = userId;
      }

      delete update.__v;
      if (update._adopterId) {
          update._adopterId = update._adopterId.name ? update._adopterId._id : update._adopterId;
      }
      //duplicate checking...before updating this adoptee, check to see if there are any other adoptees in the system
      //having matching (name and ssn) or (matching address). If there are, both should be flagged as "Possible Duplcate"
      query = Adoptee.find({$and : [
                                    {_id: {$ne : id}},
                                    {$or : [ {$and : [{ssnLastFour:update.ssnLastFour, lastName: update.lastName, firstName: update.firstName}]},
                                             {"address.homeAddress": update.address.homeAddress}
                                           ]
                                    }
                                   ]
      });
      query.
          select("-image").
          exec(function(err, collection){
              console.log(err);
              console.log(collection);
          });

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
        findByIdAndRemove(req.params._id).
        exec(function(err, adoptee) {
            if(err) { res.status(400); return res.send({error:err.toString()});}
            return res.send(adoptee);
        });
};

exports.getEnums = function(req, res) {
    res.send(Adoptee.getEnumValues());
};

exports.print = function(req, res) {

    fs.readFile('server/views/adopteePrint.jade', 'utf8', function (err, templateData) {
        Adoptee.findOne({_id: req.params.id}).
            populate('_adopterId').
            exec(function (err, adoptee) {
                adoptee.adopter = adoptee._adopterId;
                var html = htmlUtil.getAdopteeHtml(adoptee, templateData);
                res.status(200);
                res.send(html);
            });
    });
};

exports.getForm = function(req, res) {
    Adoptee.findOne({_id: req.params.id})
     .exec(function(err, adoptee){
        var decodedImage = new Buffer(adoptee.image, 'base64');
        res.writeHead(200, {'content-type' : 'image/tiff', 'content-disposition': 'attachment; filename=' + adoptee.lastName + adoptee._id + '.tif'});
        res.write(decodedImage);
        res.end();
     });
};

