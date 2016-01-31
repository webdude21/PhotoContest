'use strict';

var path = require('path'),
    env = require('./global-variables'),
    rootPath = path.normalize(__dirname + '/../../'),
    localDatabase = 'mongodb://localhost/photoContest',
    globalConstants = require('./global-constants');

module.exports = {
    development: {
        rootPath: rootPath,
        db: localDatabase,
        port: env.PORT || globalConstants.DEFAULT_PORT
    },
    production: {
        rootPath: rootPath,
        db: env.MONGOLAB_URI,
        port: env.PORT || globalConstants.DEFAULT_PORT
    }
};
