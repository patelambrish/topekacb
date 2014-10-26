var mongoose = require('mongoose'),
    Chance = require('chance'),
    Schema = mongoose.Schema,
    entityEnum = ['Individual', 'Organization', 'Department'],
    stateEnum = ['KS', 'MO', 'NE', 'OK', 'CO'],
    phoneEnum = ['Home', 'Mobile', 'Alternate', 'Fax'],
    statusEnum = ['In Process', 'Not Matched', 'Matched'],
    notifyEnum = ['Email', 'Fax', 'Pickup', 'Postal Mail'],
    householdEnum = [
      'Single', 'Adult Only', 'Single Mom with Children', 'Single Dad with Children',
      'Married Couple with Children', 'Adult with Children', 'Grandparents (only) with Children'
    ],
    genderEnum = ['Male', 'Female'],
    ageEnum = ['0 - 7', '8 - 12', '13 - 18'],
    specialEnum = ['Senior (60+)', 'Veteran', 'Disabled', 'Homebound'],
    sizeEnum = ['NB', '3M', '6M', '12M', '18M', '24M', '2T', '3T', '4T', 'XS', 'S', 'M', 'L', 'XL'];

var phoneSchema = new Schema({
  name: { type: String, enum: phoneEnum, default: 'Home' },
  number: String,
  contact: String
});

var adopterSchema = new Schema({
  entity: { type: String, enum: entityEnum, default: 'Individual' },
  name: { type: String, required: '{PATH} is required!' },
  org: String,
  dept: String,
  address: {
    street: { type: String, required: '{PATH} is required!' },
    city: { type: String, default: 'Topeka' },
    state: { type: String, enum: stateEnum, default: 'KS' },
    zip: String
  },
  phones: [phoneSchema],
  email: String,
  notifyMethods: [{ type: String, enum: notifyEnum }],
  criteria: {
    count: Number,
    households: [{ type: String, enum: householdEnum }],
    childAges: [{ type: String, enum: ageEnum }],
    special: [{ type: String, enum: specialEnum }],
    comment: String
  },
  adoptees: [{ type: Schema.Types.ObjectId, ref: 'Adoptee'}],
  status: { type: String, enum: statusEnum, default: 'In Process' },
  createDate: Date,
  createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
  updateDate: Date,
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User'}
});

adopterSchema.static('getEnumValues', function() {
  return {
    age: ageEnum,
    entity: entityEnum,
    gender: genderEnum,
    household: householdEnum,
    notify: notifyEnum,
    phone: phoneEnum,
    size: sizeEnum,
    special: specialEnum,
    state: stateEnum,
    status: statusEnum
  };
});

mongoose.model('Adopter', adopterSchema);

function createDefaultAdopters() {
  var Adopter = mongoose.model('Adopter');

  Adopter.
    count({}).
    exec(function(err, count) {
      if(count === 0) {
        generateAdopters(1500);
      } else {
        console.log('found ' + count + ' adopters.');
      }
    });
}

function generateAdopters(count) {
  var User = mongoose.model('User'),
      Adopter = mongoose.model('Adopter'),
      Adoptee = mongoose.model('Adoptee'),
      promise, adopteePool;

  console.log('populating default adopters...');

  promise = Adoptee.find({}).select('_id').exec();

  promise.then(function(adoptees) {
    adopteePool = adoptees;
    return User.find({}).select('_id').exec();
  }).then(function(userPool) {
    var chance = new Chance(),
        data = [],
        entity, status, i, a, householdCount, matchCount, adoptees;

    for(i = 1; i <= count; i++) {
      // pick entity (individual, dept, org) with the greater proportion to individuals
      entity = chance.weighted(entityEnum,[20, 2, 1]);
      status = chance.pick(statusEnum);
      // pick household count based on entity, eg org can adopt as many as 200 familes 
      householdCount = 
        (entity === 'Individual' && chance.d4()) || 
        (entity === 'Department' && chance.d20()) || 
        (entity === 'Organization' && chance.d100()*2); 
      // pick matched adoptee count based on above household count and status;
      //   if matched status, then number of matched should equal household count
      //   if unmatched status, then number of matched should be less than household count
      //   for other statuses, number of matched should be zero
      matchCount = 
        (status === 'Matched' && householdCount) || 
        (status === 'Unmatched' && chance.natural({min:0,max:householdCount - 1})) || 
        0;
      adoptees = [];

      // apply stupid simple matching, just pop them from the stack
      if(matchCount > 0 && adopteePool.length > 0) {
        for(a = 1; a <= matchCount; a++) {
          adoptees.push(adopteePool.pop());
        }
      }
      
      // adjust matched status to unmatched if insufficient adoptees 
      if(status === 'Matched' && adoptees.length !== householdCount) {
        status = 'Unmatched';
      }

      data.push({
          entity: entity,
          name: chance.name(),
          org: (entity !== 'Individual' ? chance.capitalize(chance.word()) : null),
          dept: (entity === 'Deptartment' ? chance.capitalize(chance.word()) : null),
          address: {
            street: chance.address({short_suffix: true}),
            city: chance.city(),
            state: chance.pick(stateEnum),
            zip: chance.zip()
          },
          phones: [{
            name: chance.weighted(phoneEnum, [4, 4, 2, 1]),
            number: chance.phone(),
            contact: chance.first()
          }, {
            name: chance.weighted(phoneEnum, [4, 4, 2, 1]),
            number: chance.phone()
          }],
          email: chance.email(),
          notifyMethods: chance.pick(notifyEnum, 1),
          criteria: {
            count: householdCount,
            households: chance.unique(chance.pick, chance.d4(), householdEnum, 1),
            childAges: chance.pick(ageEnum, 1),
            special: chance.unique(chance.pick, chance.d4(), specialEnum, 1),
            comment: chance.sentence()
          },
          adoptees: adoptees,
          status: chance.pick(statusEnum),
          createDate: chance.date({month: 8, year: 2014}),
          createdBy: chance.pick(userPool),
          updateDate: (status !== 'In Process' ? chance.date({month: 9, year: 2014}) : null),
          updatedBy: (status !== 'In Process' ? chance.pick(userPool) : null)
      });
    }

    Adopter.create(data, function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log('created ' + data.length + ' adopters.');
      }
    });
  });
}

exports.createDefaultAdopters = createDefaultAdopters;