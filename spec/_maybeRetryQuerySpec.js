'use strict';

const _maybeRetryQuery = require('../lib/methods/_maybeRetryQuery');

const FAKE_CONNECTION = {
  release : () => {}
};

const FAKE_CONNECTION_HANDLE = {
  _connectionHandle : ({ resolve }) => () => resolve()
};

const FAKE_TRANSACTION          = undefined,
      FAKE_QUERY_STATEMENT      = ['SELECT * FROM foo'],
      FAKE_SINGLE_RETURN_ITEM   = false,
      FAKE_ALLOW_EMPTY_RESPONSE = false,
      FAKE_ATTEMPT              = 1,
      FAKE_ERROR                = { code : 'ER_LOCK_DEADLOCK', message : 'ER_LOCK_DEADLOCK' },
      MAX_RETRIES               = 5;

describe('maybeRetryQuery', () => {
  beforeEach(done => {
    spyOn(FAKE_CONNECTION, 'release');
    spyOn(FAKE_CONNECTION_HANDLE, '_connectionHandle').and.callThrough();
    done();
  });

  it('retries the query if the attempt number is less than MAX_RETRIES', done => {
    new Promise((resolve, reject) => {
      _maybeRetryQuery(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        FAKE_TRANSACTION,
        FAKE_SINGLE_RETURN_ITEM,
        FAKE_ALLOW_EMPTY_RESPONSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle,
        FAKE_ERROR
      );
    })
      .then(() => {
        expect(FAKE_CONNECTION_HANDLE._connectionHandle).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('throws an error if the attempt number is greater than MAX_RETRIES', done => {
    new Promise((resolve, reject) => {
      _maybeRetryQuery(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        FAKE_TRANSACTION,
        FAKE_SINGLE_RETURN_ITEM,
        FAKE_ALLOW_EMPTY_RESPONSE,
        MAX_RETRIES + 1,
        FAKE_CONNECTION_HANDLE._connectionHandle,
        FAKE_ERROR
      );
    })
      .then(done.fail)
      .catch(err => {
        expect(FAKE_CONNECTION_HANDLE._connectionHandle).not.toHaveBeenCalled();
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        expect(err.message).toEqual(FAKE_ERROR.message);
        done();
      });
  });
});
