/**
 * middleware to force https for heroku reverse proxy enviorment.
 * @function
 */
module.exports = function (req, res, next) {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(['https://', req.get('Host'), req.url].join(''));
  }
  return next();
};
