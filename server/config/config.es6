var path = require('path'),
    rootPath = path.normalize(__dirname + '/../../'),
    localDatabase = 'mongodb://localhost/photoContest',
    globalConstants = require('./global-constants');

module.exports = {
    development: {
        rootPath: rootPath,
        db: localDatabase,
        port: process.env.PORT || globalConstants.DEFAULT_PORT
    },
    production: {
        rootPath: rootPath,
        db: process.env.MONGOLAB_URI,
        port: process.env.PORT || globalConstants.DEFAULT_PORT
    }
};
