'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantMember = require('../../../../server/core/models/tenantMember/methods/deleteTenantMember'),
      commonMocks        = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID   = 99999,
      FAKE_MALFORMED_ID = 'asd';

let KNOWN_TEST_ID;

describe('deleteTenantMember', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('deletes an tenantMember record when given a known tenantMember id', done => {
    deleteTenantMember(KNOWN_TEST_ID).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('fails gracefully when given an unknown tenantMember id', done => {
    deleteTenantMember(FAKE_UNKNOWN_ID).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  // ID
  it('throws an error when id is missing', () => {
    expect(() => {
      deleteTenantMember();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed id', () => {
    expect(() => {
      deleteTenantMember(FAKE_MALFORMED_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
