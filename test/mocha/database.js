'use strict';

var mongoose = require('mongoose'),
    config = require(process.cwd() + '/server/config/config')();

describe('<Unit Test>', function() {

//    mongoose.set('debug', true);

    var connection;

    it('should have test database as config.db parameter', function () {
        config.db.should.equal('mongodb://localhost/mean-test');
    });

    it('should connect to database', function (done) {
        connection = mongoose.createConnection(config.db);
        connection.on('connected', done);
    });

    it('should drop database', function (done) {
        connection.db.dropDatabase(done);
    });

    it('should close connection to database', function (done) {
        connection.close(done);
    });

});
