var mongoose = require('mongoose');

var contestantSchema = mongoose.Schema({
    fullName: {type: String, require: '{PATH} is required'},
    age: {type: Number, require: '{PATH} is required', min: 0},
    registerDate: {type: Date, default: Date.now},
    approved: {type: Boolean, default: false},
    votes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User',
            unique: true
        }
    ],
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

var Contestant = mongoose.model('Contestant', contestantSchema);