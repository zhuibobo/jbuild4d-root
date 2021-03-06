define([], function () {
  "use strict";

  function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

  function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

  function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

  function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

  function example() {
    return [1, 2, 3];
  }

  var _example = example(),
      _example2 = _slicedToArray(_example, 3),
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
  console.log(id);
  console.log(status);
  console.log(number);
});