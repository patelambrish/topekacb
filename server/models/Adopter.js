var mongoose = require('mongoose'),
    Chance = require('chance'),
    Schema = mongoose.Schema,
    entityEnum = ['Individual', 'Organization', 'Deptartment'],
    stateEnum = ['KS', 'MO', 'NE', 'OK', 'CO'],
    phoneEnum = ['Daytime', 'Alternate', 'Fax'],
    statusEnum = ['In Process', 'Not Matched', 'Matched'],
    Adopter = mongoose.model('Adopter', Schema({
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
      status: { type: String, enum: statusEnum },
      createDate: Date,
      createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
      updateDate: Date,
      updatedBy: { type: Schema.Types.ObjectId, ref: 'User'}
    }));

function createDefaultAdopters() {
  Adopter.
  find({}).
  exec(function(err, collection) {
    var User = mongoose.model('User');

    if(collection.length === 0) {
      console.log('populating default adopters...');
      User.
        find({}).
        select('_id').
        exec(function(err, users) {
          Adopter.create(generateAdopters(users), function(err) { console.log(err);});
        });
    }
  });
}

function generateAdopters(users) {
  var chance = new Chance(),
      entity,
      status,
      data = [];
  
  data.push({
      entity: 'Deptartment',
      name: 'Miles Vorkosigan', org: 'Dendarii', dept: 'Mercenaries',
      address: { street: '123 Vorkosigan Surlough', city: 'Vorbar Sultana', state: 'KS', zip: '12345' },
      phones: [{ name: 'Daytime', number: '7858658111' }, { name: 'Alternate', number: '8888888888' }],
      createDate: new Date('01/21/2014'),
      createdBy: chance.pick(users)
  });

  data.push({
      entity: 'Organization',
      name: 'Honor Harrington', org: 'RMN',
      address: { street: '123 Craggy Hollow', city: 'Duchy of Shadow Vale', state: 'KS', zip: '12345' },
      phones: [{ name: 'Daytime', number: '3169456591' }, { name: 'Alternate', number: '3165223401' }],
      createDate: new Date('01/21/2014'),
      createdBy: chance.pick(users)
  });

  data.push({
      entity: 'Individual',
      name: 'Prince Roger Ramius Sergei Alexander Chiang McClintock',
      address: { street: '123 Empire Palace', city: 'New Madrid', state: 'KS', zip: '12345' },
      phones: [{ name: 'Daytime', number: '3168796541' }, { name: 'Alternate', number: '3165643218' }],
      createDate: new Date('01/21/2014'),
      createdBy: chance.pick(users)
  });
  
  for(var i = 1; i <= 2000; i++) {
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
          name: chance.pick(phoneEnum),
          number: chance.phone()
        }, {
          name: chance.pick(phoneEnum),
          number: chance.phone()
        }],
        email: chance.email(),
        status: chance.pick(statusEnum),
        createDate: chance.date({month: 8, year: 2014}),
        createdBy: chance.pick(users),
        updateDate: (status !== 'In Process' ? chance.date({month: 9, year: 2014}) : null),
        updatedBy: (status !== 'In Process' ? chance.pick(users) : null)
    });
  }
  
  return data;
}

exports.createDefaultAdopters = createDefaultAdopters;