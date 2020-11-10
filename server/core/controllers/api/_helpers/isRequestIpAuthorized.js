'use strict';

const R = require('ramda');

const { getIpFromReqHeaders } = require('../../../utils/req');

const isRequestIpAuthorized = R.curry((req, ipWhitelist) => R.ifElse(
  R.either(R.isNil, R.isEmpty),
  R.T,
  R.compose(
    R.includes(true),
    R.map(R.includes(R.__, getIpFromReqHeaders(req)))
  )
)(ipWhitelist));

module.exports = isRequestIpAuthorized;
