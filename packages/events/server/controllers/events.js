/**
 * Created by legalt on 26.05.2014.
 */
'use strict';

var mongoose = require('mongoose'),
    Events = mongoose.model('Events'),
    _ = require('lodash');

exports.create = function(req, res) {
    var events = new Events(req.body);
    events.user = req.user;

    events.save(function(err) {
        if (err) {
            return res.send('users/signup', {
                errors: err.errors,
                events: events
            });
        } else {
            res.jsonp(events);
        }
    });
};
exports.all = function(req, res) {
    Events.find().sort('-created').limit(3).populate('user', 'name username').exec(function(err, events) {
        if (err) {
            res.render('error', {
                status: 500
            });
        } else {
            res.jsonp(events);
        }
    });
};
exports.destroy = function(req,res){
    var event = req.event;
    res.jsonp(req.event);
   /* event.remove(function(err){

    });*/

};