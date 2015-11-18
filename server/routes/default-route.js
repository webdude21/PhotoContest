var pageController = require('../controllers').page;

module.exports = function ({app}) {
    app.get('/error', (req, res) => res.render('error', {currentUser: req.user}));

    app.get('/tos', pageController.getTos);

    app.get('/home', (req, res) => res.render('home', {currentUser: req.user}));

    app.get(app.get('/', (req, res) => res.redirect('home')));

    app.post('/*', (req, res) => res.redirect('/'));

    app.get('*', (req, res) => res.render('not-found', {currentUser: req.user}));
};