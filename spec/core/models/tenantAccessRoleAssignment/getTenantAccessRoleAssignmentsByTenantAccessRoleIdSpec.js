'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentsByTenantAccessRoleId = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByTenantAccessRoleId'),
      commonMocks                                        = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ACCESS_ROLE_ID;

describe('getTenantAccessRoleAssignmentsByTenantAccessRoleId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_ROLE_ID = R.compose(R.prop('tenantAccessRoleId'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessRoleAssignments when given a tenantAccessRoleId of type Number', done => {
    getTenantAccessRoleAssignmentsByTenantAccessRoleId(KNOWN_TEST_TENANT_ACCESS_ROLE_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(
        R.compose(
          R.all(R.equals(KNOWN_TEST_TENANT_ACCESS_ROLE_ID)),
          R.pluck('tenantAccessRoleId')
        )(data)
      ).toBe(true);
      done();
    });
  });

  it('throws an error when given a tenantAccessRoleId of type String', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantAccessRoleId('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantAccessRoleId();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative tenantAccessRoleId', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantAccessRoleId(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantAccessRoleId('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantAccessRoleId', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByTenantAccessRoleId(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
