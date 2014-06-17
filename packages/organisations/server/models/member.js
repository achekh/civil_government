'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Video Schema
 */
var MemberSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    activist: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Activist'
    },
    organisation: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Organisation'
    },
    user: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    isLeader: {
        type: Boolean,
        default: false
    }
});

/**
 * Statics
 */
MemberSchema.statics.load = function (id, cb) {
    this.findOne({_id: id})
        .populate('activist')
        .populate('organisation')
        .exec(cb);
};

var Member = mongoose.model('Member', MemberSchema);

MemberSchema.pre('save', function (next) {
    // TODO: not sure if it is a good way to prevent duplication
    var self = this;
    return Member.findOne({organisation: self.organisation, activist: self.activist}, function (err, member) {
        if (err) {
            return next(err);
        }
        if (member) {
            self._id = member._id;
        }
        next();
    }).exec();
});
