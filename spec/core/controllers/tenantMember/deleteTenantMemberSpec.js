'use strict';

const commonMocks        = require('../../../_helpers/commonMocks'),
      deleteTenantMember = require('../../../../server/core/controllers/api/tenantMember/deleteTenantMember');

const KNOWN_TEST_TENANT_MEMBER_ID   = 1,
      FAKE_UNKNOWN_TENANT_MEMBER_ID = 999;

describe('tenantMemberCtrl.deleteTenantMember', () => {

  it('successfully deletes an tenantMember', done => {
    deleteTenantMember(KNOWN_TEST_TENANT_MEMBER_ID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      });
  });

  it('throws an error when attempting to delete an tenantMember that is not in the database', done => {
    deleteTenantMember(FAKE_UNKNOWN_TENANT_MEMBER_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantMember with no params', done => {
    deleteTenantMember()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantMember with null params', done => {
    deleteTenantMember(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
