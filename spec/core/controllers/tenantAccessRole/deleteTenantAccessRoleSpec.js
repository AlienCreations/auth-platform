'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantAccessRole = require('../../../../server/core/controllers/api/tenantAccessRole/deleteTenantAccessRole');

const FAKE_UNKNOWN_TENANT_ACCESS_ROLE_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_ACCESS_ROLE_DATA,
    KNOWN_TEST_TENANT_ACCESS_ROLE_UUID;

describe('tenantAccessRoleCtrl.deleteTenantAccessRole', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_ROLE_DATA = R.compose(
        R.head,
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps
      )(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_UUID = KNOWN_TEST_TENANT_ACCESS_ROLE_DATA.uuid;
      done();
    });
  });

  it('successfully deletes an tenantAccessRole', done => {
    deleteTenantAccessRole(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when attempting to delete an tenantAccessRole that is not in the database', done => {
    deleteTenantAccessRole(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessRole with no params', done => {
    deleteTenantAccessRole()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessRole with null params', done => {
    deleteTenantAccessRole(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
