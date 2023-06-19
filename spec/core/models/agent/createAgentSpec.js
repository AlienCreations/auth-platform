'use strict';

const R    = require('ramda'),
      cuid = require('cuid');

const createAgent   = require('../../../../server/core/models/agent/methods/createAgent'),
      commonMocks   = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER  = 1337,
      A_NEGATIVE_NUMBER  = -10,
      STRING_ONE_CHAR    = 'a',
      STRING_FORTY_CHARS = '*'.repeat(40);

const FAKE_NAME              = 'Test Agent 3',
      FAKE_KEY               = cuid(),
      KNOWN_TEST_TENANT_UUID = process.env.PLATFORM_TENANT_UUID,
      FAKE_SECRET            = 'foo',
      FAKE_STATUS            = 1,
      FAKE_MALFORMED_KEY     = 1234;

const makeFakeAgentData = (includeOptional) => {
  const fakeRequiredAgentData = {
    name       : FAKE_NAME,
    tenantUuid : KNOWN_TEST_TENANT_UUID,
    key        : FAKE_KEY,
    secret     : FAKE_SECRET
  };

  const fakeOptionalAgentData = {
    status : FAKE_STATUS
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalAgentData, fakeRequiredAgentData) : fakeRequiredAgentData;
};

const fullAgentDataForQuery     = makeFakeAgentData(true),
      requiredAgentDataForQuery = makeFakeAgentData(false);

const fullAgentDataSwapIn = commonMocks.override(fullAgentDataForQuery);

describe('createAgent', () => {
  it('creates a agent record when given expected data for all fields', done => {
    createAgent(fullAgentDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('creates a agent record when given expected data for only required fields', done => {
    createAgent(requiredAgentDataForQuery)
      .then(data => {
        expect(data.affectedRows).toBe(1);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // KEY
  it('throws an error when key is missing', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('key', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an key of type other than String', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('key', A_POSITIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when key is malformed', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('key', FAKE_MALFORMED_KEY));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TENANT_UUID
  it('throws an error when tenantUuid is missing', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('tenantUuid', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a malformed tenantUuid', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('tenantUuid', STRING_FORTY_CHARS));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // SECRET
  it('throws an error when secret is missing', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('secret', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an secret of type other than String', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('secret', A_POSITIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // NAME
  it('throws an error when name is missing', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('name', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a name of type other than String', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('name', A_POSITIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when name is too short', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('name', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when name is too long', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('name', STRING_FORTY_CHARS));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // STATUS
  it('throws an error when status is not a positive number', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('status', STRING_ONE_CHAR));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when status is negative', () => {
    expect(() => {
      createAgent(fullAgentDataSwapIn('status', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
