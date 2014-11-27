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