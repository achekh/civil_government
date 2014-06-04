'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Leader = mongoose.model('Leader');//,
//    _ = require('lodash');


/**
 * List of Videos
 */
exports.query = function(req, res) {
    console.log('entering leaders.query');
    var query = {};
    var q = Leader.find(query);
    if (req.query.sortBy !== undefined) {
        q = q.sort(req.query.sortBy);
    }
    if (req.query.limitTo !== undefined) {
        q = q.limit(req.query.limitTo);
    }
    q.exec(function(err, leaders) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(leaders);
        }
    });
};