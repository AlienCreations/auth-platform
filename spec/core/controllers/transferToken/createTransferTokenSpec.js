'use strict';

const R = require('ramda');

const createTransferToken = require('../../../../server/core/controllers/api/transferToken/createTransferToken');

const FAKE_PROFILE_DATA = {
  payload : {
    refreshToken : 'foo',
    authToken    : 'bar',
    destination  : 'https://foo.com',
    cookies      : { foo : 'bar' }
  }
};

const FAKE_PROFILE_DATA_INCOMPLETE_PAYLOAD = R.over(
  R.lensProp('payload'),
  R.omit(['destination'])
)(FAKE_PROFILE_DATA);

const FAKE_PROFILE_DATA_BLOATED_PAYLOAD = R.over(
  R.lensProp('payload'),
  R.assoc('foo', 'bar')
)(FAKE_PROFILE_DATA);

const FAKE_PROFILE_DATA_MALFORMED = {
  payload : 'foo'
};

const FAKE_PROFILE_DATA_MISSING_PAYLOAD = {};

const KNOWN_TEST_CACHE_EXPIRE_IN_SECONDS = 10;

const fakeCacheUtils = {
  setItem    : a => Promise.resolve(a),
  deleteItem : () => Promise.resolve('ok')
};

describe('transferTokenCtrl.createTransferToken', () => {
  beforeEach(() => {
    spyOn(fakeCacheUtils, 'setItem').and.callThrough();
  });

  it('creates a transfer token', done =>  {
    createTransferToken({ cache : fakeCacheUtils })(FAKE_PROFILE_DATA)
      .then(res => {
        expect(R.has('transferToken', res)).toBe(true);
        expect(fakeCacheUtils.setItem).toHaveBeenCalledWith(
          `transferToken:${res.transferToken}`,
          KNOWN_TEST_CACHE_EXPIRE_IN_SECONDS,
          FAKE_PROFILE_DATA
        );
        done();
      })
      .catch(done.fail);
  });

  it('fails when profile data is malformed', done =>  {
    createTransferToken({ cache : fakeCacheUtils })(FAKE_PROFILE_DATA_MALFORMED)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual('createTransferToken -> payload -> Illegal value for property');
        done();
      });
  });

  it('fails when payload is missing', done =>  {
    createTransferToken({ cache : fakeCacheUtils })(FAKE_PROFILE_DATA_MISSING_PAYLOAD)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual('createTransferToken -> payload -> Missing required property');
        done();
      });
  });

  it('fails when payload is incomplete', done =>  {
    createTransferToken({ cache : fakeCacheUtils })(FAKE_PROFILE_DATA_INCOMPLETE_PAYLOAD)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual('createTransferToken -> payload -> destination -> Missing required property');
        done();
      });
  });

  it('fails when payload contains unsupported props', done =>  {
    createTransferToken({ cache : fakeCacheUtils })(FAKE_PROFILE_DATA_BLOATED_PAYLOAD)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual('createTransferToken -> payload -> foo -> Unsupported property');
        done();
      });
  });
});
