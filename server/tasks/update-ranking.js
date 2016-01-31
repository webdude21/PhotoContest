var fb = require('fb'),
    env = require('../config/global-variables'),
    ACCESS_TOKEN = `${env.FACEBOOK_APP_ID}|${env.FACEBOOK_APP_SECRET}`,
    getUserVotes = function (participantId) {
        return new Promise(function (resolve, reject) {
            fb.api('/', 'get', { id: `${env.BASE_URL}/contestants/${participantId}` }, function (res) {
                if (res.error) {
                    return reject(res.error);
                }
                resolve(res.shares || 0);
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
            }, err => console.warn(err));
    };

fb.setAccessToken(ACCESS_TOKEN);

module.exports = function () {
    require('../data').contestantsService
        .getAllApproved()
        .then(contestants => contestants.forEach(saveUserVotes), err => console.warn(err));
};
