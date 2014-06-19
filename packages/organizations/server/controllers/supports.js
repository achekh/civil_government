'use strict';

var mongoose = require('mongoose'),
    Support = mongoose.model('Support'),
    _ = require('lodash');

exports.create = function (req, res) {
    var support = new Support(req.body);
    support.user = req.user;
    support.save(function (err, support) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors || [err]});
        } else {
            res.jsonp(support);
        }
    });
};

exports.support = function(req, res, next, id) {
    Support.load(id, function(err, support) {
        if (err) return next(err);
        if (!support) return next(new Error('Failed to load support ' + id));
        req.support = support;
        next();
    });
};

exports.show = function(req, res) {
    res.jsonp(req.support);
};

exports.all = function (req, res) {
    var query = {};
    if (req.query.userId) {
        query.user = req.query.userId;
    }
    if (req.query.eventId) {
        query.event = req.query.eventId;
    }
    if (req.query.organizationId) {
        query.organization = req.query.organizationId;
    }
    Support.find(query)
        .sort('-created')
        .populate('user', 'username')
        .populate('event', 'created user title organization datetime status sites description min_part max_part gps')
        .populate('organization', 'created title shortTile url status sites description')
        .exec(function (err, supports) {
            if (err) {
                console.log(err);
            } else {
                res.jsonp(supports);
            }
        });
};

exports.remove = function (req, res) {
    var support = req.support;
    support.remove(function(err, support){
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors || [err]});
        } else {
            res.jsonp(support);
        }
    });
};

exports.update = function update(req, res) {
    var support = req.support;
    support = _.extend(support, req.body);
    support.save(function(err) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors || [err]});
        } else {
            res.jsonp(support);
        }
    });
};
