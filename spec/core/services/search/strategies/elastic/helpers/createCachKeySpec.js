'use strict';

const createCacheKey = require('../../../../../../../server/core/services/search/strategies/elastic/helpers/createCacheKey');

describe('createCacheKey', () => {
  it('creates a unique cache key', () => {
    expect(typeof createCacheKey()).toBe('string');
  });
});
