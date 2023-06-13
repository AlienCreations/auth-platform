'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentsByTenantAccessRoleUuid = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByTenantAccessRoleUuid'),
      commonMocks                                          = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ACCESS_ROLE_UUID;

describe('getTenantAccessRoleAssignmentsByTenantAccessRoleUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_ROLE_UUID = R.compose(R.prop('tenantAccessRoleUuid'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessRoleAssignments when given a valid tenantAccessRoleUuid', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleUuid(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(
          R.compose(
            R.all(R.equals(KNOWN_TEST_TENANT_ACCESS_ROLE_UUID)),
            R.pluck('tenantAccessRoleUuid')
          )(data)
        ).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantAccessRoleUuid', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantAccessRoleUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantAccessRoleUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null tenantAccessRoleUuid', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantAccessRoleUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
