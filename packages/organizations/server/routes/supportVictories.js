'use strict';

var supportVictories = require('../controllers/supportVictories');

// authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.supportVictory.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

// The Package is past automatically as first parameter
module.exports = function(SupportVictories, app, auth, database) {

    app.route('/support_victories')
        .get(supportVictories.all)
        .post(auth.requiresLogin, supportVictories.create);
    app.route('/support_victories/:supportVictoryId')
        .get(supportVictories.show)
        .put(auth.requiresLogin, hasAuthorization, supportVictories.update)
        .delete(auth.requiresLogin, hasAuthorization, supportVictories.remove);

    app.param('supportVictoryId', supportVictories.supportVictory);

};
