'use strict';

const express  = require('express'),
      config   = require('config'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createTenantConnection           = require('../../controllers/api/tenantConnection/createTenantConnection'),
      updateTenantConnection           = require('../../controllers/api/tenantConnection/updateTenantConnection'),
      deleteTenantConnection           = require('../../controllers/api/tenantConnection/deleteTenantConnection'),
      getTenantConnectionByUuid        = require('../../controllers/api/tenantConnection/getTenantConnectionByUuid'),
      getTenantConnectionsByTenantUuid = require('../../controllers/api/tenantConnection/getTenantConnectionsByTenantUuid');

const _getTenantConnectionByUuid = require('../../models/tenantConnection/methods/getTenantConnectionByUuid');

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

// https://platform.aliencreations.com/api/v1/tenantConnection/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put(
  '/uuid/:uuid',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getTenantConnectionByUuid,
    dataIdPath      : ['params', 'uuid'],
    dataOwnerIdPath : ['tenantUuid'],
    identityPath    : ['tenant', 'uuid']
  }),
  (req, res, next) => {
    const { uuid } = req.params;

    apiUtils.respondWithErrorHandling(
      req,
      res,
      next,
      req.logger.child({ uuid }),
      'updateTenantConnection',
      () => updateTenantConnection(req.body, uuid)
    );
  }
);

// https://platform.aliencreations.com/api/v1/tenantConnection/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getTenantConnectionByUuid',
    () => getTenantConnectionByUuid(uuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantConnection/tenantUuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/tenantUuid/:tenantUuid', ensureAuthorized, (req, res, next) => {
  const { tenantUuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantUuid }),
    'getTenantConnectionsByTenantUuid',
    () => getTenantConnectionsByTenantUuid(tenantUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantConnection/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.delete('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'deleteTenantConnection',
    () => deleteTenantConnection(uuid)
  );
});

module.exports = router;
