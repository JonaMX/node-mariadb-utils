'use strict';

const R = require('ramda');

const transformQueryResponse   = require('./transformQueryResponse'),
      ensureNotSingleItemArray = require('./ensureNotSingleItemArray'),
      _maybeRetryQuery         = require('./_maybeRetryQuery'),
      _maybeRollbackAndRelease = require('./_maybeRollbackAndRelease'),
      constants                = require('../constants');

const isNilOrEmpty = R.anyPass([R.isNil, R.isEmpty]);

const maybeEnsureSingleItemArray = singleReturnItem => data => singleReturnItem ? ensureNotSingleItemArray(data) : data;

const _queryCallback = ({ resolve, reject }, queryStatement, connection, transaction, singleReturnItem, allowEmptyResponse, attempt, _connectionHandle) => (err, data) => {

  if (err) {
    switch (R.prop('code', err)) {
      case 'ER_DUP_ENTRY' :
        _maybeRollbackAndRelease(connection, transaction);
        reject(constants.errors.DUPLICATE(R.prop('message', err)));
        break;
      case 'ER_LOCK_DEADLOCK' :
        _maybeRetryQuery({ resolve, reject }, queryStatement, connection, transaction, singleReturnItem, allowEmptyResponse, attempt, _connectionHandle, err);
        break;
      default :
        _maybeRollbackAndRelease(connection, transaction);
        reject(constants.errors.UNKNOWN(R.prop('message', err)));
        break;
    }
  } else {
    if (isNilOrEmpty(data)) {
      if (allowEmptyResponse) {
        if (!transaction) {
          connection.release();
        }

        resolve(singleReturnItem ? undefined : [])
      } else {
        connection.release();
        reject(constants.errors.NO_QUERY_RESULTS);
      }
    } else {
      const transformedData = R.compose(transformQueryResponse, maybeEnsureSingleItemArray(singleReturnItem))(data);

      if (!transaction) {
        connection.release();
      }
      resolve(transaction ? { data : transformedData, connection } : transformedData);
    }
  }
};

module.exports = _queryCallback;
