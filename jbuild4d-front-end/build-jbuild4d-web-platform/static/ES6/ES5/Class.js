"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var methodName = "one";

var Point = function () {
  function Point(x, y) {
    _classCallCheck(this, Point);

    _defineProperty(this, "x", 0);

    _defineProperty(this, "y", 0);

    _defineProperty(this, "z", 0);

    this.x = x;
    this.y = y;
  }

  _createClass(Point, [{
    key: "toString",
    value: function toString() {
      return "(".concat(this.x, ",").concat(this.y, ",").concat(this.z, ")");
    }
  }, {
    key: methodName,
    value: function value() {
      console.log("Log......." + methodName);
    }
  }, {
    key: "prop",
    get: function get() {
      return 'getter';
    },
    set: function set(value) {
      console.log('setter: ' + value);
    }
  }], [{
    key: "staticMethod",
    value: function staticMethod() {
      return 'static method hello ' + this.static_x;
    }
  }]);

  return Point;
}();

_defineProperty(Point, "static_x", 1);

var pointInstance = new Point(1, 2);
console.log(pointInstance.toString());
pointInstance.prop = "hellow";
console.log(pointInstance.prop);
pointInstance.one();
Point.static_x = "酷狗";
console.log(Point.staticMethod());