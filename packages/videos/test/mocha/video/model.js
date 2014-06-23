'use strict';

require(process.cwd() + '/packages/events/server/models/event');
require(process.cwd() + '/packages/organizations/server/models/organization');
require(process.cwd() + '/packages/videos/server/models/video');

// Module dependencies.
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Event = mongoose.model('Event'),
    Organization = mongoose.model('Organization'),
    Video = mongoose.model('Video');

// Globals
var user, userEvent, organization, video;

// The tests
describe('<Unit Test>', function() {

    describe('Model Video:', function () {

        before(function (done) {

            user = new User({
                name: 'Full name',
                email: 'test@test.com',
                username: 'user',
                password: 'password'
            });

            organization = new Organization({
                user: user,
                title: 'user1 organization'
            });

            userEvent = new Event({
                user: user,
                title: 'User event',
                organization: organization,
                datetime: new Date(),
                status: Event.statuses[0]
            });

            video = new Video({
                user: user,
                event: userEvent,
                title: 'Event video',
                url: 'http://example.com'
            });

            done();

        });

        describe('Method Save', function() {

            it('should begin without the test video', function(done) {
                Video.find({ userId: 'userId1' }, function(err, videos) {
                    videos.should.have.length(0);
                    done();
                });
            });

            it('should be able to save video without problems', function(done) {
                video.save(done);
            });

            it('should show an error when try to save video without url', function(done) {
                video.url = '';
                return video.save(function(err) {
                    should.exist(err);
                    done();
                });
            });

            it('should be able to save updated video without problems', function(done) {
                video.url = 'http://somewhere2.com';
                video.save(done);
            });

        });

        after(function(done) {
            video.remove();
            done();
        });

    });

});
