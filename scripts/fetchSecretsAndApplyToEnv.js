'use strict';

const Secret = require('../server/core/services/secret/Secret')(process.env.SECRET_STRATEGY);

const setEnv = k => v => {
  /* istanbul ignore if */
  if (process.env.ALLOW_DEBUG === 'true') {
    console.log(`fetchSecretsAndApplyToEnv : setting ${k} to ${v}`);
  }
  process.env[k] = v;
  return v;
};

const fetchAndSetPrivateKeyOnEnv = () => Secret.getItem(`secret/services/${process.env.THIS_SERVICE_NAME}/privateKey`)
  .then(v => setEnv('PRIVATE_KEY')(v));

const fetchAndSetWhitelistOnEnv = () => Secret.getItem('secret/services/whitelist')
  .then(v => setEnv('WHITELIST')(v));

const fetchAndSetPublicKeysOnEnv = () => Secret.getItem('secret/services/publicKeys')
  .then(v => setEnv('PUBLIC_KEYS')(v));

module.exports = () => Promise.all([
  fetchAndSetPrivateKeyOnEnv(),
  fetchAndSetPublicKeysOnEnv(),
  fetchAndSetWhitelistOnEnv()
]);
