'use strict';

const DB = require('../../../server/core/utils/db');

const CORE_DB_PASSWORD = process.env.CORE_DB_PASSWORD;

describe('DB', () => {
  describe('password rotation', () => {
    it('handles an access denied error', done => {
      DB.dbPool.config.connectionConfig.password = 'wrong';
      DB.query([`SELECT * FROM ${DB.coreDbName}.cloud_users WHERE id < 0`, []])
        .then(done.fail)
        .catch(() => {
          // This race condition is mandatory since we have to use an external hook for mysql error handling.
          setTimeout(() => {
            expect(DB.dbPool.config.connectionConfig.password).toEqual(CORE_DB_PASSWORD);
            done();
          }, 1800);
        });
    });

    afterEach(() => {
      DB.dbPool.config.connectionConfig.password = CORE_DB_PASSWORD;
    });
  });

  describe('plain sql stuff', () => {
    it('handles a sql error', done => {
      DB.query(['SELECT * FROM foo WHERE id < 0', []])
        .then(done.fail)
        .catch(() => done());
    });

    it('makes connections and queries when everything is ok', done => {
      DB.query(['SELECT version()', []])
        .then(() => done())
        .catch(done.fail);
    });
  });

});
