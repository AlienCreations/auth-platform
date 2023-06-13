'use strict';

const R            = require('ramda'),
      path         = require('path'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const getAgentByUuid = require('../../../../server/core/controllers/api/agent/getAgentByUuid');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 'foo';

let KNOWN_TEST_UUID,
    KNOWN_TEST_AGENT_DATA;

describe('agentCtrl.getAgentByUuid', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {
      KNOWN_TEST_AGENT_DATA = R.compose(R.omit(['secret']), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_UUID       = KNOWN_TEST_AGENT_DATA.uuid;
      done();
    });
  });

  it('returns agentData when looking for an agent by uuid', done => {
    getAgentByUuid(KNOWN_TEST_UUID)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(KNOWN_TEST_AGENT_DATA);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when looking for an agent that does not exist', done => {
    getAgentByUuid(FAKE_UNKNOWN_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed uuid', done => {
    getAgentByUuid(FAKE_MALFORMED_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when looking for an agent without an uuid', done => {
    getAgentByUuid()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given null params', done => {
    getAgentByUuid(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
