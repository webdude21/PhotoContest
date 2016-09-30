'use strict';

let mongoose = require('mongoose'),
  env = require('../config/global-variables'),
  minute = 1000 * 60,
  hour = minute * 60,
  initialRankingUpdateDelay =  10 * minute,
  rankingRefreshFrequency = hour * 2,
  models = require('../models');

module.exports = function ({ config }) {
  mongoose.Promise = global.Promise;
  mongoose.connect(config.db);
  let database = mongoose.connection;

  /*eslint-disable no-console */
  database.once('open', function (err) {
    if (err) {
      console.error('Cannot connect to the database ...: ' + err);
    }

    //TODO improve on this piece of code here (extract it to a task running module or something)
    let updateRanking = require('../tasks/update-ranking');
    setInterval(updateRanking, rankingRefreshFrequency);
    setTimeout(updateRanking, initialRankingUpdateDelay);
  });

  database.on('error', function (err) {
    console.error('Database error: ' + err);
  });

  models.User.seedInitialUsers();
  models.Page.seedInitialPages();

  if (env.NODE_ENV !== 'production') {
    models.Contestant.seedInitialContestants();
  }
};
