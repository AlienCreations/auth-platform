'use strict';

const R = require('ramda');

const createTenant = require('../../../../server/core/models/tenant/methods/createTenant'),
      commonMocks  = require('../../../_helpers/commonMocks');

const FAKE_DOMAIN      = 'testtenant',
      FAKE_TITLE       = 'Test Tenant',
      FAKE_DESCRIPTION = 'A good test tenant',
      FAKE_LOGO        = 'testtenant.png',
      FAKE_EMAIL       = 'test@testtenant.com',
      FAKE_PHONE       = '555-123-4567',
      FAKE_FAX         = '555-123-4568',
      FAKE_ADDRESS_1   = '123 test street',
      FAKE_ADDRESS_2   = '4th floor',
      FAKE_CITY        = 'San Andreas',
      FAKE_STATE       = 'CA',
      FAKE_ZIP         = '90432',
      FAKE_COUNTRY     = 'US',
      FAKE_STATUS      = 1,
      FAKE_URL         = 'https://www.testtenant.com';

const A_NUMBER          = 1337,
      A_NEGATIVE_NUMBER = -10,
      A_STRING          = 'foo';

const makeFakeTenantData = includeOptional => {
  const fakeRequiredTenantData = {
    domain   : FAKE_DOMAIN,
    title    : FAKE_TITLE,
    email    : FAKE_EMAIL,
    phone    : FAKE_PHONE,
    address1 : FAKE_ADDRESS_1,
    city     : FAKE_CITY,
    state    : FAKE_STATE,
    zip      : FAKE_ZIP,
    country  : FAKE_COUNTRY
  };

  const fakeOptionalTenantData = {
    description : FAKE_DESCRIPTION,
    logo        : FAKE_LOGO,
    fax         : FAKE_FAX,
    address2    : FAKE_ADDRESS_2,
    status      : FAKE_STATUS,
    url         : FAKE_URL
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantData, fakeRequiredTenantData) : fakeRequiredTenantData;
};

const fullTenantDataForQuery     = makeFakeTenantData(true),
      requiredTenantDataForQuery = makeFakeTenantData(false);

const fullTenantDataSwapIn = commonMocks.override(fullTenantDataForQuery);

describe('createTenant', () => {
  it('creates a tenant record when given expected data for all fields', done => {
    createTenant(fullTenantDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('creates a tenant record when given expected data for only required fields', done => {
    createTenant(requiredTenantDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('throws an error when given no data', () => {
    expect(() => {
      createTenant();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given a domain of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('domain', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when domain is missing', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('domain', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('title', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when title is missing', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('title', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('email', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when email is missing', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('email', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a phone of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('phone', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when phone is missing', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('phone', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an address1 of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('address1', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when address1 is missing', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('address1', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a city of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('city', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when city is missing', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('city', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a state of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('state', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when state is missing', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('state', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a zip of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('zip', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when zip is missing', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('zip', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a country of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('country', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when country is missing', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('country', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a description of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('description', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a logo of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('logo', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a fax of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('fax', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an address2 of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('address2', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a status of type other than Number', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('status', A_STRING));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('status', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a url of type other than String', () => {
    expect(() => {
      createTenant(fullTenantDataSwapIn('url', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
