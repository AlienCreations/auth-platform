'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const deleteAgent = require('../../../../server/core/models/agent/methods/deleteAgent'),
      commonMocks = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'foo',
      A_POSITIVE_NUMBER   = 1000;

let KNOWN_TEST_UUID;

describe('deleteAgent', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {
      KNOWN_TEST_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('deletes an agent record when given a known agent uuid', done => {
    deleteAgent(KNOWN_TEST_UUID)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an unknown agent uuid', done => {
    deleteAgent(FAKE_UNKNOWN_UUID)
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  // KEY
  it('throws an error when uuid is missing', () => {
    expect(() => {
      deleteAgent();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an uuid of type other than String', () => {
    expect(() => {
      deleteAgent(A_POSITIVE_NUMBER);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      deleteAgent(FAKE_MALFORMED_UUID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
