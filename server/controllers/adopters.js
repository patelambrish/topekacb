var mongoose = require('mongoose'),
    Adopter = mongoose.model('Adopter'),
    Adoptee = mongoose.model('Adoptee'),
    fs = require('fs'),
    jade=require('jade'),
    htmlUtil = require('../utilities/adopteeHtml');


function getAdopterHtml(adopter, templateData) {
	var completeHtml = '', html;
	if (adopter.adoptees && adopter.adoptees.length > 0) {
		adopter.adoptees.forEach(function(adoptee) {
			adoptee.adopter = {
				name : adopter.name,
				email : adopter.email,
				address : adopter.address,
				phones : adopter.phones,
				notifyMethods: adopter.notifyMethods
			};
			html = htmlUtil.getAdopteeHtml(adoptee, templateData);
			completeHtml = completeHtml + html;
		});
	}
	return completeHtml;
}

exports.getAdopters = function(req, res, next) {
  console.log(req.query.filter);
  var searchFilters, nameRegex, query, queryName, sortParams, sortBy, sortDir ;
  if(req.query.filter) {
  	searchFilters= JSON.parse(req.query.filter);
  }
  query = Adopter.find({});
  if(searchFilters) {
	if(searchFilters.name) {
	  queryName = searchFilters.name;
	  //nameRegex  = new RegExp(searchFilters.name, 'i');
	  query = Adopter.find({'$or': [
	  	{'name' : {'$regex': queryName, '$options': 'i' }},
	  	{'org' : {'$regex': queryName, '$options': 'i' }},
	  	{'dept' : {'$regex': queryName, '$options': 'i' }}
	  ]});
	  //query = query.where('name').regex(nameRegex);
	}
	if(searchFilters.household) {
	  query = query.where('criteria.household').equals(searchFilters.household);
	}
	if(searchFilters.special && searchFilters.special.length>0) {
	  query = query.where('criteria.special').in(searchFilters.special);
	}
	if(searchFilters.status) {
		query = query.where('status').equals(searchFilters.status);
	}
	if(req.query.sort) {
		//sortParams = req.query.sort.split(",");
		//sortBy = sortParams[0];
		//if(sortParams.length > 1) {
		//	sortDir = sortParams[1];
		//}
		//else {
		//	sortDir = "asc";
		//}
		sortBy = req.query.sort; //(sortDir === 'asc') ? sortBy : '-' + sortBy;
	}
	else {
		sortBy = "name";
	}
	//console.log(sortBy);
	query = query.sort(sortBy);
	if(req.query.start && req.query.limit) {
		query = query.skip(req.query.start).limit(req.query.limit);
	}
  }
  query.
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    select({
      entity: 1,
      name: 1,
      org: 1,
      dept: 1,
      address: 1,
      criteria: 1,
      status: 1,
      createDate: 1,
      createdBy: 1,
      updatedBy: 1
    }).
    exec(function(err, collection) {
      Adopter.count({}, function(err, cnt) {
      	res.send({data: collection, totalCount: cnt});
      });
      //res.send(collection);
    });
};

exports.getAdopterById = function(req, res, next) {
  Adopter.
    findById(req.params.id).
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    populate('adoptees').
    select('-__v').
    lean(true).
    exec(function(err, adopter) {
      if(err) {
        console.log(err);
        return next(err);
      }
      if(adopter) {
        adopter.enums = Adopter.getEnumValues();
        res.send(adopter);
      } else {
        res.send({});
      }
    });
};

exports.saveAdopter = function(req, res, next) {
  var data = req.body,
      id = data._id,
      options = { upsert: true },
      userId = req.user ? req.user._id : null;
  console.log(id);
  delete data.enums;
  if(!id) {
    id = new mongoose.Types.ObjectId();
    data.createDate = new Date();
    data.createdBy = userId;
  } else {
    delete data.createDate;
    delete data.createdBy;
    delete data._id;
    data.updateDate = new Date();
    data.updatedBy = userId;
  }

  Adopter.
    findByIdAndUpdate(id, data, options).
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    populate('adoptees').
    select('-__v').
    lean(true).
    exec(function(err, adopter) {
      if(err) {
        console.log(err);
        return next(err);
      }
      adopter.enums = Adopter.getEnumValues();
      res.send(adopter);
    });
};

exports.deleteAdopter = function(req, res, next) {
  Adopter.
    findByIdAndRemove(req.params.id).
    exec(function(err, adopter) {
      if(err) {
        console.log(err);
        return next(err);
      }
      res.send(adopter);
    });
};


exports.print = function(req, res, next) {
	var adopterId = req.params.id;
	fs.readFile('server/views/adopteePrint.jade', 'utf8', function(err, templateData) {
		Adopter.findById(adopterId).populate('adoptees').select('-__v').exec(function(err, adopter) {
			if (err) {
				console.log(err);
				return next(err);
			}
			var completeHtml = getAdopterHtml(adopter, templateData);
			res.status(200);
			res.send(completeHtml);
		});
	});
};

exports.getEnums = function(req, res) {
  res.send(Adopter.getEnumValues());
};

exports.removeAdoptee = function(req, res, next) {
  var adopterId = req.params.id,
      adopteeId = req.params.adopteeId,
      userId = req.user ? req.user._id : null,
      update = {
        status: 'Not Matched',
        _adopterId: null,
        modifyDate: new Date(),
        _modifyUser: userId
      };

  Adoptee.findByIdAndUpdate(adopteeId, update).exec().
    then(function(adoptee) {
      return Adopter.findById(adopterId).exec();
    }).
    then(function(adopter) {
      var update = {
            adoptees: adopter.adoptees || [],
            status: adopter.status,
            updateDate: new Date(),
            updatedBy: userId
          },
          arr = update.adoptees,
          index = arr.indexOf(adopteeId);

      if(index !== -1) {
        arr.splice(index, 1);
      }

      if(arr.length === 0 || arr.length !== adopter.criteria.count) {
        update.status = 'Not Matched';
      }

      Adopter.
        findByIdAndUpdate(adopterId, update).
        populate('createdBy', 'firstName lastName').
        populate('updatedBy', 'firstName lastName').
        populate('adoptees').
        select('-__v').
        lean(true).
        exec(function(err, adopter) {
          if(err) {
            console.log(err);
            return next(err);
          }
          adopter.enums = Adopter.getEnumValues();
          res.send(adopter);
        });
    });
};