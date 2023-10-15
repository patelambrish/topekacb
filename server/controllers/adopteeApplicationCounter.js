var mongoose = require('mongoose'),
    AdopteeApplicationCounter = mongoose.model('AdopteeApplicationCounter');

exports.getNextSequence = function(req, res) {
  AdopteeApplicationCounter.
      findByIdAndUpdate('adopteeApplication', { $inc: { seq: 1 } }, { upsert: true, new: true }).
      then((returnVal) => {
          if(err) { res.status(400); return res.send({error:err.toString()});}
          return res.send(returnVal);
  });
}

