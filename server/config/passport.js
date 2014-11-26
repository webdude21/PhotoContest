var passport = require('passport');
var LocalPassport = require('passport-local');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('mongoose').model('User');
var data = require('../data');
var encryption = require('../utilities/encryption');

module.exports = function (serverPort) {
    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: "http://localhost:" + serverPort + "/auth/facebook/callback"
        },
        function (accessToken, refreshToken, profile, done) {
            var fbUser = {
                facebookId: profile.id,
                firstName: profile._json.first_name,
                lastName: profile._json.last_name,
                username: profile.username,
                email: profile.emails[0].value
            };

            fbUser.salt = encryption.generateSalt();
            fbUser.hashPass = encryption.generateHashedText(fbUser.salt, encryption.generateSalt());

            data.users.findOrCreate(fbUser,
                function (err, user) {
                    if (err) {
                        console.log('Error loading user: ' + err);
                        return;
                    }

                    if (user) {
                        return done(err, user);
                    } else {
                        return done(null, false);
                    }
                });
        }
    ));
    passport.use(new LocalPassport(function (username, password, done) {
        User.findOne({username: username}).exec(function (err, user) {
            if (err) {
                console.log('Error loading user: ' + err);
                return;
            }

            if (user && user.authenticate(password)) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
    }));
    passport.serializeUser(function (user, done) {
        if (user) {
            return done(null, user.id);
        }
    });
    passport.deserializeUser(function (id, done) {
        User.findById(id).exec(function (err, user) {
            if (err) {
                console.log('Error loading user: ' + err);
                return;
            }

            if (user) {
                return done(null, user);
            }
            else {
                return done(null, false);
            }
        })
    })
};