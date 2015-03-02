var mongoose = require('mongoose');

var contestSchema = mongoose.Schema({
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

var Contest = mongoose.model('Contest', contestSchema);