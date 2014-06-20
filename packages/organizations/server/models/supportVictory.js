'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Support Schema
 */
var SupportVictorySchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    victory: {
        type: Schema.ObjectId,
        required: true,
        ref: 'Victory'
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

SupportVictorySchema.statics.load = function(id, cb) {
    this.findOne({_id: id})
        .populate('victory')
        .populate('organization')
        .exec(cb);
};

var SupportVictory = mongoose.model('SupportVictory', SupportVictorySchema);

SupportVictorySchema.pre('save', function(next) {
    // TODO: not sure if it is a good way to prevent duplication
    var self = this;
    return SupportVictory.findOne({organization: self.organization, victory: self.victory}, function (err, supportVictory) {
        if (err) {
            return next(err);
        }
        if (supportVictory) {
            self._id = supportVictory._id;
        }
        next();
    }).exec();
});

SupportVictorySchema.post('save', function updateOrganizationSupportedVictoryCount(supportVictory) {
    supportVictory.model('Organization').findById(supportVictory.organization, function(err, organization) {
        if (err) {
            console.log(err);
        } else {
            if (organization)
                return organization.updateSupportedVictoryCount();
        }
    });
});


