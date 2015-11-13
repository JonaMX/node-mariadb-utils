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
        deferred.reject(constants.errors.DUPLICATE(R.prop('message', err)));
        break;
      default :
        deferred.reject(constants.errors.UNKNOWN(R.prop('message', err)));
        break;
    }
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
