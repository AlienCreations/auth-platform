'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentById = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentById');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config);

const FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ASSIGNMENT_ID   = 9999,
      FAKE_MALFORMED_TENANT_ACCESS_ROLE_ASSIGNMENT_ID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA,
    KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_ID;

describe('tenantAccessRoleAssignmentCtrl.getTenantAccessRoleAssignmentById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA = R.compose(R.omit(COMMON_PRIVATE_FIELDS), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_ID   = KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA.id;
      done();
    });
  });

  it('returns tenantAccessRoleAssignmentData when looking for an tenantAccessRoleAssignment by id', done => {
    getTenantAccessRoleAssignmentById(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_ID)
      .then(res => {
        expect(res.cloudUserId)
          .toEqual(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA.cloudUserId);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an tenantAccessRoleAssignment that does not exist', done => {
    getTenantAccessRoleAssignmentById(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ASSIGNMENT_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed id', done => {
    getTenantAccessRoleAssignmentById(FAKE_MALFORMED_TENANT_ACCESS_ROLE_ASSIGNMENT_ID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an tenantAccessRoleAssignment without an id', done => {
    getTenantAccessRoleAssignmentById()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRoleAssignmentById(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
