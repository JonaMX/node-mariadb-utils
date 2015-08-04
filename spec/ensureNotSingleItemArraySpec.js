'use strict';

var ensureNotSingleItemArray = require('../lib/methods/ensureNotSingleItemArray');

var FAKE_MULTI_ITEM_ARRAY  = ['foo', 'bar'],
    FAKE_SINGLE_ITEM_ARRAY = ['foo'];

describe('ensureNotSingleItemArray', function() {

  it('should return the given array if it contains two or more items', function() {
    expect(ensureNotSingleItemArray(FAKE_MULTI_ITEM_ARRAY)).toBe(FAKE_MULTI_ITEM_ARRAY);
  });

  it('should return the first item in a given array if the array contains only one item', function() {
    expect(ensureNotSingleItemArray(FAKE_SINGLE_ITEM_ARRAY)).toBe('foo');
  });

});
