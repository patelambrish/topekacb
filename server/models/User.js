var mongoose = require('mongoose'),
    encrypt = require('../utilities/encryption');

var userSchema = mongoose.Schema({
  firstName: {type:String, required:'{PATH} is required!'},
  lastName: {type:String, required:'{PATH} is required!'},
  username: {
    type: String,
    required: '{PATH} is required!',
    unique:true
  },
  salt: {type:String},
  hashed_pwd: {type:String},
  roles: [String],
  facebook: {},
  active: {type: Boolean, required:'{PATH} is required!'}
});

userSchema.methods = {
  authenticate: function(passwordToMatch) {
    return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
  },
  hasRole: function(role) {
    return this.roles.indexOf(role) > -1;
  }
};
var User = mongoose.model('User', userSchema);

function createDefaultUsers() {
  User.find({}).then((collection) => {
    console.log("Creating Users");
    if(collection.length === 0) {
      var salt, hash;
      salt = encrypt.createSalt();
      hash = encrypt.hashPwd(salt, 'ambrish');
      User.create({firstName:'Ambrish',lastName:'Patel',username:'callambrish@yahoo.com', salt: salt, hashed_pwd: hash, roles: ['user'], active: true});
      console.log("First User Created");
      User.create({firstName:'Ambrish',lastName:'Patel',username:'ambrishkpatel@gmail.com', salt: salt, hashed_pwd: hash, roles: ['user'], active: true});
    }
    console.log('Users Created');
  });  
}

exports.createDefaultUsers = createDefaultUsers;