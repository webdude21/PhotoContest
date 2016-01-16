var fb = require('fb'),
    ACCESS_TOKEN = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
    baseUrl = process.env.BASE_URL,
    getUserVotes = function (participantId) {
        return new Promise(function (resolve, reject) {
            fb.api('/', 'get', {id: `${baseUrl}/contestants/${participantId}`}, function (res) {
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
