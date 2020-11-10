'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createTenantAccessRoleAssignment = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/createTenantAccessRoleAssignment'),
      commonMocks                      = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const KNOWN_TEST_TENANT_ACCESS_ROLE_ID                   = 1,
      KNOWN_TEST_UNMAPPED_CLOUD_USER_ID                  = 4,
      FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA            = {
        tenantAccessRoleId : KNOWN_TEST_TENANT_ACCESS_ROLE_ID,
        cloudUserId        : KNOWN_TEST_UNMAPPED_CLOUD_USER_ID,
        status             : 1
      },
      FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_INCOMPLETE = R.omit(['tenantAccessRoleId'], FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA);

let FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_CLOUD_USER_ID,
    mergeInsertId;

describe('tenantAccessRoleAssignmentCtrl.createTenantAccessRoleAssignment', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {

      FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_CLOUD_USER_ID = R.compose(
        R.mergeDeepRight(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA),
        R.objOf('cloudUserId'),
        R.prop('cloud_user_id'),
        R.head
      )(data);

      mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.length)(data));
      done();
    });
  });

  it('returns FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA when creating an tenantAccessRoleAssignment with all correct params', done => {
    createTenantAccessRoleAssignment(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(R.omit(COMMON_PRIVATE_FIELDS, mergeInsertId(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA)));
        done();
      });
  });

  it('throws an error when creating an tenantAccessRoleAssignment with incomplete params', done => {
    createTenantAccessRoleAssignment(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_INCOMPLETE)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate tenantAccessRoleAssignment (cloudUserId should be unique per tenantAccessRole)', done => {
    createTenantAccessRoleAssignment(FAKE_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA_WITH_KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_CLOUD_USER_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.duplicateRecordErr.message);
        done();
      });
  });
});
