'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getCloudUserByEmail = require('../../../../server/core/models/cloudUser/methods/getCloudUserByEmail'),
      commonMocks         = require('../../../_helpers/commonMocks');

let KNOWN_TEST_EMAIL;

describe('getCloudUserByEmail', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/cloudUsers.csv'), (err, data) => {
      KNOWN_TEST_EMAIL = R.compose(R.prop('email'), R.head)(data);
      done();
    });
  });

  it('gets a cloud user when given a valid email', done => {
    getCloudUserByEmail(KNOWN_TEST_EMAIL).then(data => {
      expect(R.type(data.id)).toBe('Number');
      done();
    });
  });

  it('returns undefined when given an unknown email', done => {
    getCloudUserByEmail('foo@bar.com')
      .then(res => {
        expect(res).toEqual(undefined);
        done();
      });
  });

  it('throws an error when given a malformed email', () => {
    expect(() => {
      getCloudUserByEmail('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an email of type other than String', () => {
    expect(() => {
      getCloudUserByEmail(123);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when email is missing', () => {
    expect(() => {
      getCloudUserByEmail();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when email is set to null', () => {
    expect(() => {
      getCloudUserByEmail(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
