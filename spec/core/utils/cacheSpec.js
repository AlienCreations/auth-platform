'use strict';

const cacheUtils = require('../../../server/core/utils/cache');

describe('cacheUtils', () => {
  beforeEach(() => {
    spyOn(cacheUtils.logger, 'fatal').and.callThrough();
  });

  it('logs an error when it detects one', () => {
    cacheUtils._client.get(null);
    expect(cacheUtils.logger.fatal).toHaveBeenCalledWith({ err : 'Missing key', stack : undefined });
  });
});
