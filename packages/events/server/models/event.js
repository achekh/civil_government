/**
 * Created by legalt on 26.05.2014.
 */
'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

//var validatePresenceOf = function (value) {
//    return this.provider;
//};

var EventSchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
        // message: 'Необходимо заполнить поле "Информация"'
        // validate: [validatePresenceOf, 'Необходимо заполнить поле "Наименование"']
    },
    description: {
        type: String, required: true,
        ErrMsg: 'Необходимо заполнить поле "Информация"'
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    organization: {
        type: String,
        required: true

    },
    status: {
        type: String,
        required: true
    },
    datetime: {
        type: Date,
        required: true
        //  validate: [notEmpty, 'Необходимо выбрать "Дату"']
    },
    sites: {
        type: String,
        default: '',
        trim: true
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
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Event', EventSchema);
