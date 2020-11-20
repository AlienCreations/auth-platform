'use strict';

const express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const loginCtrl   = require('../../controllers/auth/login'),
      refreshCtrl = require('../../controllers/auth/refresh'),
      logoutCtrl  = require('../../controllers/auth/logout');

router.post('/login', loginCtrl);
router.post('/refresh', refreshCtrl);
router.get('/logout', logoutCtrl);

// https://platform.auth-platform.test.com:1337/api/v1/auth/legacyUser/preflight/postman@aliencreations.com
router.get('/preflight/:strategy/:username', (req, res, next) => {
  const { username, strategy } = req.params;
  const logger                 = req.logger.child({ username, strategy });

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    logger,
    'preflight',
    () => {
      const preflightCtrl = require('../../controllers/auth/preflight/preflight')(strategy);
      return preflightCtrl(req)(username);
    }
  );
});

module.exports = router;
