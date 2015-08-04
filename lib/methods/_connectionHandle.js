'use strict';

var R = require('ramda');

var _queryCallback = require('./_queryCallback'),
    constants      = require('../constants');

var _connectionHandle = R.curry(function(deferred, queryStatement, singleReturnItem, err, connection) {

  var preparedStatement = queryStatement[0],
      valueSwapIns      = queryStatement[1];

  if (!connection) {
    deferred.reject(constants.errors.NO_DB_CONNECTION);
  }

  if (err) {
    deferred.reject(err);
  }

  connection.query(
    preparedStatement,
    valueSwapIns,
    _queryCallback(deferred, connection, singleReturnItem)
  );

});

module.exports = _connectionHandle;
