'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getProspectUserByEmail = require('../../../../server/core/models/prospectUser/methods/getProspectUserByEmail'),
      commonMocks            = require('../../../_helpers/commonMocks');

let KNOWN_TEST_EMAIL;

describe('getProspectUserByEmail', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/prospectUsers.csv'), (err, data) => {
      KNOWN_TEST_EMAIL = R.compose(R.prop('email'), R.head)(data);
      done();
    });
  });

  it('gets a prospect user when given a valid email', done => {
    getProspectUserByEmail(KNOWN_TEST_EMAIL).then(data => {
      expect(R.type(data.id)).toBe('Number');
      done();
    });
  });

  it('throws an error when given an unknown email', done => {
    getProspectUserByEmail('foo@bar.com')
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed email', () => {
    expect(() => {
      getProspectUserByEmail('foo');
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an email of type other than String', () => {
    expect(() => {
      getProspectUserByEmail(123);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when email is missing', () => {
    expect(() => {
      getProspectUserByEmail();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when email is set to null', () => {
    expect(() => {
      getProspectUserByEmail(null);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
