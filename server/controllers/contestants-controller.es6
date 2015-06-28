var cloudinary = require('cloudinary'),
    globalConstants = require('./../config/global-constants.js'),
    q = require('q'),
    data = require('../data'),
    helpers = require('../utilities/helpers'),
    CONTROLLER_NAME = 'contestants',
    errorHandler = require('../utilities/error-handler');

cloudinary.config(process.env.CLOUDINARY_URL);

var processContestants = function (contestants) {
    contestants.data
        .forEach(contestant => contestant.pictures.
            forEach(picture => {
                picture.url = cloudinary.url(picture.serviceId, {transformation: 'thumbnail', secure: true});
            }));
};

module.exports = {
    getRegister: function (req, res) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/register');
        deferred.resolve();
        return deferred.promise;
    },
    getById: function (req, res) {
        return data.contestantsService
            .getBy(req.params.id)
            .then(contestant => res.render(CONTROLLER_NAME + '/contestant', contestant),
            () => errorHandler.redirectToNotFound(res));
    },
    getAllApproved: function (req, res) {
        var deferred = q.defer(),
            queryObject = req.query;

        data.contestantsService
            .getQuery(() => errorHandler.redirectToNotFound(res, deferred),
                contestants => {
                processContestants(contestants);
                res.render(CONTROLLER_NAME + '/all', contestants);
                deferred.resolve(contestants);
            }, queryObject, globalConstants.PAGE_SIZE);

        return deferred.promise;
    },
    postRegister: function (req, res) {
        var newContestant = {},
            cloudinaryFolderSettings = {folder: globalConstants.CLOUDINARY_CONTESTANTS_FOLDER_NAME},
            savedContestant;

        req.pipe(req.busboy);

        req.busboy.on('file', (fieldname, file, filename) => {
            if (helpers.fileHasValidExtension(filename, globalConstants.PERMITTED_FORMATS)) {
                var handleTheStreamResult = function (result) {
                    savedContestant.pictures.push({
                        serviceId: result.public_id,
                        fileName: filename,
                        url: cloudinary.url(result.public_id, {transformation: 'detail', secure: true})
                    });
                    savedContestant.save();
                };
                file.pipe(cloudinary.uploader.upload_stream(handleTheStreamResult, cloudinaryFolderSettings));
            } else {
                errorHandler.redirectToRoute(req, res, globalConstants.INVALID_IMAGE_ERROR, null, '/contestants/register');
            }
        });

        req.busboy.on('field', (fieldname, val) => {
            newContestant[fieldname] = val
        });

        req.busboy.on('finish', () => {
            newContestant.registrant = req.user;
            savedContestant = data.contestantsService.add(newContestant);
            res.redirect(savedContestant._id);
        });
    }
};