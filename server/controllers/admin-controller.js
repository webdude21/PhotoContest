var cloudinary = require('cloudinary');
var data = require('../data');
var CONTROLLER_NAME = 'admin';
var PAGE_SIZE = 10;
cloudinary.config(process.env.CLOUDINARY_URL);

module.exports = {
    getById: function (req, res, next) {
        data.contestants.getById(req.params.id
            , function (err) {
                res.redirect('/not-found');
            }, function (contestant) {
                res.render(CONTROLLER_NAME + '/contestants/contestant', contestant);
            });
    },
    toggleApprovalById: function (req, res, next) {
        data.contestants.getById(req.params.id
            , function (err) {
                res.redirect('/not-found');
            }, function (contestant) {
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
        //TODO Implement functionality
        res.redirect('/');
    },
    postResetContest: function (req, res, next) {
        data.contestants.deleteAll(
            function (err) {
                req.session.errorMessage = "Could not reset the contest!" + err;
                res.redirect('/error');
            }, function () {
                cloudinary.api.delete_all_resources(function(){
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
            }
        }

        data.contestants.getQuery(function (err) {
            req.session.errorMessage = err;
            res.redirect('/not-found');
        }, function (contestants) {
            for (var i = 0; i < contestants.data.length; i++) {
                contestants.data[i].pictures.forEach(function (picture) {
                    picture.url = cloudinary.url(picture.serviceId, {transformation: 'thumbnail', secure: true});
                });
            }

            res.render(CONTROLLER_NAME + '/contestants/all', contestants);
        }, queryObject, PAGE_SIZE);
    }
};