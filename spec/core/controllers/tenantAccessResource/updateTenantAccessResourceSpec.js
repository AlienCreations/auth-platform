'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessResource = require('../../../../server/core/controllers/api/tenantAccessResource/updateTenantAccessResource');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA  = {
        title  : 'faketitle',
        key    : 'fake-key',
        uri    : '/fake/new/uri',
        method : 'POST'
      },
      FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID,
    KNOWN_TEST_TENANT_ORGANIZATION_UUID,
    KNOWN_TEST_ORGANIZATION_MAPPED_TENANT_UUID,
    FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA_WITH_TENANT_UUID,
    FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA_WITH_TENANT_ORGANIZATION_UUID,
    updatedTenantAccessResourceData;

const omitTenancyFields = R.omit(['tenantUuid', 'tenantOrganizationUuid']),
      omitPrivateFields = R.omit(COMMON_PRIVATE_FIELDS);

describe('tenantAccessResourceCtrl.updateTenantAccessResource', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, _data) => {
      const data = R.compose(R.map(commonMocks.ensureTrueNullInCsvData), commonMocks.transformDbColsToJsProps)(_data);

      KNOWN_TEST_TENANT_ORGANIZATION_UUID        = R.compose(R.prop('tenantOrganizationUuid'), R.last)(data);
      KNOWN_TEST_ORGANIZATION_MAPPED_TENANT_UUID = R.compose(R.prop('tenantUuid'), R.last)(data);

      KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA = R.compose(omitTenancyFields, omitPrivateFields, R.head)(data);
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID = R.prop('uuid', KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA);

      updatedTenantAccessResourceData = R.omit(COMMON_PRIVATE_FIELDS, R.mergeDeepRight(KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA, FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA));

      FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA_WITH_TENANT_UUID = R.mergeDeepRight(
        FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA,
        { tenantUuid : KNOWN_TEST_ORGANIZATION_MAPPED_TENANT_UUID }
      );

      FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA_WITH_TENANT_ORGANIZATION_UUID = R.mergeDeepRight(
        FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA,
        { tenantOrganizationUuid : KNOWN_TEST_TENANT_ORGANIZATION_UUID }
      );

      done();
    });
  });

  it('updates an tenantAccessResource when provided an id and new properties to update', done => {
    updateTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA, KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID)
      .then(res => {
        expect(res.title)
          .toEqual(updatedTenantAccessResourceData.title);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating an tenantAccessResource that does not exist', done => {
    updateTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA, FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating an tenantAccessResource with a new tenantUuid', done => {
    updateTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA_WITH_TENANT_UUID, KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isUnsupportedParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating an tenantAccessResource with a new tenantOrganizationUuid', done => {
    updateTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA_WITH_TENANT_ORGANIZATION_UUID, KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isUnsupportedParamErr(err)).toBe(true);
        done();
      });
  });
});
