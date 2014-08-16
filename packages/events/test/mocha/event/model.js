'use strict';

require(process.cwd() + '/packages/activists/server/models/activist');
require(process.cwd() + '/packages/organizations/server/models/organization');
require(process.cwd() + '/packages/events/server/models/event');

// Module dependencies.
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
                title: 'user event',
                organization: organization,
                datetime: new Date(),
                status: Event.statuses[0]
            });

            // save user

            async.series([
                user.save.bind(user),
                activist.save.bind(activist),
                organization.save.bind(organization)
            ], done);

        });

        describe('event save', function() {

            it('should begin without the test event', function(done) {
                Event.find({id: theEvent._id}, function(err, events) {
                    should.not.exist(err);
                    events.should.have.length(0);
                    done();
                });
            });

            it('should be able to save event without problems', function(done) {
                theEvent.save(function (err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should show an error when try to save event without title', function(done) {
                Event.find({_id: theEvent._id}, function(err, events) {
                    events.should.have.length(1);
                    events[0].title = '';
                    events[0].save(function (err) {
                        should.exist(err);
                        err.name.should.be.equal('ValidationError');
                        done();
                    });
                });
            });

            it('should be able to save updated event without problems', function(done) {
                Event.find({_id: theEvent._id}, function(err, events) {
                    events.should.have.length(1);
                    events[0].title = 'user event updated';
                    events[0].save(function (err) {
                        should.not.exist(err);
                        done();
                    });
                });
            });
        });

        after(function(done) {
            async.series([
                user.remove.bind(user),
                activist.remove.bind(activist),
                organization.remove.bind(organization),
                theEvent.remove.bind(theEvent)
            ], function () {
                done();
            });
        });

    });

});
