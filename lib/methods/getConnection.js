'use strict';

const constants = require('../constants');

const getConnection = dbPool => () => new Promise((resolve, reject) => {
  try {
    dbPool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        if (connection) {
          resolve(connection);
        } else {
          reject(constants.errors.MISSING_CONNECTION);
        }
      }
    });

  } catch(err) {
    reject(err);
  }
});

module.exports = getConnection;
