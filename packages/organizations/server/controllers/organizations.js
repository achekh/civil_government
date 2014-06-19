'use strict';

var mongoose = require('mongoose'),
    Organization = mongoose.model('Organization'),
    Activist = mongoose.model('Activist'),
    Member = mongoose.model('Member'),
    _ = require('lodash');

exports.create = function (req, res) {
    var organization = new Organization(req.body);
    organization.user = req.user;
    organization.save(function (err, organization) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors});
        } else {
            res.jsonp(organization);
            Activist.loadByUserId(organization.user, function (err, activist) {
                if (err) {
                    console.log(err);
                } else {
                    var member = new Member();
                    member.user = req.user;
                    member.organization = organization;
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

function updateCalculatedFields(organization) {
    var promise = new mongoose.Promise();
    promise.fulfill();
    promise = promise
        .then(function() {
            if (organization.eventCount === undefined) {
                return organization.updateEventCount();
            }
        })
        .then(function() {
            if (organization.supportedEventCount === undefined) {
                return organization.updateSupportedEventCount();
            }
        })
        .then(function() {
            if (organization.victoryCount === undefined) {
                return organization.updateVictoryCount();
            }
        })
        .then(function() {
            if (organization.supportedVictoryCount === undefined) {
                return organization.updateSupportedVictoryCount();
            }
        })
    ;
    return promise;
}

exports.organization = function(req, res, next, id) {
    Organization.load(id)
        .then(function(organization) {
            if (!organization) throw new Error('Failed to load organization ' + id);
            req.organization = organization;
            return updateCalculatedFields(organization);
        }).then(function() {
            next();
        }, function(err) {
            if (err) return next(err);
        });
};

exports.show = function(req, res) {
    res.jsonp(req.organization);
};

exports.all = function (req, res) {
    var query = {};
    if (req.query.userId) {
        query.user = req.query.userId;
    }
    Organization.find(query).sort('-created').populate('user', 'username').exec(function (err, organizations) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(organizations);
        }
    });
};

exports.remove = function (req, res) {
    var organization = req.organization;
    Member
        .find({
            organization: organization
        })
        .remove(function (err, count) {
            if (err) {
                console.log(err);
                res.jsonp({errors: err.errors});
            } else {
                organization.remove(function(err, organization){
                    if (err) {
                        console.log(err);
                        res.jsonp({errors: err.errors});
                    } else {
                        res.jsonp(organization);
                    }
                });
            }
        });
};

exports.update = function update(req, res) {
    var organization = req.organization;
    organization = _.extend(organization, req.body);
    organization.save(function(err) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors});
        } else {
            res.jsonp(organization);
        }
    });
};

