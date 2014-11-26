var auth = require('../config/auth');
var controllers = require('../controllers');
var passport = require('passport');

module.exports = function (app) {
    app.route('/register')
        .get(controllers.users.getRegister)
        .post(controllers.users.postRegister);

    app.get('/auth/facebook',
        passport.authenticate('facebook'));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', { failureRedirect: '/login' }),
        function(req, res) {
            res.redirect('/');
        });

    app.route('/profile')
        .get(auth.isAuthenticated, controllers.users.getProfile)
        .post(auth.isAuthenticated, controllers.users.postProfile);

    app.route('/login')
        .get(controllers.users.getLogin)
        .post(auth.login, controllers.users.postLogin);

    app.route('/logout')
        .get(auth.logout, controllers.users.logout);
};