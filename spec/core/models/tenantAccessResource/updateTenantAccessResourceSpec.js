'use strict';

const R            = require('ramda'),
      path         = require('path'),
      CSVConverter = require('csvtojson').Converter,
      converter    = new CSVConverter({});

const updateTenantAccessResource  = require('../../../../server/core/models/tenantAccessResource/methods/updateTenantAccessResource'),
      getTenantAccessResourceById = require('../../../../server/core/models/tenantAccessResource/methods/getTenantAccessResourceById'),
      commonMocks                 = require('../../../_helpers/commonMocks');

const A_POSITIVE_NUMBER          = 1337,
      A_NEGATIVE_NUMBER          = -10,
      STRING_ONE_CHAR            = 'a',
      STRING_THREE_HUNDRED_CHARS = '*'.repeat(300);

const FAKE_UNKNOWN_ID                = 9999,
      FAKE_UPDATE_TITLE              = 'xxx',
      FAKE_UPDATE_URI                = 'boo/boo',
      FAKE_UPDATE_KEY                = 'x-x-x',
      FAKE_UPDATE_METHOD_SUPPORTED   = 'POST',
      FAKE_UPDATE_METHOD_UNSUPPORTED = 'BAR',
      FAKE_UPDATE_STATUS             = 2;

let KNOWN_TEST_ID,
    KNOWN_TEST_TITLE;

const assertUpdatesIfValid = (field, value) => {
  it('updates a tenantAccessResource when given a valid ' + field, done => {
    updateTenantAccessResource(KNOWN_TEST_ID, {
      [field] : value
    }).then(data => {
      expect(data.affectedRows).toBe(1);
      getTenantAccessResourceById(KNOWN_TEST_ID)
        .then(tenantAccessResource => {
          expect(R.prop(field, tenantAccessResource)).toBe(value);
          done();
        })
        .catch(done.fail);
    })
      .catch(done.fail);
  });
};

describe('updateTenantAccessResource', () => {

  beforeAll(done => {
    converter.fromFile(path.resolve(__dirname, '../../../../run/env/test/seedData/coreDb/tenantAccessResources.csv'), (err, _data) => {
      const data = R.map(commonMocks.ensureTrueNullInCsvData, _data);

      const knownProp = R.prop(R.__, R.head(data));

      KNOWN_TEST_ID    = knownProp('id');
      KNOWN_TEST_ID    = knownProp('id');
      KNOWN_TEST_TITLE = knownProp('title');

      done();
    });
  });

  // ID AS PARAM
  it('fails gracefully when given an unknown tenantAccessResource id to update', done => {
    updateTenantAccessResource(FAKE_UNKNOWN_ID, {
      title : FAKE_UPDATE_TITLE
    }).then(data => {
      expect(data.affectedRows).toBe(0);
      done();
    });
  });

  it('throws an error when updating a tenantAccessResource with null id', () => {
    expect(() => {
      updateTenantAccessResource(null, {
        id : FAKE_UNKNOWN_ID
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when updating by an id of type other than Number', () => {
    expect(() => {
      updateTenantAccessResource(STRING_ONE_CHAR, {
        id : FAKE_UNKNOWN_ID
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  // TITLE IN BODY
  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        title : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a title that is too long', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        title : STRING_THREE_HUNDRED_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('title', FAKE_UPDATE_TITLE);

  // TITLE IN BODY
  it('throws an error when given a title of type other than String', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        title : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a title that is too long', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        title : STRING_THREE_HUNDRED_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('title', FAKE_UPDATE_TITLE);

  // TENANT_ID IN BODY
  it('throws an error when given a tenantId (unsupported for update)', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        tenantId : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // TENANT_ORGANIZATION_ID IN BODY
  it('throws an error when given a tenantOrganizationId (unsupported for update)', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        tenantOrganizationId : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.unsupportedParamErrRegex);
  });

  // KEY IN BODY
  it('throws an error when given a key of type other than String', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        key : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a key that is too long', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        key : STRING_THREE_HUNDRED_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('key', FAKE_UPDATE_KEY);

  // URI IN BODY
  it('throws an error when given a uri of type other than String', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        uri : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a uri that is too long', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        uri : STRING_THREE_HUNDRED_CHARS
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('uri', FAKE_UPDATE_URI);

  // METHOD IN BODY
  it('throws an error when given a method of type other than String', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        method : A_POSITIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a method that is not supported', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        method : FAKE_UPDATE_METHOD_UNSUPPORTED
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('method', FAKE_UPDATE_METHOD_SUPPORTED);

  it('does not update anything when no req body is provided', done => {
    updateTenantAccessResource(KNOWN_TEST_ID, undefined)
      .then(res => {
        expect(R.isNil(res)).toBe(false);

        getTenantAccessResourceById(KNOWN_TEST_ID)
          .then((tenantAccessResource) => {
            expect(tenantAccessResource.title).toBe(KNOWN_TEST_TITLE);
            done();
          });
      });
  });

  it('fails gracefully when given an empty req body', done => {
    updateTenantAccessResource(KNOWN_TEST_ID, {})
      .then(res => {
        expect(res).toBe(false);
        done();
      });
  });

  // STATUS IN BODY
  it('throws an error when given a malformed status', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        status : STRING_ONE_CHAR
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  it('throws an error when given a negative status', () => {
    expect(() => {
      updateTenantAccessResource(KNOWN_TEST_ID, {
        status : A_NEGATIVE_NUMBER
      });
    }).toThrowError(commonMocks.illegalParamErrRegex);
  });

  assertUpdatesIfValid('status', FAKE_UPDATE_STATUS);
});
