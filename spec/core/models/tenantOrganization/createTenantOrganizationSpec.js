'use strict';

const R = require('ramda');

const createTenantOrganization = require('../../../../server/core/models/tenantOrganization/methods/createTenantOrganization'),
      commonMocks              = require('../../../_helpers/commonMocks');

const KNOWN_TEST_TENANT_UUID  = process.env.PLATFORM_TENANT_UUID,
      FAKE_TITLE              = 'Test TenantOrganization',
      FAKE_EMAIL              = 'test@user.com',
      FAKE_MALFORMED_EMAIL    = 'test',
      FAKE_PLAINTEXT_PASSWORD = 'somepassword',
      FAKE_PHONE              = '123-422-1234',
      FAKE_FAX                = '123-234-5667',
      FAKE_ADDRESS_1          = '213 test address',
      FAKE_ADDRESS_2          = 'suite 2',
      FAKE_CITY               = 'Los Angeles',
      FAKE_STATE              = 'CA',
      FAKE_ZIP                = '90121',
      FAKE_COUNTRY            = 'US',
      FAKE_TAX_RATE           = 0.04,
      FAKE_SUBDOMAIN          = 'testsubdomain',
      FAKE_META_JSON          = JSON.stringify({
        '1st floor' : [
          { foo : 'bar', baz : 'bat' }, {
            foo : 'bar',
            baz : 'bat'
          }
        ]
      }),
      FAKE_STATUS             = 1;

const A_NUMBER          = 1337,
      A_NEGATIVE_NUMBER = -10,
      A_STRING          = 'foo';

const makeFakeTenantOrganizationData = includeOptional => {
  const fakeRequiredTenantOrganizationData = {
    tenantUuid : KNOWN_TEST_TENANT_UUID,
    title      : FAKE_TITLE,
    email      : FAKE_EMAIL,
    password   : FAKE_PLAINTEXT_PASSWORD,
    phone      : FAKE_PHONE,
    address1   : FAKE_ADDRESS_1,
    city       : FAKE_CITY,
    state      : FAKE_STATE,
    zip        : FAKE_ZIP,
    country    : FAKE_COUNTRY,
    taxRate    : FAKE_TAX_RATE,
    subdomain  : FAKE_SUBDOMAIN
  };

  const fakeOptionalTenantOrganizationData = {
    fax      : FAKE_FAX,
    address2 : FAKE_ADDRESS_2,
    metaJson : FAKE_META_JSON,
    status   : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantOrganizationData, fakeRequiredTenantOrganizationData) : fakeRequiredTenantOrganizationData;
};

const fullTenantOrganizationDataForQuery     = makeFakeTenantOrganizationData(true),
      requiredTenantOrganizationDataForQuery = makeFakeTenantOrganizationData(false);

const fullTenantOrganizationDataSwapIn = commonMocks.override(fullTenantOrganizationDataForQuery);

describe('createTenantOrganization', () => {
  it('creates a tenantOrganization record when given expected data for all fields', done => {
    createTenantOrganization(fullTenantOrganizationDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('creates a tenantOrganization record when given expected data for only required fields', done => {
    createTenantOrganization(requiredTenantOrganizationDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given no data', () => {
    expect(() => {
      createTenantOrganization();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('title', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when title is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('title', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('email', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed email', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('email', FAKE_MALFORMED_EMAIL));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when email is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('email', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a password of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('password', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when password is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('password', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a phone of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('phone', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when phone is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('phone', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a fax of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('fax', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a address1 of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('address1', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when address1 is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('address1', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a address2 of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('address2', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a city of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('city', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when city is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('city', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a state of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('state', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when state is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('state', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a zip of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('zip', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when zip is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('zip', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a country of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('country', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when country is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('country', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a taxRate of type other than Number', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('taxRate', A_STRING));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when taxRate is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('taxRate', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a subdomain of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('subdomain', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when subdomain is missing', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('subdomain', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a metaJson of type other than String', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('metaJson', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a status of type other than Number', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('status', A_STRING));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      createTenantOrganization(fullTenantOrganizationDataSwapIn('status', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
