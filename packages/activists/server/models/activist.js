'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Activist Schema
 */
var ActivistSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: [Date],
        default: []
    },
    fullName: {
        type: String,
        default: '',
        trim: true
    },
    country: {
        type: String,
        default: '',
        trim: true
    },
    city: {
        type: String,
        default: '',
        trim: true
    },
    emails: {
        type: [String],
        default: []
    },
    phones: {
        type: [String],
        default: []
    },
    aboutMe: {
        type: String,
        default: '',
        trim: true
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        index: true
    }
});

/**
 * Validations
 */
ActivistSchema.path('fullName').validate(function(fullName) {
    return fullName.length;
}, 'fullName cannot be blank');

/**
 * Statics
 */
ActivistSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Activist', ActivistSchema);
