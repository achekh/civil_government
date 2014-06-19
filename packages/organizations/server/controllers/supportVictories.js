'use strict';

var mongoose = require('mongoose'),
    SupportVictory = mongoose.model('SupportVictory'),
    _ = require('lodash');

exports.create = function (req, res) {
    var supportVictory = new SupportVictory(req.body);
    supportVictory.user = req.user;
    supportVictory.save(function (err, supportVictory) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors || [err]});
        } else {
            res.jsonp(supportVictory);
        }
    });
};

exports.supportVictory = function(req, res, next, id) {
    SupportVictory.load(id, function(err, supportVictory) {
        if (err) return next(err);
        if (!supportVictory) return next(new Error('Failed to load supportVictory ' + id));
        req.supportVictory = supportVictory;
        next();
    });
};

exports.show = function(req, res) {
    res.jsonp(req.supportVictory);
};

exports.all = function (req, res) {
    var query = {};
    if (req.query.userId) {
        query.user = req.query.userId;
    }
    if (req.query.eventId) {
        query.victory = req.query.victoryId;
    }
    if (req.query.organizationId) {
        query.organization = req.query.organizationId;
    }
    SupportVictory.find(query)
        .sort('-created')
        .populate('user', 'username')
        .populate('victory', 'created title description user organization status city img datetime')
        .populate('organization', 'created title shortTile url status sites description')
        .exec(function (err, supportVictories) {
            if (err) {
                console.log(err);
            } else {
                res.jsonp(supportVictories);
            }
        });
};

exports.remove = function (req, res) {
    var supportVictory = req.supportVictory;
    supportVictory.remove(function(err, supportVictory){
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors || [err]});
        } else {
            res.jsonp(supportVictory);
        }
    });
};

exports.update = function update(req, res) {
    var supportVictory = req.supportVictory;
    supportVictory = _.extend(supportVictory, req.body);
    supportVictory.save(function(err) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors || [err]});
        } else {
            res.jsonp(supportVictory);
        }
    });
};
