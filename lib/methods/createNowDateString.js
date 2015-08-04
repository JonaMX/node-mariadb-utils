'use strict';

var moment = require('moment');

/**
 * Create a date string in the format [YYYY-MM-DD]
 * @returns {String}
 */
var createNowDateString = function() {
  return moment().format('YYYY-MM-DD');
};

module.exports = createNowDateString;
