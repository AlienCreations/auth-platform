'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentsByCloudUserId = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByCloudUserId'),
      commonMocks                                 = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID;

describe('getTenantAccessRoleAssignmentsByCloudUserId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID = R.compose(R.prop('cloudUserId'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessRoleAssignments when given a cloudUserId of type Number', done => {
    getTenantAccessRoleAssignmentsByCloudUserId(KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(
        R.compose(
          R.all(R.equals(KNOWN_TEST_TENANT_ACCESS_RESOURCE_ID)),
          R.pluck('cloudUserId')
        )(data)
      ).toBe(true);
      done();
    });
  });

  it('throws an error when given a cloudUserId of type String', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByCloudUserId('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByCloudUserId();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative cloudUserId', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByCloudUserId(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByCloudUserId('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null cloudUserId', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByCloudUserId(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
