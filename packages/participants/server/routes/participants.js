'use strict';

var participants = require('../controllers/participants');

var mongoose = require('mongoose'),
    Participant = mongoose.model('Participant'),
    Member = mongoose.model('Member');

// authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.participant.activist.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

var isConfirmedChangingByCoordinator = function (req, res, next) {
    if (req.body.hasOwnProperty('confirmed') && req.body.confirmed !== req.participant.confirmed) {
        Participant
            // find coordinators of event
            .find({event: req.body.event._id, coordinator: true})
            .populate('activist')
            .exec(function(err, coordinators) {
                if (err) {
                    console.log(err);
                    res.jsonp({errors: err.errors || [err]});
                } else {
                    // find coordinator with activist user equals request user
                    if (coordinators.some(function (coordinator) {
                        return coordinator.activist.user.equals(req.user._id);
                    })) {
                        next();
                    } else {
                        return res.send(401, 'User is not authorized');
                    }
                }
            })
        ;
    } else {
        next();
    }
};

var isCoordinatorChangingByHead = function (req, res, next) {
    if (req.body.hasOwnProperty('coordinator') && req.body.coordinator !== req.participant.coordinator) {
        Member
            // find heads of request user
            .find({user: req.user._id, isLeader: true})
            .exec(function(err, members) {
                if (err) {
                    console.log(err);
                    res.jsonp({errors: err.errors || [err]});
                } else {
                    // find head of organization that is organizer of participant event
                    if (members.some(function (member) {
                        return member.organization.toString() === req.body.event.organization;
                    })) {
                        next();
                    } else {
                        return res.send(401, 'User is not authorized');
                    }
                }
            })
        ;
    } else {
        next();
    }
};

// The Package is past automatically as first parameter
module.exports = function(Participants, app, auth, database) {

    app.route('/participants')
        .get(participants.all)
        .post(auth.requiresLogin, participants.create);
    app.route('/participants/:participantId')
        .get(participants.show)
        .put(auth.requiresLogin, hasAuthorization, isConfirmedChangingByCoordinator, isCoordinatorChangingByHead, participants.update)
        .delete(auth.requiresLogin, hasAuthorization, participants.destroy);

    app.param('participantId', participants.participant);

};
