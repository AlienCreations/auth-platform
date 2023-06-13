'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAllowedTenantAccessResources = require('../../../../server/core/models/tenantAccessResource/methods/getAllowedTenantAccessResources'),
      commonMocks                     = require('../../../_helpers/commonMocks');

const KNOWN_TEST_PLATFORM_TENANT_UUID = process.env.PLATFORM_TENANT_UUID,
      A_STRING                        = 'foo';

let ALL_RESOURCES_COUNT,
    TENANT_RESOURCES_COUNT,
    TENANT_ORGANIZATION_RESOURCES_COUNT,
    KNOWN_TEST_TENANT_UUID,
    KNOWN_TEST_TENANT_ORGANIZATION_UUID;

describe('getAllowedTenantAccessResources', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, _data) => {

      const data                  = R.map(commonMocks.ensureTrueNullInCsvData, _data);
      const isNotNull             = k => R.compose(R.not, R.identical(null), R.prop(k));
      const findFirstWithValue    = R.compose(R.find, isNotNull);
      const getFirstValueFromData = k => R.compose(R.prop(k), findFirstWithValue(k))(data);

      ALL_RESOURCES_COUNT = data.length;

      KNOWN_TEST_TENANT_UUID              = getFirstValueFromData('tenant_uuid');
      KNOWN_TEST_TENANT_ORGANIZATION_UUID = getFirstValueFromData('tenant_organization_uuid');

      const isKnownOrNullTenant = R.either(
        R.propEq(KNOWN_TEST_TENANT_UUID, 'tenant_uuid'),
        R.propEq(null, 'tenant_uuid')
      );

      const isKnownOrNullTenantOrganization = R.either(
        R.both(
          R.propEq(KNOWN_TEST_TENANT_ORGANIZATION_UUID, 'tenant_organization_uuid'),
          R.propEq(KNOWN_TEST_TENANT_UUID, 'tenant_uuid')
        ),
        R.both(
          R.propEq(null, 'tenant_organization_uuid'),
          R.propEq(null, 'tenant_uuid')
        )
      );

      TENANT_RESOURCES_COUNT              = R.compose(R.length, R.filter(isKnownOrNullTenant))(data);
      TENANT_ORGANIZATION_RESOURCES_COUNT = R.compose(R.length, R.filter(isKnownOrNullTenantOrganization))(data);

      done();
    });
  });

  it('gets all tenantAccessResources when given the platform tenant uuid', done => {
    getAllowedTenantAccessResources(KNOWN_TEST_PLATFORM_TENANT_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(data.length).toBe(ALL_RESOURCES_COUNT);
        done();
      })
      .catch(done.fail);
  });

  it('gets all tenantAccessResources for a tenant when given a tenantUuid', done => {
    getAllowedTenantAccessResources(KNOWN_TEST_TENANT_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(data.length).toBe(TENANT_RESOURCES_COUNT);
        done();
      })
      .catch(done.fail);
  });

  it('gets all tenantAccessResources for a tenant organization when given a tenantOrganizationUuid', done => {
    // This mock works fine because we used the same tenant id for the organization record as well.
    getAllowedTenantAccessResources(KNOWN_TEST_TENANT_UUID, KNOWN_TEST_TENANT_ORGANIZATION_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(data.length).toBe(TENANT_ORGANIZATION_RESOURCES_COUNT);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a valid tenantUuid', () => {
    expect(() => {
      getAllowedTenantAccessResources(A_STRING, KNOWN_TEST_TENANT_ORGANIZATION_UUID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a valid tenantOrganizationUuid', () => {
    expect(() => {
      getAllowedTenantAccessResources(KNOWN_TEST_TENANT_UUID, A_STRING);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when params are missing', () => {
    expect(() => {
      getAllowedTenantAccessResources();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when tenantUuid is null', () => {
    expect(() => {
      getAllowedTenantAccessResources(null, KNOWN_TEST_TENANT_ORGANIZATION_UUID);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
