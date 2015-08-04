'use strict';

var R = require('ramda'),
    Q = require('q');

var _connectionHandle      = require('./_connectionHandle'),
    transformQueryResponse = require('./transformQueryResponse');

var _transaction = R.curry(function(transformQueryResponse, singleReturnItem, dbPool, queryStatement) {
  var deferred = Q.defer();
  dbPool.getConnection(_connectionHandle(deferred, queryStatement, singleReturnItem));
  return deferred.promise;
});

module.exports = _transaction(transformQueryResponse);
