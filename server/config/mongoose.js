'use strict';

var mongoose = require('mongoose'),
    rankingRefreshFrequency = (1000 * 60 * 60 * 2), // every two hours
    models = require('../models');

module.exports = function ({config}) {
    mongoose.connect(config.db);
    var database = mongoose.connection;

    /*eslint-disable no-console */
    database.once('open', function (err) {
        if (err) {
            console.error('Cannot connect to the database ...: ' + err);
        }

        var updateRanking = require('../tasks/update-ranking');
        setInterval(updateRanking, rankingRefreshFrequency);
        setTimeout(updateRanking, 10000);
    });

    database.on('error', function (err) {
        console.error('Database error: ' + err);
    });

    models.User.seedInitialUsers();
    models.Page.seedInitialPages();
    if (process.env.NODE_ENV !== 'production'){
		models.Contestant.seedInitialContestants();
    }
};
