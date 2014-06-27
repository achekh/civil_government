'use strict';

require(process.cwd() + '/packages/events/server/models/event');
require(process.cwd() + '/packages/activists/server/models/activist');
require(process.cwd() + '/packages/organizations/server/models/organization');
require(process.cwd() + '/packages/events/server/models/event');
require(process.cwd() + '/packages/participants/server/models/participant');

// Module dependencies.
var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Activist = mongoose.model('Activist'),
    Organization = mongoose.model('Organization'),
    Event = mongoose.model('Event'),
    Participant = mongoose.model('Participant');

// Globals
var user, activist, organization, userEvent, participant, participantDuplicate;

// The tests
describe('<Unit Test>', function() {

    describe('Model Participant:', function () {

        before(function (done) {

            // user

            user = new User({
                name: 'user',
                email: 'user@example.com',
                username: 'user',
                password: 'user'
            });

            organization = new Organization({
                user: user,
                title: 'user organization'
            });

            activist = new Activist({
                user: user,
                name: user.name
            });

            userEvent = new Event({
                user: user,
                title: 'user event',
                organization: organization,
                datetime: new Date(),
                status: Event.statuses[0]
            });

            participant = new Participant({
                activist: activist,
                event: userEvent,
                coordinator: false
            });

            participantDuplicate = new Participant({
                activist: activist,
                event: userEvent,
                coordinator: true
            });

            // save user

            async.series([
                user.save.bind(user),
                activist.save.bind(user),
                organization.save.bind(user),
                userEvent.save.bind(userEvent)
            ], done);

        });

        describe('Save:', function() {

            it('should begin without the test participant', function(done) {
                Participant.find({participant: participant._id}, function(err, participants) {
                    should.not.exist(err);
                    participants.should.have.length(0);
                    done();
                });
            });

            it('should be able to save participant without problems', function(done) {
                participant.save(done);
            });

            it('should be equal ids of participant and participant duplicate', function(done) {
                participant._id.should.not.match(undefined);
                participantDuplicate._id.should.not.match(undefined);
                participant._id.should.match(participantDuplicate._id);
                done();
            });

            it('should show an error when try to save participant duplicate', function(done) {
                participantDuplicate.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should be one participant after participant duplicate saving', function(done) {
                Participant.find({_id: participant._id}, function(err, participants) {
                    should.not.exist(err);
                    participants.should.have.length(1);
                    done();
                });
            });

        });

        after(function(done) {
            async.series([
                user.remove.bind(user),
                activist.remove.bind(activist),
                organization.remove.bind(organization),
                userEvent.remove.bind(userEvent),
                participant.remove.bind(participant),
                participantDuplicate.remove.bind(participantDuplicate)
            ], done);
        });

    });

});
