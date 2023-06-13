'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantOrganizationByTenantUuidAndSubdomain = require('../../../../server/core/models/tenantOrganization/methods/getTenantOrganizationByTenantUuidAndSubdomain'),
      commonMocks                                   = require('../../../_helpers/commonMocks');

const A_STRING          = 'foo',
      A_POSITIVE_NUMBER = 9999,
      A_NEGATIVE_NUMBER = -9999,
      UNKNOWN_UUID      = commonMocks.COMMON_UUID,
      UNKNOWN_SUBDOMAIN = A_STRING;

let KNOWN_TEST_TENANT_ORGANIZATION_UUID,
    KNOWN_TEST_TENANT_UUID,
    KNOWN_TEST_SUBDOMAIN;

describe('getTenantOrganizationByTenantUuidAndSubdomain', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {
      const tenantOrganization = R.compose(
        R.head,
        commonMocks.transformDbColsToJsProps
      )(data);

      KNOWN_TEST_TENANT_ORGANIZATION_UUID = tenantOrganization.uuid;
      KNOWN_TEST_TENANT_UUID              = tenantOrganization.tenantUuid;
      KNOWN_TEST_SUBDOMAIN                = tenantOrganization.subdomain;

      done();
    });
  });

  it('gets a tenantOrganization when given a known tenant uuid and subdomain', done => {
    getTenantOrganizationByTenantUuidAndSubdomain(KNOWN_TEST_TENANT_UUID, KNOWN_TEST_SUBDOMAIN)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        expect(data.uuid).toBe(KNOWN_TEST_TENANT_ORGANIZATION_UUID);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a tenantUuid of type other than Number', () => {
    expect(() => {
      getTenantOrganizationByTenantUuidAndSubdomain(A_STRING, KNOWN_TEST_SUBDOMAIN);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a subdomain of type other than String', () => {
    expect(() => {
      getTenantOrganizationByTenantUuidAndSubdomain(KNOWN_TEST_TENANT_UUID, A_POSITIVE_NUMBER);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given negative tenantUuid', () => {
    expect(() => {
      getTenantOrganizationByTenantUuidAndSubdomain(A_NEGATIVE_NUMBER, KNOWN_TEST_SUBDOMAIN);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantUuid', () => {
    expect(() => {
      getTenantOrganizationByTenantUuidAndSubdomain(null, KNOWN_TEST_SUBDOMAIN);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null subdomain', () => {
    expect(() => {
      getTenantOrganizationByTenantUuidAndSubdomain(KNOWN_TEST_TENANT_UUID, null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an unknown tenantUuid', done => {
    getTenantOrganizationByTenantUuidAndSubdomain(UNKNOWN_UUID, KNOWN_TEST_SUBDOMAIN)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given an unknown subdomain', done => {
    getTenantOrganizationByTenantUuidAndSubdomain(KNOWN_TEST_TENANT_UUID, UNKNOWN_SUBDOMAIN)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

});
