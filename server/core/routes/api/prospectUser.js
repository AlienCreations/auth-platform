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
      getProspectUserByUuid  = require('../../controllers/api/prospectUser/getProspectUserByUuid');

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
  const { email } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ email }),
    'getProspectUserByEmail',
    () => getProspectUserByEmail(email)
  );
});

// https://platform.aliencreations.com/api/v1/prospectUser/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'updateProspectUser',
    () => updateProspectUser(req.body, uuid)
  );
});

// https://platform.aliencreations.com/api/v1/prospectUser/uuid/3
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getProspectUserByUuid',
    () => getProspectUserByUuid(uuid)
  );
});

module.exports = router;
