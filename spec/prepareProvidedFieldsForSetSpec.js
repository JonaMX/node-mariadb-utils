'use strict';

const prepareProvidedFieldsForSet = require('../lib/methods/prepareProvidedFieldsForSet');

describe('prepareProvidedFieldsForSet', () => {
  it('makes a prepared statement for each field', () => {
    expect(prepareProvidedFieldsForSet(['foo', 'bar'])).toBe('`bar` = ?,`foo` = ?');
  });
});
