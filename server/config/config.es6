var path = require('path'),
    rootPath = path.normalize(__dirname + '/../../'),
    localDatabase = 'mongodb://localhost/photoContest';

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
