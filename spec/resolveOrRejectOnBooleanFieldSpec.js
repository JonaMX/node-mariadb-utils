'use strict';

const resolveOrRejectOnBooleanField = require('../lib/methods/resolveOrRejectOnBooleanField');

describe('resolveOrRejectOnBooleanField', () => {
  it('resolves when given a true field', done => {
    new Promise((resolve, reject) => {
      resolveOrRejectOnBooleanField({ resolve, reject }, 'foo', { foo : true });
    })
      .then(bool => {
        expect(bool).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('rejects when given a false field', done => {
    new Promise((resolve, reject) => {
      resolveOrRejectOnBooleanField({ resolve, reject }, 'foo', { foo : false });
    })
      .then(done.fail)
      .catch(bool => {
        expect(bool).toBe(false);
        done();
      });
  });

  it('rejects when given an unrecognized field', done => {
    new Promise((resolve, reject) => {
      resolveOrRejectOnBooleanField({ resolve, reject }, 'bar', { foo : true });
    })
      .then(done.fail)
      .catch(err => {
        expect(err.message).toBe('No field found matching "bar"')
        done();
      });
  });
});
