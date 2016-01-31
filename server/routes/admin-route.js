'use strict';
var auth = require('../config/auth'),
    roles = require('../config/roles'),
    controllers = require('../controllers');
const ROUTE_BASE = '/admin/';

module.exports = function ({ app }) {

    app.route(ROUTE_BASE + 'users/all')
        .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.getAllRegisteredUsers);

    app.route(ROUTE_BASE + 'users/:id')
        .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.getRegisteredUserById);

    app.route(ROUTE_BASE + 'reset-contest')
        .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.getResetContest)
        .post(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.postResetContest);

    app.route(ROUTE_BASE + 'reset-application')
        .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.getResetApplication)
        .post(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.postResetApplication);

    app.route(ROUTE_BASE + 'contestants')
        .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.getAllContestants);

    app.route(ROUTE_BASE + 'contestants/list')
        .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.getAllContestantsAsList);

    app.route(ROUTE_BASE + 'contestants/:id/editApproval')
        .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.toggleApprovalById);

    app.route(ROUTE_BASE + 'contestants/:id')
        .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.getById);

    app.route(ROUTE_BASE + 'edit-tos')
        .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.getEditTos)
        .post(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.admin.postEditTos);
};
