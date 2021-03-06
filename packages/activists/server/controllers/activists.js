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
        if (req.query.region) {
            query.region = req.query.region;
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
            .populate('region')
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
            console.log(err);
            res.status(500).send([{message: 'Ошибка в базе данных'}]);
        } else {
            if (activists[0]) {
                res.jsonp(activists[0].toJSON({lastName:true}));
            } else {
                var activist = new Activist();
                activist.user = req.user;
                activist.name = req.user.name;
                activist.emails = [req.user.email];
                activist.save(function(err) {
                    if (err) {
                        console.log(err);
                        res.status(500).send([{message: 'Ошибка в базе данных'}]);
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
    if (activist.region === null) {
        activist.region = undefined;
    }

    if (!(activist.emails && activist.emails.length && activist.emails[0])) {
        return res.status(400).send([{message: 'Email должен быть'}]);
    }

    activist.model('User').findById(activist.user, function(err, user) {
        if (err) {
            console.log(err);
            res.status(500).send([{message: 'Ошибка в базе данных'}]);
        } else {
            if (user) {
                var updateUser = function() {
                    activist.save(function(err, activist) {
                        if (err) {
                            res.status(500).send(err.errors || [err]);
                        } else {
                            user.name = activist.name;
                            user.email = activist.emails[0];
                            user.save(function (err, user) {
                                if (err) {
                                    res.status(500).send(err.errors || [err]);
                                } else {
                                    res.jsonp(activist);
                                }
                            });
                        }
                    });
                };
                if (user.provider === 'local' && user.email !== activist.emails[0]) {
                    activist.model('User').find({email: activist.emails[0], provider: 'local'}, function(err, users) {
                        if (err) {
                            res.status(500).send(err.errors || [err]);
                        } else {
                            if (users.length) {
                                res.status(400).send([{message:'Пользователь с таким Email уже существует'}]);
                            } else {
                                updateUser();
                            }
                        }
                    });
                } else {
                    updateUser();
                }
            } else {
                res.status(500).send([{message: 'Ошибка в базе данных'}]);
            }
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


