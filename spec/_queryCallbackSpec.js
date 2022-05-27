'use strict';

const constants      = require('../lib/constants'),
      _queryCallback = require('../lib/methods/_queryCallback');

const MARIADB_DUPLICATE_ENTRY_ERROR_CODE = 'ER_DUP_ENTRY',
      MARIADB_DEADLOCK_ERROR_CODE        = 'ER_LOCK_DEADLOCK';

const FAKE_CONNECTION = {
  rollback : () => {},
  release  : () => {}
};

const FAKE_CONNECTION_HANDLE = {
  _connectionHandle : ({ resolve }) => () => resolve()
};

const FAKE_ERROR                  = new Error('foobar'),
      FAKE_DUPLICATE_RECORD_ERROR = {code : MARIADB_DUPLICATE_ENTRY_ERROR_CODE, message : 'foo duplicate'},
      FAKE_DEADLOCK_ERROR         = {code : MARIADB_DEADLOCK_ERROR_CODE, message : 'foo deadlock' },
      FAKE_RESPONSE_SINGLE        = {foo : 'bar'},
      FAKE_RESPONSE_SINGLE_ARRAY  = [FAKE_RESPONSE_SINGLE],
      FAKE_RESPONSE_ARRAY         = [{foo : 'bar'}, {baz : 'bat'}, {biz : 'buz'}],
      FAKE_QUERY_STATEMENT        = ['SELECT * FROM foo'];

const IS_TRANSACTION_FALSE       = false,
      IS_TRANSACTION_TRUE        = true,
      SINGLE_RETURN_ITEM_FALSE   = false,
      SINGLE_RETURN_ITEM_TRUE    = true,
      ALLOW_EMPTY_RESPONSE_FALSE = false,
      ALLOW_EMPTY_RESPONSE_TRUE  = true,
      FAKE_ATTEMPT               = 1;

describe('_queryCallback', () => {
  beforeEach(() => {
    spyOn(FAKE_CONNECTION, 'rollback');
    spyOn(FAKE_CONNECTION, 'release');
    spyOn(FAKE_CONNECTION_HANDLE, '_connectionHandle').and.callThrough();
  });

  it('invokes a transactional queryOnTransaction() callback with no errors on a multi-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_TRUE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_ARRAY);
    })
      .then(res => {
        expect(res.connection).toEqual(FAKE_CONNECTION);
        expect(res.data).toEqual(FAKE_RESPONSE_ARRAY);
        done();
      })
      .catch(done.fail);
  });

  it('invokes a transactional, queryOnTransaction() callback with errors on a multi-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_TRUE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(FAKE_ERROR);
    })
      .then(done.fail)
      .catch(err => {
        expect(err).toEqual(constants.errors.UNKNOWN(FAKE_ERROR.message));
        expect(FAKE_CONNECTION.rollback).toHaveBeenCalled();
        done();
      });
  });

  it('invokes a non-transaction, query() callback with no errors on a multi-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_ARRAY);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_ARRAY);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, query() callback with no errors on an empty result', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, []);
    })
      .then(done.fail)
      .catch(err => {
        expect(err).toEqual(constants.errors.NO_QUERY_RESULTS);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      });
  });

  it('invokes a non-transaction, query() callback with no errors on a single-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_SINGLE_ARRAY);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_SINGLE_ARRAY);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, query() callback with no errors on a response object', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_SINGLE);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_SINGLE);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, querySafe() callback with no errors on a multi-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_ARRAY);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_ARRAY);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, querySafe() callback with no errors on an empty response', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, []);
    })
      .then(res => {
        expect(res).toEqual([]);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a transaction, querySafe() callback with no errors on an empty response', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_TRUE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, []);
    })
      .then(res => {
        expect(res).toEqual([]);
        expect(FAKE_CONNECTION.release).not.toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });


  it('invokes a non-transaction, querySafe() callback with no errors on a single-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_SINGLE_ARRAY);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_SINGLE_ARRAY);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, querySafe() callback with no errors on a response object', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_SINGLE);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_SINGLE);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });


  it('invokes a non-transaction, lookup() callback with no errors on a multi-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_TRUE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_ARRAY);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_ARRAY);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, lookup() callback with no errors on an empty response', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_TRUE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, []);
    })
      .then(done.fail)
      .catch(err => {
        expect(err).toEqual(constants.errors.NO_QUERY_RESULTS);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      });
  });

  it('invokes a non-transaction, lookup() callback with no errors on a single-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_TRUE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_SINGLE_ARRAY);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_SINGLE);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, lookup() callback with no errors on a response object', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_TRUE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_SINGLE);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_SINGLE);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, lookupSafe() callback with no errors on a multi-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_TRUE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_ARRAY);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_ARRAY);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, lookupSafe() callback with no errors on an empty response', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_TRUE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, []);
    })
      .then(res => {
        expect(res).toEqual(undefined);
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, lookupSafe() callback with no errors on a single-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_TRUE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_SINGLE_ARRAY);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_SINGLE);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('invokes a non-transaction, lookupSafe() callback with no errors on a response object', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_TRUE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(null, FAKE_RESPONSE_SINGLE);
    })
      .then(res => {
        expect(res).toEqual(FAKE_RESPONSE_SINGLE);
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });

  it('handles a duplicate-record error no differently than other errors', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(FAKE_DUPLICATE_RECORD_ERROR);
    })
      .then(done.fail)
      .catch(err => {
        expect(err).toEqual(constants.errors.DUPLICATE(FAKE_DUPLICATE_RECORD_ERROR.message));
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      });
  });

  it('invokes a non-transaction, query() callback with errors', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(FAKE_ERROR);
    })
      .then(done.fail)
      .catch(err => {
        expect(err).toEqual(constants.errors.UNKNOWN(FAKE_ERROR.message));
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      });
  });

  it('invokes a non-transaction, querySafe() callback with errors on a multi-item array', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(FAKE_ERROR);
    })
      .then(done.fail)
      .catch(err => {
        expect(err).toEqual(constants.errors.UNKNOWN(FAKE_ERROR.message));
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      });
  });

  it('invokes a non-transaction, lookup() callback with errors', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_TRUE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(FAKE_ERROR);
    })
      .then(done.fail)
      .catch(err => {
        expect(err).toEqual(constants.errors.UNKNOWN(FAKE_ERROR.message));
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      });
  });

  it('invokes a non-transaction, lookupSafe() callback with errors', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_TRUE,
        ALLOW_EMPTY_RESPONSE_TRUE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(FAKE_ERROR);
    })
      .then(done.fail)
      .catch(err => {
        expect(err).toEqual(constants.errors.UNKNOWN(FAKE_ERROR.message));
        expect(FAKE_CONNECTION.release).toHaveBeenCalled();
        done();
      });
  });

  it('handles a deadlock error retrying query', done => {
    new Promise((resolve, reject) => {
      _queryCallback(
        { resolve, reject },
        FAKE_QUERY_STATEMENT,
        FAKE_CONNECTION,
        IS_TRANSACTION_FALSE,
        SINGLE_RETURN_ITEM_FALSE,
        ALLOW_EMPTY_RESPONSE_FALSE,
        FAKE_ATTEMPT,
        FAKE_CONNECTION_HANDLE._connectionHandle
      )(FAKE_DEADLOCK_ERROR);
    })
      .then(() => {
        expect(FAKE_CONNECTION_HANDLE._connectionHandle).toHaveBeenCalled();
        done();
      })
      .catch(done.fail);
  });
});
