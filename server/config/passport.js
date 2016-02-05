'use strict';
let passport = require('passport'),
  LocalPassport = require('passport-local'),
  FacebookStrategy = require('passport-facebook').Strategy,
  data = require('../data'),
  env = require('../config/global-variables'),
  logError = err => console.log(`Error loading user: ${err}`),
  encryption = require('../utilities/encryption'),
  registerFacebookUser = function (accessToken, refreshToken, profile, done) {
    let fbUser = {
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
  };

module.exports = function () {

  passport.use(new FacebookStrategy({
    clientID: env.FACEBOOK_APP_ID,
    clientSecret: env.FACEBOOK_APP_SECRET,
    callbackURL: `${env.BASE_URL}/auth/facebook/callback`
  }, registerFacebookUser));

  passport.use(new LocalPassport(function (username, password, done) {
    data.userService
      .getUser(username)
      .then(user => user && user.authenticate(password) ? done(null, user) : done(null, false), logError);
  }));

  passport.serializeUser((user, done) => done(null, user.id));

  passport.deserializeUser(function (id, done) {
    data.userService
      .getBy(id)
      .then(user => user ? done(null, user) : done(null, false), logError);
  });
};
