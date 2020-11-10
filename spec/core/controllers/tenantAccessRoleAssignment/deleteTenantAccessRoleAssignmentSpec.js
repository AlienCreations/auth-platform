'use strict';

const commonMocks                      = require('../../../_helpers/commonMocks'),
      deleteTenantAccessRoleAssignment = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/deleteTenantAccessRoleAssignment');

const KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_ID   = 1,
      FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ASSIGNMENT_ID = 999;

describe('tenantAccessRoleAssignmentCtrl.deleteTenantAccessRoleAssignment', () => {

  it('successfully deletes an tenantAccessRoleAssignment', done => {
    deleteTenantAccessRoleAssignment(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_ID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      });
  });

  it('throws an error when attempting to delete an tenantAccessRoleAssignment that is not in the database', done => {
    deleteTenantAccessRoleAssignment(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ASSIGNMENT_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessRoleAssignment with no params', done => {
    deleteTenantAccessRoleAssignment()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessRoleAssignment with null params', done => {
    deleteTenantAccessRoleAssignment(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
