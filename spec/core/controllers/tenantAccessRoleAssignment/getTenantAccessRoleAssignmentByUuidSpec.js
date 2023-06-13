'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentByUuid = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentByUuid');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA,
    KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID;

describe('tenantAccessRoleAssignmentCtrl.getTenantAccessRoleAssignmentByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID = KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA.uuid;
      done();
    });
  });

  it('returns tenantAccessRoleAssignmentData when looking for an tenantAccessRoleAssignment by uuid', done => {
    getTenantAccessRoleAssignmentByUuid(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID)
      .then(res => {
        expect(res.cloudUserUuid)
          .toEqual(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA.cloudUserUuid);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an tenantAccessRoleAssignment that does not exist', done => {
    getTenantAccessRoleAssignmentByUuid(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed uuid', done => {
    getTenantAccessRoleAssignmentByUuid(FAKE_MALFORMED_TENANT_ACCESS_ROLE_ASSIGNMENT_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an tenantAccessRoleAssignment without an uuid', done => {
    getTenantAccessRoleAssignmentByUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRoleAssignmentByUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
