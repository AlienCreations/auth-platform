'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantAccessResource = require('../../../../server/core/models/tenantAccessResource/methods/deleteTenantAccessResource'),
      commonMocks                = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID   = 99999,
      FAKE_MALFORMED_ID = 'asd';

let KNOWN_TEST_ID;

describe('deleteTenantAccessResource', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('deletes a tenantAccessResource record when given a known tenantAccessResource id', done => {
    deleteTenantAccessResource(KNOWN_TEST_ID).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('fails gracefully when given an unknown tenantAccessResource id', done => {
    deleteTenantAccessResource(FAKE_UNKNOWN_ID).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  // ID
  it('throws an error when id is missing', () => {
    expect(() => {
      deleteTenantAccessResource();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed id', () => {
    expect(() => {
      deleteTenantAccessResource(FAKE_MALFORMED_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
