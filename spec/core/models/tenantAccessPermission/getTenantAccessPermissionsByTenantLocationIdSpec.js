'use strict';

const R = require('ramda');

const getTenantAccessPermissionsByTenantOrganizationId = require('../../../../server/core/models/tenantAccessPermission/methods/getTenantAccessPermissionsByTenantOrganizationId'),
      commonMocks                                      = require('../../../_helpers/commonMocks');

const KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_ID = 2;

describe('getTenantAccessPermissionsByTenantOrganizationId', () => {

  it('gets a list of tenantAccessPermissions when given a tenantOrganizationId of type Number', done => {
    getTenantAccessPermissionsByTenantOrganizationId(KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(data.length > 0).toBe(true);
      done();
    });
  });

  it('throws an error when given a tenantOrganizationId of type String', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantOrganizationId('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantOrganizationId();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative tenantOrganizationId', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantOrganizationId(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantOrganizationId('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantOrganizationId', () => {
    expect(() => {
      getTenantAccessPermissionsByTenantOrganizationId(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
