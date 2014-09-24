var mongoose = require('mongoose');

var phoneTypes = ['Home',
    'Cell1',
    'Cell2',
    'Other']

var phone = {
    type: {type: String, enum: phoneTypes},
    name: {type: String},
    number: {type: String}
}

var householdTypes = ['Single',
    'Adult Only',
    'Single Mom with Children',
    'Single Dad with Children',
    'Married Couple with Children',
    'Adult with Children',
    'Grandparents (only) with Children']
var states = ['KS', 'MO', 'NE', 'OK', 'CO'] //most of the current records have null states...most addresses are topeka

var adopteeStates = ['In Process',
    'Not Matched',
    'Matched']
var genders = ['Male', 'Female']

var adopteeSchema = mongoose.Schema({
    firstName: {type:String, required:'{PATH} is required!'},
    lastName: {type:String, required:'{PATH} is required!'},
    middleInitial: {type: String},
    birthDate: {type: Date},
    ssnLastFour: {type: Number, max: 9999},
    gender: {type: String, enum: genders},
    //_agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
    _adopterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Adopter' },
    householdType: {type:String, enum: householdTypes},
    address: {
        homeAddress: {type: String},
        city: {type: String},
        state: {type: String, enum: states},
        zip: {type: String}
    },
    phones: [
        phone
    ],
    email: {type: String},
    fax: {type: String},
    status: {type: String, enum: adopteeStates},
    applicationNumber: {type: String},
    isSpanishOnly: {type: Boolean},
    englishSpeakingPerson: {type: String},
    isDisabled: {type: Boolean},
    isSenior: {type: Boolean},
    isVeteran: {type: Boolean},
    isHomebound: {type: Boolean},
    isDiabetic: {type: Boolean},
    isAllergic: {type: Boolean},
    reactionFoods: {type: String},
    story: {type: String},
    volunteerComment: {type: String},
    internalComment: {type: String},
    createDate: {type: Date},
    _createUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    modifyDate: {type: Date},
    _modifyUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    });
var Adoptee = mongoose.model('Adoptee', adopteeSchema);

function createDefaultAdoptees() {
  Adoptee.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      Adoptee.create({firstName: 'Jane', lastName: 'Seymour', gender: 'Female',
          birthDate: new Date('01/21/1958'), createDate: new Date('01/21/2014'), ssnLastFour: 9998,
          phones: [{phone: {type: 'Home', name: 'Jane', number: '785 865 8111'}},
                   {phone: {type: 'Cell1', name: 'Jane', number: '785 550 2111'}}]
      });
      Adoptee.create({firstName: 'Mark', lastName: 'Lark', gender: 'Male', birthDate: new Date('07/09/1985'), createDate: new Date('09/01/2014'), ssnLastFour: 9997});
      Adoptee.create({firstName: 'James', lastName: 'Brown', gender: 'Male', birthDate: new Date('11/26/1978'), createDate: new Date('06/21/2014'), ssnLastFour: 0909});
    }
  })
}

exports.createDefaultAdoptees = createDefaultAdoptees;