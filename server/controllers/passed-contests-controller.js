var cloudinary = require('cloudinary');
var q = require('q');
var data = require('../data');
var CONTROLLER_NAME = 'passed-contests';
cloudinary.config(process.env.CLOUDINARY_URL);

module.exports = {
    getAll: function (req, res, next) {
        var deferred = q.defer();

        data.passedContests.getAll(
            function (err) {
                deferred.reject();
                res.redirect('/not-found');
            },
            function (passedContests) {
                res.render(CONTROLLER_NAME + '/all', passedContests);
                deferred.resolve();
            });
    }
};