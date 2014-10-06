var mongoose = require('mongoose'),
    Chance = require('chance'),
    Schema = mongoose.Schema,
    entityEnum = ['Individual', 'Organization', 'Deptartment'],
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
    sizeEnum = ['NB', '3M', '6M', '12M', '18M', '24M', '2T', '3T', '4T', 'XS', 'S', 'M', 'L', 'XL'],
    adopterSchema = new Schema({
      entity: { type: String, enum: entityEnum },
      name: { type: String, required: '{PATH} is required!' },
      org: String,
      dept: String,
      address: {
          street: { type: String, required: '{PATH} is required!' },
          city: String,
          state: { type: String, enum: stateEnum },
          zip: String
      },
      phones: [{
        name: { type: String, enum: phoneEnum },
        number: String
      }],
      email: String,
      notifyMethods: [{ type: String, enum: notifyEnum }],
      criteria: {
        count: Number,
        households: [{ type: String, enum: householdEnum }],
        childAges: [{ type: String, enum: ageEnum }],
        special: [{ type: String, enum: specialEnum }],
        comment: String
      },
      status: { type: String, enum: statusEnum },
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
        generateAdopters(4000);
      } else {
        console.log('found ' + count + ' adopters.');
      }
    });
}

function generateAdopters(count) {
  var User = mongoose.model('User'),
      Adopter = mongoose.model('Adopter');

  console.log('populating default adopters...');

  User.
    find({}).
    select('_id').
    exec(function(err, users) {
      var chance = new Chance(),
          data = [],
          entity, status, i;

      for(i = 1; i <= count; i++) {
        entity = chance.pick(entityEnum);
        status = chance.pick(statusEnum);

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
              number: chance.phone()
            }, {
              name: chance.weighted(phoneEnum, [4, 4, 2, 1]),
              number: chance.phone()
            }],
            email: chance.email(),
            notifyMethods: chance.pick(notifyEnum, 2),
            criteria: {
              count: (entity === 'Individual' ? chance.d4() : chance.d12()),
              households: chance.unique(chance.pick, chance.d4(), householdEnum, 1),
              childAges: chance.pick(ageEnum, 1),
              special: chance.unique(chance.pick, chance.d4(), specialEnum, 1),
              comment: chance.sentence()
            },
            status: chance.pick(statusEnum),
            createDate: chance.date({month: 8, year: 2014}),
            createdBy: chance.pick(users),
            updateDate: (status !== 'In Process' ? chance.date({month: 9, year: 2014}) : null),
            updatedBy: (status !== 'In Process' ? chance.pick(users) : null)
        });
      }

      Adopter.
        create(data).
        then(function() {
          console.log('created ' + data.length + ' adopters.');
        });
    });
}

exports.createDefaultAdopters = createDefaultAdopters;