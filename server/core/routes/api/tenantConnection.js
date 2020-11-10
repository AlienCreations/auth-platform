'use strict';

const express  = require('express'),
      config   = require('config'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanEdit         = require('../../controllers/api/_helpers/ensureCanEdit');

const createTenantConnection         = require('../../controllers/api/tenantConnection/createTenantConnection'),
      updateTenantConnection         = require('../../controllers/api/tenantConnection/updateTenantConnection'),
      deleteTenantConnection         = require('../../controllers/api/tenantConnection/deleteTenantConnection'),
      getTenantConnectionById        = require('../../controllers/api/tenantConnection/getTenantConnectionById'),
      getTenantConnectionsByTenantId = require('../../controllers/api/tenantConnection/getTenantConnectionsByTenantId');

const _getTenantConnectionById = require('../../models/tenantConnection/methods/getTenantConnectionById');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/tenantConnection
router.post('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createTenantConnection',
    () => createTenantConnection(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/tenantConnection/id/123
router.put('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  _getTenantConnectionById(id)
    .then(ensureCanEdit(req))
    .then(() => {
      apiUtils.respondWithErrorHandling(
        req,
        res,
        next,
        req.logger.child({ id }),
        'updateTenantConnection',
        () => updateTenantConnection(req.body, id)
      );
    })
    .catch(err => {
      apiUtils.respondWithErrorHandling(
        req,
        res,
        next,
        req.logger.child({ id }),
        'updateTenantConnection',
        () => { throw err; }
      );
    });
});

// https://platform.aliencreations.com/api/v1/tenantConnection/id/123
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getTenantConnectionById',
    () => getTenantConnectionById(id)
  );
});

// https://platform.aliencreations.com/api/v1/tenantConnection/tenantId/123
router.get('/tenantId/:tenantId', ensureAuthorized, (req, res, next) => {
  const tenantId = maybeParseIntFromPath(['params', 'tenantId'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantId }),
    'getTenantConnectionsByTenantId',
    () => getTenantConnectionsByTenantId(tenantId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantConnection/id/123
router.delete('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'deleteTenantConnection',
    () => deleteTenantConnection(id)
  );
});

module.exports = router;
