'use strict';

const getItem = require('../../../../../../../server/core/services/secret/strategies/vault/methods/getItem');

const FAKE_VALUE  = 'some value',
      FAKE_RES    = { data : { data : FAKE_VALUE } },
      FAKE_ERROR  = 'some error';

const FAKE_VAULT_SUCCESS = {
  read : () => Promise.resolve(FAKE_RES)
};

const FAKE_VAULT_ERROR = {
  read : () => Promise.reject(FAKE_ERROR)
};

describe('secret.vault.getItem', () => {
  it('gets an item from vault', done => {
    getItem(FAKE_VAULT_SUCCESS)('foo')
      .then(res => {
        expect(res).toBe(FAKE_VALUE);
        done();
      });
  });

  it('handles errors gracefully', done => {
    getItem(FAKE_VAULT_ERROR)('foo')
      .catch(err => {
        expect(err).toBe(FAKE_ERROR);
        done();
      });
  });
});
