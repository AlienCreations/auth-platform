'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantConnectionsByTenantId = require('../../../../server/core/models/tenantConnection/methods/getTenantConnectionsByTenantId'),
      commonMocks                    = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ID;

describe('getTenantConnectionsByTenantId', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ID = R.compose(R.prop('tenantId'), R.head, commonMocks.transformDbColsToJsProps)(data);
      done();
    });
  });

  it('gets a list of tenantConnections when given a tenantId of type Number', done => {
    getTenantConnectionsByTenantId(KNOWN_TEST_TENANT_ID).then(data => {
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
      getTenantConnectionsByTenantId('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantConnectionsByTenantId();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative tenantId', () => {
    expect(() => {
      getTenantConnectionsByTenantId(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantConnectionsByTenantId('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null tenantId', () => {
    expect(() => {
      getTenantConnectionsByTenantId(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
