'use strict';

const deleteItem = require('../../../../../../../server/core/services/search/strategies/elastic/methods/deleteItem');

const FAKE_INDEX = 'bar',
      FAKE_TYPE  = 'baz',
      FAKE_ID    = 123,
      FAKE_ITEM  = {
        id : FAKE_ID,
        a  : 'b'
      };

describe('elastic.deleteItem', () => {
  it('adds a delete action item to the elastic queue in redis', done => {
    deleteItem(FAKE_INDEX, FAKE_TYPE, FAKE_ITEM)
      .then(res => {
        expect(res).toEqual(FAKE_ITEM);
        done();
      });
  });
});
