var auth = require('../config/auth');
var controllers = require('../controllers');
var roles = require('../config/roles');

module.exports = function (app) {
    app.route('/admin/contestants')
        .get(auth.isAuthenticated, auth.isInRole([roles.admin]), controllers.admin.getAllContestants);

    app.route('/admin/contestants/:id')
        .get(auth.isAuthenticated, auth.isInRole([roles.admin]), controllers.admin.getById);
};