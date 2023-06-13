'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getTenantMemberByUuid = require('../../../../server/core/models/tenantMember/methods/getTenantMemberByUuid'),
      commonMocks           = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'xxx';

let KNOWN_TEST_UUID;

describe('getTenantMemberByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantMembers.csv'), (err, data) => {
      KNOWN_TEST_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('gets a tenantMember when given a known uuid', done => {
    getTenantMemberByUuid(KNOWN_TEST_UUID)
      .then(data => {
        expect(R.is(Object, data)).toBe(true);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unknown uuid', done => {
    getTenantMemberByUuid(FAKE_UNKNOWN_UUID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      getTenantMemberByUuid(FAKE_MALFORMED_UUID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when uuid is missing', () => {
    expect(() => {
      getTenantMemberByUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when uuid is set to null', () => {
    expect(() => {
      getTenantMemberByUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
