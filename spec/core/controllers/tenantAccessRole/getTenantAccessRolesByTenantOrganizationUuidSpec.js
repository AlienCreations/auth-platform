'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRolesByTenantOrganizationUuid = require('../../../../server/core/controllers/api/tenantAccessRole/getTenantAccessRolesByTenantOrganizationUuid');

const FAKE_UNKNOWN_TENANT_ORGANIZATION_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_ORGANIZATION_UUID = 'foo';

let KNOWN_TEST_ACCESS_ROLE_DATA,
    KNOWN_TEST_TENANT_ORGANIZATION_UUID;

describe('tenantAccessRoleCtrl.getTenantAccessRolesByTenantOrganizationUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, _data) => {
      const data = R.compose(
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps
      )(_data);

      KNOWN_TEST_TENANT_ORGANIZATION_UUID = R.compose(R.prop('tenantOrganizationUuid'), R.last)(data);
      KNOWN_TEST_ACCESS_ROLE_DATA         = R.filter(R.propEq(KNOWN_TEST_TENANT_ORGANIZATION_UUID, 'tenantOrganizationUuid'), data);

      done();
    });
  });

  it('returns data when looking for tenantAccessRoles by tenantOrganizationUuid', done => {
    getTenantAccessRolesByTenantOrganizationUuid(KNOWN_TEST_TENANT_ORGANIZATION_UUID)
      .then(res => {
        const refUuids = R.pluck('uuid');
        expect(refUuids(res).sort())
          .toEqual(refUuids(KNOWN_TEST_ACCESS_ROLE_DATA).sort());
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for members from a tenant that does not exist', done => {
    getTenantAccessRolesByTenantOrganizationUuid(FAKE_UNKNOWN_TENANT_ORGANIZATION_UUID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantOrganizationUuid', done => {
    getTenantAccessRolesByTenantOrganizationUuid(FAKE_MALFORMED_TENANT_ORGANIZATION_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an member without a tenantOrganizationUuid', done => {
    getTenantAccessRolesByTenantOrganizationUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRolesByTenantOrganizationUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
