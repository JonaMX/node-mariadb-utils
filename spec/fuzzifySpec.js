'use strict';

const fuzzify = require('../lib/methods/fuzzify');

describe('fuzzify', () => {
  it('takes a search string and wrap it in MariaDB fuzzy delimiters `%`', () => {
    expect(fuzzify('foo bar')).toBe('%foo bar%');
  });
});
