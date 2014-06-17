'use strict';

var members = require('../controllers/members');

// authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.member.activist.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

// The Package is past automatically as first parameter
module.exports = function(Members, app, auth, database) {

    app.route('/members')
        .get(members.all)
        .post(auth.requiresLogin, members.create);
    app.route('/members/:memberId')
        .get(members.show)
        .put(auth.requiresLogin, hasAuthorization, members.update)
        .delete(auth.requiresLogin, hasAuthorization, members.remove);

    app.param('memberId', members.member);

};
