'use strict';

const createCacheExpire = require('../../../../../../../server/core/services/search/strategies/elastic/helpers/createCacheExpire');

describe('createCacheExpire', () => {
  it('returns a value for cache expire seconds', () => {
    expect(typeof createCacheExpire()).toBe('number');
  });
});
