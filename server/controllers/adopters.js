var mongoose = require('mongoose'),
    Adopter = mongoose.model('Adopter');

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
		query = query.skip(req.query.start).limit(req.query.start);
	}
  }
  query.
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    select('-__v').
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
    select('-__v').
    exec(function(err, adopter) {
      if(err) {
        console.log(err);
        return next(err);
      }
      res.send(adopter);
    });
};

exports.saveAdopter = function(req, res, next) {
  var data = req.body,
      id = data._id,
      options = { upsert: true },
      userId = req.user ? req.user._id : null;

  if(!id) {
    id = new mongoose.Types.ObjectId();
    data.createDate = new Date();
    data.createdBy = userId;
  } else {
    delete data.createDate;
    delete data.createdBy;
    data.updateDate = new Date();
    data.updatedBy = userId;
  }

  Adopter.
    findByIdAndUpdate(id, data, options).
    populate('createdBy', 'firstName lastName').
    populate('updatedBy', 'firstName lastName').
    select('-__v').
    exec(function(err, adopter) {
      if(err) {
        console.log(err);
        return next(err);
      }
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

exports.getEnums = function(req, res) {
  res.send(Adopter.getEnumValues());
};