'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRolesByTenantUuid = require('../../../../server/core/models/tenantAccessRole/methods/getTenantAccessRolesByTenantUuid'),
      commonMocks                      = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_UUID;

describe('getTenantAccessRolesByTenantUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_TENANT_UUID = R.compose(R.prop('tenantUuid'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessRoles when given a tenantUuid of type Number', done => {
    getTenantAccessRolesByTenantUuid(KNOWN_TEST_TENANT_UUID)
      .then(data => {
        expect(R.is(Array, data)).toBe(true);
        expect(
          R.compose(
            R.all(R.equals(KNOWN_TEST_TENANT_UUID)),
            R.pluck('tenantUuid')
          )(data)
        ).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed tenantUuid', () => {
    expect(() => {
      getTenantAccessRolesByTenantUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessRolesByTenantUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a null tenantUuid', () => {
    expect(() => {
      getTenantAccessRolesByTenantUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
