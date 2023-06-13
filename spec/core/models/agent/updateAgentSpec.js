'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateAgent   = require('../../../../server/core/models/agent/methods/updateAgent'),
      getAgentByKey = require('../../../../server/core/models/agent/methods/getAgentByKey'),
      commonMocks   = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER  = 1337,
      A_NEGATIVE_NUMBER  = -10,
      STRING_ONE_CHAR    = 'a',
      STRING_FORTY_CHARS = 'f41d8cd98f00b204e9800998ecf8427fx1x1x1x1';

const FAKE_UNKNOWN_KEY         = 'x41d8cd98f00b204e9800998e',
      FAKE_UNKNOWN_UUID        = commonMocks.COMMON_UUID,
      FAKE_UPDATE_TENANT_UUID  = process.env.PLATFORM_TENANT_UUID,
      FAKE_UNKNOWN_TENANT_UUID = commonMocks.COMMON_UUID,
      FAKE_UPDATE_NAME         = 'Updated agent name',
      FAKE_UPDATE_SECRET       = 'xxxx04$zvS.d9hNJ.PoX/vr9JFOaOkiyPXb6dOcoSsy58U1jSq40wMgQxxxx',
      FAKE_UPDATE_STATUS       = 2,
      FAKE_MALFORMED_KEY       = 1234,
      FAKE_MALFORMED_SECRET    = 'def';

let KNOWN_TEST_KEY,
    KNOWN_TEST_UUID,
    KNOWN_TEST_SECRET,
    KNOWN_TEST_NAME,
    KNOWN_TEST_STATUS;

describe('updateAgent', () => {
  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/agents.csv'), (err, data) => {
      const knownProp = R.prop(R.__, R.head(data));

      KNOWN_TEST_UUID   = knownProp('uuid');
      KNOWN_TEST_KEY    = knownProp('key');
      KNOWN_TEST_SECRET = knownProp('secret');
      KNOWN_TEST_NAME   = knownProp('name');
      KNOWN_TEST_STATUS = knownProp('status');

      done();
    });
  });

  // KEY AS PARAM
  it('fails gracefully when given an unknown agent key to update', done => {
    updateAgent(FAKE_UNKNOWN_UUID, {
      name : FAKE_UPDATE_NAME
    })
      .then(data => {
        expect(data.affectedRows).toBe(0);
        done();
      })
      .catch(done.fail);
  });

  it('throws an error when updating an agent with null key', () => {
    expect(() => {
      updateAgent(null, {
        key : FAKE_UNKNOWN_KEY
      });
    }).toThrowError(commonMocks.missingParamErrRegex);
  });

  it('throws an error when updating by an key of type other than String', () => {
    expect(() => {
      updateAgent(A_POSITIVE_NUMBER, {
        key : FAKE_UNKNOWN_KEY
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // KEY IN BODY
  it('throws an error when given an key update value of type other than String', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        key : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates an agent when given an key of expected length', done => {
    updateAgent(KNOWN_TEST_UUID, {
      key : FAKE_UNKNOWN_KEY
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getAgentByKey(FAKE_UNKNOWN_KEY)
          .then((agent) => {
            expect(R.prop('key', agent)).toBe(FAKE_UNKNOWN_KEY);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed key update value', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        key : FAKE_MALFORMED_KEY
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TENANT_UUID IN BODY
  it('throws an error when given a tenantUuid not belonging to any known tenant', done => {
    updateAgent(KNOWN_TEST_UUID, {
      tenantUuid : FAKE_UNKNOWN_TENANT_UUID
    })
      .then(done.fail)
      .catch(err => {
        expect(R.prop('code', err)).toBe(commonMocks.APPLICATION_ERROR_CODE_DB_FOREIGN_KEY_CONSTRAINT);
        done();
      });
  });

  it('throws an error when given a malformed tenantUuid', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        tenantUuid : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates an agent tenantUuid when given a valid tenantUuid', done => {
    updateAgent(KNOWN_TEST_UUID, {
      tenantUuid : FAKE_UPDATE_TENANT_UUID
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getAgentByKey(KNOWN_TEST_KEY)
          .then((agent) => {
            expect(R.prop('tenantUuid', agent)).toBe(FAKE_UPDATE_TENANT_UUID);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('throws an error when given a negative tenantUuid', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        tenantUuid : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // SECRET IN BODY
  it('throws an error when given a secret of type other than String', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        secret : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates an agent secret when given a string of expected length', done => {
    updateAgent(KNOWN_TEST_UUID, {
      secret : FAKE_UPDATE_SECRET
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getAgentByKey(KNOWN_TEST_KEY)
          .then((agent) => {
            expect(R.prop('secret', agent)).toBe(FAKE_UPDATE_SECRET);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('throws an error when given a malformed secret', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        secret : FAKE_MALFORMED_SECRET
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // NAME IN BODY
  it('throws an error when given a name of type other than String', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        name : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a name that is too short', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        name : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a name that is too long', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        name : STRING_FORTY_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates an agent name when given a string of expected length', done => {
    updateAgent(KNOWN_TEST_UUID, {
      name : FAKE_UPDATE_NAME
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getAgentByKey(KNOWN_TEST_KEY)
          .then(agent => {
            expect(agent.name).toBe(FAKE_UPDATE_NAME);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('does not update anything when no req body is provided', done => {
    updateAgent(KNOWN_TEST_UUID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getAgentByKey(KNOWN_TEST_KEY)
          .then((agent) => {
            expect(agent.key).toBe(KNOWN_TEST_KEY);
            expect(agent.secret).toBe(KNOWN_TEST_SECRET);
            expect(agent.name).toBe(KNOWN_TEST_NAME);
            expect(agent.status).toBe(KNOWN_TEST_STATUS);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('fails gracefully when given an empty req body', done => {
    updateAgent(KNOWN_TEST_UUID, {})
      .then(res => {
        expect(res).toBe(false);
        done();
      })
      .catch(done.fail);
  });

  // STATUS IN BODY
  it('throws an error when given a status of type other than Number', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        status : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('updates an agent status when given a valid status', done => {
    updateAgent(KNOWN_TEST_UUID, {
      status : FAKE_UPDATE_STATUS
    })
      .then(data => {
        expect(data.affectedRows).toBe(1);
        getAgentByKey(KNOWN_TEST_KEY)
          .then((agent) => {
            expect(R.prop('status', agent)).toBe(FAKE_UPDATE_STATUS);
            done();
          })
          .catch(done.fail);
      })
      .catch(done.fail);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateAgent(KNOWN_TEST_UUID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });
});
