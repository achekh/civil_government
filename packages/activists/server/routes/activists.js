'use strict';

var activists = require('../controllers/activists');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.activist.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Activists, app, auth) {

    app.route('/activists')
        .get(activists.get)
        .post(auth.requiresLogin, activists.create);
    app.route('/activists/:activistId')
        .get(activists.get)
        .put(auth.requiresLogin, hasAuthorization, activists.update);
//        .delete(auth.requiresLogin, hasAuthorization, activists.destroy);

    // Finish with setting up the activistId param
    app.param('activistId', activists.activist);
};
