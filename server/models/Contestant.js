/*eslint-disable */
var mongoose = require('mongoose'),
  contestantSchema = mongoose.Schema({
    fullName: { type: String, require: '{PATH} is required' },
    age: { type: String, require: '{PATH} is required' },
    registerDate: { type: Date, default: Date.now },
    approved: { type: Boolean, default: true },
    votes: { type: Number, default: 0 },
    registrant: {
      type: mongoose.Schema.ObjectId,
      ref: 'User'
    },
    comment: String,
    pictures: [{
      serviceId: String,
      url: String,
      fileName: String
    }]
  });
var Contestant = mongoose.model('Contestant', contestantSchema);

module.exports.seedInitialContestants = function () {
  Contestant.find({}).exec(function (err, collection) {
    if (err) {
      console.log('Cannot find contestants: ' + err);
      return;
    }

    if (collection.length === 0) {
      for (let i = 0; i < 10; i++) {
        Contestant.create({
          fullName: `Георги Георгиев ${i}`,
          age: `${i}`,
        });
      }

      console.log('Seed contestants...');
    }
  });
};
