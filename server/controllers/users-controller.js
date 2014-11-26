var encryption = require('../utilities/encryption');
var User = require('mongoose').model('User');
var data = require('../data');

var CONTROLLER_NAME = 'users';

module.exports = {
    getProfile: function (req, res, next) {
        userInfo = {
            firstName: req.user.firstName,
            lastName: req.user.lastName
        };
        res.render(CONTROLLER_NAME + '/profile', userInfo);
    },
    postProfile: function (req, res, next) {
        var newUserData = req.body;

        data.users.getUser(req.user.username
            , function (err) {
                req.session.errorMessage = err;
                res.redirect('/error');
            }, function (user) {
                if (newUserData.password && newUserData.confirmPassword) {
                    if (newUserData.password != newUserData.confirmPassword) {
                        req.session.errorMessage = 'Passwords do not match!';
                        res.redirect('/profile');
                        return
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
            });
    },
    getRegister: function (req, res, next) {
        res.render(CONTROLLER_NAME + '/register');
    },
    postRegister: function (req, res, next) {
        var newUserData = req.body;
        data.users.getUser(newUserData, function (err) {
                if (err) {
                    req.session.errorMessage = err;
                    res.redirect('/register');
                }
            },
            function (user) {
                if (user) {
                    req.session.errorMessage = "This username/email address is taken, please try another one!";
                    res.redirect('/register');
                } else if (newUserData.password != newUserData.confirmPassword) {
                    req.session.errorMessage = 'Passwords do not match!';
                    res.redirect('/register');
                } else {
                    newUserData.salt = encryption.generateSalt();
                    newUserData.hashPass = encryption.generateHashedText(newUserData.salt, newUserData.password);
                    data.users.addUser(newUserData, function (err) {
                        if (err) {
                            req.session.errorMessage = err.message;
                            res.redirect('/register');
                        }
                    }, function (user) {
                        req.logIn(user, function (err) {
                            if (err) {
                                req.session.errorMessage = "A terrible error has occurred! " + err.toString();
                                res.redirect('/error');
                            }

                            res.redirect('/');
                        });
                    });
                }
            });
    },
    getLogin: function (req, res, next) {
        res.render(CONTROLLER_NAME + '/login');
    },
    postLogin: function (req, res, next) {
        if (req.user) {
            res.redirect('/');
        }
        else {
            res.redirect('/login');
        }
    },
    logout: function (req, res, next) {
        res.redirect('/');
    }
};