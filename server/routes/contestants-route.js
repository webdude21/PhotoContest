var auth = require('../config/auth');
var controllers = require('../controllers');

module.exports = function (app) {
    app.route('/contestants/register')
        .get(auth.isAuthenticated, controllers.contestants.getRegister)
        .post(auth.isAuthenticated, controllers.contestants.postRegister);

    app.route('/contestants/all')
        .get(controllers.contestants.getAllApproved);

    app.route('/contestants/:id/vote')
        .get(auth.isAuthenticated, controllers.contestants.vote);

    app.route('/contestants/:id')
        .get(controllers.contestants.getById);
};