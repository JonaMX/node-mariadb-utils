'use strict';

var R = require('ramda');

var transformQueryResponse   = require('./transformQueryResponse'),
    ensureNotSingleItemArray = require('./ensureNotSingleItemArray'),
    constants                = require('../constants');

var isNilOrEmpty = R.anyPass([R.isNil, R.isEmpty]);

var _queryCallback = R.curry(function(deferred, connection, singleReturnItem, err, data) {

  if (err) {
    deferred.reject(err);
  }

  if (isNilOrEmpty(data)) {
    deferred.reject(constants.errors.NO_QUERY_RESULTS);
  }

  if (singleReturnItem === true) {
    data = ensureNotSingleItemArray(data);
  }

  connection.release();

  data = transformQueryResponse(data);

  deferred.resolve(data);
});

module.exports = _queryCallback;
