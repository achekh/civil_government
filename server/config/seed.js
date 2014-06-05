'use strict';

//require(process.cwd() + '/server');
require(process.cwd() + '/server/models/user');
require(process.cwd() + '/packages/events/server/models/events');
require(process.cwd() + '/packages/videos/server/models/video');
require(process.cwd() + '/packages/leaders/server/models/leader');

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Events = mongoose.model('Events'),
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

                var events = [
                    {
                        title: 'Путін Хуйло',
                        description: 'Всеукраїнська акція',
                        user: user,
                        organization: 'Об’єднання Майдан Моніторинг',
                        status: 'Initial',
                        datetime: new Date()
                    },
                    {
                        title: 'Пісні про UA',
                        description: 'Всеукраїнська акція',
                        user: user,
                        organization: 'Об’єднання Майдан Моніторинг',
                        status: 'Initial',
                        datetime: new Date()
                    }
                ];

                console.log('Seed events');
                return seed(Events, events).then(function() {

                    var videos = [
                        {
                            created: new Date(),
                            title: 'Путін Хуйло, Донбас не віддамо! #Харків',
                            url: 'http://youtu.be/3CcKS0z7Bwo',
                            live: false,
                            user: user
                        },
                        {
                            created: new Date(),
                            title: 'Путін Хуйло, Донбас не віддамо! #WC2014',
                            url: 'http://www.youtube.com/watch?feature=player_embedded&v=SRHkwaVf1Ok',
                            live: false,
                            user: user
                        },
                        {
                            created: new Date(),
                            title: 'Финальная песня - Набери "Украина" в Гугле',
                            url: 'http://youtu.be/-OWTWVwvtNw',
                            live: false,
                            user: user
                        }

                    ];

                    console.log('Seed videos');
                    seed(Video, videos);

                });

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
