'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantAccessPermission = require('../../../../server/core/controllers/api/tenantAccessPermission/deleteTenantAccessPermission');

const FAKE_UNKNOWN_TENANT_ACCESS_PERMISSION_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA,
    KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID;

describe('tenantAccessPermissionCtrl.deleteTenantAccessPermission', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.compose(
        R.head,
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps
      )(data);
      KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID = KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA.uuid;
      done();
    });
  });

  it('successfully deletes an tenantAccessPermission', done => {
    deleteTenantAccessPermission(KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when attempting to delete an tenantAccessPermission that is not in the database', done => {
    deleteTenantAccessPermission(FAKE_UNKNOWN_TENANT_ACCESS_PERMISSION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessPermission with no params', done => {
    deleteTenantAccessPermission()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessPermission with null params', done => {
    deleteTenantAccessPermission(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
