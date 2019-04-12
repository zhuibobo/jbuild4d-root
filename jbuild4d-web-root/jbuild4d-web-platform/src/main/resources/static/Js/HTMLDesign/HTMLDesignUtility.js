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
    value: function AddPluginsServerConfig(singleName, toolbarLocation, text, clientResolve, serverResolve, clientResolveJs, dialogWidth, dialogHeight, isJBuild4DData, controlCategory, serverDynamicBind, showRemoveButton, showInEditorToolbar) {
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
        ControlCategory: controlCategory,
        ServerDynamicBind: serverDynamicBind,
        ShowRemoveButton: showRemoveButton,
        ShowInEditorToolbar: showInEditorToolbar
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
        ControlCategory: "",
        ServerDynamicBind: "",
        ShowRemoveButton: "",
        ShowInEditorToolbar: ""
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
        alert("1");
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
      elem.setAttribute("server_dynamic_bind", controlSetting.ServerDynamicBind);
      elem.setAttribute("show_remove_button", controlSetting.ShowRemoveButton);

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
          CKEditorUtility.SingleElemBindDefaultEvent(elem);
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
      if (this._$CKEditorSelectElem) {
        if (this._$CKEditorSelectElem.length > 0) {
          return this._$CKEditorSelectElem;
        }
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
      this.ClearALLForDivElemButton();
      return this.GetCKEditorInst().getData();
    }
  }, {
    key: "SetCKEditorHTML",
    value: function SetCKEditorHTML(html) {
      this.GetCKEditorInst().setData(html);
      window.setTimeout(function () {
        CKEditorUtility.ALLElemBindDefaultEvent();
      }, 500);
    }
  }, {
    key: "InitializeCKEditor",
    value: function InitializeCKEditor(textAreaElemId, pluginsConfig, loadCompletedFunc, ckeditorConfigFullPath, pluginBasePath, themeVo) {
      console.log(pluginsConfig);
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
        var serverDynamicBind = singlePluginConfig.serverDynamicBind;
        var showRemoveButton = singlePluginConfig.showRemoveButton;
        var showInEditorToolbar = singlePluginConfig.showInEditorToolbar;
        var pluginFileName = singleName + "Plugin.js";
        var pluginFolderName = pluginBasePath + singleName + "/";
        CKEDITOR.plugins.addExternal(singleName, pluginFolderName, pluginFileName);
        extraPlugins.push(singleName);
        CKEditorPluginUtility.AddPluginsServerConfig(singleName, toolbarLocation, text, clientResolve, serverResolve, clientResolveJs, dialogWidth, dialogHeight, isJBuild4DData, controlCategory, serverDynamicBind, showRemoveButton, showInEditorToolbar);
      }

      console.log(themeVo);
      this.SetThemeVo(themeVo);
      var editorConfigUrl = BaseUtility.AppendTimeStampUrl(ckeditorConfigFullPath);
      CKEDITOR.replace(textAreaElemId, {
        customConfig: editorConfigUrl,
        extraPlugins: extraPlugins.join(",")
      });
      CKEDITOR.instances.html_design.on("beforePaste", function (event) {});
      CKEDITOR.instances.html_design.on("paste", function (event) {
        var sourceHTML = event.data.dataValue;

        try {
          var $sourceHTML = $(sourceHTML);
          $sourceHTML.find(".del-button").remove();

          if ($sourceHTML.find("div").length == 1) {
            event.data.dataValue = $sourceHTML.find("div").outerHTML();
          }
        } catch (e) {
          event.data.dataValue = sourceHTML;
        }
      });
      CKEDITOR.instances.html_design.on("afterPaste", function (event) {
        CKEditorUtility.ALLElemBindDefaultEvent();
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

      if (this.GetCKEditorInst()) {
        var sourceHTML = this.GetCKEditorHTML();
        debugger;

        if (sourceHTML != null && sourceHTML != "") {
          var rootElem = $(sourceHTML);

          if (rootElem.attr("is_container_root") != "true") {
            rootElem = $(sourceHTML).find("[is_container_root]");
          }

          if (rootElem.length > 0) {
            var classList = rootElem.attr('class').split(/\s+/);
            var classary = [];
            $.each(classList, function (index, item) {
              if (item.indexOf('html-design-theme-') >= 0) {
                rootElem.removeClass(item);
              }
            });
            rootElem.addClass(_themeVo.rootElemClass);
            this.SetCKEditorHTML(rootElem.outerHTML());
          }
        }
      }
    }
  }, {
    key: "ClearALLForDivElemButton",
    value: function ClearALLForDivElemButton() {
      var oldDelButtons = CKEditorUtility.GetCKEditorInst().document.find(".del-button");

      for (var i = 0; i < oldDelButtons.count(); i++) {
        oldDelButtons.getItem(i).remove();
      }
    }
  }, {
    key: "SingleElemBindDefaultEvent",
    value: function SingleElemBindDefaultEvent(elem) {
      if (elem.getAttribute("show_remove_button") == "true") {
        console.log(elem.getName());
        elem.on('click', function () {
          CKEditorUtility.GetCKEditorInst().getSelection().selectElement(this);
          CKEditorUtility.SetSelectedElem(this.getOuterHtml());
          CKEditorUtility.ClearALLForDivElemButton();
          var newDelButton = new CKEDITOR.dom.element('div');
          newDelButton.addClass("del-button");
          elem.append(newDelButton);
          newDelButton.on('click', function () {
            elem.remove();
          });
        });
      }
    }
  }, {
    key: "ALLElemBindDefaultEvent",
    value: function ALLElemBindDefaultEvent() {
      console.log(CKEditorUtility.GetCKEditorInst());
      var elements = CKEditorUtility.GetCKEditorInst().document.getBody().getElementsByTag('*');

      for (var i = 0; i < elements.count(); ++i) {
        var elem = elements.getItem(i);
        this.SingleElemBindDefaultEvent(elem);
      }
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
        var a1 = {
          line: 0,
          ch: 2
        };
        this.GetHTMLEditorInst().getDoc().eachLine(function (line) {});
        var selectedElem = CKEditorUtility.GetSelectedElem();
        var searchHTML = "";

        if (selectedElem) {
          searchHTML = selectedElem.outerHTML().split(">")[0];
        }

        console.log("-------------------------------");
        var cursor = this.GetHTMLEditorInst().getSearchCursor(searchHTML);
        cursor.findNext();
        console.log(cursor);
        console.log(cursor.from() + "|" + cursor.to());

        if (cursor.from() && cursor.to()) {
          this.GetHTMLEditorInst().getDoc().setSelection(cursor.from(), cursor.to());
        }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNLRWRpdG9yUGx1Z2luVXRpbGl0eS5qcyIsIkNLRWRpdG9yVXRpbGl0eS5qcyIsIkhUTUxFZGl0b3JEaWFsb2dVdGlsaXR5LmpzIiwiSFRNTEVkaXRvclV0aWxpdHkuanMiLCJKc0VkaXRvclV0aWxpdHkuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xVQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDek5BO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkhUTUxEZXNpZ25VdGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIENLRWRpdG9yUGx1Z2luVXRpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDS0VkaXRvclBsdWdpblV0aWxpdHkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiQWRkUGx1Z2luc1NlcnZlckNvbmZpZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBBZGRQbHVnaW5zU2VydmVyQ29uZmlnKHNpbmdsZU5hbWUsIHRvb2xiYXJMb2NhdGlvbiwgdGV4dCwgY2xpZW50UmVzb2x2ZSwgc2VydmVyUmVzb2x2ZSwgY2xpZW50UmVzb2x2ZUpzLCBkaWFsb2dXaWR0aCwgZGlhbG9nSGVpZ2h0LCBpc0pCdWlsZDRERGF0YSwgY29udHJvbENhdGVnb3J5LCBzZXJ2ZXJEeW5hbWljQmluZCwgc2hvd1JlbW92ZUJ1dHRvbiwgc2hvd0luRWRpdG9yVG9vbGJhcikge1xuICAgICAgdGhpcy5QbHVnaW5zU2VydmVyQ29uZmlnW3NpbmdsZU5hbWVdID0ge1xuICAgICAgICBTaW5nbGVOYW1lOiBzaW5nbGVOYW1lLFxuICAgICAgICBUb29sYmFyTG9jYXRpb246IHRvb2xiYXJMb2NhdGlvbixcbiAgICAgICAgVG9vbGJhckxhYmVsOiB0ZXh0LFxuICAgICAgICBDbGllbnRSZXNvbHZlOiBjbGllbnRSZXNvbHZlLFxuICAgICAgICBTZXJ2ZXJSZXNvbHZlOiBzZXJ2ZXJSZXNvbHZlLFxuICAgICAgICBDbGllbnRSZXNvbHZlSnM6IGNsaWVudFJlc29sdmVKcyxcbiAgICAgICAgRGlhbG9nV2lkdGg6IGRpYWxvZ1dpZHRoLFxuICAgICAgICBEaWFsb2dIZWlnaHQ6IGRpYWxvZ0hlaWdodCxcbiAgICAgICAgSXNKQnVpbGQ0RERhdGE6IGlzSkJ1aWxkNEREYXRhLFxuICAgICAgICBDb250cm9sQ2F0ZWdvcnk6IGNvbnRyb2xDYXRlZ29yeSxcbiAgICAgICAgU2VydmVyRHluYW1pY0JpbmQ6IHNlcnZlckR5bmFtaWNCaW5kLFxuICAgICAgICBTaG93UmVtb3ZlQnV0dG9uOiBzaG93UmVtb3ZlQnV0dG9uLFxuICAgICAgICBTaG93SW5FZGl0b3JUb29sYmFyOiBzaG93SW5FZGl0b3JUb29sYmFyXG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfVXNlU2VydmVyQ29uZmlnQ292ZXJFbXB0eVBsdWdpblByb3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX1VzZVNlcnZlckNvbmZpZ0NvdmVyRW1wdHlQbHVnaW5Qcm9wKG9iaikge1xuICAgICAgdmFyIGNvdmVyT2JqID0gdGhpcy5QbHVnaW5zU2VydmVyQ29uZmlnW29iai5TaW5nbGVOYW1lXTtcblxuICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpbcHJvcF0gIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBcIlwiIHx8IG9ialtwcm9wXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY292ZXJPYmpbcHJvcF0pIHtcbiAgICAgICAgICAgICAgb2JqW3Byb3BdID0gY292ZXJPYmpbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEdlbmVyYWxQbHVnaW5JbnN0YW5jZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRHZW5lcmFsUGx1Z2luSW5zdGFuY2UocGx1Z2luU2luZ2xlTmFtZSwgZXhDb25maWcpIHtcbiAgICAgIHZhciBkZWZhdWx0U2V0dGluZyA9IHtcbiAgICAgICAgU2luZ2xlTmFtZTogcGx1Z2luU2luZ2xlTmFtZSxcbiAgICAgICAgRGlhbG9nTmFtZTogJycsXG4gICAgICAgIERpYWxvZ1dpZHRoOiBudWxsLFxuICAgICAgICBEaWFsb2dIZWlnaHQ6IG51bGwsXG4gICAgICAgIERpYWxvZ1BhZ2VVcmw6IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybCgnRGlhbG9nLmh0bWwnKSxcbiAgICAgICAgRGlhbG9nVGl0bGU6IFwiRElWXCIsXG4gICAgICAgIFRvb2xiYXJDb21tYW5kOiAnJyxcbiAgICAgICAgVG9vbGJhckljb246ICdJY29uLnBuZycsXG4gICAgICAgIFRvb2xiYXJMYWJlbDogXCJcIixcbiAgICAgICAgVG9vbGJhckxvY2F0aW9uOiAnJyxcbiAgICAgICAgSUZyYW1lV2luZG93OiBudWxsLFxuICAgICAgICBJRnJhbWVFeGVjdXRlQWN0aW9uTmFtZTogXCJJbnNlcnRcIixcbiAgICAgICAgRGVzaWduTW9kYWxJbnB1dENzczogXCJcIixcbiAgICAgICAgQ2xpZW50UmVzb2x2ZTogXCJcIixcbiAgICAgICAgU2VydmVyUmVzb2x2ZTogXCJcIixcbiAgICAgICAgSXNKQnVpbGQ0RERhdGE6IFwiXCIsXG4gICAgICAgIENvbnRyb2xDYXRlZ29yeTogXCJcIixcbiAgICAgICAgU2VydmVyRHluYW1pY0JpbmQ6IFwiXCIsXG4gICAgICAgIFNob3dSZW1vdmVCdXR0b246IFwiXCIsXG4gICAgICAgIFNob3dJbkVkaXRvclRvb2xiYXI6IFwiXCJcbiAgICAgIH07XG4gICAgICBkZWZhdWx0U2V0dGluZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0U2V0dGluZywgZXhDb25maWcpO1xuICAgICAgZGVmYXVsdFNldHRpbmcgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuX1VzZVNlcnZlckNvbmZpZ0NvdmVyRW1wdHlQbHVnaW5Qcm9wKGRlZmF1bHRTZXR0aW5nKTtcbiAgICAgIGRlZmF1bHRTZXR0aW5nLkRpYWxvZ05hbWUgPSBkZWZhdWx0U2V0dGluZy5TaW5nbGVOYW1lO1xuICAgICAgZGVmYXVsdFNldHRpbmcuVG9vbGJhckNvbW1hbmQgPSBcIkpCdWlsZDRELkZvcm1EZXNpZ24uUGx1Z2lucy5cIiArIGRlZmF1bHRTZXR0aW5nLlNpbmdsZU5hbWU7XG4gICAgICBkZWZhdWx0U2V0dGluZy5EaWFsb2dTZXR0aW5nVGl0bGUgPSBkZWZhdWx0U2V0dGluZy5Ub29sYmFyTGFiZWwgKyBcIldlYuaOp+S7tlwiO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgU2V0dGluZzogZGVmYXVsdFNldHRpbmdcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlJlZ0dlbmVyYWxQbHVnaW5Ub0VkaXRvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBSZWdHZW5lcmFsUGx1Z2luVG9FZGl0b3IoY2tFZGl0b3IsIHBhdGgsIHBsdWdpblNldHRpbmcsIG9rRnVuYykge1xuICAgICAgQ0tFRElUT1IuZGlhbG9nLmFkZElmcmFtZShwbHVnaW5TZXR0aW5nLkRpYWxvZ05hbWUsIHBsdWdpblNldHRpbmcuRGlhbG9nU2V0dGluZ1RpdGxlLCBwYXRoICsgcGx1Z2luU2V0dGluZy5EaWFsb2dQYWdlVXJsLCBwbHVnaW5TZXR0aW5nLkRpYWxvZ1dpZHRoLCBwbHVnaW5TZXR0aW5nLkRpYWxvZ0hlaWdodCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5fLmZyYW1lSWQpO1xuICAgICAgICBwbHVnaW5TZXR0aW5nLklGcmFtZVdpbmRvdyA9IGlmcmFtZTtcbiAgICAgICAgQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LlNldEVsZW1Qcm9wc0luRWRpdERpYWxvZyhwbHVnaW5TZXR0aW5nLklGcmFtZVdpbmRvdywgcGx1Z2luU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSk7XG4gICAgICB9LCB7XG4gICAgICAgIG9uT2s6IGZ1bmN0aW9uIG9uT2soKSB7XG4gICAgICAgICAgdmFyIHByb3BzID0gcGx1Z2luU2V0dGluZy5JRnJhbWVXaW5kb3cuY29udGVudFdpbmRvdy5EaWFsb2dBcHAuZ2V0Q29udHJvbFByb3BzKCk7XG5cbiAgICAgICAgICBpZiAocHJvcHMuc3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9rRnVuYyhja0VkaXRvciwgcGx1Z2luU2V0dGluZywgcHJvcHMsIHBsdWdpblNldHRpbmcuSUZyYW1lV2luZG93LmNvbnRlbnRXaW5kb3cpO1xuICAgICAgICAgIHBsdWdpblNldHRpbmcuSUZyYW1lRXhlY3V0ZUFjdGlvbk5hbWUgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUluc2VydEFjdGlvbk5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2FuY2VsOiBmdW5jdGlvbiBvbkNhbmNlbCgpIHtcbiAgICAgICAgICBwbHVnaW5TZXR0aW5nLklGcmFtZUV4ZWN1dGVBY3Rpb25OYW1lID0gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkRpYWxvZ0V4ZWN1dGVJbnNlcnRBY3Rpb25OYW1lO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNrRWRpdG9yLmFkZENvbW1hbmQocGx1Z2luU2V0dGluZy5Ub29sYmFyQ29tbWFuZCwgbmV3IENLRURJVE9SLmRpYWxvZ0NvbW1hbmQocGx1Z2luU2V0dGluZy5EaWFsb2dOYW1lKSk7XG4gICAgICBja0VkaXRvci51aS5hZGRCdXR0b24ocGx1Z2luU2V0dGluZy5TaW5nbGVOYW1lLCB7XG4gICAgICAgIGxhYmVsOiBwbHVnaW5TZXR0aW5nLlRvb2xiYXJMYWJlbCxcbiAgICAgICAgaWNvbjogcGF0aCArIHBsdWdpblNldHRpbmcuVG9vbGJhckljb24sXG4gICAgICAgIGNvbW1hbmQ6IHBsdWdpblNldHRpbmcuVG9vbGJhckNvbW1hbmQsXG4gICAgICAgIHRvb2xiYXI6IHBsdWdpblNldHRpbmcuVG9vbGJhckxvY2F0aW9uXG4gICAgICB9KTtcbiAgICAgIGNrRWRpdG9yLm9uKCdkb3VibGVjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBhbGVydChcIjFcIik7XG4gICAgICAgIHBsdWdpblNldHRpbmcuSUZyYW1lRXhlY3V0ZUFjdGlvbk5hbWUgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUVkaXRBY3Rpb25OYW1lO1xuICAgICAgICBDS0VkaXRvclBsdWdpblV0aWxpdHkuT25DS1d5c2l3eWdFbGVtREJDbGlja0V2ZW50KGV2ZW50LCBwbHVnaW5TZXR0aW5nKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJPbkNLV3lzaXd5Z0VsZW1EQkNsaWNrRXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gT25DS1d5c2l3eWdFbGVtREJDbGlja0V2ZW50KGV2ZW50LCBjb250cm9sU2V0dGluZykge1xuICAgICAgdmFyIGVsZW1lbnQgPSBldmVudC5kYXRhLmVsZW1lbnQ7XG5cbiAgICAgIGlmIChlbGVtZW50LmdldEF0dHJpYnV0ZShcImF1dG9fcmVtb3ZlXCIpID09IFwidHJ1ZVwiKSB7XG4gICAgICAgIGVsZW1lbnQgPSBldmVudC5kYXRhLmVsZW1lbnQuZ2V0UGFyZW50KCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzaW5nbGVOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJzaW5nbGVOYW1lXCIpO1xuXG4gICAgICBpZiAoc2luZ2xlTmFtZSA9PSBjb250cm9sU2V0dGluZy5TaW5nbGVOYW1lKSB7XG4gICAgICAgIENLRWRpdG9yVXRpbGl0eS5TZXRTZWxlY3RlZEVsZW0oZWxlbWVudC5nZXRPdXRlckh0bWwoKSk7XG4gICAgICAgIGV2ZW50LmRhdGEuZGlhbG9nID0gY29udHJvbFNldHRpbmcuRGlhbG9nTmFtZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2VyaWFsaXplUHJvcHNUb0VsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2VyaWFsaXplUHJvcHNUb0VsZW0oZWxlbSwgcHJvcHMsIGNvbnRyb2xTZXR0aW5nKSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImpidWlsZDRkX2N1c3RvbVwiLCBcInRydWVcIik7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNpbmdsZW5hbWVcIiwgY29udHJvbFNldHRpbmcuU2luZ2xlTmFtZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImNsaWVudHJlc29sdmVcIiwgY29udHJvbFNldHRpbmcuQ2xpZW50UmVzb2x2ZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNlcnZlcnJlc29sdmVcIiwgY29udHJvbFNldHRpbmcuU2VydmVyUmVzb2x2ZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImlzX2pidWlsZDRkX2RhdGFcIiwgY29udHJvbFNldHRpbmcuSXNKQnVpbGQ0RERhdGEpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJjb250cm9sX2NhdGVnb3J5XCIsIGNvbnRyb2xTZXR0aW5nLkNvbnRyb2xDYXRlZ29yeSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNlcnZlcl9keW5hbWljX2JpbmRcIiwgY29udHJvbFNldHRpbmcuU2VydmVyRHluYW1pY0JpbmQpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJzaG93X3JlbW92ZV9idXR0b25cIiwgY29udHJvbFNldHRpbmcuU2hvd1JlbW92ZUJ1dHRvbik7XG5cbiAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImJhc2VJbmZvXCJdKSB7XG4gICAgICAgICAgaWYgKGtleSA9PSBcInJlYWRvbmx5XCIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0gPT0gXCJyZWFkb25seVwiKSB7XG4gICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJyZWFkb25seVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBcImRpc2FibGVkXCIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0gPT0gXCJkaXNhYmxlZFwiKSB7XG4gICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wc1tcImJpbmRUb0ZpZWxkXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImJpbmRUb0ZpZWxkXCJdKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmluZFRvRmllbGRcIl1ba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzW1wiZGVmYXVsdFZhbHVlXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImRlZmF1bHRWYWx1ZVwiXSkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImRlZmF1bHRWYWx1ZVwiXVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHNbXCJ2YWxpZGF0ZVJ1bGVzXCJdKSB7XG4gICAgICAgIGlmIChwcm9wc1tcInZhbGlkYXRlUnVsZXNcIl0ucnVsZXMpIHtcbiAgICAgICAgICBpZiAocHJvcHNbXCJ2YWxpZGF0ZVJ1bGVzXCJdLnJ1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwidmFsaWRhdGVydWxlc1wiLCBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHByb3BzW1widmFsaWRhdGVSdWxlc1wiXSkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkRlc2VyaWFsaXplUHJvcHNGcm9tRWxlbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBEZXNlcmlhbGl6ZVByb3BzRnJvbUVsZW0oZWxlbSkge1xuICAgICAgdmFyIHByb3BzID0ge307XG4gICAgICB2YXIgJGVsZW0gPSAkKGVsZW0pO1xuXG4gICAgICBmdW5jdGlvbiBhdHRyVG9Qcm9wKHByb3BzLCBncm91cE5hbWUpIHtcbiAgICAgICAgdmFyIGdyb3VwUHJvcCA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLkRlZmF1bHRQcm9wc1tncm91cE5hbWVdKSB7XG4gICAgICAgICAgaWYgKCRlbGVtLmF0dHIoa2V5KSkge1xuICAgICAgICAgICAgZ3JvdXBQcm9wW2tleV0gPSAkZWxlbS5hdHRyKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdyb3VwUHJvcFtrZXldID0gdGhpcy5EZWZhdWx0UHJvcHNbZ3JvdXBOYW1lXVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByb3BzW2dyb3VwTmFtZV0gPSBncm91cFByb3A7XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICAgIH1cblxuICAgICAgcHJvcHMgPSBhdHRyVG9Qcm9wLmNhbGwodGhpcywgcHJvcHMsIFwiYmFzZUluZm9cIik7XG4gICAgICBwcm9wcyA9IGF0dHJUb1Byb3AuY2FsbCh0aGlzLCBwcm9wcywgXCJiaW5kVG9GaWVsZFwiKTtcbiAgICAgIHByb3BzID0gYXR0clRvUHJvcC5jYWxsKHRoaXMsIHByb3BzLCBcImRlZmF1bHRWYWx1ZVwiKTtcblxuICAgICAgaWYgKCRlbGVtLmF0dHIoXCJ2YWxpZGF0ZVJ1bGVzXCIpKSB7XG4gICAgICAgIHByb3BzLnZhbGlkYXRlUnVsZXMgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oZGVjb2RlVVJJQ29tcG9uZW50KCRlbGVtLmF0dHIoXCJ2YWxpZGF0ZVJ1bGVzXCIpKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiQnVpbGRHZW5lcmFsRWxlbVRvQ0tXeXNpd3lnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEJ1aWxkR2VuZXJhbEVsZW1Ub0NLV3lzaXd5ZyhodG1sLCBjb250cm9sU2V0dGluZywgY29udHJvbFByb3BzLCBfaWZyYW1lKSB7XG4gICAgICBpZiAodGhpcy5WYWxpZGF0ZUJ1aWxkRW5hYmxlKGh0bWwsIGNvbnRyb2xTZXR0aW5nLCBjb250cm9sUHJvcHMsIF9pZnJhbWUpKSB7XG4gICAgICAgIGlmIChjb250cm9sU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSA9PSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUluc2VydEFjdGlvbk5hbWUpIHtcbiAgICAgICAgICB2YXIgZWxlbSA9IENLRURJVE9SLmRvbS5lbGVtZW50LmNyZWF0ZUZyb21IdG1sKGh0bWwpO1xuICAgICAgICAgIHRoaXMuU2VyaWFsaXplUHJvcHNUb0VsZW0oZWxlbSwgY29udHJvbFByb3BzLCBjb250cm9sU2V0dGluZyk7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmluc2VydEVsZW1lbnQoZWxlbSk7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LlNpbmdsZUVsZW1CaW5kRGVmYXVsdEV2ZW50KGVsZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzZWxlY3RlZEVsZW0gPSBDS0VkaXRvclV0aWxpdHkuR2V0U2VsZWN0ZWRDS0VkaXRvckVsZW0oKTtcblxuICAgICAgICAgIGlmIChzZWxlY3RlZEVsZW0pIHtcbiAgICAgICAgICAgIHZhciByZUZyZXNoRWxlbSA9IG5ldyBDS0VESVRPUi5kb20uZWxlbWVudC5jcmVhdGVGcm9tSHRtbChzZWxlY3RlZEVsZW0uZ2V0T3V0ZXJIdG1sKCkpO1xuICAgICAgICAgICAgc2VsZWN0ZWRFbGVtLmNvcHlBdHRyaWJ1dGVzKHJlRnJlc2hFbGVtLCB7XG4gICAgICAgICAgICAgIHRlbXA6IFwidGVtcFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuU2VyaWFsaXplUHJvcHNUb0VsZW0ocmVGcmVzaEVsZW0sIGNvbnRyb2xQcm9wcywgY29udHJvbFNldHRpbmcpO1xuICAgICAgICAgICAgcmVGcmVzaEVsZW0ucmVwbGFjZShzZWxlY3RlZEVsZW0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJWYWxpZGF0ZUJ1aWxkRW5hYmxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFZhbGlkYXRlQnVpbGRFbmFibGUoaHRtbCwgY29udHJvbFNldHRpbmcsIGNvbnRyb2xQcm9wcywgX2lmcmFtZSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlZhbGlkYXRlU2VyaWFsaXplQ29udHJvbERpYWxvZ0NvbXBsZXRlZEVuYWJsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBWYWxpZGF0ZVNlcmlhbGl6ZUNvbnRyb2xEaWFsb2dDb21wbGV0ZWRFbmFibGUocmV0dXJuUmVzdWx0KSB7XG4gICAgICBpZiAocmV0dXJuUmVzdWx0LmJhc2VJbmZvLnNlcmlhbGl6ZSA9PSBcInRydWVcIiAmJiByZXR1cm5SZXN1bHQuYmluZFRvRmllbGQuZmllbGROYW1lID09IFwiXCIpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi5bqP5YiX5YyW55qE5o6n5Lu25b+F6aG757uR5a6a5a2X5q61IVwiLCBudWxsKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzdWNjZXNzOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmV0dXJuUmVzdWx0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTZXRFbGVtUHJvcHNJbkVkaXREaWFsb2dcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0RWxlbVByb3BzSW5FZGl0RGlhbG9nKGlmcmFtZU9iaiwgYWN0aW9uTmFtZSkge1xuICAgICAgaWZyYW1lT2JqLmNvbnRlbnRXaW5kb3cuRGlhbG9nQXBwLnJlYWR5KGFjdGlvbk5hbWUpO1xuXG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PSB0aGlzLkRpYWxvZ0V4ZWN1dGVFZGl0QWN0aW9uTmFtZSkge1xuICAgICAgICB2YXIgZWxlbSA9IENLRWRpdG9yVXRpbGl0eS5HZXRTZWxlY3RlZEVsZW0oKS5vdXRlckhUTUwoKTtcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5EZXNlcmlhbGl6ZVByb3BzRnJvbUVsZW0oZWxlbSk7XG4gICAgICAgIGlmcmFtZU9iai5jb250ZW50V2luZG93LkRpYWxvZ0FwcC5zZXRDb250cm9sUHJvcHMoZWxlbSwgcHJvcHMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRDb250cm9sRGVzY1RleHRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0Q29udHJvbERlc2NUZXh0KHBsdWdpblNldHRpbmcsIHByb3BzKSB7XG4gICAgICBjb25zb2xlLmxvZyhwbHVnaW5TZXR0aW5nKTtcbiAgICAgIGNvbnNvbGUubG9nKHByb3BzKTtcbiAgICAgIHJldHVybiBcIltcIiArIHBsdWdpblNldHRpbmcuVG9vbGJhckxhYmVsICsgXCJdIOe7keWumjpbXCIgKyBwcm9wcy5iaW5kVG9GaWVsZC50YWJsZUNhcHRpb24gKyBcIi1cIiArIHByb3BzLmJpbmRUb0ZpZWxkLmZpZWxkQ2FwdGlvbiArIFwiXVwiO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDS0VkaXRvclBsdWdpblV0aWxpdHk7XG59KCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiUGx1Z2luc1NlcnZlckNvbmZpZ1wiLCB7fSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiUGx1Z2luc1wiLCB7fSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiRGVmYXVsdFByb3BzXCIsIHtcbiAgYmluZFRvRmllbGQ6IHtcbiAgICB0YWJsZUlkOiBcIlwiLFxuICAgIHRhYmxlTmFtZTogXCJcIixcbiAgICB0YWJsZUNhcHRpb246IFwiXCIsXG4gICAgZmllbGROYW1lOiBcIlwiLFxuICAgIGZpZWxkQ2FwdGlvbjogXCJcIixcbiAgICBmaWVsZERhdGFUeXBlOiBcIlwiLFxuICAgIGZpZWxkTGVuZ3RoOiBcIlwiXG4gIH0sXG4gIGRlZmF1bHRWYWx1ZToge1xuICAgIGRlZmF1bHRUeXBlOiBcIlwiLFxuICAgIGRlZmF1bHRWYWx1ZTogXCJcIixcbiAgICBkZWZhdWx0VGV4dDogXCJcIlxuICB9LFxuICB2YWxpZGF0ZVJ1bGVzOiB7XG4gICAgbXNnOiBcIlwiLFxuICAgIHJ1bGVzOiBbXVxuICB9LFxuICBiYXNlSW5mbzoge1xuICAgIGlkOiBcIlwiLFxuICAgIHNlcmlhbGl6ZTogXCJ0cnVlXCIsXG4gICAgbmFtZTogXCJcIixcbiAgICBjbGFzc05hbWU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiXCIsXG4gICAgcmVhZG9ubHk6IFwibm9yZWFkb25seVwiLFxuICAgIGRpc2FibGVkOiBcIm5vZGlzYWJsZWRcIixcbiAgICBzdHlsZTogXCJcIixcbiAgICBkZXNjOiBcIlwiXG4gIH1cbn0pO1xuXG5fZGVmaW5lUHJvcGVydHkoQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LCBcIkRpYWxvZ0V4ZWN1dGVFZGl0QWN0aW9uTmFtZVwiLCBcIkVkaXRcIik7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiRGlhbG9nRXhlY3V0ZUluc2VydEFjdGlvbk5hbWVcIiwgXCJJbnNlcnRcIik7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIENLRWRpdG9yVXRpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ0tFZGl0b3JVdGlsaXR5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDS0VkaXRvclV0aWxpdHkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENLRWRpdG9yVXRpbGl0eSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiU2V0U2VsZWN0ZWRFbGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldFNlbGVjdGVkRWxlbShlbGVtSHRtbCkge1xuICAgICAgdGhpcy5fJENLRWRpdG9yU2VsZWN0RWxlbSA9ICQoZWxlbUh0bWwpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRTZWxlY3RlZEVsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0U2VsZWN0ZWRFbGVtKCkge1xuICAgICAgaWYgKHRoaXMuXyRDS0VkaXRvclNlbGVjdEVsZW0pIHtcbiAgICAgICAgaWYgKHRoaXMuXyRDS0VkaXRvclNlbGVjdEVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJldHVybiB0aGlzLl8kQ0tFZGl0b3JTZWxlY3RFbGVtO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRTZWxlY3RlZENLRWRpdG9yRWxlbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRTZWxlY3RlZENLRWRpdG9yRWxlbSgpIHtcbiAgICAgIGlmICh0aGlzLkdldFNlbGVjdGVkRWxlbSgpKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXMuR2V0U2VsZWN0ZWRFbGVtKCkuYXR0cihcImlkXCIpO1xuICAgICAgICB2YXIgZWxlbWVudCA9IHRoaXMuR2V0Q0tFZGl0b3JJbnN0KCkuZG9jdW1lbnQuZ2V0QnlJZChpZCk7XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0Q0tFZGl0b3JJbnN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldENLRWRpdG9ySW5zdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9DS0VkaXRvckluc3Q7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldENLRWRpdG9ySW5zdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRDS0VkaXRvckluc3QoaW5zdCkge1xuICAgICAgdGhpcy5fQ0tFZGl0b3JJbnN0ID0gaW5zdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0Q0tFZGl0b3JIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldENLRWRpdG9ySFRNTCgpIHtcbiAgICAgIHRoaXMuQ2xlYXJBTExGb3JEaXZFbGVtQnV0dG9uKCk7XG4gICAgICByZXR1cm4gdGhpcy5HZXRDS0VkaXRvckluc3QoKS5nZXREYXRhKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldENLRWRpdG9ySFRNTFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRDS0VkaXRvckhUTUwoaHRtbCkge1xuICAgICAgdGhpcy5HZXRDS0VkaXRvckluc3QoKS5zZXREYXRhKGh0bWwpO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBDS0VkaXRvclV0aWxpdHkuQUxMRWxlbUJpbmREZWZhdWx0RXZlbnQoKTtcbiAgICAgIH0sIDUwMCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkluaXRpYWxpemVDS0VkaXRvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBJbml0aWFsaXplQ0tFZGl0b3IodGV4dEFyZWFFbGVtSWQsIHBsdWdpbnNDb25maWcsIGxvYWRDb21wbGV0ZWRGdW5jLCBja2VkaXRvckNvbmZpZ0Z1bGxQYXRoLCBwbHVnaW5CYXNlUGF0aCwgdGhlbWVWbykge1xuICAgICAgY29uc29sZS5sb2cocGx1Z2luc0NvbmZpZyk7XG4gICAgICB2YXIgZXh0cmFQbHVnaW5zID0gbmV3IEFycmF5KCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGx1Z2luc0NvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc2luZ2xlUGx1Z2luQ29uZmlnID0gcGx1Z2luc0NvbmZpZ1tpXTtcbiAgICAgICAgdmFyIHNpbmdsZU5hbWUgPSBzaW5nbGVQbHVnaW5Db25maWcuc2luZ2xlTmFtZTtcbiAgICAgICAgdmFyIHRvb2xiYXJMb2NhdGlvbiA9IHNpbmdsZVBsdWdpbkNvbmZpZy50b29sYmFyTG9jYXRpb247XG4gICAgICAgIHZhciB0ZXh0ID0gc2luZ2xlUGx1Z2luQ29uZmlnLnRleHQ7XG4gICAgICAgIHZhciBzZXJ2ZXJSZXNvbHZlID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNlcnZlclJlc29sdmU7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlID0gc2luZ2xlUGx1Z2luQ29uZmlnLmNsaWVudFJlc29sdmU7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlSnMgPSBzaW5nbGVQbHVnaW5Db25maWcuY2xpZW50UmVzb2x2ZUpzO1xuICAgICAgICB2YXIgZGlhbG9nV2lkdGggPSBzaW5nbGVQbHVnaW5Db25maWcuZGlhbG9nV2lkdGg7XG4gICAgICAgIHZhciBkaWFsb2dIZWlnaHQgPSBzaW5nbGVQbHVnaW5Db25maWcuZGlhbG9nSGVpZ2h0O1xuICAgICAgICB2YXIgaXNKQnVpbGQ0RERhdGEgPSBzaW5nbGVQbHVnaW5Db25maWcuaXNKQnVpbGQ0RERhdGE7XG4gICAgICAgIHZhciBjb250cm9sQ2F0ZWdvcnkgPSBzaW5nbGVQbHVnaW5Db25maWcuY29udHJvbENhdGVnb3J5O1xuICAgICAgICB2YXIgc2VydmVyRHluYW1pY0JpbmQgPSBzaW5nbGVQbHVnaW5Db25maWcuc2VydmVyRHluYW1pY0JpbmQ7XG4gICAgICAgIHZhciBzaG93UmVtb3ZlQnV0dG9uID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNob3dSZW1vdmVCdXR0b247XG4gICAgICAgIHZhciBzaG93SW5FZGl0b3JUb29sYmFyID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNob3dJbkVkaXRvclRvb2xiYXI7XG4gICAgICAgIHZhciBwbHVnaW5GaWxlTmFtZSA9IHNpbmdsZU5hbWUgKyBcIlBsdWdpbi5qc1wiO1xuICAgICAgICB2YXIgcGx1Z2luRm9sZGVyTmFtZSA9IHBsdWdpbkJhc2VQYXRoICsgc2luZ2xlTmFtZSArIFwiL1wiO1xuICAgICAgICBDS0VESVRPUi5wbHVnaW5zLmFkZEV4dGVybmFsKHNpbmdsZU5hbWUsIHBsdWdpbkZvbGRlck5hbWUsIHBsdWdpbkZpbGVOYW1lKTtcbiAgICAgICAgZXh0cmFQbHVnaW5zLnB1c2goc2luZ2xlTmFtZSk7XG4gICAgICAgIENLRWRpdG9yUGx1Z2luVXRpbGl0eS5BZGRQbHVnaW5zU2VydmVyQ29uZmlnKHNpbmdsZU5hbWUsIHRvb2xiYXJMb2NhdGlvbiwgdGV4dCwgY2xpZW50UmVzb2x2ZSwgc2VydmVyUmVzb2x2ZSwgY2xpZW50UmVzb2x2ZUpzLCBkaWFsb2dXaWR0aCwgZGlhbG9nSGVpZ2h0LCBpc0pCdWlsZDRERGF0YSwgY29udHJvbENhdGVnb3J5LCBzZXJ2ZXJEeW5hbWljQmluZCwgc2hvd1JlbW92ZUJ1dHRvbiwgc2hvd0luRWRpdG9yVG9vbGJhcik7XG4gICAgICB9XG5cbiAgICAgIGNvbnNvbGUubG9nKHRoZW1lVm8pO1xuICAgICAgdGhpcy5TZXRUaGVtZVZvKHRoZW1lVm8pO1xuICAgICAgdmFyIGVkaXRvckNvbmZpZ1VybCA9IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybChja2VkaXRvckNvbmZpZ0Z1bGxQYXRoKTtcbiAgICAgIENLRURJVE9SLnJlcGxhY2UodGV4dEFyZWFFbGVtSWQsIHtcbiAgICAgICAgY3VzdG9tQ29uZmlnOiBlZGl0b3JDb25maWdVcmwsXG4gICAgICAgIGV4dHJhUGx1Z2luczogZXh0cmFQbHVnaW5zLmpvaW4oXCIsXCIpXG4gICAgICB9KTtcbiAgICAgIENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbi5vbihcImJlZm9yZVBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge30pO1xuICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzLmh0bWxfZGVzaWduLm9uKFwicGFzdGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIHZhciBzb3VyY2VIVE1MID0gZXZlbnQuZGF0YS5kYXRhVmFsdWU7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB2YXIgJHNvdXJjZUhUTUwgPSAkKHNvdXJjZUhUTUwpO1xuICAgICAgICAgICRzb3VyY2VIVE1MLmZpbmQoXCIuZGVsLWJ1dHRvblwiKS5yZW1vdmUoKTtcblxuICAgICAgICAgIGlmICgkc291cmNlSFRNTC5maW5kKFwiZGl2XCIpLmxlbmd0aCA9PSAxKSB7XG4gICAgICAgICAgICBldmVudC5kYXRhLmRhdGFWYWx1ZSA9ICRzb3VyY2VIVE1MLmZpbmQoXCJkaXZcIikub3V0ZXJIVE1MKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgZXZlbnQuZGF0YS5kYXRhVmFsdWUgPSBzb3VyY2VIVE1MO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbi5vbihcImFmdGVyUGFzdGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIENLRWRpdG9yVXRpbGl0eS5BTExFbGVtQmluZERlZmF1bHRFdmVudCgpO1xuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oJ2luc2VydEVsZW1lbnQnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnRFbGVtZW50XCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgICB9KTtcbiAgICAgIENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbi5vbignaW5zZXJ0SHRtbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImluc2VydEh0bWxcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5TZXRDS0VkaXRvckluc3QoQ0tFRElUT1IuaW5zdGFuY2VzLmh0bWxfZGVzaWduKTtcbiAgICAgIENLRURJVE9SLm9uKCdpbnN0YW5jZVJlYWR5JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBsb2FkQ29tcGxldGVkRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBsb2FkQ29tcGxldGVkRnVuYygpO1xuICAgICAgICAgIDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldFRoZW1lVm9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0VGhlbWVWbygpIHtcbiAgICAgIHJldHVybiB0aGlzLl9UaGVtZVZvO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTZXRUaGVtZVZvXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldFRoZW1lVm8oX3RoZW1lVm8pIHtcbiAgICAgIHRoaXMuX1RoZW1lVm8gPSBfdGhlbWVWbztcblxuICAgICAgaWYgKHRoaXMuR2V0Q0tFZGl0b3JJbnN0KCkpIHtcbiAgICAgICAgdmFyIHNvdXJjZUhUTUwgPSB0aGlzLkdldENLRWRpdG9ySFRNTCgpO1xuICAgICAgICBkZWJ1Z2dlcjtcblxuICAgICAgICBpZiAoc291cmNlSFRNTCAhPSBudWxsICYmIHNvdXJjZUhUTUwgIT0gXCJcIikge1xuICAgICAgICAgIHZhciByb290RWxlbSA9ICQoc291cmNlSFRNTCk7XG5cbiAgICAgICAgICBpZiAocm9vdEVsZW0uYXR0cihcImlzX2NvbnRhaW5lcl9yb290XCIpICE9IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICByb290RWxlbSA9ICQoc291cmNlSFRNTCkuZmluZChcIltpc19jb250YWluZXJfcm9vdF1cIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHJvb3RFbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBjbGFzc0xpc3QgPSByb290RWxlbS5hdHRyKCdjbGFzcycpLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICB2YXIgY2xhc3NhcnkgPSBbXTtcbiAgICAgICAgICAgICQuZWFjaChjbGFzc0xpc3QsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xuICAgICAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKCdodG1sLWRlc2lnbi10aGVtZS0nKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcm9vdEVsZW0ucmVtb3ZlQ2xhc3MoaXRlbSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcm9vdEVsZW0uYWRkQ2xhc3MoX3RoZW1lVm8ucm9vdEVsZW1DbGFzcyk7XG4gICAgICAgICAgICB0aGlzLlNldENLRWRpdG9ySFRNTChyb290RWxlbS5vdXRlckhUTUwoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkNsZWFyQUxMRm9yRGl2RWxlbUJ1dHRvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBDbGVhckFMTEZvckRpdkVsZW1CdXR0b24oKSB7XG4gICAgICB2YXIgb2xkRGVsQnV0dG9ucyA9IENLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckluc3QoKS5kb2N1bWVudC5maW5kKFwiLmRlbC1idXR0b25cIik7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkRGVsQnV0dG9ucy5jb3VudCgpOyBpKyspIHtcbiAgICAgICAgb2xkRGVsQnV0dG9ucy5nZXRJdGVtKGkpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTaW5nbGVFbGVtQmluZERlZmF1bHRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTaW5nbGVFbGVtQmluZERlZmF1bHRFdmVudChlbGVtKSB7XG4gICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoXCJzaG93X3JlbW92ZV9idXR0b25cIikgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgY29uc29sZS5sb2coZWxlbS5nZXROYW1lKCkpO1xuICAgICAgICBlbGVtLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JJbnN0KCkuZ2V0U2VsZWN0aW9uKCkuc2VsZWN0RWxlbWVudCh0aGlzKTtcbiAgICAgICAgICBDS0VkaXRvclV0aWxpdHkuU2V0U2VsZWN0ZWRFbGVtKHRoaXMuZ2V0T3V0ZXJIdG1sKCkpO1xuICAgICAgICAgIENLRWRpdG9yVXRpbGl0eS5DbGVhckFMTEZvckRpdkVsZW1CdXR0b24oKTtcbiAgICAgICAgICB2YXIgbmV3RGVsQnV0dG9uID0gbmV3IENLRURJVE9SLmRvbS5lbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBuZXdEZWxCdXR0b24uYWRkQ2xhc3MoXCJkZWwtYnV0dG9uXCIpO1xuICAgICAgICAgIGVsZW0uYXBwZW5kKG5ld0RlbEJ1dHRvbik7XG4gICAgICAgICAgbmV3RGVsQnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGVsZW0ucmVtb3ZlKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJBTExFbGVtQmluZERlZmF1bHRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBBTExFbGVtQmluZERlZmF1bHRFdmVudCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKENLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckluc3QoKSk7XG4gICAgICB2YXIgZWxlbWVudHMgPSBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JJbnN0KCkuZG9jdW1lbnQuZ2V0Qm9keSgpLmdldEVsZW1lbnRzQnlUYWcoJyonKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5jb3VudCgpOyArK2kpIHtcbiAgICAgICAgdmFyIGVsZW0gPSBlbGVtZW50cy5nZXRJdGVtKGkpO1xuICAgICAgICB0aGlzLlNpbmdsZUVsZW1CaW5kRGVmYXVsdEV2ZW50KGVsZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDS0VkaXRvclV0aWxpdHk7XG59KCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclV0aWxpdHksIFwiXyRDS0VkaXRvclNlbGVjdEVsZW1cIiwgbnVsbCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclV0aWxpdHksIFwiX0NLRWRpdG9ySW5zdFwiLCBudWxsKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yVXRpbGl0eSwgXCJfVGhlbWVWb1wiLCBudWxsKTsiLCJcInVzZSBzdHJpY3RcIjsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgSFRNTEVkaXRvclV0aWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEhUTUxFZGl0b3JVdGlsaXR5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIVE1MRWRpdG9yVXRpbGl0eSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoSFRNTEVkaXRvclV0aWxpdHksIG51bGwsIFt7XG4gICAga2V5OiBcIkdldEhUTUxFZGl0b3JJbnN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEhUTUxFZGl0b3JJbnN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX0hUTUxFZGl0b3JJbnN0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTZXRIVE1MRWRpdG9ySFRNTFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRIVE1MRWRpdG9ySFRNTChodG1sKSB7XG4gICAgICBpZiAoIVN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShodG1sKSkge1xuICAgICAgICB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuc2V0VmFsdWUoaHRtbCk7XG4gICAgICAgIENvZGVNaXJyb3IuY29tbWFuZHNbXCJzZWxlY3RBbGxcIl0odGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpKTtcbiAgICAgICAgdmFyIHJhbmdlID0ge1xuICAgICAgICAgIGZyb206IHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXRDdXJzb3IodHJ1ZSksXG4gICAgICAgICAgdG86IHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXRDdXJzb3IoZmFsc2UpXG4gICAgICAgIH07XG4gICAgICAgIDtcbiAgICAgICAgdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmF1dG9Gb3JtYXRSYW5nZShyYW5nZS5mcm9tLCByYW5nZS50byk7XG4gICAgICAgIHZhciBhMSA9IHtcbiAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgIGNoOiAyXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXREb2MoKS5lYWNoTGluZShmdW5jdGlvbiAobGluZSkge30pO1xuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVtID0gQ0tFZGl0b3JVdGlsaXR5LkdldFNlbGVjdGVkRWxlbSgpO1xuICAgICAgICB2YXIgc2VhcmNoSFRNTCA9IFwiXCI7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkRWxlbSkge1xuICAgICAgICAgIHNlYXJjaEhUTUwgPSBzZWxlY3RlZEVsZW0ub3V0ZXJIVE1MKCkuc3BsaXQoXCI+XCIpWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICB2YXIgY3Vyc29yID0gdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldFNlYXJjaEN1cnNvcihzZWFyY2hIVE1MKTtcbiAgICAgICAgY3Vyc29yLmZpbmROZXh0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGN1cnNvcik7XG4gICAgICAgIGNvbnNvbGUubG9nKGN1cnNvci5mcm9tKCkgKyBcInxcIiArIGN1cnNvci50bygpKTtcblxuICAgICAgICBpZiAoY3Vyc29yLmZyb20oKSAmJiBjdXJzb3IudG8oKSkge1xuICAgICAgICAgIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXREb2MoKS5zZXRTZWxlY3Rpb24oY3Vyc29yLmZyb20oKSwgY3Vyc29yLnRvKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEh0bWxFZGl0b3JIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEh0bWxFZGl0b3JIVE1MKCkge1xuICAgICAgcmV0dXJuIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXRWYWx1ZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJJbml0aWFsaXplSFRNTENvZGVEZXNpZ25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gSW5pdGlhbGl6ZUhUTUxDb2RlRGVzaWduKCkge1xuICAgICAgdmFyIG1peGVkTW9kZSA9IHtcbiAgICAgICAgbmFtZTogXCJodG1sbWl4ZWRcIixcbiAgICAgICAgc2NyaXB0VHlwZXM6IFt7XG4gICAgICAgICAgbWF0Y2hlczogL1xcL3gtaGFuZGxlYmFycy10ZW1wbGF0ZXxcXC94LW11c3RhY2hlL2ksXG4gICAgICAgICAgbW9kZTogbnVsbFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbWF0Y2hlczogLyh0ZXh0fGFwcGxpY2F0aW9uKVxcLyh4LSk/dmIoYXxzY3JpcHQpL2ksXG4gICAgICAgICAgbW9kZTogXCJ2YnNjcmlwdFwiXG4gICAgICAgIH1dXG4gICAgICB9O1xuICAgICAgdGhpcy5fSFRNTEVkaXRvckluc3QgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlRleHRBcmVhSFRNTEVkaXRvclwiKSwge1xuICAgICAgICBtb2RlOiBtaXhlZE1vZGUsXG4gICAgICAgIHNlbGVjdGlvblBvaW50ZXI6IHRydWUsXG4gICAgICAgIHRoZW1lOiBcIm1vbm9rYWlcIixcbiAgICAgICAgZm9sZEd1dHRlcjogdHJ1ZSxcbiAgICAgICAgZ3V0dGVyczogW1wiQ29kZU1pcnJvci1saW5lbnVtYmVyc1wiLCBcIkNvZGVNaXJyb3ItZm9sZGd1dHRlclwiXSxcbiAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX0hUTUxFZGl0b3JJbnN0LnNldFNpemUoXCIxMDAlXCIsIFBhZ2VTdHlsZVV0aWxpdHkuR2V0V2luZG93SGVpZ2h0KCkgLSA4NSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEhUTUxFZGl0b3JVdGlsaXR5O1xufSgpO1xuXG5fZGVmaW5lUHJvcGVydHkoSFRNTEVkaXRvclV0aWxpdHksIFwiX0hUTUxFZGl0b3JJbnN0XCIsIG51bGwpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBKc0VkaXRvclV0aWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEpzRWRpdG9yVXRpbGl0eSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSnNFZGl0b3JVdGlsaXR5KTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhKc0VkaXRvclV0aWxpdHksIG51bGwsIFt7XG4gICAga2V5OiBcIl9HZXROZXdGb3JtSnNTdHJpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX0dldE5ld0Zvcm1Kc1N0cmluZygpIHtcbiAgICAgIHJldHVybiBcIjxzY3JpcHQ+dmFyIEZvcm1QYWdlT2JqZWN0SW5zdGFuY2U9e1wiICsgXCJkYXRhOntcIiArIFwidXNlckVudGl0eTp7fSxcIiArIFwiZm9ybUVudGl0eTpbXSxcIiArIFwiY29uZmlnOltdXCIgKyBcIn0sXCIgKyBcInBhZ2VSZWFkeTpmdW5jdGlvbigpe30sXCIgKyBcImJpbmRSZWNvcmREYXRhUmVhZHk6ZnVuY3Rpb24oKXt9LFwiICsgXCJ2YWxpZGF0ZUV2ZXJ5RnJvbUNvbnRyb2w6ZnVuY3Rpb24oY29udHJvbE9iail7fVwiICsgXCJ9PC9zY3JpcHQ+XCI7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEpzRWRpdG9ySW5zdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRKc0VkaXRvckluc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fSnNFZGl0b3JJbnN0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTZXRKc0VkaXRvckpzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldEpzRWRpdG9ySnMoanMpIHtcbiAgICAgIHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuc2V0VmFsdWUoanMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRKc0VkaXRvckpzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEpzRWRpdG9ySnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5HZXRKc0VkaXRvckluc3QoKS5nZXRWYWx1ZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJJbml0aWFsaXplSnNDb2RlRGVzaWduXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEluaXRpYWxpemVKc0NvZGVEZXNpZ24oc3RhdHVzKSB7XG4gICAgICB0aGlzLl9Kc0VkaXRvckluc3QgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYSgkKFwiI1RleHRBcmVhSnNFZGl0b3JcIilbMF0sIHtcbiAgICAgICAgbW9kZTogXCJhcHBsaWNhdGlvbi9sZCtqc29uXCIsXG4gICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICAgIGV4dHJhS2V5czoge1xuICAgICAgICAgIFwiQ3RybC1RXCI6IGZ1bmN0aW9uIEN0cmxRKGNtKSB7XG4gICAgICAgICAgICBjbS5mb2xkQ29kZShjbS5nZXRDdXJzb3IoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmb2xkR3V0dGVyOiB0cnVlLFxuICAgICAgICBzbWFydEluZGVudDogdHJ1ZSxcbiAgICAgICAgbWF0Y2hCcmFja2V0czogdHJ1ZSxcbiAgICAgICAgdGhlbWU6IFwibW9ub2thaVwiLFxuICAgICAgICBndXR0ZXJzOiBbXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCIsIFwiQ29kZU1pcnJvci1mb2xkZ3V0dGVyXCJdXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fSnNFZGl0b3JJbnN0LnNldFNpemUoXCIxMDAlXCIsIFBhZ2VTdHlsZVV0aWxpdHkuR2V0V2luZG93SGVpZ2h0KCkgLSA4NSk7XG5cbiAgICAgIGlmIChzdGF0dXMgPT0gXCJhZGRcIikge1xuICAgICAgICB0aGlzLlNldEpzRWRpdG9ySnModGhpcy5fR2V0TmV3Rm9ybUpzU3RyaW5nKCkpO1xuICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW1wic2VsZWN0QWxsXCJdKHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkpO1xuICAgICAgICB2YXIgcmFuZ2UgPSB7XG4gICAgICAgICAgZnJvbTogdGhpcy5HZXRKc0VkaXRvckluc3QoKS5nZXRDdXJzb3IodHJ1ZSksXG4gICAgICAgICAgdG86IHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKGZhbHNlKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLmF1dG9Gb3JtYXRSYW5nZShyYW5nZS5mcm9tLCByYW5nZS50byk7XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEpzRWRpdG9yVXRpbGl0eTtcbn0oKTtcblxuX2RlZmluZVByb3BlcnR5KEpzRWRpdG9yVXRpbGl0eSwgXCJfSnNFZGl0b3JJbnN0XCIsIG51bGwpOyJdfQ==
