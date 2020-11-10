'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationByTenantIdAndSubdomain = require('../../../../server/core/models/tenantOrganization/methods/getTenantOrganizationByTenantIdAndSubdomain'),
      commonMocks                                 = require('../../../_helpers/commonMocks');

const A_STRING          = 'foo',
      A_POSITIVE_NUMBER = 9999,
      A_NEGATIVE_NUMBER = -9999,
      UNKNOWN_ID        = A_POSITIVE_NUMBER,
      UNKNOWN_SUBDOMAIN = A_STRING;

let KNOWN_TEST_TENANT_ORGANIZATION_ID,
    KNOWN_TEST_TENANT_ID,
    KNOWN_TEST_SUBDOMAIN;

describe('getTenantOrganizationByTenantIdAndSubdomain', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      const tenantOrganization = data[0];

      KNOWN_TEST_TENANT_ORGANIZATION_ID = tenantOrganization.id;
      KNOWN_TEST_TENANT_ID              = tenantOrganization.tenant_id;
      KNOWN_TEST_SUBDOMAIN              = tenantOrganization.subdomain;

      done();
    });
  });

  it('gets a tenantOrganization when given a known tenant id and subdomain', done => {
    getTenantOrganizationByTenantIdAndSubdomain(KNOWN_TEST_TENANT_ID, KNOWN_TEST_SUBDOMAIN).then(data => {
      expect(R.is(Object, data)).toBe(true);
      expect(data.id).toBe(KNOWN_TEST_TENANT_ORGANIZATION_ID);
      done();
    });
  });

  it('throws an error when given a tenantId of type other than Number', () => {
    expect(() => {
      getTenantOrganizationByTenantIdAndSubdomain(A_STRING, KNOWN_TEST_SUBDOMAIN);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a subdomain of type other than String', () => {
    expect(() => {
      getTenantOrganizationByTenantIdAndSubdomain(KNOWN_TEST_TENANT_ID, A_POSITIVE_NUMBER);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given negative tenantId', () => {
    expect(() => {
      getTenantOrganizationByTenantIdAndSubdomain(A_NEGATIVE_NUMBER, KNOWN_TEST_SUBDOMAIN);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantId', () => {
    expect(() => {
      getTenantOrganizationByTenantIdAndSubdomain(null, KNOWN_TEST_SUBDOMAIN);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null subdomain', () => {
    expect(() => {
      getTenantOrganizationByTenantIdAndSubdomain(KNOWN_TEST_TENANT_ID, null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an unknown tenantId', () => {
    getTenantOrganizationByTenantIdAndSubdomain(UNKNOWN_ID, KNOWN_TEST_SUBDOMAIN)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
      });
  });

  it('throws an error when given an unknown subdomain', () => {
    getTenantOrganizationByTenantIdAndSubdomain(KNOWN_TEST_TENANT_ID, UNKNOWN_SUBDOMAIN)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
      });
  });

});
