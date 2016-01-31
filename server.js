'use strict';
var app = require('express')(),
    env = require('./server/config/global-variables'),
    config = require('./server/config/config')[env.NODE_ENV || 'development'],
    staticCacheAge = 86400000;

require('./server/config/')({ app, config, staticCacheAge, env });

app.listen(config.port);

/*eslint-disable no-console */
console.log('Server running on port: ' + config.port);
