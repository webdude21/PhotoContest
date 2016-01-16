var globalConstants = require('../config/global-constants.js');

module.exports = {
    redirectToNotFound: function (res, reject) {
        this.rejectPromise(reject);
        res.redirect(globalConstants.NOT_FOUND_ROUTE);
    },
    redirectToError: function (req, res, err, reject) {
        this.redirectToRoute(req, res, err, globalConstants.ERROR_ROUTE, reject);
    },
    redirectToRoute: function (req, res, err, route, reject) {
        var messageToDisplay = 'No message specified';

        if (!req || !res) {
            throw new Error('You should provide the request & response objects');
        }

        this.rejectPromise(reject, err);

        if (typeof err === 'string') {
            messageToDisplay = err;
        } else if (err && typeof err.message === 'string') {
            messageToDisplay = err.message;
        }

        req.session.errorMessage = messageToDisplay;
        res.redirect(route || globalConstants.ERROR_ROUTE);
    },
    rejectPromise: function (reject, err) {
        if (typeof reject === 'function') {
            if (err) {
                reject(err);
            } else {
                reject();
            }
        }
    }
};
