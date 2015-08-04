'use strict';

var R = require('ramda');

var transformToColumn = require('./transformToColumn'),
    commaSeparate     = R.join(',');

/**
 * Converts an array of fields into a prepared statement for SQL
 * @param {Array} fields
 * @returns {String}
 */
var prepareProvidedFieldsForSet = function(fields) {
  var fieldsCopy     = R.clone(fields).sort();
  var prepareField   = R.curry(function(marker, field) {
    return transformToColumn(field) + ' = ' + marker;
  });
  var prepareFields  = R.compose(commaSeparate, R.map(prepareField('?')));

  return prepareFields(fieldsCopy);
};

module.exports = prepareProvidedFieldsForSet;
