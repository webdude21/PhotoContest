var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var busboy = require('connect-busboy');
var morgan = require('morgan');
var STATIC_DIRECTORY = '/public';
var secretPassPhrase = 'XZASDIAJSuiasfjuuhasfuhSAFHuhasffaioASJF';


module.exports = function (app, config) {
    app.set('view engine', 'jade');
    app.set('views', config.rootPath + '/server/views');
    app.use(cookieParser(secretPassPhrase));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(busboy({ immediate: false }));
    app.use(session({secret: secretPassPhrase, saveUninitialized: true, resave: true}));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(express.static(config.rootPath + STATIC_DIRECTORY));
    app.use(morgan('combined'));
    app.use(function (req, res, next) {
        if (req.session.errorMessage) {
            var msg = req.session.errorMessage;
            req.session.errorMessage = undefined;
            app.locals.errorMessage = msg;
        }else{
            app.locals.errorMessage = undefined;
        }
        next();
    });
    app.use(function (req, res, next) {
        app.locals.currentUser = req.user;
        next();
    })
};