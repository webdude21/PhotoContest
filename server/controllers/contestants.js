var cloudinary = require('cloudinary'),
    constants = require('./../config/global-constants.js'),
    data = require('../data'),
    helpers = require('../utilities/helpers'),
    CONTROLLER_NAME = 'contestants',
    errorHandler = require('../utilities/error-handler'),
    CLOUDINARY_CONFIG = {
        thumbnail: {transformation: 'thumbnail', secure: true},
        detail: {transformation: 'detail', secure: true}
    };

cloudinary.config(process.env.CLOUDINARY_URL);

var processContestants = function (contestants) {
    contestants.data
        .forEach(contestant => contestant.pictures
            .forEach(picture => picture.url = cloudinary.url(picture.serviceId, CLOUDINARY_CONFIG.thumbnail)));
};

module.exports = {
	getRegister: function (req, res) {
		return new Promise(resolve => {
			res.render(`${CONTROLLER_NAME}/register`);
			resolve();
		});
	},
    getById: function (req, res) {
        var disapproved;

        return data.contestantsService
            .getBy(req.params.id)
            .then(function (contestant) {
                if (!contestant.approved) {
                    disapproved = 'Участникът е изключен от конкурса по решение на администратора на приложението!';
                }
                res.render(`${CONTROLLER_NAME}/contestant`, {contestant, disapproved});
            }, () => errorHandler.redirectToNotFound(res));
    },
    getRanking: function (req, res) {
        return new Promise(function (resolve, reject) {
            data.contestantsService
               .getByVoteCount()
               .then(contestants => {
                    res.render(`${CONTROLLER_NAME}/ranking`, {contestants});
                    resolve(contestants);
                }, err => errorHandler.redirectToError(req, res, err, reject));
        });
    },
    getAllApproved: function (req, res) {
        return new Promise(function (resolve, reject) {
            data.contestantsService
                .getQuery(() => errorHandler.redirectToNotFound(res, reject),
                    contestants => {
                        processContestants(contestants);
                        res.render(`${CONTROLLER_NAME}/all`, contestants);
                        resolve(contestants);
                    }, req.query, constants.PAGE_SIZE);
        });
    },
    postRegister: function (req, res) {
        var newContestant = {},
            cloudinaryFolderSettings = {folder: constants.CLOUDINARY_CONTESTANTS_FOLDER_NAME},
            savedContestant;

        req.pipe(req.busboy);

        req.busboy.on('file', (fieldname, file, filename) => {
            if (helpers.fileHasValidExtension(filename, constants.PERMITTED_FORMATS)) {
                var handleTheStreamResult = function (result) {
                    savedContestant.pictures.push({
                        serviceId: result.public_id,
                        fileName: filename,
                        url: cloudinary.url(result.public_id, CLOUDINARY_CONFIG.detail)
                    });
                    savedContestant.save();
                };
                file.pipe(cloudinary.uploader.upload_stream(handleTheStreamResult, cloudinaryFolderSettings));
            } else {
                errorHandler.redirectToRoute(req, res, constants.INVALID_IMAGE_ERROR,
                    null, `${CONTROLLER_NAME}/register`);
            }
        });

        req.busboy.on('field', (fieldname, val) => newContestant[fieldname] = val);

        req.busboy.on('finish', () => {
            if (!newContestant.tos_accepted) {
                errorHandler.redirectToRoute(req, res,
                    constants.TOS_NOT_ACCEPTED_ERROR, null, `${CONTROLLER_NAME}/register`);
            }

            newContestant.registrant = req.user;
            savedContestant = data.contestantsService.add(newContestant);
            res.render(`${CONTROLLER_NAME}/register-success`, {
                contestant: savedContestant,
                pixelCode: constants.FACEBOOK_CAMPAIGN.PIXEL_CODE,
                facebookADCampaignEnabled: constants.FACEBOOK_CAMPAIGN.ENABLED,
                trackingAction: constants.FACEBOOK_CAMPAIGN.TRACKING_ACTION
            });
        });
    },
    CONTROLLER_NAME: CONTROLLER_NAME
};
