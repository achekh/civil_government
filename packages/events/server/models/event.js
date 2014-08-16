'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var statuses = ['FOR_APPROVAL', 'APPROVED', 'AGREED', 'STARTED', 'FINISHED', 'CANCELED', 'DEFEATED', 'WON'];

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
        required: true,
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
        required: true,
        default: statuses[0]
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
    address: {
        type: String,
        default: '',
        trim: true
    },
    gps: {
        type: String,
        default: '',
        trim: true
    },
    google_maps_api_address: {
        type: Schema.Types.Mixed
    },
    region: {
        type: Schema.ObjectId,
        ref: 'Region'
    }
});

EventSchema.statics.load = function (id, cb) {
    this.findOne({_id: id})
        .populate('user', 'username')
        .populate('organization')
        .populate('region')
        .exec(cb)
    ;
};

EventSchema.path('status').set(function (value) {
    var currentValue = this.status;
    if (currentValue === value) return value;
    if (currentValue === undefined && value === 'FOR_APPROVAL') return value;
    if (currentValue === 'FOR_APPROVAL' && (value === 'APPROVED' || value === 'CANCELED')) return value;
    if (currentValue === 'APPROVED' && (value === 'AGREED' || value === 'STARTED' || value === 'CANCELED')) return value;
    if (currentValue === 'AGREED' && (value === 'STARTED' || value === 'CANCELED')) return value;
    if (currentValue === 'STARTED' && (value === 'FINISHED' || value === 'CANCELED')) return value;
    if (currentValue === 'FINISHED' && (value === 'DEFEATED' || value === 'WON' || value === 'CANCELED')) return value;
    return currentValue;
});

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

EventSchema.post('save', function updateRecordsCount(event) {
    event.model('Record').updateCount('Event','events');
});

mongoose.model('Event', EventSchema);
