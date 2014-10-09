var mongoose = require('mongoose'),
    stateSchema = mongoose.Schema({
      type: {type: String},
      value: {type: String}
    }),
    message = mongoose.model('Message', stateSchema);

function createMessages() {
  message.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      message.create({ "type": "HomePageMessage", "value": "Information" });
    }
  });
}

exports.createMessages = createMessages;