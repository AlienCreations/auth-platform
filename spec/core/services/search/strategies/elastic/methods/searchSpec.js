'use strict';

const search = require('../../../../../../../server/core/services/search/strategies/elastic/methods/search');

const FAKE_ERROR = new Error('some error');

const FAKE_RES_SUCCESS = { hits : [{ foo : 'bar' }] };

const FAKE_REQUEST_SUCCESS = {
  post : (options, cb) => {
    cb(null, 200, FAKE_RES_SUCCESS);
  }
};

const FAKE_REQUEST_ERROR = {
  post : (options, cb) => {
    cb(FAKE_ERROR, 500);
  }
};

const KNOWN_TEST_TYPE  = 'clouduser',
      KNOWN_TEST_FIELD = 'email',
      FAKE_QUERY       = 'foo',
      FAKE_INDEX       = '_all',
      FAKE_SIZE        = 10,
      FAKE_FROM        = 0;

describe('elastic.search', () => {

  it('searches without error', done => {
    search(FAKE_REQUEST_SUCCESS)({
      type  : KNOWN_TEST_TYPE,
      index : FAKE_INDEX,
      field : KNOWN_TEST_FIELD,
      size  : FAKE_SIZE,
      from  : FAKE_FROM,
      query : FAKE_QUERY
    })
      .then(res => {
        expect(res).toBe(FAKE_RES_SUCCESS);
        done();
      });
  });

  it('handles errors', done => {
    search(FAKE_REQUEST_ERROR)({
      type  : KNOWN_TEST_TYPE,
      index : FAKE_INDEX,
      field : KNOWN_TEST_FIELD,
      size  : FAKE_SIZE,
      from  : FAKE_FROM,
      query : FAKE_QUERY
    })
      .catch(res => {
        expect(res).toBe(FAKE_ERROR);
        done();
      });
  });
});
