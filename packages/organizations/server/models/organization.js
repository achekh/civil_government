'use strict';

var mongoose = require('mongoose'),
    Event = mongoose.model('Event'),
    Schema = mongoose.Schema;

var OrganizationSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    shortTitle: {
        type: String
    },
    status: {
        type: String
    },
    sites: {
        type: String
    },
    description: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    eventCount: Number
});

OrganizationSchema.statics.load = function (id, cb) {
    return this.findOne({
        _id: id
    }).populate('leader', 'name username displayName').exec(cb);
};

OrganizationSchema.method('calcEventCount', function calcEventCount() {
    var organization = this;
    var p = new mongoose.Promise();
    Event.find({organization:this}).count(function(err, count) {
        if (err) {
            p.reject(err);
        } else {
            organization.eventCount = count;
            p.complete(organization, count);
        }
    });
    return p;
});

OrganizationSchema.set('toJSON', {
    virtuals: true
});

mongoose.model('Organization', OrganizationSchema);
