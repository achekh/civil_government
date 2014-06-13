'use strict';

//require(process.cwd() + '/server');
require(process.cwd() + '/server/models/user');
require(process.cwd() + '/packages/events/server/models/event');
require(process.cwd() + '/packages/videos/server/models/video');
require(process.cwd() + '/packages/activists/server/models/activist');
require(process.cwd() + '/packages/victories/server/models/victory');

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Event = mongoose.model('Event'),
    Video = mongoose.model('Video'),
    Activist = mongoose.model('Activist'),
    Victory = mongoose.model('Victory');

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
                    },
                    {
                        title: 'ВатаВарта',
                        description: 'А де вата?',
                        user: user,
                        organization: 'На Варті',
                        status: 'Initial',
                        datetime: new Date(),
                        sites: 'Харків'
                    }

                ];

                console.log('Seed events');
                return seed(Event, events)
                    .then(function() {
                        console.log('Find event "Admin: Путін Хуйло"');
                        return Event.findOne({title: 'Admin: Путін Хуйло'}).exec();
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
                    .then(function() {
                        console.log('Find event "ВатаВарта"');
                        return Event.findOne({title: 'ВатаВарта'}).exec();
                    })
                    .then(function(event) {

                        var videos = [
                            {
                                title: 'Майдан Свободи На Варті',
                                url: 'http://www.ustream.tv/channel/17823917',
                                user: user,
                                event: event,
                                live: true
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
                return seed(Event, events)
                    .then(function() {
                        console.log('Find event "Путін Хуйло"');
                        return Event.findOne({title: 'Путін Хуйло'}).exec();
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
                        return Event.findOne({title: 'Пісні UA'}).exec();
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
                    .then(function() {
                        var activists = [{
                           user: user,
                           fullName: user.name,
                           emails:[user.email],
                           country:'Украiна',
                           city:'Кieв',
                           phones:['+380'],
                           img:'http://ts4.mm.bing.net/th?id=HN.608052457444082755&pid=15.1'
                        }];
                        console.log('Seed activist');
                        return seed(Activist, activists);
                    })
                    .then(function() {
                        var victories = [{
                            title: 'Верховная Рада прийняла закон про амнистію',
                            datetime: new Date(),
                            city: 'Київ',
                            img: 'http://nvip.com.ua/sites/default/files/imagecache/original_watermark/pictures/news/gallery/util-final10.jpg'
                        }];
                        console.log('Seed victory');
                        return seed(Victory, victories);
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
