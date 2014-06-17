'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var OrganisationSchema = new Schema({
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
    }
});

OrganisationSchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('leader', 'name username displayName').exec(cb);
};

mongoose.model('Organisation', OrganisationSchema);
