'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantConnection = require('../../../../server/core/models/tenantConnection/methods/deleteTenantConnection'),
      commonMocks            = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID   = 99999,
      FAKE_MALFORMED_ID = 'asd';

let KNOWN_TEST_ID;

describe('deleteTenantConnection', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('deletes an tenantConnection record when given a known tenantConnection id', done => {
    deleteTenantConnection(KNOWN_TEST_ID).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('fails gracefully when given an unknown tenantConnection id', done => {
    deleteTenantConnection(FAKE_UNKNOWN_ID).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  // ID
  it('throws an error when id is missing', () => {
    expect(() => {
      deleteTenantConnection();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed id', () => {
    expect(() => {
      deleteTenantConnection(FAKE_MALFORMED_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
