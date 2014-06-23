'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Participant = mongoose.model('Participant'),
    Member = mongoose.model('Member'),
    Event = mongoose.model('Event'),
    _ = require('lodash');


/**
 * Find participant by id
 */
exports.participant = function(req, res, next, id) {
    Participant.load(id, function(err, participant) {
        if (err) return next(err);
        if (!participant) return next(new Error('Failed to load participant ' + id));
        req.participant = participant;
        next();
    });
};

/**
 * Create an participant
 */
exports.create = function(req, res) {
    var participant = new Participant(req.body);
    participant.user = req.user;

    Event.findById(participant.event, function (err, event) {
        if (err) {
            return res.jsonp({errors: err.errors, participant: participant});
        }
        Member.findOne({activist: participant.activist, organization: event.organization}, function (err, member) {
            if (err) {
                return res.jsonp({errors: err.errors, participant: participant});
            }
            if (member) {
                participant.save(function (err) {
                    if (err) {
                        return res.jsonp({errors: err.errors, participant: participant});
                    }
                    res.jsonp(participant);
                });
            }
            // todo: else send message for user to become organization member first
        });
    });

};

/**
 * Update an participant
 */
exports.update = function(req, res) {
    var participant = req.participant;

    participant = _.extend(participant, req.body);

    participant.save(function(err) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors || [err]});
        } else {
            res.jsonp(participant);
        }
    });
};

/**
 * Delete an participant
 */
exports.destroy = function(req, res) {
    var participant = req.participant;

    participant.remove(function(err) {
        if (err) {
            console.log(err);
            res.jsonp({errors: err.errors || [err]});
        } else {
            res.jsonp(participant);
        }
    });
};

/**
 * Show an participant
 */
exports.show = function(req, res) {
    res.jsonp(req.participant);
};

/**
 * List of participants
 */
exports.all = function(req, res) {
    var query = {};
    if (req.query.coordinator && (req.query.coordinator === 'true' || req.query.coordinator === 'false')) {
        query.coordinator = req.query.coordinator;
    }
    if (req.query.appeared && (req.query.appeared === 'true' || req.query.appeared === 'false')) {
        query.appeared = req.query.appeared;
    }
    if (req.query.activistId) {
        query.activist = req.query.activistId;
    }
    if (req.query.eventId) {
        query.event = req.query.eventId;
    }
    var userId;
    if (req.query.userId) {
        userId = req.query.userId;
    }
    Participant
        .find(query)
        .sort('-created')
        .populate('activist')
        .populate('event')
        .exec(function(err, participants) {
            if (err) {
                console.log(err);
                res.jsonp({errors: err.errors || [err]});
            } else {
                if (userId) {
                    participants = participants.filter(function (participant) {
                        return participant.activist.user.toString() === userId;
                    });
                }
                res.jsonp(participants);
            }
        })
    ;
};

