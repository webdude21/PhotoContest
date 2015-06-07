var Contestant = require('mongoose').model('Contestant');
var paging = require('../utilities/paging');

module.exports = {
    addContestant: function (contestant) {
        var newContestant = new Contestant(contestant);
        newContestant.save();
        return newContestant;
    },
    addContestantWithoutSaving: function(contestant){
        return new Contestant(contestant);
    },
    getCount: function (error, success) {
        Contestant.find().count(function (err, contestantsCount) {
            if (err) {
                error(err);
            } else {
                success(contestantsCount);
            }
        });
    },
    deleteAll: function (error, success) {
        Contestant.remove({}, function (err) {
            if (err) {
                error(err);
            } else {
                success();
            }
        });
    },
    deleteContestantById: function (id) {
        Contestant.findByIdAndRemove(id).exec();
    },
    getAllVisible: function (error, success) {
        Contestant.find()
            .populate('pictures')
            .exec(function (err, contestants) {
                if (err) {
                    error(err);
                } else {
                    success(contestants);
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
                    success(contestants);
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
                    success(contestant);
                }
            });
    },
    getQuery: function (err, success, baseQueryObject, pageSize) {
        paging.populateResponse(err, success, paging.buildQueryObject(baseQueryObject), Contestant, 'pictures', pageSize);
    },
    getAdminQuery: function (err, success, baseQueryObject, pageSize) {
        paging.populateResponse(err, success, paging.buildAdminQueryObject(baseQueryObject), Contestant, 'pictures', pageSize);
    }
};