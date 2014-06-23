'use strict';

require(process.cwd() + '/packages/events/server/models/event');
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

// Globals
var user, activist, organization, userEvent;

// The tests
describe('<Unit Test>', function() {

    describe('Model Event:', function () {

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

            // save user

            async.series([
                user.save.bind(user),
                activist.save.bind(user),
                organization.save.bind(user)
            ], done);

        });

        describe('Event Save', function() {

            it('should begin without the test event', function(done) {
                Event.find({userId: user._id}, function(err, events) {
                    events.should.have.length(0);
                    done();
                });
            });

            it('should be able to save event without problems', function(done) {
                userEvent.save(done);
            });

            it('should show an error when try to save event without title', function(done) {
                userEvent.title = '';
                return userEvent.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should be able to save updated event without problems', function(done) {
                userEvent.title = 'user event';
                userEvent.save(done);
            });

        });

        after(function(done) {
            async.series([
                user.remove.bind(user),
                activist.remove.bind(user),
                organization.remove.bind(user),
                userEvent.remove.bind(user)
            ], done);
        });

    });

});
