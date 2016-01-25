'use strict';

var R = require('ramda');

var transformQueryResponse   = require('./transformQueryResponse'),
    ensureNotSingleItemArray = require('./ensureNotSingleItemArray'),
    constants                = require('../constants');

var isNilOrEmpty = R.anyPass([R.isNil, R.isEmpty]);

var _queryCallback = R.curry(function(deferred, connection, singleReturnItem, err, data) {

  if (err) {
    switch (R.prop('code', err)) {
      case 'ER_DUP_ENTRY' :
        connection.release();
        return deferred.reject(constants.errors.DUPLICATE(R.prop('message', err)));
      default :
        connection.release();
        return deferred.reject(constants.errors.UNKNOWN(R.prop('message', err)));
    }
  }

  if (isNilOrEmpty(data)) {
    connection.release();
    return deferred.reject(constants.errors.NO_QUERY_RESULTS);
  }

  if (singleReturnItem === true) {
    data = ensureNotSingleItemArray(data);
  }

  data = transformQueryResponse(data);

  connection.release();
  return deferred.resolve(data);
});

module.exports = _queryCallback;
