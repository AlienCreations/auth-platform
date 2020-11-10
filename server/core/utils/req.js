'use strict';

const R = require('ramda');

const IP_HEADERS = ['x-forwarded-for', 'x-real-ip', 'true-client-ip'];

const getRootUrlFromReq = req => {
  const host = req.headers ? (req.headers.host || req.headers.hostname || 'localhost') : 'localhost';
  return 'https://' + host + '/';
};

const isCustomHeader = (v, k) => R.test(/^x-/i, k);

const extractCustomHeadersFromObject = R.pickBy(isCustomHeader);

const getCookiesObjectFromReq = R.compose(
  R.unless(
    R.is(Object),
    R.compose(
      R.tryCatch(JSON.parse, R.always({})),
      R.defaultTo('{}')
    )
  ),
  R.prop('cookies')
);

const getIpFromReqHeaders = R.compose(
  R.map(R.trim),
  R.split(','),
  R.join(','),
  R.values,
  R.pick(IP_HEADERS),
  R.prop('headers')
);

module.exports = {
  getRootUrlFromReq,
  extractCustomHeadersFromObject,
  getCookiesObjectFromReq,
  getIpFromReqHeaders
};
