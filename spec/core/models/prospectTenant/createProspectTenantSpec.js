'use strict';

const cuid = require('cuid');

const createProspectTenant = require('../../../../server/core/models/prospectTenant/methods/createProspectTenant'),
      commonMocks          = require('../../../_helpers/commonMocks');

const FAKE_FIRST_NAME      = 'Testfirstname',
      FAKE_MALFORMED_EMAIL = 'foo',
      FAKE_ZIP             = '12345',
      FAKE_PHONE           = '555-123-4331',
      FAKE_LAST_NAME       = 'Testlastname',
      FAKE_TENANT_TITLE    = 'sometenant title';

const A_NUMBER = 1337;

const fakeFullProspectTenantDataForQuery = {
  firstName   : FAKE_FIRST_NAME,
  lastName    : FAKE_LAST_NAME,
  email       : `${cuid()}@test.com`,
  phone       : FAKE_PHONE,
  zip         : FAKE_ZIP,
  tenantTitle : FAKE_TENANT_TITLE
};

const fullProspectTenantDataSwapIn = commonMocks.override(fakeFullProspectTenantDataForQuery);

describe('createProspectTenant', () => {
  it('creates a prospect tenant record when given expected data for all fields', done => {
    createProspectTenant(fakeFullProspectTenantDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given no data', () => {
    expect(() => {
      createProspectTenant();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a firstName of type other than String', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('firstName', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when firstName is missing', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('firstName', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a lastName of type other than String', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('lastName', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when lastName is missing', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('lastName', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a email of type other than String', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('email', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed email', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('email', FAKE_MALFORMED_EMAIL));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when email is missing', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('email', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a phone of type other than String', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('phone', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when phone is missing', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('phone', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a zip of type other than String', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('zip', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when zip is missing', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('zip', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a tenantTitle of type other than String', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('tenantTitle', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when tenantTitle is missing', () => {
    expect(() => {
      createProspectTenant(fullProspectTenantDataSwapIn('tenantTitle', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
