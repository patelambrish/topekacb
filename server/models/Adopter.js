var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Adopter = mongoose.model('Adopter', Schema({
      entity: { type: String, enum: ['Individual', 'Organization', 'Deptartment'] },
      name: { type: String, required: '{PATH} is required!' },
      org: String,
      dept: String,
      address: {
          street: { type: String, required: '{PATH} is required!' },
          city: String,
          state: { type: String, enum: ['KS', 'MO', 'NE', 'OK', 'CO'] },
          zip: String
      },
      phones: [{
        name: { type: String, enum: ['Daytime', 'Alternate', 'Fax'] },
        number: String
      }],
      email: String,
      status: { type: String, enum: ['In Process', 'Not Matched', 'Matched'] },
      createDate: Date,
      createdBy: { type: Schema.Types.ObjectId, ref: 'User'},
      updateDate: Date,
      updatedBy: { type: Schema.Types.ObjectId, ref: 'User'}
    }));

function createDefaultAdopters() {
  Adopter.find({}).exec(function(err, collection) {
    if(collection.length === 0) {
      console.log('populating default adopters...');
      Adopter.create({
          entity: 'Deptartment',
          name: 'Miles Vorkosigan', org: 'Dendarii', dept: 'Mercenaries',
          address: { street: '123 Vorkosigan Surlough', city: 'Vorbar Sultana', state: 'KS', zip: '12345' },
          phones: [{ name: 'Daytime', number: '7858658111' }, { name: 'Alternate', number: '8888888888' }],
          createDate: new Date('01/21/2014')
      });
      Adopter.create({
          entity: 'Organization',
          name: 'Honor Harrington', org: 'RMN',
          address: { street: '123 Craggy Hollow', city: 'Duchy of Shadow Vale', state: 'KS', zip: '12345' },
          phones: [{ name: 'Daytime', number: '3169456591' }, { name: 'Alternate', number: '3165223401' }],
          createDate: new Date('01/21/2014')
      });
      Adopter.create({
          entity: 'Individual',
          name: 'Prince Roger Ramius Sergei Alexander Chiang McClintock',
          address: { street: '123 Empire Palace', city: 'New Madrid', state: 'KS', zip: '12345' },
          phones: [{ name: 'Daytime', number: '3168796541' }, { name: 'Alternate', number: '3165643218' }],
          createDate: new Date('01/21/2014')
      });
    }
  });
}

exports.createDefaultAdopters = createDefaultAdopters;