'use strict';

const express  = require('express'),
      router   = express.Router(),
      config   = require('config'),
      apiUtils = require('../../utils/api');

const MailSvc = require('../../services/mail/Mail')(config.mail.strategy);

const createTokenAndSendResetEmail = require('../../controllers/api/passwordReset/createTokenAndSendResetEmail'),
      getPasswordResetByToken      = require('../../controllers/api/passwordReset/getPasswordResetByToken'),
      maybeResetPassword           = require('../../controllers/api/passwordReset/maybeResetPassword');

// https://platform.aliencreations.com/api/v1/passwordReset/email/foo@bar.com
router.get('/email/:email', (req, res, next) => {
  const email  = req.params.email,
        origin = req.headers.origin;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ email, origin }),
    'createTokenAndSendResetEmail',
    () => createTokenAndSendResetEmail(MailSvc, origin, email)
  );
});

// https://platform.aliencreations.com/api/v1/passwordReset/JDJhJDEwJEFPN0ZyRlh1UFJUQXJieVJ2cW1BcE9EYkFBQmxLVlFMeUxhWEhuOHZPdkhRbzBwMXZwR0FL
router.get('/:token', (req, res, next) => {
  const token = req.params.token;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ token }),
    'getPasswordResetByToken',
    () => getPasswordResetByToken(token)
  );
});

// https://platform.aliencreations.com/api/v1/passwordReset
router.post('/', (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'maybeResetPassword',
    () => maybeResetPassword(MailSvc, req.body)
  );
});

module.exports = router;
