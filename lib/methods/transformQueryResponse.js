'use strict';

var R = require('ramda');

var transformFromColumn = require('./transformFromColumn');

var transformPair = function(pair) {
  return [transformFromColumn(pair[0]), pair[1]];
};

var transformDBObject = function(obj) {
  return R.fromPairs(R.map(transformPair, R.toPairs(obj)));
};

/**
 * Transforms a db query response so that the table column names
 * become more JavaScript friendly:
 * @example `date_created` becomes `dateCreated`.
 * @param [Object|Array] data
 * @returns {Object|Array}
 */
function transformQueryResponse(data) {
  return R.is(Array, data) ? R.map(transformDBObject, data) : transformDBObject(data);
}

module.exports = transformQueryResponse;
