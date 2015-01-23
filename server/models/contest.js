var mongoose = require('mongoose');

var contestSchema = mongoose.Schema({
    name: {type: String, require: '{PATH} is required'},
    startDate: {type: Date, default: Date.now},
    endDate: {type: Date, default: Date.now},
    deleted: {type: Boolean, default: false},
    winners: [{
        fullName: {type: String, require: '{PATH} is required'},
        picture: {
            serviceId: String,
            url: String,
            fileName: String
        }
    }]
});

var Contest = mongoose.model('Contest', contestSchema);