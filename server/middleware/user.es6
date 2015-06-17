var roles = require('../config/roles');

module.exports = function (req, res, next, app) {
	app.locals.currentUser = req.user;
	res.locals.path = req.path;
	app.locals.admin = req.user && req.user.roles.indexOf(roles.admin) > -1 ? true : false;
	next();
};