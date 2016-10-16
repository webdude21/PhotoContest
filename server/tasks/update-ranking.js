let fb = require('fb'),
  env = require('../config/global-variables'),
  ACCESS_TOKEN = `${env.FACEBOOK_APP_ID}|${env.FACEBOOK_APP_SECRET}`,
  logError = err => console.warn(err),
  getUserVotes = function (participantId) {
    return new Promise(function (resolve, reject) {
      fb.api('/', 'get', { id: `${env.BASE_URL}/contestafnts/${participantId}` }, function ({ error, share: { share_count = 0 } = {} }) {
        if (error) {
          reject(error);
          return;
        }
        resolve(share_count);
      });
    });
  },
  saveUserVotes = function (contestant) {
    getUserVotes(contestant._id)
      .then(votes => {
        if (contestant.votes !== votes) {
          contestant.votes = votes;
          contestant.save();
        }
      }, logError);
  };

fb.setAccessToken(ACCESS_TOKEN);

module.exports = function () {
  require('../data').contestantsService
    .getAllApproved()
    .then(contestants => contestants.forEach(saveUserVotes), logError);
};
