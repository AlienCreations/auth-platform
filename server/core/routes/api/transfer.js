'use strict';

const express  = require('express'),
      router   = express.Router(),
      config   = require('config'),
      apiUtils = require('../../utils/api');

const { ensureAuthorized, authenticator } = require('@aliencreations/node-authenticator')(config.auth.strategy);

const cache                       = require('../../utils/cache'),
      { getCookiesObjectFromReq } = require('../../utils/req');

const createTransferToken                   = require('../../controllers/api/transferToken/createTransferToken'),
      verifyTransferTokenAndRestoreAuthData = require('../../controllers/api/transferToken/verifyTransferTokenAndRestoreAuthData');

// https://platform.aliencreations.com/api/v1/auth/transfer/ck4c5wkk800007kp1qa36gby5
router.get('/:token', (req, res, next) => {
  const transferToken = req.params.token,
        origin        = req.headers.origin,
        logger        = req.logger;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ transferToken, origin }),
    'verifyTransferTokenAndRestoreAuthData',
    () => verifyTransferTokenAndRestoreAuthData({ logger, cache })({ transferToken, origin })
  );
});

// https://platform.aliencreations.com/api/v1/auth/transfer
router.post('/', ensureAuthorized, (req, res, next) => {
  const data = {
    payload : {
      ...req.body,
      authToken : authenticator.identifyCaller(req),
      cookies   : getCookiesObjectFromReq(req),
    },
    expires : config.auth.transferTokenOptions.expiresInSeconds
  };

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ data }),
    'createTransferToken',
    () => createTransferToken({ cache })(data)
  );
});

module.exports = router;
