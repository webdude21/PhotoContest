'use strict';

var cloudinary = require('cloudinary'),
    q = require('q'),
    data = require('../data'),
    helpers = require('../utilities/helpers'),
    globalConstants = require('./../config/global-constants.js'),
    ROUTE_ROOT = '/',
    CONTROLLER_NAME = 'passed-contests',
    NO_SUCH_CONTEST = 'Не съществува такъв конкурс',
    EDIT_CONTEST_ROUTE = '/' + CONTROLLER_NAME + '/edit/';

cloudinary.config(process.env.CLOUDINARY_URL);

function _showError(req, res, deferred, message, redirectRoute) {
    req.session.errorMessage = message;
    res.redirect(redirectRoute || ROUTE_ROOT);
    deferred.reject();
}

function _retrieveContest(req, res, deferred) {
    var deferredContest = q.defer();

    data.contestantsService.getById(req.params.id).then(function (result) {
        if (result === null) {
            _showError(req, res, deferred, NO_SUCH_CONTEST);
            deferredContest.reject('No such contest');
        } else {
            deferredContest.resolve(result);
        }
    }, function (err) {
        _showError(req, res, deferred, NO_SUCH_CONTEST);
        deferredContest.reject('Failed to get the contest data');
    });

    return deferredContest.promise;
}

function _saveWinner(contest, newWinner) {
    if (!contest.winners) {
        contest.winners = [];
    }
    contest.winners.push(newWinner);
    contest.save();
}
function _addWinner(req, permittedFormats, res, deferred, contest) {
    var newWinner = {};
    newWinner.pictures = [];
    req.pipe(req.busboy);

    req.busboy.on('file', function (fieldname, file, filename) {
        if (helpers.fileHasValidExtension(filename, permittedFormats)) {
            var stream = cloudinary.uploader.upload_stream(function (result) {
                newWinner.pictures.push({
                    serviceId: result.public_id,
                    fileName: filename,
                    url: cloudinary.url(result.public_id, { transformation: 'detail', secure: true })
                });
                _saveWinner(contest, newWinner);
            }, { folder: globalConstants.CLOUDINARY_WINNERS_FOLDER_NAME + '/' + contest.id });
            file.pipe(stream);
        } else {
            _showError(req, res, deferred, globalConstants.INVALID_IMAGE_ERROR, EDIT_CONTEST_ROUTE + req.params.id + '/addWinner');
        }
    });

    req.busboy.on('field', function (fieldname, val) {
        newWinner[fieldname] = val;
    });

    req.busboy.on('finish', function () {
        req.session.successMessage = 'Участника беше успешно добавен!';
        res.redirect(EDIT_CONTEST_ROUTE + req.params.id);
        deferred.resolve();
    });
}
module.exports = {
    getAddWinner: function getAddWinner(req, res) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/addWinner');
        deferred.resolve();
        return deferred.promise;
    },
    postAddWinner: function postAddWinner(req, res, next) {
        var deferred = q.defer();

        _retrieveContest(req, res, deferred).then(function (contest) {
            _addWinner(req, globalConstants.PERMITTED_FORMATS, res, deferred, contest);
        });

        return deferred.promise;
    },
    getDeleteContestConfirm: function getDeleteContestConfirm(req, res, next) {
        res.render('confirm', {
            message: {
                title: 'Изтриване на конкурс',
                body: 'Сигурне ли сте, че искате да изтриете този конкурс (действието е необратимо)',
                buttonText: 'Изтрий'
            }
        });
    },
    deleteContest: function deleteContest(req, res) {
        var deferred = q.defer(),
            contestId = req.params.id;
        data.contestantsService.deleteBy(contestId).then(function () {
            cloudinary.api.delete_resources_by_prefix(globalConstants.CLOUDINARY_WINNERS_FOLDER_NAME + '/' + contestId, function () {
                req.session.successMessage = 'Конкурса беше изтрит успешно';
                res.redirect(EDIT_CONTEST_ROUTE);
                deferred.resolve();
            });
        }, function (err) {
            _showError(req, res, deferred, err);
        });

        return deferred.promise;
    },
    getPassedContests: function getPassedContests(req, res) {
        var deferred = q.defer();
        data.contestantsService.getAllVisible().then(function (contests) {
            if (contests === null) {
                res.redirect('/not-found');
                deferred.reject();
            } else {
                res.render(CONTROLLER_NAME + '/all', { data: contests });
                deferred.resolve();
            }
        }, function (err) {
            res.redirect('/not-found');
            deferred.reject();
        });
        return deferred.promise;
    },
    getEditPassedContests: function getEditPassedContests(req, res) {
        var deferred = q.defer();
        data.contestantsService.getAll().then(function (contests) {
            if (contests === null) {
                res.redirect('/not-found');
                deferred.reject();
            } else {
                res.render(CONTROLLER_NAME + '/edit', { data: contests });
                deferred.resolve();
            }
        }, function (err) {
            res.redirect('/not-found');
            deferred.reject();
        });
        return deferred.promise;
    },
    getEditPassedContestsById: function getEditPassedContestsById(req, res) {
        var deferred = q.defer();
        data.contestantsService.getById(req.params.id).then(function (contest) {
            if (contest === null) {
                res.redirect('/not-found');
                deferred.reject();
            } else {
                contest.winners.forEach(helpers.formatWinner);
                res.render('admin/contest/detail', contest);
                deferred.resolve();
            }
        }, function (err) {
            res.redirect('/not-found');
            deferred.reject();
        });
        return deferred.promise;
    },
    toggleVisibleById: function toggleVisibleById(req, res, next) {
        data.contestantsService.getById(req.params.id).then(function (contest) {
            contest.visible = !contest.visible;
            contest.save();
            res.redirect(EDIT_CONTEST_ROUTE + contest.id);
        }, function (err) {
            return res.redirect('/not-found');
        });
    },
    getRegister: function getRegister(req, res) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/register');
        deferred.resolve();
        return deferred.promise;
    },
    postRegister: function postRegister(req, res) {
        var deferred = q.defer();
        var savedContest = data.contestantsService.addContest(req.body);
        req.session.successMessage = 'Конкурса е успешно записан!';
        res.redirect(savedContest._id);
        deferred.resolve();
        return deferred.promise;
    },
    getPassedContestById: function getPassedContestById(req, res) {
        var deferred = q.defer();
        data.contestantsService.getById(req.params.id).then(function (contest) {
            if (contest === null) {
                res.redirect('/not-found');
                deferred.reject();
            } else {
                contest.winners.forEach(helpers.formatWinner);
                res.render(CONTROLLER_NAME + '/details', contest);
                deferred.resolve();
            }
        }, function (err) {
            req.session.errorMessage = err;
            res.redirect('/not-found');
            deferred.reject();
        });
        return deferred.promise;
    }
};
