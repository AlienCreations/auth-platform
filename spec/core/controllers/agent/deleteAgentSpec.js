'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({}),
      commonMocks  = require('../../../_helpers/commonMocks'),
      deleteAgent  = require('../../../../server/core/controllers/api/agent/deleteAgent');

const FAKE_UNKNOWN_UUID   = commonMocks.COMMON_UUID,
      FAKE_MALFORMED_UUID = 1234;

let KNOWN_TEST_AGENT_UUID;

describe('agentCtrl.deleteAgent', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {
      KNOWN_TEST_AGENT_UUID = R.compose(R.prop('uuid'), R.head)(data);
      done();
    });
  });

  it('successfully deletes an agent', done => {
    deleteAgent(KNOWN_TEST_AGENT_UUID)
      .then(res => {
        expect(res).toEqual(commonMocks.COMMON_DB_UPDATE_OR_DELETE_RESPONSE);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when attempting to delete an agent that is not in the database', done => {
    deleteAgent(FAKE_UNKNOWN_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when given a malformed key', done => {
    deleteAgent(FAKE_MALFORMED_UUID)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isIllegalParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an agent with no params', done => {
    deleteAgent()
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when deleting an agent with null params', done => {
    deleteAgent(null)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });
});
