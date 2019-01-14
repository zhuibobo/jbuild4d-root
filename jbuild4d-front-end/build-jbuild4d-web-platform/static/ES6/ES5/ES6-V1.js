"use strict";

function a() {
  var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "2";
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  console.log(x);
}