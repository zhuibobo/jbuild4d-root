define(["exports", "ModuleExport1.js"], function (_exports, _ModuleExport) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.setNameMethod = void 0;

  function setName(element) {
    console.log(_ModuleExport.firstName + ' ' + _ModuleExport.lastName + "  " + _ModuleExport.year);
  }

  var setNameMethod = setName;
  _exports.setNameMethod = setNameMethod;
});