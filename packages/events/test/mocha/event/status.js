'use strict';

require(process.cwd() + '/packages/activists/server/models/activist');
require(process.cwd() + '/packages/organizations/server/models/organization');
require(process.cwd() + '/packages/events/server/models/event');

var should = require('should'),
    async = require('async'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Activist = mongoose.model('Activist'),
    Organization = mongoose.model('Organization'),
    Event = mongoose.model('Event');

describe('<Unit Test>', function() {

    describe('Event model:', function () {

        var user, activist, organization, theEvent;

//        call mocha tests setup (clear db, etc)
//        before(function (done) {
//            require(process.cwd() + '/test/mocha/setup')(done);
//        });

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

            theEvent = new Event({
                user: user,
                title: 'user event with status',
                organization: organization,
                datetime: new Date()
            });

            // save user

            async.series([
                user.save.bind(user),
                activist.save.bind(activist),
                organization.save.bind(organization),
                theEvent.save.bind(theEvent)
            ], done);

        });

        it('should find test event', function (done) {
            Event.find({_id: theEvent._id}, function (err, events) {
                should.not.exist(err);
                events.should.have.length(1);
                events[0].status.should.be.equal('FOR_APPROVAL');
                done();
            });
        });

        describe('event status', function() {

            function nextStatus (event, statuses, done) {
                if (statuses.length) {
                    event.status = statuses.shift();
                    event.save(function (err, event) {
                        if (err) done(err);
                        nextStatus(event, statuses, done);
                    });
                } else {
                    done(null, event);
                }
            }

            function getEventInStatus (status, done) {
                var statuses;
                if (status === 'WON') {
                    statuses = ['APPROVED', 'STARTED', 'FINISHED', 'WON'];
                } else if (status === 'DEFEATED') {
                    statuses = ['APPROVED', 'STARTED', 'FINISHED', 'DEFEATED'];
                } else if (status === 'CANCELED') {
                    statuses = ['APPROVED', 'STARTED', 'CANCELED'];
                } else if (status === 'FINISHED') {
                    statuses = ['APPROVED', 'STARTED', 'FINISHED'];
                } else if (status === 'STARTED') {
                    statuses = ['APPROVED', 'STARTED'];
                } else if (status === 'AGREED') {
                    statuses = ['APPROVED', 'AGREED'];
                } else if (status === 'APPROVED') {
                    statuses = ['APPROVED'];
                } else if (status === 'FOR_APPROVAL') {
                    statuses = [];
                }
                var theUpdatedEvent = new Event({
                    user: user,
                    title: 'user event with updated status',
                    organization: organization,
                    datetime: new Date()
                });
                theUpdatedEvent.save(function (err, event) {
                    if (err) done(err);
                    nextStatus(event, statuses, done);
                });
            }

            function testStatusChange (from, to, can) {
                it('can ' + (can ? '' : 'not ') + 'be changed to ' + to, function (done) {
                    getEventInStatus(from, function (err, event) {
                        if (err) done(err);
                        event.status.should.be.equal(from);
                        event.status = to;
                        event.save(function (err, event) {
                            should.not.exist(err);
                            if (can) {
                                event.status.should.be.equal(to);
                            } else {
                                event.status.should.be.equal(from);
                            }
                            done();
                        });
                    });
                });
            }

            function testStatusChanges (test) {
                describe('from ' + test.from, function () {
                    for (var j = 0; j < test.tos.length; j++) {
                        testStatusChange(test.from, test.tos[j].to, test.tos[j].can);
                    }
                });
            }

            var tests = [
                {from: 'FOR_APPROVAL', tos: [
                    {to: 'FOR_APPROVAL', can: true},
                    {to: 'APPROVED', can: true},
                    {to: 'AGREED', can: false},
                    {to: 'STARTED', can: false},
                    {to: 'FINISHED', can: false},
                    {to: 'CANCELED', can: true},
                    {to: 'DEFEATED', can: false},
                    {to: 'WON', can: false}
                ]},
                {from: 'APPROVED', tos: [
                    {to: 'FOR_APPROVAL', can: false},
                    {to: 'APPROVED', can: true},
                    {to: 'AGREED', can: true},
                    {to: 'STARTED', can: true},
                    {to: 'FINISHED', can: false},
                    {to: 'CANCELED', can: true},
                    {to: 'DEFEATED', can: false},
                    {to: 'WON', can: false}
                ]},
                {from: 'AGREED', tos: [
                    {to: 'FOR_APPROVAL', can: false},
                    {to: 'APPROVED', can: false},
                    {to: 'AGREED', can: true},
                    {to: 'STARTED', can: true},
                    {to: 'FINISHED', can: false},
                    {to: 'CANCELED', can: true},
                    {to: 'DEFEATED', can: false},
                    {to: 'WON', can: false}
                ]},
                {from: 'STARTED', tos: [
                    {to: 'FOR_APPROVAL', can: false},
                    {to: 'APPROVED', can: false},
                    {to: 'AGREED', can: false},
                    {to: 'STARTED', can: true},
                    {to: 'FINISHED', can: true},
                    {to: 'CANCELED', can: true},
                    {to: 'DEFEATED', can: false},
                    {to: 'WON', can: false}
                ]},
                {from: 'FINISHED', tos: [
                    {to: 'FOR_APPROVAL', can: false},
                    {to: 'APPROVED', can: false},
                    {to: 'AGREED', can: false},
                    {to: 'STARTED', can: false},
                    {to: 'FINISHED', can: true},
                    {to: 'CANCELED', can: true},
                    {to: 'DEFEATED', can: true},
                    {to: 'WON', can: true}
                ]},
                {from: 'DEFEATED', tos: [
                    {to: 'FOR_APPROVAL', can: false},
                    {to: 'APPROVED', can: false},
                    {to: 'AGREED', can: false},
                    {to: 'STARTED', can: false},
                    {to: 'FINISHED', can: false},
                    {to: 'CANCELED', can: false},
                    {to: 'DEFEATED', can: true},
                    {to: 'WON', can: false}
                ]},
                {from: 'WON', tos: [
                    {to: 'FOR_APPROVAL', can: false},
                    {to: 'APPROVED', can: false},
                    {to: 'AGREED', can: false},
                    {to: 'STARTED', can: false},
                    {to: 'FINISHED', can: false},
                    {to: 'CANCELED', can: false},
                    {to: 'DEFEATED', can: false},
                    {to: 'WON', can: true}
                ]}
            ];

            tests.forEach(testStatusChanges);

        });

        after(function(done) {
            async.series([
                user.remove.bind(user),
                activist.remove.bind(activist),
                organization.remove.bind(organization),
                theEvent.remove.bind(theEvent)
            ], done);
        });

    });

});
