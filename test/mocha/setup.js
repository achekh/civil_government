'use strict';

process.env.NODE_ENV = (process.env.NODE_ENV === undefined) ? 'test' : process.env.NODE_ENV;

var mongoose = require('mongoose'),
    config = require(process.cwd() + '/server/config/config')();

module.exports = function (done) {

//mongoose.set('debug', true);

console.log('\nTrying to connect test database');
var connection = mongoose.createConnection(config.db);
connection.on('connected', function () {
    console.log('Test database connected');
    console.log('Test database name: ' + connection.db.databaseName);
    console.log('Test database addr: ' + connection.db.serverConfig.name);
    connection.db.dropDatabase(function (err) {
        if (err) return done(err);
        console.log('Test database dropped');
        connection.close(done);
    });
});

};
