var cloudinary = require('cloudinary');
var data = require('../data');
var CLOUDINARY_UPLOAD_FOLDER_NAME = 'contestants/';
var CONTROLLER_NAME = 'admin';
var PAGE_SIZE = 10;
cloudinary.config(process.env.CLOUDINARY_URL);

module.exports = {
    getById: function (req, res, next) {
        data.contestants.getById(req.params.id,
            function (err) {
                res.redirect('/not-found');
            },
            function (contestant) {
                res.render(CONTROLLER_NAME + '/contestants/contestant', contestant);
            });
    },
    toggleApprovalById: function (req, res, next) {
        data.contestants.getById(req.params.id,
            function (err) {
                res.redirect('/not-found');
            },
            function (contestant) {
                contestant.approved = !contestant.approved;
                contestant.save();
                res.redirect('/' + CONTROLLER_NAME + '/contestants/' + contestant.id);
            });
    },
    getResetContest: function (req, res, next) {
        res.render(CONTROLLER_NAME + '/reset-contest');
    },
    getResetApplication: function (req, res, next) {
        res.render(CONTROLLER_NAME + '/reset-application');
    },
    postResetApplication: function (req, res, next) {
        data.contestants.deleteAll(
            function (err) {
                req.session.errorMessage = "Could not reset the application!" + err;
                res.redirect('/error');
            },
            function () {
                data.users.deleteAllNonAdmins(function (err) {
                        req.session.errorMessage = "Could not reset the application!" + err;
                        res.redirect('/error');
                    },
                    function () {
                        cloudinary.api.delete_all_resources(function () {
                            res.redirect('/');
                        });
                    });
            });
    },
    postResetContest: function (req, res, next) {
        data.contestants.deleteAll(
            function (err) {
                req.session.errorMessage = "Could not reset the contest!" + err;
                res.redirect('/error');
            }, function () {
                cloudinary.api.delete_resources_by_prefix(CLOUDINARY_UPLOAD_FOLDER_NAME, function () {
                    res.redirect('/');
                });
            });
    },
    getAllContestants: function (req, res, next) {
        var queryObject = req.query;

        if (!queryObject.pager) {
            queryObject.pager = {
                currentPage: +queryObject.page || 1
            };
        }

        if (!queryObject.sort) {
            queryObject.sort = {
                columnName: "registerDate",
                order: "desc"
            };
        }

        data.contestants.getQuery(function (err) {
            req.session.errorMessage = err;
            res.redirect('/not-found');
        }, function (contestants) {

            var getClaudinaUrl = function (picture) {
                picture.url = cloudinary.url(picture.serviceId, {transformation: 'thumbnail', secure: true});
            };

            for (var i = 0; i < contestants.data.length; i++) {
                contestants.data[i].pictures.forEach(getClaudinaUrl);
            }

            res.render(CONTROLLER_NAME + '/contestants/all', contestants);
        }, queryObject, PAGE_SIZE);
    }
};