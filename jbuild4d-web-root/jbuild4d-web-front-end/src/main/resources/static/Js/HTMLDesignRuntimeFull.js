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

var WFDCT_TextBox = {};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkZvcm1SdW50aW1lLmpzIiwiV2ViRm9ybUNvbnRyb2wvV0ZEQ1RfVGV4dEJveC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0EiLCJmaWxlIjoiSFRNTERlc2lnblJ1bnRpbWVGdWxsLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBGb3JtUnVudGltZSA9IHtcbiAgX1Byb3BfU3RhdHVzOiBcIkVkaXRcIixcbiAgX1Byb3BfQ29uZmlnOiB7XG4gICAgUmVuZGVyZXJUbzogbnVsbCxcbiAgICBGb3JtSWQ6IFwiXCJcbiAgfSxcbiAgSW5pdGlhbGl6YXRpb246IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl9Qcm9wX0NvbmZpZywgX2NvbmZpZyk7XG5cbiAgICB0aGlzLl9Mb2FkSFRNTFRvRWwoKTtcbiAgfSxcbiAgX0xvYWRIVE1MVG9FbDogZnVuY3Rpb24gX0xvYWRIVE1MVG9FbCgpIHtcbiAgICAkKHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG8pLmxvYWQoQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0Zvcm1SdW50aW1lL0Zvcm1QcmV2aWV3P2Zvcm1JZD1cIiArIHRoaXMuX1Byb3BfQ29uZmlnLkZvcm1JZCwgZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coXCLliqDovb3pooTop4jnqpfkvZPmiJDlip8hXCIpO1xuICAgIH0pO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgV0ZEQ1RfVGV4dEJveCA9IHt9OyJdfQ==
