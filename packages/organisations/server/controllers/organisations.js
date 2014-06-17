'use strict';

var mongoose = require('mongoose'),
    Organisation = mongoose.model('Organisation'),
    Activist = mongoose.model('Activist'),
    Member = mongoose.model('Member'),
    _ = require('lodash');

exports.create = function (req, res) {
    var organisation = new Organisation(req.body);
    organisation.user = req.user;
    organisation.save(function (err, organisation) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors});
        } else {
            res.jsonp(organisation);
            Activist.loadByUserId(organisation.user, function (err, activist) {
                if (err) {
                    console.log(err);
                } else {
                    var member = new Member();
                    member.user = req.user;
                    member.organisation = organisation;
                    member.activist = activist;
                    member.isLeader = true;
                    member.save(function (err, member) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });
        }
    });
};

exports.organisation = function(req, res, next, id) {
    Organisation.load(id, function(err, organisation) {
        if (err) return next(err);
        if (!organisation) return next(new Error('Failed to load organisation ' + id));
        req.organisation = organisation;
        next();
    });
};

exports.show = function(req, res) {
    res.jsonp(req.organisation);
};

exports.all = function (req, res) {
    var query = {};
    if (req.query.userId) {
        query.user = req.query.userId;
    }
    Organisation.find(query).sort('-created').populate('user', 'username').exec(function (err, organisations) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(organisations);
        }
    });
};

exports.remove = function (req, res) {
    var organisation = req.organisation;
    Member
        .find({
            organisation: organisation
        })
        .remove(function (err, count) {
            if (err) {
                console.log(err);
                res.jsonp({errors: err.errors});
            } else {
                organisation.remove(function(err, organisation){
                    if (err) {
                        console.log(err);
                        res.jsonp({errors: err.errors});
                    } else {
                        res.jsonp(organisation);
                    }
                });
            }
        });
};

exports.update = function update(req, res) {
    var organisation = req.organisation;
    organisation = _.extend(organisation, req.body);
    organisation.save(function(err) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors});
        } else {
            res.jsonp(organisation);
        }
    });
};
