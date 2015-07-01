'use strict';

var express = require('express');
var kraken = require('kraken-js');


var db = require('./library/database');


var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */
         var dbConfig = config.get('databaseConfig');
        db.config(dbConfig);
        next(null, config);
    }
};

app = module.exports = express();
app.use(kraken(options));

var session = require('express-session');
var cookieSession =   require('cookie-session');
var lusca = require('lusca');

//this or other session management will be required
app.use(session({
    secret: 'sangplus',
    resave: true,
    saveUninitialized: true
}));

app.use(lusca({
    csrf: false,
    csp: { /* ... */},
    xframe: 'SAMEORIGIN',
    p3p: 'ABCDEF',
    hsts: {maxAge: 31536000, includeSubDomains: true, preload: true},
    xssProtection: true
}));


var passport = require('passport');
var flash    = require('connect-flash');
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.on('start', function () {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});
