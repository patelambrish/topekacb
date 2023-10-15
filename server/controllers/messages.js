var Message = require('mongoose').model('Message');

exports.getMessage = function(req, res) {
  //console.log(req.params.type);
  Message.findOne({ type: req.params.type }).then((msg) => {
    res.send(msg);
  });
};

exports.updateMessage = function(req, res) {
  var messageUpdates = req.body;

  if(!req.user.hasRole('admin')) {
    res.status(403);
    return res.end();
  }

  Message.findOne({_id: messageUpdates._id}).then((curMsg) => {
    curMsg.value = messageUpdates.value;
  	curMsg.save().then(()=>{  		
    	res.send({
    		_id: curMsg._id,
    		type: curMsg.type,
    		value: curMsg.value
    	});
  	}).catch((err)=> {
      if(err) { res.status(400); return res.send({reason:err.toString()});}
    })
  });
};