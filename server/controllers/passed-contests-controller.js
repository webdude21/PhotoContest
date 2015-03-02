var cloudinary = require('cloudinary'),
    q = require('q'),
    data = require('../data'),
    ROUTE_ROOT = "/",
    CLOUDINARY_UPLOAD_FOLDER_NAME = 'winners',
    CONTROLLER_NAME = 'passed-contests',
    NO_SUCH_CONTEST = "Не съществува такъв конкурс",
    INVALID_IMAGE_ERROR = 'Моля уверете се, че сте избрали валидно ' +
        'изображение от следните формати (gif, jpg, jpeg, tiff, png)!',
    PERMITTED_FORMATS = ['gif', 'jpg', 'jpeg', 'tiff', 'png'],
    EDIT_CONTEST_ROUTE = "/" + CONTROLLER_NAME + "/edit/";


cloudinary.config(process.env.CLOUDINARY_URL);

function _showError(req, res, deferred, message, redirectRoute) {
    req.session.errorMessage = message;
    res.redirect(redirectRoute || ROUTE_ROOT);
    deferred.reject();
}

function _fileHasValidExtension(filename, permittedFormats, inputDelimiter) {
    var delimiter = inputDelimiter || '.';
    var indexOfDelimiter = filename.lastIndexOf(delimiter);
    return filename && indexOfDelimiter > 0 && permittedFormats.indexOf(filename.slice(indexOfDelimiter) > -1);
}

function _formatWinner(winner) {
    var formattedWinner = winner;
    formattedWinner.text = winner.prize.slice(0, 1).toLocaleUpperCase() + winner.prize.slice(1) +
    ", " + winner.award.toLocaleLowerCase() + ' спечели ';
    formattedWinner.text += winner.fullName;

    if (winner.age) {
        formattedWinner.text += ' на ' + winner.age;
    }

    if (winner.town) {
        formattedWinner.text += ' от ' + winner.town;
    }

    return formattedWinner;
}

function _retrieveContest(req, res, deferred) {
    var deferredContest = q.defer();

    data.contest.getById(req.params.id,
        function (err) {
            _showError(req, res, deferred, NO_SUCH_CONTEST);
            deferredContest.reject("Failed to get the contest data");
        },
        function (result) {
            if (result === null) {
                _showError(req, res, deferred, NO_SUCH_CONTEST);
                deferredContest.reject("No such contest");
            } else {
                deferredContest.resolve(result);
            }
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
        if (_fileHasValidExtension(filename,permittedFormats)) {
            var stream = cloudinary.uploader.upload_stream(function (result) {
                newWinner.pictures.push({
                    serviceId: result.public_id,
                    fileName: filename,
                    url: cloudinary.url(result.public_id, {transformation: 'detail', secure: true})
                });
                _saveWinner(contest, newWinner);
            }, {folder: CLOUDINARY_UPLOAD_FOLDER_NAME + '/' + contest.id});
            file.pipe(stream);
        } else {
            _showError(req, res, deferred, INVALID_IMAGE_ERROR, EDIT_CONTEST_ROUTE + req.params.id + "/addWinner");
        }
    });

    req.busboy.on('field', function (fieldname, val) {
        newWinner[fieldname] = val;
    });

    req.busboy.on('finish', function () {
        req.session.successMessage = "Участника беше успешно добавен!";
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
    postAddWinner: function (req, res, next) {
        var deferred = q.defer();
        _retrieveContest(req, res, deferred).then(function (contest) {
            _addWinner(req, PERMITTED_FORMATS, res, deferred, contest);
        });

        return deferred.promise;
    },
    getDeleteContestConfirm: function (req, res, next) {
        res.render("confirm", {
            message: {
                title: "Изтриване на конкурс",
                body: "Сигурне ли сте, че искате да изтриете този конкурс (действието е необратимо)",
                buttonText: "Изтрий"
            }
        });
    },
    deleteContest: function (req, res) {
        var deferred = q.defer(),
            contestId = req.params.id;
        data.contest.deleteById(contestId, function (err) {
            _showError(req, res, deferred, err);
        }, function (result) {
            cloudinary.api.delete_resources_by_prefix(CLOUDINARY_UPLOAD_FOLDER_NAME + '/' + contestId,
                function () {
                    req.session.successMessage = "Конкурса беше изтрит успешно";
                    res.redirect(EDIT_CONTEST_ROUTE);
                    deferred.resolve();
                });
        });

        return deferred.promise;
    },
    getPassedContests: function (req, res) {
        var deferred = q.defer();
        data.contest.getAllVisible(function (err) {
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
        data.contest.getAll(function (err) {
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
            function (contest) {
                if (contest === null) {
                    res.redirect('/not-found');
                    deferred.reject();
                } else {
                    contest.winners.forEach(_formatWinner);
                    res.render("admin/contest/detail", contest);
                    deferred.resolve();
                }
            });
        return deferred.promise;
    },
    toggleVisibleById: function (req, res, next) {
        data.contest.getById(req.params.id,
            function (err) {
                res.redirect('/not-found');
            },
            function (contest) {
                contest.visible = !contest.visible;
                contest.save();
                res.redirect(EDIT_CONTEST_ROUTE + contest.id);
            });
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
        req.session.successMessage = "Конкурса е успешно записан!";
        res.redirect(savedContest._id);
        deferred.resolve();
        return deferred.promise;
    },
    getPassedContestById: function (req, res) {
        var deferred = q.defer();
        data.contest.getById(req.params.id,
            function (err) {
                req.session.errorMessage = err;
                res.redirect('/not-found');
                deferred.reject();
            },
            function (contest) {
                if (contest === null) {
                    res.redirect('/not-found');
                    deferred.reject();
                } else {
                    contest.winners.forEach(_formatWinner);
                    res.render(CONTROLLER_NAME + '/details', contest);
                    deferred.resolve();
                }
            });
        return deferred.promise;
    }
};