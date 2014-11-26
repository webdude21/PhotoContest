var Contestant = require('mongoose').model('Contestant');
var paging = require('../utilities/paging');

module.exports = {
    addContestant: function (contestant) {
        var newContestant = new Contestant(contestant);
        newContestant.save();
        return newContestant;
    },
    getCount: function (error, success) {
        Contestant.find().count(function (err, contestantsCount) {
            if (err) {
                error(err);
            } else {
                success(contestantsCount)
            }
        })
    },
    getAll: function (error, success) {
        Contestant.find()
            .populate('pictures')
            .exec(function (err, contestants) {
                if (err) {
                    error(err);
                } else {
                    success(contestants)
                }
            });
    },
    getAllApproved: function (error, success) {
        Contestant.find()
            .populate('pictures')
            .where('approved', true)
            .exec(function (err, contestants) {
                if (err) {
                    error(err);
                } else {
                    success(contestants)
                }
            });
    },
    getById: function (id, error, success) {
        Contestant.findById(id)
            .populate('pictures')
            .exec(function (err, contestant) {
                if (err) {
                    error(err);
                } else {
                    success(contestant)
                }
            });
    },
    getQuery: function (err, success, queryObject, pageSize) {
        paging.populateResponse(err, success, queryObject, Contestant, 'pictures', pageSize)
    }
};