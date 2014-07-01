'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Activist = mongoose.model('Activist'),
    User = mongoose.model('User');

var profile2Activist = {
    facebook: function(req, profile) {
        function getEmails(source) {
            var emails = [];
            if (source && source.length) {
                for (var i = 0; i < source.length; i++) {
                    emails[i] = source[i].value;
                }
            }
            return emails;
        }
        var activist = new Activist({
            user: req.user,
            name: profile.displayName,
            lastName: profile.name.familyName,
            emails: getEmails(profile.emails)
        });
        return activist;
    }
};

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    if (req.authInfo && req.authInfo.profile) {
        var profile = req.authInfo.profile;
        var activist = profile2Activist[profile.provider].call(this, req, profile);
        activist.save(function(err) {
            if (err) return next(err);
            res.redirect('/');
        });
    } else {
        res.redirect('/');
    }
};

/**
 * Show login form
 */
exports.signin = function(req, res) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.redirect('#!/login');
};

/**
 * Logout
 */
exports.signout = function(req, res) {
    req.logout();
    res.redirect('/');
};

/**
 * Session
 */
exports.session = function(req, res) {
    res.redirect('/');
};

/**
 * Create user
 */
exports.create = function(req, res, next) {
    var user = new User(req.body);

    user.provider = 'local';

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('name', 'Представтесь, пожалуйста').len(1,200);
    req.assert('email', 'Как с вами связаться по Е-Mail').isEmail();
    req.assert('username', 'Придумайте логин').len(1,20);
    req.assert('password', 'Пароль должен быть').len(1, 200);
    req.assert('confirmPassword', 'Пiдтверження паролю не прайшло').equals(req.body.password);

    var errors = req.validationErrors();
    if (errors) {
        return res.status(400).send(errors);
    }

    // Hard coded for now. Will address this with the user permissions system in v0.3.5
    user.roles = ['authenticated'];
    user.save(function(err) {
        if (err) {
            switch (err.code) {
                case 11000:
                case 11001:
                    return res.status(400).send('Такой логiн уже занят');
                default:
                    return res.status(400).send([{msg:'Ошибки при сохранении в базу'}]);
            }
        }
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.redirect('/');
        });
        res.status(200);
    });
};
/**
 * Send User
 */
exports.me = function(req, res) {
    res.jsonp(req.user || null);
};

/**
 * Find user by id
 */
exports.user = function(req, res, next, id) {
    User
        .findOne({
            _id: id
        })
        .exec(function(err, user) {
            if (err) return next(err);
            if (!user) return next(new Error('Failed to load User ' + id));
            req.profile = user;
            next();
        });
};