'use strict';

const R        = require('ramda'),
      config   = require('config'),
      apiUtils = require('alien-node-api-utils'),
      passport = require('passport');

const { authenticator } = require('@aliencreations/node-authenticator')(config.auth.strategy);
const { errors, error } = require('@aliencreations/node-error');

const cache    = require('../../utils/cache'),
      password = require('../../utils/password');

const getStrategyTokenProps = loginStrategy => {

  const tokenProps = {
    alg : 'RS256',
    key : 'authPlatform',
    aud : 'authPlatform'
  };

  switch (loginStrategy) {
  case 'prospectUser':
    return R.assoc('strategy', 'prospectUser', tokenProps);
  case 'cloudUser':
  default:
    return R.assoc('strategy', 'cloudUser', tokenProps);
  }
};

const commonJwtOptions       = R.path(['auth', 'jwtOptions'], config),
      authTokenProfileFields = R.path(['auth', 'tokenProfileFields'], config),
      authTokenPrivateFields = R.path(['api', 'USER_PRIVATE_FIELDS'], config),
      masterSalt             = R.path(['auth', 'MASTER_SALT'], config),
      jwtOptions             = R.assoc('algorithm', 'RS256', commonJwtOptions);

const mergeProfileWithStrategyIdentifier = loginStrategy => R.compose(
  R.mergeDeepRight(getStrategyTokenProps(loginStrategy)),
  R.reject(R.isNil),
  R.prop('profile')
);

const login = (req, res, next) => {
  const logger = req.logger.child({});

  const MASTER_PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        loginStrategy      = R.pathOr('cloudUser', ['body', 'strategy'], req);

  passport.authenticate(loginStrategy, (err, user, info = {}) => {
    const { cookies=[], strategyCallback = () => {} } = info;

    strategyCallback();

    if (err) {
      const _err = error(err);
      logger.err(_err);
      return apiUtils.jsonResponseError(req, res, next, config.errors.decorateForJson(R.omit(['debug'], _err)));
    }

    if (!user) {
      const _err = error(errors.db.NO_QUERY_RESULTS({
        debug : {
          internalMessage : 'No user found in login controller'
        }
      }));
      logger.err(_err);
      return apiUtils.jsonResponseError(req, res, next, config.errors.decorateForJson(R.omit(['debug'], _err)));
    }

    const payload = mergeProfileWithStrategyIdentifier(loginStrategy)(user),
          secret  = password.makePasswordHash(`${payload.email}${masterSalt}`, 10),
          profile = R.omit(authTokenPrivateFields, payload);

    authenticator.sign(profile, MASTER_PRIVATE_KEY, jwtOptions)
      .then(token => {
        const expires      = config.auth.refreshTokenOptions.expiresInSeconds;
        const refreshToken = authenticator.generateAndCacheRefreshToken(cache)({ payload, secret, expires });

        res.set('x-auth-token',       token);
        res.set('x-refresh-token',    refreshToken);
        res.set('x-profile',          JSON.stringify(profile));
        res.set('x-auth-public-keys', JSON.stringify(JSON.parse(process.env.PUBLIC_KEYS.replace(/'/g, ''))[process.env.THIS_SERVICE_NAME]));
        res.set('x-cookies',          JSON.stringify(cookies));

        return apiUtils.jsonResponseSuccess(req, res, R.pick(authTokenProfileFields, profile));
      })
      .catch(err => {
        logger.err(err);
        return apiUtils.jsonResponseError(req, res, next, config.errors.decorateForJson(err));
      });

  })(req, res, next);
};

module.exports = login;
