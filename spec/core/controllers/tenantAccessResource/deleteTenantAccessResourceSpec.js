'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantAccessResource = require('../../../../server/core/controllers/api/tenantAccessResource/deleteTenantAccessResource');

const FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID;

describe('tenantAccessResourceCtrl.deleteTenantAccessResource', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA = R.compose(
        R.head,
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps
      )(data);
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID = KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA.uuid;
      done();
    });
  });

  it('successfully deletes an tenantAccessResource', done => {
    deleteTenantAccessResource(KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when attempting to delete an tenantAccessResource that is not in the database', done => {
    deleteTenantAccessResource(FAKE_UNKNOWN_TENANT_ACCESS_RESOURCE_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessResource with no params', done => {
    deleteTenantAccessResource()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessResource with null params', done => {
    deleteTenantAccessResource(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
