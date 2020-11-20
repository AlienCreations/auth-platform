'use strict';

const R        = require('ramda'),
      config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createTenantAccessRole                     = require('../../controllers/api/tenantAccessRole/createTenantAccessRole'),
      updateTenantAccessRole                     = require('../../controllers/api/tenantAccessRole/updateTenantAccessRole'),
      deleteTenantAccessRole                     = require('../../controllers/api/tenantAccessRole/deleteTenantAccessRole'),
      getTenantAccessRoleById                    = require('../../controllers/api/tenantAccessRole/getTenantAccessRoleById'),
      getTenantAccessRolesByTenantId             = require('../../controllers/api/tenantAccessRole/getTenantAccessRolesByTenantId'),
      getTenantAccessRolesByTenantOrganizationId = require('../../controllers/api/tenantAccessRole/getTenantAccessRolesByTenantOrganizationId');

const _getTenantAccessRoleById = require('../../models/tenantAccessRole/methods/getTenantAccessRoleById');

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

// https://platform.aliencreations.com/api/v1/tenantAccessRole/id/123
router.put(
  '/id/:id',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getTenantAccessRoleById,
    dataIdPath      : ['params', 'id'],
    dataOwnerIdPath : ['tenantId'],
    identityPath    : ['tenant', 'id']
  }),
  (req, res, next) => {
    const id = maybeParseIntFromPath(['params', 'id'], req);

    apiUtils.respondWithErrorHandling(
      req,
      res,
      next,
      req.logger.child({ id }),
      'updateTenantAccessRole',
      () => updateTenantAccessRole(req.body, id)
    );
  }
);

// https://platform.aliencreations.com/api/v1/tenantAccessRole/id/123
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getTenantAccessRoleById',
    () => getTenantAccessRoleById(id)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRole/tenantId/123
router.get('/tenantId/:tenantId', ensureAuthorized, (req, res, next) => {
  const tenantId = maybeParseIntFromPath(['params', 'tenantId'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantId }),
    'getTenantAccessRolesByTenantId',
    () => getTenantAccessRolesByTenantId(tenantId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRole
router.get('/', ensureAuthorized, (req, res, next) => {
  const tenantOrganizationId = R.path(['tenantOrganization', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantOrganizationId }),
    'getTenantAccessRolesByTenantOrganizationId',
    () => getTenantAccessRolesByTenantOrganizationId(tenantOrganizationId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRole/id/123
router.delete('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'deleteTenantAccessRole',
    () => deleteTenantAccessRole(id)
  );
});

module.exports = router;
