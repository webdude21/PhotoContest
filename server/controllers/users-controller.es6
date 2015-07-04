var encryption = require('../utilities/encryption'),
    data = require('../data'),
    errorHandler = require('../utilities/error-handler'),
    CONTROLLER_NAME = 'users';
require('mongoose').model('User');

module.exports = {
    getProfile: (req, res) => res.render(CONTROLLER_NAME + '/profile', {
        firstName: req.user.firstName,
        lastName: req.user.lastName
    }),
    postProfile: function (req, res) {
        var newUserData = req.body;

        data.userService
            .getUser(req.user.username)
            .then(user => {
                if (newUserData.password && newUserData.confirmPassword) {
                    if (newUserData.password !== newUserData.confirmPassword) {
                        return errorHandler.redirectToRoute(req, res, 'Passwords do not match!', '/profile');
                    } else {
                        user.salt = encryption.generateSalt();
                        user.hashPass = encryption.generateHashedText(user.salt, newUserData.password);
                    }
                } else {
                    user.firstName = newUserData.firstName;
                    user.lastName = newUserData.lastName;
                }

                user.save();
                res.redirect('/');
            }, err => errorHandler.redirectToError(req, res, err));
    },
    getRegister: (req, res) => res.render(CONTROLLER_NAME + '/register'),
    postRegister: function (req, res) {
        var newUserData = req.body;

        data.userService
            .getUser(newUserData.username)
            .then(existingUser => {
                if (existingUser) {
                    errorHandler.redirectToRoute(req, res,
                        'This username/email address is taken, please try another one!', '/register');
                } else if (newUserData.password !== newUserData.confirmPassword) {
                    errorHandler.redirectToRoute(req, res,
                        'Passwords do not match!', '/register');
                } else {
                    newUserData.salt = encryption.generateSalt();
                    newUserData.hashPass = encryption.generateHashedText(newUserData.salt, newUserData.password);
                    data.userService
                        .add(newUserData)
                        .then(newUser => {
                            req.logIn(newUser, err => {
                                if (err) {
                                    errorHandler.redirectToError(req, res,
                                        'A terrible error has occurred! ' + err.toString());
                                }
                                res.redirect('/');
                            });
                        }, err => errorHandler.redirectToRoute(req, res, err, '/register'));
                }
            }, err => errorHandler.redirectToRoute(req, res, err, '/register'));
    },
    getLogin: (req, res) => res.render(CONTROLLER_NAME + '/login'),
    postLogin: (req, res) => req.user ? res.redirect('/') : res.redirect('/login'),
    logout: (req, res) => res.redirect('/')
};