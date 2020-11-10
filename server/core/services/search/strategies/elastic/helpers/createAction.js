'use strict';

const R = require('ramda');

const createAction = R.curry((action, index, type, item) => {
  const metaData = R.objOf(action, {
    _index : index,
    _type  : type,
    _id    : index + ':' + type + ':' + R.prop('id', item)
  });

  return R.append(metaData, []);
});

module.exports = createAction;
