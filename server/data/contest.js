var Contest = require('mongoose').model('Contest');

module.exports = {
    getAllVisible: function (error, success) {
        Contest.find({visible: true})
            .exec(function (err, contest) {
                if (err) {
                    error(err);
                } else {
                    success(contest);
                }
            });
    },
    deleteById: function (id, error, success) {
        Contest.findByIdAndRemove(id, {}, function (err, contest) {
            if (err) {
                error(error)
            } else {
                success(contest)
            }
        });
    },
    getAll: function (error, success) {
        Contest.find()
            .exec(function (err, contest) {
                if (err) {
                    error(err);
                } else {
                    success(contest);
                }
            });
    },
    addContest: function (contestInfo) {
        var newContestant = new Contest(contestInfo);
        newContestant.save();
        return newContestant;
    },
    getById: function (id, error, success) {
        Contest.findById(id)
            .exec(function (err, contestant) {
                if (err) {
                    error(err);
                } else {
                    success(contestant);
                }
            });
    }
};