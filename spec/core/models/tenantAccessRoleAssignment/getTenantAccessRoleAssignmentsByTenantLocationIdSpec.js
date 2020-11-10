'use strict';

const R = require('ramda');

const getTenantAccessRoleAssignmentsByTenantOrganizationId = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByTenantOrganizationId'),
      commonMocks                                          = require('../../../_helpers/commonMocks');

const KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_ID = 2;

describe('getTenantAccessRoleAssignmentsByTenantOrganizationId', () => {

  it('gets a list of tenantAccessRoleAssignments when given a tenantOrganizationId of type Number', done => {
    getTenantAccessRoleAssignmentsByTenantOrganizationId(KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(data.length > 0).toBe(true);
      done();
    });
  });

  it('throws an error when given a tenantOrganizationId of type String', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantOrganizationId('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantOrganizationId();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative tenantOrganizationId', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantOrganizationId(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantOrganizationId('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantOrganizationId', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantOrganizationId(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
