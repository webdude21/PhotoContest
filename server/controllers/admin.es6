var cloudinary = require('cloudinary'),
    data = require('../data'),
    globalConstants = require('../config/global-constants.js'),
    CONTROLLER_NAME = 'admin',
    errorHandler = require('../utilities/error-handler');

cloudinary.config(process.env.CLOUDINARY_URL);

module.exports = {
    getById: function (req, res) {
        data.contestantsService
            .getBy(req.params.id)
            .then(contestant => res.render(CONTROLLER_NAME + '/contestants/contestant', contestant),
            () => errorHandler.redirectToNotFound(res));
    },
    toggleApprovalById: function (req, res) {
        data.contestantsService
            .getBy(req.params.id)
            .then(contestant => {
                contestant.approved = !contestant.approved;
                contestant.save();
                res.redirect('/' + CONTROLLER_NAME + '/contestants/' + contestant.id);
            }, () => errorHandler.redirectToNotFound(res));
    },
    getResetContest: (req, res) => res.render('confirm', {
        message: {
            title: 'Рестартиране на приложението',
            body: 'Това ще изтрие цялата информация в приложението ' +
            '(потребители, участници, снимки и гласове) с изключение на администраторските акаунти',
            buttonText: 'Рестарт'
        }
    }),
    getResetApplication: (req, res) => res.render('confirm', {
        message: {
            title: 'Рестартиране на конкурса',
            body: 'Това ще изтрие цялата информация в приложението ' +
            '(потребители, участници, снимки и гласове) с изключение на администраторските акаунти',
            buttonText: 'Рестарт'
        }
    }),
    postResetApplication: (req, res) => {
        data.contestantsService
            .deleteAll()
            .then(() => {
                data.users
                    .deleteAllNonAdmins()
                    .then(() => cloudinary.api.delete_all_resources(() => res.redirect('/')),
                        err => errorHandler.redirectToError(req, res, 'Could not reset the application!' + err));
            }, err => errorHandler.redirectToError(req, res, 'Could not reset the application!' + err));
    },
    postResetContest: (req, res) => {
        data.contestantsService
            .deleteAll()
            .then(() => cloudinary.api.delete_resources_by_prefix(globalConstants.CLOUDINARY_CONTESTANTS_FOLDER_NAME,
                () => res.redirect('/')),
                err => errorHandler.redirectToError(req, res, 'Could not reset the contest!' + err));
    },
    getAllContestants: (req, res) => {
        var queryObject = req.query;

        data.contestantsService
            .getAdminQuery(err => errorHandler.redirectToError(req, res, 'Could not reset the application!' + err),
                contestants => {
                contestants.data.forEach(contestant => contestant.pictures.forEach(picture => {
                    picture.url = cloudinary.url(picture.serviceId, {transformation: 'thumbnail', secure: true});
                }));

                res.render(CONTROLLER_NAME + '/contestants/all', contestants);
            }, queryObject, globalConstants.PAGE_SIZE);
    }
};