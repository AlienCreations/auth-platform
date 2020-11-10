'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantById = require('../../../../server/core/models/tenant/methods/getTenantById'),
      commonMocks   = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_ID;

describe('getTenantById', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenants.csv'), (err, data) => {
      KNOWN_TEST_TENANT_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('gets a tenant when given an id of type Number', done => {
    getTenantById(KNOWN_TEST_TENANT_ID).then(data => {
      expect(R.is(Object, data)).toBe(true);
      expect(R.prop('id', data)).toBe(KNOWN_TEST_TENANT_ID);
      done();
    });
  });

  it('throws an error when given an id of type String', () => {
    expect(() => {
      getTenantById('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative id', () => {
    expect(() => {
      getTenantById(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantById('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null id', () => {
    expect(() => {
      getTenantById(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
