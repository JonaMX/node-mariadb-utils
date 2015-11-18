'use strict';

var transformToColumn = require('../lib/methods/transformToColumn');

describe('transformToColumn', function() {
  it('should transform a string from the case used ' +
    'for MySQL fields to the case used for JS variables', function() {
    expect(transformToColumn('someDbField')).toBe('`some_db_field`');
  });
});
