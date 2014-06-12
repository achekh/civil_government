'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Video Schema
 */
var ParticipantSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    activist: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Activist'
    },
    event: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Event'
    },
    coordinator: {
        type: Boolean,
        default: false
    }
});

/**
 * Statics
 */
ParticipantSchema.statics.load = function (id, cb) {
    this.findOne({_id: id})
//        .populate('activist', 'username')
        .exec(cb);
};

mongoose.model('Participant', ParticipantSchema);
