'use strict';

var videos = require('../controllers/videos');

// Article authorization helpers
var hasAuthorization = function(req, res, next) {
    if (!req.user.isAdmin && req.video.user.id !== req.user.id) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

module.exports = function(Videos, app, auth) {

    app.route('/videos')
        .get(videos.all)
        .post(auth.requiresLogin, videos.create);
    app.route('/videos/:videoId')
        .get(videos.show)
        .put(auth.requiresLogin, hasAuthorization, videos.update)
        .delete(auth.requiresLogin, hasAuthorization, videos.destroy);

    // Finish with setting up the videoId param
    app.param('videoId', videos.video);
};
