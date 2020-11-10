'use strict';

const resetAndSeedTables = require('../../../scripts/resetAndSeedTables');

describe('resetAndSeedTables', () => {
  describe('stable', () => {
    it('resets and seeds without error', done => {
      const reset = resetAndSeedTables.init('coreDb', 'stable').reset;
      reset()
        .then(res => {
          expect(Array.isArray(res)).toBe(true);
          done();
        })
        .catch(done.fail);
    });
    it('defaults to stable if persist is not provided', done => {
      const reset = resetAndSeedTables.init('coreDb').reset;
      reset()
        .then(res => {
          expect(Array.isArray(res)).toBe(true);
          done();
        })
        .catch(done.fail);
    });
  });

  describe('volatile', () => {
    it('resets and seeds without error', done => {
      const reset = resetAndSeedTables.init('coreDb', 'volatile').reset;
      reset()
        .then(res => {
          expect(Array.isArray(res)).toBe(true);
          done();
        })
        .catch(done.fail);
    });
  });
});
