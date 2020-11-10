'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessResource = require('../../../../server/core/controllers/api/tenantAccessResource/updateTenantAccessResource');

const KNOWN_TEST_TENANT_ORGANIZATION_ID = 2,
      KNOWN_TEST_MAPPED_TENANT_ID       = 1;

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA = {
        title  : 'faketitle',
        key    : 'fake-key',
        uri    : '/fake/new/uri',
        method : 'POST'
      },
      FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_ID  = 9999;

const FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA_WITH_TENANT_ID = R.mergeDeepRight(
  FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA,
  { tenantId : KNOWN_TEST_MAPPED_TENANT_ID }
);

const FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA_WITH_TENANT_ORGANIZATION_ID = R.mergeDeepRight(
  FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA,
  { tenantOrganizationId : KNOWN_TEST_TENANT_ORGANIZATION_ID }
);

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID,
    updatedTenantAccessResourceData;

const omitTenancyFields = R.omit(['tenantId', 'tenantOrganizationId']),
      omitPrivateFields = R.omit(COMMON_PRIVATE_FIELDS);

describe('tenantAccessResourceCtrl.updateTenantAccessResource', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, _data) => {

      const data = R.compose(R.map(commonMocks.ensureTrueNullInCsvData), commonMocks.transformDbColsToJsProps)(_data);

      KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA = R.compose(omitTenancyFields, omitPrivateFields, R.head)(data);
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID   = R.prop('id', KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA);

      updatedTenantAccessResourceData = R.omit(COMMON_PRIVATE_FIELDS, R.mergeDeepRight(KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA, FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA));

      done();
    });
  });

  it('updates an tenantAccessResource when provided an id and new properties to update', done => {
    updateTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA, KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID)
      .then(res => {
        expect(res.title)
          .toEqual(updatedTenantAccessResourceData.title);
        done();
      });
  });

  it('throws an error when updating an tenantAccessResource that does not exist', done => {
    updateTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA, FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating an tenantAccessResource with a new tenantId', done => {
    updateTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA_WITH_TENANT_ID, KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID)
      .catch(err => {
        expect(commonMocks.isUnsupportedParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating an tenantAccessResource with a new tenantOrganizationId', done => {
    updateTenantAccessResource(FAKE_TENANT_ACCESS_RESOURCE_UPDATE_DATA_WITH_TENANT_ORGANIZATION_ID, KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID)
      .catch(err => {
        expect(commonMocks.isUnsupportedParamErr(err)).toBe(true);
        done();
      });
  });

});
