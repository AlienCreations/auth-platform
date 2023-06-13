'use strict';

const R                                    = require('ramda'),
      path                                 = require('path'),
      CSVConverter                         = require('csvtojson').Converter,
      cloudUsersConverter                  = new CSVConverter({}),
      tenantAccessRoleAssignmentsConverter = new CSVConverter({});

const createTenantAccessRoleAssignment = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/createTenantAccessRoleAssignment'),
      commonMocks                      = require('../../../_helpers/commonMocks');

const A_NEGATIVE_NUMBER = -10,
      STRING_ONE_CHAR   = 'a';

const FAKE_STATUS       = 1,
      FAKE_UNKNOWN_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
    KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID;

let fullTenantAccessRoleAssignmentDataForQuery,
    requiredTenantAccessRoleAssignmentDataForQuery,
    fullTenantAccessRoleAssignmentDataSwapIn;

const makeFakeTenantAccessRoleAssignmentData = (includeOptional) => {
  const fakeRequiredTenantAccessRoleAssignmentData = {
    tenantAccessRoleUuid : KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
    cloudUserUuid        : KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID
  };

  const fakeOptionalTenantAccessRoleAssignmentData = {
    status : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantAccessRoleAssignmentData, fakeRequiredTenantAccessRoleAssignmentData) : fakeRequiredTenantAccessRoleAssignmentData;
};


describe('createTenantAccessRoleAssignment', () => {
  beforeAll(done => {
    cloudUsersConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID = R.compose(R.prop('uuid'), R.last)(data);

      tenantAccessRoleAssignmentsConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
        KNOWN_TEST_TENANT_ACCESS_ROLE_UUID = R.compose(R.prop('tenantAccessRoleUuid'), R.last, commonMocks.transformDbColsToJsProps)(data);

        fullTenantAccessRoleAssignmentDataForQuery     = makeFakeTenantAccessRoleAssignmentData(true);
        requiredTenantAccessRoleAssignmentDataForQuery = makeFakeTenantAccessRoleAssignmentData(false);
        fullTenantAccessRoleAssignmentDataSwapIn       = commonMocks.override(fullTenantAccessRoleAssignmentDataForQuery);

        done();
      });
    });
  });

  it('creates a tenantAccessRoleAssignment record when given expected data for all fields', done => {
    createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('creates a tenantAccessRoleAssignment record when given expected data for only required fields', done => {
    createTenantAccessRoleAssignment(requiredTenantAccessRoleAssignmentDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // TENANT_ACCESS_ROLE_UUID
  it('throws an error when tenantAccessRoleUuid is malformed', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('tenantAccessRoleUuid', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessRoleUuid is missing', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('tenantAccessRoleUuid', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantAccessRoleUuid is not known', done => {
    createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('tenantAccessRoleUuid', FAKE_UNKNOWN_UUID))
      .then(done.fail)
      .catch(({ code }) => {
        expect(code).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
        done();
      });
  });

  // CLOUD_USER_UUID
  it('throws an error when cloudUserUuid is malformed', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('cloudUserUuid', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when cloudUserUuid is missing', () => {
    expect(() => {
      createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('cloudUserUuid', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when cloudUserUuid is not known', done => {
    createTenantAccessRoleAssignment(fullTenantAccessRoleAssignmentDataSwapIn('cloudUserUuid', FAKE_UNKNOWN_UUID))
      .then(done.fail)
      .catch(({ code }) => {
        expect(code).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
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
