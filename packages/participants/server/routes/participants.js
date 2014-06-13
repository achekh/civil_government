'use strict';

var participants = require('../controllers/participants');

// authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.participant.activist.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

// The Package is past automatically as first parameter
module.exports = function(Participants, app, auth, database) {

    app.route('/participants')
        .get(participants.all)
        .post(auth.requiresLogin, participants.create);
    app.route('/participants/:participantId')
        .get(participants.show)
        .put(auth.requiresLogin, hasAuthorization, participants.update)
        .delete(auth.requiresLogin, hasAuthorization, participants.destroy);

    app.param('participantId', participants.participant);

};
