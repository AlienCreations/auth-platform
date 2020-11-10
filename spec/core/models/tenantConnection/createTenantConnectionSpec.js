'use strict';

const R = require('ramda');

const createTenantConnection = require('../../../../server/core/models/tenantConnection/methods/createTenantConnection'),
      commonMocks            = require('../../../_helpers/commonMocks');

const KNOWN_TEST_TENANT_ID              = 1,
      KNOWN_TEST_TENANT_ORGANIZATION_ID = 1,
      FAKE_TITLE                        = 'Test TenantConnection',
      FAKE_DESCRIPTION                  = 'A good test tenantConnection',
      FAKE_PROTOCOL                     = 'https',
      FAKE_HOST                         = 'test.com',
      FAKE_USER                         = 'testuser',
      FAKE_PASSWORD                     = 'testpassword',
      FAKE_PORT                         = 80,
      FAKE_CONNECTION_TYPE              = 1,
      FAKE_STRATEGY                     = 'common/mongodb',
      FAKE_META_JSON                    = JSON.stringify({ foo : 'bar' }),
      FAKE_MALFORMED_JSON               = 'foo';

const A_NUMBER          = 1337,
      A_NEGATIVE_NUMBER = -10,
      A_STRING          = 'foo';

const makeFakeTenantConnectionData = includeOptional => {
  const fakeRequiredTenantConnectionData = {
    tenantId             : KNOWN_TEST_TENANT_ID,
    tenantOrganizationId : KNOWN_TEST_TENANT_ORGANIZATION_ID,
    title                : FAKE_TITLE,
    protocol             : FAKE_PROTOCOL,
    host                 : FAKE_HOST,
    user                 : FAKE_USER,
    password             : FAKE_PASSWORD,
    port                 : FAKE_PORT,
    type                 : FAKE_CONNECTION_TYPE,
    strategy             : FAKE_STRATEGY,
    metaJson             : FAKE_META_JSON
  };

  const fakeOptionalTenantConnectionData = {
    description : FAKE_DESCRIPTION
  };

  return includeOptional ? R.mergeDeepRight(fakeOptionalTenantConnectionData, fakeRequiredTenantConnectionData) : fakeRequiredTenantConnectionData;
};

const fullTenantConnectionDataForQuery     = makeFakeTenantConnectionData(true),
      requiredTenantConnectionDataForQuery = makeFakeTenantConnectionData(false);

const fullTenantConnectionDataSwapIn = commonMocks.override(fullTenantConnectionDataForQuery);

describe('createTenantConnection', () => {
  it('creates a tenantConnection record when given expected data for all fields', done => {
    createTenantConnection(fullTenantConnectionDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('creates a tenantConnection record when given expected data for only required fields', done => {
    createTenantConnection(requiredTenantConnectionDataForQuery).then(data => {
      expect(data.affectedRows).toBe(1);
      done();
    });
  });

  it('throws an error when given no data', () => {
    expect(() => {
      createTenantConnection();
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('foo', 'bar'));
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('title', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when title is missing', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('title', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a protocol of type other than String', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('protocol', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when protocol is missing', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('protocol', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a host of type other than String', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('host', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when host is missing', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('host', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a user of type other than String', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('user', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when user is missing', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('user', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an password of type other than String', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('password', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when password is missing', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('password', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given an strategy of type other than String', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('strategy', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when strategy is missing', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('strategy', undefined));
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when given a description of type other than String', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('description', A_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a port of type other than Number', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('port', A_STRING));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative port', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('port', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a connection type of type other than Number', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('type', A_STRING));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative type', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('type', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given malformed JSON', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('metaJson', FAKE_MALFORMED_JSON));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a status of type other than Number', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('status', A_STRING));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      createTenantConnection(fullTenantConnectionDataSwapIn('status', A_NEGATIVE_NUMBER));
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

});
