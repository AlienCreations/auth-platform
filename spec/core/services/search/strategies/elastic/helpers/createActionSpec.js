'use strict';

const createAction = require('../../../../../../../server/core/services/search/strategies/elastic/helpers/createAction');

// (action, index, type, item)

const FAKE_INDEX    = 'bar',
      FAKE_TYPE     = 'baz',
      FAKE_ID       = 123,
      FAKE_ITEM     = {
        id : FAKE_ID,
        a  : 'b'
      },
      FAKE_RESPONSE = [
        {
          foo : {
            _index : FAKE_INDEX,
            _type  : FAKE_TYPE,
            _id    : FAKE_INDEX + ':' + FAKE_TYPE + ':' + FAKE_ID
          }
        }
      ];

describe('elastic.createAction', () => {
  it('creates an index action object for the elastic bulk api queue', () => {
    expect(createAction('foo', FAKE_INDEX, FAKE_TYPE, FAKE_ITEM))
      .toEqual(FAKE_RESPONSE);
  });
});
