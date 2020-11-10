'use strict';

const R        = require('ramda'),
      express  = require('express'),
      config   = require('config'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const MailSvc = require('../../services/mail/Mail')(config.mail.strategy);

const maybeParseIntFromPath     = require('../../controllers/api/_helpers/maybeParseIntFromPath'),
      maybeMergeTenantIdFromReq = require('../../controllers/api/_helpers/maybeMergeTenantIdFromReq');

const createTenantMember                      = require('../../controllers/api/tenantMember/createTenantMember'),
      enrollTenantMember                      = require('../../controllers/api/tenantMember/enrollTenantMember'),
      updateTenantMember                      = require('../../controllers/api/tenantMember/updateTenantMember'),
      deleteTenantMember                      = require('../../controllers/api/tenantMember/deleteTenantMember'),
      getTenantMemberById                     = require('../../controllers/api/tenantMember/getTenantMemberById'),
      getTenantMembersByTenantId              = require('../../controllers/api/tenantMember/getTenantMembersByTenantId'),
      getTenantMemberByTenantIdAndReferenceId = require('../../controllers/api/tenantMember/getTenantMemberByTenantIdAndReferenceId');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://sometenant.aliencreations.com/api/v1/tenantMember
router.post('/', ensureAuthorized, (req, res, next) => {
  const data                           = maybeMergeTenantIdFromReq(req, req.body),
        { tenant, tenantOrganization } = req;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenant, tenantOrganization }),
    'createTenantMember',
    () => createTenantMember({ tenant, tenantOrganization }, MailSvc, data)
  );
});

// https://sometenant.aliencreations.com/api/v1/tenantMember/enroll
router.post('/enroll', ensureAuthorized, (req, res, next) => {
  const data = maybeMergeTenantIdFromReq(req, req.body);
  const { tenant, tenantOrganization, headers : { origin } } = req;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenant, tenantOrganization }),
    'enrollTenantMember',
    () => enrollTenantMember({
      logger : req.logger.child({ tenant, tenantOrganization }),
      MailSvc
    })({ tenant, tenantOrganization }, origin, data)
  );
});

// https://sometenant.aliencreations.com/api/v1/tenantMember/id/123
router.put('/id/:id', ensureAuthorized, (req, res, next) => {
  const data = maybeMergeTenantIdFromReq(req, req.body),
        id   = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'updateTenantMember',
    () => updateTenantMember(data, id)
  );
});

// https://platform.aliencreations.com/api/v1/tenantMember/id/123
router.get('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'getTenantMemberById',
    () => getTenantMemberById(id)
  );
});

// https://gutfit.aliencreations.com/api/v1/tenantMembers
router.get('/', ensureAuthorized, (req, res, next) => {
  const tenantId = R.path(['tenant', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantId }),
    'getTenantMembersByTenantId',
    () => getTenantMembersByTenantId(tenantId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantMember/tenantId/123/referenceId/abc
router.get('/tenantId/:tenantId/referenceId/:referenceId', ensureAuthorized, (req, res, next) => {
  const referenceId = req.params.referenceId,
        tenantId    = maybeParseIntFromPath(['params', 'tenantId'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ referenceId, tenantId }),
    'getTenantMemberByTenantIdAndReferenceId',
    () => getTenantMemberByTenantIdAndReferenceId(tenantId, referenceId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantMember/id/123
router.delete('/id/:id', ensureAuthorized, (req, res, next) => {
  const id = maybeParseIntFromPath(['params', 'id'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ id }),
    'deleteTenantMember',
    () => deleteTenantMember(id)
  );
});

module.exports = router;
