'use strict';

const R = require('ramda');

const _maybeRollbackAndRelease = require('./_maybeRollbackAndRelease'),
      constants                = require('../constants');

const RETRY_IN_MILLISECONDS = 40,
      MAX_RETRIES           = 5;

const _maybeRetryQuery = ({ resolve, reject }, queryStatement, connection, transaction, singleReturnItem, allowEmptyResponse, attempt, _connectionHandle, err) => {
  if (attempt >= MAX_RETRIES){
    _maybeRollbackAndRelease(connection, transaction);
    reject(constants.errors.UNKNOWN(R.prop('message', err)));
  } else {
    setTimeout(() => _connectionHandle({ resolve, reject }, queryStatement, connection, transaction, singleReturnItem, allowEmptyResponse, attempt+1)(null, connection), RETRY_IN_MILLISECONDS);
  }
};

module.exports = _maybeRetryQuery;
