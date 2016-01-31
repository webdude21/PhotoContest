var express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    session = require('express-session'),
    passport = require('passport'),
    busboy = require('connect-busboy'),
    morgan = require('morgan'),
    csrf = require('csurf'),
    STATIC_DIRECTORY = '/public/compiled',
    secretPassPhrase = 'XZASDIAJSuiasfjuuhasfuhSAFHuhasffaioASJF',
    messageHandler = require('../utilities/message-handler'),
    middlewares = require('../middleware');

module.exports = function({ app, config, staticCacheAge, env }) {
    if (env === 'production') {
        app.use(middlewares.forceHttps);
    }
    app.use(compression());
    app.set('view engine', 'jade');
    app.set('views', config.rootPath + '/server/views');
    app.use(cookieParser(secretPassPhrase));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(busboy({ immediate: false }));
    app.use(session({ secret: secretPassPhrase, saveUninitialized: true, resave: true }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(csrf({ cookie: true }));
    app.use(function(req, res, next) {
        res.locals.facebookClientID = env.FACEBOOK_APP_ID;
        res.locals.csrf = req.csrfToken();
        next();
    });
    app.use(express.static(config.rootPath + STATIC_DIRECTORY, { maxAge: staticCacheAge }));
    app.use(morgan('combined'));
    app.use((req, res, next) => messageHandler(req, res, next, app));
    app.use((req, res, next) => middlewares.user(req, res, next, app));
    app.locals.moment = require('moment');
};
