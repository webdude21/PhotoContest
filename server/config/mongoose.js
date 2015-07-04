'use strict';
var mongoose = require('mongoose'),
    models = require('../models');

module.exports = function (config) {
    mongoose.connect(config.db);
    var database = mongoose.connection;

    database.once('open', function (err) {
        if (err) {
            console.log('Cannot connect to the database ...: ' + err);
        }
    });

    database.on('error', function (err) {
        console.log('Database error: ' + err);
    });

    models.User.seedInitialUsers();
};