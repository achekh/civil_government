'use strict';

var organizations = require('../controllers/organizations');

// authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.organization.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

// The Package is past automatically as first parameter
module.exports = function(Organizations, app, auth, database) {

    app.route('/organizations')
        .get(organizations.all)
        .post(auth.requiresLogin, organizations.create);
    app.route('/organizations/:organizationId')
        .get(organizations.show)
        .put(auth.requiresLogin, hasAuthorization, organizations.update)
        .delete(auth.requiresLogin, hasAuthorization, organizations.remove);

    app.param('organizationId', organizations.organization);

};
