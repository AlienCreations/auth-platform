'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      uuid         = require('uuid/v4'),
      converter    = new CSVConverter({});

const getCloudUsersByUuids = require('../../../../server/core/models/cloudUser/methods/getCloudUsersByUuids'),
      commonMocks          = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUIDS = [uuid(), uuid()];

let KNOWN_TEST_UUIDS;

describe('getCloudUsersByUuids', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, _data) => {
      const data = R.reject(R.propEq(0, 'status'))(_data);

      const uuid1 = R.compose(R.prop('uuid'), R.head)(data),
            uuid2 = R.compose(R.prop('uuid'), R.last)(data);

      KNOWN_TEST_UUIDS = [uuid1, uuid2];

      done();
    });
  });

  it('gets a cloud user when given valid uuids', done => {
    getCloudUsersByUuids(KNOWN_TEST_UUIDS)
      .then(data => {
        expect(data.length).toBe(KNOWN_TEST_UUIDS.length);
        done();
      })
      .catch(done.fail);
  });

  it('returns undefined when given unknown uuids', done => {
    getCloudUsersByUuids(FAKE_UNKNOWN_UUIDS)
      .then(res => {
        expect(res).toEqual([]);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed uuids', () => {
    expect(() => {
      getCloudUsersByUuids('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an uuid of type other than Array', () => {
    expect(() => {
      getCloudUsersByUuids(123);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when uuids are missing', () => {
    expect(() => {
      getCloudUsersByUuids();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when uuids are set to null', () => {
    expect(() => {
      getCloudUsersByUuids(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });
});
