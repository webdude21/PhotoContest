var mongoose = require('mongoose');
var models = require('../models');

module.exports = function (config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;

    db.once('open', function (err) {
        if (err) {
            console.log('Cannot connect to the database ...: ' + err);
        }
    });

    db.on('error', function (err) {
        console.log('Database error: ' + err);
    });

    models.User.seedInitialUsers();
};