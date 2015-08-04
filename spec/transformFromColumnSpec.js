'use strict';

var transformFromColumn = require('../lib/methods/transformFromColumn');

describe('transformFromColumn', function() {
  it('should transform a string from the case used ' +
    'for MySQL fields to the case used for JS variables', function() {
    expect(transformFromColumn('some_db_field')).toBe('someDbField');
  });
});
