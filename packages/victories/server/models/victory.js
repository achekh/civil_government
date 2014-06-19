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
        ref: 'User' //user, who created the victory instance. Technical field, not business logic one.
    },
    organization: {
        type: Schema.ObjectId,
        ref: 'Organization' //Organization, which achieved the victory. Organizations, which provided support for the victory, are stored as SupportVictory.
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

VictorySchema.post('save', function updateVictoryOrganizationVictoryCount(victory) {
    mongoose.model('Organization').findById(victory.organization, function(err, organization) {
        if (err) {
            console.log(err);
        } else {
            return organization.updateVictoryCount();
        }
    });
});

mongoose.model('Victory', VictorySchema);
