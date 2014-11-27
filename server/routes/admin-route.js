var auth = require('../config/auth');
var controllers = require('../controllers');
var roles = require('../config/roles');

module.exports = function (app) {
    app.route('/admin/reset-contest')
        .get(auth.isAuthenticated, auth.isInRole([roles.admin]), controllers.admin.getResetContest)
        .post(auth.isAuthenticated, auth.isInRole([roles.admin]), controllers.admin.postResetContest);

    app.route('/admin/reset-application')
        .get(auth.isAuthenticated, auth.isInRole([roles.admin]), controllers.admin.getResetApplication)
        .post(auth.isAuthenticated, auth.isInRole([roles.admin]), controllers.admin.postResetApplication);

    app.route('/admin/contestants')
        .get(auth.isAuthenticated, auth.isInRole([roles.admin]), controllers.admin.getAllContestants);

    app.route('/admin/contestants/:id/editApproval')
        .get(auth.isAuthenticated, auth.isInRole([roles.admin]), controllers.admin.toggleApprovalById);

    app.route('/admin/contestants/:id')
        .get(auth.isAuthenticated, auth.isInRole([roles.admin]), controllers.admin.getById);
};