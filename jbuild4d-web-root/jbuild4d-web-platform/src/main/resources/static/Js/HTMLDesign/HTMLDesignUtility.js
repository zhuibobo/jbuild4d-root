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
      console.log(pluginSetting);

      if (pluginSetting.ShowInEditorToolbar == "true") {
        ckEditor.ui.addButton(pluginSetting.SingleName, {
          label: pluginSetting.ToolbarLabel,
          icon: path + pluginSetting.ToolbarIcon,
          command: pluginSetting.ToolbarCommand,
          toolbar: pluginSetting.ToolbarLocation
        });
      }

      ckEditor.on('doubleclick', function (event) {
        pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteEditActionName;
        CKEditorPluginUtility.OnCKWysiwygElemDBClickEvent(event, pluginSetting);
      });
    }
  }, {
    key: "OnCKWysiwygElemDBClickEvent",
    value: function OnCKWysiwygElemDBClickEvent(event, controlSetting) {
      var element = event.data.element;

      if (element.getAttribute("runtime_auto_remove") == "true") {
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

      if (props["normalProps"]) {
        for (var key in props["normalProps"]) {
          elem.setAttribute(key.toLocaleLowerCase(), props["normalProps"][key]);
        }
      }

      if (props["bindToSearchField"]) {
        for (var key in props["bindToSearchField"]) {
          elem.setAttribute(key.toLocaleLowerCase(), props["bindToSearchField"][key]);
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
      props = attrToProp.call(this, props, "bindToSearchField");

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

            if (reFreshElem.getAttribute("control_category") == "InputControl") {
              var newText = $(html).text();
              reFreshElem.setText(newText);
            }

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
      var sel = CKEditorUtility.GetCKEditorInst().getSelection().getStartElement();
      var parents = null;

      if (sel) {
        parents = sel.getParents();
      }

      iframeObj.contentWindow.DialogApp.ready(actionName, sel, parents);

      if (actionName == this.DialogExecuteEditActionName) {
        var elem = CKEditorUtility.GetSelectedElem().outerHTML();
        var props = this.DeserializePropsFromElem(elem);
        iframeObj.contentWindow.DialogApp.setControlProps($(elem), props);
      }
    }
  }, {
    key: "GetControlDescText",
    value: function GetControlDescText(pluginSetting, props) {
      return "[" + pluginSetting.ToolbarLabel + "] 绑定:[" + props.bindToField.tableCaption + "-" + props.bindToField.fieldCaption + "]";
    }
  }, {
    key: "GetSearchControlDescText",
    value: function GetSearchControlDescText(pluginSetting, props) {
      return "[" + pluginSetting.ToolbarLabel + "] 绑定:[" + props.bindToSearchField.columnCaption + "]";
    }
  }, {
    key: "GetAutoRemoveTipLabel",
    value: function GetAutoRemoveTipLabel(tipMsg) {
      if (!tipMsg) {
        tipMsg = "双击编辑该部件";
      }

      return '<div runtime_auto_remove="true" class="wysiwyg-auto-remove-tip">' + tipMsg + '</div>';
    }
  }, {
    key: "TryGetDataSetId",
    value: function TryGetDataSetId(sel, parents) {
      if (sel) {
        for (var i = parents.length - 1; i--; i >= 0) {
          if (parents[i].getAttribute("datasetid") != null && parents[i].getAttribute("datasetid") != "") {
            console.log(parents[i].getAttribute("datasetid"));
            return parents[i].getAttribute("datasetid");
          }
        }
      }

      if (!this.dataSetId) {
        return window.parent.listDesign.listResourceEntity.listDatasetId;
      }

      return null;
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
  },
  bindToSearchField: {
    columnTitle: "",
    columnTableName: "",
    columnName: "",
    columnCaption: "",
    columnDataTypeName: "",
    columnOperator: "匹配"
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
      this.ResetRootElemTheme(_themeVo);
    }
  }, {
    key: "ResetRootElemTheme",
    value: function ResetRootElemTheme(_themeVo) {
      if (this.GetCKEditorInst()) {
        var sourceHTML = this.GetCKEditorHTML();

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNLRWRpdG9yUGx1Z2luVXRpbGl0eS5qcyIsIkNLRWRpdG9yVXRpbGl0eS5qcyIsIkhUTUxFZGl0b3JVdGlsaXR5LmpzIiwiSnNFZGl0b3JVdGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdFlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkhUTUxEZXNpZ25VdGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIENLRWRpdG9yUGx1Z2luVXRpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDS0VkaXRvclBsdWdpblV0aWxpdHkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiQWRkUGx1Z2luc1NlcnZlckNvbmZpZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBBZGRQbHVnaW5zU2VydmVyQ29uZmlnKHNpbmdsZU5hbWUsIHRvb2xiYXJMb2NhdGlvbiwgdGV4dCwgY2xpZW50UmVzb2x2ZSwgc2VydmVyUmVzb2x2ZSwgY2xpZW50UmVzb2x2ZUpzLCBkaWFsb2dXaWR0aCwgZGlhbG9nSGVpZ2h0LCBpc0pCdWlsZDRERGF0YSwgY29udHJvbENhdGVnb3J5LCBzZXJ2ZXJEeW5hbWljQmluZCwgc2hvd1JlbW92ZUJ1dHRvbiwgc2hvd0luRWRpdG9yVG9vbGJhcikge1xuICAgICAgdGhpcy5QbHVnaW5zU2VydmVyQ29uZmlnW3NpbmdsZU5hbWVdID0ge1xuICAgICAgICBTaW5nbGVOYW1lOiBzaW5nbGVOYW1lLFxuICAgICAgICBUb29sYmFyTG9jYXRpb246IHRvb2xiYXJMb2NhdGlvbixcbiAgICAgICAgVG9vbGJhckxhYmVsOiB0ZXh0LFxuICAgICAgICBDbGllbnRSZXNvbHZlOiBjbGllbnRSZXNvbHZlLFxuICAgICAgICBTZXJ2ZXJSZXNvbHZlOiBzZXJ2ZXJSZXNvbHZlLFxuICAgICAgICBDbGllbnRSZXNvbHZlSnM6IGNsaWVudFJlc29sdmVKcyxcbiAgICAgICAgRGlhbG9nV2lkdGg6IGRpYWxvZ1dpZHRoLFxuICAgICAgICBEaWFsb2dIZWlnaHQ6IGRpYWxvZ0hlaWdodCxcbiAgICAgICAgSXNKQnVpbGQ0RERhdGE6IGlzSkJ1aWxkNEREYXRhLFxuICAgICAgICBDb250cm9sQ2F0ZWdvcnk6IGNvbnRyb2xDYXRlZ29yeSxcbiAgICAgICAgU2VydmVyRHluYW1pY0JpbmQ6IHNlcnZlckR5bmFtaWNCaW5kLFxuICAgICAgICBTaG93UmVtb3ZlQnV0dG9uOiBzaG93UmVtb3ZlQnV0dG9uLFxuICAgICAgICBTaG93SW5FZGl0b3JUb29sYmFyOiBzaG93SW5FZGl0b3JUb29sYmFyXG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfVXNlU2VydmVyQ29uZmlnQ292ZXJFbXB0eVBsdWdpblByb3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX1VzZVNlcnZlckNvbmZpZ0NvdmVyRW1wdHlQbHVnaW5Qcm9wKG9iaikge1xuICAgICAgdmFyIGNvdmVyT2JqID0gdGhpcy5QbHVnaW5zU2VydmVyQ29uZmlnW29iai5TaW5nbGVOYW1lXTtcblxuICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpbcHJvcF0gIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBcIlwiIHx8IG9ialtwcm9wXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY292ZXJPYmpbcHJvcF0pIHtcbiAgICAgICAgICAgICAgb2JqW3Byb3BdID0gY292ZXJPYmpbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEdlbmVyYWxQbHVnaW5JbnN0YW5jZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRHZW5lcmFsUGx1Z2luSW5zdGFuY2UocGx1Z2luU2luZ2xlTmFtZSwgZXhDb25maWcpIHtcbiAgICAgIHZhciBkZWZhdWx0U2V0dGluZyA9IHtcbiAgICAgICAgU2luZ2xlTmFtZTogcGx1Z2luU2luZ2xlTmFtZSxcbiAgICAgICAgRGlhbG9nTmFtZTogJycsXG4gICAgICAgIERpYWxvZ1dpZHRoOiBudWxsLFxuICAgICAgICBEaWFsb2dIZWlnaHQ6IG51bGwsXG4gICAgICAgIERpYWxvZ1BhZ2VVcmw6IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybCgnRGlhbG9nLmh0bWwnKSxcbiAgICAgICAgRGlhbG9nVGl0bGU6IFwiRElWXCIsXG4gICAgICAgIFRvb2xiYXJDb21tYW5kOiAnJyxcbiAgICAgICAgVG9vbGJhckljb246ICdJY29uLnBuZycsXG4gICAgICAgIFRvb2xiYXJMYWJlbDogXCJcIixcbiAgICAgICAgVG9vbGJhckxvY2F0aW9uOiAnJyxcbiAgICAgICAgSUZyYW1lV2luZG93OiBudWxsLFxuICAgICAgICBJRnJhbWVFeGVjdXRlQWN0aW9uTmFtZTogXCJJbnNlcnRcIixcbiAgICAgICAgRGVzaWduTW9kYWxJbnB1dENzczogXCJcIixcbiAgICAgICAgQ2xpZW50UmVzb2x2ZTogXCJcIixcbiAgICAgICAgU2VydmVyUmVzb2x2ZTogXCJcIixcbiAgICAgICAgSXNKQnVpbGQ0RERhdGE6IFwiXCIsXG4gICAgICAgIENvbnRyb2xDYXRlZ29yeTogXCJcIixcbiAgICAgICAgU2VydmVyRHluYW1pY0JpbmQ6IFwiXCIsXG4gICAgICAgIFNob3dSZW1vdmVCdXR0b246IFwiXCIsXG4gICAgICAgIFNob3dJbkVkaXRvclRvb2xiYXI6IFwiXCJcbiAgICAgIH07XG4gICAgICBkZWZhdWx0U2V0dGluZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0U2V0dGluZywgZXhDb25maWcpO1xuICAgICAgZGVmYXVsdFNldHRpbmcgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuX1VzZVNlcnZlckNvbmZpZ0NvdmVyRW1wdHlQbHVnaW5Qcm9wKGRlZmF1bHRTZXR0aW5nKTtcbiAgICAgIGRlZmF1bHRTZXR0aW5nLkRpYWxvZ05hbWUgPSBkZWZhdWx0U2V0dGluZy5TaW5nbGVOYW1lO1xuICAgICAgZGVmYXVsdFNldHRpbmcuVG9vbGJhckNvbW1hbmQgPSBcIkpCdWlsZDRELkZvcm1EZXNpZ24uUGx1Z2lucy5cIiArIGRlZmF1bHRTZXR0aW5nLlNpbmdsZU5hbWU7XG4gICAgICBkZWZhdWx0U2V0dGluZy5EaWFsb2dTZXR0aW5nVGl0bGUgPSBkZWZhdWx0U2V0dGluZy5Ub29sYmFyTGFiZWwgKyBcIldlYuaOp+S7tlwiO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgU2V0dGluZzogZGVmYXVsdFNldHRpbmdcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlJlZ0dlbmVyYWxQbHVnaW5Ub0VkaXRvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBSZWdHZW5lcmFsUGx1Z2luVG9FZGl0b3IoY2tFZGl0b3IsIHBhdGgsIHBsdWdpblNldHRpbmcsIG9rRnVuYykge1xuICAgICAgQ0tFRElUT1IuZGlhbG9nLmFkZElmcmFtZShwbHVnaW5TZXR0aW5nLkRpYWxvZ05hbWUsIHBsdWdpblNldHRpbmcuRGlhbG9nU2V0dGluZ1RpdGxlLCBwYXRoICsgcGx1Z2luU2V0dGluZy5EaWFsb2dQYWdlVXJsLCBwbHVnaW5TZXR0aW5nLkRpYWxvZ1dpZHRoLCBwbHVnaW5TZXR0aW5nLkRpYWxvZ0hlaWdodCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5fLmZyYW1lSWQpO1xuICAgICAgICBwbHVnaW5TZXR0aW5nLklGcmFtZVdpbmRvdyA9IGlmcmFtZTtcbiAgICAgICAgQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LlNldEVsZW1Qcm9wc0luRWRpdERpYWxvZyhwbHVnaW5TZXR0aW5nLklGcmFtZVdpbmRvdywgcGx1Z2luU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSk7XG4gICAgICB9LCB7XG4gICAgICAgIG9uT2s6IGZ1bmN0aW9uIG9uT2soKSB7XG4gICAgICAgICAgdmFyIHByb3BzID0gcGx1Z2luU2V0dGluZy5JRnJhbWVXaW5kb3cuY29udGVudFdpbmRvdy5EaWFsb2dBcHAuZ2V0Q29udHJvbFByb3BzKCk7XG5cbiAgICAgICAgICBpZiAocHJvcHMuc3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9rRnVuYyhja0VkaXRvciwgcGx1Z2luU2V0dGluZywgcHJvcHMsIHBsdWdpblNldHRpbmcuSUZyYW1lV2luZG93LmNvbnRlbnRXaW5kb3cpO1xuICAgICAgICAgIHBsdWdpblNldHRpbmcuSUZyYW1lRXhlY3V0ZUFjdGlvbk5hbWUgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUluc2VydEFjdGlvbk5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2FuY2VsOiBmdW5jdGlvbiBvbkNhbmNlbCgpIHtcbiAgICAgICAgICBwbHVnaW5TZXR0aW5nLklGcmFtZUV4ZWN1dGVBY3Rpb25OYW1lID0gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkRpYWxvZ0V4ZWN1dGVJbnNlcnRBY3Rpb25OYW1lO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNrRWRpdG9yLmFkZENvbW1hbmQocGx1Z2luU2V0dGluZy5Ub29sYmFyQ29tbWFuZCwgbmV3IENLRURJVE9SLmRpYWxvZ0NvbW1hbmQocGx1Z2luU2V0dGluZy5EaWFsb2dOYW1lKSk7XG4gICAgICBjb25zb2xlLmxvZyhwbHVnaW5TZXR0aW5nKTtcblxuICAgICAgaWYgKHBsdWdpblNldHRpbmcuU2hvd0luRWRpdG9yVG9vbGJhciA9PSBcInRydWVcIikge1xuICAgICAgICBja0VkaXRvci51aS5hZGRCdXR0b24ocGx1Z2luU2V0dGluZy5TaW5nbGVOYW1lLCB7XG4gICAgICAgICAgbGFiZWw6IHBsdWdpblNldHRpbmcuVG9vbGJhckxhYmVsLFxuICAgICAgICAgIGljb246IHBhdGggKyBwbHVnaW5TZXR0aW5nLlRvb2xiYXJJY29uLFxuICAgICAgICAgIGNvbW1hbmQ6IHBsdWdpblNldHRpbmcuVG9vbGJhckNvbW1hbmQsXG4gICAgICAgICAgdG9vbGJhcjogcGx1Z2luU2V0dGluZy5Ub29sYmFyTG9jYXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGNrRWRpdG9yLm9uKCdkb3VibGVjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBwbHVnaW5TZXR0aW5nLklGcmFtZUV4ZWN1dGVBY3Rpb25OYW1lID0gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkRpYWxvZ0V4ZWN1dGVFZGl0QWN0aW9uTmFtZTtcbiAgICAgICAgQ0tFZGl0b3JQbHVnaW5VdGlsaXR5Lk9uQ0tXeXNpd3lnRWxlbURCQ2xpY2tFdmVudChldmVudCwgcGx1Z2luU2V0dGluZyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiT25DS1d5c2l3eWdFbGVtREJDbGlja0V2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIE9uQ0tXeXNpd3lnRWxlbURCQ2xpY2tFdmVudChldmVudCwgY29udHJvbFNldHRpbmcpIHtcbiAgICAgIHZhciBlbGVtZW50ID0gZXZlbnQuZGF0YS5lbGVtZW50O1xuXG4gICAgICBpZiAoZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJydW50aW1lX2F1dG9fcmVtb3ZlXCIpID09IFwidHJ1ZVwiKSB7XG4gICAgICAgIGVsZW1lbnQgPSBldmVudC5kYXRhLmVsZW1lbnQuZ2V0UGFyZW50KCk7XG4gICAgICB9XG5cbiAgICAgIHZhciBzaW5nbGVOYW1lID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoXCJzaW5nbGVOYW1lXCIpO1xuXG4gICAgICBpZiAoc2luZ2xlTmFtZSA9PSBjb250cm9sU2V0dGluZy5TaW5nbGVOYW1lKSB7XG4gICAgICAgIENLRWRpdG9yVXRpbGl0eS5TZXRTZWxlY3RlZEVsZW0oZWxlbWVudC5nZXRPdXRlckh0bWwoKSk7XG4gICAgICAgIGV2ZW50LmRhdGEuZGlhbG9nID0gY29udHJvbFNldHRpbmcuRGlhbG9nTmFtZTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2VyaWFsaXplUHJvcHNUb0VsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2VyaWFsaXplUHJvcHNUb0VsZW0oZWxlbSwgcHJvcHMsIGNvbnRyb2xTZXR0aW5nKSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImpidWlsZDRkX2N1c3RvbVwiLCBcInRydWVcIik7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNpbmdsZW5hbWVcIiwgY29udHJvbFNldHRpbmcuU2luZ2xlTmFtZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImNsaWVudHJlc29sdmVcIiwgY29udHJvbFNldHRpbmcuQ2xpZW50UmVzb2x2ZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNlcnZlcnJlc29sdmVcIiwgY29udHJvbFNldHRpbmcuU2VydmVyUmVzb2x2ZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImlzX2pidWlsZDRkX2RhdGFcIiwgY29udHJvbFNldHRpbmcuSXNKQnVpbGQ0RERhdGEpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJjb250cm9sX2NhdGVnb3J5XCIsIGNvbnRyb2xTZXR0aW5nLkNvbnRyb2xDYXRlZ29yeSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNlcnZlcl9keW5hbWljX2JpbmRcIiwgY29udHJvbFNldHRpbmcuU2VydmVyRHluYW1pY0JpbmQpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJzaG93X3JlbW92ZV9idXR0b25cIiwgY29udHJvbFNldHRpbmcuU2hvd1JlbW92ZUJ1dHRvbik7XG5cbiAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImJhc2VJbmZvXCJdKSB7XG4gICAgICAgICAgaWYgKGtleSA9PSBcInJlYWRvbmx5XCIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0gPT0gXCJyZWFkb25seVwiKSB7XG4gICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJyZWFkb25seVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBcImRpc2FibGVkXCIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0gPT0gXCJkaXNhYmxlZFwiKSB7XG4gICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wc1tcImJpbmRUb0ZpZWxkXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImJpbmRUb0ZpZWxkXCJdKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmluZFRvRmllbGRcIl1ba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzW1wiZGVmYXVsdFZhbHVlXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImRlZmF1bHRWYWx1ZVwiXSkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImRlZmF1bHRWYWx1ZVwiXVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHNbXCJ2YWxpZGF0ZVJ1bGVzXCJdKSB7XG4gICAgICAgIGlmIChwcm9wc1tcInZhbGlkYXRlUnVsZXNcIl0ucnVsZXMpIHtcbiAgICAgICAgICBpZiAocHJvcHNbXCJ2YWxpZGF0ZVJ1bGVzXCJdLnJ1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwidmFsaWRhdGVydWxlc1wiLCBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHByb3BzW1widmFsaWRhdGVSdWxlc1wiXSkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzW1wibm9ybWFsUHJvcHNcIl0pIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzW1wibm9ybWFsUHJvcHNcIl0pIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShrZXkudG9Mb2NhbGVMb3dlckNhc2UoKSwgcHJvcHNbXCJub3JtYWxQcm9wc1wiXVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHNbXCJiaW5kVG9TZWFyY2hGaWVsZFwiXSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNbXCJiaW5kVG9TZWFyY2hGaWVsZFwiXSkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImJpbmRUb1NlYXJjaEZpZWxkXCJdW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJEZXNlcmlhbGl6ZVByb3BzRnJvbUVsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gRGVzZXJpYWxpemVQcm9wc0Zyb21FbGVtKGVsZW0pIHtcbiAgICAgIHZhciBwcm9wcyA9IHt9O1xuICAgICAgdmFyICRlbGVtID0gJChlbGVtKTtcblxuICAgICAgZnVuY3Rpb24gYXR0clRvUHJvcChwcm9wcywgZ3JvdXBOYW1lKSB7XG4gICAgICAgIHZhciBncm91cFByb3AgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5EZWZhdWx0UHJvcHNbZ3JvdXBOYW1lXSkge1xuICAgICAgICAgIGlmICgkZWxlbS5hdHRyKGtleSkpIHtcbiAgICAgICAgICAgIGdyb3VwUHJvcFtrZXldID0gJGVsZW0uYXR0cihrZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncm91cFByb3Bba2V5XSA9IHRoaXMuRGVmYXVsdFByb3BzW2dyb3VwTmFtZV1ba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm9wc1tncm91cE5hbWVdID0gZ3JvdXBQcm9wO1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICB9XG5cbiAgICAgIHByb3BzID0gYXR0clRvUHJvcC5jYWxsKHRoaXMsIHByb3BzLCBcImJhc2VJbmZvXCIpO1xuICAgICAgcHJvcHMgPSBhdHRyVG9Qcm9wLmNhbGwodGhpcywgcHJvcHMsIFwiYmluZFRvRmllbGRcIik7XG4gICAgICBwcm9wcyA9IGF0dHJUb1Byb3AuY2FsbCh0aGlzLCBwcm9wcywgXCJkZWZhdWx0VmFsdWVcIik7XG4gICAgICBwcm9wcyA9IGF0dHJUb1Byb3AuY2FsbCh0aGlzLCBwcm9wcywgXCJiaW5kVG9TZWFyY2hGaWVsZFwiKTtcblxuICAgICAgaWYgKCRlbGVtLmF0dHIoXCJ2YWxpZGF0ZVJ1bGVzXCIpKSB7XG4gICAgICAgIHByb3BzLnZhbGlkYXRlUnVsZXMgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oZGVjb2RlVVJJQ29tcG9uZW50KCRlbGVtLmF0dHIoXCJ2YWxpZGF0ZVJ1bGVzXCIpKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiQnVpbGRHZW5lcmFsRWxlbVRvQ0tXeXNpd3lnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEJ1aWxkR2VuZXJhbEVsZW1Ub0NLV3lzaXd5ZyhodG1sLCBjb250cm9sU2V0dGluZywgY29udHJvbFByb3BzLCBfaWZyYW1lKSB7XG4gICAgICBpZiAodGhpcy5WYWxpZGF0ZUJ1aWxkRW5hYmxlKGh0bWwsIGNvbnRyb2xTZXR0aW5nLCBjb250cm9sUHJvcHMsIF9pZnJhbWUpKSB7XG4gICAgICAgIGlmIChjb250cm9sU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSA9PSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUluc2VydEFjdGlvbk5hbWUpIHtcbiAgICAgICAgICB2YXIgZWxlbSA9IENLRURJVE9SLmRvbS5lbGVtZW50LmNyZWF0ZUZyb21IdG1sKGh0bWwpO1xuICAgICAgICAgIHRoaXMuU2VyaWFsaXplUHJvcHNUb0VsZW0oZWxlbSwgY29udHJvbFByb3BzLCBjb250cm9sU2V0dGluZyk7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmluc2VydEVsZW1lbnQoZWxlbSk7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LlNpbmdsZUVsZW1CaW5kRGVmYXVsdEV2ZW50KGVsZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzZWxlY3RlZEVsZW0gPSBDS0VkaXRvclV0aWxpdHkuR2V0U2VsZWN0ZWRDS0VkaXRvckVsZW0oKTtcblxuICAgICAgICAgIGlmIChzZWxlY3RlZEVsZW0pIHtcbiAgICAgICAgICAgIHZhciByZUZyZXNoRWxlbSA9IG5ldyBDS0VESVRPUi5kb20uZWxlbWVudC5jcmVhdGVGcm9tSHRtbChzZWxlY3RlZEVsZW0uZ2V0T3V0ZXJIdG1sKCkpO1xuXG4gICAgICAgICAgICBpZiAocmVGcmVzaEVsZW0uZ2V0QXR0cmlidXRlKFwiY29udHJvbF9jYXRlZ29yeVwiKSA9PSBcIklucHV0Q29udHJvbFwiKSB7XG4gICAgICAgICAgICAgIHZhciBuZXdUZXh0ID0gJChodG1sKS50ZXh0KCk7XG4gICAgICAgICAgICAgIHJlRnJlc2hFbGVtLnNldFRleHQobmV3VGV4dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGVjdGVkRWxlbS5jb3B5QXR0cmlidXRlcyhyZUZyZXNoRWxlbSwge1xuICAgICAgICAgICAgICB0ZW1wOiBcInRlbXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLlNlcmlhbGl6ZVByb3BzVG9FbGVtKHJlRnJlc2hFbGVtLCBjb250cm9sUHJvcHMsIGNvbnRyb2xTZXR0aW5nKTtcbiAgICAgICAgICAgIHJlRnJlc2hFbGVtLnJlcGxhY2Uoc2VsZWN0ZWRFbGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiVmFsaWRhdGVCdWlsZEVuYWJsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBWYWxpZGF0ZUJ1aWxkRW5hYmxlKGh0bWwsIGNvbnRyb2xTZXR0aW5nLCBjb250cm9sUHJvcHMsIF9pZnJhbWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJWYWxpZGF0ZVNlcmlhbGl6ZUNvbnRyb2xEaWFsb2dDb21wbGV0ZWRFbmFibGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gVmFsaWRhdGVTZXJpYWxpemVDb250cm9sRGlhbG9nQ29tcGxldGVkRW5hYmxlKHJldHVyblJlc3VsdCkge1xuICAgICAgaWYgKHJldHVyblJlc3VsdC5iYXNlSW5mby5zZXJpYWxpemUgPT0gXCJ0cnVlXCIgJiYgcmV0dXJuUmVzdWx0LmJpbmRUb0ZpZWxkLmZpZWxkTmFtZSA9PSBcIlwiKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuW6j+WIl+WMlueahOaOp+S7tuW/hemhu+e7keWumuWtl+autSFcIiwgbnVsbCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJldHVyblJlc3VsdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0RWxlbVByb3BzSW5FZGl0RGlhbG9nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldEVsZW1Qcm9wc0luRWRpdERpYWxvZyhpZnJhbWVPYmosIGFjdGlvbk5hbWUpIHtcbiAgICAgIHZhciBzZWwgPSBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JJbnN0KCkuZ2V0U2VsZWN0aW9uKCkuZ2V0U3RhcnRFbGVtZW50KCk7XG4gICAgICB2YXIgcGFyZW50cyA9IG51bGw7XG5cbiAgICAgIGlmIChzZWwpIHtcbiAgICAgICAgcGFyZW50cyA9IHNlbC5nZXRQYXJlbnRzKCk7XG4gICAgICB9XG5cbiAgICAgIGlmcmFtZU9iai5jb250ZW50V2luZG93LkRpYWxvZ0FwcC5yZWFkeShhY3Rpb25OYW1lLCBzZWwsIHBhcmVudHMpO1xuXG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PSB0aGlzLkRpYWxvZ0V4ZWN1dGVFZGl0QWN0aW9uTmFtZSkge1xuICAgICAgICB2YXIgZWxlbSA9IENLRWRpdG9yVXRpbGl0eS5HZXRTZWxlY3RlZEVsZW0oKS5vdXRlckhUTUwoKTtcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5EZXNlcmlhbGl6ZVByb3BzRnJvbUVsZW0oZWxlbSk7XG4gICAgICAgIGlmcmFtZU9iai5jb250ZW50V2luZG93LkRpYWxvZ0FwcC5zZXRDb250cm9sUHJvcHMoJChlbGVtKSwgcHJvcHMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRDb250cm9sRGVzY1RleHRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0Q29udHJvbERlc2NUZXh0KHBsdWdpblNldHRpbmcsIHByb3BzKSB7XG4gICAgICByZXR1cm4gXCJbXCIgKyBwbHVnaW5TZXR0aW5nLlRvb2xiYXJMYWJlbCArIFwiXSDnu5Hlrpo6W1wiICsgcHJvcHMuYmluZFRvRmllbGQudGFibGVDYXB0aW9uICsgXCItXCIgKyBwcm9wcy5iaW5kVG9GaWVsZC5maWVsZENhcHRpb24gKyBcIl1cIjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0U2VhcmNoQ29udHJvbERlc2NUZXh0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFNlYXJjaENvbnRyb2xEZXNjVGV4dChwbHVnaW5TZXR0aW5nLCBwcm9wcykge1xuICAgICAgcmV0dXJuIFwiW1wiICsgcGx1Z2luU2V0dGluZy5Ub29sYmFyTGFiZWwgKyBcIl0g57uR5a6aOltcIiArIHByb3BzLmJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbkNhcHRpb24gKyBcIl1cIjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0QXV0b1JlbW92ZVRpcExhYmVsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEF1dG9SZW1vdmVUaXBMYWJlbCh0aXBNc2cpIHtcbiAgICAgIGlmICghdGlwTXNnKSB7XG4gICAgICAgIHRpcE1zZyA9IFwi5Y+M5Ye757yW6L6R6K+l6YOo5Lu2XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPGRpdiBydW50aW1lX2F1dG9fcmVtb3ZlPVwidHJ1ZVwiIGNsYXNzPVwid3lzaXd5Zy1hdXRvLXJlbW92ZS10aXBcIj4nICsgdGlwTXNnICsgJzwvZGl2Pic7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlRyeUdldERhdGFTZXRJZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBUcnlHZXREYXRhU2V0SWQoc2VsLCBwYXJlbnRzKSB7XG4gICAgICBpZiAoc2VsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBwYXJlbnRzLmxlbmd0aCAtIDE7IGktLTsgaSA+PSAwKSB7XG4gICAgICAgICAgaWYgKHBhcmVudHNbaV0uZ2V0QXR0cmlidXRlKFwiZGF0YXNldGlkXCIpICE9IG51bGwgJiYgcGFyZW50c1tpXS5nZXRBdHRyaWJ1dGUoXCJkYXRhc2V0aWRcIikgIT0gXCJcIikge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocGFyZW50c1tpXS5nZXRBdHRyaWJ1dGUoXCJkYXRhc2V0aWRcIikpO1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudHNbaV0uZ2V0QXR0cmlidXRlKFwiZGF0YXNldGlkXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuZGF0YVNldElkKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cucGFyZW50Lmxpc3REZXNpZ24ubGlzdFJlc291cmNlRW50aXR5Lmxpc3REYXRhc2V0SWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDS0VkaXRvclBsdWdpblV0aWxpdHk7XG59KCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiUGx1Z2luc1NlcnZlckNvbmZpZ1wiLCB7fSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiUGx1Z2luc1wiLCB7fSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiRGVmYXVsdFByb3BzXCIsIHtcbiAgYmluZFRvRmllbGQ6IHtcbiAgICB0YWJsZUlkOiBcIlwiLFxuICAgIHRhYmxlTmFtZTogXCJcIixcbiAgICB0YWJsZUNhcHRpb246IFwiXCIsXG4gICAgZmllbGROYW1lOiBcIlwiLFxuICAgIGZpZWxkQ2FwdGlvbjogXCJcIixcbiAgICBmaWVsZERhdGFUeXBlOiBcIlwiLFxuICAgIGZpZWxkTGVuZ3RoOiBcIlwiXG4gIH0sXG4gIGRlZmF1bHRWYWx1ZToge1xuICAgIGRlZmF1bHRUeXBlOiBcIlwiLFxuICAgIGRlZmF1bHRWYWx1ZTogXCJcIixcbiAgICBkZWZhdWx0VGV4dDogXCJcIlxuICB9LFxuICB2YWxpZGF0ZVJ1bGVzOiB7XG4gICAgbXNnOiBcIlwiLFxuICAgIHJ1bGVzOiBbXVxuICB9LFxuICBiYXNlSW5mbzoge1xuICAgIGlkOiBcIlwiLFxuICAgIHNlcmlhbGl6ZTogXCJ0cnVlXCIsXG4gICAgbmFtZTogXCJcIixcbiAgICBjbGFzc05hbWU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiXCIsXG4gICAgcmVhZG9ubHk6IFwibm9yZWFkb25seVwiLFxuICAgIGRpc2FibGVkOiBcIm5vZGlzYWJsZWRcIixcbiAgICBzdHlsZTogXCJcIixcbiAgICBkZXNjOiBcIlwiXG4gIH0sXG4gIGJpbmRUb1NlYXJjaEZpZWxkOiB7XG4gICAgY29sdW1uVGl0bGU6IFwiXCIsXG4gICAgY29sdW1uVGFibGVOYW1lOiBcIlwiLFxuICAgIGNvbHVtbk5hbWU6IFwiXCIsXG4gICAgY29sdW1uQ2FwdGlvbjogXCJcIixcbiAgICBjb2x1bW5EYXRhVHlwZU5hbWU6IFwiXCIsXG4gICAgY29sdW1uT3BlcmF0b3I6IFwi5Yy56YWNXCJcbiAgfVxufSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiRGlhbG9nRXhlY3V0ZUVkaXRBY3Rpb25OYW1lXCIsIFwiRWRpdFwiKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgXCJEaWFsb2dFeGVjdXRlSW5zZXJ0QWN0aW9uTmFtZVwiLCBcIkluc2VydFwiKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgQ0tFZGl0b3JVdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDS0VkaXRvclV0aWxpdHkoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENLRWRpdG9yVXRpbGl0eSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ0tFZGl0b3JVdGlsaXR5LCBudWxsLCBbe1xuICAgIGtleTogXCJTZXRTZWxlY3RlZEVsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0U2VsZWN0ZWRFbGVtKGVsZW1IdG1sKSB7XG4gICAgICB0aGlzLl8kQ0tFZGl0b3JTZWxlY3RFbGVtID0gJChlbGVtSHRtbCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldFNlbGVjdGVkRWxlbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRTZWxlY3RlZEVsZW0oKSB7XG4gICAgICBpZiAodGhpcy5fJENLRWRpdG9yU2VsZWN0RWxlbSkge1xuICAgICAgICBpZiAodGhpcy5fJENLRWRpdG9yU2VsZWN0RWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuXyRDS0VkaXRvclNlbGVjdEVsZW07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldFNlbGVjdGVkQ0tFZGl0b3JFbGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFNlbGVjdGVkQ0tFZGl0b3JFbGVtKCkge1xuICAgICAgaWYgKHRoaXMuR2V0U2VsZWN0ZWRFbGVtKCkpIHtcbiAgICAgICAgdmFyIGlkID0gdGhpcy5HZXRTZWxlY3RlZEVsZW0oKS5hdHRyKFwiaWRcIik7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5HZXRDS0VkaXRvckluc3QoKS5kb2N1bWVudC5nZXRCeUlkKGlkKTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRDS0VkaXRvckluc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0Q0tFZGl0b3JJbnN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX0NLRWRpdG9ySW5zdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0Q0tFZGl0b3JJbnN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldENLRWRpdG9ySW5zdChpbnN0KSB7XG4gICAgICB0aGlzLl9DS0VkaXRvckluc3QgPSBpbnN0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRDS0VkaXRvckhUTUxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0Q0tFZGl0b3JIVE1MKCkge1xuICAgICAgdGhpcy5DbGVhckFMTEZvckRpdkVsZW1CdXR0b24oKTtcbiAgICAgIHJldHVybiB0aGlzLkdldENLRWRpdG9ySW5zdCgpLmdldERhdGEoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0Q0tFZGl0b3JIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldENLRWRpdG9ySFRNTChodG1sKSB7XG4gICAgICB0aGlzLkdldENLRWRpdG9ySW5zdCgpLnNldERhdGEoaHRtbCk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIENLRWRpdG9yVXRpbGl0eS5BTExFbGVtQmluZERlZmF1bHRFdmVudCgpO1xuICAgICAgfSwgNTAwKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiSW5pdGlhbGl6ZUNLRWRpdG9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEluaXRpYWxpemVDS0VkaXRvcih0ZXh0QXJlYUVsZW1JZCwgcGx1Z2luc0NvbmZpZywgbG9hZENvbXBsZXRlZEZ1bmMsIGNrZWRpdG9yQ29uZmlnRnVsbFBhdGgsIHBsdWdpbkJhc2VQYXRoLCB0aGVtZVZvKSB7XG4gICAgICBjb25zb2xlLmxvZyhwbHVnaW5zQ29uZmlnKTtcbiAgICAgIHZhciBleHRyYVBsdWdpbnMgPSBuZXcgQXJyYXkoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbHVnaW5zQ29uZmlnLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBzaW5nbGVQbHVnaW5Db25maWcgPSBwbHVnaW5zQ29uZmlnW2ldO1xuICAgICAgICB2YXIgc2luZ2xlTmFtZSA9IHNpbmdsZVBsdWdpbkNvbmZpZy5zaW5nbGVOYW1lO1xuICAgICAgICB2YXIgdG9vbGJhckxvY2F0aW9uID0gc2luZ2xlUGx1Z2luQ29uZmlnLnRvb2xiYXJMb2NhdGlvbjtcbiAgICAgICAgdmFyIHRleHQgPSBzaW5nbGVQbHVnaW5Db25maWcudGV4dDtcbiAgICAgICAgdmFyIHNlcnZlclJlc29sdmUgPSBzaW5nbGVQbHVnaW5Db25maWcuc2VydmVyUmVzb2x2ZTtcbiAgICAgICAgdmFyIGNsaWVudFJlc29sdmUgPSBzaW5nbGVQbHVnaW5Db25maWcuY2xpZW50UmVzb2x2ZTtcbiAgICAgICAgdmFyIGNsaWVudFJlc29sdmVKcyA9IHNpbmdsZVBsdWdpbkNvbmZpZy5jbGllbnRSZXNvbHZlSnM7XG4gICAgICAgIHZhciBkaWFsb2dXaWR0aCA9IHNpbmdsZVBsdWdpbkNvbmZpZy5kaWFsb2dXaWR0aDtcbiAgICAgICAgdmFyIGRpYWxvZ0hlaWdodCA9IHNpbmdsZVBsdWdpbkNvbmZpZy5kaWFsb2dIZWlnaHQ7XG4gICAgICAgIHZhciBpc0pCdWlsZDRERGF0YSA9IHNpbmdsZVBsdWdpbkNvbmZpZy5pc0pCdWlsZDRERGF0YTtcbiAgICAgICAgdmFyIGNvbnRyb2xDYXRlZ29yeSA9IHNpbmdsZVBsdWdpbkNvbmZpZy5jb250cm9sQ2F0ZWdvcnk7XG4gICAgICAgIHZhciBzZXJ2ZXJEeW5hbWljQmluZCA9IHNpbmdsZVBsdWdpbkNvbmZpZy5zZXJ2ZXJEeW5hbWljQmluZDtcbiAgICAgICAgdmFyIHNob3dSZW1vdmVCdXR0b24gPSBzaW5nbGVQbHVnaW5Db25maWcuc2hvd1JlbW92ZUJ1dHRvbjtcbiAgICAgICAgdmFyIHNob3dJbkVkaXRvclRvb2xiYXIgPSBzaW5nbGVQbHVnaW5Db25maWcuc2hvd0luRWRpdG9yVG9vbGJhcjtcbiAgICAgICAgdmFyIHBsdWdpbkZpbGVOYW1lID0gc2luZ2xlTmFtZSArIFwiUGx1Z2luLmpzXCI7XG4gICAgICAgIHZhciBwbHVnaW5Gb2xkZXJOYW1lID0gcGx1Z2luQmFzZVBhdGggKyBzaW5nbGVOYW1lICsgXCIvXCI7XG4gICAgICAgIENLRURJVE9SLnBsdWdpbnMuYWRkRXh0ZXJuYWwoc2luZ2xlTmFtZSwgcGx1Z2luRm9sZGVyTmFtZSwgcGx1Z2luRmlsZU5hbWUpO1xuICAgICAgICBleHRyYVBsdWdpbnMucHVzaChzaW5nbGVOYW1lKTtcbiAgICAgICAgQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkFkZFBsdWdpbnNTZXJ2ZXJDb25maWcoc2luZ2xlTmFtZSwgdG9vbGJhckxvY2F0aW9uLCB0ZXh0LCBjbGllbnRSZXNvbHZlLCBzZXJ2ZXJSZXNvbHZlLCBjbGllbnRSZXNvbHZlSnMsIGRpYWxvZ1dpZHRoLCBkaWFsb2dIZWlnaHQsIGlzSkJ1aWxkNEREYXRhLCBjb250cm9sQ2F0ZWdvcnksIHNlcnZlckR5bmFtaWNCaW5kLCBzaG93UmVtb3ZlQnV0dG9uLCBzaG93SW5FZGl0b3JUb29sYmFyKTtcbiAgICAgIH1cblxuICAgICAgY29uc29sZS5sb2codGhlbWVWbyk7XG4gICAgICB0aGlzLlNldFRoZW1lVm8odGhlbWVWbyk7XG4gICAgICB2YXIgZWRpdG9yQ29uZmlnVXJsID0gQmFzZVV0aWxpdHkuQXBwZW5kVGltZVN0YW1wVXJsKGNrZWRpdG9yQ29uZmlnRnVsbFBhdGgpO1xuICAgICAgQ0tFRElUT1IucmVwbGFjZSh0ZXh0QXJlYUVsZW1JZCwge1xuICAgICAgICBjdXN0b21Db25maWc6IGVkaXRvckNvbmZpZ1VybCxcbiAgICAgICAgZXh0cmFQbHVnaW5zOiBleHRyYVBsdWdpbnMuam9pbihcIixcIilcbiAgICAgIH0pO1xuICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzLmh0bWxfZGVzaWduLm9uKFwiYmVmb3JlUGFzdGVcIiwgZnVuY3Rpb24gKGV2ZW50KSB7fSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oXCJwYXN0ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgdmFyIHNvdXJjZUhUTUwgPSBldmVudC5kYXRhLmRhdGFWYWx1ZTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciAkc291cmNlSFRNTCA9ICQoc291cmNlSFRNTCk7XG4gICAgICAgICAgJHNvdXJjZUhUTUwuZmluZChcIi5kZWwtYnV0dG9uXCIpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgaWYgKCRzb3VyY2VIVE1MLmZpbmQoXCJkaXZcIikubGVuZ3RoID09IDEpIHtcbiAgICAgICAgICAgIGV2ZW50LmRhdGEuZGF0YVZhbHVlID0gJHNvdXJjZUhUTUwuZmluZChcImRpdlwiKS5vdXRlckhUTUwoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBldmVudC5kYXRhLmRhdGFWYWx1ZSA9IHNvdXJjZUhUTUw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzLmh0bWxfZGVzaWduLm9uKFwiYWZ0ZXJQYXN0ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LkFMTEVsZW1CaW5kRGVmYXVsdEV2ZW50KCk7XG4gICAgICB9KTtcbiAgICAgIENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbi5vbignaW5zZXJ0RWxlbWVudCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImluc2VydEVsZW1lbnRcIik7XG4gICAgICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgICAgIH0pO1xuICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzLmh0bWxfZGVzaWduLm9uKCdpbnNlcnRIdG1sJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0SHRtbFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgfSk7XG4gICAgICB0aGlzLlNldENLRWRpdG9ySW5zdChDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24pO1xuICAgICAgQ0tFRElUT1Iub24oJ2luc3RhbmNlUmVhZHknLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBpZiAodHlwZW9mIGxvYWRDb21wbGV0ZWRGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGxvYWRDb21wbGV0ZWRGdW5jKCk7XG4gICAgICAgICAgO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0VGhlbWVWb1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRUaGVtZVZvKCkge1xuICAgICAgcmV0dXJuIHRoaXMuX1RoZW1lVm87XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldFRoZW1lVm9cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0VGhlbWVWbyhfdGhlbWVWbykge1xuICAgICAgdGhpcy5fVGhlbWVWbyA9IF90aGVtZVZvO1xuICAgICAgdGhpcy5SZXNldFJvb3RFbGVtVGhlbWUoX3RoZW1lVm8pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJSZXNldFJvb3RFbGVtVGhlbWVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gUmVzZXRSb290RWxlbVRoZW1lKF90aGVtZVZvKSB7XG4gICAgICBpZiAodGhpcy5HZXRDS0VkaXRvckluc3QoKSkge1xuICAgICAgICB2YXIgc291cmNlSFRNTCA9IHRoaXMuR2V0Q0tFZGl0b3JIVE1MKCk7XG5cbiAgICAgICAgaWYgKHNvdXJjZUhUTUwgIT0gbnVsbCAmJiBzb3VyY2VIVE1MICE9IFwiXCIpIHtcbiAgICAgICAgICB2YXIgcm9vdEVsZW0gPSAkKHNvdXJjZUhUTUwpO1xuXG4gICAgICAgICAgaWYgKHJvb3RFbGVtLmF0dHIoXCJpc19jb250YWluZXJfcm9vdFwiKSAhPSBcInRydWVcIikge1xuICAgICAgICAgICAgcm9vdEVsZW0gPSAkKHNvdXJjZUhUTUwpLmZpbmQoXCJbaXNfY29udGFpbmVyX3Jvb3RdXCIpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChyb290RWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgY2xhc3NMaXN0ID0gcm9vdEVsZW0uYXR0cignY2xhc3MnKS5zcGxpdCgvXFxzKy8pO1xuICAgICAgICAgICAgdmFyIGNsYXNzYXJ5ID0gW107XG4gICAgICAgICAgICAkLmVhY2goY2xhc3NMaXN0LCBmdW5jdGlvbiAoaW5kZXgsIGl0ZW0pIHtcbiAgICAgICAgICAgICAgaWYgKGl0ZW0uaW5kZXhPZignaHRtbC1kZXNpZ24tdGhlbWUtJykgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJvb3RFbGVtLnJlbW92ZUNsYXNzKGl0ZW0pO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHJvb3RFbGVtLmFkZENsYXNzKF90aGVtZVZvLnJvb3RFbGVtQ2xhc3MpO1xuICAgICAgICAgICAgdGhpcy5TZXRDS0VkaXRvckhUTUwocm9vdEVsZW0ub3V0ZXJIVE1MKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJDbGVhckFMTEZvckRpdkVsZW1CdXR0b25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gQ2xlYXJBTExGb3JEaXZFbGVtQnV0dG9uKCkge1xuICAgICAgdmFyIG9sZERlbEJ1dHRvbnMgPSBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JJbnN0KCkuZG9jdW1lbnQuZmluZChcIi5kZWwtYnV0dG9uXCIpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9sZERlbEJ1dHRvbnMuY291bnQoKTsgaSsrKSB7XG4gICAgICAgIG9sZERlbEJ1dHRvbnMuZ2V0SXRlbShpKS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2luZ2xlRWxlbUJpbmREZWZhdWx0RXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2luZ2xlRWxlbUJpbmREZWZhdWx0RXZlbnQoZWxlbSkge1xuICAgICAgaWYgKGVsZW0uZ2V0QXR0cmlidXRlKFwic2hvd19yZW1vdmVfYnV0dG9uXCIpID09IFwidHJ1ZVwiKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVsZW0uZ2V0TmFtZSgpKTtcbiAgICAgICAgZWxlbS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmdldFNlbGVjdGlvbigpLnNlbGVjdEVsZW1lbnQodGhpcyk7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LlNldFNlbGVjdGVkRWxlbSh0aGlzLmdldE91dGVySHRtbCgpKTtcbiAgICAgICAgICBDS0VkaXRvclV0aWxpdHkuQ2xlYXJBTExGb3JEaXZFbGVtQnV0dG9uKCk7XG4gICAgICAgICAgdmFyIG5ld0RlbEJ1dHRvbiA9IG5ldyBDS0VESVRPUi5kb20uZWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgbmV3RGVsQnV0dG9uLmFkZENsYXNzKFwiZGVsLWJ1dHRvblwiKTtcbiAgICAgICAgICBlbGVtLmFwcGVuZChuZXdEZWxCdXR0b24pO1xuICAgICAgICAgIG5ld0RlbEJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbGVtLnJlbW92ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiQUxMRWxlbUJpbmREZWZhdWx0RXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gQUxMRWxlbUJpbmREZWZhdWx0RXZlbnQoKSB7XG4gICAgICBjb25zb2xlLmxvZyhDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JJbnN0KCkpO1xuICAgICAgdmFyIGVsZW1lbnRzID0gQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmRvY3VtZW50LmdldEJvZHkoKS5nZXRFbGVtZW50c0J5VGFnKCcqJyk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMuY291bnQoKTsgKytpKSB7XG4gICAgICAgIHZhciBlbGVtID0gZWxlbWVudHMuZ2V0SXRlbShpKTtcbiAgICAgICAgdGhpcy5TaW5nbGVFbGVtQmluZERlZmF1bHRFdmVudChlbGVtKTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ0tFZGl0b3JVdGlsaXR5O1xufSgpO1xuXG5fZGVmaW5lUHJvcGVydHkoQ0tFZGl0b3JVdGlsaXR5LCBcIl8kQ0tFZGl0b3JTZWxlY3RFbGVtXCIsIG51bGwpO1xuXG5fZGVmaW5lUHJvcGVydHkoQ0tFZGl0b3JVdGlsaXR5LCBcIl9DS0VkaXRvckluc3RcIiwgbnVsbCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclV0aWxpdHksIFwiX1RoZW1lVm9cIiwgbnVsbCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIEhUTUxFZGl0b3JVdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBIVE1MRWRpdG9yVXRpbGl0eSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSFRNTEVkaXRvclV0aWxpdHkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEhUTUxFZGl0b3JVdGlsaXR5LCBudWxsLCBbe1xuICAgIGtleTogXCJHZXRIVE1MRWRpdG9ySW5zdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRIVE1MRWRpdG9ySW5zdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9IVE1MRWRpdG9ySW5zdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0SFRNTEVkaXRvckhUTUxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0SFRNTEVkaXRvckhUTUwoaHRtbCkge1xuICAgICAgaWYgKCFTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkoaHRtbCkpIHtcbiAgICAgICAgdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLnNldFZhbHVlKGh0bWwpO1xuICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW1wic2VsZWN0QWxsXCJdKHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKSk7XG4gICAgICAgIHZhciByYW5nZSA9IHtcbiAgICAgICAgICBmcm9tOiB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKHRydWUpLFxuICAgICAgICAgIHRvOiB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKGZhbHNlKVxuICAgICAgICB9O1xuICAgICAgICA7XG4gICAgICAgIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5hdXRvRm9ybWF0UmFuZ2UocmFuZ2UuZnJvbSwgcmFuZ2UudG8pO1xuICAgICAgICB2YXIgYTEgPSB7XG4gICAgICAgICAgbGluZTogMCxcbiAgICAgICAgICBjaDogMlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuZ2V0RG9jKCkuZWFjaExpbmUoZnVuY3Rpb24gKGxpbmUpIHt9KTtcbiAgICAgICAgdmFyIHNlbGVjdGVkRWxlbSA9IENLRWRpdG9yVXRpbGl0eS5HZXRTZWxlY3RlZEVsZW0oKTtcbiAgICAgICAgdmFyIHNlYXJjaEhUTUwgPSBcIlwiO1xuXG4gICAgICAgIGlmIChzZWxlY3RlZEVsZW0pIHtcbiAgICAgICAgICBzZWFyY2hIVE1MID0gc2VsZWN0ZWRFbGVtLm91dGVySFRNTCgpLnNwbGl0KFwiPlwiKVswXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVwiKTtcbiAgICAgICAgdmFyIGN1cnNvciA9IHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXRTZWFyY2hDdXJzb3Ioc2VhcmNoSFRNTCk7XG4gICAgICAgIGN1cnNvci5maW5kTmV4dCgpO1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJzb3IpO1xuICAgICAgICBjb25zb2xlLmxvZyhjdXJzb3IuZnJvbSgpICsgXCJ8XCIgKyBjdXJzb3IudG8oKSk7XG5cbiAgICAgICAgaWYgKGN1cnNvci5mcm9tKCkgJiYgY3Vyc29yLnRvKCkpIHtcbiAgICAgICAgICB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuZ2V0RG9jKCkuc2V0U2VsZWN0aW9uKGN1cnNvci5mcm9tKCksIGN1cnNvci50bygpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRIdG1sRWRpdG9ySFRNTFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRIdG1sRWRpdG9ySFRNTCgpIHtcbiAgICAgIHJldHVybiB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuZ2V0VmFsdWUoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiSW5pdGlhbGl6ZUhUTUxDb2RlRGVzaWduXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEluaXRpYWxpemVIVE1MQ29kZURlc2lnbigpIHtcbiAgICAgIHZhciBtaXhlZE1vZGUgPSB7XG4gICAgICAgIG5hbWU6IFwiaHRtbG1peGVkXCIsXG4gICAgICAgIHNjcmlwdFR5cGVzOiBbe1xuICAgICAgICAgIG1hdGNoZXM6IC9cXC94LWhhbmRsZWJhcnMtdGVtcGxhdGV8XFwveC1tdXN0YWNoZS9pLFxuICAgICAgICAgIG1vZGU6IG51bGxcbiAgICAgICAgfSwge1xuICAgICAgICAgIG1hdGNoZXM6IC8odGV4dHxhcHBsaWNhdGlvbilcXC8oeC0pP3ZiKGF8c2NyaXB0KS9pLFxuICAgICAgICAgIG1vZGU6IFwidmJzY3JpcHRcIlxuICAgICAgICB9XVxuICAgICAgfTtcbiAgICAgIHRoaXMuX0hUTUxFZGl0b3JJbnN0ID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJUZXh0QXJlYUhUTUxFZGl0b3JcIiksIHtcbiAgICAgICAgbW9kZTogbWl4ZWRNb2RlLFxuICAgICAgICBzZWxlY3Rpb25Qb2ludGVyOiB0cnVlLFxuICAgICAgICB0aGVtZTogXCJtb25va2FpXCIsXG4gICAgICAgIGZvbGRHdXR0ZXI6IHRydWUsXG4gICAgICAgIGd1dHRlcnM6IFtcIkNvZGVNaXJyb3ItbGluZW51bWJlcnNcIiwgXCJDb2RlTWlycm9yLWZvbGRndXR0ZXJcIl0sXG4gICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWVcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9IVE1MRWRpdG9ySW5zdC5zZXRTaXplKFwiMTAwJVwiLCBQYWdlU3R5bGVVdGlsaXR5LkdldFdpbmRvd0hlaWdodCgpIC0gODUpO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBIVE1MRWRpdG9yVXRpbGl0eTtcbn0oKTtcblxuX2RlZmluZVByb3BlcnR5KEhUTUxFZGl0b3JVdGlsaXR5LCBcIl9IVE1MRWRpdG9ySW5zdFwiLCBudWxsKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgSnNFZGl0b3JVdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBKc0VkaXRvclV0aWxpdHkoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEpzRWRpdG9yVXRpbGl0eSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoSnNFZGl0b3JVdGlsaXR5LCBudWxsLCBbe1xuICAgIGtleTogXCJfR2V0TmV3Rm9ybUpzU3RyaW5nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIF9HZXROZXdGb3JtSnNTdHJpbmcoKSB7XG4gICAgICByZXR1cm4gXCI8c2NyaXB0PnZhciBGb3JtUGFnZU9iamVjdEluc3RhbmNlPXtcIiArIFwiZGF0YTp7XCIgKyBcInVzZXJFbnRpdHk6e30sXCIgKyBcImZvcm1FbnRpdHk6W10sXCIgKyBcImNvbmZpZzpbXVwiICsgXCJ9LFwiICsgXCJwYWdlUmVhZHk6ZnVuY3Rpb24oKXt9LFwiICsgXCJiaW5kUmVjb3JkRGF0YVJlYWR5OmZ1bmN0aW9uKCl7fSxcIiArIFwidmFsaWRhdGVFdmVyeUZyb21Db250cm9sOmZ1bmN0aW9uKGNvbnRyb2xPYmope31cIiArIFwifTwvc2NyaXB0PlwiO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRKc0VkaXRvckluc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0SnNFZGl0b3JJbnN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX0pzRWRpdG9ySW5zdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0SnNFZGl0b3JKc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRKc0VkaXRvckpzKGpzKSB7XG4gICAgICB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLnNldFZhbHVlKGpzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0SnNFZGl0b3JKc1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRKc0VkaXRvckpzKCkge1xuICAgICAgcmV0dXJuIHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuZ2V0VmFsdWUoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiSW5pdGlhbGl6ZUpzQ29kZURlc2lnblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBJbml0aWFsaXplSnNDb2RlRGVzaWduKHN0YXR1cykge1xuICAgICAgdGhpcy5fSnNFZGl0b3JJbnN0ID0gQ29kZU1pcnJvci5mcm9tVGV4dEFyZWEoJChcIiNUZXh0QXJlYUpzRWRpdG9yXCIpWzBdLCB7XG4gICAgICAgIG1vZGU6IFwiYXBwbGljYXRpb24vbGQranNvblwiLFxuICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlLFxuICAgICAgICBleHRyYUtleXM6IHtcbiAgICAgICAgICBcIkN0cmwtUVwiOiBmdW5jdGlvbiBDdHJsUShjbSkge1xuICAgICAgICAgICAgY20uZm9sZENvZGUoY20uZ2V0Q3Vyc29yKCkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZm9sZEd1dHRlcjogdHJ1ZSxcbiAgICAgICAgc21hcnRJbmRlbnQ6IHRydWUsXG4gICAgICAgIG1hdGNoQnJhY2tldHM6IHRydWUsXG4gICAgICAgIHRoZW1lOiBcIm1vbm9rYWlcIixcbiAgICAgICAgZ3V0dGVyczogW1wiQ29kZU1pcnJvci1saW5lbnVtYmVyc1wiLCBcIkNvZGVNaXJyb3ItZm9sZGd1dHRlclwiXVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX0pzRWRpdG9ySW5zdC5zZXRTaXplKFwiMTAwJVwiLCBQYWdlU3R5bGVVdGlsaXR5LkdldFdpbmRvd0hlaWdodCgpIC0gODUpO1xuXG4gICAgICBpZiAoc3RhdHVzID09IFwiYWRkXCIpIHtcbiAgICAgICAgdGhpcy5TZXRKc0VkaXRvckpzKHRoaXMuX0dldE5ld0Zvcm1Kc1N0cmluZygpKTtcbiAgICAgICAgQ29kZU1pcnJvci5jb21tYW5kc1tcInNlbGVjdEFsbFwiXSh0aGlzLkdldEpzRWRpdG9ySW5zdCgpKTtcbiAgICAgICAgdmFyIHJhbmdlID0ge1xuICAgICAgICAgIGZyb206IHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKHRydWUpLFxuICAgICAgICAgIHRvOiB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLmdldEN1cnNvcihmYWxzZSlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5HZXRKc0VkaXRvckluc3QoKS5hdXRvRm9ybWF0UmFuZ2UocmFuZ2UuZnJvbSwgcmFuZ2UudG8pO1xuICAgICAgfVxuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBKc0VkaXRvclV0aWxpdHk7XG59KCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShKc0VkaXRvclV0aWxpdHksIFwiX0pzRWRpdG9ySW5zdFwiLCBudWxsKTsiXX0=
