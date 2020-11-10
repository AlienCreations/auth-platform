'use strict';

const config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const MailSvc = require('../../services/mail/Mail')(config.mail.strategy);

const maybeParseIntFromPath = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanEdit         = require('../../controllers/api/_helpers/ensureCanEdit');

const createProspectTenant     = require('../../controllers/api/prospectTenant/createProspectTenant'),
      updateProspectTenant     = require('../../controllers/api/prospectTenant/updateProspectTenant'),
      getProspectTenantByEmail = require('../../controllers/api/prospectTenant/getProspectTenantByEmail'),
      getProspectTenantById    = require('../../controllers/api/prospectTenant/getProspectTenantById');

const _getProspectTenantById   = require('../../models/prospectTenant/methods/getProspectTenantById');

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

// https://platform.aliencreations.com/api/v1/prospectTenant/id/666
router.put('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  _getProspectTenantById(id)
    .then(ensureCanEdit(req))
    .then(() => {
      apiUtils.respondWithErrorHandling(
        req,
        res,
        next,
        req.logger.child({ id }),
        'updateProspectTenant',
        () => updateProspectTenant(req.body, id)
      );
    })
    .catch(err => {
      apiUtils.respondWithErrorHandling(
        req,
        res,
        next,
        req.logger.child({ id }),
        'updateProspectTenant',
        () => { throw err; }
      );
    });
});

// https://platform.aliencreations.com/api/v1/prospectTenant/id/3
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getProspectTenantById',
    () => getProspectTenantById(id)
  );
});

module.exports = router;
