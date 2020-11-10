'use strict';

const R        = require('ramda'),
      config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanEdit         = require('../../controllers/api/_helpers/ensureCanEdit');

const createTenantAccessRoleAssignment                     = require('../../controllers/api/tenantAccessRoleAssignment/createTenantAccessRoleAssignment'),
      updateTenantAccessRoleAssignment                     = require('../../controllers/api/tenantAccessRoleAssignment/updateTenantAccessRoleAssignment'),
      deleteTenantAccessRoleAssignment                     = require('../../controllers/api/tenantAccessRoleAssignment/deleteTenantAccessRoleAssignment'),
      getTenantAccessRoleAssignmentById                    = require('../../controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentById'),
      getTenantAccessRoleAssignmentsByTenantOrganizationId = require('../../controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByTenantOrganizationId'),
      getTenantAccessRoleAssignmentsByCloudUserId          = require('../../controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByCloudUserId'),
      getTenantAccessRoleAssignmentsByTenantAccessRoleId   = require('../../controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByTenantAccessRoleId');

const _getTenantAccessRoleAssignmentById = require('../../models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentById');

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

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment/id/123
router.put('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  _getTenantAccessRoleAssignmentById(id)
    .then(ensureCanEdit(req))
    .then(() => {
      apiUtils.respondWithErrorHandling(
        req,
        res,
        next,
        req.logger.child({ id }),
        'updateTenantAccessRoleAssignment',
        () => updateTenantAccessRoleAssignment(req.body, id)
      );
    })
    .catch(err => {
      apiUtils.respondWithErrorHandling(
        req,
        res,
        next,
        req.logger.child({ id }),
        'updateTenantAccessRoleAssignment',
        () => {
          throw err;
        }
      );
    });
});

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment/id/123
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getTenantAccessRoleAssignmentById',
    () => getTenantAccessRoleAssignmentById(id)
  );
});


// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment
router.get('/', ensureAuthorized, (req, res, next) => {
  const tenantOrganizationId = R.path(['tenantOrganization', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantOrganizationId }),
    'getTenantAccessRoleAssignmentsByTenantOrganizationId',
    () => getTenantAccessRoleAssignmentsByTenantOrganizationId(tenantOrganizationId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment/cloudUserId/123
router.get('/cloudUserId/:cloudUserId', ensureAuthorized, (req, res, next) => {
  const cloudUserId = maybeParseIntFromPath(['params', 'cloudUserId'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ cloudUserId }),
    'getTenantAccessRoleAssignmentsByCloudUserId',
    () => getTenantAccessRoleAssignmentsByCloudUserId(cloudUserId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment/tenantAccessRoleId/123
router.get('/tenantAccessRoleId/:tenantAccessRoleId', ensureAuthorized, (req, res, next) => {
  const tenantAccessRoleId = maybeParseIntFromPath(['params', 'tenantAccessRoleId'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantAccessRoleId }),
    'getTenantAccessRoleAssignmentsByTenantAccessRoleId',
    () => getTenantAccessRoleAssignmentsByTenantAccessRoleId(tenantAccessRoleId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessRoleAssignment/id/123
router.delete('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'deleteTenantAccessRoleAssignment',
    () => deleteTenantAccessRoleAssignment(id)
  );
});

module.exports = router;
