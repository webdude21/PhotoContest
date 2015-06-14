module.exports = {
    populateResponse: function (errorHandler, successHandler, gridRequest, model, populateString, pageSize) {
        var query = model.find({});

        if (populateString) {
            query.populate(populateString);
        }

        var countQuery = model.find({});

        addFilters(gridRequest.columns, query);
        addFilters(gridRequest.columns, countQuery);

        countQuery.count({}, function (err, totalEntryCount) {
            if (err) {
                console.log('Database error: ' + err);
            }

            gridRequest.pager.totalPages = calculateTotalPages(totalEntryCount, pageSize);
            gridRequest.pager.currentPage = gridRequest.pager.currentPage > gridRequest.pager.totalPages ?
                gridRequest.pager.totalPages : gridRequest.pager.currentPage;

            var currentPage = gridRequest.pager.currentPage;
            if (currentPage < 1) {
                currentPage = 1;
            }

            var sortObject = {};
            sortObject[gridRequest.sort.columnName] = gridRequest.sort.order;
            query.sort(sortObject)
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize)
                .lean()
                .exec(function (err, entries) {
                    if (err) {
                        console.log('Database error: ' + err);
                        errorHandler();
                    }

                    gridRequest.data = entries;
                    successHandler(gridRequest);
                });
        });
    },
    buildQueryObject: function (baseQueryObject) {
        var queryObject = baseQueryObject;
        queryObject.columns = [
            {name: "approved", label: 'Text', filter: true, filterable: true, sortable: true, method: "equals"}
        ];
        if (!queryObject.pager) {
            queryObject.pager = {
                currentPage: +queryObject.page || 1
            };
        }
        if (!queryObject.sort) {
            queryObject.sort = {
                columnName: "registerDate",
                order: "desc"
            };
        }
        return queryObject;
    },
    buildAdminQueryObject: function (baseQueryObject) {
        var queryObject = baseQueryObject;

        if (!queryObject.pager) {
            queryObject.pager = {
                currentPage: +queryObject.page || 1
            };
        }
        if (!queryObject.sort) {
            queryObject.sort = {
                columnName: "registerDate",
                order: "desc"
            };
        }
        return queryObject;
    }
};

function calculateTotalPages(totalUsersCount, pageSize) {
    var totalPages = (totalUsersCount + pageSize - 1) / pageSize;
    totalPages = Math.floor((totalPages));
    return totalPages;
}

function addFilters(columns, query) {
    if (columns) {
        columns.forEach(function (column) {
            if (column.filter) {
                var filterObject = {};
                var expression;
                switch (column.method) {
                    case 'contains':
                        expression = new RegExp(column.filter, 'i');
                        break;
                    case 'equals':
                        expression = new RegExp('^' + column.filter + '$', 'i');
                        break;
                    default:
                        expression = new RegExp('^' + column.filter, 'i');
                        break;
                }
                filterObject[column.name] = expression;
                query.where(filterObject);
            }
        });
    }
}