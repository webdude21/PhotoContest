var cloudinary = require('cloudinary'),
    q = require('q'),
    data = require('../data'),
    CLOUDINARY_UPLOAD_FOLDER_NAME = 'winners',
    CONTROLLER_NAME = 'passed-contests',
    NO_SUCH_CONTEST = "Не съществува такъв конкурс",
    INVALID_IMAGE_ERROR = 'Моля уверете се, че сте избрали валидно ' +
        'изображение от следните формати (gif, jpg, jpeg, tiff, png)!';
cloudinary.config(process.env.CLOUDINARY_URL);

function _showError(req, res, deferred, message) {
    req.session.errorMessage = message;
    res.redirect("/");
    deferred.reject();
}

function _retrieveContest(req, res, deferred) {
    var deferredContest = q.defer();

    data.contest.getById(req.params.id,
        function (err) {
            _showError(req, res, deferred, NO_SUCH_CONTEST);
            deferredContest.reject("Failed to get the contest data");
        },
        function (result) {
            if (result == null) {
                _showError(req, res, deferred, NO_SUCH_CONTEST);
                deferredContest.reject("No such contest");
            } else {
                deferredContest.resolve(result);
            }
        });

    return deferredContest.promise;
}

function _addWinner(req, permittedFormats, res, deferred, contest) {
    var newWinner = {};
    newWinner.pictures = [];
    req.pipe(req.busboy);

    req.busboy.on('file', function (fieldname, file, filename) {
        if (filename && filename.indexOf('.') && permittedFormats.indexOf(filename.split('.')[1]) > -1) {
            var stream = cloudinary.uploader.upload_stream(function (result) {
                newWinner.pictures.push({
                    serviceId: result.public_id,
                    fileName: filename,
                    url: cloudinary.url(result.public_id, {transformation: 'detail', secure: true})
                });
                contest.save();
            }, {folder: CLOUDINARY_UPLOAD_FOLDER_NAME});

            file.pipe(stream);

        } else {
            _showError(req, res, deferred, INVALID_IMAGE_ERROR);
        }
    });

    req.busboy.on('field', function (fieldname, val) {
        newWinner[fieldname] = val;
    });

    req.busboy.on('finish', function () {
        if (!contest.winners) {
            contest.winners = [];
        }
        contest.winners.push(newWinner);
        res.redirect("/" + CONTROLLER_NAME + "/edit/" + req.params.id);
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
        var deferred = q.defer(),
            permittedFormats = ['gif', 'jpg', 'jpeg', 'tiff', 'png'];

        _retrieveContest(req, res, deferred).then(function (contest) {
            _addWinner(req, permittedFormats, res, deferred, contest);
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
        var deferred = q.defer();
        data.contest.deleteById(req.params.id,
            function (err) {
                _showError(req, res, deferred, err);
            }, function (result) {
                res.redirect("/");
                deferred.resolve();
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