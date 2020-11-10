'use strict';

const commonMocks                  = require('../../../_helpers/commonMocks'),
      deleteTenantAccessPermission = require('../../../../server/core/controllers/api/tenantAccessPermission/deleteTenantAccessPermission');

const KNOWN_TEST_TENANT_ACCESS_PERMISSION_ID   = 1,
      FAKE_UNKNOWN_TENANT_ACCESS_PERMISSION_ID = 999;

describe('tenantAccessPermissionCtrl.deleteTenantAccessPermission', () => {

  it('successfully deletes an tenantAccessPermission', done => {
    deleteTenantAccessPermission(KNOWN_TEST_TENANT_ACCESS_PERMISSION_ID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      });
  });

  it('throws an error when attempting to delete an tenantAccessPermission that is not in the database', done => {
    deleteTenantAccessPermission(FAKE_UNKNOWN_TENANT_ACCESS_PERMISSION_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessPermission with no params', done => {
    deleteTenantAccessPermission()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessPermission with null params', done => {
    deleteTenantAccessPermission(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
