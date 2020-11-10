'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentsByTenantAccessRoleId = require('../../../../server/core/controllers/api/tenantAccessRoleAssignment/getTenantAccessRoleAssignmentsByTenantAccessRoleId');

const sortAndTransform = R.compose(R.sortBy(R.prop('referenceId')), commonMocks.transformDbColsToJsProps);

const FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ID   = 999,
      FAKE_MALFORMED_TENANT_ACCESS_ROLE_ID = 'foo';

let KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA,
    KNOWN_TEST_TENANT_ACCESS_ROLE_ID;

describe('tenantAccessRoleAssignmentCtrl.getTenantAccessRoleAssignmentsByTenantAccessRoleId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, _data) => {

      const data = sortAndTransform(_data);

      KNOWN_TEST_TENANT_ACCESS_ROLE_ID              = R.compose(R.prop('tenantAccessRoleId'), R.head)(data);
      KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA = R.filter(R.propEq('tenantAccessRoleId', KNOWN_TEST_TENANT_ACCESS_ROLE_ID), data);

      done();
    });
  });

  it('returns accessRoleAssignmentData when looking for accessRoleAssignments by tenantAccessRoleId', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleId(KNOWN_TEST_TENANT_ACCESS_ROLE_ID)
      .then(res => {
        const refIds = R.pluck('id');
        expect(refIds(res).sort())
          .toEqual(refIds(KNOWN_TEST_TENANT_ACCESS_ROLE_ASSIGNMENT_DATA).sort());
        done();
      });
  });

  it('fails gracefully when looking for accessRoleAssignments for a role that does not exist', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleId(FAKE_UNKNOWN_TENANT_ACCESS_ROLE_ID)
      .then(res => {
        expect(res).toEqual([]);
        done();
      });
  });

  it('throws an error when given a malformed tenantAccessRoleId', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleId(FAKE_MALFORMED_TENANT_ACCESS_ROLE_ID)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an accessRoleAssignment without a tenantAccessRoleId', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleId()
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleId(null)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });
});
