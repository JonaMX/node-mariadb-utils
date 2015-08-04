'use strict';

var EXPECT_SINGLE_RETURN_ITEM = false;

/**
 * Execute a query, expecting an array returned.
 */
module.exports = require('./_transaction')(EXPECT_SINGLE_RETURN_ITEM);
