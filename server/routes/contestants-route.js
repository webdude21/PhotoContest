'use strict';
var auth = require('../config/auth'),
    controllers = require('../controllers');

module.exports = function (_ref) {
    var app = _ref.app;

    app.route('/contestants/register').get(auth.isAuthenticated, controllers.contestants.getRegister).post(auth.isAuthenticated, controllers.contestants.postRegister);

    app.route('/contestants').get(controllers.contestants.getAllApproved);

    app.route('/contestants/:id').get(controllers.contestants.getById);
};
