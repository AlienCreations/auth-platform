'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantAccessRolesByTenantId = require('../../../../server/core/models/tenantAccessRole/methods/getTenantAccessRolesByTenantId'),
      commonMocks                    = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ID;

describe('getTenantAccessRolesByTenantId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ID = R.compose(R.prop('tenantId'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantAccessRoles when given a tenantId of type Number', done => {
    getTenantAccessRolesByTenantId(KNOWN_TEST_TENANT_ID).then(data => {
      expect(R.is(Array, data)).toBe(true);
      expect(
        R.compose(
          R.all(R.equals(KNOWN_TEST_TENANT_ID)),
          R.pluck('tenantId')
        )(data)
      ).toBe(true);
      done();
    });
  });

  it('throws an error when given a tenantId of type String', () => {
    expect(() => {
      getTenantAccessRolesByTenantId('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantAccessRolesByTenantId();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative tenantId', () => {
    expect(() => {
      getTenantAccessRolesByTenantId(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantAccessRolesByTenantId('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantId', () => {
    expect(() => {
      getTenantAccessRolesByTenantId(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
