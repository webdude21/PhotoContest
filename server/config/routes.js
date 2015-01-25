var routes = require('../routes');

module.exports = function (app) {
    routes.usersRoute(app);
    routes.adminRoute(app);
    routes.contestantsRoute(app);
    routes.passedContests(app);
    routes.defaultRoute(app);
};
