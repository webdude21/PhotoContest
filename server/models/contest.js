'use strict';
/*eslint-disable */
var mongoose = require('mongoose'),
    contestSchema = mongoose.Schema({
        name: {type: String, require: '{PATH} is required'},
        startDate: {type: Date, default: Date.now},
        endDate: {type: Date, default: Date.now},
        comment: {type: String},
        visible: {type: Boolean, default: true},
        winners: [{
            fullName: {type: String, require: '{PATH} is required'},
            award: {type: String, require: '{PATH} is required'},
            prize: {type: String, require: '{PATH} is required'},
            age: {type: String},
            town: {type: String},
            pictures: [{
                serviceId: String,
                url: String,
                fileName: String
            }]
        }]
    });
mongoose.model('ContestModel', contestSchema);
