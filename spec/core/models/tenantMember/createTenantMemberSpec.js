'use strict';

const R                      = require('ramda'),
      path                   = require('path'),
      CSVConverter           = require('csvtojson').Converter,
      cloudUsersConverter    = new CSVConverter({}),
      tenantMembersConverter = new CSVConverter({});

const createTenantMember = require('../../../../server/core/models/tenantMember/methods/createTenantMember'),
      commonMocks        = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER    = 1337,
      A_NEGATIVE_NUMBER    = -10,
      STRING_ONE_CHAR      = 'a',
      STRING_SEVENTY_CHARS = '*'.repeat(70);

const FAKE_STATUS       = 1,
      FAKE_UNKNOWN_UUID = commonMocks.COMMON_UUID,
      FAKE_REFERENCE_ID = 'qwerty';

let KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID,
    KNOWN_TEST_TENANT_UUID;

let fullTenantMemberDataForQuery,
    requiredTenantMemberDataForQuery,
    fullTenantMemberDataSwapIn;

const makeFakeTenantMemberData = (includeOptional) => {
  const fakeRequiredTenantMemberData = {
    tenantUuid    : KNOWN_TEST_TENANT_UUID,
    cloudUserUuid : KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID,
    referenceId   : FAKE_REFERENCE_ID
  };

  const fakeOptionalTenantMemberData = {
    status : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantMemberData, fakeRequiredTenantMemberData) : fakeRequiredTenantMemberData;
};

describe('createTenantMember', () => {
  beforeAll(done => {
    cloudUsersConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_UNMAPPED_CLOUD_USER_UUID = R.compose(R.prop('uuid'), R.last)(data);

      tenantMembersConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
        KNOWN_TEST_TENANT_UUID = R.compose(R.prop('tenant_uuid'), R.head)(data);

        fullTenantMemberDataForQuery     = makeFakeTenantMemberData(true);
        requiredTenantMemberDataForQuery = makeFakeTenantMemberData(false);
        fullTenantMemberDataSwapIn       = commonMocks.override(fullTenantMemberDataForQuery);

        done();
      });
    });
  });

  it('creates a tenantMember record when given expected data for all fields', done => {
    createTenantMember(fullTenantMemberDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('creates a tenantMember record when given expected data for only required fields', done => {
    createTenantMember(requiredTenantMemberDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // REFERENCE ID
  it('throws an error when referenceId is missing', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('referenceId', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a referenceId of type other than String', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('referenceId', A_POSITIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when referenceId is too long', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('referenceId', STRING_SEVENTY_CHARS));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TENANT_UUID
  it('throws an error when tenantUuid is malformed', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('tenantUuid', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantUuid is missing', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('tenantUuid', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantUuid is not known', done => {
    createTenantMember(fullTenantMemberDataSwapIn('tenantUuid', FAKE_UNKNOWN_UUID)).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  // CLOUD_USER_UUID
  it('throws an error when cloudUserUuid is malformed', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('cloudUserUuid', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when cloudUserUuid is missing', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('cloudUserUuid', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when cloudUserUuid is not known', done => {
    createTenantMember(fullTenantMemberDataSwapIn('cloudUserUuid', FAKE_UNKNOWN_UUID)).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  // STATUS
  it('throws an error when status is not a positive number', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('status', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when status is negative', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('status', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
