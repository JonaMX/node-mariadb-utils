'use strict';

var moment = require('moment');

/**
 * Create a unix time stamp for "now"
 * @returns {number}
 */
var createNowUnixTime = function() {
  return moment().format('X') * 1
};

module.exports = createNowUnixTime;
