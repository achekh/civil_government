'use strict';

var supports = require('../controllers/supports');

// authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.support.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

// The Package is past automatically as first parameter
module.exports = function(Supports, app, auth, database) {

    app.route('/supports')
        .get(supports.all)
        .post(auth.requiresLogin, supports.create);
    app.route('/supports/:supportId')
        .get(supports.show)
        .put(auth.requiresLogin, hasAuthorization, supports.update)
        .delete(auth.requiresLogin, hasAuthorization, supports.remove);

    app.param('supportId', supports.support);

};
