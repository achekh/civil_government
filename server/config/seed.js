'use strict';

//require(process.cwd() + '/server');
require(process.cwd() + '/server/models/user');
require(process.cwd() + '/server/models/region');
require(process.cwd() + '/server/models/record');
require(process.cwd() + '/packages/events/server/models/event');
require(process.cwd() + '/packages/videos/server/models/video');
require(process.cwd() + '/packages/activists/server/models/activist');
require(process.cwd() + '/packages/victories/server/models/victory');
require(process.cwd() + '/packages/organizations/server/models/organization');
require(process.cwd() + '/packages/organizations/server/models/member');

var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Region = mongoose.model('Region'),
    Event = mongoose.model('Event'),
    Video = mongoose.model('Video'),
    Activist = mongoose.model('Activist'),
    Victory = mongoose.model('Victory'),
    Member = mongoose.model('Member'),
    Organization = mongoose.model('Organization');

module.exports = function (done) {

    function seed(model, entities) {
        var promise = new mongoose.Promise();
        model.create(entities, function (err) {
            var es = [];
            for (var i = 1; i < arguments.length; i++) {
                es.push(arguments[i]);
            }
            if (err) {
                promise.reject(err);
            }
            else {
                promise.resolve(null, es);
            }
        });
        return promise;
    }

    function seedDb() {

        var regions = [
            {'value': '0.Вся Україна', 'label': 'Вся Україна'},
            {'value': '1.місто Київ', 'label': 'місто Київ'}
        ];

        console.log('Seed regions');
        return seed(Region, regions)
            .then(function(regions) {
                var users = [
                    {
                        name: 'Super Admin',
                        email: 'admin@example.com',
                        roles: ['admin', 'authenticated'],
                        password: 'admin'
                    },
                    {
                        name: 'Майдан Моніторинг',
                        email: 'maidanmonitoring@gmail.com',
                        roles: ['authenticated'],
                        password: 'maidan'
                    }
                ];

                console.log('Seed users');
                return seed(User, users)
                    .then(function () {
                        console.log('Find user "admin"');
                        return User.findOne({name: 'Super Admin'}).exec();
                    })
                    .then(function(user) {
                        var activists = [{
                            user: user,
                            name: user.name,
                            emails:[user.email],
                            country:'Украiна',
                            city:'Кieв',
                            phones:['+380'],
                            region:regions[1]
                        }];
                        console.log('Seed activist for user admin');
                        return seed(Activist, activists)
                            .then(function(){
                                console.log('Find activist "admin"');
                                return Activist.findOne({user: user}).exec();
                            })
                            .then(function(activist) {
                                var organizations = [
                                    {
                                        title: 'На Варті',
                                        user: user,
                                        region: regions[1]
                                    }
                                ];
                                console.log('Seed organizations for user admin');
                                return seed(Organization, organizations)
                                    .then(function () {
                                        console.log('Find organizations for user admin');
                                        return Organization.find({user: user}).exec();
                                    })
                                    .then(function (organizations) {
                                        var members = [{
                                            organization: organizations[0],
                                            activist: activist,
                                            isLeader: true,
                                            user: user
                                        }];
                                        console.log('Seed members for user admin');
                                        return seed(Member, members)
                                            .then(function(){
                                                var events = [
                                                    {
                                                        title: 'ВатаВарта',
                                                        description: 'А де вата?',
                                                        user: user,
                                                        organization: organizations[0],
                                                        status: 'FOR_APPROVAL',
                                                        datetime: new Date(),
                                                        sites: 'Киев',
                                                        region: regions[1]
                                                    }
                                                ];
                                                console.log('Seed events for admin');
                                                return seed(Event, events)
                                                    .then(function () {
                                                        console.log('Find events for admin');
                                                        return Event.find().exec();
                                                    })
                                                    .then(function (events) {
                                                        var videos = [
                                                            {
                                                                title: 'Майдан Свободи На Варті',
                                                                url: 'http://www.ustream.tv/channel/17823917',
                                                                user: user,
                                                                event: events[0],
                                                                live: true
                                                            }
                                                        ];
                                                        console.log('Seed videos for admin');
                                                        return seed(Video, videos);
                                                    })
                                                    ;
                                            });
                                    })
                                    ;
                            })
                            ;
                    })
                    .then(function () {
                        console.log('Find user "maidanmonitoring"');
                        return User.findOne({name: 'Майдан Моніторинг'}).exec();
                    })
                    .then(function(user) {
                        var activists = [{
                            user: user,
                            name: user.name,
                            emails:[user.email],
                            country:'Украiна',
                            city:'Кieв',
                            phones:['+380'],
                            region:regions[0]
                        }];
                        console.log('Seed activist for user maidan');
                        return seed(Activist, activists)
                            .then(function(){
                                console.log('Find activist maidan');
                                return Activist.findOne({user: user}).exec();
                            })
                            .then(function(activist) {
                                var organizations = [
                                    {
                                        title: 'Об’єднання Майдан Моніторинг',
                                        user: user
                                    }
                                ];
                                console.log('Seed organizations for user maidan');
                                return seed(Organization, organizations)
                                    .then(function () {
                                        console.log('Find organizations for user maidan');
                                        return Organization.find({user: user}).exec();
                                    })
                                    .then(function (organizations) {
                                        var members = [{
                                            organization: organizations[0],
                                            activist: activist,
                                            isLeader: true,
                                            user: user
                                        }];
                                        console.log('Seed members for user maidan');
                                        return seed(Member, members)
                                            .then(function(){
                                                var events = [
                                                    {
                                                        title: 'Путін Хуйло',
                                                        description: 'Всеукраїнська акція',
                                                        user: user,
                                                        organization: organizations[0],
                                                        status: 'FOR_APPROVAL',
                                                        datetime: new Date(),
                                                        sites: 'Україна',
                                                        region: regions[0]
                                                    },
                                                    {
                                                        title: 'Пісні UA',
                                                        description: 'Всеукраїнська акція',
                                                        user: user,
                                                        organization: organizations[0],
                                                        status: 'FOR_APPROVAL',
                                                        datetime: new Date(),
                                                        sites: 'Україна',
                                                        region: regions[0]
                                                    }
                                                ];
                                                console.log('Seed events for maidan');
                                                return seed(Event, events)
                                                    .then(function () {
                                                        console.log('Find events for maidan');
                                                        return Event.find({user: user}).sort('created').exec();
                                                    })
                                                    .then(function (events) {
                                                        var videos = [
                                                            {
                                                                title: 'Путін Хуйло, Донбас не віддамо! #Харків',
                                                                url: 'http://youtu.be/3CcKS0z7Bwo',
                                                                user: user,
                                                                event: events[0]
                                                            },
                                                            {
                                                                title: 'Путін Хуйло, Донбас не віддамо! #WC2014',
                                                                url: 'http://www.youtube.com/watch?feature=player_embedded&v=SRHkwaVf1Ok',
                                                                user: user,
                                                                event: events[0]
                                                            },
                                                            {
                                                                title: 'Финальная песня - Набери "Украина" в Гугле',
                                                                url: 'http://youtu.be/-OWTWVwvtNw',
                                                                user: user,
                                                                event: events[1]
                                                            }
                                                        ];
                                                        console.log('Seed videos');
                                                        return seed(Video, videos);
                                                    })
                                                    ;
                                            });
                                    })
                                    ;
                            })
                            .then(function(){
                                var victories = [{
                                    title: 'Верховная Рада прийняла закон про амнистію',
                                    datetime: new Date(),
                                    city: 'Київ',
                                    user: user,
                                    region: regions[1]
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
            });
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

    var config = require(process.cwd() + '/server/config/config')();
    var db = mongoose.connect(config.db);

    console.log('Connect db');
    db.connection.on('connected', dropDb);

};
