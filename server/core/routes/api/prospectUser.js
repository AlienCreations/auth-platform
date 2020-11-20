'use strict';

const config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const MailSvc = require('../../services/mail/Mail')(config.mail.strategy);

const maybeParseIntFromPath = require('../../controllers/api/_helpers/maybeParseIntFromPath');

const createProspectUser     = require('../../controllers/api/prospectUser/createProspectUser'),
      updateProspectUser     = require('../../controllers/api/prospectUser/updateProspectUser'),
      getProspectUserByEmail = require('../../controllers/api/prospectUser/getProspectUserByEmail'),
      getProspectUserById    = require('../../controllers/api/prospectUser/getProspectUserById');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/prospectUser
router.post('/', (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createProspectUser',
    () => createProspectUser(MailSvc, req.headers.origin)(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/prospectUser/email/foo@bar.com
router.get('/email/:email', ensureAuthorized, (req, res, next) => {
  const email = req.params.email;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ email }),
    'getProspectUserByEmail',
    () => getProspectUserByEmail(email)
  );
});

// https://platform.aliencreations.com/api/v1/prospectUser/id/666
router.put('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'updateProspectUser',
    () => updateProspectUser(req.body, id)
  );
});

// https://platform.aliencreations.com/api/v1/prospectUser/id/3
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getProspectUserById',
    () => getProspectUserById(id)
  );
});

module.exports = router;
