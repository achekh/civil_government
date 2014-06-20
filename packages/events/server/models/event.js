'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var statuses = ['FOR_APPROVAL', 'APPROVED', 'AGREED', 'IN_PROGRESS', 'FINISHED', 'CANCELED', 'WIN'];

var EventSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: [Date],
        default: []
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        index: true
    },
    title: {
        type: String,
        required: true
    },
    organization: {
        type: Schema.ObjectId,
        ref: 'Organization',
        required: true
    },
    datetime: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: statuses,
        required: true
    },
    sites: {
        type: String,
        default: '',
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    min_part: {
        type: Number,
        default: 0
    },
    max_part: {
        type: Number,
        default: 0
    },
    gps: {
        type: String,
        default: '',
        trim: true
    }
});

EventSchema.statics.load = function (id, cb) {
    this.findOne({_id: id})
        .populate('user', 'username')
        .populate('organization', 'title')
        .exec(cb)
    ;
};

EventSchema.statics.statuses = statuses;

EventSchema.post('save', function updateEventOrganizationEventCount(event) {
    event.model('Organization').findById(event.organization, function(err, organization) {
        if (err) {
            console.log(err);
        } else {
            if (organization)
                return organization.updateEventCount();
        }
    });
});

mongoose.model('Event', EventSchema);
