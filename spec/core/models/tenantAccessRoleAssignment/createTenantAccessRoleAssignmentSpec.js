'use strict';

const R = require('ramda');

const createTenantAccessRoleAssignment = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/createTenantAccessRoleAssignment'),
      commonMocks        = require('../../../_helpers/commonMocks');

const A_NEGATIVE_NUMBER = -10,
      STRING_ONE_CHAR   = 'a';

const FAKE_STATUS                       = 1,
      FAKE_UNKNOWN_ID                   = 9999,
      KNOWN_TEST_TENANT_ACCESS_ROLE_ID  = 2,
      KNOWN_TEST_UNMAPPED_CLOUD_USER_ID = 4;

const makeFakeTenantAccessRoleAssignmentData = (includeOptional) => {
  const fakeRequiredTenantAccessRoleAssignmentData = {
    tenantAccessRoleId : KNOWN_TEST_TENANT_ACCESS_ROLE_ID,
    cloudUserId        : KNOWN_TEST_UNMAPPED_CLOUD_USER_ID
  };

  const fakeOptionalTenantAccessRoleAssignmentData = {
    status : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantAccessRoleAssignmentData, fakeRequiredTenantAccessRoleAssignmentData) : fakeRequiredTenantAccessRoleAssignmentData;
};

const fullTenantAccessRoleAssignmentDataForQuery     = makeFakeTenantAccessRoleAssignmentData(true),
      requiredTenantAccessRoleAssignmentDataForQuery = makeFakeTenantAccessRoleAssignmentData(false);

const fullTenantAccessRoleAssignmentDataSwapIn = commonMocks.override(fullTenantAccessRoleAssignmentDataForQuery);

describe('createTenantAccessRoleAssignment', () => {

  it('creates a tenantAccessRoleAssignment record when given expected data for all fields', done => {
    createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('creates a tenantAccessRoleAssignment record when given expected data for only required fields', done => {
    createTenantAccessRoleAssignment(requiredTenantAccessRoleAssignmentDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // TENANT_ACCESS_ROLE_ID
  it('throws an error when tenantAccessRoleId is malformed', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('tenantAccessRoleId', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessRoleId is negative', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('tenantAccessRoleId', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessRoleId is missing', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('tenantAccessRoleId', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantAccessRoleId is not known', done => {
    createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('tenantAccessRoleId', FAKE_UNKNOWN_ID)).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  // CLOUD_USER_ID
  it('throws an error when cloudUserId is malformed', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('cloudUserId', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when cloudUserId is negative', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('cloudUserId', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when cloudUserId is missing', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('cloudUserId', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when cloudUserId is not known', done => {
    createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('cloudUserId', FAKE_UNKNOWN_ID)).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  // STATUS
  it('throws an error when status is not a positive number', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('status', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when status is negative', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('status', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
