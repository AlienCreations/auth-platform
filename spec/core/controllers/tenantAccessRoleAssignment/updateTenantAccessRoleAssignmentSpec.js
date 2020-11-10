'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessRoleAssignment = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/updateTenantAccessRoleAssignment');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_UPDATE_DATA = {
        status : 2
      },
      FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ASSIGNMENT_ID  = 9999;

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA,
    KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_ID,
    updatedTenantAccessRoleAssignmentData;

describe('tenantAccessRoleAssignmentCtrl.updateTenantAccessRoleAssignment', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {

      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_ID   = R.prop('id', KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA);

      updatedTenantAccessRoleAssignmentData = R.omit(COMMON_PRIVATE_FIELDS, R.mergeDeepRight(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA, FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_UPDATE_DATA));

      done();
    });
  });

  it('updates an tenantAccessRoleAssignment when provided an id and new properties to update', done => {
    updateTenantAccessRoleAssignment(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_UPDATE_DATA, KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_ID)
      .then(res => {
        expect(res.status)
          .toEqual(updatedTenantAccessRoleAssignmentData.status);
        done();
      });
  });

  it('throws an error when updating an tenantAccessRoleAssignment that does not exist', done => {
    updateTenantAccessRoleAssignment(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_UPDATE_DATA, FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ASSIGNMENT_ID)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating with an unsupported property (only status is allowed at this time)', done => {
    updateTenantAccessRoleAssignment({ foo : 'bar' }, KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_ID)
      .catch(err => {
        expect(commonMocks.isUnsupportedParamErr(err)).toBe(true);
        done();
      });
  });

});
