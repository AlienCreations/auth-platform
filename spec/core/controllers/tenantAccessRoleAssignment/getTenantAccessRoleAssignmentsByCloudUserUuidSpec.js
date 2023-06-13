'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentsByCloudUserUuid = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByCloudUserUuid');

const FAKE_UNKNOWN_CLOUD_USER_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_CLOUD_USER_UUID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA,
    KNOWN_TEST_CLOUD_USER_UUID;

describe('tenantAccessRoleAssignmentCtrl.getTenantAccessRoleAssignmentsByCloudUserUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, _data) => {
      const data = R.compose(
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps
      )(_data);

      KNOWN_TEST_CLOUD_USER_UUID                    = R.compose(R.prop('cloudUserUuid'), R.head)(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA = R.filter(R.propEq(KNOWN_TEST_CLOUD_USER_UUID, 'cloudUserUuid'), data);

      done();
    });
  });

  it('returns accessRoleAssignmentData when looking for accessRoleAssignments by cloudUserUuid', done => {
    getTenantAccessRoleAssignmentsByCloudUserUuid(KNOWN_TEST_CLOUD_USER_UUID)
      .then(res => {
        const refUuids = R.pluck('id');
        expect(refUuids(res).sort())
          .toEqual(refUuids(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA).sort());
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for accessRoleAssignments for a cloud user that does not exist', done => {
    getTenantAccessRoleAssignmentsByCloudUserUuid(FAKE_UNKNOWN_CLOUD_USER_UUID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed cloudUserUuid', done => {
    getTenantAccessRoleAssignmentsByCloudUserUuid(FAKE_MALFORMED_CLOUD_USER_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an accessRoleAssignment without a cloudUserUuid', done => {
    getTenantAccessRoleAssignmentsByCloudUserUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRoleAssignmentsByCloudUserUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
