'use strict';

var encryption = require('../utilities/encryption'),
    data = require('../data'),
    errorHandler = require('../utilities/error-handler'),
    CONTROLLER_NAME = 'users';
require('mongoose').model('User');

module.exports = {
    getProfile: function getProfile(req, res) {
        return res.render(CONTROLLER_NAME + '/profile', {
            firstName: req.user.firstName,
            lastName: req.user.lastName
        });
    },
    postProfile: function postProfile(req, res) {
        var newUserData = req.body;

        data.userService.getUser(req.user.username).then(function (user) {
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
        }, function (err) {
            return errorHandler.redirectToError(req, res, err);
        });
    },
    getRegister: function getRegister(req, res) {
        return res.render(CONTROLLER_NAME + '/register');
    },
    postRegister: function postRegister(req, res) {
        var newUserData = req.body;

        data.userService.getUser(newUserData.username).then(function (existingUser) {
            if (existingUser) {
                errorHandler.redirectToRoute(req, res, 'This username/email address is taken, please try another one!', '/register');
            } else if (newUserData.password !== newUserData.confirmPassword) {
                errorHandler.redirectToRoute(req, res, 'Passwords do not match!', '/register');
            } else {
                newUserData.salt = encryption.generateSalt();
                newUserData.hashPass = encryption.generateHashedText(newUserData.salt, newUserData.password);
                data.userService.add(newUserData).then(function (newUser) {
                    req.logIn(newUser, function (err) {
                        if (err) {
                            errorHandler.redirectToError(req, res, 'A terrible error has occurred! ' + err.toString());
                        }
                        res.redirect('/');
                    });
                }, function (err) {
                    return errorHandler.redirectToRoute(req, res, err, '/register');
                });
            }
        }, function (err) {
            return errorHandler.redirectToRoute(req, res, err, '/register');
        });
    },
    getLogin: function getLogin(req, res) {
        return res.render(CONTROLLER_NAME + '/login');
    },
    postLogin: function postLogin(req, res) {
        return req.user ? res.redirect('/') : res.redirect('/login');
    },
    logout: function logout(req, res) {
        return res.redirect('/');
    }
};
