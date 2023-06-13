'use strict';

const R        = require('ramda'),
      config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createTenantOrganization                      = require('../../controllers/api/tenantOrganization/createTenantOrganization'),
      updateTenantOrganization                      = require('../../controllers/api/tenantOrganization/updateTenantOrganization'),
      deleteTenantOrganization                      = require('../../controllers/api/tenantOrganization/deleteTenantOrganization'),
      getTenantOrganizationByUuid                   = require('../../controllers/api/tenantOrganization/getTenantOrganizationByUuid'),
      getTenantOrganizationsByTenantUuid            = require('../../controllers/api/tenantOrganization/getTenantOrganizationsByTenantUuid'),
      getTenantOrganizationByTenantUuidAndSubdomain = require('../../controllers/api/tenantOrganization/getTenantOrganizationByTenantUuidAndSubdomain');

const _getTenantOrganizationByUuid = require('../../models/tenantOrganization/methods/getTenantOrganizationByUuid');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/tenantOrganization
router.post('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createTenantOrganization',
    () => createTenantOrganization(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/tenantOrganization/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put(
  '/uuid/:uuid',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataByUuid     : _getTenantOrganizationByUuid,
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
      'updateTenantOrganization',
      () => updateTenantOrganization(req.body, uuid)
    );
  }
);

// https://platform.aliencreations.com/api/v1/tenantOrganization/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getTenantOrganizationByUuid',
    () => getTenantOrganizationByUuid(uuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantOrganization/tenantUuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/tenantUuid/:tenantUuid', ensureAuthorized, (req, res, next) => {
  const { tenantUuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantUuid }),
    'getTenantOrganizationsByTenantUuid',
    () => getTenantOrganizationsByTenantUuid(tenantUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenant/domain/lifetimefitness
router.get('/public/tenantUuid/:tenantUuid/subdomain/:subdomain', (req, res, next) => {
  const { tenantUuid, subdomain } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantUuid, subdomain }),
    'getTenantOrganizationByTenantUuidAndSubdomain',
    () => getTenantOrganizationByTenantUuidAndSubdomain(tenantUuid, subdomain).then(R.pick(config.api.TENANT_ORGANIZATION_PUBLIC_FIELDS))
  );
});

// https://platform.aliencreations.com/api/v1/tenant/domain/lifetimefitness
router.get('/tenantUuid/:tenantUuid/subdomain/:subdomain', ensureAuthorized, (req, res, next) => {
  const { tenantUuid, subdomain } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantUuid, subdomain }),
    'getTenantOrganizationByTenantUuidAndSubdomain',
    () => getTenantOrganizationByTenantUuidAndSubdomain(tenantUuid, subdomain)
  );
});

// https://platform.aliencreations.com/api/v1/tenantOrganization/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.delete('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'deleteTenantOrganization',
    () => deleteTenantOrganization(uuid)
  );
});

module.exports = router;
