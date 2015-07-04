'use strict';
module.exports = function (req, res, next, app) {
    if (req.session.errorMessage) {
        var msg = req.session.errorMessage;
        req.session.errorMessage = undefined;
        app.locals.errorMessage = msg;
    } else {
        app.locals.errorMessage = undefined;
    }

    if (req.session.successMessage) {
        var successMessage = req.session.successMessage;
        req.session.successMessage = undefined;
        app.locals.successMessage = successMessage;
    } else {
        app.locals.successMessage = undefined;
    }

    next();
};
