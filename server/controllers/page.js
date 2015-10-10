'use strict';

var q = require('q'),
    data = require('../data'),
    errorHandler = require('../utilities/error-handler');

module.exports = {
    getTos: function getTos(req, res) {
        var deferred = q.defer();

        data.pageService.getFirstPage().then(function (page) {
            res.render('tos', page);
            deferred.resolve();
        }, function () {
            return errorHandler.redirectToNotFound(req, deferred);
        });

        return deferred.promise;
    }
};
