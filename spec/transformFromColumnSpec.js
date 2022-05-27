'use strict';

const transformFromColumn = require('../lib/methods/transformFromColumn');

describe('transformFromColumn', () => {
  it('transforms a string from the case used ' +
    'for MariaDB fields to the case used for JS variables', () => {
    expect(transformFromColumn('some_db_field')).toBe('someDbField');
  });
});
