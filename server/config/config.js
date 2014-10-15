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
  test: {
    rootPath: rootPath,
    db: process.env.MONGOHQ_URL,
    port: process.env.PORT || 80,
    faceBookClientID : '1474507579496476',
    faceBookClientSecret : '1968827bdff967650b4828d2b0e68f46',
    faceBookCallbackURL : 'http://topekacb-test.herokuapp.com/auth/facebook/callback'
  },
  production: {
    rootPath: rootPath,
    db: process.env.MONGOHQ_URL,
    port: process.env.PORT || 80,
    faceBookClientID : '449063101898994',
    faceBookClientSecret : '52aa954220f13dab6746d18d9a2617fa',
    faceBookCallbackURL : 'http://topekacb.org/auth/facebook/callback'
  }
}
