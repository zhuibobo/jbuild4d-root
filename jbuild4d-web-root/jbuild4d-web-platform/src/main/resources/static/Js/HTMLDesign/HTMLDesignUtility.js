"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var CKEditorPluginUtility = function () {
  function CKEditorPluginUtility() {
    _classCallCheck(this, CKEditorPluginUtility);
  }

  _createClass(CKEditorPluginUtility, null, [{
    key: "AddPluginsServerConfig",
    value: function AddPluginsServerConfig(singleName, toolbarLocation, text, clientResolve, serverResolve, clientResolveJs, dialogWidth, dialogHeight, isJBuild4DData, controlCategory) {
      this.PluginsServerConfig[singleName] = {
        SingleName: singleName,
        ToolbarLocation: toolbarLocation,
        ToolbarLabel: text,
        ClientResolve: clientResolve,
        ServerResolve: serverResolve,
        ClientResolveJs: clientResolveJs,
        DialogWidth: dialogWidth,
        DialogHeight: dialogHeight,
        IsJBuild4DData: isJBuild4DData,
        ControlCategory: controlCategory
      };
    }
  }, {
    key: "_UseServerConfigCoverEmptyPluginProp",
    value: function _UseServerConfigCoverEmptyPluginProp(obj) {
      var coverObj = this.PluginsServerConfig[obj.SingleName];

      for (var prop in obj) {
        if (typeof obj[prop] != "function") {
          if (obj[prop] == "" || obj[prop] == null) {
            if (coverObj[prop]) {
              obj[prop] = coverObj[prop];
            }
          }
        }
      }

      return obj;
    }
  }, {
    key: "GetGeneralPluginInstance",
    value: function GetGeneralPluginInstance(pluginSingleName, exConfig) {
      var defaultSetting = {
        SingleName: pluginSingleName,
        DialogName: '',
        DialogWidth: null,
        DialogHeight: null,
        DialogPageUrl: BaseUtility.AppendTimeStampUrl('Dialog.html'),
        DialogTitle: "DIV",
        ToolbarCommand: '',
        ToolbarIcon: 'Icon.png',
        ToolbarLabel: "",
        ToolbarLocation: '',
        IFrameWindow: null,
        IFrameExecuteActionName: "Insert",
        DesignModalInputCss: "",
        ClientResolve: "",
        ServerResolve: "",
        IsJBuild4DData: "",
        ControlCategory: ""
      };
      defaultSetting = $.extend(true, {}, defaultSetting, exConfig);
      defaultSetting = CKEditorPluginUtility._UseServerConfigCoverEmptyPluginProp(defaultSetting);
      defaultSetting.DialogName = defaultSetting.SingleName;
      defaultSetting.ToolbarCommand = "JBuild4D.FormDesign.Plugins." + defaultSetting.SingleName;
      defaultSetting.DialogSettingTitle = defaultSetting.ToolbarLabel + "Web控件";
      return {
        Setting: defaultSetting
      };
    }
  }, {
    key: "RegGeneralPluginToEditor",
    value: function RegGeneralPluginToEditor(ckEditor, path, pluginSetting, okFunc) {
      CKEDITOR.dialog.addIframe(pluginSetting.DialogName, pluginSetting.DialogSettingTitle, path + pluginSetting.DialogPageUrl, pluginSetting.DialogWidth, pluginSetting.DialogHeight, function () {
        var iframe = document.getElementById(this._.frameId);
        pluginSetting.IFrameWindow = iframe;
        CKEditorPluginUtility.SetElemPropsInEditDialog(pluginSetting.IFrameWindow, pluginSetting.IFrameExecuteActionName);
      }, {
        onOk: function onOk() {
          var props = pluginSetting.IFrameWindow.contentWindow.DialogApp.getControlProps();

          if (props.success == false) {
            return false;
          }

          okFunc(ckEditor, pluginSetting, props, pluginSetting.IFrameWindow.contentWindow);
          pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteInsertActionName;
        },
        onCancel: function onCancel() {
          pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteInsertActionName;
        }
      });
      ckEditor.addCommand(pluginSetting.ToolbarCommand, new CKEDITOR.dialogCommand(pluginSetting.DialogName));
      ckEditor.ui.addButton(pluginSetting.SingleName, {
        label: pluginSetting.ToolbarLabel,
        icon: path + pluginSetting.ToolbarIcon,
        command: pluginSetting.ToolbarCommand,
        toolbar: pluginSetting.ToolbarLocation
      });
      ckEditor.on('doubleclick', function (event) {
        pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteEditActionName;
        CKEditorPluginUtility.OnCKWysiwygElemDBClickEvent(event, pluginSetting);
      });
    }
  }, {
    key: "OnCKWysiwygElemDBClickEvent",
    value: function OnCKWysiwygElemDBClickEvent(event, controlSetting) {
      var element = event.data.element;

      if (element.getAttribute("auto_remove") == "true") {
        element = event.data.element.getParent();
      }

      var singleName = element.getAttribute("singleName");

      if (singleName == controlSetting.SingleName) {
        CKEditorUtility.SetSelectedElem(element.getOuterHtml());
        event.data.dialog = controlSetting.DialogName;
      }
    }
  }, {
    key: "SerializePropsToElem",
    value: function SerializePropsToElem(elem, props, controlSetting) {
      elem.setAttribute("jbuild4d_custom", "true");
      elem.setAttribute("singlename", controlSetting.SingleName);
      elem.setAttribute("clientresolve", controlSetting.ClientResolve);
      elem.setAttribute("serverresolve", controlSetting.ServerResolve);
      elem.setAttribute("is_jbuild4d_data", controlSetting.IsJBuild4DData);
      elem.setAttribute("control_category", controlSetting.ControlCategory);

      if (props["baseInfo"]) {
        for (var key in props["baseInfo"]) {
          if (key == "readonly") {
            if (props["baseInfo"][key] == "readonly") {
              elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
            } else {
              elem.removeAttribute("readonly");
            }
          } else if (key == "disabled") {
            if (props["baseInfo"][key] == "disabled") {
              elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
            } else {
              elem.removeAttribute("disabled");
            }
          } else {
            elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
          }
        }
      }

      if (props["bindToField"]) {
        for (var key in props["bindToField"]) {
          elem.setAttribute(key.toLocaleLowerCase(), props["bindToField"][key]);
        }
      }

      if (props["defaultValue"]) {
        for (var key in props["defaultValue"]) {
          elem.setAttribute(key.toLocaleLowerCase(), props["defaultValue"][key]);
        }
      }

      if (props["validateRules"]) {
        if (props["validateRules"].rules) {
          if (props["validateRules"].rules.length > 0) {
            elem.setAttribute("validaterules", encodeURIComponent(JsonUtility.JsonToString(props["validateRules"])));
          }
        }
      }

      return elem;
    }
  }, {
    key: "DeserializePropsFromElem",
    value: function DeserializePropsFromElem(elem) {
      var props = {};
      var $elem = $(elem);

      function attrToProp(props, groupName) {
        var groupProp = {};

        for (var key in this.DefaultProps[groupName]) {
          if ($elem.attr(key)) {
            groupProp[key] = $elem.attr(key);
          } else {
            groupProp[key] = this.DefaultProps[groupName][key];
          }
        }

        props[groupName] = groupProp;
        return props;
      }

      props = attrToProp.call(this, props, "baseInfo");
      props = attrToProp.call(this, props, "bindToField");
      props = attrToProp.call(this, props, "defaultValue");

      if ($elem.attr("validateRules")) {
        props.validateRules = JsonUtility.StringToJson(decodeURIComponent($elem.attr("validateRules")));
      }

      return props;
    }
  }, {
    key: "BuildGeneralElemToCKWysiwyg",
    value: function BuildGeneralElemToCKWysiwyg(html, controlSetting, controlProps, _iframe) {
      if (this.ValidateBuildEnable(html, controlSetting, controlProps, _iframe)) {
        if (controlSetting.IFrameExecuteActionName == CKEditorPluginUtility.DialogExecuteInsertActionName) {
          var elem = CKEDITOR.dom.element.createFromHtml(html);
          this.SerializePropsToElem(elem, controlProps, controlSetting);
          CKEditorUtility.GetCKEditorInst().insertElement(elem);
          this.ElemBindEvent();
        } else {
          var selectedElem = CKEditorUtility.GetSelectedCKEditorElem();

          if (selectedElem) {
            var reFreshElem = new CKEDITOR.dom.element.createFromHtml(selectedElem.getOuterHtml());
            selectedElem.copyAttributes(reFreshElem, {
              temp: "temp"
            });
            this.SerializePropsToElem(reFreshElem, controlProps, controlSetting);
            reFreshElem.replace(selectedElem);
          }
        }
      }
    }
  }, {
    key: "ElemBindEvent",
    value: function ElemBindEvent() {
      var elements = CKEditorUtility.GetCKEditorInst().document.getBody().getElementsByTag('*');

      for (var i = 0; i < elements.count(); ++i) {
        if (elements.getItem(i).getAttribute("singlename") == "WFDCT_TextBox") {
          console.log(elements.getItem(i).getName());
          var elem = elements.getItem(i);
          elem.on('click', function () {
            CKEditorUtility.GetCKEditorInst().getSelection().selectElement(this);
          });
        }
      }
    }
  }, {
    key: "ValidateBuildEnable",
    value: function ValidateBuildEnable(html, controlSetting, controlProps, _iframe) {
      return true;
    }
  }, {
    key: "ValidateSerializeControlDialogCompletedEnable",
    value: function ValidateSerializeControlDialogCompletedEnable(returnResult) {
      if (returnResult.baseInfo.serialize == "true" && returnResult.bindToField.fieldName == "") {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "序列化的控件必须绑定字段!", null);
        return {
          success: false
        };
      }

      return returnResult;
    }
  }, {
    key: "SetElemPropsInEditDialog",
    value: function SetElemPropsInEditDialog(iframeObj, actionName) {
      iframeObj.contentWindow.DialogApp.ready(actionName);

      if (actionName == this.DialogExecuteEditActionName) {
        var elem = CKEditorUtility.GetSelectedElem().outerHTML();
        var props = this.DeserializePropsFromElem(elem);
        iframeObj.contentWindow.DialogApp.setControlProps(elem, props);
      }
    }
  }, {
    key: "GetControlDescText",
    value: function GetControlDescText(pluginSetting, props) {
      console.log(pluginSetting);
      console.log(props);
      return "[" + pluginSetting.ToolbarLabel + "] 绑定:[" + props.bindToField.tableCaption + "-" + props.bindToField.fieldCaption + "]";
    }
  }]);

  return CKEditorPluginUtility;
}();

_defineProperty(CKEditorPluginUtility, "PluginsServerConfig", {});

_defineProperty(CKEditorPluginUtility, "Plugins", {});

_defineProperty(CKEditorPluginUtility, "DefaultProps", {
  bindToField: {
    tableId: "",
    tableName: "",
    tableCaption: "",
    fieldName: "",
    fieldCaption: "",
    fieldDataType: "",
    fieldLength: ""
  },
  defaultValue: {
    defaultType: "",
    defaultValue: "",
    defaultText: ""
  },
  validateRules: {
    msg: "",
    rules: []
  },
  baseInfo: {
    id: "",
    serialize: "true",
    name: "",
    className: "",
    placeholder: "",
    readonly: "noreadonly",
    disabled: "nodisabled",
    style: "",
    desc: ""
  }
});

_defineProperty(CKEditorPluginUtility, "DialogExecuteEditActionName", "Edit");

_defineProperty(CKEditorPluginUtility, "DialogExecuteInsertActionName", "Insert");
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
    key: "SetSelectedElem",
    value: function SetSelectedElem(elemHtml) {
      this._$CKEditorSelectElem = $(elemHtml);
    }
  }, {
    key: "GetSelectedElem",
    value: function GetSelectedElem() {
      if (this._$CKEditorSelectElem.length > 0) {
        return this._$CKEditorSelectElem;
      }

      return null;
    }
  }, {
    key: "GetSelectedCKEditorElem",
    value: function GetSelectedCKEditorElem() {
      if (this.GetSelectedElem()) {
        var id = this.GetSelectedElem().attr("id");
        var element = this.GetCKEditorInst().document.getById(id);
        return element;
      }

      return null;
    }
  }, {
    key: "GetCKEditorInst",
    value: function GetCKEditorInst() {
      return this._CKEditorInst;
    }
  }, {
    key: "SetCKEditorInst",
    value: function SetCKEditorInst(inst) {
      this._CKEditorInst = inst;
    }
  }, {
    key: "GetCKEditorHTML",
    value: function GetCKEditorHTML() {
      return this.GetCKEditorInst().getData();
    }
  }, {
    key: "SetCKEditorHTML",
    value: function SetCKEditorHTML(html) {
      this.GetCKEditorInst().setData(html);
    }
  }, {
    key: "InitializeCKEditor",
    value: function InitializeCKEditor(textAreaElemId, pluginsConfig, loadCompletedFunc, ckeditorConfigFullPath, pluginBasePath, themeVo) {
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
        var controlCategory = singlePluginConfig.controlCategory;
        var pluginFileName = singleName + "Plugin.js";
        var pluginFolderName = pluginBasePath + singleName + "/";
        CKEDITOR.plugins.addExternal(singleName, pluginFolderName, pluginFileName);
        extraPlugins.push(singleName);
        CKEditorPluginUtility.AddPluginsServerConfig(singleName, toolbarLocation, text, clientResolve, serverResolve, clientResolveJs, dialogWidth, dialogHeight, isJBuild4DData, controlCategory);
      }

      this.SetThemeVo(themeVo);
      var editorConfigUrl = BaseUtility.AppendTimeStampUrl(ckeditorConfigFullPath);
      CKEDITOR.replace(textAreaElemId, {
        customConfig: editorConfigUrl,
        extraPlugins: extraPlugins.join(",")
      });
      CKEDITOR.instances.html_design.on("paste", function (event) {
        var sourceHTML = event.data.dataValue;

        try {
          var $sourceHTML = $(sourceHTML);

          if ($(sourceHTML).find("div").length == 1) {
            event.data.dataValue = $(sourceHTML).find("div").outerHTML();
          }
        } catch (e) {
          event.data.dataValue = sourceHTML;
        }
      });
      CKEDITOR.instances.html_design.on("afterPaste", function (event) {
        try {
          CKEditorPluginUtility.ElemBindEvent();
        } catch (e) {
          alert("粘贴操作失败!");
        }
      });
      CKEDITOR.instances.html_design.on('insertElement', function (event) {
        console.log("insertElement");
        console.log(event);
      });
      CKEDITOR.instances.html_design.on('insertHtml', function (event) {
        console.log("insertHtml");
        console.log(event);
      });
      this.SetCKEditorInst(CKEDITOR.instances.html_design);
      CKEDITOR.on('instanceReady', function (e) {
        if (typeof loadCompletedFunc == "function") {
          loadCompletedFunc();
          ;
        }
      });
    }
  }, {
    key: "GetThemeVo",
    value: function GetThemeVo() {
      return this._ThemeVo;
    }
  }, {
    key: "SetThemeVo",
    value: function SetThemeVo(_themeVo) {
      this._ThemeVo = _themeVo;
    }
  }]);

  return CKEditorUtility;
}();

_defineProperty(CKEditorUtility, "_$CKEditorSelectElem", null);

_defineProperty(CKEditorUtility, "_CKEditorInst", null);

_defineProperty(CKEditorUtility, "_ThemeVo", null);
"use strict";
"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var HTMLEditorUtility = function () {
  function HTMLEditorUtility() {
    _classCallCheck(this, HTMLEditorUtility);
  }

  _createClass(HTMLEditorUtility, null, [{
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

  return HTMLEditorUtility;
}();

_defineProperty(HTMLEditorUtility, "_HTMLEditorInst", null);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNLRWRpdG9yUGx1Z2luVXRpbGl0eS5qcyIsIkNLRWRpdG9yVXRpbGl0eS5qcyIsIkhUTUxFZGl0b3JEaWFsb2dVdGlsaXR5LmpzIiwiSFRNTEVkaXRvclV0aWxpdHkuanMiLCJKc0VkaXRvclV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakpBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkhUTUxEZXNpZ25VdGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIENLRWRpdG9yUGx1Z2luVXRpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDS0VkaXRvclBsdWdpblV0aWxpdHkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiQWRkUGx1Z2luc1NlcnZlckNvbmZpZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBBZGRQbHVnaW5zU2VydmVyQ29uZmlnKHNpbmdsZU5hbWUsIHRvb2xiYXJMb2NhdGlvbiwgdGV4dCwgY2xpZW50UmVzb2x2ZSwgc2VydmVyUmVzb2x2ZSwgY2xpZW50UmVzb2x2ZUpzLCBkaWFsb2dXaWR0aCwgZGlhbG9nSGVpZ2h0LCBpc0pCdWlsZDRERGF0YSwgY29udHJvbENhdGVnb3J5KSB7XG4gICAgICB0aGlzLlBsdWdpbnNTZXJ2ZXJDb25maWdbc2luZ2xlTmFtZV0gPSB7XG4gICAgICAgIFNpbmdsZU5hbWU6IHNpbmdsZU5hbWUsXG4gICAgICAgIFRvb2xiYXJMb2NhdGlvbjogdG9vbGJhckxvY2F0aW9uLFxuICAgICAgICBUb29sYmFyTGFiZWw6IHRleHQsXG4gICAgICAgIENsaWVudFJlc29sdmU6IGNsaWVudFJlc29sdmUsXG4gICAgICAgIFNlcnZlclJlc29sdmU6IHNlcnZlclJlc29sdmUsXG4gICAgICAgIENsaWVudFJlc29sdmVKczogY2xpZW50UmVzb2x2ZUpzLFxuICAgICAgICBEaWFsb2dXaWR0aDogZGlhbG9nV2lkdGgsXG4gICAgICAgIERpYWxvZ0hlaWdodDogZGlhbG9nSGVpZ2h0LFxuICAgICAgICBJc0pCdWlsZDRERGF0YTogaXNKQnVpbGQ0RERhdGEsXG4gICAgICAgIENvbnRyb2xDYXRlZ29yeTogY29udHJvbENhdGVnb3J5XG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfVXNlU2VydmVyQ29uZmlnQ292ZXJFbXB0eVBsdWdpblByb3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX1VzZVNlcnZlckNvbmZpZ0NvdmVyRW1wdHlQbHVnaW5Qcm9wKG9iaikge1xuICAgICAgdmFyIGNvdmVyT2JqID0gdGhpcy5QbHVnaW5zU2VydmVyQ29uZmlnW29iai5TaW5nbGVOYW1lXTtcblxuICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpbcHJvcF0gIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBcIlwiIHx8IG9ialtwcm9wXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY292ZXJPYmpbcHJvcF0pIHtcbiAgICAgICAgICAgICAgb2JqW3Byb3BdID0gY292ZXJPYmpbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEdlbmVyYWxQbHVnaW5JbnN0YW5jZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRHZW5lcmFsUGx1Z2luSW5zdGFuY2UocGx1Z2luU2luZ2xlTmFtZSwgZXhDb25maWcpIHtcbiAgICAgIHZhciBkZWZhdWx0U2V0dGluZyA9IHtcbiAgICAgICAgU2luZ2xlTmFtZTogcGx1Z2luU2luZ2xlTmFtZSxcbiAgICAgICAgRGlhbG9nTmFtZTogJycsXG4gICAgICAgIERpYWxvZ1dpZHRoOiBudWxsLFxuICAgICAgICBEaWFsb2dIZWlnaHQ6IG51bGwsXG4gICAgICAgIERpYWxvZ1BhZ2VVcmw6IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybCgnRGlhbG9nLmh0bWwnKSxcbiAgICAgICAgRGlhbG9nVGl0bGU6IFwiRElWXCIsXG4gICAgICAgIFRvb2xiYXJDb21tYW5kOiAnJyxcbiAgICAgICAgVG9vbGJhckljb246ICdJY29uLnBuZycsXG4gICAgICAgIFRvb2xiYXJMYWJlbDogXCJcIixcbiAgICAgICAgVG9vbGJhckxvY2F0aW9uOiAnJyxcbiAgICAgICAgSUZyYW1lV2luZG93OiBudWxsLFxuICAgICAgICBJRnJhbWVFeGVjdXRlQWN0aW9uTmFtZTogXCJJbnNlcnRcIixcbiAgICAgICAgRGVzaWduTW9kYWxJbnB1dENzczogXCJcIixcbiAgICAgICAgQ2xpZW50UmVzb2x2ZTogXCJcIixcbiAgICAgICAgU2VydmVyUmVzb2x2ZTogXCJcIixcbiAgICAgICAgSXNKQnVpbGQ0RERhdGE6IFwiXCIsXG4gICAgICAgIENvbnRyb2xDYXRlZ29yeTogXCJcIlxuICAgICAgfTtcbiAgICAgIGRlZmF1bHRTZXR0aW5nID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRTZXR0aW5nLCBleENvbmZpZyk7XG4gICAgICBkZWZhdWx0U2V0dGluZyA9IENLRWRpdG9yUGx1Z2luVXRpbGl0eS5fVXNlU2VydmVyQ29uZmlnQ292ZXJFbXB0eVBsdWdpblByb3AoZGVmYXVsdFNldHRpbmcpO1xuICAgICAgZGVmYXVsdFNldHRpbmcuRGlhbG9nTmFtZSA9IGRlZmF1bHRTZXR0aW5nLlNpbmdsZU5hbWU7XG4gICAgICBkZWZhdWx0U2V0dGluZy5Ub29sYmFyQ29tbWFuZCA9IFwiSkJ1aWxkNEQuRm9ybURlc2lnbi5QbHVnaW5zLlwiICsgZGVmYXVsdFNldHRpbmcuU2luZ2xlTmFtZTtcbiAgICAgIGRlZmF1bHRTZXR0aW5nLkRpYWxvZ1NldHRpbmdUaXRsZSA9IGRlZmF1bHRTZXR0aW5nLlRvb2xiYXJMYWJlbCArIFwiV2Vi5o6n5Lu2XCI7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBTZXR0aW5nOiBkZWZhdWx0U2V0dGluZ1xuICAgICAgfTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiUmVnR2VuZXJhbFBsdWdpblRvRWRpdG9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFJlZ0dlbmVyYWxQbHVnaW5Ub0VkaXRvcihja0VkaXRvciwgcGF0aCwgcGx1Z2luU2V0dGluZywgb2tGdW5jKSB7XG4gICAgICBDS0VESVRPUi5kaWFsb2cuYWRkSWZyYW1lKHBsdWdpblNldHRpbmcuRGlhbG9nTmFtZSwgcGx1Z2luU2V0dGluZy5EaWFsb2dTZXR0aW5nVGl0bGUsIHBhdGggKyBwbHVnaW5TZXR0aW5nLkRpYWxvZ1BhZ2VVcmwsIHBsdWdpblNldHRpbmcuRGlhbG9nV2lkdGgsIHBsdWdpblNldHRpbmcuRGlhbG9nSGVpZ2h0LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpZnJhbWUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLl8uZnJhbWVJZCk7XG4gICAgICAgIHBsdWdpblNldHRpbmcuSUZyYW1lV2luZG93ID0gaWZyYW1lO1xuICAgICAgICBDS0VkaXRvclBsdWdpblV0aWxpdHkuU2V0RWxlbVByb3BzSW5FZGl0RGlhbG9nKHBsdWdpblNldHRpbmcuSUZyYW1lV2luZG93LCBwbHVnaW5TZXR0aW5nLklGcmFtZUV4ZWN1dGVBY3Rpb25OYW1lKTtcbiAgICAgIH0sIHtcbiAgICAgICAgb25PazogZnVuY3Rpb24gb25PaygpIHtcbiAgICAgICAgICB2YXIgcHJvcHMgPSBwbHVnaW5TZXR0aW5nLklGcmFtZVdpbmRvdy5jb250ZW50V2luZG93LkRpYWxvZ0FwcC5nZXRDb250cm9sUHJvcHMoKTtcblxuICAgICAgICAgIGlmIChwcm9wcy5zdWNjZXNzID09IGZhbHNlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgb2tGdW5jKGNrRWRpdG9yLCBwbHVnaW5TZXR0aW5nLCBwcm9wcywgcGx1Z2luU2V0dGluZy5JRnJhbWVXaW5kb3cuY29udGVudFdpbmRvdyk7XG4gICAgICAgICAgcGx1Z2luU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSA9IENLRWRpdG9yUGx1Z2luVXRpbGl0eS5EaWFsb2dFeGVjdXRlSW5zZXJ0QWN0aW9uTmFtZTtcbiAgICAgICAgfSxcbiAgICAgICAgb25DYW5jZWw6IGZ1bmN0aW9uIG9uQ2FuY2VsKCkge1xuICAgICAgICAgIHBsdWdpblNldHRpbmcuSUZyYW1lRXhlY3V0ZUFjdGlvbk5hbWUgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUluc2VydEFjdGlvbk5hbWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgY2tFZGl0b3IuYWRkQ29tbWFuZChwbHVnaW5TZXR0aW5nLlRvb2xiYXJDb21tYW5kLCBuZXcgQ0tFRElUT1IuZGlhbG9nQ29tbWFuZChwbHVnaW5TZXR0aW5nLkRpYWxvZ05hbWUpKTtcbiAgICAgIGNrRWRpdG9yLnVpLmFkZEJ1dHRvbihwbHVnaW5TZXR0aW5nLlNpbmdsZU5hbWUsIHtcbiAgICAgICAgbGFiZWw6IHBsdWdpblNldHRpbmcuVG9vbGJhckxhYmVsLFxuICAgICAgICBpY29uOiBwYXRoICsgcGx1Z2luU2V0dGluZy5Ub29sYmFySWNvbixcbiAgICAgICAgY29tbWFuZDogcGx1Z2luU2V0dGluZy5Ub29sYmFyQ29tbWFuZCxcbiAgICAgICAgdG9vbGJhcjogcGx1Z2luU2V0dGluZy5Ub29sYmFyTG9jYXRpb25cbiAgICAgIH0pO1xuICAgICAgY2tFZGl0b3Iub24oJ2RvdWJsZWNsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHBsdWdpblNldHRpbmcuSUZyYW1lRXhlY3V0ZUFjdGlvbk5hbWUgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUVkaXRBY3Rpb25OYW1lO1xuICAgICAgICBDS0VkaXRvclBsdWdpblV0aWxpdHkuT25DS1d5c2l3eWdFbGVtREJDbGlja0V2ZW50KGV2ZW50LCBwbHVnaW5TZXR0aW5nKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJPbkNLV3lzaXd5Z0VsZW1EQkNsaWNrRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gT25DS1d5c2l3eWdFbGVtREJDbGlja0V2ZW50KGV2ZW50LCBjb250cm9sU2V0dGluZykge1xuICAgICAgdmFyIGVsZW1lbnQgPSBldmVudC5kYXRhLmVsZW1lbnQ7XG5cbiAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImF1dG9fcmVtb3ZlXCIpID09IFwidHJ1ZVwiKSB7XG4gICAgICAgIGVsZW1lbnQgPSBldmVudC5kYXRhLmVsZW1lbnQuZ2V0UGFyZW50KCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzaW5nbGVOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJzaW5nbGVOYW1lXCIpO1xuXG4gICAgICBpZiAoc2luZ2xlTmFtZSA9PSBjb250cm9sU2V0dGluZy5TaW5nbGVOYW1lKSB7XG4gICAgICAgIENLRWRpdG9yVXRpbGl0eS5TZXRTZWxlY3RlZEVsZW0oZWxlbWVudC5nZXRPdXRlckh0bWwoKSk7XG4gICAgICAgIGV2ZW50LmRhdGEuZGlhbG9nID0gY29udHJvbFNldHRpbmcuRGlhbG9nTmFtZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2VyaWFsaXplUHJvcHNUb0VsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2VyaWFsaXplUHJvcHNUb0VsZW0oZWxlbSwgcHJvcHMsIGNvbnRyb2xTZXR0aW5nKSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImpidWlsZDRkX2N1c3RvbVwiLCBcInRydWVcIik7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNpbmdsZW5hbWVcIiwgY29udHJvbFNldHRpbmcuU2luZ2xlTmFtZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImNsaWVudHJlc29sdmVcIiwgY29udHJvbFNldHRpbmcuQ2xpZW50UmVzb2x2ZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNlcnZlcnJlc29sdmVcIiwgY29udHJvbFNldHRpbmcuU2VydmVyUmVzb2x2ZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImlzX2pidWlsZDRkX2RhdGFcIiwgY29udHJvbFNldHRpbmcuSXNKQnVpbGQ0RERhdGEpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJjb250cm9sX2NhdGVnb3J5XCIsIGNvbnRyb2xTZXR0aW5nLkNvbnRyb2xDYXRlZ29yeSk7XG5cbiAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImJhc2VJbmZvXCJdKSB7XG4gICAgICAgICAgaWYgKGtleSA9PSBcInJlYWRvbmx5XCIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0gPT0gXCJyZWFkb25seVwiKSB7XG4gICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJyZWFkb25seVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBcImRpc2FibGVkXCIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0gPT0gXCJkaXNhYmxlZFwiKSB7XG4gICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wc1tcImJpbmRUb0ZpZWxkXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImJpbmRUb0ZpZWxkXCJdKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmluZFRvRmllbGRcIl1ba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzW1wiZGVmYXVsdFZhbHVlXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImRlZmF1bHRWYWx1ZVwiXSkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImRlZmF1bHRWYWx1ZVwiXVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHNbXCJ2YWxpZGF0ZVJ1bGVzXCJdKSB7XG4gICAgICAgIGlmIChwcm9wc1tcInZhbGlkYXRlUnVsZXNcIl0ucnVsZXMpIHtcbiAgICAgICAgICBpZiAocHJvcHNbXCJ2YWxpZGF0ZVJ1bGVzXCJdLnJ1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwidmFsaWRhdGVydWxlc1wiLCBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHByb3BzW1widmFsaWRhdGVSdWxlc1wiXSkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkRlc2VyaWFsaXplUHJvcHNGcm9tRWxlbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBEZXNlcmlhbGl6ZVByb3BzRnJvbUVsZW0oZWxlbSkge1xuICAgICAgdmFyIHByb3BzID0ge307XG4gICAgICB2YXIgJGVsZW0gPSAkKGVsZW0pO1xuXG4gICAgICBmdW5jdGlvbiBhdHRyVG9Qcm9wKHByb3BzLCBncm91cE5hbWUpIHtcbiAgICAgICAgdmFyIGdyb3VwUHJvcCA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLkRlZmF1bHRQcm9wc1tncm91cE5hbWVdKSB7XG4gICAgICAgICAgaWYgKCRlbGVtLmF0dHIoa2V5KSkge1xuICAgICAgICAgICAgZ3JvdXBQcm9wW2tleV0gPSAkZWxlbS5hdHRyKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdyb3VwUHJvcFtrZXldID0gdGhpcy5EZWZhdWx0UHJvcHNbZ3JvdXBOYW1lXVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByb3BzW2dyb3VwTmFtZV0gPSBncm91cFByb3A7XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICAgIH1cblxuICAgICAgcHJvcHMgPSBhdHRyVG9Qcm9wLmNhbGwodGhpcywgcHJvcHMsIFwiYmFzZUluZm9cIik7XG4gICAgICBwcm9wcyA9IGF0dHJUb1Byb3AuY2FsbCh0aGlzLCBwcm9wcywgXCJiaW5kVG9GaWVsZFwiKTtcbiAgICAgIHByb3BzID0gYXR0clRvUHJvcC5jYWxsKHRoaXMsIHByb3BzLCBcImRlZmF1bHRWYWx1ZVwiKTtcblxuICAgICAgaWYgKCRlbGVtLmF0dHIoXCJ2YWxpZGF0ZVJ1bGVzXCIpKSB7XG4gICAgICAgIHByb3BzLnZhbGlkYXRlUnVsZXMgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oZGVjb2RlVVJJQ29tcG9uZW50KCRlbGVtLmF0dHIoXCJ2YWxpZGF0ZVJ1bGVzXCIpKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiQnVpbGRHZW5lcmFsRWxlbVRvQ0tXeXNpd3lnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEJ1aWxkR2VuZXJhbEVsZW1Ub0NLV3lzaXd5ZyhodG1sLCBjb250cm9sU2V0dGluZywgY29udHJvbFByb3BzLCBfaWZyYW1lKSB7XG4gICAgICBpZiAodGhpcy5WYWxpZGF0ZUJ1aWxkRW5hYmxlKGh0bWwsIGNvbnRyb2xTZXR0aW5nLCBjb250cm9sUHJvcHMsIF9pZnJhbWUpKSB7XG4gICAgICAgIGlmIChjb250cm9sU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSA9PSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUluc2VydEFjdGlvbk5hbWUpIHtcbiAgICAgICAgICB2YXIgZWxlbSA9IENLRURJVE9SLmRvbS5lbGVtZW50LmNyZWF0ZUZyb21IdG1sKGh0bWwpO1xuICAgICAgICAgIHRoaXMuU2VyaWFsaXplUHJvcHNUb0VsZW0oZWxlbSwgY29udHJvbFByb3BzLCBjb250cm9sU2V0dGluZyk7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmluc2VydEVsZW1lbnQoZWxlbSk7XG4gICAgICAgICAgdGhpcy5FbGVtQmluZEV2ZW50KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNlbGVjdGVkRWxlbSA9IENLRWRpdG9yVXRpbGl0eS5HZXRTZWxlY3RlZENLRWRpdG9yRWxlbSgpO1xuXG4gICAgICAgICAgaWYgKHNlbGVjdGVkRWxlbSkge1xuICAgICAgICAgICAgdmFyIHJlRnJlc2hFbGVtID0gbmV3IENLRURJVE9SLmRvbS5lbGVtZW50LmNyZWF0ZUZyb21IdG1sKHNlbGVjdGVkRWxlbS5nZXRPdXRlckh0bWwoKSk7XG4gICAgICAgICAgICBzZWxlY3RlZEVsZW0uY29weUF0dHJpYnV0ZXMocmVGcmVzaEVsZW0sIHtcbiAgICAgICAgICAgICAgdGVtcDogXCJ0ZW1wXCJcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdGhpcy5TZXJpYWxpemVQcm9wc1RvRWxlbShyZUZyZXNoRWxlbSwgY29udHJvbFByb3BzLCBjb250cm9sU2V0dGluZyk7XG4gICAgICAgICAgICByZUZyZXNoRWxlbS5yZXBsYWNlKHNlbGVjdGVkRWxlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkVsZW1CaW5kRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gRWxlbUJpbmRFdmVudCgpIHtcbiAgICAgIHZhciBlbGVtZW50cyA9IENLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckluc3QoKS5kb2N1bWVudC5nZXRCb2R5KCkuZ2V0RWxlbWVudHNCeVRhZygnKicpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmNvdW50KCk7ICsraSkge1xuICAgICAgICBpZiAoZWxlbWVudHMuZ2V0SXRlbShpKS5nZXRBdHRyaWJ1dGUoXCJzaW5nbGVuYW1lXCIpID09IFwiV0ZEQ1RfVGV4dEJveFwiKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coZWxlbWVudHMuZ2V0SXRlbShpKS5nZXROYW1lKCkpO1xuICAgICAgICAgIHZhciBlbGVtID0gZWxlbWVudHMuZ2V0SXRlbShpKTtcbiAgICAgICAgICBlbGVtLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIENLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckluc3QoKS5nZXRTZWxlY3Rpb24oKS5zZWxlY3RFbGVtZW50KHRoaXMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlZhbGlkYXRlQnVpbGRFbmFibGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gVmFsaWRhdGVCdWlsZEVuYWJsZShodG1sLCBjb250cm9sU2V0dGluZywgY29udHJvbFByb3BzLCBfaWZyYW1lKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiVmFsaWRhdGVTZXJpYWxpemVDb250cm9sRGlhbG9nQ29tcGxldGVkRW5hYmxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFZhbGlkYXRlU2VyaWFsaXplQ29udHJvbERpYWxvZ0NvbXBsZXRlZEVuYWJsZShyZXR1cm5SZXN1bHQpIHtcbiAgICAgIGlmIChyZXR1cm5SZXN1bHQuYmFzZUluZm8uc2VyaWFsaXplID09IFwidHJ1ZVwiICYmIHJldHVyblJlc3VsdC5iaW5kVG9GaWVsZC5maWVsZE5hbWUgPT0gXCJcIikge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLluo/liJfljJbnmoTmjqfku7blv4Xpobvnu5HlrprlrZfmrrUhXCIsIG51bGwpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXR1cm5SZXN1bHQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldEVsZW1Qcm9wc0luRWRpdERpYWxvZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRFbGVtUHJvcHNJbkVkaXREaWFsb2coaWZyYW1lT2JqLCBhY3Rpb25OYW1lKSB7XG4gICAgICBpZnJhbWVPYmouY29udGVudFdpbmRvdy5EaWFsb2dBcHAucmVhZHkoYWN0aW9uTmFtZSk7XG5cbiAgICAgIGlmIChhY3Rpb25OYW1lID09IHRoaXMuRGlhbG9nRXhlY3V0ZUVkaXRBY3Rpb25OYW1lKSB7XG4gICAgICAgIHZhciBlbGVtID0gQ0tFZGl0b3JVdGlsaXR5LkdldFNlbGVjdGVkRWxlbSgpLm91dGVySFRNTCgpO1xuICAgICAgICB2YXIgcHJvcHMgPSB0aGlzLkRlc2VyaWFsaXplUHJvcHNGcm9tRWxlbShlbGVtKTtcbiAgICAgICAgaWZyYW1lT2JqLmNvbnRlbnRXaW5kb3cuRGlhbG9nQXBwLnNldENvbnRyb2xQcm9wcyhlbGVtLCBwcm9wcyk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldENvbnRyb2xEZXNjVGV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRDb250cm9sRGVzY1RleHQocGx1Z2luU2V0dGluZywgcHJvcHMpIHtcbiAgICAgIGNvbnNvbGUubG9nKHBsdWdpblNldHRpbmcpO1xuICAgICAgY29uc29sZS5sb2cocHJvcHMpO1xuICAgICAgcmV0dXJuIFwiW1wiICsgcGx1Z2luU2V0dGluZy5Ub29sYmFyTGFiZWwgKyBcIl0g57uR5a6aOltcIiArIHByb3BzLmJpbmRUb0ZpZWxkLnRhYmxlQ2FwdGlvbiArIFwiLVwiICsgcHJvcHMuYmluZFRvRmllbGQuZmllbGRDYXB0aW9uICsgXCJdXCI7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENLRWRpdG9yUGx1Z2luVXRpbGl0eTtcbn0oKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgXCJQbHVnaW5zU2VydmVyQ29uZmlnXCIsIHt9KTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgXCJQbHVnaW5zXCIsIHt9KTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgXCJEZWZhdWx0UHJvcHNcIiwge1xuICBiaW5kVG9GaWVsZDoge1xuICAgIHRhYmxlSWQ6IFwiXCIsXG4gICAgdGFibGVOYW1lOiBcIlwiLFxuICAgIHRhYmxlQ2FwdGlvbjogXCJcIixcbiAgICBmaWVsZE5hbWU6IFwiXCIsXG4gICAgZmllbGRDYXB0aW9uOiBcIlwiLFxuICAgIGZpZWxkRGF0YVR5cGU6IFwiXCIsXG4gICAgZmllbGRMZW5ndGg6IFwiXCJcbiAgfSxcbiAgZGVmYXVsdFZhbHVlOiB7XG4gICAgZGVmYXVsdFR5cGU6IFwiXCIsXG4gICAgZGVmYXVsdFZhbHVlOiBcIlwiLFxuICAgIGRlZmF1bHRUZXh0OiBcIlwiXG4gIH0sXG4gIHZhbGlkYXRlUnVsZXM6IHtcbiAgICBtc2c6IFwiXCIsXG4gICAgcnVsZXM6IFtdXG4gIH0sXG4gIGJhc2VJbmZvOiB7XG4gICAgaWQ6IFwiXCIsXG4gICAgc2VyaWFsaXplOiBcInRydWVcIixcbiAgICBuYW1lOiBcIlwiLFxuICAgIGNsYXNzTmFtZTogXCJcIixcbiAgICBwbGFjZWhvbGRlcjogXCJcIixcbiAgICByZWFkb25seTogXCJub3JlYWRvbmx5XCIsXG4gICAgZGlzYWJsZWQ6IFwibm9kaXNhYmxlZFwiLFxuICAgIHN0eWxlOiBcIlwiLFxuICAgIGRlc2M6IFwiXCJcbiAgfVxufSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiRGlhbG9nRXhlY3V0ZUVkaXRBY3Rpb25OYW1lXCIsIFwiRWRpdFwiKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgXCJEaWFsb2dFeGVjdXRlSW5zZXJ0QWN0aW9uTmFtZVwiLCBcIkluc2VydFwiKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgQ0tFZGl0b3JVdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDS0VkaXRvclV0aWxpdHkoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENLRWRpdG9yVXRpbGl0eSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ0tFZGl0b3JVdGlsaXR5LCBudWxsLCBbe1xuICAgIGtleTogXCJTZXRTZWxlY3RlZEVsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0U2VsZWN0ZWRFbGVtKGVsZW1IdG1sKSB7XG4gICAgICB0aGlzLl8kQ0tFZGl0b3JTZWxlY3RFbGVtID0gJChlbGVtSHRtbCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldFNlbGVjdGVkRWxlbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRTZWxlY3RlZEVsZW0oKSB7XG4gICAgICBpZiAodGhpcy5fJENLRWRpdG9yU2VsZWN0RWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl8kQ0tFZGl0b3JTZWxlY3RFbGVtO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0U2VsZWN0ZWRDS0VkaXRvckVsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0U2VsZWN0ZWRDS0VkaXRvckVsZW0oKSB7XG4gICAgICBpZiAodGhpcy5HZXRTZWxlY3RlZEVsZW0oKSkge1xuICAgICAgICB2YXIgaWQgPSB0aGlzLkdldFNlbGVjdGVkRWxlbSgpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgdmFyIGVsZW1lbnQgPSB0aGlzLkdldENLRWRpdG9ySW5zdCgpLmRvY3VtZW50LmdldEJ5SWQoaWQpO1xuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldENLRWRpdG9ySW5zdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRDS0VkaXRvckluc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fQ0tFZGl0b3JJbnN0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTZXRDS0VkaXRvckluc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0Q0tFZGl0b3JJbnN0KGluc3QpIHtcbiAgICAgIHRoaXMuX0NLRWRpdG9ySW5zdCA9IGluc3Q7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldENLRWRpdG9ySFRNTFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRDS0VkaXRvckhUTUwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5HZXRDS0VkaXRvckluc3QoKS5nZXREYXRhKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldENLRWRpdG9ySFRNTFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRDS0VkaXRvckhUTUwoaHRtbCkge1xuICAgICAgdGhpcy5HZXRDS0VkaXRvckluc3QoKS5zZXREYXRhKGh0bWwpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJJbml0aWFsaXplQ0tFZGl0b3JcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gSW5pdGlhbGl6ZUNLRWRpdG9yKHRleHRBcmVhRWxlbUlkLCBwbHVnaW5zQ29uZmlnLCBsb2FkQ29tcGxldGVkRnVuYywgY2tlZGl0b3JDb25maWdGdWxsUGF0aCwgcGx1Z2luQmFzZVBhdGgsIHRoZW1lVm8pIHtcbiAgICAgIHZhciBleHRyYVBsdWdpbnMgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbHVnaW5zQ29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzaW5nbGVQbHVnaW5Db25maWcgPSBwbHVnaW5zQ29uZmlnW2ldO1xuICAgICAgICB2YXIgc2luZ2xlTmFtZSA9IHNpbmdsZVBsdWdpbkNvbmZpZy5zaW5nbGVOYW1lO1xuICAgICAgICB2YXIgdG9vbGJhckxvY2F0aW9uID0gc2luZ2xlUGx1Z2luQ29uZmlnLnRvb2xiYXJMb2NhdGlvbjtcbiAgICAgICAgdmFyIHRleHQgPSBzaW5nbGVQbHVnaW5Db25maWcudGV4dDtcbiAgICAgICAgdmFyIHNlcnZlclJlc29sdmUgPSBzaW5nbGVQbHVnaW5Db25maWcuc2VydmVyUmVzb2x2ZTtcbiAgICAgICAgdmFyIGNsaWVudFJlc29sdmUgPSBzaW5nbGVQbHVnaW5Db25maWcuY2xpZW50UmVzb2x2ZTtcbiAgICAgICAgdmFyIGNsaWVudFJlc29sdmVKcyA9IHNpbmdsZVBsdWdpbkNvbmZpZy5jbGllbnRSZXNvbHZlSnM7XG4gICAgICAgIHZhciBkaWFsb2dXaWR0aCA9IHNpbmdsZVBsdWdpbkNvbmZpZy5kaWFsb2dXaWR0aDtcbiAgICAgICAgdmFyIGRpYWxvZ0hlaWdodCA9IHNpbmdsZVBsdWdpbkNvbmZpZy5kaWFsb2dIZWlnaHQ7XG4gICAgICAgIHZhciBpc0pCdWlsZDRERGF0YSA9IHNpbmdsZVBsdWdpbkNvbmZpZy5pc0pCdWlsZDRERGF0YTtcbiAgICAgICAgdmFyIGNvbnRyb2xDYXRlZ29yeSA9IHNpbmdsZVBsdWdpbkNvbmZpZy5jb250cm9sQ2F0ZWdvcnk7XG4gICAgICAgIHZhciBwbHVnaW5GaWxlTmFtZSA9IHNpbmdsZU5hbWUgKyBcIlBsdWdpbi5qc1wiO1xuICAgICAgICB2YXIgcGx1Z2luRm9sZGVyTmFtZSA9IHBsdWdpbkJhc2VQYXRoICsgc2luZ2xlTmFtZSArIFwiL1wiO1xuICAgICAgICBDS0VESVRPUi5wbHVnaW5zLmFkZEV4dGVybmFsKHNpbmdsZU5hbWUsIHBsdWdpbkZvbGRlck5hbWUsIHBsdWdpbkZpbGVOYW1lKTtcbiAgICAgICAgZXh0cmFQbHVnaW5zLnB1c2goc2luZ2xlTmFtZSk7XG4gICAgICAgIENLRWRpdG9yUGx1Z2luVXRpbGl0eS5BZGRQbHVnaW5zU2VydmVyQ29uZmlnKHNpbmdsZU5hbWUsIHRvb2xiYXJMb2NhdGlvbiwgdGV4dCwgY2xpZW50UmVzb2x2ZSwgc2VydmVyUmVzb2x2ZSwgY2xpZW50UmVzb2x2ZUpzLCBkaWFsb2dXaWR0aCwgZGlhbG9nSGVpZ2h0LCBpc0pCdWlsZDRERGF0YSwgY29udHJvbENhdGVnb3J5KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5TZXRUaGVtZVZvKHRoZW1lVm8pO1xuICAgICAgdmFyIGVkaXRvckNvbmZpZ1VybCA9IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybChja2VkaXRvckNvbmZpZ0Z1bGxQYXRoKTtcbiAgICAgIENLRURJVE9SLnJlcGxhY2UodGV4dEFyZWFFbGVtSWQsIHtcbiAgICAgICAgY3VzdG9tQ29uZmlnOiBlZGl0b3JDb25maWdVcmwsXG4gICAgICAgIGV4dHJhUGx1Z2luczogZXh0cmFQbHVnaW5zLmpvaW4oXCIsXCIpXG4gICAgICB9KTtcbiAgICAgIENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbi5vbihcInBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgc291cmNlSFRNTCA9IGV2ZW50LmRhdGEuZGF0YVZhbHVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyICRzb3VyY2VIVE1MID0gJChzb3VyY2VIVE1MKTtcblxuICAgICAgICAgIGlmICgkKHNvdXJjZUhUTUwpLmZpbmQoXCJkaXZcIikubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGV2ZW50LmRhdGEuZGF0YVZhbHVlID0gJChzb3VyY2VIVE1MKS5maW5kKFwiZGl2XCIpLm91dGVySFRNTCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGV2ZW50LmRhdGEuZGF0YVZhbHVlID0gc291cmNlSFRNTDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oXCJhZnRlclBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIENLRWRpdG9yUGx1Z2luVXRpbGl0eS5FbGVtQmluZEV2ZW50KCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBhbGVydChcIueymOi0tOaTjeS9nOWksei0pSFcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzLmh0bWxfZGVzaWduLm9uKCdpbnNlcnRFbGVtZW50JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0RWxlbWVudFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oJ2luc2VydEh0bWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnRIdG1sXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuU2V0Q0tFZGl0b3JJbnN0KENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbik7XG4gICAgICBDS0VESVRPUi5vbignaW5zdGFuY2VSZWFkeScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbG9hZENvbXBsZXRlZEZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgbG9hZENvbXBsZXRlZEZ1bmMoKTtcbiAgICAgICAgICA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRUaGVtZVZvXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFRoZW1lVm8oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fVGhlbWVWbztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0VGhlbWVWb1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRUaGVtZVZvKF90aGVtZVZvKSB7XG4gICAgICB0aGlzLl9UaGVtZVZvID0gX3RoZW1lVm87XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENLRWRpdG9yVXRpbGl0eTtcbn0oKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yVXRpbGl0eSwgXCJfJENLRWRpdG9yU2VsZWN0RWxlbVwiLCBudWxsKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yVXRpbGl0eSwgXCJfQ0tFZGl0b3JJbnN0XCIsIG51bGwpO1xuXG5fZGVmaW5lUHJvcGVydHkoQ0tFZGl0b3JVdGlsaXR5LCBcIl9UaGVtZVZvXCIsIG51bGwpOyIsIlwidXNlIHN0cmljdFwiOyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBIVE1MRWRpdG9yVXRpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gSFRNTEVkaXRvclV0aWxpdHkoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEhUTUxFZGl0b3JVdGlsaXR5KTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhIVE1MRWRpdG9yVXRpbGl0eSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiR2V0SFRNTEVkaXRvckluc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0SFRNTEVkaXRvckluc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fSFRNTEVkaXRvckluc3Q7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldEhUTUxFZGl0b3JIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldEhUTUxFZGl0b3JIVE1MKGh0bWwpIHtcbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KGh0bWwpKSB7XG4gICAgICAgIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5zZXRWYWx1ZShodG1sKTtcbiAgICAgICAgQ29kZU1pcnJvci5jb21tYW5kc1tcInNlbGVjdEFsbFwiXSh0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkpO1xuICAgICAgICB2YXIgcmFuZ2UgPSB7XG4gICAgICAgICAgZnJvbTogdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldEN1cnNvcih0cnVlKSxcbiAgICAgICAgICB0bzogdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldEN1cnNvcihmYWxzZSlcbiAgICAgICAgfTtcbiAgICAgICAgO1xuICAgICAgICB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuYXV0b0Zvcm1hdFJhbmdlKHJhbmdlLmZyb20sIHJhbmdlLnRvKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0SHRtbEVkaXRvckhUTUxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0SHRtbEVkaXRvckhUTUwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldFZhbHVlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkluaXRpYWxpemVIVE1MQ29kZURlc2lnblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBJbml0aWFsaXplSFRNTENvZGVEZXNpZ24oKSB7XG4gICAgICB2YXIgbWl4ZWRNb2RlID0ge1xuICAgICAgICBuYW1lOiBcImh0bWxtaXhlZFwiLFxuICAgICAgICBzY3JpcHRUeXBlczogW3tcbiAgICAgICAgICBtYXRjaGVzOiAvXFwveC1oYW5kbGViYXJzLXRlbXBsYXRlfFxcL3gtbXVzdGFjaGUvaSxcbiAgICAgICAgICBtb2RlOiBudWxsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBtYXRjaGVzOiAvKHRleHR8YXBwbGljYXRpb24pXFwvKHgtKT92YihhfHNjcmlwdCkvaSxcbiAgICAgICAgICBtb2RlOiBcInZic2NyaXB0XCJcbiAgICAgICAgfV1cbiAgICAgIH07XG4gICAgICB0aGlzLl9IVE1MRWRpdG9ySW5zdCA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiVGV4dEFyZWFIVE1MRWRpdG9yXCIpLCB7XG4gICAgICAgIG1vZGU6IG1peGVkTW9kZSxcbiAgICAgICAgc2VsZWN0aW9uUG9pbnRlcjogdHJ1ZSxcbiAgICAgICAgdGhlbWU6IFwibW9ub2thaVwiLFxuICAgICAgICBmb2xkR3V0dGVyOiB0cnVlLFxuICAgICAgICBndXR0ZXJzOiBbXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCIsIFwiQ29kZU1pcnJvci1mb2xkZ3V0dGVyXCJdLFxuICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fSFRNTEVkaXRvckluc3Quc2V0U2l6ZShcIjEwMCVcIiwgUGFnZVN0eWxlVXRpbGl0eS5HZXRXaW5kb3dIZWlnaHQoKSAtIDg1KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSFRNTEVkaXRvclV0aWxpdHk7XG59KCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShIVE1MRWRpdG9yVXRpbGl0eSwgXCJfSFRNTEVkaXRvckluc3RcIiwgbnVsbCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIEpzRWRpdG9yVXRpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gSnNFZGl0b3JVdGlsaXR5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBKc0VkaXRvclV0aWxpdHkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEpzRWRpdG9yVXRpbGl0eSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiX0dldE5ld0Zvcm1Kc1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfR2V0TmV3Rm9ybUpzU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIFwiPHNjcmlwdD52YXIgRm9ybVBhZ2VPYmplY3RJbnN0YW5jZT17XCIgKyBcImRhdGE6e1wiICsgXCJ1c2VyRW50aXR5Ont9LFwiICsgXCJmb3JtRW50aXR5OltdLFwiICsgXCJjb25maWc6W11cIiArIFwifSxcIiArIFwicGFnZVJlYWR5OmZ1bmN0aW9uKCl7fSxcIiArIFwiYmluZFJlY29yZERhdGFSZWFkeTpmdW5jdGlvbigpe30sXCIgKyBcInZhbGlkYXRlRXZlcnlGcm9tQ29udHJvbDpmdW5jdGlvbihjb250cm9sT2JqKXt9XCIgKyBcIn08L3NjcmlwdD5cIjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0SnNFZGl0b3JJbnN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEpzRWRpdG9ySW5zdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9Kc0VkaXRvckluc3Q7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldEpzRWRpdG9ySnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0SnNFZGl0b3JKcyhqcykge1xuICAgICAgdGhpcy5HZXRKc0VkaXRvckluc3QoKS5zZXRWYWx1ZShqcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEpzRWRpdG9ySnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0SnNFZGl0b3JKcygpIHtcbiAgICAgIHJldHVybiB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLmdldFZhbHVlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkluaXRpYWxpemVKc0NvZGVEZXNpZ25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gSW5pdGlhbGl6ZUpzQ29kZURlc2lnbihzdGF0dXMpIHtcbiAgICAgIHRoaXMuX0pzRWRpdG9ySW5zdCA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKCQoXCIjVGV4dEFyZWFKc0VkaXRvclwiKVswXSwge1xuICAgICAgICBtb2RlOiBcImFwcGxpY2F0aW9uL2xkK2pzb25cIixcbiAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgZXh0cmFLZXlzOiB7XG4gICAgICAgICAgXCJDdHJsLVFcIjogZnVuY3Rpb24gQ3RybFEoY20pIHtcbiAgICAgICAgICAgIGNtLmZvbGRDb2RlKGNtLmdldEN1cnNvcigpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZvbGRHdXR0ZXI6IHRydWUsXG4gICAgICAgIHNtYXJ0SW5kZW50OiB0cnVlLFxuICAgICAgICBtYXRjaEJyYWNrZXRzOiB0cnVlLFxuICAgICAgICB0aGVtZTogXCJtb25va2FpXCIsXG4gICAgICAgIGd1dHRlcnM6IFtcIkNvZGVNaXJyb3ItbGluZW51bWJlcnNcIiwgXCJDb2RlTWlycm9yLWZvbGRndXR0ZXJcIl1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9Kc0VkaXRvckluc3Quc2V0U2l6ZShcIjEwMCVcIiwgUGFnZVN0eWxlVXRpbGl0eS5HZXRXaW5kb3dIZWlnaHQoKSAtIDg1KTtcblxuICAgICAgaWYgKHN0YXR1cyA9PSBcImFkZFwiKSB7XG4gICAgICAgIHRoaXMuU2V0SnNFZGl0b3JKcyh0aGlzLl9HZXROZXdGb3JtSnNTdHJpbmcoKSk7XG4gICAgICAgIENvZGVNaXJyb3IuY29tbWFuZHNbXCJzZWxlY3RBbGxcIl0odGhpcy5HZXRKc0VkaXRvckluc3QoKSk7XG4gICAgICAgIHZhciByYW5nZSA9IHtcbiAgICAgICAgICBmcm9tOiB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLmdldEN1cnNvcih0cnVlKSxcbiAgICAgICAgICB0bzogdGhpcy5HZXRKc0VkaXRvckluc3QoKS5nZXRDdXJzb3IoZmFsc2UpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuYXV0b0Zvcm1hdFJhbmdlKHJhbmdlLmZyb20sIHJhbmdlLnRvKTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSnNFZGl0b3JVdGlsaXR5O1xufSgpO1xuXG5fZGVmaW5lUHJvcGVydHkoSnNFZGl0b3JVdGlsaXR5LCBcIl9Kc0VkaXRvckluc3RcIiwgbnVsbCk7Il19
