'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAgentById = require('../../../../server/core/models/agent/methods/getAgentById'),
      commonMocks  = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID = 123,
      A_STRING        = 'foo';

let KNOWN_TEST_ID;

describe('getAgentById', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {
      KNOWN_TEST_ID = R.compose(R.prop('id'), R.head)(data);
      done();
    });
  });

  it('gets an agent when given a known id', done => {
    getAgentById(KNOWN_TEST_ID).then(data => {
      expect(R.is(Object, data)).toBe(true);
      done();
    });
  });

  it('throws an error when given an unknown id', done => {
    getAgentById(FAKE_UNKNOWN_ID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given an id of type other than Number', () => {
    expect(() => {
      getAgentById(A_STRING);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when id is missing', () => {
    expect(() => {
      getAgentById();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when id is set to null', () => {
    expect(() => {
      getAgentById(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

});
