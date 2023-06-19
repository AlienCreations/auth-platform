'use strict';

const R        = require('ramda'),
      config   = require('config'),
      atob     = require('atob'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createTenantAccessPermission                         = require('../../controllers/api/tenantAccessPermission/createTenantAccessPermission'),
      updateTenantAccessPermission                         = require('../../controllers/api/tenantAccessPermission/updateTenantAccessPermission'),
      deleteTenantAccessPermission                         = require('../../controllers/api/tenantAccessPermission/deleteTenantAccessPermission'),
      getTenantAccessPermissionByUuid                      = require('../../controllers/api/tenantAccessPermission/getTenantAccessPermissionByUuid'),
      getTenantAccessPermissionsByTenantAccessResourceUuid = require('../../controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantAccessResourceUuid'),
      getTenantAccessPermissionsByTenantAccessRoleUuid     = require('../../controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantAccessRoleUuid'),
      getTenantAccessPermissionsByTenantOrganizationUuid   = require('../../controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantOrganizationUuid'),
      checkTenantAccessPermission                          = require('../../controllers/api/tenantAccessPermission/checkTenantAccessPermission');

const _getTenantAccessPermissionByUuid = require('../../models/tenantAccessPermission/methods/getTenantAccessPermissionByUuid');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/tenantAccessPermission
router.post('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createTenantAccessPermission',
    () => createTenantAccessPermission(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put(
  '/uuid/:uuid',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataByUuid     : _getTenantAccessPermissionByUuid,
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
      'updateTenantAccessPermission',
      () => updateTenantAccessPermission(req.body, uuid)
    );
  }
);

// https://platform.aliencreations.com/api/v1/tenantAccessPermission
router.get('/', ensureAuthorized, (req, res, next) => {
  const tenantOrganizationUuid = R.path(['tenantOrganization', 'uuid'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantOrganizationUuid }),
    'getTenantAccessPermissionsByTenantOrganizationUuid',
    () => getTenantAccessPermissionsByTenantOrganizationUuid(tenantOrganizationUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getTenantAccessPermissionByUuid',
    () => getTenantAccessPermissionByUuid(uuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/tenantAccessResourceUuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/tenantAccessResourceUuid/:tenantAccessResourceUuid', ensureAuthorized, (req, res, next) => {
  const { tenantAccessResourceUuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantAccessResourceUuid }),
    'getTenantAccessPermissionsByTenantAccessResourceUuid',
    () => getTenantAccessPermissionsByTenantAccessResourceUuid(tenantAccessResourceUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/tenantAccessRoleUuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/tenantAccessRoleUuid/:tenantAccessRoleUuid', ensureAuthorized, (req, res, next) => {
  const { tenantAccessRoleUuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantAccessRoleUuid }),
    'getTenantAccessPermissionsByTenantAccessRoleUuid',
    () => getTenantAccessPermissionsByTenantAccessRoleUuid(tenantAccessRoleUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/public/check/some-uri/GET/3aee202d-0e54-4a0c-a7d2-a0d9976a0378/cfc03afb-be91-4dd8-a4ef-08e24b4e1501/71017ff1-7241-4e43-921f-ded836d03151
router.get('/public/check/:uri/:method/:cloudUserUuid/:tenantUuid/:tenantOrganizationUuid', (req, res, next) => {
  const uri = atob(req.params.uri),
        {
          method,
          cloudUserUuid,
          tenantUuid,
          tenantOrganizationUuid
        }   = req.params;

  const idOrNull = R.when(R.anyPass([R.isNil, isNaN, R.equals('undefined')]), R.always(null));

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uri, method, cloudUserUuid, tenantUuid, tenantOrganizationUuid }),
    'checkTenantAccessPermission',
    () => checkTenantAccessPermission(uri, method, cloudUserUuid, idOrNull(tenantUuid), idOrNull(tenantOrganizationUuid))
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.delete('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'deleteTenantAccessPermission',
    () => deleteTenantAccessPermission(uuid)
  );
});

module.exports = router;
