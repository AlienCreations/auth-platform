'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantConnectionById = require('../../../../server/core/models/tenantConnection/methods/getTenantConnectionById'),
      commonMocks             = require('../../../_helpers/commonMocks');

let KNOWN_TEST_TENANT_CONNECTION_ID;

describe('getTenantConnectionById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_TENANT_CONNECTION_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('gets a tenantConnection when given an id of type Number', done => {
    getTenantConnectionById(KNOWN_TEST_TENANT_CONNECTION_ID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        expect(R.prop('id', data)).toBe(KNOWN_TEST_TENANT_CONNECTION_ID);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an id of type String', () => {
    expect(() => {
      getTenantConnectionById('1');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given no params', () => {
    expect(() => {
      getTenantConnectionById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given negative id', () => {
    expect(() => {
      getTenantConnectionById(-22);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a non-numeric string', () => {
    expect(() => {
      getTenantConnectionById('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a null id', () => {
    expect(() => {
      getTenantConnectionById(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
