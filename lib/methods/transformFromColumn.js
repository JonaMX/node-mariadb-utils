'use strict';

var R = require('ramda');

/**
 * Properties in JS use camelCaseNames
 * @param {String} str
 * @returns {String}
 */
var delimiterAndNextLetter = /_(.)/g;
var alphaNumeric           = /[a-z0-9]/gi;
var uppercaseAlphaNumeric  = R.compose(R.toUpper, R.head, R.match(alphaNumeric));
var transformFromColumn    = R.replace(delimiterAndNextLetter, uppercaseAlphaNumeric);

module.exports = transformFromColumn;
