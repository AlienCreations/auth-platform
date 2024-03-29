'use strict';

const Secret = require('../server/core/services/secret/Secret')(process.env.SECRET_STRATEGY);

const platforms = JSON.parse(process.env.PLATFORMS);

const storePrivateKeys = () => Promise.all(platforms.map(
  service => Secret.setItem(`secret/data/services/${service}/privateKey`, process.env.PRIVATE_KEY)
));

const storePublicKeys = () => Secret.setItem('secret/data/services/publicKeys', process.env.PUBLIC_KEYS);
const storeWhitelist  = () => Secret.setItem('secret/data/services/whitelist',  process.env.WHITELIST);

module.exports = () => Promise.all([
  storePrivateKeys(),
  storePublicKeys(),
  storeWhitelist()
]);
