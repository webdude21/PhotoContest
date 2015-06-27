'use strict';

var cloudinary = require('cloudinary'),
    globalConstants = require('./../config/global-constants.js'),
    q = require('q'),
    data = require('../data'),
    helpers = require('../utilities/helpers'),
    CONTROLLER_NAME = 'contestants';

cloudinary.config(process.env.CLOUDINARY_URL);

var processContestants = function processContestants(contestants) {
    contestants.data.forEach(function (contestant) {
        return contestant.pictures.forEach(function (picture) {
            picture.url = cloudinary.url(picture.serviceId, { transformation: 'thumbnail', secure: true });
        });
    });
};

module.exports = {
    getRegister: function getRegister(req, res) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/register');
        deferred.resolve();
        return deferred.promise;
    },
    getById: function getById(req, res) {
        return data.contestantsService.getBy(req.params.id).then(function (contestant) {
            return res.render(CONTROLLER_NAME + '/contestant', contestant);
        }, function (err) {
            return res.redirect('/not-found');
        });
    },
    getAllApproved: function getAllApproved(req, res) {
        var deferred = q.defer(),
            queryObject = req.query;

        data.contestantsService.getQuery(function (err) {
            req.session.errorMessage = err;
            res.redirect('/not-found');
            deferred.reject();
        }, function (contestants) {
            processContestants(contestants);
            res.render(CONTROLLER_NAME + '/all', contestants);
            deferred.resolve(contestants);
        }, queryObject, globalConstants.PAGE_SIZE);

        return deferred.promise;
    },
    postRegister: function postRegister(req, res) {
        var newContestant = {},
            cloudinaryFolderSettings = { folder: globalConstants.CLOUDINARY_CONTESTANTS_FOLDER_NAME },
            savedContestant;

        req.pipe(req.busboy);

        req.busboy.on('file', function (fieldname, file, filename) {
            if (helpers.fileHasValidExtension(filename, globalConstants.PERMITTED_FORMATS)) {
                var handleTheStreamResult = function handleTheStreamResult(result) {
                    savedContestant.pictures.push({
                        serviceId: result.public_id,
                        fileName: filename,
                        url: cloudinary.url(result.public_id, { transformation: 'detail', secure: true })
                    });
                    savedContestant.save();
                };
                file.pipe(cloudinary.uploader.upload_stream(handleTheStreamResult, cloudinaryFolderSettings));
            } else {
                req.session.errorMessage = globalConstants.INVALID_IMAGE_ERROR;
                res.redirect('/contestants/register');
            }
        });

        req.busboy.on('field', function (fieldname, val) {
            newContestant[fieldname] = val;
        });

        req.busboy.on('finish', function () {
            newContestant.registrant = req.user;
            savedContestant = data.contestantsService.add(newContestant);
            res.redirect(savedContestant._id);
        });
    }
};
