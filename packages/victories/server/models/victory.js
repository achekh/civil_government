'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var VictorySchema = new Schema({
    created: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true,
        ErrMsg: 'Необходимо заполнить поле "Название"'
    },
    description: {
        type: String
    },
    user: {
        type: Schema.ObjectId,
        ref: 'User',
        index: true
    },
    participants: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    organization: {
        type: String
    },
    status: {
        type: String
    },
    city: {
        type: String
    },
    img: {
        type: String,
        default: 'image_default_victory.png',
        trim: true
    },
    datetime: {
        type: Date
        //  validate: [notEmpty, 'Необходимо выбрать "Дату"']
    }
});

VictorySchema.statics.load = function (id, cb) {
    this.findOne({
        _id: id
    }).populate('user', 'name username').exec(cb);
};

mongoose.model('Victory', VictorySchema);
