'use strict';

var prepareProvidedFieldsForSet = require('../lib/methods/prepareProvidedFieldsForSet');

describe('prepareProvidedFieldsForSet', function() {
  it('should make a prepared statement for each field', function() {
    expect(prepareProvidedFieldsForSet(['foo', 'bar'])).toBe('bar = ?,foo = ?');
  });
});
