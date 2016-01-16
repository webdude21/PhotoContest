var cloudinary = require('cloudinary'),
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

function retrieveContest(req, res, contestReject) {
    return new Promise(function (resolve, reject) {
        data.contestService
            .getBy(req.params.id)
            .then(result => {
                if (result === null) {
                    showError(req, res, contestReject, NO_SUCH_CONTEST);
                    reject('No such contest');
                } else {
                    resolve(result);
                }
            }, () => {
                showError(req, res, contestReject, NO_SUCH_CONTEST);
                reject('Failed to get the contest data');
            });
    });
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

    req.busboy.on('field', (fieldname, val) => newWinner[fieldname] = val);

    req.busboy.on('finish', () => {
        req.session.successMessage = 'Участника беше успешно добавен!';
        res.redirect(EDIT_CONTEST_ROUTE + req.params.id);
        deferred.resolve();
    });
}
module.exports = {
    getAddWinner: function (req, res) {
        return new Promise(resolve => {
            res.render(CONTROLLER_NAME + '/addWinner');
            resolve();
        });
    },
    postAddWinner: function (req, res) {
		return new Promise(function (resolve, reject) {
			retrieveContest(req, res, reject)
				.then(contest => addWinner(req, globalConstants.PERMITTED_FORMATS, res, reject, contest));
		});
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
        var contestId = req.params.id;

        return new Promise(function (resolve, reject) {
            data.contestService
                .deleteBy(contestId)
                .then(() => {
                    cloudinary.api
                        .delete_resources_by_prefix(globalConstants.CLOUDINARY_WINNERS_FOLDER_NAME + '/' + contestId,
                            () => {
                                req.session.successMessage = 'Конкурса беше изтрит успешно';
                                res.redirect(EDIT_CONTEST_ROUTE);
                                resolve();
                            });
                }, err => showError(req, res, reject, err));
        });
    },
    getPassedContests: function (req, res) {
        return new Promise(function (resolve, reject) {
            data.contestService
                .getAllVisible()
                .then(contests => {
                    if (contests === null) {
                        res.redirect(globalConstants.NOT_FOUND_ROUTE);
                        reject();
                    } else {
                        res.render(CONTROLLER_NAME + '/all', {data: contests});
                        resolve();
                    }
                }, err => showError(req, res, reject, err));
        });
    },
    getEditPassedContests: function (req, res) {
        return new Promise(function (resolve, reject) {
            data.contestService
                .getAll()
                .then(contests => {
                    if (contests === null) {
                        res.redirect(globalConstants.NOT_FOUND_ROUTE);
                        reject();
                    } else {
                        res.render(CONTROLLER_NAME + '/edit', {data: contests});
                        resolve();
                    }
                }, err => showError(req, res, reject, err));
        });
    },
    getEditPassedContestsById: function (req, res) {
        return new Promise(function (resolve, reject) {
            data.contestService
                .getBy(req.params.id)
                .then(contest => {
                    if (contest === null) {
                        res.redirect(globalConstants.NOT_FOUND_ROUTE);
                        reject();
                    } else {
                        contest.winners.forEach(helpers.formatWinner);
                        res.render('admin/contest/detail', contest);
                        resolve();
                    }
                }, err => showError(req, res, reject, err));
        });
    },
    toggleVisibleById: function (req, res) {
        data.contestService
            .getBy(req.params.id)
            .then(contest => {
                contest.visible = !contest.visible;
                contest.save();
                res.redirect(EDIT_CONTEST_ROUTE + contest.id);
            }, () => res.redirect(globalConstants.NOT_FOUND_ROUTE));
    },
    getRegister: function (req, res) {
        return new Promise(resolve => {
            res.render(CONTROLLER_NAME + '/register');
            resolve();
        });
    },
    postRegister: function (req, res) {
        var savedContest = data.contestService.add(req.body);
        req.session.successMessage = 'Конкурса е успешно записан!';

        return new Promise(resolve => {
            res.redirect(savedContest._id);
            resolve();
        });
    },
    getPassedContestById: function (req, res) {
        return new Promise(function (resolve, reject) {
            data.contestService
                .getBy(req.params.id)
                .then(contest => {
                    if (contest === null) {
                        res.redirect(globalConstants.NOT_FOUND_ROUTE);
                        reject();
                    } else {
                        contest.winners.forEach(helpers.formatWinner);
                        res.render(CONTROLLER_NAME + '/details', contest);
                        resolve();
                    }
                }, err => showError(req, res, reject, err));
        });
    }
};
