'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentsByTenantAccessRoleUuid = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByTenantAccessRoleUuid');

const FAKE_UNKNOWN_TENANT_ACCESS_ROLE_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_ACCESS_ROLE_UUID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA,
    KNOWN_TEST_TENANT_ACCESS_ROLE_UUID;

describe('tenantAccessRoleAssignmentCtrl.getTenantAccessRoleAssignmentsByTenantAccessRoleUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, _data) => {
      const data = R.compose(
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps
      )(_data);

      KNOWN_TEST_TENANT_ACCESS_ROLE_UUID            = R.compose(R.prop('tenantAccessRoleUuid'), R.head)(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA = R.filter(R.propEq(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID, 'tenantAccessRoleUuid'), data);

      done();
    });
  });

  it('returns accessRoleAssignmentData when looking for accessRoleAssignments by tenantAccessRoleUuid', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleUuid(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID)
      .then(res => {
        const refUuids = R.pluck('id');
        expect(refUuids(res).sort())
          .toEqual(refUuids(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA).sort());
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for accessRoleAssignments for a role that does not exist', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleUuid(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_UUID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantAccessRoleUuid', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleUuid(FAKE_MALFORMED_TENANT_ACCESS_ROLE_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an accessRoleAssignment without a tenantAccessRoleUuid', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
