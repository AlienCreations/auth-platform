'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRolesByTenantId = require('../../../../server/core/controllers/api/tenantAccessRole/getTenantAccessRolesByTenantId');

const sortAndTransform = R.compose(R.sortBy(R.prop('referenceId')), commonMocks.transformDbColsToJsProps);

const FAKE_UNKNOWN_TENANT_ID   = 999,
      FAKE_MALFORMED_TENANT_ID = 'foo';

let KNOWN_TEST_ACCESS_ROLE_DATA,
    KNOWN_TEST_TENANT_ID;

describe('tenantAccessRoleCtrl.getTenantAccessRolesByTenantId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, _data) => {

      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ID        = R.compose(R.prop('tenantId'), R.head)(data);
      KNOWN_TEST_ACCESS_ROLE_DATA = R.filter(R.propEq('tenantId', KNOWN_TEST_TENANT_ID), data);

      done();
    });
  });

  it('returns data when looking for tenantAccessRoles by tenantId', done => {
    getTenantAccessRolesByTenantId(KNOWN_TEST_TENANT_ID)
      .then(res => {
        const refIds = R.pluck('referenceId');
        expect(refIds(res).sort())
          .toEqual(refIds(KNOWN_TEST_ACCESS_ROLE_DATA).sort());
        done();
      });
  });

  it('fails gracefully when looking for members from a tenant that does not exist', done => {
    getTenantAccessRolesByTenantId(FAKE_UNKNOWN_TENANT_ID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      });
  });

  it('throws an error when given a malformed tenantId', done => {
    getTenantAccessRolesByTenantId(FAKE_MALFORMED_TENANT_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an member without a tenantId', done => {
    getTenantAccessRolesByTenantId()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRolesByTenantId(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
