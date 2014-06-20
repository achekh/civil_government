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
    },
    appeared: {
        type: Boolean,
        default: false
    }
});

/**
 * Statics
 */
ParticipantSchema.statics.load = function (id, cb) {
    this.findOne({_id: id})
        .populate('activist')
        .populate('event')
        .exec(cb);
};

var Participant = mongoose.model('Participant', ParticipantSchema);

ParticipantSchema.pre('save', function (next) {
    // TODO: not sure if it is a good way to prevent duplication
    var self = this;
    return Participant.findOne({event: self.event, activist: self.activist}, function (err, participant) {
        if (err) {
            return next(err);
        }
        if (participant) {
            self._id = participant._id;
        }
        next();
    }).exec();
});
