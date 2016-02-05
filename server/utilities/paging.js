/*eslint-disable */
'use strict';

module.exports = {
  populateResponse: function populateResponse(errorHandler, successHandler, gridRequest, model, populateString, pageSize) {
    var query = model.find({});

    if (populateString) {
      query.populate(populateString);
    }

    var countQuery = model.find({});

    addFilters(gridRequest.columns, query);
    addFilters(gridRequest.columns, countQuery);

    countQuery.count({}, function (err, totalEntryCount) {
      var currentPage;

      if (err) {
        console.log('Database error: ' + err);
      }

      gridRequest.pager.totalPages = calculateTotalPages(totalEntryCount, pageSize);
      gridRequest.pager.currentPage = gridRequest.pager.currentPage > gridRequest.pager.totalPages ? gridRequest.pager.totalPages : gridRequest.pager.currentPage;

      currentPage = gridRequest.pager.currentPage < 1 ? 1 : gridRequest.pager.currentPage;

      var sortObject = {};

      sortObject[gridRequest.sort.columnName] = gridRequest.sort.order;

      query.sort(sortObject)
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize).lean()
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
  buildQueryObject: function buildQueryObject(baseQueryObject) {
    var queryObject = baseQueryObject;

    queryObject.columns = [{
      name: 'approved',
      label: 'Text',
      filter: true,
      filterable: true,
      sortable: true,
      method: 'equals'
    }];

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
  buildAdminQueryObject: function buildAdminQueryObject(baseQueryObject) {
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

function calculateTotalPages(totalCount, pageSize) {
  return Math.floor((totalCount + pageSize - 1) / pageSize);
}

function addFilters(columns, query) {
  var filterObject = {},
    expression;

  if (columns) {
    columns.forEach(function (column) {
      if (column.filter) {

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
