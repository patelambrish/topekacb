var State = require('mongoose').model('State');

exports.getStates = function(req, res) {
    State.find({}).then((collection) => {
        res.send(collection);
    })
};