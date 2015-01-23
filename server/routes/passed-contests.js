var controllers = require('../controllers');

module.exports = function (app) {
    app.route('/passed-contests/all')
        .get(controllers.passedContests.getPassedContests);

    app.route('/contestants/:id')
        .get();
};