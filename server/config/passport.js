var passport = require('passport'),
    LocalPassport = require('passport-local'),
    FacebookStrategy = require('passport-facebook').Strategy,
    User = require('mongoose').model('User'),
    data = require('../data'),
    encryption = require('../utilities/encryption'),
    FB_USER_PREFIX = 'fb_user';

module.exports = function () {
    passport.use(new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.BASE_URL + "/auth/facebook/callback"
        }, function (accessToken, refreshToken, profile, done) {
            var fbUser = {
                facebookId: profile.id,
                firstName: profile._json.first_name,
                lastName: profile._json.last_name,
                username: profile.username ? profile.username : profile._json.first_name + '_' + profile._json.last_name
            };

            fbUser.salt = encryption.generateSalt();
            fbUser.hashPass = encryption.generateHashedText(fbUser.salt, encryption.generateSalt());

            // very dumb solution here, but FB users don't always come with emails
            fbUser.email = profile.emails ? profile.emails[0].value : `${fbUser.facebookId}@facebook.com`;

            data.userService.findOrCreate(fbUser, (user) => {
                return done(null, user);
            });
        }
    ));
    passport.use(new LocalPassport(function (username, password, done) {
        User.findOne({username}).exec(function (err, user) {
            if (err) {
                console.log('Error loading user: ' + err);
            }

            return user && user.authenticate(password) ? done(null, user) : done(null, false);
        });
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
            }

            return user ? done(null, user) : done(null, false);
        });
    });
};