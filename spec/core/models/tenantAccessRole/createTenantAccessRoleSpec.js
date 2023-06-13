'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenantAccessRole = require('../../../../server/core/models/tenantAccessRole/methods/createTenantAccessRole'),
      commonMocks            = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER          = 1337,
      A_NEGATIVE_NUMBER          = -10,
      STRING_ONE_CHAR            = 'a',
      STRING_THREE_HUNDRED_CHARS = '*'.repeat(300);

const FAKE_STATUS       = 1,
      FAKE_UNKNOWN_UUID = commonMocks.COMMON_UUID,
      FAKE_TITLE        = 'new-test-role';

let KNOWN_TEST_TENANT_ORGANIZATION_UUID,
    KNOWN_TEST_TENANT_UUID,
    fullTenantAccessRoleDataForQuery,
    requiredTenantAccessRoleDataForQuery,
    fullTenantAccessRoleDataSwapIn;

const makeFakeTenantAccessRoleData = (includeOptional) => {
  const fakeRequiredTenantAccessRoleData = {
    tenantUuid             : KNOWN_TEST_TENANT_UUID,
    tenantOrganizationUuid : KNOWN_TEST_TENANT_ORGANIZATION_UUID,
    title                  : FAKE_TITLE
  };

  const fakeOptionalTenantAccessRoleData = {
    status : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantAccessRoleData, fakeRequiredTenantAccessRoleData) : fakeRequiredTenantAccessRoleData;
};

describe('createTenantAccessRole', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, _data) => {
      const data = R.compose(
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps,
        R.reject(R.propEq(0, 'status'))
      )(_data);

      KNOWN_TEST_TENANT_ORGANIZATION_UUID = R.compose(R.prop('tenantOrganizationUuid'), R.head)(data);
      KNOWN_TEST_TENANT_UUID              = R.compose(R.prop('tenantUuid'), R.head)(data);

      fullTenantAccessRoleDataForQuery     = makeFakeTenantAccessRoleData(true);
      requiredTenantAccessRoleDataForQuery = makeFakeTenantAccessRoleData(false);
      fullTenantAccessRoleDataSwapIn       = commonMocks.override(fullTenantAccessRoleDataForQuery);

      done();
    });
  });

  it('creates a tenantAccessRole record when given expected data for all fields', done => {
    createTenantAccessRole(fullTenantAccessRoleDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('creates a tenantAccessRole record when given expected data for only required fields', done => {
    createTenantAccessRole(requiredTenantAccessRoleDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
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

  // TENANT_UUID
  it('throws an error when tenantUuid is malformed', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantUuid', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantUuid is missing', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantUuid', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantUuid is not known', done => {
    createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantUuid', FAKE_UNKNOWN_UUID))
      .then(done.fail)
      .catch(({ code }) => {
        expect(code).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
        done();
      });
  });

  // TENANT_ORGANIZATION_UUID
  it('throws an error when tenantOrganizationUuid is malformed', () => {
    expect(() => {
      createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantOrganizationUuid', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantOrganizationUuid is not known', done => {
    createTenantAccessRole(fullTenantAccessRoleDataSwapIn('tenantOrganizationUuid', FAKE_UNKNOWN_UUID))
      .then(done.fail)
      .catch(({ code }) => {
        expect(code).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
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
