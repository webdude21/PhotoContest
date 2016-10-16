/*eslint-disable */
var mongoose = require('mongoose'),
  pageSchema = mongoose.Schema({
    title: { type: String, require: '{PATH} is required' },
    content: { type: String, require: '{PATH} is required' },
    publishedDate: { type: Date, default: Date.now }
  });
var Page = mongoose.model('Page', pageSchema);

module.exports.seedInitialPages = function () {
  Page.find({}).exec(function (err, collection) {
    if (err) {
      console.log('Cannot find pages: ' + err);
      return;
    }

    if (collection.length === 0) {
      Page.create({
        title: 'Проба',
        content: 'Проба'
      });
    }
  });
};
