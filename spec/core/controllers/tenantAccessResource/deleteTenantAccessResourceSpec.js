'use strict';

const commonMocks                = require('../../../_helpers/commonMocks'),
      deleteTenantAccessResource = require('../../../../server/core/controllers/api/tenantAccessResource/deleteTenantAccessResource');

const KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID   = 1,
      FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_ID = 999;

describe('tenantAccessResourceCtrl.deleteTenantAccessResource', () => {

  it('successfully deletes an tenantAccessResource', done => {
    deleteTenantAccessResource(KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      });
  });

  it('throws an error when attempting to delete an tenantAccessResource that is not in the database', done => {
    deleteTenantAccessResource(FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessResource with no params', done => {
    deleteTenantAccessResource()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessResource with null params', done => {
    deleteTenantAccessResource(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
