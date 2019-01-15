"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

function example() {
  return [1, 2, 3];
}

var _example = example(),
    _example2 = (0, _slicedToArray2.default)(_example, 3),
    a = _example2[0],
    b = _example2[1],
    c = _example2[2];

var jsonData = {
  id: 42,
  status: "OK",
  data: [867, 5309]
};
var id = jsonData.id,
    status = jsonData.status,
    number = jsonData.data;