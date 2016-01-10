var fb = require('fb'),
    q = require('q'),
    ACCESS_TOKEN = `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}`,
    baseUrl = process.env.BASE_URL,
    getUserVotes = function (participantId) {
        var deferred = q.defer();

        fb.api('/', 'get', {id: `${baseUrl}/${participantId}`}, function (res) {
            if (res.error) {
                return deferred.reject(res.error);
            }

            /*eslint-disable no-console */
            console.log(res);
            deferred.resolve(res.shares || 0);
        });

        return deferred.promise;
    },
    saveUserVotes = function (contestant) {
        getUserVotes(contestant._id)
            .then(votes => {
                contestant.votes = votes;
                contestant.save();
            }, err => console.warn(err));
    };

fb.setAccessToken(ACCESS_TOKEN);

module.exports = function () {
    require('../data').contestantsService
        .getAllApproved()
        .then(contestants => contestants.forEach(saveUserVotes), err => console.warn(err));
};
