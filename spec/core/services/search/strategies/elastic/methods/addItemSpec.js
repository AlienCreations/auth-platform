'use strict';

const addItem = require('../../../../../../../server/core/services/search/strategies/elastic/methods/addItem');

const FAKE_INDEX = 'bar',
      FAKE_TYPE  = 'baz',
      FAKE_ID    = 123,
      FAKE_ITEM  = {
        id : FAKE_ID,
        a  : 'b'
      };

describe('elastic.addItem', () => {
  it('adds an index action item to the elastic queue in redis', done => {
    addItem(FAKE_INDEX, FAKE_TYPE, FAKE_ITEM)
      .then(res => {
        expect(res).toEqual(FAKE_ITEM);
        done();
      });
  });
});
