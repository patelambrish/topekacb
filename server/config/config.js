var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/topekaCb',
    rootPath: rootPath,
    port: process.env.PORT || 3030,
    faceBookClientID : process.env.FACEBOOK_CLIENT_ID,
    faceBookClientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    faceBookCallbackURL : 'http://localhost:3030/auth/facebook/callback',
    sendGridUser: process.env.SENDGRID_USERNAME,
    sendGridPassword: process.env.SENDGRID_PASSWORD,
    emailTo: 'ambrish.patel@se2.com',
    emailFrom: 'cb@unitedwaytopeka.org',
    emailSubject: 'Christmas Bureau Adoption'
  },
  test: {
    rootPath: rootPath,
    db: process.env.MONGOHQ_URL,
    port: process.env.PORT || 80,
    faceBookClientID : process.env.FACEBOOK_CLIENT_ID,
    faceBookClientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    faceBookCallbackURL : 'http://topekacb-test.herokuapp.com/auth/facebook/callback',
    sendGridUser: process.env.SENDGRID_USERNAME,
    sendGridPassword: process.env.SENDGRID_PASSWORD,
    emailFrom: 'cb@unitedwaytopeka.org',
    emailSubject: 'Christmas Bureau Adoption'
  },
  production: {
    rootPath: rootPath,
    db: process.env.MONGOHQ_URL,
    port: process.env.PORT || 80,
    faceBookClientID : process.env.FACEBOOK_CLIENT_ID,
    faceBookClientSecret : process.env.FACEBOOK_CLIENT_SECRET,
    faceBookCallbackURL : 'https://topekacb.org/auth/facebook/callback',
    sendGridUser: process.env.SENDGRID_USERNAME,
    sendGridPassword: process.env.SENDGRID_PASSWORD,
    emailFrom: 'cb@unitedwaytopeka.org',
    emailSubject: 'Christmas Bureau Adoption'
  }
}
