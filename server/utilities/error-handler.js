'use strict';

var globalConstants = require('../config/global-constants.js');

module.exports = {
    redirectToNotFound: function redirectToNotFound(res, deferred) {
        this.rejectPromise(deferred);
        res.redirect(globalConstants.NOT_FOUND_ROUTE);
    },
    redirectToError: function redirectToError(req, res, err, deferred) {
        this.redirectToRoute(req, res, err, globalConstants.ERROR_ROUTE, deferred);
    },
    redirectToRoute: function redirectToRoute(req, res, err, route, deferred) {
        var messageToDisplay = 'No message specified';

        if (!req || !res) {
            throw new Error('You should provide the request & response objects');
        }

        this.rejectPromise(deferred, err);

        if (typeof err === 'string') {
            messageToDisplay = err;
        } else if (err && typeof err.message === 'string') {
            messageToDisplay = err.message;
        }

        req.session.errorMessage = messageToDisplay;
        res.redirect(route || globalConstants.ERROR_ROUTE);
    },
    rejectPromise: function rejectPromise(deferred, err) {
        if (deferred && deferred.reject) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.reject();
            }
        }
    }
};
