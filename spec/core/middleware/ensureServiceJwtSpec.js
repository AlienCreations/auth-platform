'use strict';

const ensureServiceJwt = require('../../../server/core/middleware/ensureServiceJwt');

let FAKE_SERVICE_REQ = { user : { strategy : 'service' } },
    FAKE_INVALID_REQ = { user : { strategy : 'invalid' } };

const FAKE_RES  = {},
      FAKE_NEXT = (resolve, reject) => err => {
        if (err) {
          reject(err);
        }

        resolve();
      };

describe('ensureServiceJwt', () => {
  it('allows req when given request is from a service', done => {
    new Promise((resolve, reject) => {
      ensureServiceJwt(FAKE_SERVICE_REQ, FAKE_RES, FAKE_NEXT(resolve, reject));
    })
      .then(done)
      .catch(done.fail);
  });

  it('throws an error when given request is not from a service', done => {
    new Promise((resolve, reject) => {
      ensureServiceJwt(FAKE_INVALID_REQ, FAKE_RES, FAKE_NEXT(resolve, reject));
    })
      .then(done.fail)
      .catch(err => {
        expect(err.message).toBe('Permission denied');
        done();
      });
  });
});
