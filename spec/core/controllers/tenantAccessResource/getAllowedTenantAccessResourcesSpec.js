'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAllowedTenantAccessResources = require('../../../../server/core/controllers/api/tenantAccessResource/getAllowedTenantAccessResources'),
      commonMocks                     = require('../../../_helpers/commonMocks');

const KNOWN_TEST_PLATFORM_TENANT_ID = 1,
      A_STRING                      = 'foo';

let ALL_RESOURCES_COUNT,
    TENANT_RESOURCES_COUNT,
    TENANT_ORGANIZATION_RESOURCES_COUNT,
    KNOWN_TEST_TENANT_ID,
    KNOWN_TEST_TENANT_ORGANIZATION_ID;

describe('tenantAccessResourceCtrl.getAllowedTenantAccessResources', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, _data) => {

      const data                  = R.map(commonMocks.ensureTrueNullInCsvData, _data);
      const isNotNull             = k => o => o[k] !== null;
      const findFirstWithValue    = R.compose(R.find, isNotNull);
      const getFirstValueFromData = k => R.compose(R.prop(k), findFirstWithValue(k))(data);

      ALL_RESOURCES_COUNT = data.length;

      KNOWN_TEST_TENANT_ID              = getFirstValueFromData('tenant_id');
      KNOWN_TEST_TENANT_ORGANIZATION_ID = getFirstValueFromData('tenant_organization_id');

      const isKnownOrNullTenant = R.either(
        R.propEq('tenant_id', KNOWN_TEST_TENANT_ID),
        R.propEq('tenant_id', null)
      );

      const isKnownOrNullTenantOrganization = R.either(
        R.both(
          R.propEq('tenant_organization_id', KNOWN_TEST_TENANT_ORGANIZATION_ID),
          R.propEq('tenant_id', KNOWN_TEST_TENANT_ID)
        ),
        R.both(
          R.propEq('tenant_organization_id', null),
          R.propEq('tenant_id', null)
        )
      );

      TENANT_RESOURCES_COUNT              = R.compose(R.length, R.filter(isKnownOrNullTenant))(data);
      TENANT_ORGANIZATION_RESOURCES_COUNT = R.compose(R.length, R.filter(isKnownOrNullTenantOrganization))(data);

      done();
    });
  });

  it('gets all tenantAccessResources when given the platform tenant id', done => {
    getAllowedTenantAccessResources(KNOWN_TEST_PLATFORM_TENANT_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(data.length).toBe(ALL_RESOURCES_COUNT);
      done();
    });
  });

  it('gets all tenantAccessResources for a tenant when given a tenantId', done => {
    getAllowedTenantAccessResources(KNOWN_TEST_TENANT_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(data.length).toBe(TENANT_RESOURCES_COUNT);
      done();
    });
  });

  it('gets all tenantAccessResources for a tenant organization when given a tenantOrganizationId', done => {
    // This mock works fine because we used the same tenant id for the organization record as well.
    getAllowedTenantAccessResources(KNOWN_TEST_TENANT_ID, KNOWN_TEST_TENANT_ORGANIZATION_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(data.length).toBe(TENANT_ORGANIZATION_RESOURCES_COUNT);
      done();
    });
  });

  it('throws an error when given a tenantId of type other than Number', () => {
    getAllowedTenantAccessResources(A_STRING, KNOWN_TEST_TENANT_ORGANIZATION_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
      });
  });

  it('throws an error when given a tenantOrganizationId of type other than Number', () => {
    getAllowedTenantAccessResources(KNOWN_TEST_TENANT_ID, A_STRING)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
      });
  });

  it('throws an error when params are missing', () => {
    getAllowedTenantAccessResources()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
      });
  });

  it('throws an error when tenantId is null', () => {
    getAllowedTenantAccessResources(null, KNOWN_TEST_TENANT_ORGANIZATION_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
      });
  });

});
