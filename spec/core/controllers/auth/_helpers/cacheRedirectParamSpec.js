'use strict';

const {
  setCacheRedirectParam,
  getCachedRedirectParam
} = require('../../../../../server/core/controllers/auth/_helpers/cacheRedirectParam');

const FAKE_USERNAME                 = 'john@doe.com',
      FAKE_REDIRECT_URL             = 'https://foo.mx',
      FAKE_EXPIRES_SECONDS          = 30,
      KNOWN_DEFAULT_EXPIRES_SECONDS = 300;

let fakeCacheUtils;

describe('cacheRedirectParam', () => {
  beforeEach(() => {
    fakeCacheUtils = jasmine.createSpyObj('cacheUtils', ['setItem', 'deleteItem']);
  });

  describe('setCacheRedirectParam', () => {
    it('caches a redirect url for given username', () => {
      setCacheRedirectParam(fakeCacheUtils)({
        username    : FAKE_USERNAME,
        redirectUrl : FAKE_REDIRECT_URL,
        expires     : FAKE_EXPIRES_SECONDS
      });

      expect(fakeCacheUtils.setItem).toHaveBeenCalledWith(
        `redirectParam:${FAKE_USERNAME}`,
        FAKE_EXPIRES_SECONDS,
        { redirectUrl : FAKE_REDIRECT_URL }
      );
    });

    it('caches a redirect url for given username defaulting to a preset expires value', () => {
      setCacheRedirectParam(fakeCacheUtils)({
        username    : FAKE_USERNAME,
        redirectUrl : FAKE_REDIRECT_URL
      });

      expect(fakeCacheUtils.setItem).toHaveBeenCalledWith(
        `redirectParam:${FAKE_USERNAME}`,
        KNOWN_DEFAULT_EXPIRES_SECONDS,
        { redirectUrl : FAKE_REDIRECT_URL }
      );
    });
  });

  describe('getCachedRedirectParam', () => {
    it('retrieves a cached redirect url for given username and deletes cached value', done => {
      fakeCacheUtils.getItem = jasmine.createSpy('getItem').and.returnValue(Promise.resolve(JSON.stringify({
        redirectUrl : FAKE_REDIRECT_URL
      })));

      getCachedRedirectParam(fakeCacheUtils)(FAKE_USERNAME)
        .then(redirectUrl => {
          expect(redirectUrl).toBe(FAKE_REDIRECT_URL);
          expect(fakeCacheUtils.getItem).toHaveBeenCalledWith(`redirectParam:${FAKE_USERNAME}`);
          expect(fakeCacheUtils.deleteItem).toHaveBeenCalledWith(`redirectParam:${FAKE_USERNAME}`);
          done();
        });
    });

    it('returns undefined for given username not found in cache', done => {
      fakeCacheUtils.getItem = jasmine.createSpy('getItem').and.returnValue(Promise.resolve('not a JSON'));

      getCachedRedirectParam(fakeCacheUtils)(FAKE_USERNAME)
        .then(redirectUrl => {
          expect(redirectUrl).toBe(undefined);
          expect(fakeCacheUtils.getItem).toHaveBeenCalledWith(`redirectParam:${FAKE_USERNAME}`);
          done();
        });
    });
  });
});
