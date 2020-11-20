'use strict';

const search = require('../../../../../../../server/core/services/search/strategies/elastic/methods/search');

const FAKE_ERROR = new Error('some error');

const FAKE_RES_SUCCESS = { hits : [{ foo : 'bar' }] };

const mockAxiosSuccess = {
  post : () => Promise.resolve({ data : FAKE_RES_SUCCESS })
};

const mockAxiosError = {
  post : () => Promise.reject(FAKE_ERROR)
};

const KNOWN_TEST_TYPE  = 'clouduser',
      KNOWN_TEST_FIELD = 'email',
      FAKE_QUERY       = 'foo',
      FAKE_INDEX       = '_all',
      FAKE_SIZE        = 10,
      FAKE_FROM        = 0;

describe('elastic.search', () => {
  it('searches without error', done => {
    search(mockAxiosSuccess)({
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
      })
      .catch(done.fail);
  });

  it('handles errors', done => {
    search(mockAxiosError)({
      type  : KNOWN_TEST_TYPE,
      index : FAKE_INDEX,
      field : KNOWN_TEST_FIELD,
      size  : FAKE_SIZE,
      from  : FAKE_FROM,
      query : FAKE_QUERY
    })
      .then(done.fail)
      .catch(res => {
        expect(res).toBe(FAKE_ERROR);
        done();
      });
  });
});
