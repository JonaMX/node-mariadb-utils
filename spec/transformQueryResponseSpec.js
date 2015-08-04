'use strict';

var R = require('ramda');

var transformQueryResponse = require('../lib/methods/transformQueryResponse');

var fakeRecordBefore = {
  first_name : 'John',
  last_name  : 'Doe'
};

var fakeRecordAfter = {
  firstName : 'John',
  lastName  : 'Doe'
};

var makeFakeRecord = function() {
  return R.merge(fakeRecordBefore, {});
};

var fakeQueryResponse  = [makeFakeRecord(), makeFakeRecord()],
    fakeLookupResponse = makeFakeRecord();

describe('transformQueryResponse', function() {

  it('should transform all strings from the case used ' +
    'for MySQL fields to the case used for JS variables ' +
    'in a given object', function() {
    expect(transformQueryResponse(fakeLookupResponse))
      .toEqual(fakeRecordAfter);
  });

  it('should transform all strings from the case used ' +
    'for MySQL fields to the case used for JS variables ' +
    'in a given array of objects', function() {
    expect(transformQueryResponse(fakeQueryResponse))
      .toEqual([fakeRecordAfter, fakeRecordAfter]);
  });

});
