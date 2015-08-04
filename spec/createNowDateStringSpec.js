'use strict';

var R = require('ramda');

var createNowDateString = require('../lib/methods/createNowDateString');

var _getPrefixedMonth = function(date) {
  return ('0' + (date.getMonth() + 1)).slice(-2);
};

var _getPrefixedDay = function(date) {
  return ('0' + date.getDate()).slice(-2);
};

var ymdFormatted = function() {
  var date = new Date();

  return R.join('-', [
    date.getFullYear(),
    _getPrefixedMonth(date),
    _getPrefixedDay(date)
  ]);
};

describe('createNowDateString', function() {
  it('should create a YYYY-MM-DD date string', function() {
    expect(createNowDateString()).toBe(ymdFormatted())
  });
});
