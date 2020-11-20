'use strict';

const setItem = require('../../../../../../../server/core/services/secret/strategies/vault/methods/setItem');

const FAKE_ERROR = 'some error';

const FAKE_VAULT_SUCCESS = {
  write : () => Promise.resolve('ok')
};

const FAKE_VAULT_ERROR = {
  write : () => Promise.reject(FAKE_ERROR)
};

describe('secret.vault.setItem', () => {
  it('sets a secret in vault', done => {
    setItem(FAKE_VAULT_SUCCESS)('foo', 'bar')
      .then(res => {
        expect(res).toBe('ok');
        done();
      });
  });

  it('handles errors gracefully', done => {
    setItem(FAKE_VAULT_ERROR)('foo', 'bar')
      .catch(err => {
        expect(err).toBe(FAKE_ERROR);
        done();
      });
  });
});
