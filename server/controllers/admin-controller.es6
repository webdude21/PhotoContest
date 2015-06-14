var cloudinary = require('cloudinary'),
    data = require('../data'),
    globalConstants = require('./../config/global-constants.js'),
    CONTROLLER_NAME = 'admin';

cloudinary.config(process.env.CLOUDINARY_URL);

module.exports = {
    getById: function (req, res, next) {
        data.contestants.getById(req.params.id, err => res.redirect('/not-found'),
                contestant => res.render(CONTROLLER_NAME + '/contestants/contestant', contestant));
    },
    toggleApprovalById: function (req, res, next) {
        data.contestants.getById(req.params.id, () => res.redirect('/not-found'),
            function (contestant) {
                contestant.approved = !contestant.approved;
                contestant.save();
                res.redirect('/' + CONTROLLER_NAME + '/contestants/' + contestant.id);
            });
    },
    getResetContest: (req, res, next) => res.render("confirm", {
        message: {
            title: "Рестартиране на приложението",
            body: "Това ще изтрие цялата информация в приложението " +
            "(потребители, участници, снимки и гласове) с изключение на администраторските акаунти",
            buttonText: "Рестарт"
        }
    }),
    getResetApplication: (req, res, next) => res.render("confirm", {
        message: {
            title: "Рестартиране на конкурса",
            body: "Това ще изтрие цялата информация в приложението " +
            "(потребители, участници, снимки и гласове) с изключение на администраторските акаунти",
            buttonText: "Рестарт"
        }
    }),
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
                }, () => cloudinary.api.delete_all_resources(() => res.redirect('/')));
            });
    },
    postResetContest: function (req, res, next) {
        data.contestants.deleteAll(
            function (err) {
                req.session.errorMessage = "Could not reset the contest!" + err;
                res.redirect('/error');
            }, () => cloudinary.api.delete_resources_by_prefix(globalConstants.CLOUDINARY_CONTESTANTS_FOLDER_NAME,
                () => res.redirect('/')));
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

        data.contestants.getAdminQuery(function (err) {
            req.session.errorMessage = err;
            res.redirect('/not-found');
        }, function (contestants) {

            contestants.data.forEach(contestant => contestant.pictures.forEach(picture => {
                picture.url = cloudinary.url(picture.serviceId, {transformation: 'thumbnail', secure: true});
            }));

            res.render(CONTROLLER_NAME + '/contestants/all', contestants);
        }, queryObject, globalConstants.PAGE_SIZE);
    }
};