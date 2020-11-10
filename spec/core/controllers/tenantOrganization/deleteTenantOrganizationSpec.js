'use strict';

const commonMocks              = require('../../../_helpers/commonMocks'),
      deleteTenantOrganization = require('../../../../server/core/controllers/api/tenantOrganization/deleteTenantOrganization');

const KNOWN_TEST_TENANT_ORGANIZATION_ID     = 1,
      FAKE_UNKNOWN_TENANT_ORGANIZATION_ID   = 999,
      FAKE_MALFORMED_TENANT_ORGANIZATION_ID = 'foo';

describe('tenantOrganizationCtrl.deleteTenantOrganization', () => {

  it('successfully deletes an tenantOrganization', done => {
    deleteTenantOrganization(KNOWN_TEST_TENANT_ORGANIZATION_ID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      });
  });

  it('throws an error when attempting to delete an tenantOrganization that is not in the database', done => {
    deleteTenantOrganization(FAKE_UNKNOWN_TENANT_ORGANIZATION_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantOrganization with null params', done => {
    deleteTenantOrganization(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantOrganization with a malformed id', done => {
    deleteTenantOrganization(FAKE_MALFORMED_TENANT_ORGANIZATION_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantOrganization with no params', done => {
    deleteTenantOrganization()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
