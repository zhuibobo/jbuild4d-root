define([], function () {
  "use strict";

  var target = {};
  var handler = {};
  var proxy = new Proxy(target, handler);
  proxy.a = 'b';
  console.log(proxy.a);
});