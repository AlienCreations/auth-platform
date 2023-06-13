'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getCloudUserByUuid = require('../../../../server/core/models/cloudUser/methods/getCloudUserByUuid'),
      commonMocks        = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID = commonMocks.COMMON_UUID;

let KNOWN_TEST_UUID;

describe('getCloudUserByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('gets a cloud user when given a valid uuid', done => {
    getCloudUserByUuid(KNOWN_TEST_UUID)
      .then(data => {
        expect(R.type(data.id)).toBe('Number');
        done();
      })
      .catch(done.fail);
  });

  it('returns undefined when given an unknown uuid', done => {
    getCloudUserByUuid(FAKE_UNKNOWN_UUID)
      .then(res => {
        expect(res).toEqual(undefined);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      getCloudUserByUuid('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an uuid of type other than String', () => {
    expect(() => {
      getCloudUserByUuid(123);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when uuid is missing', () => {
    expect(() => {
      getCloudUserByUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when uuid is set to null', () => {
    expect(() => {
      getCloudUserByUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
