'use strict';

var mongoose = require('mongoose'),
    Member = mongoose.model('Member'),
//    Activist = mongoose.model('Activist'),
    _ = require('lodash');

exports.create = function (req, res) {
    var member = new Member(req.body);
    member.user = req.user;
    member.save(function (err, member) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors});
        } else {
            res.jsonp(member);
        }
    });
};

exports.member = function(req, res, next, id) {
    Member.load(id, function(err, member) {
        if (err) return next(err);
        if (!member) return next(new Error('Failed to load member ' + id));
        req.member = member;
        next();
    });
};

exports.show = function(req, res) {
    res.jsonp(req.member);
};

exports.all = function (req, res) {
    var query = {};
    if (req.query.userId) {
        query.user = req.query.userId;
    }
    if (req.query.activistId) {
        query.activist = req.query.activistId;
    }
    if (req.query.organisationId) {
        query.organisation = req.query.organisationId;
    }
    Member.find(query)
        .sort('-created')
        .populate('user', 'username')
        .populate('activist', 'displayName country city aboutMe url')
        .populate('organisation', 'created title shortTile url status sites description')
        .exec(function (err, members) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(members);
        }
    });
};

exports.remove = function (req, res) {
    var member = req.member;
    member.remove(function(err, member){
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors});
        } else {
            res.jsonp(member);
        }
    });
};

exports.update = function update(req, res) {
    var member = req.member;
    member = _.extend(member, req.body);
    member.save(function(err) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors});
        } else {
            res.jsonp(member);
        }
    });
};
