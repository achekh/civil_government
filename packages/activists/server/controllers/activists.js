'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Activist = mongoose.model('Activist'),
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
        var query = {};
        if (req.query.userId !== undefined) {
            query.user = req.query.userId;
        }
        var find = Activist.find(query);
        if (req.query.sortBy) {
            find = find.sort(req.query.sortBy);
        } else {
            find = find.sort('-created');
        }
        if (req.query.limitTo) {
            find = find.limit(req.query.limitTo);
        }
        find
            .populate('user', 'name username')
            .exec(function(err, activists) {
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
        user: req.user.id
    })
    .exec(function(err, activists) {
        if (err) {
            res.render('error', {status: 500});
        } else {
            if (activists[0]) {
                res.jsonp(activists[0].toJSON({lastName:true}));
            } else {
                var activist = new Activist();
                activist.user = req.user;
                activist.name = req.user.name;
                activist.lastName = req.user.lastName;
                activist.emails = [req.user.email];
                activist.save(function(err) {
                    if (err) {
                        res.render('error', {status: 500});
                    } else {
                        res.jsonp(activist.toJSON({lastName:true}));
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
            activist.model('User').findById(activist.user, function(err, user) {
                if (err) console.log(err);
                if (user) {
                    user.name = activist.name;
                    user.save(function (err, user) {
                        if (err) console.log(err);
                        res.jsonp(activist);
                    });
                }
            });
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


