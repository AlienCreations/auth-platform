'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantConnection  = require('../../../../server/core/models/tenantConnection/methods/updateTenantConnection'),
      getTenantConnectionById = require('../../../../server/core/models/tenantConnection/methods/getTenantConnectionById'),
      commonMocks             = require('../../../_helpers/commonMocks');

const FAKE_UNKNOWN_ID                = 1337,
      FAKE_UPDATE_TITLE              = 'Test TenantConnection',
      FAKE_UPDATE_DESCRIPTION        = 'A good test tenantConnection',
      FAKE_UPDATE_PROTOCOL           = 'https',
      FAKE_UPDATE_HOST               = 'test.com',
      FAKE_UPDATE_USER               = 'testuser',
      FAKE_UPDATE_PASSWORD_PLAINTEXT = 'testpassword',
      FAKE_UPDATE_PORT               = 80,
      FAKE_UPDATE_CONNECTION_TYPE    = 1,
      FAKE_UPDATE_STATUS             = 1,
      FAKE_UPDATE_STRATEGY           = 'common/mongodb',
      FAKE_UPDATE_META_JSON          = JSON.stringify({ foo : 'bar' }),
      FAKE_MALFORMED_JSON            = 'foo';

const EXPECTED_PASSWORD_HASH_LENGTH = 40;

const A_POSITIVE_NUMBER = 1337,
      A_NEGATIVE_NUMBER = -10,
      A_STRING          = 'foo';

let KNOWN_TEST_ID,
    KNOWN_TEST_TITLE,
    KNOWN_TEST_DESCRIPTION,
    KNOWN_TEST_PROTOCOL,
    KNOWN_TEST_HOST,
    KNOWN_TEST_USER,
    KNOWN_TEST_PASSWORD,
    KNOWN_TEST_PORT,
    KNOWN_TEST_CONNECTION_TYPE,
    KNOWN_TEST_STATUS,
    KNOWN_TEST_STRATEGY,
    KNOWN_TEST_META_JSON;

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantConnection when given a valid ' + field, done => {
    updateTenantConnection(KNOWN_TEST_ID, {
      [field] : value
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantConnectionById(KNOWN_TEST_ID)
        .then(res => {
          expect(R.prop(field, res)).toBe(value);
          done();
        });
    });
  });
};

describe('updateTenantConnection', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantConnections.csv'), (err, data) => {
      const knownProp = R.prop(R.__, R.head(data));

      KNOWN_TEST_ID              = knownProp('id');
      KNOWN_TEST_TITLE           = knownProp('title');
      KNOWN_TEST_META_JSON       = JSON.stringify(knownProp('meta_json'));
      KNOWN_TEST_STATUS          = knownProp('status');
      KNOWN_TEST_DESCRIPTION     = knownProp('description');
      KNOWN_TEST_PROTOCOL        = knownProp('protocol');
      KNOWN_TEST_HOST            = knownProp('host');
      KNOWN_TEST_USER            = knownProp('user');
      KNOWN_TEST_PASSWORD        = knownProp('password');
      KNOWN_TEST_PORT            = knownProp('port');
      KNOWN_TEST_CONNECTION_TYPE = knownProp('type');
      KNOWN_TEST_STRATEGY        = knownProp('strategy');

      done();
    });
  });

  it('fails gracefully when given an unknown tenantConnection id to update', done => {
    updateTenantConnection(FAKE_UNKNOWN_ID, {
      title : FAKE_UPDATE_TITLE
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('fails gracefully when given no data', done => {
    updateTenantConnection(KNOWN_TEST_ID, null).then(data => {
      expect(data).toBe(false);
      done();
    });
  });

  it('does not update anything when no req body is provided', done => {
    updateTenantConnection(KNOWN_TEST_ID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getTenantConnectionById(KNOWN_TEST_ID)
          .then((tenantConnection) => {
            const jsonLens = R.lensProp('metaJson');

            tenantConnection = R.compose(
              R.over(jsonLens, JSON.stringify),
              R.over(jsonLens, JSON.parse)
            )(tenantConnection);

            expect(tenantConnection.id).toBe(KNOWN_TEST_ID);
            expect(tenantConnection.title).toBe(KNOWN_TEST_TITLE);
            expect(tenantConnection.description).toBe(KNOWN_TEST_DESCRIPTION);
            expect(tenantConnection.host).toBe(KNOWN_TEST_HOST);
            expect(tenantConnection.port).toBe(KNOWN_TEST_PORT);
            expect(tenantConnection.protocol).toBe(KNOWN_TEST_PROTOCOL);
            expect(tenantConnection.user).toBe(KNOWN_TEST_USER);
            expect(tenantConnection.password).toBe(KNOWN_TEST_PASSWORD);
            expect(tenantConnection.strategy).toBe(KNOWN_TEST_STRATEGY);
            expect(tenantConnection.type).toBe(KNOWN_TEST_CONNECTION_TYPE);
            expect(tenantConnection.metaJson).toBe(KNOWN_TEST_META_JSON);
            expect(tenantConnection.status).toBe(KNOWN_TEST_STATUS);
            done();
          });
      });
  });

  it('throws an error when updating a tenantConnection with null id', () => {
    expect(() => {
      updateTenantConnection(null, {
        title : FAKE_UPDATE_TITLE
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateTenantConnection(A_STRING, {
        title : FAKE_UPDATE_TITLE
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given an unsupported parameter', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        foo : 'bar'
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // TITLE IN BODY
  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        title : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('title', FAKE_UPDATE_TITLE);

  // HOST IN BODY
  it('throws an error when given a host of type other than String', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        host : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('host', FAKE_UPDATE_HOST);

  // PROTOCOL IN BODY
  it('throws an error when given a protocol of type other than String', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        protocol : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('protocol', FAKE_UPDATE_PROTOCOL);

  // PORT IN BODY
  it('throws an error when given a port of type other than Number', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        port : A_STRING
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('port', FAKE_UPDATE_PORT);

  // USER IN BODY
  it('throws an error when given a user of type other than String', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        user : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('user', FAKE_UPDATE_USER);

  // PASSWORD IN BODY
  it('throws an error when given a password of type other than String', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        password : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates a tenantConnection when given a valid password, and encrypts the password appropriately', done => {
    updateTenantConnection(KNOWN_TEST_ID, {
      password : FAKE_UPDATE_PASSWORD_PLAINTEXT
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantConnectionById(KNOWN_TEST_ID)
        .then(tenantConnection => {
          expect(tenantConnection.password.length).toBe(EXPECTED_PASSWORD_HASH_LENGTH);
          done();
        });
    });
  });

  // CONNECTION_TYPE IN BODY
  it('throws an error when given a connection type of type other than Number', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        type : A_STRING
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('type', FAKE_UPDATE_CONNECTION_TYPE);

  // STRATEGY IN BODY
  it('throws an error when given a strategy of type other than String', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        strategy : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('strategy', FAKE_UPDATE_STRATEGY);

  // DESCRIPTION IN BODY
  it('throws an error when given a description of type other than String', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        description : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('description', FAKE_UPDATE_DESCRIPTION);

  // META_JSON IN BODY
  it('throws an error when metaJson is malformed JSON', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        metaJson : FAKE_MALFORMED_JSON
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates a tenantConnection when given a valid metaJson', done => {
    updateTenantConnection(KNOWN_TEST_ID, {
      metaJson : FAKE_UPDATE_META_JSON
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantConnectionById(KNOWN_TEST_ID)
        .then(res => {
          expect(JSON.parse(res.metaJson)).toEqual(JSON.parse(FAKE_UPDATE_META_JSON));
          done();
        });
    });
  });

  // STATUS IN BODY
  it('throws an error when given a status of type other than Number', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        status : A_STRING
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantConnection(KNOWN_TEST_ID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);

});
