'use strict';

const prepareProvidedFieldsForSetOrJsonMerge = require('../lib/methods/prepareProvidedFieldsForSetOrJsonMerge');

const data = {
  foo : 'bar',
  baz : 'bat',
  buz : {
    biz : 'baz'
  },
  luz : ['lut', 'liz']
}
describe('prepareProvidedFieldsForSet', () => {
  it('makes a prepared statement for each field', () => {
    expect(prepareProvidedFieldsForSetOrJsonMerge(data)).toBe('`baz` = ?,`buz` = JSON_MERGE_PATCH(`buz`, ?),`foo` = ?,`luz` = JSON_MERGE_PATCH(`luz`, ?)');
  });
});
