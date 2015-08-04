'use strict';

var fuzzify = require('../lib/methods/fuzzify');

describe('fuzzify', function() {
  it('should take a search string and wrap it in MySQL fuzzy delimiters `%`', function() {
    expect(fuzzify('foo bar')).toBe('%foo bar%');
  });
});
