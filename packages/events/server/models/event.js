'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var EventSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: [Date],
        default: []
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        index: true
    },
    title: {
        type: String,
        required: true
    },
    organization: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    sites: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    min_part: {
        type: Number,
        default: 0
    },
    max_part: {
        type: Number,
        default: 0
    },
    gps: {
        type: String,
        default: '',
        trim: true
    }
});

EventSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Event', EventSchema);
