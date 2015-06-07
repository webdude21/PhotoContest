'use strict';

module.exports = function (app) {
    app.get('/error', function (req, res) {
        return res.render('error', { currentUser: req.user });
    });

    app.get(app.get('/', function (req, res) {
        return res.redirect('contestants');
    }));

    app.post('/*', function (req, res) {
        return res.redirect('/');
    });

    app.get('*', function (req, res) {
        return res.render('not-found', { currentUser: req.user });
    });
};
