'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRolesByTenantOrganizationId = require('../../../../server/core/controllers/api/tenantAccessRole/getTenantAccessRolesByTenantOrganizationId');

const sortAndTransform = R.compose(R.sortBy(R.prop('referenceId')), commonMocks.transformDbColsToJsProps);

const FAKE_UNKNOWN_TENANT_ORGANIZATION_ID   = 999,
      FAKE_MALFORMED_TENANT_ORGANIZATION_ID = 'foo';

let KNOWN_TEST_ACCESS_ROLE_DATA,
    KNOWN_TEST_TENANT_ORGANIZATION_ID;

describe('tenantAccessRoleCtrl.getTenantAccessRolesByTenantOrganizationId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, _data) => {

      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ORGANIZATION_ID = R.compose(R.prop('tenantOrganizationId'), R.last)(data);
      KNOWN_TEST_ACCESS_ROLE_DATA       = R.filter(R.propEq('tenantOrganizationId', KNOWN_TEST_TENANT_ORGANIZATION_ID), data);

      done();
    });
  });

  it('returns data when looking for tenantAccessRoles by tenantOrganizationId', done => {
    getTenantAccessRolesByTenantOrganizationId(KNOWN_TEST_TENANT_ORGANIZATION_ID)
      .then(res => {
        const refIds = R.pluck('referenceId');
        expect(refIds(res).sort())
          .toEqual(refIds(KNOWN_TEST_ACCESS_ROLE_DATA).sort());
        done();
      });
  });

  it('fails gracefully when looking for members from a tenant that does not exist', done => {
    getTenantAccessRolesByTenantOrganizationId(FAKE_UNKNOWN_TENANT_ORGANIZATION_ID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      });
  });

  it('throws an error when given a malformed tenantOrganizationId', done => {
    getTenantAccessRolesByTenantOrganizationId(FAKE_MALFORMED_TENANT_ORGANIZATION_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an member without a tenantOrganizationId', done => {
    getTenantAccessRolesByTenantOrganizationId()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRolesByTenantOrganizationId(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
