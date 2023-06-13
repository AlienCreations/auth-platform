'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAgentByUuid = require('../../../../server/core/models/agent/methods/getAgentByUuid'),
      commonMocks    = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'foo',
      A_POSITIVE_NUMBER   = 1338;

let KNOWN_TEST_UUID;

describe('getAgentByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {
      KNOWN_TEST_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('gets an agent when given a known uuid', done => {
    getAgentByUuid(KNOWN_TEST_UUID).then(data => {
      expect(R.is(Object, data)).toBe(true);
      done();
    });
  });

  it('throws an error when given an unknown uuid', done => {
    getAgentByUuid(FAKE_UNKNOWN_UUID)
      .then(done.fail)
      .catch(err => {
        expect(err.message).toEqual(commonMocks.noResultsErr.message);
        done();
      });
  });

  it('throws an error when given a malformed uuid', () => {
    expect(() => {
      getAgentByUuid(FAKE_MALFORMED_UUID);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an uuid of type other than String', () => {
    expect(() => {
      getAgentByUuid(A_POSITIVE_NUMBER);
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when uuid is missing', () => {
    expect(() => {
      getAgentByUuid();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when uuid is set to null', () => {
    expect(() => {
      getAgentByUuid(null);
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

});
