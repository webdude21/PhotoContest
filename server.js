var express = require('express');

var env = process.env.NODE_ENV || 'development';
var staticChacheAge = 86400000; // one day

var app = express();
var config = require('./server/config/config')[env];

require('./server/config/express')(app, config, staticChacheAge);
require('./server/config/mongoose')(config);
require('./server/config/passport')(config.port);
require('./server/config/routes')(app);

app.listen(config.port);
console.log("Server running on port: " + config.port);