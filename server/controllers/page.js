'use strict';

var data = require('../data'),
	errorHandler = require('../utilities/error-handler');

module.exports = {
	getTos: function getTos(req, res) {
		return new Promise(function (resolve, reject) {
			data.pageService
				.getFirstPage()
				.then(page => {
					res.render('tos', page);
					resolve();
				}, () => errorHandler.redirectToNotFound(req, reject));
		});
	}
};
