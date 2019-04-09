"use strict";

var HTMLDesignRuntime = {
  _Prop_Status: "Edit",
  _Prop_Config: {
    RendererTo: null,
    FormId: ""
  },
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);

    this._LoadHTMLToEl();
  },
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    $(this._Prop_Config.RendererTo).load(BaseUtility.GetRootPath() + "/PlatFormRest/Builder/FormRuntime/FormPreview?formId=" + this._Prop_Config.FormId, function () {
      console.log("加载预览窗体成功!");
    });
  }
};
"use strict";

var WFDCT_TextBox = {};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhEUnVudGltZS5qcyIsIldlYkZvcm1Db250cm9sL1dGRENUX1RleHRCb3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBIiwiZmlsZSI6IkhEUnVudGltZUZ1bGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIEhUTUxEZXNpZ25SdW50aW1lID0ge1xuICBfUHJvcF9TdGF0dXM6IFwiRWRpdFwiLFxuICBfUHJvcF9Db25maWc6IHtcbiAgICBSZW5kZXJlclRvOiBudWxsLFxuICAgIEZvcm1JZDogXCJcIlxuICB9LFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcblxuICAgIHRoaXMuX0xvYWRIVE1MVG9FbCgpO1xuICB9LFxuICBfTG9hZEhUTUxUb0VsOiBmdW5jdGlvbiBfTG9hZEhUTUxUb0VsKCkge1xuICAgICQodGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbykubG9hZChCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRm9ybVJ1bnRpbWUvRm9ybVByZXZpZXc/Zm9ybUlkPVwiICsgdGhpcy5fUHJvcF9Db25maWcuRm9ybUlkLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIuWKoOi9vemihOiniOeql+S9k+aIkOWKnyFcIik7XG4gICAgfSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXRkRDVF9UZXh0Qm94ID0ge307Il19
