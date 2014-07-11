'use strict';

var mongoose = require('mongoose'),
    Record = mongoose.model('Record');

module.exports = function(app) {

    app.route('/records')
        .get(function(req, res) {
            Record.findOneAndUpdate({},{'dummy':0},{upsert:true}).exec(function(err, record) {
                if (err) {
                    res.status(500).send(err.errors || [err]);
                } else {
                    res.status(200).send(record);
                }
            });
        });

};