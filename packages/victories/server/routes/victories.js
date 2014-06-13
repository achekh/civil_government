'use strict';

var victories = require('../controllers/victories');

// authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.victory.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Victories, app, auth, database) {

    app.route('/victories')
        .get(victories.all)
        .post(auth.requiresLogin, victories.create);
    app.route('/victories/:victoryId')
        .get(victories.show)
        .put(auth.requiresLogin, hasAuthorization, victories.update)
        .delete(auth.requiresLogin, hasAuthorization, victories.destroy);

    app.param('victoryId', victories.victory);

//    app.get('/victories/example/anyone', function(req, res, next) {
//        res.send('Anyone can access this');
//    });
//
//    app.get('/victories/example/auth', auth.requiresLogin, function(req, res, next) {
//        res.send('Only authenticated users can access this');
//    });
//
//    app.get('/victories/example/admin', auth.requiresAdmin, function(req, res, next) {
//        res.send('Only users with Admin role can access this');
//    });
//
//    app.get('/victories/example/render', function(req, res, next) {
//        Victories.render('index', {
//            package: 'victories'
//        }, function(err, html) {
//            //Rendering a view from the Package server/views
//            res.send(html);
//        });
//    });
};
