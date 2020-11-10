'use strict';

const R = require('ramda');

const createTenantAccessPermission = require('../../../../server/core/models/tenantAccessPermission/methods/createTenantAccessPermission'),
      commonMocks                  = require('../../../_helpers/commonMocks');

const A_NEGATIVE_NUMBER = -10,
      STRING_ONE_CHAR   = 'a';

const FAKE_STATUS                                   = 1,
      FAKE_UNKNOWN_ID                               = 9999,
      KNOWN_TEST_TENANT_ACCESS_ROLE_ID              = 2,
      KNOWN_TEST_UNMAPPED_TENANT_ACCESS_RESOURCE_ID = 4;

const makeFakeTenantAccessPermissionData = (includeOptional) => {
  const fakeRequiredTenantAccessPermissionData = {
    tenantAccessRoleId     : KNOWN_TEST_TENANT_ACCESS_ROLE_ID,
    tenantAccessResourceId : KNOWN_TEST_UNMAPPED_TENANT_ACCESS_RESOURCE_ID
  };

  const fakeOptionalTenantAccessPermissionData = {
    status : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantAccessPermissionData, fakeRequiredTenantAccessPermissionData) : fakeRequiredTenantAccessPermissionData;
};

const fullTenantAccessPermissionDataForQuery     = makeFakeTenantAccessPermissionData(true),
      requiredTenantAccessPermissionDataForQuery = makeFakeTenantAccessPermissionData(false);

const fullTenantAccessPermissionDataSwapIn = commonMocks.override(fullTenantAccessPermissionDataForQuery);

describe('createTenantAccessPermission', () => {

  it('creates a tenantAccessPermission record when given expected data for all fields', done => {
    createTenantAccessPermission(fullTenantAccessPermissionDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('creates a tenantAccessPermission record when given expected data for only required fields', done => {
    createTenantAccessPermission(requiredTenantAccessPermissionDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // TENANT_ACCESS_ROLE_ID
  it('throws an error when tenantAccessRoleId is malformed', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessRoleId', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessRoleId is negative', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessRoleId', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessRoleId is missing', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessRoleId', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantAccessRoleId is not known', done => {
    createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessRoleId', FAKE_UNKNOWN_ID)).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  // TENANT_ACCESS_RESOURCE_ID
  it('throws an error when tenantAccessResourceId is malformed', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessResourceId', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessResourceId is negative', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessResourceId', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessResourceId is missing', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessResourceId', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantAccessResourceId is not known', done => {
    createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessResourceId', FAKE_UNKNOWN_ID)).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  // STATUS
  it('throws an error when status is not a positive number', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('status', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when status is negative', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('status', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
