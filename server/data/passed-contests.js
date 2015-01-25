var Contest = require('mongoose').model('Contest');
var q = require("q");

module.exports = {
    getAll: function (error, success) {
        Contest.find({isDeleted: false})
            .exec(function (err, contest) {
            if (err) {
                error(err);
            } else {
                success(contest);
            }
        });
    },
    getAllWithDeleted: function (error, success) {
        Contest.find()
            .exec(function (err, contest) {
                if (err) {
                    error(err);
                } else {
                    success(contest);
                }
            });
    }
};