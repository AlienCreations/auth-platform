'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getProspectUserByUuid = require('../../../../server/core/models/prospectUser/methods/getProspectUserByUuid'),
      commonMocks            = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_PROSPECT_USER_UUID;

describe('getProspectUserByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectUsers.csv'), (err, data) => {
      KNOWN_TEST_PROSPECT_USER_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('gets a prospect user when given a valid uuid', done => {
    getProspectUserByUuid(KNOWN_TEST_PROSPECT_USER_UUID)
      .then(data => {
        expect(R.type(data.id)).toBe('Number');
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unknown uuid', done => {
    getProspectUserByUuid(FAKE_UNKNOWN_UUID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      getProspectUserByUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an uuid of type other than String', () => {
    expect(() => {
      getProspectUserByUuid(123);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when uuid is missing', () => {
    expect(() => {
      getProspectUserByUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when uuid is set to null', () => {
    expect(() => {
      getProspectUserByUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
