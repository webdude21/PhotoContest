'use strict';

let mongoose = require('mongoose'),
    minute = 1000 * 60,
    hour = minute * 60,
    rankingRefreshFrequency = hour * 2,
    models = require('../models');

module.exports = function ({config}) {
    mongoose.connect(config.db);
    let database = mongoose.connection;

    /*eslint-disable no-console */
    database.once('open', function (err) {
        if (err) {
            console.error('Cannot connect to the database ...: ' + err);
        }

        let updateRanking = require('../tasks/update-ranking');
        setInterval(updateRanking, rankingRefreshFrequency);
        setTimeout(updateRanking, 10 * minute);
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
