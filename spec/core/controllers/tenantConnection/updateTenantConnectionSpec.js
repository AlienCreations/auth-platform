'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantConnection = require('../../../../server/core/controllers/api/tenantConnection/updateTenantConnection');

const COMMON_PRIVATE_FIELDS            = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      TENANT_CONNECTION_PRIVATE_FIELDS = R.path(['api', 'TENANT_CONNECTION_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, TENANT_CONNECTION_PRIVATE_FIELDS);

const FAKE_TENANT_UPDATE_DATA  = {
        title : 'Updated body'
      },
      FAKE_UNKNOWN_TENANT_UUID = commonMocks.COMMON_UUID;

const jsonLens = R.lensPath(['metaJson']);

let KNOWN_TEST_TENANT_DATA,
    KNOWN_TEST_TENANT_UUID,
    updatedTenantConnectionData;

describe('tenantConnectionCtrl.updateTenantConnection', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {

      KNOWN_TEST_TENANT_DATA = R.compose(R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_UUID = KNOWN_TEST_TENANT_DATA.uuid;

      updatedTenantConnectionData = R.compose(
        R.over(jsonLens, JSON.stringify),
        R.omit(privateFields),
        R.mergeDeepRight(KNOWN_TEST_TENANT_DATA)
      )(FAKE_TENANT_UPDATE_DATA);

      done();
    });
  });

  it('updates a tenantConnection when provided an id and new properties to update', done => {
    updateTenantConnection(FAKE_TENANT_UPDATE_DATA, KNOWN_TEST_TENANT_UUID)
      .then(res => {
        res = R.compose(R.over(jsonLens, JSON.stringify), R.over(jsonLens, JSON.parse))(res);
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(updatedTenantConnectionData);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating an tenantConnection that does not exist', done => {
    updateTenantConnection(FAKE_TENANT_UPDATE_DATA, FAKE_UNKNOWN_TENANT_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });
});
