'use strict';

const R                              = require('ramda'),
      path                           = require('path'),
      CSVConverter                   = require('csvtojson').Converter,
      tenantAccessRolesConverter     = new CSVConverter({}),
      tenantAccessResourcesConverter = new CSVConverter({});

const createTenantAccessPermission = require('../../../../server/core/models/tenantAccessPermission/methods/createTenantAccessPermission'),
      commonMocks                  = require('../../../_helpers/commonMocks');

const A_NEGATIVE_NUMBER = -10,
      STRING_ONE_CHAR   = 'a';

const FAKE_STATUS       = 1,
      FAKE_UNKNOWN_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
    KNOWN_TEST_UNMAPPED_TENANT_ACCESS_RESOURCE_UUID,
    fullTenantAccessPermissionDataForQuery,
    requiredTenantAccessPermissionDataForQuery,
    fullTenantAccessPermissionDataSwapIn;

const makeFakeTenantAccessPermissionData = (includeOptional) => {
  const fakeRequiredTenantAccessPermissionData = {
    tenantAccessRoleUuid     : KNOWN_TEST_TENANT_ACCESS_ROLE_UUID,
    tenantAccessResourceUuid : KNOWN_TEST_UNMAPPED_TENANT_ACCESS_RESOURCE_UUID
  };

  const fakeOptionalTenantAccessPermissionData = {
    status : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantAccessPermissionData, fakeRequiredTenantAccessPermissionData) : fakeRequiredTenantAccessPermissionData;
};


describe('createTenantAccessPermission', () => {
  beforeAll(done => {
    tenantAccessRolesConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_ROLE_UUID = data[1].uuid;

      tenantAccessResourcesConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
        KNOWN_TEST_UNMAPPED_TENANT_ACCESS_RESOURCE_UUID = R.compose(R.prop('uuid'), R.last)(data);

        fullTenantAccessPermissionDataForQuery     = makeFakeTenantAccessPermissionData(true);
        requiredTenantAccessPermissionDataForQuery = makeFakeTenantAccessPermissionData(false);
        fullTenantAccessPermissionDataSwapIn       = commonMocks.override(fullTenantAccessPermissionDataForQuery);

        done();
      });
    });
  });

  it('creates a tenantAccessPermission record when given expected data for all fields', done => {
    createTenantAccessPermission(fullTenantAccessPermissionDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('creates a tenantAccessPermission record when given expected data for only required fields', done => {
    createTenantAccessPermission(requiredTenantAccessPermissionDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // TENANT_ACCESS_ROLE_UUID
  it('throws an error when tenantAccessRoleUuid is malformed', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessRoleUuid', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessRoleUuid is negative', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessRoleUuid', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessRoleUuid is missing', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessRoleUuid', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantAccessRoleUuid is not known', done => {
    createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessRoleUuid', FAKE_UNKNOWN_UUID)).catch(({ code }) => {
      expect(code).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  // TENANT_ACCESS_RESOURCE_UUID
  it('throws an error when tenantAccessResourceUuid is malformed', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessResourceUuid', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessResourceUuid is negative', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessResourceUuid', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantAccessResourceUuid is missing', () => {
    expect(() => {
      createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessResourceUuid', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantAccessResourceUuid is not known', done => {
    createTenantAccessPermission(fullTenantAccessPermissionDataSwapIn('tenantAccessResourceUuid', FAKE_UNKNOWN_UUID)).catch(({ code }) => {
      expect(code).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
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
