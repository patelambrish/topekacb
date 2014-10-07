var mongoose = require('mongoose'),
    Chance = require('chance');

var phone = {
    name: {type: String},
    number: {type: String}
};

var site = {
    value: {type: String},
    name: {type: String}
};

var languages = [
    'Spanish',
    'Spanish/English spoken by'
];

var sites = ['L', 'A', 'O'];

var clothingSizeTypes = ['A', 'J', 'C'];
var shoeSizeTypes = ['A', 'C'];

var householdMember = {
    name: {type: String},
    ssnLastFour: {type: Number, max: 9999},
    age: {type: Number, max: 99},
    gender: {type: String, enum: genders},
    pantSizeType: {type: String, enum: clothingSizeTypes},
    pantSize: {type: Number, max: 99},
    shirtSizeType: {type: String, enum: clothingSizeTypes},
    shirtSize: {type: Number, max: 99},
    shoeSizeType: {type: String, enum: shoeSizeTypes},
    shoeSize: {type: Number, max: 99},
    wishList: {type: String}
};

var householdTypes = ['Single',
    'Adult Only',
    'Single Mom with Children',
    'Single Dad with Children',
    'Married Couple with Children',
    'Adult with Children',
    'Grandparents (only) with Children'];
var states = ['KS'];  //todo:  use states from db...not on input form, though

var adopteeStates = ['In Process',
    'Not Matched',
    'Matched'];
var genders = ['Male', 'Female'];

var adopteeSchema = mongoose.Schema({
    firstName: {type:String, required:'{PATH} is required!'},
    lastName: {type:String, required:'{PATH} is required!'},
    middleInitial: {type: String},
    birthDate: {type: Date},
    ssnLastFour: {type: Number, max: 9999},
    gender: {type: String, enum: genders},
    agent: {
      agency: {type: String},
      agentName: {type: String},
      agentPhone: {type: String}
    },
    _adopterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Adopter' },
    householdType: {type:String, enum: householdTypes},
    address: {
        homeAddress: {type: String, required:'{PATH} is required!'},
        city: {type: String},
        state: {type: String, enum: states},
        zip: {type: String}
    },
    homePhone: {type: phone},
    cell1Phone: {type: phone},
    cell2Phone: {type: phone},
    otherPhone: {type: phone},
    email: {type: String},
    fax: {type: String},
    status: {type: String, enum: adopteeStates},
    language: {type: String, enum: languages},
    englishSpeaker: {type: String},
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
    householdMembers: [householdMember],
    applicationNumber: {type: Number},
    site: {type: String, enum: sites},
    createDate: {type: Date},
    _createUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    modifyDate: {type: Date},
    _modifyUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
    });
var Adoptee = mongoose.model('Adoptee', adopteeSchema);

function createDefaultAdoptees() {
  var Adoptee = mongoose.model('Adoptee');

  Adoptee.
    count({}).
    exec(function(err, count) {
      if(count === 0) {
        generateAdoptees(4000);
      } else {
        console.log('found ' + count + ' adoptees.');
      }
    });
}

function generateAdoptees(count) {
  var User = mongoose.model('User'),
      Adoptee = mongoose.model('Adoptee');

  console.log('populating default adoptees...');

  User.
    find({}).
    select('_id').
    exec(function(err, users) {
      var chance = new Chance(),
          data = [],
          gender, status, hispanic, language, allergic, site,
          allergens = ['Peanut','Tree nuts','Milk','Egg','Wheat','Soy','Fish','Shellfish'],
          i;

      chance.mixin({
        'contact': function() {
          return {
            name: chance.first(),
            number: chance.phone()
          };
        },
        'child': function() {
          return {
            name: chance.first(),
            ssnLastFour: chance.ssn({ ssnFour: true }),
            age: chance.age({type: 'child'}),
            gender: chance.gender(),
            pantSizeType: chance.pick(clothingSizeTypes, 1),
            pantSize: chance.integer({min: 7, max: 20}),
            shirtSizeType: chance.pick(clothingSizeTypes, 1),
            shirtSize: chance.integer({min: 7, max: 20}),
            shoeSizeType: chance.pick(shoeSizeTypes, 1),
            shoeSize: chance.integer({min: 0, max: 7}),
            wishList: chance.pick([
              'Lego Duplo', 'Fur Real', 'Elmo', 'Elsa Doll',
              'Easy-Bake', 'Transformer', 'Simon', 'Scooter',
              'R/C Crawler', 'Red Rider BB'], 3).join(', ')
          };
        }
      });

      for(i = 1; i <= count; i++) {
        status = chance.pick(adopteeStates);
        gender = chance.gender();
        hispanic = chance.bool({likelihood: 17});
        language = chance.pick(languages, 1);
        allergic = chance.bool({likelihood: 30});
        site = chance.pick(sites, 1);

        data.push({
          firstName: chance.first({ gender: gender }),
          middleInitial: chance.character({alpha: true, casing: 'upper'}),
          lastName: chance.last(),
          birthDate: chance.birthday(),
          ssnLastFour: chance.ssn({ ssnFour: true }),
          gender: gender,
          agent: chance.bool() && {
            agency: chance.capitalize(chance.word()),
            agentName: chance.name(),
            agentPhone: chance.phone()
          } || undefined,
          householdType: chance.pick(householdTypes, 1),
          address: {
              homeAddress: chance.address({short_suffix: true}),
              city: 'Topeka',
              state: 'KS',
              zip: chance.integer({min: 66601, max: 66667})
          },
          homePhone: chance.contact(),
          cell1Phone: chance.bool({likelihood: 70}) && chance.contact() || undefined,
          cell2Phone: chance.bool({likelihood: 60}) && chance.contact() || undefined,
          otherPhone: chance.bool({likelihood: 40}) && chance.contact() || undefined,
          email: chance.email(),
          fax: chance.bool({likelihood: 10}) && chance.phone() || undefined,
          status: status,
          language: hispanic && language || undefined,
          englishSpeaker: language === languages[1] && chance.first() || undefined,
          isDisabled: chance.bool({likelihood: 20}),
          isSenior: chance.bool({likelihood: 15}),
          isVeteran: chance.bool({likelihood: 30}),
          isHomebound: chance.bool({likelihood: 5}),
          isDiabetic: chance.bool({likelihood: 10}),
          isAllergic: allergic,
          reactionFoods: allergic && [].concat(chance.pick(allergens, chance.d4())).join(', ') || undefined,
          story: chance.paragraph(),
          volunteerComment: chance.bool() && chance.sentence(2) || undefined,
          internalComment: chance.bool() && chance.sentence() || undefined,
          householdMembers: chance.n(chance.child, chance.d4()),
          applicationNumber: i,
          site: site,
          createDate: chance.date({month: 8, year: 2014}),
          _createUser: chance.pick(users),
          modifyDate: (status !== 'In Process' ? chance.date({month: 9, year: 2014}) : null),
          _modifyUser: (status !== 'In Process' ? chance.pick(users) : null)
        });
      }

      Adoptee.
        create(data).
        then(function() {
          console.log('created ' + data.length + ' adoptees.');
        }).
        then(null, function(e) {
          console.log(e);
        });
    });
}

exports.createDefaultAdoptees = createDefaultAdoptees;