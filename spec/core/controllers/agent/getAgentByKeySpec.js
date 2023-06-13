'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAgentByKey = require('../../../../server/core/controllers/api/agent/getAgentByKey');

const FAKE_UNKNOWN_KEY   = 'foo',
      FAKE_MALFORMED_KEY = 1234;

let KNOWN_TEST_KEY,
    KNOWN_TEST_AGENT_DATA;

describe('agentCtrl.getAgentByKey', () => {
  beforeAll(done =>  {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {
      KNOWN_TEST_AGENT_DATA = R.compose(R.omit(['secret']), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_KEY        = KNOWN_TEST_AGENT_DATA.key;
      done();
    });
  });

  it('returns agentData when looking for an agent by key', done => {
    getAgentByKey(KNOWN_TEST_KEY)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_AGENT_DATA);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an agent that does not exist', done => {
    getAgentByKey(FAKE_UNKNOWN_KEY)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed key', done => {
    getAgentByKey(FAKE_MALFORMED_KEY)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an agent without an key', done => {
    getAgentByKey()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getAgentByKey(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
