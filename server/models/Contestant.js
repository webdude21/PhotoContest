'use strict';
/*eslint-disable */
var mongoose = require('mongoose'),
    contestantSchema = mongoose.Schema({
        fullName: {type: String, require: '{PATH} is required'},
        age: {type: String, require: '{PATH} is required'},
        registerDate: {type: Date, default: Date.now},
        approved: {type: Boolean, default: true},
        registrant: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        comment: String,
        pictures: [
            {
                serviceId: String,
                url: String,
                fileName: String
            }
        ]
    });
mongoose.model('Contestant', contestantSchema);
