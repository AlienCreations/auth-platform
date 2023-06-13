'use strict';

const R                                = require('ramda'),
      path                             = require('path'),
      commonMocks                      = require('../../../_helpers/commonMocks'),
      CSVConverter                     = require('csvtojson').Converter,
      tenantAccessPermissionsConverter = new CSVConverter({}),
      tenantAccessResourcesConverter   = new CSVConverter({});

const getTenantAccessPermissionsByTenantOrganizationUuid = require('../../../../server/core/controllers/api/tenantAccessPermission/getTenantAccessPermissionsByTenantOrganizationUuid');

const FAKE_UNKNOWN_TENANT_ORGANIZATION_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_ORGANIZATION_UUID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA,
    KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUIDS,
    KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA,
    KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID,
    KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUIDS_FOR_MAPPED_ORGANIZATION;

describe('tenantAccessPermissionCtrl.getTenantAccessPermissionsByTenantOrganizationUuid', () => {
  beforeAll(done => {
    tenantAccessResourcesConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA     = R.compose(commonMocks.ensureTrueNullInCsvData, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID = R.compose(
        R.prop('tenantOrganizationUuid'),
        R.find(R.propSatisfies(R.identity, 'tenantOrganizationUuid'))
      )(KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA);

      KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUIDS = R.compose(
        R.pluck('uuid'),
        R.filter(R.propEq(KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID, 'tenantOrganizationUuid'))
      )(KNOWN_TEST_TENANT_ACCESS_RESOURCE_DATA);

      tenantAccessPermissionsConverter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessPermissions.csv'), (err, data) => {
        const _data = R.compose(commonMocks.ensureTrueNullInCsvData, commonMocks.transformDbColsToJsProps)(data);

        KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUIDS_FOR_MAPPED_ORGANIZATION = R.compose(
          R.pluck('uuid'),
          R.filter(R.propSatisfies(a => R.includes(a, KNOWN_TEST_TENANT_ACCESS_RESOURCE_UUIDS), 'tenantAccessResourceUuid'))
        )(_data);

        KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA = R.filter(
          R.compose(
            R.includes(
              R.__,
              KNOWN_TEST_TENANT_ACCESS_PERMISSION_UUIDS_FOR_MAPPED_ORGANIZATION
            ),
            R.prop('uuid'))
        )(_data);

        done();
      });
    });
  });

  it('returns permissionData when looking for permissions by tenantOrganizationUuid', done => {
    getTenantAccessPermissionsByTenantOrganizationUuid(KNOWN_TEST_MAPPED_TENANT_ORGANIZATION_UUID)
      .then(res => {
        const refUuids = R.pluck('uuid');
        expect(refUuids(res).sort())
          .toEqual(refUuids(KNOWN_TEST_TENANT_ACCESS_PERMISSION_DATA).sort());
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for permissions for a organization that does not exist', done => {
    getTenantAccessPermissionsByTenantOrganizationUuid(FAKE_UNKNOWN_TENANT_ORGANIZATION_UUID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantOrganizationUuid', done => {
    getTenantAccessPermissionsByTenantOrganizationUuid(FAKE_MALFORMED_TENANT_ORGANIZATION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an permission without a tenantOrganizationUuid', done => {
    getTenantAccessPermissionsByTenantOrganizationUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessPermissionsByTenantOrganizationUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
