'use strict';

const { errors } = require('@aliencreations/node-error');

const ensureCanActOnBehalfOfOwner  = require('../../../server/core/middleware/ensureCanActOnBehalfOfOwner'),
      { maybeRejectOrResolveWith } = require('../../../server/core/utils/promise');

const KNOWN_TEST_SUPER_ADMIN_ROLE_ID = 1;

const FAKE_RECORD_ID       = 1234,
      FAKE_TENANT_ID_FOO   = 1,
      FAKE_TENANT_ID_BAR   = 2,
      FAKE_REQ_SUPER_ADMIN = { params : { id : FAKE_RECORD_ID }, user : { roles : [KNOWN_TEST_SUPER_ADMIN_ROLE_ID] } },
      FAKE_REQ_OWNER       = { params : { id : FAKE_RECORD_ID }, tenant : { id : FAKE_TENANT_ID_FOO } },
      FAKE_REQ_DEFAULT     = { body : { id : FAKE_RECORD_ID }, tenant : { id : FAKE_TENANT_ID_FOO } },
      FAKE_REQ_NOT_OWNER   = { params : { id : FAKE_RECORD_ID }, tenant : { id : FAKE_TENANT_ID_BAR } },
      FAKE_RES             = {},
      FAKE_NEXT            = maybeRejectOrResolveWith(),
      FAKE_GET             = id => Promise.resolve({ id, tenantId : FAKE_TENANT_ID_FOO });

describe('ensureCanActOnBehalfOfOwner', () => {
  it('allows permission if ownership identity verified', done => {
    new Promise((resolve, reject) => {
      ensureCanActOnBehalfOfOwner({
        getDataById     : FAKE_GET,
        dataIdPath      : ['params', 'id'],
        dataOwnerIdPath : ['tenantId'],
        identityPath    : ['tenant', 'id']
      })(FAKE_REQ_OWNER, FAKE_RES, FAKE_NEXT(resolve, reject));
    })
      .then(done)
      .catch(done.fail);
  });

  it('defaults to some data identity paths', done => {
    new Promise((resolve, reject) => {
      ensureCanActOnBehalfOfOwner({
        getDataById : FAKE_GET
      })(FAKE_REQ_DEFAULT, FAKE_RES, FAKE_NEXT(resolve, reject));
    })
      .then(done)
      .catch(done.fail);
  });

  it('allows permission if user is super admin', done => {
    new Promise((resolve, reject) => {
      ensureCanActOnBehalfOfOwner({
        getDataById     : FAKE_GET,
        dataIdPath      : ['params', 'id'],
        dataOwnerIdPath : ['tenantId'],
        identityPath    : ['tenant', 'id']
      })(FAKE_REQ_SUPER_ADMIN, FAKE_RES, FAKE_NEXT(resolve, reject));
    })
      .then(done)
      .catch(done.fail);
  });

  it('calls next with an authorization error if ownership not verified', done => {
    new Promise((resolve, reject) => {
      ensureCanActOnBehalfOfOwner({
        getDataById     : FAKE_GET,
        dataIdPath      : ['params', 'id'],
        dataOwnerIdPath : ['tenantId'],
        identityPath    : ['tenant', 'id']
      })(FAKE_REQ_NOT_OWNER, FAKE_RES, FAKE_NEXT(resolve, reject));
    })
      .then(done.fail)
      .catch(err => {
        expect(err.code).toEqual(errors.auth.FORBIDDEN_API_ACCESS().code);
        done();
      });
  });

  it('calls next with an error if the middleware fails', done => {
    new Promise((resolve, reject) => {
      ensureCanActOnBehalfOfOwner({
        getDataById : () => { throw new Error('foo'); }
      })(FAKE_REQ_OWNER, FAKE_RES, FAKE_NEXT(resolve, reject));
    })
      .then(done.fail)
      .catch(err => {
        expect(err.message).toBe('foo');
        done();
      });
  });
});
