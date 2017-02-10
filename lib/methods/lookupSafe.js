'use strict';

var EXPECT_SINGLE_RETURN_ITEM = true,
    ALLOW_EMPTY_RESPONSE      = true;

/**
 * Execute a query, expecting a single item returned.
 */
module.exports = require('./_transaction')(EXPECT_SINGLE_RETURN_ITEM, ALLOW_EMPTY_RESPONSE);
