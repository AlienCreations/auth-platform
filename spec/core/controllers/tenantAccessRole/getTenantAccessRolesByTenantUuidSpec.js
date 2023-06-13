'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRolesByTenantUuid = require('../../../../server/core/controllers/api/tenantAccessRole/getTenantAccessRolesByTenantUuid');

const FAKE_UNKNOWN_TENANT_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_TENANT_UUID = 'foo';

let KNOWN_TEST_ACCESS_ROLE_DATA,
    KNOWN_TEST_TENANT_UUID;

describe('tenantAccessRoleCtrl.getTenantAccessRolesByTenantUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, _data) => {
      const data = R.compose(
        commonMocks.ensureTrueNullInCsvData,
        commonMocks.transformDbColsToJsProps
      )(_data);

      KNOWN_TEST_TENANT_UUID      = R.compose(R.prop('tenantUuid'), R.head)(data);
      KNOWN_TEST_ACCESS_ROLE_DATA = R.filter(R.propEq(KNOWN_TEST_TENANT_UUID, 'tenantUuid'), data);

      done();
    });
  });

  it('returns data when looking for tenantAccessRoles by tenantUuid', done => {
    getTenantAccessRolesByTenantUuid(KNOWN_TEST_TENANT_UUID)
      .then(res => {
        const refUuids = R.pluck('uuid');
        expect(refUuids(res).sort())
          .toEqual(refUuids(KNOWN_TEST_ACCESS_ROLE_DATA).sort());
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when looking for members from a tenant that does not exist', done => {
    getTenantAccessRolesByTenantUuid(FAKE_UNKNOWN_TENANT_UUID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantUuid', done => {
    getTenantAccessRolesByTenantUuid(FAKE_MALFORMED_TENANT_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an member without a tenantUuid', done => {
    getTenantAccessRolesByTenantUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRolesByTenantUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
