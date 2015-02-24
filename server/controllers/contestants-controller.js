var cloudinary = require('cloudinary'),
    q = require('q'),
    data = require('../data'),
    CLOUDINARY_UPLOAD_FOLDER_NAME = 'contestants',
    CONTROLLER_NAME = 'contestants',
    PAGE_SIZE = 10,
    INVALID_IMAGE_ERROR = 'Моля уверете се, че сте избрали валидно ' +
        'изображение от следните формати (gif, jpg, jpeg, tiff, png)!';
cloudinary.config(process.env.CLOUDINARY_URL);

module.exports = {
    getRegister: function (req, res, next) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/register');
        deferred.resolve();
        return deferred.promise;
    },
    getById: function (req, res, next) {
        data.contestants.getById(req.params.id,
            function (err) {
                res.redirect('/not-found');
            },
            function (contestant) {
                res.render(CONTROLLER_NAME + '/contestant', contestant);
            });
    },
    getAllApproved: function (req, res, next) {
        var deferred = q.defer();

        var queryObject = req.query;

        queryObject.columns = [
            {name: "approved", label: 'Text', filter: true, filterable: true, sortable: true, method: "equals"}
        ];

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
            deferred.reject();
        }, function (contestants) {

            var getClaudinaUrl = function (picture) {
                picture.url = cloudinary.url(picture.serviceId, {transformation: 'thumbnail', secure: true});
            };

            for (var i = 0; i < contestants.data.length; i++) {
                contestants.data[i].pictures.forEach(getClaudinaUrl);
            }

            res.render(CONTROLLER_NAME + '/all', contestants);
            deferred.resolve();
        }, queryObject, PAGE_SIZE);

        return deferred.promise;
    },
    postRegister: function (req, res, next) {
        var newContestant = {};
        var permittedFormats = ['gif', 'jpg', 'jpeg', 'tiff', 'png'];
        var savedContestant;

        req.pipe(req.busboy);
        req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            if (filename && filename.indexOf('.') && permittedFormats.indexOf(filename.split('.')[1]) > -1) {
                var stream = cloudinary.uploader.upload_stream(function (result) {
                    savedContestant.pictures.push({
                        serviceId: result.public_id,
                        fileName: filename,
                        url: cloudinary.url(result.public_id, {transformation: 'detail', secure: true})
                    });
                    savedContestant.save();
                }, {folder: CLOUDINARY_UPLOAD_FOLDER_NAME});

                file.pipe(stream);

            } else {
                req.session.errorMessage = INVALID_IMAGE_ERROR;
                res.redirect("/contestants/register");
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