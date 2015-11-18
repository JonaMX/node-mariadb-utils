'use strict';

var R = require('ramda');

/**
 * Fields in the DB use underscored_names
 * @param {String} str
 * @returns {String}
 */
var preHumpCharacters = /([a-z\d])([A-Z0-9])/g;
var underscoreDelimit = R.replace(preHumpCharacters, '$1_$2');
var wrapWithTicks     = function(str) {
  return '`' + str + '`';
};
var transformToColumn = R.compose(wrapWithTicks, R.toLower, underscoreDelimit);

module.exports = transformToColumn;
