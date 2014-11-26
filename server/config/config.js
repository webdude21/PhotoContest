var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');
var localDatabase = 'mongodb://localhost/photoChallenge';

module.exports = {
    development: {
        rootPath: rootPath,
        db: localDatabase,
        port: process.env.PORT || 3000
    },
    production: {
        rootPath: rootPath,
        db: process.env.MONGOLAB_URI,
        port: process.env.PORT || 3000
    }
};