'use strict';

module.exports = connection => new Promise((resolve, reject) => {
  connection.commit(err => {
    if (err) {
      connection.rollback();
      connection.release();
      reject(err);
    } else {
      connection.release();
      resolve(true);
    }
  });
});
