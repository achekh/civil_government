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
    },
    img: {
        type: String,
        default: 'image_default_event.png',
        trim: true
        ,get: function(img) {
            if (!img) return img;
            return img.indexOf('http://') === 0 || img.indexOf('https://') === 0 ? img : 'http://dummyimage.com/100x100/858585/' + img;
        }
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

EventSchema.statics.statuses = statuses;

EventSchema.set('toJSON', {
    virtuals: true,
    getters: true
});

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
