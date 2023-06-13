'use strict';

const config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const MailSvc = require('../../services/mail/Mail')(config.mail.strategy);

const maybeParseIntFromPath = require('../../controllers/api/_helpers/maybeParseIntFromPath');

const createProspectTenant     = require('../../controllers/api/prospectTenant/createProspectTenant'),
      updateProspectTenant     = require('../../controllers/api/prospectTenant/updateProspectTenant'),
      getProspectTenantByEmail = require('../../controllers/api/prospectTenant/getProspectTenantByEmail'),
      getProspectTenantByUuid    = require('../../controllers/api/prospectTenant/getProspectTenantByUuid');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/prospectTenant
router.post('/', (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createProspectTenant',
    () => createProspectTenant(MailSvc)(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/prospectTenant/email/foo@bar.com
router.get('/email/:email', ensureAuthorized, (req, res, next) => {
  const email = req.params.email;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ email }),
    'getProspectTenantByEmail',
    () => getProspectTenantByEmail(email)
  );
});

// https://platform.aliencreations.com/api/v1/prospectTenant/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'updateProspectTenant',
    () => updateProspectTenant(req.body, uuid)
  );
});

// https://platform.aliencreations.com/api/v1/prospectTenant/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getProspectTenantByUuid',
    () => getProspectTenantByUuid(uuid)
  );
});

module.exports = router;
