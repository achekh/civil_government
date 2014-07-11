'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Record Schema
 */
var RecordSchema = new Schema({
    activists:{
        type:Number,
        default: 0
    },
    organizations:{
        type:Number,
        default: 0
    },
    cities:{
        type:Number,
        default: 0
    },
    citiesSet:{
        type:Schema.Types.Mixed
    },
    events:{
        type:Number,
        default: 0
    },
    victories:{
        type:Number,
        default: 0
    },
    dummy:Number
});

RecordSchema.statics.updateCount = function(model, field) {
    debugger; //TODO cities
    mongoose.model(model).count({}, function(err, c) {
        mongoose.model('Record').findOneAndUpdate({},{dummy:0},{upsert:true}).exec(function(err, record) {
            if (err) {
                console.log(err);
            } else {
                record[field] = Math.max(record[field], c);
                record.save();
            }
        });
    });
};


mongoose.model('Record', RecordSchema);
