'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Activist = mongoose.model('Activist'),
    ObjectId = require('mongoose').Types.ObjectId,
    _ = require('lodash');


/**
 * Find activist by id
 */
exports.activist = function(req, res, next, id) {
    Activist.load(id, function(err, activist) {
        if (err) return next(err);
        if (!activist) return next(new Error('Failed to load activist ' + id));
        req.activist = activist;
        next();
    });
};

/**
 * Get Activist(s)
 */
exports.get = function(req, res) {
    if (req.activist) {
        res.jsonp(req.activist);
    } else {
        var query = req.query;
        if (query.user !== undefined) {
            query.user = new ObjectId(query.user);
        }
        var sortBy, limitTo;
        if (query.sortBy) {
            sortBy = query.sortBy;
            delete query.sortBy;
        }
        if (query.limitTo) {
            limitTo = query.limitTo;
            delete query.limitTo;
        }
        var find = Activist.find(query);
        if (sortBy) {
            find = find.sort(sortBy);
        }
        if (limitTo) {
            find = find.limit(limitTo);
        }
        find.populate('user', 'name username').exec(function(err, activists) {
            if (err) {
                res.render('error', {status: 500});
            } else {
                res.jsonp(activists);
            }
        });
    }
};

/**
 * Create an activist
 */
exports.create = function(req, res) {
    Activist
    .find({
        user: new ObjectId(req.user.id)
    })
    .exec(function(err, activists) {
        if (err) {
            res.render('error', {status: 500});
        } else {
            if (activists[0]) {
                res.jsonp(activists[0]);
            } else {
                var activist = new Activist();
                activist.user = req.user;
                activist.fullName = req.user.name;
                activist.emails = [req.user.email];
                activist.save(function(err) {
                    if (err) {
                        res.render('error', {status: 500});
                    } else {
                        res.jsonp(activist);
                    }
                });
            }
        }
    });
};

/**
 * Update an activist
 */
exports.update = function(req, res) {
    var activist = req.activist;
    activist = _.extend(activist, req.body);
    activist.save(function(err) {
        if (err) {
            res.render('error', {status: 500});
        } else {
            res.jsonp(activist);
        }
    });
};

/**
 * Delete an activist
 */
exports.destroy = function(req, res) {
    var activist = req.activist;
    activist.remove(function(err) {
        if (err) {
            res.render('error', {status: 500});
        } else {
            res.jsonp(activist);
        }
    });
};


