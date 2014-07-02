'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    config = require('../config/config'),
    nodemailer = require('nodemailer'),
    Activist = mongoose.model('Activist'),
    User = mongoose.model('User');

function getEmails(source) {
    var emails = [];
    if (source && source.length) {
        for (var i = 0; i < source.length; i++) {
            emails[i] = source[i].value;
        }
    }
    return emails;
}

/**
 * Auth callback
 */
exports.authCallback = function(req, res, next) {
    if (req.authInfo && req.authInfo.profile) {
        var profile = req.authInfo.profile;

        var activist = new Activist({
            user: req.user,
            name: profile.displayName,
            emails: getEmails(profile.emails)
        });
        if (profile._json.profile_image_url) {
            activist.img = profile._json.profile_image_url;
        }

        activist.save(function(err) {
            if (err) return next(err);
            res.redirect('/#!/activists/create');
        });
    } else {
        res.redirect('/#!/activists/view');
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
    user.username = user.email;

    // because we set our user.provider to local our models/user.js validation will always be true
    req.assert('name', 'Представтесь, пожалуйста').len(1,200);
    req.assert('email', 'Как с вами связаться по Е-Mail').isEmail();
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
                    return res.status(400).send([{msg:'Такой email уже занят'}]);
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

exports.deleteUser = function(req, res) {
    if (config.app.env === 'development') {
        Activist.find().exec()
            .then(function(activists) {
                activists.forEach(function(activist, index) {
                    if (activist.name === 'Super Admin' || activist.name === 'Майдан Моніторинг') return;
                    activist.remove(function(err) {
                        if (err) console.log(err);
                    });
                });
            });
        User.find().exec()
            .then(function(users) {
                users.forEach(function(user, index) {
                    if (user.name === 'Super Admin' || user.name === 'Майдан Моніторинг') return;
                    user.remove(function(err) {
                        if (err) console.log(err);
                    });
                });
            });
    }
    res.redirect('/');
};

exports.restore = function(req, res, next) {
    if (req.method === 'POST') {
        return User.find({email:req.body.email}).exec()
            .then(function(users){
                var text, ref;
                if (users.length) {
                    ref = config.app.publicUrl + '/#!/restore/' + encodeURIComponent(users[0].hashed_password);
                    text = 'Ваш пароль от системы гражданского самоуправления можно восстановить, пройдя по ссылке ' + ref;
                } else {
                    ref = config.app.publicUrl + '/#!/register';
                    text = 'Ваш email не зарегистрирован в системе гражданского самоуправления. Вы можете зарегистрироваться, пройдя по ссылке ' + ref;
                }
                //civil.government.ua@gmail.com
                var transport = nodemailer.createTransport('SMTP', {
                    debug: config.app.env === 'development',
                    auth: {
                        user: 'civil.government.ua.service@gmail.com',
                        pass: 'service_password'
                    }
                });
                transport.sendMail({
                    from: 'civil.government.ua.service@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: 'Восстановление пароля к системе гражданского самоуправления', // Subject line
                    text: text // plaintext body
//                html: '<b>Hello world ✔</b>' // html body
                }, function(err,response) {
                if (err) {
                        console.log(err);
                        return res.status(500).send([{msg:'not ok',err:err}]);
                    }
                    res.status(200).send([{msg:'ok',response:response}]);
                    // response.statusHandler only applies to 'direct' transport
//                    response.statusHandler.once('failed', function(data){
//                        console.log(
//                            'Permanently failed delivering message to %s with the following response: %s',
//                            data.domain, data.response);
//                        res.status(500).send([{msg:'not ok',data:data}]);
//                    });
//
//                    response.statusHandler.once('requeue', function(data){
//                        console.log('Temporarily failed delivering message to %s', data.domain);
//                        res.status(500).send([{msg:'not ok',data:data}]);
//                    });
//
//                    response.statusHandler.once('sent', function(data){
//                        console.log('Message was accepted by %s', data.domain);
//                        res.status(200).send([{msg:'ok',data:data}]);
//                    });
                });
            }
            ,function(err){
                return res.status(500).send([{msg:'not ok'}]);
            });
    } else if (req.method === 'GET') {
        if (req.restoreUser) {
            return res.status(200).send(req.restoreUser);
        } else {
            return res.status(400).send();
        }
    } else if (req.method === 'PUT') {
        if (req.restoreUser) {
            req.restoreUser.password = req.body.password;
            req.restoreUser.save(function(err,user){
                if (err) {
                    console.log(err);
                    res.status(500).send([{msg:'not ok',err:err}]);
                } else {
                    res.status(200).send(user);
                }
            });
        } else {
            return res.status(400).send();
        }
    }
    return res.status(404);
};

exports.restoreUser = function(req, res, next, id) {
    User
        .findOne({
            hashed_password: decodeURIComponent(id)
        })
        .exec(function(err, user) {
            if (err) console.log(err);
            req.restoreUser = user;
            next();
        });
};
