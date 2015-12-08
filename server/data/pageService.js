'use strict';
var MongooseRepository = require("./MongooseRepository");

class PageService extends MongooseRepository {
    constructor() {
        super("Page");
    }

    getFirstPage() {
        return MongooseRepository.wrapQueryInPromise(this.Model.findOne());
    }
}

module.exports = new PageService();