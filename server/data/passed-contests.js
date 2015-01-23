var Contest = require('mongoose').model('Contest');

module.exports = {
    getPassedContests: function (username, error, success) {
        Contest.find().exec(function (err, contest) {
            if (err) {
                error(err);
            } else {
                success(contest);
            }
        });
    }
};