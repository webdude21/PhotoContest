'use strict';

var cloudinary = require('cloudinary'),
    q = require('q'),
    data = require('../data'),
    helpers = require('../utilities/helpers'),
    CLOUDINARY_UPLOAD_FOLDER_NAME = 'contestants',
    CONTROLLER_NAME = 'contestants',
    PAGE_SIZE = 10,
    INVALID_IMAGE_ERROR = 'Моля уверете се, че сте избрали валидно ' + 'изображение от следните формати (gif, jpg, jpeg, tiff, png)!',
    PERMITTED_FORMATS = ['gif', 'jpg', 'jpeg', 'tiff', 'png'];
cloudinary.config(process.env.CLOUDINARY_URL);

var processContestants = function processContestants(contestants) {
    contestants.data.forEach(function (contestant) {
        return contestant.pictures.forEach(function (picture) {
            return picture.url = cloudinary.url(picture.serviceId, { transformation: 'thumbnail', secure: true });
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
        data.contestants.getById(req.params.id, function (err) {
            res.redirect('/not-found');
        }, function (contestant) {
            res.render(CONTROLLER_NAME + '/contestant', contestant);
        });
    },
    getAllApproved: function getAllApproved(req, res) {
        var deferred = q.defer(),
            queryObject = req.query;

        data.contestants.getQuery(function (err) {
            req.session.errorMessage = err;
            res.redirect('/not-found');
            deferred.reject();
        }, function (contestants) {
            processContestants(contestants);
            res.render(CONTROLLER_NAME + '/all', contestants);
            deferred.resolve(contestants);
        }, queryObject, PAGE_SIZE);

        return deferred.promise;
    },
    postRegister: function postRegister(req, res) {
        var newContestant = {},
            cloudinaryFolderSettings = { folder: CLOUDINARY_UPLOAD_FOLDER_NAME },
            savedContestant;

        var handleTheStreamResult = function handleTheStreamResult(result) {
            savedContestant.pictures.push({
                serviceId: result.public_id,
                fileName: filename,
                url: cloudinary.url(result.public_id, { transformation: 'detail', secure: true })
            });
            savedContestant.save();
        };

        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename) {
            if (helpers.fileHasValidExtension(filename, PERMITTED_FORMATS)) {
                var stream = cloudinary.uploader.upload_stream(handleTheStreamResult, cloudinaryFolderSettings);
                file.pipe(stream);
            } else {
                req.session.errorMessage = INVALID_IMAGE_ERROR;
                res.redirect('/contestants/register');
            }
        });

        req.busboy.on('field', function (fieldname, val) {
            newContestant[fieldname] = val;
        });

        req.busboy.on('finish', function () {
            newContestant.registrant = req.user;
            savedContestant = data.contestants.addContestant(newContestant);
            res.redirect(savedContestant._id);
        });
    }
};
