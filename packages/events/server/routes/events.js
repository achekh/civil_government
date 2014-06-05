'use strict';
var events = require('../controllers/events');
// The Package is past automatically as first parameter
module.exports = function(Events, app, auth, database) {
    app.route('/events').get(events.all)
        .post(events.create);
    app.route('/events/:eventsId').delete(events.destroy);
};
