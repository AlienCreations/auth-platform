'use strict';

const R = require('ramda');

const createTenantAccessResource = require('../../../../server/core/models/tenantAccessResource/methods/createTenantAccessResource'),
      commonMocks                = require('../../../_helpers/commonMocks');

const KNOWN_TEST_TENANT_ORGANIZATION_ID = 1,
      KNOWN_TEST_MAPPED_TENANT_ID       = 2;

const A_POSITIVE_NUMBER          = 1337,
      A_NEGATIVE_NUMBER          = -10,
      STRING_ONE_CHAR            = 'a',
      STRING_THREE_HUNDRED_CHARS = '*'.repeat(300);

const FAKE_STATUS             = 1,
      FAKE_TITLE              = 'New Test Resource',
      FAKE_KEY                = 'new-test-resource',
      FAKE_URI                = '/api/v1/some-new-test-resource',
      FAKE_METHOD_SUPPORTED   = 'PUT',
      FAKE_METHOD_UNSUPPORTED = 'FOO';

const makeFakeTenantAccessResourceData = (includeOptional) => {
  const fakeRequiredTenantAccessResourceData = {
    title  : FAKE_TITLE,
    key    : FAKE_KEY,
    uri    : FAKE_URI,
    method : FAKE_METHOD_SUPPORTED
  };

  const fakeOptionalTenantAccessResourceData = {
    tenantId             : KNOWN_TEST_MAPPED_TENANT_ID,
    tenantOrganizationId : KNOWN_TEST_TENANT_ORGANIZATION_ID,
    status               : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantAccessResourceData, fakeRequiredTenantAccessResourceData) : fakeRequiredTenantAccessResourceData;
};

const fullTenantAccessResourceDataForQuery     = makeFakeTenantAccessResourceData(true),
      requiredTenantAccessResourceDataForQuery = makeFakeTenantAccessResourceData(false);

const fullTenantAccessResourceDataSwapIn = commonMocks.override(fullTenantAccessResourceDataForQuery);

describe('createTenantAccessResource', () => {

  it('creates a tenantAccessResource record when given expected data for all fields', done => {
    createTenantAccessResource(fullTenantAccessResourceDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('creates a tenantAccessResource record when given expected data for only required fields', done => {
    createTenantAccessResource(requiredTenantAccessResourceDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // TITLE
  it('throws an error when title is missing', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('title', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('title', A_POSITIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when title is too long', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('title', STRING_THREE_HUNDRED_CHARS));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // KEY
  it('throws an error when key is missing', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('key', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a key of type other than String', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('key', A_POSITIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when key is too long', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('key', STRING_THREE_HUNDRED_CHARS));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // URI
  it('throws an error when uri is missing', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('uri', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a uri of type other than String', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('uri', A_POSITIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when uri is too long', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('uri', STRING_THREE_HUNDRED_CHARS));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // METHOD
  it('throws an error when method is missing', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('method', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a method of type other than String', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('method', A_POSITIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when method not a supported method', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('method', FAKE_METHOD_UNSUPPORTED));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // STATUS
  it('throws an error when status is not a positive number', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('status', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when status is negative', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('status', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TENANT_ID
  it('throws an error when tenantId is not a positive number', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('tenantId', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantId is negative', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('tenantId', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TENANT_ORGANIZATION_ID
  it('throws an error when tenantOrganizationId is not a positive number', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('tenantOrganizationId', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantOrganizationId is negative', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('tenantOrganizationId', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
