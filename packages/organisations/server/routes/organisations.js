'use strict';

var organisations = require('../controllers/organisations');

// authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.organisation.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

// The Package is past automatically as first parameter
module.exports = function(Organisations, app, auth, database) {

    app.route('/organisations')
        .get(organisations.all)
        .post(auth.requiresLogin, organisations.create);
    app.route('/organisations/:organisationId')
        .get(organisations.show)
        .put(auth.requiresLogin, hasAuthorization, organisations.update)
        .delete(auth.requiresLogin, hasAuthorization, organisations.remove);

    app.param('organisationId', organisations.organisation);

};
