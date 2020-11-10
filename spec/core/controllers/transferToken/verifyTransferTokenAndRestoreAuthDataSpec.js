'use strict';

const R    = require('ramda'),
      cuid = require('cuid');

const { errors } = require('@aliencreations/node-error');

const verifyTransferTokenAndRestoreAuthData = require('../../../../server/core/controllers/api/transferToken/verifyTransferTokenAndRestoreAuthData');

const FAKE_TRANSFER_TOKEN = cuid();

const FAKE_PROFILE_DATA = {
  payload : {
    refreshToken : 'foo',
    authToken    : 'bar',
    destination  : 'https://foo.com',
    cookies      : { foo : 'bar' }
  }
};

const FAKE_DATA = {
  transferToken : FAKE_TRANSFER_TOKEN,
  origin        : 'https://foo.com'
};

const FAKE_DATA_INCOMPLETE = R.omit(['transferToken'])(FAKE_DATA);

const FAKE_DATA_BLOATED = R.assoc('foo', 'bar')(FAKE_DATA);

const FAKE_DATA_WRONG_ORIGIN = R.assoc('origin', 'https://bar.com')(FAKE_DATA);

const FAKE_DATA_MALFORMED = 'asdf';

const fakeCacheUtils = {
  getItem    : () => Promise.resolve(JSON.stringify(FAKE_PROFILE_DATA)),
  deleteItem : () => {}
};

const fakeCacheUtilsExpiredKey = {
  getItem : () => Promise.reject()
};

const fakeLogger = {
  warn : () => {}
};

describe('transferTokenCtrl.verifyTransferTokenAndRestoreAuthData', () => {
  beforeEach(() => {
    spyOn(fakeCacheUtils, 'getItem').and.callThrough();
    spyOn(fakeLogger, 'warn').and.callThrough();
  });

  it('verifies a transfer token and returns the stored profile', done =>  {
    verifyTransferTokenAndRestoreAuthData({ cache : fakeCacheUtils, logger : fakeLogger })(FAKE_DATA)
      .then(res => {
        expect(res).toEqual(FAKE_PROFILE_DATA);
        expect(fakeCacheUtils.getItem).toHaveBeenCalledWith(`transferToken:${FAKE_TRANSFER_TOKEN}`);
        done();
      })
      .catch(done.fail);
  });

  it('fails when data is malformed', done =>  {
    verifyTransferTokenAndRestoreAuthData({ cache : fakeCacheUtils, logger : fakeLogger })(FAKE_DATA_MALFORMED)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual('verifyTransferToken -> Illegal value for property');
        done();
      });
  });

  it('fails when data is incomplete', done =>  {
    verifyTransferTokenAndRestoreAuthData({ cache : fakeCacheUtils, logger : fakeLogger })(FAKE_DATA_INCOMPLETE)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual('verifyTransferToken -> transferToken -> Missing required property');
        done();
      });
  });

  it('fails when data contains unsupported props', done =>  {
    verifyTransferTokenAndRestoreAuthData({ cache : fakeCacheUtils, logger : fakeLogger })(FAKE_DATA_BLOATED)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual('verifyTransferToken -> foo -> Unsupported property');
        done();
      });
  });

  it('fails when origin and destination do not match', done =>  {
    verifyTransferTokenAndRestoreAuthData({ cache : fakeCacheUtils, logger : fakeLogger })(FAKE_DATA_WRONG_ORIGIN)
      .then(done.fail)
      .catch(err => {
        expect(err.code).toEqual(errors.auth.TRANSFER_TOKEN_INVALID().code);
        done();
      });
  });

  it('fails when cache key is missing/expired', done =>  {
    verifyTransferTokenAndRestoreAuthData({ cache : fakeCacheUtilsExpiredKey, logger : fakeLogger })(FAKE_DATA)
      .then(done.fail)
      .catch(err => {
        expect(err.code).toEqual(errors.auth.TRANSFER_TOKEN_EXPIRED().code);
        done();
      });
  });
});
