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
    lastName: {
        type: String,
        default: '',
        trim: true
    },
    country: {
        type: String,
        default: 'Невядомая краiна',
        trim: true
    },
    city: {
        type: String,
        default: 'Невядомае мicто',
        trim: true
    },
    emails: {
        type: [String],
        default: []
    },
    phones: {
        type: [String],
        default: ['Невядомы телефон']
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
            return img.indexOf('http://') === 0 ? img : 'http://dummyimage.com/100x100/858585/' + img;
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
    }).populate('user', 'name username').exec(cb);
};

ActivistSchema.virtual('displayName').get(function () {
    if (this.lastName && this.lastName.length) {
        return this.name + ' ' + this.lastName.substr(0, 1) + '.';
    }
    return this.name;
});

ActivistSchema.set('toJSON', {
    virtuals: true
    ,getters: true
    , transform: function (doc, ret, options) {
        if (!options.lastName) {
            delete ret.lastName;
        }
    }
});

mongoose.model('Activist', ActivistSchema);
