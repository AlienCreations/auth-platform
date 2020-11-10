'use strict';

const deleteItem = require('../../../../../../../server/core/services/secret/strategies/vault/methods/deleteItem');

const FAKE_ERROR = 'some error';

const FAKE_VAULT_SUCCESS = {
  delete : () => Promise.resolve('ok')
};

const FAKE_VAULT_ERROR = {
  delete : () => Promise.reject(FAKE_ERROR)
};

describe('secret.vault.deleteItem', () => {

  it('deletes a secret in vault', done => {
    deleteItem(FAKE_VAULT_SUCCESS)('foo')
      .then(res => {
        expect(res).toBe('ok');
        done();
      });
  });

  it('handles errors gracefully', done => {
    deleteItem(FAKE_VAULT_ERROR)('foo', 'bar')
      .catch(err => {
        expect(err).toBe(FAKE_ERROR);
        done();
      });
  });

});
