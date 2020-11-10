'use strict';

const R      = require('ramda'),
      config = require('config');

const { error, errors } = require('@aliencreations/node-error');

const strategy = R.path(['legacyUser', 'strategy'], config);
const { getLegacyUserByUsernamePreAuth } = require('../../../../../services/legacyUser/LegacyUser')(strategy);

const getCloudUserByEmail   = require('../../../../api/cloudUser/getCloudUserByEmail'),
      isRequestIpAuthorized = require('../../../../api/_helpers/isRequestIpAuthorized');

const INVALID_CREDENTIALS_ERR = errors.auth.INVALID_CREDENTIALS,
      USER_ACCOUNT_EXPIRED    = errors.auth.USER_ACCOUNT_EXPIRED,
      USER_ACCOUNT_LOCKED     = errors.auth.USER_ACCOUNT_LOCKED,
      UNAUTHORIZED_IP_ADDRESS = errors.auth.UNAUTHORIZED_IP_ADDRESS,
      NO_QUERY_RESULTS        = errors.db.NO_QUERY_RESULTS;

const PUBLIC_FIELDS = [
  'username',
  'requireMfa',
  'isActive',
  'isExpired',
  'isLocked',
  'language',
  'strategyRefs',
  'saml',
  'oidc'
];

// wildfly api returns a nested json object with 'user' and 'authStatus' but mockLocal doesn't.
const normalizeProfile = profile => R.compose(
  R.mergeDeepLeft(profile.authConfig),
  R.mergeDeepRight(profile.authStatus),
  R.mergeDeepRight(profile.user)
)(profile);

const userStatusError = errorType => profile => Promise.reject(error(errorType({
  debug : {
    profile : R.pick([PUBLIC_FIELDS], profile)
  }
})));

const validateUserStatus = req => R.cond([
  [R.propEq('isActive', false), userStatusError(INVALID_CREDENTIALS_ERR)],
  [R.propEq('isExpired', true), userStatusError(USER_ACCOUNT_EXPIRED)],
  [R.propEq('isLocked', true), userStatusError(USER_ACCOUNT_LOCKED)],
  [R.isEmpty, userStatusError(NO_QUERY_RESULTS)],
  [
    R.compose(
      R.not,
      isRequestIpAuthorized(req),
      R.prop('ipWhitelist')
    ),
    userStatusError(UNAUTHORIZED_IP_ADDRESS)
  ],
  [R.T, R.identity]
]);

const getUserProfile = username => Promise.all([
  getLegacyUserByUsernamePreAuth(username),
  getCloudUserByEmail(username)
]).then(R.mergeAll);

const preflight = req => username => Promise.resolve(username)
  .then(getUserProfile)
  .then(normalizeProfile)
  .then(validateUserStatus(req))
  .then(R.pick(PUBLIC_FIELDS));

module.exports = preflight;
