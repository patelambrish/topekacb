var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/topekaCb',
    rootPath: rootPath,
    port: process.env.PORT || 3030,
    faceBookClientID : '276073369254615',
    faceBookClientSecret : '4ad58d5239bea4c36e47caedafe59625',
    faceBookCallbackURL : 'http://localhost:3030/auth/facebook/callback'
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://senneking:topekaCb@ds999999.mongolab.com:999999/topekaCb',
    port: process.env.PORT || 80
  }
}