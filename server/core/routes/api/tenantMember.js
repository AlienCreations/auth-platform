'use strict';

const R        = require('ramda'),
      express  = require('express'),
      config   = require('config'),
      router   = express.Router(),
      apiUtils = require('../../utils/api');

const MailSvc = require('../../services/mail/Mail')(config.mail.strategy);

const maybeMergeTenantUuidFromReq = require('../../controllers/api/_helpers/maybeMergeTenantUuidFromReq');

const createTenantMember                          = require('../../controllers/api/tenantMember/createTenantMember'),
      enrollTenantMember                          = require('../../controllers/api/tenantMember/enrollTenantMember'),
      updateTenantMember                          = require('../../controllers/api/tenantMember/updateTenantMember'),
      deleteTenantMember                          = require('../../controllers/api/tenantMember/deleteTenantMember'),
      getTenantMemberByUuid                       = require('../../controllers/api/tenantMember/getTenantMemberByUuid'),
      getTenantMembersByTenantUuid                = require('../../controllers/api/tenantMember/getTenantMembersByTenantUuid'),
      getTenantMemberByTenantUuidAndReferenceUuid = require('../../controllers/api/tenantMember/getTenantMemberByTenantUuidAndReferenceUuid');

const { ensureAuthorized } = require('@aliencreations/node-authenticator')(config.auth.strategy);

// https://sometenant.aliencreations.com/api/v1/tenantMember
router.post('/', ensureAuthorized, (req, res, next) => {
  const data                           = maybeMergeTenantUuidFromReq(req, req.body),
        { tenant, tenantOrganization } = req;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenant, tenantOrganization }),
    'createTenantMember',
    () => createTenantMember({ MailSvc })({ tenant, tenantOrganization }, data)
  );
});

// https://sometenant.aliencreations.com/api/v1/tenantMember/enroll
router.post('/enroll', ensureAuthorized, (req, res, next) => {
  const data                                                 = maybeMergeTenantUuidFromReq(req, req.body);
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

// https://sometenant.aliencreations.com/api/v1/tenantMember/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.put('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const data     = maybeMergeTenantUuidFromReq(req, req.body),
        { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'updateTenantMember',
    () => updateTenantMember(data, uuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantMember/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.get('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'getTenantMemberByUuid',
    () => getTenantMemberByUuid(uuid)
  );
});

// https://gutfit.aliencreations.com/api/v1/tenantMembers
router.get('/', ensureAuthorized, (req, res, next) => {
  const tenantUuid = R.path(['tenant', 'uuid'], req);

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ tenantUuid }),
    'getTenantMembersByTenantUuid',
    () => getTenantMembersByTenantUuid(tenantUuid)
  );
});

// https://platform.aliencreations.com/api/v1/tenantMember/tenantUuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378/referenceId/abc
router.get('/tenantUuid/:tenantUuid/referenceId/:referenceId', ensureAuthorized, (req, res, next) => {
  const { tenantUuid, referenceId } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ referenceId, tenantUuid }),
    'getTenantMemberByTenantUuidAndReferenceUuid',
    () => getTenantMemberByTenantUuidAndReferenceUuid(tenantUuid, referenceId)
  );
});

// https://platform.aliencreations.com/api/v1/tenantMember/uuid/3aee202d-0e54-4a0c-a7d2-a0d9976a0378
router.delete('/uuid/:uuid', ensureAuthorized, (req, res, next) => {
  const { uuid } = req.params;

  apiUtils.respondWithErrorHandling(
    req,
    res,
    next,
    req.logger.child({ uuid }),
    'deleteTenantMember',
    () => deleteTenantMember(uuid)
  );
});

module.exports = router;
