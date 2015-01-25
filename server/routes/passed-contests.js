var auth = require('../config/auth');
var controllers = require('../controllers');
var roles = require('../config/roles');
var ROUTE_ROOT = '/passed-contests';

module.exports = function (app) {
    app.route(ROUTE_ROOT + "/register")
        .get(auth.isAuthenticated, auth.isInRole([roles.admin]), controllers.passedContests.getRegister);

    app.route(ROUTE_ROOT + "/all")
        .get(controllers.passedContests.getPassedContests);

    app.route(ROUTE_ROOT + "/:id")
        .get();
};