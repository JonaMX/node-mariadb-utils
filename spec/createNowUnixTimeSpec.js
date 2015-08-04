'use strict';

var createNowUnixTime = require('../lib/methods/createNowUnixTime');

describe('createNowUnixTime', function() {
  it('should create a Unix time stamp', function() {
    expect(createNowUnixTime()).toBe(Math.floor(new Date().getTime() / 1000));
  });
});
