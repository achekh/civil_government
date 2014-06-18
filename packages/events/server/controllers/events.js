/**
 * Created by legalt on 26.05.2014.
 */
'use strict';

var mongoose = require('mongoose'),
    Event = mongoose.model('Event'),
    Activist = mongoose.model('Activist'),
    Participant = mongoose.model('Participant'),
    _ = require('lodash');

exports.create = function (req, res) {
    var event = new Event(req.body);
    event.user = req.user;
    event.save(function (err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                event: event
            });
        } else {
            Activist.loadByUserId(req.user._id, function (err, activist) {
                console.log(arguments);
                var participant = new Participant({activist: activist, event: event, coordinator: true});
                participant.save(function (err) {
                    if (err) {
                        return res.send('users/signup', {
                            errors: err.errors,
                            participant: participant
                        });
                    } else {
                        res.jsonp(event);
                    }
                });
            });
        }
    });
};

exports.event = function(req, res, next, id) {
    Event.load(id, function(err, event) {
        if (err) return next(err);
        if (!event) return next(new Error('Failed to load event ' + id));
        req.event = event;
        next();
    });
};

exports.show = function(req, res) {
    res.jsonp(req.event);
};

exports.all = function (req, res) {
    var query = {};
    if (req.query.userId) {
        query.user = req.query.userId;
    }
    Event.find(query)
        .sort('-created')
        .populate('user', 'username')
        .exec(function (err, events) {
            if (err) {
                res.render('error', {
                    status: 500
                });
            } else {
                res.jsonp(events);
            }
        })
    ;
};

exports.destroy = function (req, res) {
    var event = req.event;
    res.jsonp(event);
    /* event.remove(function(err){

     });*/

};

exports.update = function update(req, res) {
    var event = req.event;
    event = _.extend(event, req.body);
    event.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                event: event
            });
        } else {
            res.jsonp(event);
        }
    });
};
