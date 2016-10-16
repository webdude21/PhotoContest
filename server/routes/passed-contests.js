var auth = require('../config/auth'),
  controllers = require('../controllers'),
  roles = require('../config/roles'),
  ROUTE_ROOT = '/passed-contests';

module.exports = function ({ app }) {
  app.route(ROUTE_ROOT + '/register')
    .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.passedContests.getRegister)
    .post(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.passedContests.postRegister);

  app.route(ROUTE_ROOT + '/edit')
    .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.passedContests.getEditPassedContests);

  app.route(ROUTE_ROOT + '/edit/:id/toggleVisible')
    .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.passedContests.toggleVisibleById);

  app.route(ROUTE_ROOT + '/edit/:id/addWinner')
    .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.passedContests.getAddWinner)
    .post(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.passedContests.postAddWinner);

  app.route(ROUTE_ROOT + '/edit/:id')
    .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.passedContests.getEditPassedContestsById);

  app.route(ROUTE_ROOT + '/edit/:id/delete')
    .get(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.passedContests.getDeleteContestConfirm)
    .post(auth.isAuthenticated, auth.isInRole(roles.admin), controllers.passedContests.deleteContest);

  app.route(ROUTE_ROOT + '/')
    .get(controllers.passedContests.getPassedContests);

  app.route(ROUTE_ROOT + '/:id')
    .get(controllers.passedContests.getPassedContestById);
};
