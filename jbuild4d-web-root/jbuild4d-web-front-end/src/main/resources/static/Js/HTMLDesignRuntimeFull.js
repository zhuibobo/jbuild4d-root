"use strict";

var FormRuntime = {
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

var ListRuntime = {
  _Prop_Status: "Edit",
  _Prop_Config: {
    RendererTo: null,
    ListId: ""
  },
  Initialization: function Initialization(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);

    this._LoadHTMLToEl();
  },
  _LoadHTMLToEl: function _LoadHTMLToEl() {
    $(this._Prop_Config.RendererTo).load(BaseUtility.GetRootPath() + "/PlatFormRest/Builder/ListRuntime/ListPreview?listId=" + this._Prop_Config.ListId, function () {
      console.log("加载预览列表成功!");
    });
  }
};
"use strict";
"use strict";
"use strict";

var WFDCT_TextBox = {};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1SdW50aW1lLmpzIiwiTGlzdFJ1bnRpbWUuanMiLCJDb250cm9sL0hUTUxDb250cm9sLmpzIiwiQ29udHJvbC9WaXJ0dWFsQm9keUNvbnRyb2wuanMiLCJDb250cm9sL1dlYkZvcm1Db250cm9sL1dGRENUX1RleHRCb3guanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUNBQTtBQ0FBO0FBQ0E7QUFDQSIsImZpbGUiOiJIVE1MRGVzaWduUnVudGltZUZ1bGwuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIEZvcm1SdW50aW1lID0ge1xuICBfUHJvcF9TdGF0dXM6IFwiRWRpdFwiLFxuICBfUHJvcF9Db25maWc6IHtcbiAgICBSZW5kZXJlclRvOiBudWxsLFxuICAgIEZvcm1JZDogXCJcIlxuICB9LFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIHRoaXMuX1Byb3BfQ29uZmlnLCBfY29uZmlnKTtcblxuICAgIHRoaXMuX0xvYWRIVE1MVG9FbCgpO1xuICB9LFxuICBfTG9hZEhUTUxUb0VsOiBmdW5jdGlvbiBfTG9hZEhUTUxUb0VsKCkge1xuICAgICQodGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbykubG9hZChCYXNlVXRpbGl0eS5HZXRSb290UGF0aCgpICsgXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRm9ybVJ1bnRpbWUvRm9ybVByZXZpZXc/Zm9ybUlkPVwiICsgdGhpcy5fUHJvcF9Db25maWcuRm9ybUlkLCBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIuWKoOi9vemihOiniOeql+S9k+aIkOWKnyFcIik7XG4gICAgfSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMaXN0UnVudGltZSA9IHtcbiAgX1Byb3BfU3RhdHVzOiBcIkVkaXRcIixcbiAgX1Byb3BfQ29uZmlnOiB7XG4gICAgUmVuZGVyZXJUbzogbnVsbCxcbiAgICBMaXN0SWQ6IFwiXCJcbiAgfSxcbiAgSW5pdGlhbGl6YXRpb246IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl9Qcm9wX0NvbmZpZywgX2NvbmZpZyk7XG5cbiAgICB0aGlzLl9Mb2FkSFRNTFRvRWwoKTtcbiAgfSxcbiAgX0xvYWRIVE1MVG9FbDogZnVuY3Rpb24gX0xvYWRIVE1MVG9FbCgpIHtcbiAgICAkKHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG8pLmxvYWQoQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0xpc3RSdW50aW1lL0xpc3RQcmV2aWV3P2xpc3RJZD1cIiArIHRoaXMuX1Byb3BfQ29uZmlnLkxpc3RJZCwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coXCLliqDovb3pooTop4jliJfooajmiJDlip8hXCIpO1xuICAgIH0pO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0ZEQ1RfVGV4dEJveCA9IHt9OyJdfQ==
