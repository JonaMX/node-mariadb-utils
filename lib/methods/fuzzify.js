'use strict';

var R = require('ramda');

/**
 * Return fuzzy search wrapper around provided search term.
 * @param {String} searchTerm
 * @returns {String}
 */
var fuzzify = R.replace(/q/, R.__, '%q%');

module.exports = fuzzify;
