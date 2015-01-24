var controllers = require('../controllers');

module.exports = function (app) {
    app.route('/passed-contests/all')
        .get(controllers.passedContests.getAll);

    app.route('/contestants/:id')
        .get();
};