var cloudinary = require('cloudinary'),
    q = require('q'),
    data = require('../data'),
    CLOUDINARY_UPLOAD_FOLDER_NAME = 'contestants',
    CONTROLLER_NAME = 'passed-contests';

module.exports = {
    getAddWinner: function (req, res) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/addWinner');
        deferred.resolve();
        return deferred.promise
    },
    getPassedContests: function (req, res) {
        var deferred = q.defer();
        data.contest.getAll(function (err) {
                res.redirect('/not-found');
                deferred.reject();
            },
            function (contests) {
                if (contests === null) {
                    res.redirect('/not-found');
                    deferred.reject();
                } else {
                    res.render(CONTROLLER_NAME + '/all', {data: contests});
                    deferred.resolve();
                }
            });
        return deferred.promise;
    },
    getEditPassedContests: function (req, res) {
        var deferred = q.defer();
        data.contest.getAllWithDeleted(function (err) {
                res.redirect('/not-found');
                deferred.reject();
            },
            function (contests) {
                if (contests === null) {
                    res.redirect('/not-found');
                    deferred.reject();
                } else {
                    res.render(CONTROLLER_NAME + '/edit', {data: contests});
                    deferred.resolve();
                }
            });
        return deferred.promise;
    },
    getEditPassedContestsById: function (req, res) {
        var deferred = q.defer();
        data.contest.getById(req.params.id,
            function (err) {
                res.redirect('/not-found');
                deferred.reject();
            },
            function (contestant) {
                if (contestant === null) {
                    res.redirect('/not-found');
                    deferred.reject();
                } else {
                    res.render(CONTROLLER_NAME + '/details', contestant);
                    deferred.resolve();
                }
            });
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
                if (contestant === null) {
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