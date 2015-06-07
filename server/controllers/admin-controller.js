'use strict';

var cloudinary = require('cloudinary'),
    data = require('../data'),
    globalConstants = require('./../config/global-constants.js'),
    CONTROLLER_NAME = 'admin';

cloudinary.config(process.env.CLOUDINARY_URL);

module.exports = {
    getById: function getById(req, res, next) {
        data.contestants.getById(req.params.id, function (err) {
            return res.redirect('/not-found');
        }, function (contestant) {
            return res.render(CONTROLLER_NAME + '/contestants/contestant', contestant);
        });
    },
    toggleApprovalById: function toggleApprovalById(req, res, next) {
        data.contestants.getById(req.params.id, function () {
            return res.redirect('/not-found');
        }, function (contestant) {
            contestant.approved = !contestant.approved;
            contestant.save();
            res.redirect('/' + CONTROLLER_NAME + '/contestants/' + contestant.id);
        });
    },
    getResetContest: function getResetContest(req, res, next) {
        res.render('confirm', {
            message: {
                title: 'Рестартиране на приложението',
                body: 'Това ще изтрие цялата информация в приложението ' + '(потребители, участници, снимки и гласове) с изключение на администраторските акаунти',
                buttonText: 'Рестарт'
            }
        });
    },
    getResetApplication: function getResetApplication(req, res, next) {
        res.render('confirm', {
            message: {
                title: 'Рестартиране на конкурса',
                body: 'Това ще изтрие цялата информация в приложението ' + '(потребители, участници, снимки и гласове) с изключение на администраторските акаунти',
                buttonText: 'Рестарт'
            }
        });
    },
    postResetApplication: function postResetApplication(req, res, next) {
        data.contestants.deleteAll(function (err) {
            req.session.errorMessage = 'Could not reset the application!' + err;
            res.redirect('/error');
        }, function () {
            data.users.deleteAllNonAdmins(function (err) {
                req.session.errorMessage = 'Could not reset the application!' + err;
                res.redirect('/error');
            }, function () {
                return cloudinary.api.delete_all_resources(function () {
                    return res.redirect('/');
                });
            });
        });
    },
    postResetContest: function postResetContest(req, res, next) {
        data.contestants.deleteAll(function (err) {
            req.session.errorMessage = 'Could not reset the contest!' + err;
            res.redirect('/error');
        }, function () {
            return cloudinary.api.delete_resources_by_prefix(globalConstants.CLOUDINARY_CONTESTANTS_FOLDER_NAME, function () {
                return res.redirect('/');
            });
        });
    },
    getAllContestants: function getAllContestants(req, res, next) {
        var queryObject = req.query;

        if (!queryObject.pager) {
            queryObject.pager = {
                currentPage: +queryObject.page || 1
            };
        }

        if (!queryObject.sort) {
            queryObject.sort = {
                columnName: 'registerDate',
                order: 'desc'
            };
        }

        data.contestants.getQuery(function (err) {
            req.session.errorMessage = err;
            res.redirect('/not-found');
        }, function (contestants) {

            var addClaudinaUrl = function addClaudinaUrl(picture) {
                picture.url = cloudinary.url(picture.serviceId, { transformation: 'thumbnail', secure: true });
            };

            for (var i = 0; i < contestants.data.length; i++) {
                contestants.data[i].pictures.forEach(addClaudinaUrl);
            }

            res.render(CONTROLLER_NAME + '/contestants/all', contestants);
        }, queryObject, globalConstants.PAGE_SIZE);
    }
};
