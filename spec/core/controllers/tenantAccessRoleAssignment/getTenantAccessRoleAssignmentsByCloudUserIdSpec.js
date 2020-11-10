'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentsByCloudUserId = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByCloudUserId');

const sortAndTransform = R.compose(R.sortBy(R.prop('referenceId')), commonMocks.transformDbColsToJsProps);

const FAKE_UNKNOWN_CLOUD_USER_ID   = 999,
      FAKE_MALFORMED_CLOUD_USER_ID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA,
    KNOWN_TEST_CLOUD_USER_ID;

describe('tenantAccessRoleAssignmentCtrl.getTenantAccessRoleAssignmentsByCloudUserId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, _data) => {

      const data = sortAndTransform(_data);

      KNOWN_TEST_CLOUD_USER_ID                      = R.compose(R.prop('cloudUserId'), R.head)(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA = R.filter(R.propEq('cloudUserId', KNOWN_TEST_CLOUD_USER_ID), data);

      done();
    });
  });

  it('returns accessRoleAssignmentData when looking for accessRoleAssignments by cloudUserId', done => {
    getTenantAccessRoleAssignmentsByCloudUserId(KNOWN_TEST_CLOUD_USER_ID)
      .then(res => {
        const refIds = R.pluck('id');
        expect(refIds(res).sort())
          .toEqual(refIds(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA).sort());
        done();
      });
  });

  it('fails gracefully when looking for accessRoleAssignments for a cloud user that does not exist', done => {
    getTenantAccessRoleAssignmentsByCloudUserId(FAKE_UNKNOWN_CLOUD_USER_ID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      });
  });

  it('throws an error when given a malformed cloudUserId', done => {
    getTenantAccessRoleAssignmentsByCloudUserId(FAKE_MALFORMED_CLOUD_USER_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an accessRoleAssignment without a cloudUserId', done => {
    getTenantAccessRoleAssignmentsByCloudUserId()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRoleAssignmentsByCloudUserId(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
