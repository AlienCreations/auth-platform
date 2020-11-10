'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteTenantAccessRole = require('../../../../server/core/models/tenantAccessRole/methods/deleteTenantAccessRole'),
      commonMocks            = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID   = 99999,
      FAKE_MALFORMED_ID = 'asd';

let KNOWN_TEST_ID;

describe('deleteTenantAccessRole', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessRoles.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('deletes a tenantAccessRole record when given a known tenantAccessRole id', done => {
    deleteTenantAccessRole(KNOWN_TEST_ID).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('fails gracefully when given an unknown tenantAccessRole id', done => {
    deleteTenantAccessRole(FAKE_UNKNOWN_ID).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  // ID
  it('throws an error when id is missing', () => {
    expect(() => {
      deleteTenantAccessRole();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed id', () => {
    expect(() => {
      deleteTenantAccessRole(FAKE_MALFORMED_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
