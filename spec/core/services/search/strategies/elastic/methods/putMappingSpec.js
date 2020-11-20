'use strict';

const putMapping = require('../../../../../../../server/core/services/search/strategies/elastic/methods/putMapping');

const FAKE_MAPPING = {
  index : 'asdf'
};

const FAKE_PUT_MAPPING_RESPONSE = 'foo';

const fakeClientSuccess = {
  indices : {
    create : () => {
    },
    putMapping : () => FAKE_PUT_MAPPING_RESPONSE
  }
};

const fakeClientError = {
  indices : {
    create : () => {
    },
    putMapping : () => {
      throw new Error(FAKE_PUT_MAPPING_RESPONSE);
    }
  }
};

describe('elastic.putMapping', () => {
  it('creates a putMapping without error', done => {
    putMapping(fakeClientSuccess)(FAKE_MAPPING)
      .then(res => {
        expect(res).toBe(FAKE_PUT_MAPPING_RESPONSE);
        done();
      })
      .catch(done.fail);
  });

  it('handles errors', done => {
    putMapping(fakeClientError)(FAKE_MAPPING)
      .then((err = {}) => {
        expect(err.message).toBe(FAKE_PUT_MAPPING_RESPONSE);
        done();
      })
      .catch(done.fail);
  });
});
