'use strict';

var Q = require('q');

var resolveOrRejectOnBooleanField = require('../lib/methods/resolveOrRejectOnBooleanField');

describe('resolveOrRejectOnBooleanField', function() {
  it('should resolve when given a true field', function(done) {
    var deferred = Q.defer();

    resolveOrRejectOnBooleanField(deferred, 'foo', { foo : true }).then(function(bool) {
      expect(bool).toBe(true);
      done();
    });
  });

  it('should reject when given a false field', function(done) {
    var deferred = Q.defer();

    resolveOrRejectOnBooleanField(deferred, 'foo', { foo : false }).catch(function(bool) {
      expect(bool).toBe(false);
      done();
    });
  });

  it('should reject when given an unrecognized field', function() {
    var deferred = Q.defer();

    expect(function() {
      resolveOrRejectOnBooleanField(deferred, 'bar', {foo : true});
    }).toThrow(new Error('No field found matching "bar"'));
  });
});
