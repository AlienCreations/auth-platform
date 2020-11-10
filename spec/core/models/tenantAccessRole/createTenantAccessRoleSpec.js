'use strict';

const R = require('ramda');

const createTenantAccessRole = require('../../../../server/core/models/tenantAccessRole/methods/createTenantAccessRole'),
      commonMocks            = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER          = 1337,
      A_NEGATIVE_NUMBER          = -10,
      STRING_ONE_CHAR            = 'a',
      STRING_THREE_HUNDRED_CHARS = '*'.repeat(300);

const FAKE_STATUS                       = 1,
      FAKE_UNKNOWN_ID                   = 9999,
      KNOWN_TEST_TENANT_ID              = 2,
      KNOWN_TEST_TENANT_ORGANIZATION_ID = 2,
      FAKE_TITLE                        = 'new-test-role';

const makeFakeTenantAccessRoleData = (includeOptional) => {
  const fakeRequiredTenantAccessRoleData = {
    tenantId             : KNOWN_TEST_TENANT_ID,
    tenantOrganizationId : KNOWN_TEST_TENANT_ORGANIZATION_ID,
    title                : FAKE_TITLE
  };

  const fakeOptionalTenantAccessRoleData = {
    status : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantAccessRoleData, fakeRequiredTenantAccessRoleData) : fakeRequiredTenantAccessRoleData;
};

const fullTenantAccessRoleDataForQuery     = makeFakeTenantAccessRoleData(true),
      requiredTenantAccessRoleDataForQuery = makeFakeTenantAccessRoleData(false);

const fullTenantAccessRoleDataSwapIn = commonMocks.override(fullTenantAccessRoleDataForQuery);

describe('createTenantAccessRole', () => {

  it('creates a tenantAccessRole record when given expected data for all fields', done => {
    createTenantAccessRole(fullTenantAccessRoleDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('creates a tenantAccessRole record when given expected data for only required fields', done => {
    createTenantAccessRole(requiredTenantAccessRoleDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // TITLE
  it('throws an error when title is missing', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('title', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('title', A_POSITIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when title is too long', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('title', STRING_THREE_HUNDRED_CHARS));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TENANT_ID
  it('throws an error when tenantId is malformed', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantId', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantId is negative', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantId', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantId is missing', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantId', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantId is not known', done => {
    createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantId', FAKE_UNKNOWN_ID)).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  // TENANT_ORGANIZATION_ID
  it('throws an error when tenantOrganizationId is malformed', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantOrganizationId', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantOrganizationId is negative', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantOrganizationId', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantOrganizationId is not known', done => {
    createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantOrganizationId', FAKE_UNKNOWN_ID)).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  // STATUS
  it('throws an error when status is not a positive number', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('status', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when status is negative', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('status', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
