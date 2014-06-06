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
        default: 'Невядомая краiна',
        trim: true
    },
    city: {
        type: String,
        default: 'Невядомае мicто',
        trim: true
    },
    emails: {
        type: [String],
        default: []
    },
    phones: {
        type: [String],
        default: ['Невядомы телефон']
    },
    aboutMe: {
        type: String,
        default: '',
        trim: true
    },
    img: {
        type: String,
        default: 'image_default_activist.png',
        trim: true
    },
    eventsTotal: {
        type: Number,
        default: 0
    },
    eventsOwn: {
        type: Number,
        default: 0
    },
    winPercentage: {
        type: Number,
        default: 0
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
