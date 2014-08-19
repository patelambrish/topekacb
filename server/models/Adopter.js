var mongoose = require('mongoose');

var adopterSchema = mongoose.Schema({
    name: {type:String, required:'{PATH} is required!'},
    isSingleParent: {type:Boolean, required:'{PATH} is required!'},
    enrolled: {type:Date, required:'{PATH} is required!'},
    tags: [String]
});
var adopter = mongoose.model('Adopter', adopterSchema);

function createDefaultadopters() {
    adopter.find({}).exec(function(err, collection) {
        if(collection.length === 0) {
            adopter.create({name: 'George Rich', isSingleParent: true, enrolled: new Date('10/5/2013'), tags: ['Can help']});
            adopter.create({name: 'Nice Guy', isSingleParent: false, enrolled: new Date('10/12/2013'), tags: ['Wants to save the world']});
            adopter.create({name: 'Rash Cash', isSingleParent: false, enrolled: new Date('10/1/2013'), tags: ['Adopts everyone']});
        }
    })
}

exports.createDefaultadopters = createDefaultadopters;