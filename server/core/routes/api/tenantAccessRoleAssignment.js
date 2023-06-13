'use strict';

const R        = require('ramda'),
      config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createTenantAccessRoleAssignment                       = require('../../controllers/api/tenantAccessRoleAssignment/createTenantAccessRoleAssignment'),
      updateTenantAccessRoleAssignment                       = require('../../controllers/api/tenantAccessRoleAssignment/updateTenantAccessRoleAssignment'),
      deleteTenantAccessRoleAssignment                       = require('../../controllers/api/tenantAccessRoleAssignment/deleteTenantAccessRoleAssignment'),
      getTenantAccessRoleAssignmentByUuid                    = require('../../controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentByUuid'),
      getTenantAccessRoleAssignmentsByTenantOrganizationUuid = require('../../controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByTenantOrganizationUuid'),
      getTenantAccessRoleAssignmentsByCloudUserUuid          = require('../../controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByCloudUserUuid'),
      getTenantAccessRoleAssignmentsByTenantAccessRoleUuid   = require('../../controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByTenantAccessRoleUuid');

const _getTenantAccessRoleAssignmentByUuid = require('../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentByUuid');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment
router.post('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createTenantAccessRoleAssignment',
    () => createTenantAccessRoleAssignment(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put(
  '/uuid/:uuid',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getTenantAccessRoleAssignmentByUuid,
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
      'updateTenantAccessRoleAssignment',
      () => updateTenantAccessRoleAssignment(req.body, uuid)
    );
  }
);

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getTenantAccessRoleAssignmentByUuid',
    () => getTenantAccessRoleAssignmentByUuid(uuid)
  );
});


// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment
router.get('/', ensureAuthorized, (req, res, next) => {
  const tenantOrganizationUuid = R.path(['tenantOrganization', 'uuid'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantOrganizationUuid }),
    'getTenantAccessRoleAssignmentsByTenantOrganizationUuid',
    () => getTenantAccessRoleAssignmentsByTenantOrganizationUuid(tenantOrganizationUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment/cloudUserUuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/cloudUserUuid/:cloudUserUuid', ensureAuthorized, (req, res, next) => {
  const { cloudUserUuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ cloudUserUuid }),
    'getTenantAccessRoleAssignmentsByCloudUserUuid',
    () => getTenantAccessRoleAssignmentsByCloudUserUuid(cloudUserUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment/tenantAccessRoleUuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/tenantAccessRoleUuid/:tenantAccessRoleUuid', ensureAuthorized, (req, res, next) => {
  const { tenantAccessRoleUuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantAccessRoleUuid }),
    'getTenantAccessRoleAssignmentsByTenantAccessRoleUuid',
    () => getTenantAccessRoleAssignmentsByTenantAccessRoleUuid(tenantAccessRoleUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.delete('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'deleteTenantAccessRoleAssignment',
    () => deleteTenantAccessRoleAssignment(uuid)
  );
});

module.exports = router;
