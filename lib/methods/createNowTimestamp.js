'use strict';

var moment = require('moment');

/**
 * Create a timestamp string in the format [YYYY-MM-DD HH:mm:ss]
 * @returns {String}
 */
var createNowTimestamp = function() {
  return moment().format('YYYY-MM-DD HH:mm:ss');
};

module.exports = createNowTimestamp;
