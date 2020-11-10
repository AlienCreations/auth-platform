'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantMemberById = require('../../../../server/core/models/tenantMember/methods/getTenantMemberById'),
      commonMocks         = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID   = 99999,
      FAKE_MALFORMED_ID = 'xxx';

let KNOWN_TEST_ID;

describe('getTenantMemberById', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('gets a tenantMember when given a known id', done => {
    getTenantMemberById(KNOWN_TEST_ID).then(data => {
      expect(R.is(Object, data)).toBe(true);
      done();
    });
  });

  it('throws an error when given an unknown id', done => {
    getTenantMemberById(FAKE_UNKNOWN_ID)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed id', () => {
    expect(() => {
      getTenantMemberById(FAKE_MALFORMED_ID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when id is missing', () => {
    expect(() => {
      getTenantMemberById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when id is set to null', () => {
    expect(() => {
      getTenantMemberById(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
