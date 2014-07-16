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
        })
        .put(function(req, res){
            Region.find({label:req.body.label}).exec(function(err, regions) {
                if (err) {
                    res.status(500).send(err.errors || [err]);
                } else {
                    if (regions && regions.length) {
                        res.status(200).send();
                    } else {
                        var region = new Region({value:req.body.value,label:req.body.label});
                        region.save(function(err, region){
                            if (err) {
                                res.status(500).send(err.errors || [err]);
                            } else {
                                res.status(200).send(region);
                            }
                        });
                    }
                }
            });
        });

};