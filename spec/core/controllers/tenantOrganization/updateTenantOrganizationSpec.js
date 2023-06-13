'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantOrganization = require('../../../../server/core/controllers/api/tenantOrganization/updateTenantOrganization');

const COMMON_PRIVATE_FIELDS              = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_ORGANIZATION_PRIVATE_FIELDS = R.path(['api', 'TENANT_ORGANIZATION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_ORGANIZATION_PRIVATE_FIELDS);

const FAKE_TENANT_UPDATE_DATA  = {
        title : 'Updated body'
      },
      FAKE_UNKNOWN_TENANT_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_DATA,
    KNOWN_TEST_TENANT_UUID,
    updatedTenantOrganizationData;

const metaJsonLens = R.lensPath(['metaJson']);

describe('tenantOrganizationCtrl.updateTenantOrganization', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantOrganizations.csv'), (err, data) => {

      KNOWN_TEST_TENANT_DATA = R.compose(R.over(metaJsonLens, JSON.stringify), R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_UUID = KNOWN_TEST_TENANT_DATA.uuid;

      updatedTenantOrganizationData = R.omit(privateFields, R.mergeDeepRight(KNOWN_TEST_TENANT_DATA, FAKE_TENANT_UPDATE_DATA));

      done();
    });
  });

  it('updates an tenantOrganization when provided an uuid and new properties to update', done => {
    updateTenantOrganization(FAKE_TENANT_UPDATE_DATA, KNOWN_TEST_TENANT_UUID)
      .then(res => {
        res = R.compose(R.over(metaJsonLens, JSON.stringify), R.over(metaJsonLens, JSON.parse))(res);
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(updatedTenantOrganizationData);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating an tenantOrganization that does not exist', done => {
    updateTenantOrganization(FAKE_TENANT_UPDATE_DATA, FAKE_UNKNOWN_TENANT_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

});
