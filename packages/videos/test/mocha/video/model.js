'use strict';

require('../../../server/models/video');

// Module dependencies.
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Video = mongoose.model('Video');

// Globals
var user, video;

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

            video = new Video({
                user: user,
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
