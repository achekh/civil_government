'use strict';

var mongoose = require('mongoose'),
	User = mongoose.model('User');
	//Video = mongoose.model('Video');

module.exports = function(db) {
	var mdb = db.connection.db;

    console.log('[seed.js] dropping database');
	mdb.dropDatabase();

	var users = [
	{
		name: 'Майдан Моніторинг',
		email: 'maidanmonitoring@gmail.com',
		username: 'maidanmonitoring',
		roles: ['authenticated']
	}
	];
	
	users.forEach(function (usr) {
		var user = new User(usr);
		user.save();
	});
	
	var userId = User.find({username: 'maidanmonitoring'}).id;
	
	var videos = [
	{
		created: new Date(2014, 5, 1, 11, 40),
		title: 'Путін Хуйло, Донбас не віддамо! #Харків',
		url: 'http://youtu.be/3CcKS0z7Bwo',
		live: false,
		user: userId
	},
	{
		created: new Date(2014, 5, 1, 11, 45),
		title: 'Финальная песня - Набери "Украина" в Гугле',
		url: 'http://youtu.be/-OWTWVwvtNw',
		live: false,
		user: userId
	}
	];

	mdb.collection('videos', function(err, collection) {
        collection.insert(videos, {safe:true}, function(err, result) {});
    });
	// videos.forEach(function (vid) {
		// var video = new Video(vid);
		// video.save();
	// });

    console.log('[seed.js] inserting leaders into database');
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
    mdb.collection('mean-dev.leaders', function(err, collection) {
        collection.insert(leaders, {safe:true}, function(err, result) {});
    });
};

