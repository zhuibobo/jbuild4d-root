define([], function () {
  "use strict";

  function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

  function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

  function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

  function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

  function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

  function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

  function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

  function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

  function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

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

  var Point1 = function () {
    function Point1() {
      _classCallCheck(this, Point1);
    }

    _createClass(Point1, [{
      key: "toStringPoint1",
      value: function toStringPoint1() {
        return "Point1Point1Point1";
      }
    }]);

    return Point1;
  }();

  var PointExtend = function (_Point) {
    _inherits(PointExtend, _Point);

    function PointExtend(x, y, color) {
      var _this;

      _classCallCheck(this, PointExtend);

      _this = _possibleConstructorReturn(this, _getPrototypeOf(PointExtend).call(this, x, y));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "color", "");

      _this.color = color;
      return _this;
    }

    _createClass(PointExtend, [{
      key: "toString",
      value: function toString() {
        return this.color + ' ' + _get(_getPrototypeOf(PointExtend.prototype), "toString", this).call(this);
      }
    }]);

    return PointExtend;
  }(Point);

  var pointInstance = new Point(1, 2);
  console.log(pointInstance.toString());
  pointInstance.prop = "hellow";
  console.log(pointInstance.prop);
  pointInstance.one();
  Point.static_x = "酷狗";
  console.log(Point.staticMethod());
  var pointExtendInstance = new PointExtend(1, 2, 3);
  console.log(pointExtendInstance.toString());
  var a = {
    a: 'a'
  };
  var b = {
    b: 'b'
  };

  var c = _objectSpread({}, a, b);

  console.log(c.a + "-and-" + c.b);
});