'use strict';

const R = require('ramda');

/**
 * Accepts a promise, and based on the existence of the property value, resolves or
 * rejects said promise respectively.
 * @param {Promise} deferred
 * @param {String} field
 * @param {*} data
 */
const resolveOrRejectOnBooleanField = R.curry(({ resolve, reject }, field, data) => {

  if (R.isNil(data[field])) {
    throw new Error(`No field found matching "${field}"`);
  }

  if (data[field]) {
    resolve(true);
  } else {
    reject(false);
  }
});

module.exports = resolveOrRejectOnBooleanField;
