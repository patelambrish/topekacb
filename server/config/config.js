var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/topekaCb',
    rootPath: rootPath,
    port: process.env.PORT || 3030
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://senneking:topekaCb@ds999999.mongolab.com:999999/topekaCb',
    port: process.env.PORT || 80
  }
}