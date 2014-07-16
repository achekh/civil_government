'use strict';

var mongoose = require('mongoose'),
    Victory = mongoose.model('Victory'),
    _ = require('lodash');

exports.create = function (req, res) {
    var victory = new Victory(req.body);
    victory.user = req.user;
    if (victory.region === null) {
        victory.region = undefined;
    }

    victory.save(function(err) {
        if (err) {
            res.status(500).send(err.errors || [err]);
        } else {
            res.jsonp(victory);
        }
    });
};

exports.victory = function(req, res, next, id) {
    Victory.load(id, function(err, victory) {
        if (err) return next(err);
        if (!victory) return next(new Error('Failed to load victory ' + id));
        req.victory = victory;
        next();
    });
};

exports.show = function(req, res) {
    res.jsonp(req.victory);
};

exports.all = function (req, res) {
    var query = {};
    if (req.query.userId) {
        query.user = req.query.userId;
    }
    if (req.query.region) {
        query.region = req.query.region;
    }
    var find = Victory.find(query);
    if (req.query.participantId) {
        find = find.where('participants').in([req.query.participantId]);
    }
    find.sort('-created')
        .populate('user', 'username')
        .populate('region')
        .exec(function (err, victories) {
        if (err) {
            res.status(500).send(err.errors || [err]);
        } else {
            res.jsonp(victories);
        }
    });
};

exports.destroy = function (req, res) {
    var victory = req.victory;
    victory.remove(function(err, victory){
        if (err) {
            res.status(500).send(err.errors || [err]);
        } else {
            res.jsonp(victory);
        }
    });
};

exports.update = function update(req, res) {
    var victory = req.victory;
    victory = _.extend(victory, req.body);
    if (victory.region === null) {
        victory.region = undefined;
    }
    if (req.user && victory && req.user.id === victory.user.id) {
        victory.save(function(err, victory) {
            if (err) {
                res.status(500).send(err.errors || [err]);
            } else {
                res.jsonp(victory);
            }
        });
    } else {
        res.status(400).send([{message:'Not Authorized'}]);
    }
};
