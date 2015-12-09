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

function showError(req, res, deferred, message, redirectRoute) {
    req.session.errorMessage = message;
    res.redirect(redirectRoute || ROUTE_ROOT);
    deferred.reject();
}

function retrieveContest(req, res, deferred) {
    var deferredContest = q.defer();

    data.contestService
        .getBy(req.params.id)
        .then(result => {
            if (result === null) {
                showError(req, res, deferred, NO_SUCH_CONTEST);
                deferredContest.reject('No such contest');
            } else {
                deferredContest.resolve(result);
            }
        }, () => {
            showError(req, res, deferred, NO_SUCH_CONTEST);
            deferredContest.reject('Failed to get the contest data');
        });

    return deferredContest.promise;
}

function saveWinner(contest, newWinner) {
    if (!contest.winners) {
        contest.winners = [];
    }
    contest.winners.push(newWinner);
    contest.save();
}
function addWinner(req, permittedFormats, res, deferred, contest) {
    var newWinner = {};
    newWinner.pictures = [];
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        if (helpers.fileHasValidExtension(filename, permittedFormats)) {
            var stream = cloudinary.uploader.upload_stream((result) => {
                newWinner.pictures.push({
                    serviceId: result.public_id,
                    fileName: filename,
                    url: cloudinary.url(result.public_id, {transformation: 'detail', secure: true})
                });
                saveWinner(contest, newWinner);
            }, {folder: globalConstants.CLOUDINARY_WINNERS_FOLDER_NAME + '/' + contest.id});
            file.pipe(stream);
        } else {
            showError(req, res, deferred, globalConstants.INVALID_IMAGE_ERROR,
                EDIT_CONTEST_ROUTE + req.params.id + '/addWinner');
        }
    });

    req.busboy.on('field', (fieldname, val) => {
        newWinner[fieldname] = val;
    });

    req.busboy.on('finish', () => {
        req.session.successMessage = 'Участника беше успешно добавен!';
        res.redirect(EDIT_CONTEST_ROUTE + req.params.id);
        deferred.resolve();
    });
}
module.exports = {
    getAddWinner: function (req, res) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/addWinner');
        deferred.resolve();
        return deferred.promise;
    },
    postAddWinner: function (req, res) {
        var deferred = q.defer();

        retrieveContest(req, res, deferred)
            .then(contest => addWinner(req, globalConstants.PERMITTED_FORMATS, res, deferred, contest));

        return deferred.promise;
    },
    getDeleteContestConfirm: function (req, res) {
        res.render('confirm', {
            message: {
                title: 'Изтриване на конкурс',
                body: 'Сигурне ли сте, че искате да изтриете този конкурс (действието е необратимо)',
                buttonText: 'Изтрий'
            }
        });
    },
    deleteContest: function (req, res) {
        var deferred = q.defer(),
            contestId = req.params.id;
        data.contestService
            .deleteBy(contestId)
            .then(() => {
                cloudinary
                    .api
                    .delete_resources_by_prefix(globalConstants.CLOUDINARY_WINNERS_FOLDER_NAME + '/' + contestId,
                        () => {
                            req.session.successMessage = 'Конкурса беше изтрит успешно';
                            res.redirect(EDIT_CONTEST_ROUTE);
                            deferred.resolve();
                        });
            }, err => showError(req, res, deferred, err));

        return deferred.promise;
    },
    getPassedContests: function (req, res) {
        var deferred = q.defer();
        data.contestService
            .getAllVisible()
            .then(contests => {
                if (contests === null) {
                    res.redirect('/not-found');
                    deferred.reject();
                } else {
                    res.render(CONTROLLER_NAME + '/all', {data: contests});
                    deferred.resolve();
                }
            }, err => showError(req, res, deferred, err));
        return deferred.promise;
    },
    getEditPassedContests: function (req, res) {
        var deferred = q.defer();
        data.contestService
            .getAll()
            .then(contests => {
                if (contests === null) {
                    res.redirect('/not-found');
                    deferred.reject();
                } else {
                    res.render(CONTROLLER_NAME + '/edit', {data: contests});
                    deferred.resolve();
                }
            }, err => showError(req, res, deferred, err));
        return deferred.promise;
    },
    getEditPassedContestsById: function (req, res) {
        var deferred = q.defer();
        data.contestService
            .getBy(req.params.id)
            .then(contest => {
                if (contest === null) {
                    res.redirect('/not-found');
                    deferred.reject();
                } else {
                    contest.winners.forEach(helpers.formatWinner);
                    res.render('admin/contest/detail', contest);
                    deferred.resolve();
                }
            }, err => showError(req, res, deferred, err));
        return deferred.promise;
    },
    toggleVisibleById: function (req, res) {
        data.contestService
            .getBy(req.params.id)
            .then(contest => {
                contest.visible = !contest.visible;
                contest.save();
                res.redirect(EDIT_CONTEST_ROUTE + contest.id);
            }, () => res.redirect('/not-found'));
    },
    getRegister: function (req, res) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/register');
        deferred.resolve();
        return deferred.promise;
    },
    postRegister: function (req, res) {
        var deferred = q.defer();
        var savedContest = data.contestService.add(req.body);
        req.session.successMessage = 'Конкурса е успешно записан!';
        res.redirect(savedContest._id);
        deferred.resolve();
        return deferred.promise;
    },
    getPassedContestById: function (req, res) {
        var deferred = q.defer();
        data.contestService
            .getBy(req.params.id)
            .then(contest => {
                if (contest === null) {
                    res.redirect('/not-found');
                    deferred.reject();
                } else {
                    contest.winners.forEach(helpers.formatWinner);
                    res.render(CONTROLLER_NAME + '/details', contest);
                    deferred.resolve();
                }
            }, err => showError(req, res, deferred, err));
        return deferred.promise;
    }
};