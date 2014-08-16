'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    passport = require('passport'),
    logger = require('mean-logger');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Initializing system variables
var config = require('./server/config/config')();
var db = mongoose.connect(config.db);

// Bootstrap Models, Dependencies, Routes and the app as an express app
var app = require('./server/config/system/bootstrap')(passport, db);

// Start the app by listening on <port>, optional hostname
app.listen(config.port, config.hostname);
console.log('App environment ' + process.env.NODE_ENV);
console.log('App started at ' + config.hostname + ':' + config.port);
console.log('App database at ' + config.db);

// Initializing logger
logger.init(app, passport, mongoose);

// Expose app
exports = module.exports = app;
