'use strict';

const R        = require('ramda'),
      config   = require('config'),
      apiUtils = require('alien-node-api-utils');

const commonJwtOptions       = R.path(['auth', 'jwtOptions'],         config),
      authTokenProfileFields = R.path(['auth', 'tokenProfileFields'], config),
      masterSalt             = R.path(['auth', 'MASTER_SALT'], config),
      jwtOptions             = R.assoc('algorithm', 'RS256', commonJwtOptions);

const { authenticator } = require('@aliencreations/node-authenticator')(config.auth.strategy);

const cache                 = require('../../utils/cache'),
      password              = require('../../utils/password'),
      isRequestIpAuthorized = require('../../controllers/api/_helpers/isRequestIpAuthorized');

const refresh = (req, res, next) => {
  const MASTER_PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, '\n');

  const errorResponse = _error => apiUtils.jsonResponseError(req, res, next, config.errors.decorateForJson(_error));

  return Promise.resolve(req.body.refreshToken)
    .then(authenticator.lookupRefreshToken(cache))
    .then(JSON.parse)
    .then(({ payload, secret }) => {
      const isValidRefreshToken = password.passwordMatchesHash(`${payload.email}${masterSalt}`, secret);

      if (!isValidRefreshToken) {
        req.logger.info({
          payload,
          refreshToken : req.body.refreshToken,
          debug        : { originalError : config.errors.auth.REFRESH_TOKEN_INVALID() }
        });
        return errorResponse(config.errors.auth.REFRESH_TOKEN_INVALID());
      }

      if (!isRequestIpAuthorized(req, payload.ipWhitelist)) {
        req.logger.info({
          payload,
          debug : { originalError : config.errors.auth.UNAUTHORIZED_IP_ADDRESS() }
        });
        return errorResponse(config.errors.auth.UNAUTHORIZED_IP_ADDRESS());
      }

      return authenticator.sign(payload, MASTER_PRIVATE_KEY, jwtOptions)
        .then(token => {
          const expires      = config.auth.refreshTokenOptions.expiresInSeconds;
          const refreshToken = authenticator.generateAndCacheRefreshToken(cache)({ payload, secret, expires, oldRefreshToken : req.body.refreshToken });

          res.set('x-auth-token',    token);
          res.set('x-refresh-token', refreshToken);

          return apiUtils.jsonResponseSuccess(req, res, R.pick(authTokenProfileFields, payload));
        })
        .catch(errorResponse);
    })
    .catch(err => {
      req.logger.info({
        refreshToken : req.body.refreshToken,
        debug        : { originalError : err }
      });
      return errorResponse(config.errors.auth.REFRESH_TOKEN_EXPIRED());
    });
};

module.exports = refresh;
