'use strict';

const R                                    = require('ramda'),
      path                                 = require('path'),
      commonMocks                          = require('../../../_helpers/commonMocks'),
      CSVConverter                         = require('csvtojson').Converter,
      tenantAccessRoleAssignmentsConverter = new CSVConverter({}),
      tenantAccessRolesConverter           = new CSVConverter({});

const getTenantAccessRoleAssignmentsByTenantOrganizationUuid = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByTenantOrganizationUuid');

const FAKE_UNKNOWN_TENANT_ORGANIZATION_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_ORGANIZATION_UUID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA,
    KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID,
    KNOWN_TEST_MAPPED_TENANT_ACCESS_ROLE_UUID;

describe('tenantAccessRoleAssignmentCtrl.getTenantAccessRoleAssignmentsByTenantOrganizationUuid', () => {
  beforeAll(done => {
    tenantAccessRolesConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID = R.compose(R.prop('tenantOrganizationUuid'), R.last, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_MAPPED_TENANT_ACCESS_ROLE_UUID  = R.compose(R.prop('tenantAccessRoleUuid'), R.last, commonMocks.transformDbColsToJsProps)(data);

      tenantAccessRoleAssignmentsConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, _data) => {
        const data = R.compose(
          commonMocks.ensureTrueNullInCsvData,
          commonMocks.transformDbColsToJsProps
        )(_data);

        KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA = R.filter(R.propEq(KNOWN_TEST_MAPPED_TENANT_ACCESS_ROLE_UUID, 'tenantAccessRoleUuid'), data);

        done();
      });
    });
  });

  it('returns permissionData when looking for permissions by tenantOrganizationUuid', done => {
    getTenantAccessRoleAssignmentsByTenantOrganizationUuid(KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID)
      .then(res => {
        const refUuids = R.pluck('id');
        expect(refUuids(res).sort())
          .toEqual(refUuids(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA).sort());
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for permissions for a organization that does not exist', done => {
    getTenantAccessRoleAssignmentsByTenantOrganizationUuid(FAKE_UNKNOWN_TENANT_ORGANIZATION_UUID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantOrganizationUuid', done => {
    getTenantAccessRoleAssignmentsByTenantOrganizationUuid(FAKE_MALFORMED_TENANT_ORGANIZATION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an permission without a tenantOrganizationUuid', done => {
    getTenantAccessRoleAssignmentsByTenantOrganizationUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRoleAssignmentsByTenantOrganizationUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
