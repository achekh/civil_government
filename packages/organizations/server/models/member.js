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
    organization: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Organization'
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
        .populate('organization')
        .exec(cb);
};

var Member = mongoose.model('Member', MemberSchema);

MemberSchema.pre('save', function (next) {
    // TODO: not sure if it is a good way to prevent duplication
    var self = this;
    return Member.findOne({organization: self.organization, activist: self.activist}, function (err, member) {
        if (err) {
            return next(err);
        }
        if (member) {
            self._id = member._id;
        }
        next();
    }).exec();
});

