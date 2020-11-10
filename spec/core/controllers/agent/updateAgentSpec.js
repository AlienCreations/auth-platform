'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      commonMocks  = require('../../../_helpers/commonMocks'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateAgent = require('../../../../server/core/controllers/api/agent/updateAgent');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      AGENT_PRIVATE_FIELDS  = R.path(['api', 'AGENT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, AGENT_PRIVATE_FIELDS);

const FAKE_AGENT_UPDATE_DATA = {
        name   : 'Updated body',
        secret : '$3a$04$krjrytXfZOz00CjYanRaFO9Ut51N21yO6/YfR2rZXU2Bs4ThCPX8x'
      },
      FAKE_UNKNOWN_AGENT_KEY = 'foo';

let KNOWN_TEST_AGENT_DATA,
    KNOWN_TEST_KEY,
    KNOWN_TEST_KEY_2,
    FAKE_AGENT_UPDATE_DATA_EXISTING_KEY,
    updatedAgentData;

const keyLens = R.lensPath(['key']);

describe('agentCtrl.updateAgent', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {
      KNOWN_TEST_AGENT_DATA               = R.compose(R.omit(privateFields), R.head, commonMocks.transformDbColsToJsProps)(data);
      KNOWN_TEST_KEY                      = R.prop('key', KNOWN_TEST_AGENT_DATA);
      KNOWN_TEST_KEY_2                    = R.compose(R.prop('key'), R.last, commonMocks.transformDbColsToJsProps)(data);
      FAKE_AGENT_UPDATE_DATA_EXISTING_KEY = R.set(keyLens, KNOWN_TEST_KEY_2, R.omit(['id'], KNOWN_TEST_AGENT_DATA));

      updatedAgentData = R.omit(privateFields, R.mergeDeepRight(KNOWN_TEST_AGENT_DATA, FAKE_AGENT_UPDATE_DATA));

      done();
    });
  });

  it('updates an agent when provided an key and new properties to update', done => {
    updateAgent(FAKE_AGENT_UPDATE_DATA, KNOWN_TEST_KEY)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created'], res))
          .toEqual(updatedAgentData);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating an agent that does not exist', done => {
    updateAgent(FAKE_AGENT_UPDATE_DATA, FAKE_UNKNOWN_AGENT_KEY)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isNoResultsErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when updating with an existing key', done => {
    updateAgent(FAKE_AGENT_UPDATE_DATA_EXISTING_KEY, KNOWN_TEST_KEY)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isDuplicateRecordErr(err)).toBe(true);
        done();
      });
  });
});
