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
    city: {
        type: String
    },
    img: {
        type: String,
        default: 'image_default_organization.png',
        trim: true
        ,get: function(img) {
            if (!img) return img;
            return img.indexOf('http://') === 0 || img.indexOf('https://') === 0 ? img : 'http://dummyimage.com/100x100/858585/' + img;
        }
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    region: {
        type: Schema.ObjectId,
        ref: 'Region'
    },
    eventCount: Number,
    supportedEventCount: Number,
    victoryCount: Number,
    supportedVictoryCount: Number
});

OrganizationSchema.statics.load = function (id, cb) {
    return this.findOne({
        _id: id
    }).populate('region').exec(cb);
};

OrganizationSchema.method('updateEventCount', function updateEventCount() {
    var organization = this;
    var promise = new mongoose.Promise();
    this.model('Event').count({organization:this}, function(err, count) {
        if (err) {
            promise.reject(err);
        } else {
            organization.eventCount = count;
            organization.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
            promise.fulfill(organization);
        }
    });
    return promise;
});

OrganizationSchema.method('updateSupportedEventCount', function updateSupportedEventCount() {
    var organization = this;
    var promise = new mongoose.Promise();
    this.model('Support').count({organization:this}, function(err, count) {
        if (err) {
            promise.reject(err);
        } else {
            organization.supportedEventCount = count;
            organization.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
            promise.complete(organization);
        }
    });
    return promise;
});

OrganizationSchema.method('updateVictoryCount', function updateVictoryCount() {
    var organization = this;
    var promise = new mongoose.Promise();
    this.model('Victory').count({organization:this}, function(err, count) {
        if (err) {
            promise.reject(err);
        } else {
            organization.victoryCount = count;
            organization.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
            promise.complete(organization);
        }
    });
    return promise;
});

OrganizationSchema.method('updateSupportedVictoryCount', function updateSupportedVictoryCount() {
    var organization = this;
    var promise = new mongoose.Promise();
    this.model('SupportVictory').count({organization:this}, function(err, count) {
        if (err) {
            promise.reject(err);
        } else {
            organization.supportedVictoryCount = count;
            organization.save(function(err) {
                if (err) {
                    console.log(err);
                }
            });
            promise.complete(organization);
        }
    });
    return promise;
});

OrganizationSchema.set('toJSON', {
    virtuals: true,
    getters: true
});

OrganizationSchema.post('save', function updateRecordsCount(organization) {
    organization.model('Record').updateCount('Organization','organizations');
});

mongoose.model('Organization', OrganizationSchema);
