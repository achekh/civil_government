'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Leader Schema
 */
var LeaderSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    img: {
        type: String,
        default: '',
        trim: true
    },
    firstName: {
        type: String,
        default: '',
        trim: true
    },
    lastName: {
        type: String,
        default: '',
        trim: true
    },
    cityFrom: {
        type: String,
        default: '',
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
    }
});

/**
 * Validations
 */
LeaderSchema.path('firstName').validate(function(firstName) {
    return firstName.length;
}, 'firstName cannot be blank');

LeaderSchema.path('lastName').validate(function(lastName) {
    return lastName.length;
}, 'lastName cannot be blank');

/**
 * Statics
 */
LeaderSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).exec(cb);
};

mongoose.model('Leader', LeaderSchema);
