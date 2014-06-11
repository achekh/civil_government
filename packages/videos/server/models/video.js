'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Video Schema
 */
var VideoSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        default: '',
        trim: true
    },
    url: {
        type: String,
        default: '',
        trim: true
    },
    live: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    event: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Event'
    }
});

/**
 * Validations
 */
VideoSchema.path('title').validate(function (title) {
    return title.length;
}, 'Title cannot be blank');

VideoSchema.path('url').validate(function (url) {
    return url.length;
}, 'Url cannot be blank');

/**
 * Statics
 */
VideoSchema.statics.load = function (id, cb) {
    this.findOne({_id: id}).populate('user', 'username').populate('event', 'title').exec(cb);
};

mongoose.model('Video', VideoSchema);
