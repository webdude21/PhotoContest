module.exports = function (app) {
    app.get('/error', function (req, res) {
        res.render('error', {currentUser: req.user});
    });

    app.get(app.get('/', function (req, res) {
        res.redirect('contestants');
    }));

    app.post('/*', function (req, res) {
        res.redirect('/');
    });

    app.get('*', function (req, res) {
        res.render('not-found', {currentUser: req.user});
    });
};