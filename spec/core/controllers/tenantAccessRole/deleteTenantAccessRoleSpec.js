'use strict';

const commonMocks            = require('../../../_helpers/commonMocks'),
      deleteTenantAccessRole = require('../../../../server/core/controllers/api/tenantAccessRole/deleteTenantAccessRole');

const KNOWN_TEST_TENANT_ACCESS_ROLE_ID   = 1,
      FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ID = 999;

describe('tenantAccessRoleCtrl.deleteTenantAccessRole', () => {

  it('successfully deletes an tenantAccessRole', done => {
    deleteTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_ID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      });
  });

  it('throws an error when attempting to delete an tenantAccessRole that is not in the database', done => {
    deleteTenantAccessRole(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessRole with no params', done => {
    deleteTenantAccessRole()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessRole with null params', done => {
    deleteTenantAccessRole(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
