'use strict';

var cloudinary = require('cloudinary'),
    data = require('../data'),
    globalConstants = require('../config/global-constants.js'),
    CONTROLLER_NAME = 'admin';

cloudinary.config(process.env.CLOUDINARY_URL);

module.exports = {
    getById: function getById(req, res) {
        data.contestantsService.getBy(req.params.id).then(function (contestant) {
            return res.render(CONTROLLER_NAME + '/contestants/contestant', contestant);
        }, function (err) {
            return res.redirect(globalConstants);
        });
    },
    toggleApprovalById: function toggleApprovalById(req, res) {
        data.contestantsService.getBy(req.params.id).then(function (contestant) {
            contestant.approved = !contestant.approved;
            contestant.save();
            res.redirect('/' + CONTROLLER_NAME + '/contestants/' + contestant.id);
        }, function () {
            return res.redirect('/not-found');
        });
    },
    getResetContest: function getResetContest(req, res, next) {
        return res.render('confirm', {
            message: {
                title: 'Рестартиране на приложението',
                body: 'Това ще изтрие цялата информация в приложението ' + '(потребители, участници, снимки и гласове) с изключение на администраторските акаунти',
                buttonText: 'Рестарт'
            }
        });
    },
    getResetApplication: function getResetApplication(req, res, next) {
        return res.render('confirm', {
            message: {
                title: 'Рестартиране на конкурса',
                body: 'Това ще изтрие цялата информация в приложението ' + '(потребители, участници, снимки и гласове) с изключение на администраторските акаунти',
                buttonText: 'Рестарт'
            }
        });
    },
    postResetApplication: function postResetApplication(req, res) {
        data.contestantsService.deleteAll().then(function () {
            data.users.deleteAllNonAdmins().then(function (err) {
                req.session.errorMessage = 'Could not reset the application!' + err;
                res.redirect('/error');
            }, function () {
                return cloudinary.api.delete_all_resources(function () {
                    return res.redirect('/');
                });
            });
        }, function (err) {
            req.session.errorMessage = 'Could not reset the application!' + err;
            res.redirect('/error');
        });
    },
    postResetContest: function postResetContest(req, res) {
        data.contestantsService.deleteAll().then(function () {
            return cloudinary.api.delete_resources_by_prefix(globalConstants.CLOUDINARY_CONTESTANTS_FOLDER_NAME, function () {
                return res.redirect('/');
            });
        }, function (err) {
            req.session.errorMessage = 'Could not reset the contest!' + err;
            res.redirect('/error');
        });
    },
    getAllContestants: function getAllContestants(req, res) {
        var queryObject = req.query;

        data.contestantsService.getAdminQuery(function (err) {
            req.session.errorMessage = err;
            res.redirect('/not-found');
        }, function (contestants) {
            contestants.data.forEach(function (contestant) {
                return contestant.pictures.forEach(function (picture) {
                    picture.url = cloudinary.url(picture.serviceId, { transformation: 'thumbnail', secure: true });
                });
            });

            res.render(CONTROLLER_NAME + '/contestants/all', contestants);
        }, queryObject, globalConstants.PAGE_SIZE);
    }
};
