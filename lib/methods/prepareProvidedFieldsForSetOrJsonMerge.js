'use strict';

const R = require('ramda');

const transformToColumn = require('./transformToColumn'),
      commaSeparate     = R.join(',');

/**
 * Converts an array of fields into a prepared statement for SQL.
 * If the field value is an object, it uses JSON_MERGE_PATCH syntax.
 * @param {Object} data
 * @returns {String}
 */
const prepareProvidedFieldsForSet = data => {
  const fields        = R.keys(data).sort();
  const prepareField  = R.curry((marker, field) => {
    const _field = transformToColumn(field);
    if (R.is(Object)(data[field])) {
      return `${_field} = JSON_MERGE_PATCH(${_field}, ${marker})`;
    }
    return `${_field} = ${marker}`;
  });
  const prepareFields = R.compose(commaSeparate, R.map(prepareField('?')));

  return prepareFields(fields);
};

module.exports = prepareProvidedFieldsForSet;
