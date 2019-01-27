define([], function () {
  "use strict";

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var CKEditorUtility = function () {
    function CKEditorUtility() {
      _classCallCheck(this, CKEditorUtility);
    }

    _createClass(CKEditorUtility, null, [{
      key: "GetCKEditorInst",
      value: function GetCKEditorInst() {
        return this._CKEditorInst;
      }
    }, {
      key: "GetCKEditorHTML",
      value: function GetCKEditorHTML() {
        return this._CKEditorInst.getData();
      }
    }, {
      key: "SetCKEditorHTML",
      value: function SetCKEditorHTML(html) {
        this._CKEditorInst.setData(html);
      }
    }, {
      key: "InitializeCKEditor",
      value: function InitializeCKEditor(textAreaElemId, pluginsConfig, loadCompletedFunc) {
        var extraPlugins = new Array();

        for (var i = 0; i < pluginsConfig.length; i++) {
          var singlePluginConfig = pluginsConfig[i];
          var singleName = singlePluginConfig.singleName;
          var toolbarLocation = singlePluginConfig.toolbarLocation;
          var text = singlePluginConfig.text;
          var serverResolve = singlePluginConfig.serverResolve;
          var clientResolve = singlePluginConfig.clientResolve;
          var clientResolveJs = singlePluginConfig.clientResolveJs;
          var dialogWidth = singlePluginConfig.dialogWidth;
          var dialogHeight = singlePluginConfig.dialogHeight;
          var isJBuild4DData = singlePluginConfig.isJBuild4DData;
          var pluginFileName = singleName + "Plugin.js";
          var pluginFolderName = "../../HTMLDesign/FormDesign/Plugins/" + singleName + "/";
          CKEDITOR.plugins.addExternal(singleName, pluginFolderName, pluginFileName);
          extraPlugins.push(singleName);
          CKEditorUtility.PluginsServerConfig[singleName] = {
            SingleName: singleName,
            ToolbarLocation: toolbarLocation,
            ToolbarLabel: text,
            ClientResolve: clientResolve,
            ServerResolve: serverResolve,
            ClientResolveJs: clientResolveJs,
            DialogWidth: dialogWidth,
            DialogHeight: dialogHeight,
            IsJBuild4DData: isJBuild4DData
          };
        }

        var editorConfigUrl = BaseUtility.AppendTimeStampUrl('../../HTMLDesign/FormDesign/CKEditorConfig.js');
        CKEDITOR.replace(textAreaElemId, {
          customConfig: editorConfigUrl,
          extraPlugins: extraPlugins.join(",")
        });
        CKEDITOR.instances.html_design.on("paste", function (event) {
          try {
            alert("暂时不支持!");
            var copyData = event.data.dataValue;
            var $copyData = $(copyData);
            $copyData.attr("id", "ct_copy_" + StringUtility.Timestamp());
            $copyData.find("input").each(function () {
              $(this).attr("id", "ct_copy_" + StringUtility.Timestamp());
            });
            var newHtml = $copyData.outerHTML();

            if (typeof newHtml == "string") {
              event.data.dataValue = newHtml;
            }
          } catch (e) {
            alert("粘贴操作失败!");
          }
        });
        this._CKEditorInst = CKEDITOR.instances.html_design;
        CKEDITOR.on('instanceReady', function (e) {
          if (typeof loadCompletedFunc == "function") {
            loadCompletedFunc();
          }
        });
      }
    }]);

    return CKEditorUtility;
  }();

  _defineProperty(CKEditorUtility, "PluginsServerConfig", {});

  _defineProperty(CKEditorUtility, "_CKEditorInst", null);
});
define([], function () {
  "use strict";

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var JsEditorUtility = function () {
    function JsEditorUtility() {
      _classCallCheck(this, JsEditorUtility);
    }

    _createClass(JsEditorUtility, null, [{
      key: "GetHTMLEditorInst",
      value: function GetHTMLEditorInst() {
        return this._HTMLEditorInst;
      }
    }, {
      key: "SetHTMLEditorHTML",
      value: function SetHTMLEditorHTML(html) {
        if (!StringUtility.IsNullOrEmpty(html)) {
          this.GetHTMLEditorInst().setValue(html);
          CodeMirror.commands["selectAll"](this.GetHTMLEditorInst());
          var range = {
            from: this.GetHTMLEditorInst().getCursor(true),
            to: this.GetHTMLEditorInst().getCursor(false)
          };
          ;
          this.GetHTMLEditorInst().autoFormatRange(range.from, range.to);
        }
      }
    }, {
      key: "GetHtmlEditorHTML",
      value: function GetHtmlEditorHTML() {
        return this.GetHTMLEditorInst().getValue();
      }
    }, {
      key: "InitializeHTMLCodeDesign",
      value: function InitializeHTMLCodeDesign() {
        var mixedMode = {
          name: "htmlmixed",
          scriptTypes: [{
            matches: /\/x-handlebars-template|\/x-mustache/i,
            mode: null
          }, {
            matches: /(text|application)\/(x-)?vb(a|script)/i,
            mode: "vbscript"
          }]
        };
        this._HTMLEditorInst = CodeMirror.fromTextArea(document.getElementById("TextAreaHTMLEditor"), {
          mode: mixedMode,
          selectionPointer: true,
          theme: "monokai",
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          lineNumbers: true,
          lineWrapping: true
        });

        this._HTMLEditorInst.setSize("100%", PageStyleUtility.GetWindowHeight() - 85);
      }
    }]);

    return JsEditorUtility;
  }();

  _defineProperty(JsEditorUtility, "_HTMLEditorInst", null);
});
define([], function () {
  "use strict";

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

  function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

  function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

  function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

  var JsEditorUtility = function () {
    function JsEditorUtility() {
      _classCallCheck(this, JsEditorUtility);
    }

    _createClass(JsEditorUtility, null, [{
      key: "_GetNewFormJsString",
      value: function _GetNewFormJsString() {
        return "<script>var FormPageObjectInstance={" + "data:{" + "userEntity:{}," + "formEntity:[]," + "config:[]" + "}," + "pageReady:function(){}," + "bindRecordDataReady:function(){}," + "validateEveryFromControl:function(controlObj){}" + "}</script>";
      }
    }, {
      key: "GetJsEditorInst",
      value: function GetJsEditorInst() {
        return this._JsEditorInst;
      }
    }, {
      key: "SetJsEditorJs",
      value: function SetJsEditorJs(js) {
        this.GetJsEditorInst().setValue(js);
      }
    }, {
      key: "GetJsEditorJs",
      value: function GetJsEditorJs() {
        return this.GetJsEditorInst().getValue();
      }
    }, {
      key: "InitializeJsCodeDesign",
      value: function InitializeJsCodeDesign(status) {
        this._JsEditorInst = CodeMirror.fromTextArea($("#TextAreaJsEditor")[0], {
          mode: "application/ld+json",
          lineNumbers: true,
          lineWrapping: true,
          extraKeys: {
            "Ctrl-Q": function CtrlQ(cm) {
              cm.foldCode(cm.getCursor());
            }
          },
          foldGutter: true,
          smartIndent: true,
          matchBrackets: true,
          theme: "monokai",
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });

        this._JsEditorInst.setSize("100%", PageStyleUtility.GetWindowHeight() - 85);

        if (status == "add") {
          this.SetJsEditorJs(this._GetNewFormJsString());
          CodeMirror.commands["selectAll"](this.GetJsEditorInst());
          var range = {
            from: this.GetJsEditorInst().getCursor(true),
            to: this.GetJsEditorInst().getCursor(false)
          };
          this.GetJsEditorInst().autoFormatRange(range.from, range.to);
        }
      }
    }]);

    return JsEditorUtility;
  }();

  _defineProperty(JsEditorUtility, "_JsEditorInst", null);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNLRWRpdG9yVXRpbGl0eS5qcyIsIkhUTUxFZGl0b3JVdGlsaXR5LmpzIiwiSnNFZGl0b3JVdGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkZvcm1EZXNpZ25VdGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbiAgZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbiAgZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuICB2YXIgQ0tFZGl0b3JVdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENLRWRpdG9yVXRpbGl0eSgpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDS0VkaXRvclV0aWxpdHkpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhDS0VkaXRvclV0aWxpdHksIG51bGwsIFt7XG4gICAgICBrZXk6IFwiR2V0Q0tFZGl0b3JJbnN0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gR2V0Q0tFZGl0b3JJbnN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fQ0tFZGl0b3JJbnN0O1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJHZXRDS0VkaXRvckhUTUxcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRDS0VkaXRvckhUTUwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9DS0VkaXRvckluc3QuZ2V0RGF0YSgpO1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJTZXRDS0VkaXRvckhUTUxcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRDS0VkaXRvckhUTUwoaHRtbCkge1xuICAgICAgICB0aGlzLl9DS0VkaXRvckluc3Quc2V0RGF0YShodG1sKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiSW5pdGlhbGl6ZUNLRWRpdG9yXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gSW5pdGlhbGl6ZUNLRWRpdG9yKHRleHRBcmVhRWxlbUlkLCBwbHVnaW5zQ29uZmlnLCBsb2FkQ29tcGxldGVkRnVuYykge1xuICAgICAgICB2YXIgZXh0cmFQbHVnaW5zID0gbmV3IEFycmF5KCk7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbHVnaW5zQ29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHNpbmdsZVBsdWdpbkNvbmZpZyA9IHBsdWdpbnNDb25maWdbaV07XG4gICAgICAgICAgdmFyIHNpbmdsZU5hbWUgPSBzaW5nbGVQbHVnaW5Db25maWcuc2luZ2xlTmFtZTtcbiAgICAgICAgICB2YXIgdG9vbGJhckxvY2F0aW9uID0gc2luZ2xlUGx1Z2luQ29uZmlnLnRvb2xiYXJMb2NhdGlvbjtcbiAgICAgICAgICB2YXIgdGV4dCA9IHNpbmdsZVBsdWdpbkNvbmZpZy50ZXh0O1xuICAgICAgICAgIHZhciBzZXJ2ZXJSZXNvbHZlID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNlcnZlclJlc29sdmU7XG4gICAgICAgICAgdmFyIGNsaWVudFJlc29sdmUgPSBzaW5nbGVQbHVnaW5Db25maWcuY2xpZW50UmVzb2x2ZTtcbiAgICAgICAgICB2YXIgY2xpZW50UmVzb2x2ZUpzID0gc2luZ2xlUGx1Z2luQ29uZmlnLmNsaWVudFJlc29sdmVKcztcbiAgICAgICAgICB2YXIgZGlhbG9nV2lkdGggPSBzaW5nbGVQbHVnaW5Db25maWcuZGlhbG9nV2lkdGg7XG4gICAgICAgICAgdmFyIGRpYWxvZ0hlaWdodCA9IHNpbmdsZVBsdWdpbkNvbmZpZy5kaWFsb2dIZWlnaHQ7XG4gICAgICAgICAgdmFyIGlzSkJ1aWxkNEREYXRhID0gc2luZ2xlUGx1Z2luQ29uZmlnLmlzSkJ1aWxkNEREYXRhO1xuICAgICAgICAgIHZhciBwbHVnaW5GaWxlTmFtZSA9IHNpbmdsZU5hbWUgKyBcIlBsdWdpbi5qc1wiO1xuICAgICAgICAgIHZhciBwbHVnaW5Gb2xkZXJOYW1lID0gXCIuLi8uLi9IVE1MRGVzaWduL0Zvcm1EZXNpZ24vUGx1Z2lucy9cIiArIHNpbmdsZU5hbWUgKyBcIi9cIjtcbiAgICAgICAgICBDS0VESVRPUi5wbHVnaW5zLmFkZEV4dGVybmFsKHNpbmdsZU5hbWUsIHBsdWdpbkZvbGRlck5hbWUsIHBsdWdpbkZpbGVOYW1lKTtcbiAgICAgICAgICBleHRyYVBsdWdpbnMucHVzaChzaW5nbGVOYW1lKTtcbiAgICAgICAgICBDS0VkaXRvclV0aWxpdHkuUGx1Z2luc1NlcnZlckNvbmZpZ1tzaW5nbGVOYW1lXSA9IHtcbiAgICAgICAgICAgIFNpbmdsZU5hbWU6IHNpbmdsZU5hbWUsXG4gICAgICAgICAgICBUb29sYmFyTG9jYXRpb246IHRvb2xiYXJMb2NhdGlvbixcbiAgICAgICAgICAgIFRvb2xiYXJMYWJlbDogdGV4dCxcbiAgICAgICAgICAgIENsaWVudFJlc29sdmU6IGNsaWVudFJlc29sdmUsXG4gICAgICAgICAgICBTZXJ2ZXJSZXNvbHZlOiBzZXJ2ZXJSZXNvbHZlLFxuICAgICAgICAgICAgQ2xpZW50UmVzb2x2ZUpzOiBjbGllbnRSZXNvbHZlSnMsXG4gICAgICAgICAgICBEaWFsb2dXaWR0aDogZGlhbG9nV2lkdGgsXG4gICAgICAgICAgICBEaWFsb2dIZWlnaHQ6IGRpYWxvZ0hlaWdodCxcbiAgICAgICAgICAgIElzSkJ1aWxkNEREYXRhOiBpc0pCdWlsZDRERGF0YVxuICAgICAgICAgIH07XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZWRpdG9yQ29uZmlnVXJsID0gQmFzZVV0aWxpdHkuQXBwZW5kVGltZVN0YW1wVXJsKCcuLi8uLi9IVE1MRGVzaWduL0Zvcm1EZXNpZ24vQ0tFZGl0b3JDb25maWcuanMnKTtcbiAgICAgICAgQ0tFRElUT1IucmVwbGFjZSh0ZXh0QXJlYUVsZW1JZCwge1xuICAgICAgICAgIGN1c3RvbUNvbmZpZzogZWRpdG9yQ29uZmlnVXJsLFxuICAgICAgICAgIGV4dHJhUGx1Z2luczogZXh0cmFQbHVnaW5zLmpvaW4oXCIsXCIpXG4gICAgICAgIH0pO1xuICAgICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oXCJwYXN0ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgYWxlcnQoXCLmmoLml7bkuI3mlK/mjIEhXCIpO1xuICAgICAgICAgICAgdmFyIGNvcHlEYXRhID0gZXZlbnQuZGF0YS5kYXRhVmFsdWU7XG4gICAgICAgICAgICB2YXIgJGNvcHlEYXRhID0gJChjb3B5RGF0YSk7XG4gICAgICAgICAgICAkY29weURhdGEuYXR0cihcImlkXCIsIFwiY3RfY29weV9cIiArIFN0cmluZ1V0aWxpdHkuVGltZXN0YW1wKCkpO1xuICAgICAgICAgICAgJGNvcHlEYXRhLmZpbmQoXCJpbnB1dFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgJCh0aGlzKS5hdHRyKFwiaWRcIiwgXCJjdF9jb3B5X1wiICsgU3RyaW5nVXRpbGl0eS5UaW1lc3RhbXAoKSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBuZXdIdG1sID0gJGNvcHlEYXRhLm91dGVySFRNTCgpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIG5ld0h0bWwgPT0gXCJzdHJpbmdcIikge1xuICAgICAgICAgICAgICBldmVudC5kYXRhLmRhdGFWYWx1ZSA9IG5ld0h0bWw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgYWxlcnQoXCLnspjotLTmk43kvZzlpLHotKUhXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX0NLRWRpdG9ySW5zdCA9IENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbjtcbiAgICAgICAgQ0tFRElUT1Iub24oJ2luc3RhbmNlUmVhZHknLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICAgIGlmICh0eXBlb2YgbG9hZENvbXBsZXRlZEZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBsb2FkQ29tcGxldGVkRnVuYygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIENLRWRpdG9yVXRpbGl0eTtcbiAgfSgpO1xuXG4gIF9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclV0aWxpdHksIFwiUGx1Z2luc1NlcnZlckNvbmZpZ1wiLCB7fSk7XG5cbiAgX2RlZmluZVByb3BlcnR5KENLRWRpdG9yVXRpbGl0eSwgXCJfQ0tFZGl0b3JJbnN0XCIsIG51bGwpO1xufSk7IiwiZGVmaW5lKFtdLCBmdW5jdGlvbiAoKSB7XG4gIFwidXNlIHN0cmljdFwiO1xuXG4gIGZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbiAgZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG4gIGZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbiAgZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxuICB2YXIgSnNFZGl0b3JVdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEpzRWRpdG9yVXRpbGl0eSgpIHtcbiAgICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBKc0VkaXRvclV0aWxpdHkpO1xuICAgIH1cblxuICAgIF9jcmVhdGVDbGFzcyhKc0VkaXRvclV0aWxpdHksIG51bGwsIFt7XG4gICAgICBrZXk6IFwiR2V0SFRNTEVkaXRvckluc3RcIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRIVE1MRWRpdG9ySW5zdCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0hUTUxFZGl0b3JJbnN0O1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJTZXRIVE1MRWRpdG9ySFRNTFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIFNldEhUTUxFZGl0b3JIVE1MKGh0bWwpIHtcbiAgICAgICAgaWYgKCFTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkoaHRtbCkpIHtcbiAgICAgICAgICB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuc2V0VmFsdWUoaHRtbCk7XG4gICAgICAgICAgQ29kZU1pcnJvci5jb21tYW5kc1tcInNlbGVjdEFsbFwiXSh0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkpO1xuICAgICAgICAgIHZhciByYW5nZSA9IHtcbiAgICAgICAgICAgIGZyb206IHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXRDdXJzb3IodHJ1ZSksXG4gICAgICAgICAgICB0bzogdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldEN1cnNvcihmYWxzZSlcbiAgICAgICAgICB9O1xuICAgICAgICAgIDtcbiAgICAgICAgICB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuYXV0b0Zvcm1hdFJhbmdlKHJhbmdlLmZyb20sIHJhbmdlLnRvKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJHZXRIdG1sRWRpdG9ySFRNTFwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIEdldEh0bWxFZGl0b3JIVE1MKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldFZhbHVlKCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcIkluaXRpYWxpemVIVE1MQ29kZURlc2lnblwiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIEluaXRpYWxpemVIVE1MQ29kZURlc2lnbigpIHtcbiAgICAgICAgdmFyIG1peGVkTW9kZSA9IHtcbiAgICAgICAgICBuYW1lOiBcImh0bWxtaXhlZFwiLFxuICAgICAgICAgIHNjcmlwdFR5cGVzOiBbe1xuICAgICAgICAgICAgbWF0Y2hlczogL1xcL3gtaGFuZGxlYmFycy10ZW1wbGF0ZXxcXC94LW11c3RhY2hlL2ksXG4gICAgICAgICAgICBtb2RlOiBudWxsXG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgbWF0Y2hlczogLyh0ZXh0fGFwcGxpY2F0aW9uKVxcLyh4LSk/dmIoYXxzY3JpcHQpL2ksXG4gICAgICAgICAgICBtb2RlOiBcInZic2NyaXB0XCJcbiAgICAgICAgICB9XVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9IVE1MRWRpdG9ySW5zdCA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiVGV4dEFyZWFIVE1MRWRpdG9yXCIpLCB7XG4gICAgICAgICAgbW9kZTogbWl4ZWRNb2RlLFxuICAgICAgICAgIHNlbGVjdGlvblBvaW50ZXI6IHRydWUsXG4gICAgICAgICAgdGhlbWU6IFwibW9ub2thaVwiLFxuICAgICAgICAgIGZvbGRHdXR0ZXI6IHRydWUsXG4gICAgICAgICAgZ3V0dGVyczogW1wiQ29kZU1pcnJvci1saW5lbnVtYmVyc1wiLCBcIkNvZGVNaXJyb3ItZm9sZGd1dHRlclwiXSxcbiAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fSFRNTEVkaXRvckluc3Quc2V0U2l6ZShcIjEwMCVcIiwgUGFnZVN0eWxlVXRpbGl0eS5HZXRXaW5kb3dIZWlnaHQoKSAtIDg1KTtcbiAgICAgIH1cbiAgICB9XSk7XG5cbiAgICByZXR1cm4gSnNFZGl0b3JVdGlsaXR5O1xuICB9KCk7XG5cbiAgX2RlZmluZVByb3BlcnR5KEpzRWRpdG9yVXRpbGl0eSwgXCJfSFRNTEVkaXRvckluc3RcIiwgbnVsbCk7XG59KTsiLCJkZWZpbmUoW10sIGZ1bmN0aW9uICgpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuICBmdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbiAgZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuICBmdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG4gIHZhciBKc0VkaXRvclV0aWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gSnNFZGl0b3JVdGlsaXR5KCkge1xuICAgICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEpzRWRpdG9yVXRpbGl0eSk7XG4gICAgfVxuXG4gICAgX2NyZWF0ZUNsYXNzKEpzRWRpdG9yVXRpbGl0eSwgbnVsbCwgW3tcbiAgICAgIGtleTogXCJfR2V0TmV3Rm9ybUpzU3RyaW5nXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gX0dldE5ld0Zvcm1Kc1N0cmluZygpIHtcbiAgICAgICAgcmV0dXJuIFwiPHNjcmlwdD52YXIgRm9ybVBhZ2VPYmplY3RJbnN0YW5jZT17XCIgKyBcImRhdGE6e1wiICsgXCJ1c2VyRW50aXR5Ont9LFwiICsgXCJmb3JtRW50aXR5OltdLFwiICsgXCJjb25maWc6W11cIiArIFwifSxcIiArIFwicGFnZVJlYWR5OmZ1bmN0aW9uKCl7fSxcIiArIFwiYmluZFJlY29yZERhdGFSZWFkeTpmdW5jdGlvbigpe30sXCIgKyBcInZhbGlkYXRlRXZlcnlGcm9tQ29udHJvbDpmdW5jdGlvbihjb250cm9sT2JqKXt9XCIgKyBcIn08L3NjcmlwdD5cIjtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiR2V0SnNFZGl0b3JJbnN0XCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gR2V0SnNFZGl0b3JJbnN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fSnNFZGl0b3JJbnN0O1xuICAgICAgfVxuICAgIH0sIHtcbiAgICAgIGtleTogXCJTZXRKc0VkaXRvckpzXCIsXG4gICAgICB2YWx1ZTogZnVuY3Rpb24gU2V0SnNFZGl0b3JKcyhqcykge1xuICAgICAgICB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLnNldFZhbHVlKGpzKTtcbiAgICAgIH1cbiAgICB9LCB7XG4gICAgICBrZXk6IFwiR2V0SnNFZGl0b3JKc1wiLFxuICAgICAgdmFsdWU6IGZ1bmN0aW9uIEdldEpzRWRpdG9ySnMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLmdldFZhbHVlKCk7XG4gICAgICB9XG4gICAgfSwge1xuICAgICAga2V5OiBcIkluaXRpYWxpemVKc0NvZGVEZXNpZ25cIixcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiBJbml0aWFsaXplSnNDb2RlRGVzaWduKHN0YXR1cykge1xuICAgICAgICB0aGlzLl9Kc0VkaXRvckluc3QgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYSgkKFwiI1RleHRBcmVhSnNFZGl0b3JcIilbMF0sIHtcbiAgICAgICAgICBtb2RlOiBcImFwcGxpY2F0aW9uL2xkK2pzb25cIixcbiAgICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICAgICAgZXh0cmFLZXlzOiB7XG4gICAgICAgICAgICBcIkN0cmwtUVwiOiBmdW5jdGlvbiBDdHJsUShjbSkge1xuICAgICAgICAgICAgICBjbS5mb2xkQ29kZShjbS5nZXRDdXJzb3IoKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmb2xkR3V0dGVyOiB0cnVlLFxuICAgICAgICAgIHNtYXJ0SW5kZW50OiB0cnVlLFxuICAgICAgICAgIG1hdGNoQnJhY2tldHM6IHRydWUsXG4gICAgICAgICAgdGhlbWU6IFwibW9ub2thaVwiLFxuICAgICAgICAgIGd1dHRlcnM6IFtcIkNvZGVNaXJyb3ItbGluZW51bWJlcnNcIiwgXCJDb2RlTWlycm9yLWZvbGRndXR0ZXJcIl1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5fSnNFZGl0b3JJbnN0LnNldFNpemUoXCIxMDAlXCIsIFBhZ2VTdHlsZVV0aWxpdHkuR2V0V2luZG93SGVpZ2h0KCkgLSA4NSk7XG5cbiAgICAgICAgaWYgKHN0YXR1cyA9PSBcImFkZFwiKSB7XG4gICAgICAgICAgdGhpcy5TZXRKc0VkaXRvckpzKHRoaXMuX0dldE5ld0Zvcm1Kc1N0cmluZygpKTtcbiAgICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW1wic2VsZWN0QWxsXCJdKHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkpO1xuICAgICAgICAgIHZhciByYW5nZSA9IHtcbiAgICAgICAgICAgIGZyb206IHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKHRydWUpLFxuICAgICAgICAgICAgdG86IHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKGZhbHNlKVxuICAgICAgICAgIH07XG4gICAgICAgICAgdGhpcy5HZXRKc0VkaXRvckluc3QoKS5hdXRvRm9ybWF0UmFuZ2UocmFuZ2UuZnJvbSwgcmFuZ2UudG8pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfV0pO1xuXG4gICAgcmV0dXJuIEpzRWRpdG9yVXRpbGl0eTtcbiAgfSgpO1xuXG4gIF9kZWZpbmVQcm9wZXJ0eShKc0VkaXRvclV0aWxpdHksIFwiX0pzRWRpdG9ySW5zdFwiLCBudWxsKTtcbn0pOyJdfQ==
