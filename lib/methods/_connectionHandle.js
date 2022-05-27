'use strict';

const _queryCallback = require('./_queryCallback'),
      constants      = require('../constants');

const _connectionHandle = ({ resolve, reject }, queryStatement, transaction, singleReturnItem, allowEmptyResponse, attempt = 1) => (err, connection) => {

  const preparedStatement = queryStatement[0],
        valueSwapIns      = queryStatement[1];

  if (!connection) {
    reject(constants.errors.NO_DB_CONNECTION);
    return;
  }

  if (err) {
    if (transaction) {
      connection.rollback();
    }

    connection.release();
    reject(err);
  }

  connection.query(
    preparedStatement,
    valueSwapIns,
    _queryCallback({ resolve, reject }, queryStatement, connection, transaction, singleReturnItem, allowEmptyResponse, attempt, _connectionHandle)
  );
};

module.exports = _connectionHandle;
