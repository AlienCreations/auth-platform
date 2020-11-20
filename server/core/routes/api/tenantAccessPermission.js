'use strict';

const R        = require('ramda'),
      config   = require('config'),
      atob     = require('atob'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createTenantAccessPermission                       = require('../../controllers/api/tenantAccessPermission/createTenantAccessPermission'),
      updateTenantAccessPermission                       = require('../../controllers/api/tenantAccessPermission/updateTenantAccessPermission'),
      deleteTenantAccessPermission                       = require('../../controllers/api/tenantAccessPermission/deleteTenantAccessPermission'),
      getTenantAccessPermissionById                      = require('../../controllers/api/tenantAccessPermission/getTenantAccessPermissionById'),
      getTenantAccessPermissionsByTenantAccessResourceId = require('../../controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantAccessResourceId'),
      getTenantAccessPermissionsByTenantAccessRoleId     = require('../../controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantAccessRoleId'),
      getTenantAccessPermissionsByTenantOrganizationId   = require('../../controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantOrganizationId'),
      checkTenantAccessPermission                        = require('../../controllers/api/tenantAccessPermission/checkTenantAccessPermission');

const _getTenantAccessPermissionById = require('../../models/tenantAccessPermission/methods/getTenantAccessPermissionById');

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

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/id/123
router.put(
  '/id/:id',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getTenantAccessPermissionById,
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
      'updateTenantAccessPermission',
      () => updateTenantAccessPermission(req.body, id)
    );
  }
);

// https://platform.aliencreations.com/api/v1/tenantAccessPermission
router.get('/', ensureAuthorized, (req, res, next) => {
  const tenantOrganizationId = R.path(['tenantOrganization', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantOrganizationId }),
    'getTenantAccessPermissionsByTenantOrganizationId',
    () => getTenantAccessPermissionsByTenantOrganizationId(tenantOrganizationId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/id/123
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getTenantAccessPermissionById',
    () => getTenantAccessPermissionById(id)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/tenantAccessResourceId/123
router.get('/tenantAccessResourceId/:tenantAccessResourceId', ensureAuthorized, (req, res, next) => {
  const tenantAccessResourceId = maybeParseIntFromPath(['params', 'tenantAccessResourceId'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantAccessResourceId }),
    'getTenantAccessPermissionsByTenantAccessResourceId',
    () => getTenantAccessPermissionsByTenantAccessResourceId(tenantAccessResourceId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/tenantAccessRoleId/123
router.get('/tenantAccessRoleId/:tenantAccessRoleId', ensureAuthorized, (req, res, next) => {
  const tenantAccessRoleId = maybeParseIntFromPath(['params', 'tenantAccessRoleId'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantAccessRoleId }),
    'getTenantAccessPermissionsByTenantAccessRoleId',
    () => getTenantAccessPermissionsByTenantAccessRoleId(tenantAccessRoleId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/public/check/some-uri/GET/123/123/123
router.get('/public/check/:uri/:method/:cloudUserId/:tenantId/:tenantOrganizationId', (req, res, next) => {
  const uri                  = atob(req.params.uri),
        method               = req.params.method,
        cloudUserId          = maybeParseIntFromPath(['params', 'cloudUserId'], req),
        tenantId             = maybeParseIntFromPath(['params', 'tenantId'], req),
        tenantOrganizationId = maybeParseIntFromPath(['params', 'tenantOrganizationId'], req),
        idOrNull             = R.when(R.anyPass([R.isNil, isNaN, R.equals('undefined')]), R.always(null));

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uri, method, cloudUserId, tenantId, tenantOrganizationId }),
    'checkTenantAccessPermission',
    () => checkTenantAccessPermission(uri, method, cloudUserId, idOrNull(tenantId), idOrNull(tenantOrganizationId))
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessPermission/id/123
router.delete('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'deleteTenantAccessPermission',
    () => deleteTenantAccessPermission(id)
  );
});

module.exports = router;
