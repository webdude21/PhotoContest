var cloudinary = require('cloudinary');
var q = require('q');
var data = require('../data');
var CLOUDINARY_UPLOAD_FOLDER_NAME = 'contestants';
var CONTROLLER_NAME = 'passed-contests';
var PAGE_SIZE = 10;
var INVALID_IMAGE_ERROR = 'Моля уверете се, че сте избрали валидно ' +
    'изображение от следните формати (gif, jpg, jpeg, tiff, png)!';
cloudinary.config(process.env.CLOUDINARY_URL);

module.exports = {
    getPassedContests: function (req, res, next) {
        var deferred = q.defer();
        res.render(CONTROLLER_NAME + '/all');
        deferred.resolve();
        return deferred.promise;
    }
};