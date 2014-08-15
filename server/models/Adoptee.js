var mongoose = require('mongoose');

var adopteeSchema = mongoose.Schema({
  name: {type:String, required:'{PATH} is required!'},
  isSingleParent: {type:Boolean, required:'{PATH} is required!'},
  enrolled: {type:Date, required:'{PATH} is required!'},
  tags: [String]
});
var Adoptee = mongoose.model('Adoptee', adopteeSchema);

function createDefaultAdoptees() {
  Adoptee.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      Adoptee.create({name: 'Jane Seymour', isSingleParent: true, enrolled: new Date('10/5/2013'), tags: ['Nice lady']});
      Adoptee.create({name: 'John Wayne', isSingleParent: false, enrolled: new Date('10/12/2013'), tags: ['Five grandchildren']});
      Adoptee.create({name: 'Marge Simpson', isSingleParent: false, enrolled: new Date('10/1/2013'), tags: ['Being married to Homer is like being single']});
    }
  })
}

exports.createDefaultAdoptees = createDefaultAdoptees;