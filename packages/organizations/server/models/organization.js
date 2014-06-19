'use strict';

var mongoose = require('mongoose'),
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
    this.model('Event').count({organization:this}, function(err, count) {
        if (err) {
            p.reject(err);
        } else {
            organization.eventCount = count;
            organization.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
            p.fulfill(organization, count);
        }
    });
    return p;
});

OrganizationSchema.set('toJSON', {
    virtuals: true
});

mongoose.model('Organization', OrganizationSchema);
