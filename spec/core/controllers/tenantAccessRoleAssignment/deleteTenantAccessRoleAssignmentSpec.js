'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const commonMocks                      = require('../../../_helpers/commonMocks'),
      deleteTenantAccessRoleAssignment = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/deleteTenantAccessRoleAssignment');

const FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID;

describe('tenantAccessRoleAssignmentCtrl.deleteTenantAccessRoleAssignment', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, _data) => {
      const data = R.compose(
        R.head,
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps
      )(_data);

      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID = data.uuid;

      done();
    });
  });
  it('successfully deletes an tenantAccessRoleAssignment', done => {
    deleteTenantAccessRoleAssignment(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when attempting to delete an tenantAccessRoleAssignment that is not in the database', done => {
    deleteTenantAccessRoleAssignment(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessRoleAssignment with no params', done => {
    deleteTenantAccessRoleAssignment()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an tenantAccessRoleAssignment with null params', done => {
    deleteTenantAccessRoleAssignment(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
