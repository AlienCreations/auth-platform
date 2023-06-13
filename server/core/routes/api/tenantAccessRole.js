'use strict';

const R        = require('ramda'),
      config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createTenantAccessRole                       = require('../../controllers/api/tenantAccessRole/createTenantAccessRole'),
      updateTenantAccessRole                       = require('../../controllers/api/tenantAccessRole/updateTenantAccessRole'),
      deleteTenantAccessRole                       = require('../../controllers/api/tenantAccessRole/deleteTenantAccessRole'),
      getTenantAccessRoleByUuid                    = require('../../controllers/api/tenantAccessRole/getTenantAccessRoleByUuid'),
      getTenantAccessRolesByTenantUuid             = require('../../controllers/api/tenantAccessRole/getTenantAccessRolesByTenantUuid'),
      getTenantAccessRolesByTenantOrganizationUuid = require('../../controllers/api/tenantAccessRole/getTenantAccessRolesByTenantOrganizationUuid');

const _getTenantAccessRoleByUuid = require('../../models/tenantAccessRole/methods/getTenantAccessRoleByUuid');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/tenantAccessRole
router.post('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createTenantAccessRole',
    () => createTenantAccessRole(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRole/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put(
  '/uuid/:uuid',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataByUuid     : _getTenantAccessRoleByUuid,
    dataUuidPath      : ['params', 'uuid'],
    dataOwnerUuidPath : ['tenantUuid'],
    identityPath      : ['tenant', 'uuid']
  }),
  (req, res, next) => {
    const { uuid } = req.params;

    apiUtils.respondWithErrorHandling(
      req,
      res,
      next,
      req.logger.child({ uuid }),
      'updateTenantAccessRole',
      () => updateTenantAccessRole(req.body, uuid)
    );
  }
);

// https://platform.aliencreations.com/api/v1/tenantAccessRole/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getTenantAccessRoleByUuid',
    () => getTenantAccessRoleByUuid(uuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRole/tenantUuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/tenantUuid/:tenantUuid', ensureAuthorized, (req, res, next) => {
  const { tenantUuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantUuid }),
    'getTenantAccessRolesByTenantUuid',
    () => getTenantAccessRolesByTenantUuid(tenantUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRole
router.get('/', ensureAuthorized, (req, res, next) => {
  const tenantOrganizationUuid = R.path(['tenantOrganization', 'uuid'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantOrganizationUuid }),
    'getTenantAccessRolesByTenantOrganizationUuid',
    () => getTenantAccessRolesByTenantOrganizationUuid(tenantOrganizationUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRole/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.delete('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'deleteTenantAccessRole',
    () => deleteTenantAccessRole(uuid)
  );
});

module.exports = router;
