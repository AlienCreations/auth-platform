'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteAgent = require('../../../../server/core/models/agent/methods/deleteAgent'),
      commonMocks = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_KEY   = 'x41d8cd98f00b204e9800998e',
      FAKE_MALFORMED_KEY = 1234,
      A_POSITIVE_NUMBER  = 1000;

let KNOWN_TEST_KEY;

describe('deleteAgent', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {
      KNOWN_TEST_KEY = R.compose(R.prop('key'), R.head)(data);
      done();
    });
  });

  it('deletes an agent record when given a known agent key', done => {
    deleteAgent(KNOWN_TEST_KEY).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('fails gracefully when given an unknown agent key', done => {
    deleteAgent(FAKE_UNKNOWN_KEY).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  // KEY
  it('throws an error when key is missing', () => {
    expect(() => {
      deleteAgent();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an key of type other than String', () => {
    expect(() => {
      deleteAgent(A_POSITIVE_NUMBER);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed key', () => {
    expect(() => {
      deleteAgent(FAKE_MALFORMED_KEY);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
