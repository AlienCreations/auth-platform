'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAgentByKey = require('../../../../server/core/models/agent/methods/getAgentByKey'),
      commonMocks   = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_KEY   = 'a9e1f2941aa53ca4563833d9d',
      FAKE_MALFORMED_KEY = 1234,
      A_POSITIVE_NUMBER  = 1338;

let KNOWN_TEST_KEY;

describe('getAgentByKey', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {
      KNOWN_TEST_KEY = R.compose(R.prop('key'), R.head)(data);
      done();
    });
  });

  it('gets an agent when given a known key', done => {
    getAgentByKey(KNOWN_TEST_KEY).then(data => {
      expect(R.is(Object, data)).toBe(true);
      done();
    });
  });

  it('throws an error when given an unknown key', done => {
    getAgentByKey(FAKE_UNKNOWN_KEY)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed key', () => {
    expect(() => {
      getAgentByKey(FAKE_MALFORMED_KEY);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an key of type other than String', () => {
    expect(() => {
      getAgentByKey(A_POSITIVE_NUMBER);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when key is missing', () => {
    expect(() => {
      getAgentByKey();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when key is set to null', () => {
    expect(() => {
      getAgentByKey(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

});
