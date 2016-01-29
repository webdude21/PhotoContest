'use strict';
var app = require('express')(),
    env = process.env.NODE_ENV || 'development',
    config = require('./server/config/config')[env],
    staticCacheAge = 86400000;
require('./server/config/')({ app, config, staticCacheAge });

app.listen(config.port);

/*eslint-disable no-console */
console.log('Server running on port: ' + config.port);
