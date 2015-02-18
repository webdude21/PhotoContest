var cloudinary = require('cloudinary'),
    q = require('q'),
    data = require('../data'),
    CLOUDINARY_UPLOAD_FOLDER_NAME = 'contestants',
    CONTROLLER_NAME = 'passed-contests';

module.exports = {
    getPassedContests: function (req, res) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/all');
        deferred.resolve();
        return deferred.promise;
    },
    getRegister: function (req, res) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/register');
        deferred.resolve();
        return deferred.promise;
    },
    postRegister: function (req, res) {
        var deferred = q.defer();
        var savedContest = data.contest.addContest(req.body);
        res.redirect(savedContest._id);
        deferred.resolve();
        return deferred.promise;
    },
    getPassedContestById: function (req, res) {
        var deferred = q.defer();
        data.contest.getById(req.params.id,
            function (err) {
                res.redirect('/not-found');
                deferred.reject();
            },
            function (contestant) {
                if (contestant == null) {
                    res.redirect('/not-found');
                    deferred.reject();
                } else {
                    res.render(CONTROLLER_NAME + '/details', contestant);
                    deferred.resolve();
                }
            });
        return deferred.promise;
    }
};