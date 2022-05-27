'use strict';

const _connectionHandle = require('../lib/methods/_connectionHandle');

const FAKE_DEFERRED             = jasmine.createSpyObj('deferred', ['reject']),
      FAKE_CONNECTION           = jasmine.createSpyObj('connection', ['release', 'rollback', 'query']),
      FAKE_QUERY_STATEMENT      = '',
      FAKE_TRANSACTION          = {},
      FAKE_TRANSACTION_MISSING  = undefined,
      FAKE_SINGLE_RETURN_ITEM   = false,
      FAKE_ALLOW_EMPTY_RESPONSE = false,
      FAKE_ERROR                = {},
      FAKE_ACCESS_DENIED_ERROR  = { code : 'ER_ACCESS_DENIED_ERROR' };

describe('connectionHandle', () => {
  it('invokes the query when there are no errors', done => {
    _connectionHandle(
      FAKE_DEFERRED,
      FAKE_QUERY_STATEMENT,
      FAKE_TRANSACTION,
      FAKE_SINGLE_RETURN_ITEM,
      FAKE_ALLOW_EMPTY_RESPONSE
    )(null, FAKE_CONNECTION);
    setTimeout(() => {
      expect(FAKE_CONNECTION.query).toHaveBeenCalled();
      done();
    }, 1);
  });

  it('rejects when connection is missing', done => {
    _connectionHandle(
      FAKE_DEFERRED,
      FAKE_QUERY_STATEMENT,
      FAKE_TRANSACTION,
      FAKE_SINGLE_RETURN_ITEM,
      FAKE_ALLOW_EMPTY_RESPONSE
    )(FAKE_ERROR);
    setTimeout(() => {
      expect(FAKE_DEFERRED.reject).toHaveBeenCalled();
      done();
    }, 1);
  });

  it('rolls back transaction when there is an error AND a connection, which should never happen', done => {
    _connectionHandle(
      FAKE_DEFERRED,
      FAKE_QUERY_STATEMENT,
      FAKE_TRANSACTION,
      FAKE_SINGLE_RETURN_ITEM,
      FAKE_ALLOW_EMPTY_RESPONSE
    )(FAKE_ERROR, FAKE_CONNECTION);
    setTimeout(() => {
      expect(FAKE_CONNECTION.rollback).toHaveBeenCalled();
      done();
    }, 1);
  });

  it('rolls back transaction when credentials are bad', done => {
    _connectionHandle(
      FAKE_DEFERRED,
      FAKE_QUERY_STATEMENT,
      FAKE_TRANSACTION,
      FAKE_SINGLE_RETURN_ITEM,
      FAKE_ALLOW_EMPTY_RESPONSE
    )(FAKE_ACCESS_DENIED_ERROR, FAKE_CONNECTION);
    setTimeout(() => {
      expect(FAKE_CONNECTION.rollback).toHaveBeenCalled();
      done();
    }, 1);
  });

  it('releases the connection when there is an error with no transaction', done => {
    _connectionHandle(
      FAKE_DEFERRED,
      FAKE_QUERY_STATEMENT,
      FAKE_TRANSACTION_MISSING,
      FAKE_SINGLE_RETURN_ITEM,
      FAKE_ALLOW_EMPTY_RESPONSE
    )(FAKE_ERROR, FAKE_CONNECTION);
    setTimeout(() => {
      expect(FAKE_CONNECTION.release).toHaveBeenCalled();
      done();
    }, 1);
  });
});
