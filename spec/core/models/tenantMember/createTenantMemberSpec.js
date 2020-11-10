'use strict';

const R = require('ramda');

const createTenantMember = require('../../../../server/core/models/tenantMember/methods/createTenantMember'),
      commonMocks            = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER    = 1337,
      A_NEGATIVE_NUMBER    = -10,
      STRING_ONE_CHAR      = 'a',
      STRING_SEVENTY_CHARS = '*'.repeat(70);

const FAKE_STATUS                       = 1,
      FAKE_UNKNOWN_ID                   = 9999,
      KNOWN_TEST_TENANT_ID              = 2,
      KNOWN_TEST_UNMAPPED_CLOUD_USER_ID = 4,
      FAKE_REFERENCE_ID                 = 'qwerty';

const makeFakeTenantMemberData = (includeOptional) => {
  const fakeRequiredTenantMemberData = {
    tenantId    : KNOWN_TEST_TENANT_ID,
    cloudUserId : KNOWN_TEST_UNMAPPED_CLOUD_USER_ID,
    referenceId : FAKE_REFERENCE_ID
  };

  const fakeOptionalTenantMemberData = {
    status : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantMemberData, fakeRequiredTenantMemberData) : fakeRequiredTenantMemberData;
};

const fullTenantMemberDataForQuery     = makeFakeTenantMemberData(true),
      requiredTenantMemberDataForQuery = makeFakeTenantMemberData(false);

const fullTenantMemberDataSwapIn = commonMocks.override(fullTenantMemberDataForQuery);

describe('createTenantMember', () => {

  it('creates a tenantMember record when given expected data for all fields', done => {
    createTenantMember(fullTenantMemberDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('creates a tenantMember record when given expected data for only required fields', done => {
    createTenantMember(requiredTenantMemberDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
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

  // TENANT_ID
  it('throws an error when tenantId is malformed', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('tenantId', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantId is negative', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('tenantId', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantId is missing', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('tenantId', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantId is not known', done => {
    createTenantMember(fullTenantMemberDataSwapIn('tenantId', FAKE_UNKNOWN_ID)).catch(err => {
      expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
      done();
    });
  });

  // CLOUD_USER_ID
  it('throws an error when cloudUserId is malformed', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('cloudUserId', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when cloudUserId is negative', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('cloudUserId', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when cloudUserId is missing', () => {
    expect(() => {
      createTenantMember(fullTenantMemberDataSwapIn('cloudUserId', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when cloudUserId is not known', done => {
    createTenantMember(fullTenantMemberDataSwapIn('cloudUserId', FAKE_UNKNOWN_ID)).catch(err => {
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
