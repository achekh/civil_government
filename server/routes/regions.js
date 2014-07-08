'use strict';

var mongoose = require('mongoose'),
    Region = mongoose.model('Region');

module.exports = function(app) {

    app.route('/regions')
        .get(function(req, res) {
            Region.find({}).sort('value').exec(function(err, regions) {
                if (err) {
                    res.status(500).send(err.errors || [err]);
                } else {
                    res.status(200).send(regions);
                }
            });
        });

};