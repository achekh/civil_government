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

describe('<Unit Test>', function() {

    describe('Model Video:', function () {

        var user, userEvent, organization, video;

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
                Video.find({_id: video._id}, function(err, videos) {
                    videos.should.have.length(0);
                    done();
                });
            });

            it('should be able to save video without problems', function(done) {
                video.save(function (err) {
                    should.not.exist(err);
                    done();
                });
            });

            it('should show an error when try to save video without url', function(done) {
                Video.find({_id: video._id}, function(err, videos) {
                    videos.should.have.length(1);
                    videos[0].url = '';
                    videos[0].save(function (err) {
                        should.exist(err);
                        err.name.should.be.equal('ValidationError');
                        done();
                    });
                });
            });

            it('should be able to save updated video without problems', function(done) {
                Video.find({_id: video._id}, function(err, videos) {
                    videos.should.have.length(1);
                    videos[0].url = 'http://somewhere2.com';
                    videos[0].save(function (err) {
                        should.not.exist(err);
                        done();
                    });
                });
            });

        });

        after(function(done) {
            video.remove();
            done();
        });

    });

});
