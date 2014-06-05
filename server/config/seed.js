'use strict';

//require(process.cwd() + '/server');
require(process.cwd() + '/server/models/user');
require(process.cwd() + '/packages/videos/server/models/video');
require(process.cwd() + '/packages/leaders/server/models/leader');

var mongoose = require('mongoose'),
//    logger = require('mean-logger'),
    User = mongoose.model('User'),
    Video = mongoose.model('Video'),
    Leader = mongoose.model('Leader');

module.exports = function (done) {

    function seed(model, entities) {
        var promise = new mongoose.Promise();
        model.create(entities, function (err) {
            if (err) {
                promise.reject(err);
            }
            else {
                promise.resolve();
            }
        });
        return promise;
    }

    function seedDb() {

        var users = [
            {
                name: 'Super Admin',
                email: 'admin@example.com',
                username: 'admin',
                roles: ['admin', 'authenticated'],
                password: 'admin'
            },
            {
                name: 'Майдан Моніторинг',
                email: 'maidanmonitoring@gmail.com',
                username: 'maidanmonitoring',
                roles: ['authenticated'],
                password: 'maidan'
            }
        ];

        console.log('Seed users');
        return seed(User, users)
            .then(function () {
                console.log('Find user "admin"');
                return User.findOne({username: 'admin'}).exec();
            })
            .then(function(user) {

                var videos = [
                    {
                        title: 'Admin: Путін Хуйло, Донбас не віддамо! #Харків',
                        url: 'http://youtu.be/3CcKS0z7Bwo',
                        user: user
                    },
                    {
                        title: 'Admin: Финальная песня - Набери "Украина" в Гугле',
                        url: 'http://youtube.com/embed/-OWTWVwvtNw',
                        user: user
                    }

                ];

                console.log('Seed videos');
                return seed(Video, videos);

            })
            .then(function () {
                console.log('Find user "maidanmonitoring"');
                return User.findOne({username: 'maidanmonitoring'}).exec();
            })
            .then(function(user) {

                var videos = [
                    {
                        created: new Date(2014, 5, 1, 11, 40),
                        title: 'Путін Хуйло, Донбас не віддамо! #Харків',
                        url: 'http://youtu.be/3CcKS0z7Bwo',
                        live: false,
                        user: user
                    },
                    {
                        created: new Date(2014, 5, 1, 11, 45),
                        title: 'Финальная песня - Набери "Украина" в Гугле',
                        url: 'http://youtu.be/-OWTWVwvtNw',
                        live: false,
                        user: user
                    }

                ];

                console.log('Seed videos');
                return seed(Video, videos);

            })
            .then(function() {
                console.log('Seed leaders');
                var leaders = [{
                    img: 'fff.png',
                    firstName: 'Андрій',
                    lastName: 'Дмитров',
                    cityFrom: 'Харків',
                    created: new Date(),
                    eventsTotal: 128,
                    eventsOwn: 35,
                    winPercentage: 89
                }];
                return seed(Leader, leaders);
            })
            .then(function () {
                console.log('Done seeding');
            }, function (err) {
                console.log(err);
            })
        ;

    }

    function dropDb() {
        console.log('Drop db');
        db.connection.db.dropDatabase(function (err) {
            if (err) {
                console.log(err);
                done(false);
            } else {
                seedDb().then(done);
            }
        });
    }

    var config = require(process.cwd() + '/server/config/config');
    var db = mongoose.connect(config.db);

    console.log('Connect db');
    db.connection.on('connected', dropDb);

};

