'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRoleAssignmentsByCloudUserUuid = require('../../../../server/core/models/tenantAccessRoleAssignment/methods/getTenantAccessRoleAssignmentsByCloudUserUuid'),
      commonMocks                                   = require('../../../_helpers/commonMocks');

let KNOWN_TEST_CLOUD_USER_UUID;

describe('getTenantAccessRoleAssignmentsByCloudUserUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoleAssignments.csv'), (err, data) => {
      KNOWN_TEST_CLOUD_USER_UUID = R.compose(R.prop('cloudUserUuid'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessRoleAssignments when given a valid cloudUserUuid', done => {
    getTenantAccessRoleAssignmentsByCloudUserUuid(KNOWN_TEST_CLOUD_USER_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(
          R.compose(
            R.all(R.equals(KNOWN_TEST_CLOUD_USER_UUID)),
            R.pluck('cloudUserUuid')
          )(data)
        ).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed cloudUserUuid', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByCloudUserUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByCloudUserUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null cloudUserUuid', () => {
    expect(() => {
      getTenantAccessRoleAssignmentsByCloudUserUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
