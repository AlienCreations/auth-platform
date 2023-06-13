'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenantAccessResource = require('../../../../server/core/models/tenantAccessResource/methods/createTenantAccessResource'),
      commonMocks                = require('../../../_helpers/commonMocks');

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

let KNOWN_TEST_TENANT_ORGANIZATION_UUID,
    KNOWN_TEST_MAPPED_TENANT_UUID,
    fullTenantAccessResourceDataForQuery,

    requiredTenantAccessResourceDataForQuery,
    fullTenantAccessResourceDataSwapIn;

const makeFakeTenantAccessResourceData = (includeOptional) => {
  const fakeRequiredTenantAccessResourceData = {
    title  : FAKE_TITLE,
    key    : FAKE_KEY,
    uri    : FAKE_URI,
    method : FAKE_METHOD_SUPPORTED
  };

  const fakeOptionalTenantAccessResourceData = {
    tenantUuid             : KNOWN_TEST_MAPPED_TENANT_UUID,
    tenantOrganizationUuid : KNOWN_TEST_TENANT_ORGANIZATION_UUID,
    status                 : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantAccessResourceData, fakeRequiredTenantAccessResourceData) : fakeRequiredTenantAccessResourceData;
};


describe('createTenantAccessResource', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectTenants.csv'), (err, _data) => {
      const data = R.compose(
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps,
        R.reject(R.propEq(0, 'status'))
      )(_data);

      KNOWN_TEST_TENANT_ORGANIZATION_UUID = R.compose(R.prop('tenantOrganizationUuid'), R.head)(data);
      KNOWN_TEST_MAPPED_TENANT_UUID       = R.compose(R.prop('tenantUuid'), R.head)(data);

      fullTenantAccessResourceDataForQuery     = makeFakeTenantAccessResourceData(true);
      requiredTenantAccessResourceDataForQuery = makeFakeTenantAccessResourceData(false);
      fullTenantAccessResourceDataSwapIn       = commonMocks.override(fullTenantAccessResourceDataForQuery);

      done();
    });
  });

  it('creates a tenantAccessResource record when given expected data for all fields', done => {
    createTenantAccessResource(fullTenantAccessResourceDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('creates a tenantAccessResource record when given expected data for only required fields', done => {
    createTenantAccessResource(requiredTenantAccessResourceDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
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

  // TENANT_UUID
  it('throws an error when tenantUuid is malformed', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('tenantUuid', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TENANT_ORGANIZATION_UUID
  it('throws an error when tenantOrganizationUuid is malformed', () => {
    expect(() => {
      createTenantAccessResource(fullTenantAccessResourceDataSwapIn('tenantOrganizationUuid', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
