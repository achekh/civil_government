'use strict';

// User routes use users controller
var users = require('../controllers/users'),
    http= require('http');

module.exports = function(app, passport) {

    app.route('/logout')
        .get(users.signout);
    app.route('/users/me')
        .get(users.me);

    // Setting up the users api
    app.route('/register')
        .post(users.create);

    app.route('/restore')
        .post(users.restore);
    app.route('/restore/:hash')
        .get(users.restore)
        .put(users.restore)
    ;

    // Setting up the userId param
    app.param('userId', users.user);
    app.param('hash', users.restoreUser);

    // AngularJS route to check for authentication
    app.route('/loggedin')
        .get(function(req, res) {
            res.send(req.isAuthenticated() ? req.user : '0');
        });

    // Setting the local strategy route
    app.route('/login')
        .post(passport.authenticate('local', {
            failureFlash: true
        }), function(req, res) {
            res.send({
                user: req.user,
                redirect: (req.user.roles.indexOf('admin') !== -1) ? req.get('referer') : false
            });
        });

    // Setting the facebook oauth routes
    app.route('/auth/facebook')
        .get(passport.authenticate('facebook', {
            scope: ['email', 'user_about_me'],
            failureRedirect: '/#!/login'
        }), users.signin);

    app.route('/auth/facebook/callback')
        .get(passport.authenticate('facebook', {
            failureRedirect: '/#!/login'
        }), users.authCallback);

    // Setting the github oauth routes
    app.route('/auth/github')
        .get(passport.authenticate('github', {
            failureRedirect: '/#!/login'
        }), users.signin);

    app.route('/auth/github/callback')
        .get(passport.authenticate('github', {
            failureRedirect: '/#!/login'
        }), users.authCallback);

    // Setting the twitter oauth routes
    app.route('/auth/twitter')
        .get(passport.authenticate('twitter', {
            failureRedirect: '/#!/login'
        }), users.signin);

    app.route('/auth/twitter/callback')
        .get(passport.authenticate('twitter', {
            failureRedirect: '/#!/login'
        }), users.authCallback);

    // Setting the google oauth routes
    app.route('/auth/google')
        .get(passport.authenticate('google', {
            failureRedirect: '/#!/login',
            scope: [
                'https://www.googleapis.com/auth/userinfo.profile',
                'https://www.googleapis.com/auth/userinfo.email'
            ]
        }), users.signin);

    app.route('/auth/google/callback')
        .get(passport.authenticate('google', {
            failureRedirect: '/#!/login'
        }), users.authCallback);

    // Setting the linkedin oauth routes
    app.route('/auth/linkedin')
        .get(passport.authenticate('linkedin', {
            failureRedirect: '/#!/login',
            scope: ['r_emailaddress']
        }), users.signin);

    app.route('/auth/linkedin/callback')
        .get(passport.authenticate('linkedin', {
            failureRedirect: '/#!/login'
        }), users.authCallback);

    // Setting the vkontakte oauth routes
    app.get('/auth/vkontakte',
        passport.authenticate('vkontakte'),
        function(req, res){
            // The request will be redirected to vk.com for authentication, so
            // this function will not be called.
        });

    app.get('/auth/vkontakte/callback',
        passport.authenticate('vkontakte', { failureRedirect: '/#!/login' }),
        users.authCallback);

    app.get('/auth/delete', users.deleteUser);

    app.post('/auth/ulogin/callback', function(req, res, next) {
        var rq = http.request('http://ulogin.ru/token.php?token=' + req.body.token + '&host=' + req.headers.host, function(rs) {
            rs.setEncoding('utf8');
            rs.on('data', function (chunk) {
                debugger;
                var profile = JSON.parse(chunk);
                profile.toString(); //maybe todo: make user
                users.authCallback(req, res, next);
            });
        });
        rq.on('error', function(e) {
            debugger;
            res.redirect('/#!/login');
        });
        rq.end();
    });
};