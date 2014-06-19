'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Support Schema
 */
var SupportSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    event: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Event'
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
    }
});

SupportSchema.statics.load = function(id, cb) {
    this.findOne({_id: id})
        .populate('event')
        .populate('organization')
        .exec(cb);
};

var Support = mongoose.model('Support', SupportSchema);

SupportSchema.pre('save', function(next) {
    // TODO: not sure if it is a good way to prevent duplication
    var self = this;
    return Support.findOne({organization: self.organization, activist: self.event}, function (err, support) {
        if (err) {
            return next(err);
        }
        if (support) {
            self._id = support._id;
        }
        next();
    }).exec();
});

SupportSchema.post('save', function updateOrganizationSupportedEventCount(support) {
    support.model('Organization').findById(support.organization, function(err, organization) {
        if (err) {
            console.log(err);
        } else {
            return organization.updateSupportedEventCount();
        }
    });
});


