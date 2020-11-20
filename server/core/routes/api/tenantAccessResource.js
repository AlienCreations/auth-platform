'use strict';

const R        = require('ramda'),
      config   = require('config'),
      express  = require('express'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const maybeParseIntFromPath       = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      ensureCanActOnBehalfOfOwner = require('../../middleware/ensureCanActOnBehalfOfOwner');

const createTenantAccessResource             = require('../../controllers/api/tenantAccessResource/createTenantAccessResource'),
      updateTenantAccessResource             = require('../../controllers/api/tenantAccessResource/updateTenantAccessResource'),
      deleteTenantAccessResource             = require('../../controllers/api/tenantAccessResource/deleteTenantAccessResource'),
      getAllowedTenantAccessResources        = require('../../controllers/api/tenantAccessResource/getAllowedTenantAccessResources'),
      getTenantAccessResourceById            = require('../../controllers/api/tenantAccessResource/getTenantAccessResourceById'),
      getTenantAccessResourcesByIds          = require('../../controllers/api/tenantAccessResource/getTenantAccessResourcesByIds'),
      getTenantAccessResourceByKey           = require('../../controllers/api/tenantAccessResource/getTenantAccessResourceByKey'),
      getTenantAccessResourcesByUriAndMethod = require('../../controllers/api/tenantAccessResource/getTenantAccessResourcesByUriAndMethod');

const _getTenantAccessResourceById = require('../../models/tenantAccessResource/methods/getTenantAccessResourceById');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://platform.aliencreations.com/api/v1/tenantAccessResource
router.post('/', ensureAuthorized, (req, res, next) => {
  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({}),
    'createTenantAccessResource',
    () => createTenantAccessResource(req.body)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource/id/123
router.put(
  '/id/:id',
  ensureAuthorized,
  ensureCanActOnBehalfOfOwner({
    getDataById     : _getTenantAccessResourceById,
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
      'updateTenantAccessResource',
      () => updateTenantAccessResource(req.body, id)
    );
  }
);

// https://platform.aliencreations.com/api/v1/tenantAccessResource/id/123
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getTenantAccessResourceById',
    () => getTenantAccessResourceById(id)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource/ids
router.post('/ids', ensureAuthorized, (req, res, next) => {
  const ids = req.body.ids;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ ids }),
    'getTenantAccessResourcesByIds',
    () => getTenantAccessResourcesByIds(ids)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource/key/foo
router.get('/key/:key', ensureAuthorized, (req, res, next) => {
  const key = R.path(['params', 'key'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ key }),
    'getTenantAccessResourceByKey',
    () => getTenantAccessResourceByKey(key)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource/uri/some-uri/method/POST
router.get('/uri/:uri/method/:method', ensureAuthorized, (req, res, next) => {
  const uri    = R.path(['params', 'uri'], req),
        method = R.path(['params', 'method'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uri, method }),
    'getTenantAccessResourcesByUriAndMethod',
    () => getTenantAccessResourcesByUriAndMethod(uri, method)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource
router.get('/', ensureAuthorized, (req, res, next) => {
  const tenantOrganizationId = R.path(['tenantOrganization', 'id'], req),
        tenantId             = R.path(['tenant', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantOrganizationId, tenantId }),
    'getAllowedTenantAccessResources',
    () => getAllowedTenantAccessResources(tenantId, tenantOrganizationId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantAccessResource/id/123
router.delete('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'deleteTenantAccessResource',
    () => deleteTenantAccessResource(id)
  );
});

module.exports = router;
