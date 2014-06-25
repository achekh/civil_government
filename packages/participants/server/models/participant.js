'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Participant Schema
 */
var ParticipantSchema = new Schema({
    _id: {
        type: String,
        required: true,
        unique: true
    },
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
    },
    confirmed: {
        type: Boolean,
        default: false
    }
});

ParticipantSchema.path('event').set(function (value) {
    this._id = '' + this.activist + ((typeof(value) === 'string') ? value : value._id);
    return value;
});

ParticipantSchema.path('activist').set(function (value) {
    this._id = '' + ((typeof(value) === 'string') ? value : value._id) + this.event;
    return value;
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

mongoose.model('Participant', ParticipantSchema);
