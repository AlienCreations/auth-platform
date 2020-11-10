'use strict';


const updateItem = require('../../../../../../../server/core/services/search/strategies/elastic/methods/updateItem');

const FAKE_INDEX = 'bar',
      FAKE_TYPE  = 'baz',
      FAKE_ID    = 123,
      FAKE_ITEM  = {
        id : FAKE_ID,
        a  : 'b'
      };

describe('elastic.updateItem', () => {
  it('adds an update action item to the elastic queue in redis', done => {
    updateItem(FAKE_INDEX, FAKE_TYPE, FAKE_ITEM)
      .then(res => {
        expect(res).toEqual(FAKE_ITEM);
        done();
      });
  });
});
