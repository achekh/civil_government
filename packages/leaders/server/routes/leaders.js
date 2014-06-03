'use strict';

var leaders = require('../controllers/leaders');

// The Package is past automatically as first parameter
module.exports = function(Leaders, app, auth, database) {

    app.route('/leaders')
        .get(leaders.query);


//    app.get('/leaders/example/anyone', function(req, res, next) {
//        res.send('Anyone can access this');
//    });
//
//    app.get('/leaders/example/auth', auth.requiresLogin, function(req, res, next) {
//        res.send('Only authenticated users can access this');
//    });
//
//    app.get('/leaders/example/admin', auth.requiresAdmin, function(req, res, next) {
//        res.send('Only users with Admin role can access this');
//    });
//
//    app.get('/leaders/example/render', function(req, res, next) {
//        Leaders.render('index', {
//            package: 'leaders'
//        }, function(err, html) {
//            //Rendering a view from the Package server/views
//            res.send(html);
//        });
//    });
};
