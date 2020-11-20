'use strict';

const R = require('ramda');

const batchProcess = require('../../../../../../../server/core/services/search/strategies/elastic/methods/batchProcess');


const FAKE_KEYS    = ['foo'];
const FAKE_ITEM    = '{"baz":"bat"}';
const FAKE_PAYLOAD = { body : [JSON.parse(FAKE_ITEM)] };
const FAKE_ERROR   = new Error('some error');

const mockSearchClient = {
  bulk : R.T
};

const mockSearchClientError = {
  bulk : () => { throw FAKE_ERROR; }
};

const mockCacheUtilsSuccess = {
  keys       : () => Promise.resolve(FAKE_KEYS),
  getItem    : () => Promise.resolve(FAKE_ITEM),
  deleteItem : R.T
};

const mockCacheUtilsNoKeys = {
  keys       : () => Promise.resolve([]),
  deleteItem : R.T
};

const FAKE_NUM_ITEMS_TO_PROCESS = 5;

describe('elastic.batchProcess', () => {
  beforeEach(() => {
    spyOn(mockSearchClient, 'bulk');
  });

  it('fetches the queue from redis, does some processing, and eventually passes the payload to the elastic bulk api', done => {
    batchProcess(mockCacheUtilsSuccess)(mockSearchClient)(FAKE_NUM_ITEMS_TO_PROCESS)
      .then(() => {
        expect(mockSearchClient.bulk).toHaveBeenCalledWith(FAKE_PAYLOAD);
        done();
      });
  });

  it('gracefully handles an empty payload', done => {
    batchProcess(mockCacheUtilsNoKeys)(mockSearchClient)(FAKE_NUM_ITEMS_TO_PROCESS)
      .then(() => {
        expect(mockSearchClient.bulk).not.toHaveBeenCalled();
        done();
      });
  });

  it('gracefully handles an error', done => {
    batchProcess(mockCacheUtilsSuccess)(mockSearchClientError)(FAKE_NUM_ITEMS_TO_PROCESS)
      .catch(err => {
        expect(err).toBe(FAKE_ERROR);
        done();
      });
  });
});
