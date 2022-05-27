'use strict';

const _maybeRollbackAndRelease = (connection, transaction) => {
  if (transaction) {
    connection.rollback();
  }
  connection.release();
};

module.exports = _maybeRollbackAndRelease;
