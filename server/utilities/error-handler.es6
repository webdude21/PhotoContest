var globalConstants = require('../config/global-constants.js');

module.exports = {
    redirectToNotFound: function (res) {
        res.redirect(globalConstants.NOT_FOUND_ROUTE);
    },
    redirectToError: function (req, res, err) {
        if (!req || !res) {
            throw new Error('You should provide the request & response objects');
        }

        req.session.errorMessage = err;
        res.redirect(globalConstants.ERROR_ROUTE);
    }
};