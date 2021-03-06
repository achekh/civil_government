'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


/**
 * Activist Schema
 */
var ActivistSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: [Date],
        default: []
    },
    name: {
        type: String,
        default: '',
        trim: true
    },
    country: {
        type: String,
        default: '',
        trim: true
    },
    city: {
        type: String,
        default: '',
        trim: true
    },
    emails: {
        type: [String],
        default: [],
        validate: [function(v){
            if (!v || !v.forEach) return false;
            var isValid = true;
            v.forEach(function(e) {
                isValid = isValid && /.+\@.+\..+/.test(e);
            });
            return isValid;
        }, 'Please enter a valid email']
    },
    phones: {
        type: [String],
        default: []
    },
    aboutMe: {
        type: String,
        default: '',
        trim: true
    },
    img: {
        type: String,
        default: 'image_default_activist.png',
        trim: true
        ,get: function(img) {
            if (!img) return img;
            return img.indexOf('http://') === 0 || img.indexOf('https://') === 0 ? img : 'http://dummyimage.com/100x100/858585/' + img;
        }
    },
    eventsTotal: {
        type: Number,
        default: 0
    },
    eventsOwn: {
        type: Number,
        default: 0
    },
    winPercentage: {
        type: Number,
        default: 0
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        index: true
    },
    region: {
        type: Schema.ObjectId,
        ref: 'Region'
    }
});

/**
 * Validations
 */
ActivistSchema.path('name').validate(function(name) {
    return name.length;
}, 'name cannot be blank');

/**
 * Statics
 */
ActivistSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').populate('region').exec(cb);
};

ActivistSchema.statics.loadByUserId = function(userId, cb) {
    this.findOne({
        user: userId
    }).populate('user', 'name username').populate('region').exec(cb);
};

ActivistSchema.virtual('displayName').get(function () {
//    if (this.lastName && this.lastName.length) {
//        return this.name + ' ' + this.lastName.substr(0, 1) + '.';
//    }
    return this.name;
});

ActivistSchema.set('toJSON', {
    virtuals: true
    ,getters: true
//    , transform: function (doc, ret, options) {
//        if (!options.lastName) {
//            delete ret.lastName;
//        }
//    }
});

ActivistSchema.post('save', function updateRecordsCount(activist) {
    activist.model('Record').updateCount('Activist','activists');
});


ActivistSchema.methods = {
    updateRecordsCount: function () {
        var activist = this;
        mongoose.model('Participant').count({activist: activist}, function(err, c) {
            if (err) {
                console.log(err);
            } else {
                activist.eventsTotal = Math.max(activist.eventsTotal, c);
                activist.save();
            }
        });
        mongoose.model('Participant').count({activist: activist, coordinator: true}, function(err, c) {
            if (err) {
                console.log(err);
            } else {
                activist.eventsOwn = Math.max(activist.eventsOwn, c);
                activist.save();
            }
        });
    }
};

mongoose.model('Activist', ActivistSchema);
