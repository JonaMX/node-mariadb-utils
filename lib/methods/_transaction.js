'use strict';

const R = require('ramda');

const _connectionHandle = require('./_connectionHandle');

const _transaction = R.curry((connection, singleReturnItem, allowEmptyResponse, dbPool, queryStatement) => {
  return new Promise((resolve, reject) => {
    const transaction = !!connection,
          cb          = _connectionHandle({ resolve, reject }, queryStatement, transaction, singleReturnItem, allowEmptyResponse);

    connection ? cb(null, connection) : dbPool.getConnection(cb);
  });
});

module.exports = _transaction;
