'use strict';

const R            = require('ramda'),
      path         = require('path'),
      config       = require('config'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const createAgent = require('../../../../server/core/controllers/api/agent/createAgent'),
      commonMocks = require('../../../_helpers/commonMocks');

const COMMON_PRIVATE_FIELDS = R.path(['api', 'COMMON_PRIVATE_FIELDS'], config),
      AGENT_PRIVATE_FIELDS  = R.path(['api', 'AGENT_PRIVATE_FIELDS'], config);

const privateFields = R.concat(COMMON_PRIVATE_FIELDS, AGENT_PRIVATE_FIELDS);

const FAKE_AGENT_DATA            = {
        key        : 'ciw59rcxu0000uhp1ygpzzjxx',
        tenantUuid : process.env.PLATFORM_TENANT_UUID,
        secret     : '$2a$04$zvS.d9hNJ.PoX/vr9JFOaOkiyPXb6dOcoSsy58U1jSq40wMgQFwzy',
        name       : 'Zuora',
        status     : 1
      },
      FAKE_AGENT_DATA_INCOMPLETE = {
        secret : '$2a$04$zvS.d9hNJ.PoX/vr9JFOaOkiyPXb6dOcoSsy58U1jSq40wMgQFwzy',
        name   : 'Zuora'
      };

let FAKE_AGENT_DATA_WITH_KNOWN_TEST_AGENT_KEY,
    mergeInsertId;

describe('agentCtrl.createAgent', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {

      FAKE_AGENT_DATA_WITH_KNOWN_TEST_AGENT_KEY = R.compose(
        R.mergeDeepRight(FAKE_AGENT_DATA),
        R.objOf('key'),
        R.prop('key'),
        R.head
      )(data);

      mergeInsertId = R.mergeDeepRight(R.compose(R.objOf('id'), R.inc, R.prop('id'), R.last)(data));

      done();
    });
  });

  it('returns FAKE_AGENT_DATA when creating an agent with all correct params', done => {
    createAgent(FAKE_AGENT_DATA)
      .then(res => {
        expect(commonMocks.recursivelyOmitProps(['timestamp', 'created', 'uuid'], res))
          .toEqual(R.omit(privateFields, mergeInsertId(FAKE_AGENT_DATA)));
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when creating an agent with incomplete params', done => {
    createAgent(FAKE_AGENT_DATA_INCOMPLETE)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isMissingParamErr(err)).toBe(true);
        done();
      });
  });

  it('throws an error when creating a duplicate agent (key should be unique)', done => {
    createAgent(FAKE_AGENT_DATA_WITH_KNOWN_TEST_AGENT_KEY)
      .then(done.fail)
      .catch(err => {
        expect(commonMocks.isDuplicateRecordErr(err)).toBe(true);
        done();
      });
  });
});
