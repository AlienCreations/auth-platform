'use strict';

const R        = require('ramda'),
      config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanEdit         = require('../../controllers/api/_helpers/ensureCanEdit');

const createTenantOrganization                    = require('../../controllers/api/tenantOrganization/createTenantOrganization'),
      updateTenantOrganization                    = require('../../controllers/api/tenantOrganization/updateTenantOrganization'),
      deleteTenantOrganization                    = require('../../controllers/api/tenantOrganization/deleteTenantOrganization'),
      getTenantOrganizationById                   = require('../../controllers/api/tenantOrganization/getTenantOrganizationById'),
      getTenantOrganizationsByTenantId            = require('../../controllers/api/tenantOrganization/getTenantOrganizationsByTenantId'),
      getTenantOrganizationByTenantIdAndSubdomain = require('../../controllers/api/tenantOrganization/getTenantOrganizationByTenantIdAndSubdomain');

const _getTenantOrganizationById = require('../../models/tenantOrganization/methods/getTenantOrganizationById');

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

// https://platform.aliencreations.com/api/v1/tenantOrganization/id/123
router.put('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  _getTenantOrganizationById(id)
    .then(ensureCanEdit(req))
    .then(() => {
      apiUtils.respondWithErrorHandling(
        req,
        res,
        next,
        req.logger.child({ id }),
        'updateTenantOrganization',
        () => updateTenantOrganization(req.body, id)
      );
    })
    .catch(err => {
      apiUtils.respondWithErrorHandling(
        req,
        res,
        next,
        req.logger.child({ id }),
        'updateTenantOrganization',
        () => {
          throw err;
        }
      );
    });
});

// https://platform.aliencreations.com/api/v1/tenantOrganization/id/123
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getTenantOrganizationById',
    () => getTenantOrganizationById(id)
  );
});

// https://platform.aliencreations.com/api/v1/tenantOrganization/tenantId/123
router.get('/tenantId/:tenantId', ensureAuthorized, (req, res, next) => {
  const tenantId = maybeParseIntFromPath(['params', 'tenantId'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantId }),
    'getTenantOrganizationsByTenantId',
    () => getTenantOrganizationsByTenantId(tenantId)
  );
});

// https://platform.aliencreations.com/api/v1/tenant/domain/lifetimefitness
router.get('/public/tenantId/:tenantId/subdomain/:subdomain', (req, res, next) => {
  const tenantId  = maybeParseIntFromPath(['params', 'tenantId'], req),
        subdomain = req.params.subdomain;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantId, subdomain }),
    'getTenantOrganizationByTenantIdAndSubdomain',
    () => getTenantOrganizationByTenantIdAndSubdomain(tenantId, subdomain).then(R.pick(config.api.TENANT_ORGANIZATION_PUBLIC_FIELDS))
  );
});

// https://platform.aliencreations.com/api/v1/tenant/domain/lifetimefitness
router.get('/tenantId/:tenantId/subdomain/:subdomain', ensureAuthorized, (req, res, next) => {
  const tenantId  = maybeParseIntFromPath(['params', 'tenantId'], req),
        subdomain = req.params.subdomain;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantId, subdomain }),
    'getTenantOrganizationByTenantIdAndSubdomain',
    () => getTenantOrganizationByTenantIdAndSubdomain(tenantId, subdomain)
  );
});

// https://platform.aliencreations.com/api/v1/public/tenant/domain/lifetimefitness
router.get('/public/tenantId/:tenantId/subdomain/:subdomain', (req, res, next) => {
  const tenantId  = maybeParseIntFromPath(['params', 'tenantId'], req),
        subdomain = req.params.subdomain;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantId, subdomain }),
    'getTenantOrganizationByTenantIdAndSubdomain',
    () => getTenantOrganizationByTenantIdAndSubdomain(tenantId, subdomain).then(R.pick(config.api.TENANT_ORGANIZATION_PUBLIC_FIELDS))
  );
});

// https://platform.aliencreations.com/api/v1/tenantOrganization/id/123
router.delete('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'deleteTenantOrganization',
    () => deleteTenantOrganization(id)
  );
});

module.exports = router;
