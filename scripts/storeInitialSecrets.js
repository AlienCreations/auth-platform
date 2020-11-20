'use strict';

const R = require('ramda');

const Secret = require('../server/core/services/secret/Secret')(process.env.SECRET_STRATEGY);

const flattenAndObjectify = R.compose(
  R.mapObjIndexed((v, k) => R.reject(R.equals(k), v)),
  R.map(R.uniq),
  R.map(R.flatten),
  R.groupBy(R.head)
);

const makeWhitelistDict = R.compose(
  JSON.stringify,
  flattenAndObjectify,
  R.apply(R.xprod),
  v => [v, v]
);

const makePublicKeysDict = key => R.compose(
  JSON.stringify,
  R.map(R.always([key])),
  R.invert
);

const services   = JSON.parse(process.env.SERVICES);
const whitelist  = makeWhitelistDict(services);
const publicKeys = makePublicKeysDict(process.env.SHARED_PUBLIC_KEY)(services);
const privateKey = process.env.PRIVATE_KEY;

const storePrivateKeys = () => Promise.all(services.map(
  service => Secret.setItem(`secret/data/services/${service}/privateKey`, privateKey)
));

const storePublicKeys = () => Secret.setItem('secret/data/services/publicKeys', publicKeys);
const storeWhitelist  = () => Secret.setItem('secret/data/services/whitelist',  whitelist);

module.exports = () => Promise.all([
  storePrivateKeys(),
  storePublicKeys(),
  storeWhitelist()
]);
