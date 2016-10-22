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
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      username: profile.username || profile.displayName
    };

    fbUser.salt = encryption.generateSalt();
    fbUser.hashPass = encryption.generateHashedText(fbUser.salt, encryption.generateSalt());
    fbUser.email = `${fbUser.facebookId}@facebook.com`;

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
      .then(user => user && user.authenticate(password) ? done(null, user) : done(null, false))
      .catch(err => {
        logError(err);
        done(null, false);
      });
  }));

  passport.serializeUser(function (user, done) {
    if (user) {
     done(null, user.id);
     return;
    }
  });

  passport.deserializeUser(function (id, done) {
    data.userService
      .getBy(id)
      .then(user => user ? done(null, user) : done(null, false))
      .catch(err => {
        logError(err);
        done(null, false);
      });
  });
};
