'use strict';

//require(process.cwd() + '/server');
require(process.cwd() + '/server/models/user');
require(process.cwd() + '/packages/events/server/models/events');
require(process.cwd() + '/packages/videos/server/models/video');

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Events = mongoose.model('Events'),
    Video = mongoose.model('Video');

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

                var events = [
                    {
                        title: 'Admin: Путін Хуйло',
                        description: 'Всеукраїнська акція',
                        user: user,
                        organization: 'Об’єднання Майдан Моніторинг',
                        status: 'Initial',
                        datetime: new Date(),
                        sites: 'Україна'
                    }
                ];

                console.log('Seed events');
                return seed(Events, events)
                    .then(function() {
                        console.log('Find event "Admin: Путін Хуйло"');
                        return Events.findOne({title: 'Admin: Путін Хуйло'}).exec();
                    })
                    .then(function(event) {

                        var videos = [
                            {
                                title: 'Admin: Путін Хуйло, Донбас не віддамо! #Харків',
                                url: 'http://youtu.be/3CcKS0z7Bwo',
                                user: user,
                                event: event
                            }

                        ];

                        console.log('Seed videos');
                        return seed(Video, videos);

                    })
                ;

            })
            .then(function () {
                console.log('Find user "maidanmonitoring"');
                return User.findOne({username: 'maidanmonitoring'}).exec();
            })
            .then(function(user) {

                var events = [
                    {
                        title: 'Путін Хуйло',
                        description: 'Всеукраїнська акція',
                        user: user,
                        organization: 'Об’єднання Майдан Моніторинг',
                        status: 'Initial',
                        datetime: new Date(),
                        sites: 'Україна'
                    },
                    {
                        title: 'Пісні UA',
                        description: 'Всеукраїнська акція',
                        user: user,
                        organization: 'Об’єднання Майдан Моніторинг',
                        status: 'Initial',
                        datetime: new Date(),
                        sites: 'Україна'
                    }
                ];

                console.log('Seed events');
                return seed(Events, events)
                    .then(function() {
                        console.log('Find event "Путін Хуйло"');
                        return Events.findOne({title: 'Путін Хуйло'}).exec();
                    })
                    .then(function(event) {

                        var videos = [
                            {
                                title: 'Путін Хуйло, Донбас не віддамо! #Харків',
                                url: 'http://youtu.be/3CcKS0z7Bwo',
                                user: user,
                                event: event
                            },
                            {
                                title: 'Путін Хуйло, Донбас не віддамо! #WC2014',
                                url: 'http://www.youtube.com/watch?feature=player_embedded&v=SRHkwaVf1Ok',
                                user: user,
                                event: event
                            }

                        ];

                        console.log('Seed videos');
                        return seed(Video, videos);

                    })
                    .then(function() {
                        console.log('Find event "Пісні UA"');
                        return Events.findOne({title: 'Пісні UA'}).exec();
                    })
                    .then(function(event) {

                        var videos = [
                            {
                                title: 'Финальная песня - Набери "Украина" в Гугле',
                                url: 'http://youtu.be/-OWTWVwvtNw',
                                user: user,
                                event: event
                            }

                        ];

                        console.log('Seed videos');
                        return seed(Video, videos);

                    })
                ;

            })
            .then(function () {
                console.log('Done seeding');
                return true;
            }, function (err) {
                console.log(err);
                return false;
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
