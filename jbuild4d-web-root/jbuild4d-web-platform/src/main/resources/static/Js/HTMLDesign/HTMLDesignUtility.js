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
      elem.setAttribute("is_jbuild4d_data", controlSetting.IsJBuild4DData);
      elem.setAttribute("control_category", controlSetting.ControlCategory);
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
            CKEditorUtility.SingleElemBindDefaultEvent(reFreshElem);
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
      return "[" + pluginSetting.ToolbarLabel + "] 绑定:[" + props.bindToSearchField.columnCaption + "](" + props.bindToSearchField.columnOperator + ")";
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
    key: "TryGetListButtonsInPluginPage",
    value: function TryGetListButtonsInPluginPage() {
      var buttons = [];
      var html = CKEditorUtility.GetCKEditorHTMLInPluginPage();
      var $buttons = $(html).find("[buttoncaption]");
      $buttons.each(function () {
        var buttonCaption = $(this).attr("buttoncaption");
        var buttonId = $(this).attr("id");
        buttons.push({
          buttonCaption: buttonCaption,
          buttonId: buttonId
        });
      });
      return buttons;
    }
  }, {
    key: "TryGetDataSetId",
    value: function TryGetDataSetId(sel, parents) {
      if (sel) {
        for (var i = parents.length - 1; i--; i >= 0) {
          if (parents[i].getAttribute("datasetid") != null && parents[i].getAttribute("datasetid") != "") {
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
    custReadonly: "noreadonly",
    custDisabled: "nodisabled",
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
    key: "GetCKEditorHTMLInPluginPage",
    value: function GetCKEditorHTMLInPluginPage() {
      return window.parent.CKEditorUtility.GetCKEditorHTML();
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
        var serverDynamicBind = singlePluginConfig.serverDynamicBind;
        var showRemoveButton = singlePluginConfig.showRemoveButton;
        var showInEditorToolbar = singlePluginConfig.showInEditorToolbar;
        var pluginFileName = singleName + "Plugin.js";
        var pluginFolderName = pluginBasePath + singleName + "/";
        CKEDITOR.plugins.addExternal(singleName, pluginFolderName, pluginFileName);
        extraPlugins.push(singleName);
        CKEditorPluginUtility.AddPluginsServerConfig(singleName, toolbarLocation, text, clientResolve, serverResolve, clientResolveJs, dialogWidth, dialogHeight, isJBuild4DData, controlCategory, serverDynamicBind, showRemoveButton, showInEditorToolbar);
      }

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
        elem.on('click', function () {
          CKEditorUtility.GetCKEditorInst().getSelection().selectElement(this);
          CKEditorUtility.SetSelectedElem(this.getOuterHtml());
          CKEditorUtility.ClearALLForDivElemButton();
          var newDelButton = new CKEDITOR.dom.element('div');
          newDelButton.addClass("del-button");
          elem.append(newDelButton);
          newDelButton.on('click', function (ev) {
            elem.remove();
            var domEvent = ev.data;
            domEvent.preventDefault();
            domEvent.stopPropagation();
          });
        });
      }
    }
  }, {
    key: "ALLElemBindDefaultEvent",
    value: function ALLElemBindDefaultEvent() {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNLRWRpdG9yUGx1Z2luVXRpbGl0eS5qcyIsIkNLRWRpdG9yVXRpbGl0eS5qcyIsIkhUTUxFZGl0b3JVdGlsaXR5LmpzIiwiSnNFZGl0b3JVdGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkhUTUxEZXNpZ25VdGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIENLRWRpdG9yUGx1Z2luVXRpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDS0VkaXRvclBsdWdpblV0aWxpdHkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiQWRkUGx1Z2luc1NlcnZlckNvbmZpZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBBZGRQbHVnaW5zU2VydmVyQ29uZmlnKHNpbmdsZU5hbWUsIHRvb2xiYXJMb2NhdGlvbiwgdGV4dCwgY2xpZW50UmVzb2x2ZSwgc2VydmVyUmVzb2x2ZSwgY2xpZW50UmVzb2x2ZUpzLCBkaWFsb2dXaWR0aCwgZGlhbG9nSGVpZ2h0LCBpc0pCdWlsZDRERGF0YSwgY29udHJvbENhdGVnb3J5LCBzZXJ2ZXJEeW5hbWljQmluZCwgc2hvd1JlbW92ZUJ1dHRvbiwgc2hvd0luRWRpdG9yVG9vbGJhcikge1xuICAgICAgdGhpcy5QbHVnaW5zU2VydmVyQ29uZmlnW3NpbmdsZU5hbWVdID0ge1xuICAgICAgICBTaW5nbGVOYW1lOiBzaW5nbGVOYW1lLFxuICAgICAgICBUb29sYmFyTG9jYXRpb246IHRvb2xiYXJMb2NhdGlvbixcbiAgICAgICAgVG9vbGJhckxhYmVsOiB0ZXh0LFxuICAgICAgICBDbGllbnRSZXNvbHZlOiBjbGllbnRSZXNvbHZlLFxuICAgICAgICBTZXJ2ZXJSZXNvbHZlOiBzZXJ2ZXJSZXNvbHZlLFxuICAgICAgICBDbGllbnRSZXNvbHZlSnM6IGNsaWVudFJlc29sdmVKcyxcbiAgICAgICAgRGlhbG9nV2lkdGg6IGRpYWxvZ1dpZHRoLFxuICAgICAgICBEaWFsb2dIZWlnaHQ6IGRpYWxvZ0hlaWdodCxcbiAgICAgICAgSXNKQnVpbGQ0RERhdGE6IGlzSkJ1aWxkNEREYXRhLFxuICAgICAgICBDb250cm9sQ2F0ZWdvcnk6IGNvbnRyb2xDYXRlZ29yeSxcbiAgICAgICAgU2VydmVyRHluYW1pY0JpbmQ6IHNlcnZlckR5bmFtaWNCaW5kLFxuICAgICAgICBTaG93UmVtb3ZlQnV0dG9uOiBzaG93UmVtb3ZlQnV0dG9uLFxuICAgICAgICBTaG93SW5FZGl0b3JUb29sYmFyOiBzaG93SW5FZGl0b3JUb29sYmFyXG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfVXNlU2VydmVyQ29uZmlnQ292ZXJFbXB0eVBsdWdpblByb3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX1VzZVNlcnZlckNvbmZpZ0NvdmVyRW1wdHlQbHVnaW5Qcm9wKG9iaikge1xuICAgICAgdmFyIGNvdmVyT2JqID0gdGhpcy5QbHVnaW5zU2VydmVyQ29uZmlnW29iai5TaW5nbGVOYW1lXTtcblxuICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpbcHJvcF0gIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBcIlwiIHx8IG9ialtwcm9wXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY292ZXJPYmpbcHJvcF0pIHtcbiAgICAgICAgICAgICAgb2JqW3Byb3BdID0gY292ZXJPYmpbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEdlbmVyYWxQbHVnaW5JbnN0YW5jZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRHZW5lcmFsUGx1Z2luSW5zdGFuY2UocGx1Z2luU2luZ2xlTmFtZSwgZXhDb25maWcpIHtcbiAgICAgIHZhciBkZWZhdWx0U2V0dGluZyA9IHtcbiAgICAgICAgU2luZ2xlTmFtZTogcGx1Z2luU2luZ2xlTmFtZSxcbiAgICAgICAgRGlhbG9nTmFtZTogJycsXG4gICAgICAgIERpYWxvZ1dpZHRoOiBudWxsLFxuICAgICAgICBEaWFsb2dIZWlnaHQ6IG51bGwsXG4gICAgICAgIERpYWxvZ1BhZ2VVcmw6IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybCgnRGlhbG9nLmh0bWwnKSxcbiAgICAgICAgRGlhbG9nVGl0bGU6IFwiRElWXCIsXG4gICAgICAgIFRvb2xiYXJDb21tYW5kOiAnJyxcbiAgICAgICAgVG9vbGJhckljb246ICdJY29uLnBuZycsXG4gICAgICAgIFRvb2xiYXJMYWJlbDogXCJcIixcbiAgICAgICAgVG9vbGJhckxvY2F0aW9uOiAnJyxcbiAgICAgICAgSUZyYW1lV2luZG93OiBudWxsLFxuICAgICAgICBJRnJhbWVFeGVjdXRlQWN0aW9uTmFtZTogXCJJbnNlcnRcIixcbiAgICAgICAgRGVzaWduTW9kYWxJbnB1dENzczogXCJcIixcbiAgICAgICAgQ2xpZW50UmVzb2x2ZTogXCJcIixcbiAgICAgICAgU2VydmVyUmVzb2x2ZTogXCJcIixcbiAgICAgICAgSXNKQnVpbGQ0RERhdGE6IFwiXCIsXG4gICAgICAgIENvbnRyb2xDYXRlZ29yeTogXCJcIixcbiAgICAgICAgU2VydmVyRHluYW1pY0JpbmQ6IFwiXCIsXG4gICAgICAgIFNob3dSZW1vdmVCdXR0b246IFwiXCIsXG4gICAgICAgIFNob3dJbkVkaXRvclRvb2xiYXI6IFwiXCJcbiAgICAgIH07XG4gICAgICBkZWZhdWx0U2V0dGluZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0U2V0dGluZywgZXhDb25maWcpO1xuICAgICAgZGVmYXVsdFNldHRpbmcgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuX1VzZVNlcnZlckNvbmZpZ0NvdmVyRW1wdHlQbHVnaW5Qcm9wKGRlZmF1bHRTZXR0aW5nKTtcbiAgICAgIGRlZmF1bHRTZXR0aW5nLkRpYWxvZ05hbWUgPSBkZWZhdWx0U2V0dGluZy5TaW5nbGVOYW1lO1xuICAgICAgZGVmYXVsdFNldHRpbmcuVG9vbGJhckNvbW1hbmQgPSBcIkpCdWlsZDRELkZvcm1EZXNpZ24uUGx1Z2lucy5cIiArIGRlZmF1bHRTZXR0aW5nLlNpbmdsZU5hbWU7XG4gICAgICBkZWZhdWx0U2V0dGluZy5EaWFsb2dTZXR0aW5nVGl0bGUgPSBkZWZhdWx0U2V0dGluZy5Ub29sYmFyTGFiZWwgKyBcIldlYuaOp+S7tlwiO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgU2V0dGluZzogZGVmYXVsdFNldHRpbmdcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlJlZ0dlbmVyYWxQbHVnaW5Ub0VkaXRvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBSZWdHZW5lcmFsUGx1Z2luVG9FZGl0b3IoY2tFZGl0b3IsIHBhdGgsIHBsdWdpblNldHRpbmcsIG9rRnVuYykge1xuICAgICAgQ0tFRElUT1IuZGlhbG9nLmFkZElmcmFtZShwbHVnaW5TZXR0aW5nLkRpYWxvZ05hbWUsIHBsdWdpblNldHRpbmcuRGlhbG9nU2V0dGluZ1RpdGxlLCBwYXRoICsgcGx1Z2luU2V0dGluZy5EaWFsb2dQYWdlVXJsLCBwbHVnaW5TZXR0aW5nLkRpYWxvZ1dpZHRoLCBwbHVnaW5TZXR0aW5nLkRpYWxvZ0hlaWdodCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5fLmZyYW1lSWQpO1xuICAgICAgICBwbHVnaW5TZXR0aW5nLklGcmFtZVdpbmRvdyA9IGlmcmFtZTtcbiAgICAgICAgQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LlNldEVsZW1Qcm9wc0luRWRpdERpYWxvZyhwbHVnaW5TZXR0aW5nLklGcmFtZVdpbmRvdywgcGx1Z2luU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSk7XG4gICAgICB9LCB7XG4gICAgICAgIG9uT2s6IGZ1bmN0aW9uIG9uT2soKSB7XG4gICAgICAgICAgdmFyIHByb3BzID0gcGx1Z2luU2V0dGluZy5JRnJhbWVXaW5kb3cuY29udGVudFdpbmRvdy5EaWFsb2dBcHAuZ2V0Q29udHJvbFByb3BzKCk7XG5cbiAgICAgICAgICBpZiAocHJvcHMuc3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9rRnVuYyhja0VkaXRvciwgcGx1Z2luU2V0dGluZywgcHJvcHMsIHBsdWdpblNldHRpbmcuSUZyYW1lV2luZG93LmNvbnRlbnRXaW5kb3cpO1xuICAgICAgICAgIHBsdWdpblNldHRpbmcuSUZyYW1lRXhlY3V0ZUFjdGlvbk5hbWUgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUluc2VydEFjdGlvbk5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2FuY2VsOiBmdW5jdGlvbiBvbkNhbmNlbCgpIHtcbiAgICAgICAgICBwbHVnaW5TZXR0aW5nLklGcmFtZUV4ZWN1dGVBY3Rpb25OYW1lID0gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkRpYWxvZ0V4ZWN1dGVJbnNlcnRBY3Rpb25OYW1lO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNrRWRpdG9yLmFkZENvbW1hbmQocGx1Z2luU2V0dGluZy5Ub29sYmFyQ29tbWFuZCwgbmV3IENLRURJVE9SLmRpYWxvZ0NvbW1hbmQocGx1Z2luU2V0dGluZy5EaWFsb2dOYW1lKSk7XG5cbiAgICAgIGlmIChwbHVnaW5TZXR0aW5nLlNob3dJbkVkaXRvclRvb2xiYXIgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgY2tFZGl0b3IudWkuYWRkQnV0dG9uKHBsdWdpblNldHRpbmcuU2luZ2xlTmFtZSwge1xuICAgICAgICAgIGxhYmVsOiBwbHVnaW5TZXR0aW5nLlRvb2xiYXJMYWJlbCxcbiAgICAgICAgICBpY29uOiBwYXRoICsgcGx1Z2luU2V0dGluZy5Ub29sYmFySWNvbixcbiAgICAgICAgICBjb21tYW5kOiBwbHVnaW5TZXR0aW5nLlRvb2xiYXJDb21tYW5kLFxuICAgICAgICAgIHRvb2xiYXI6IHBsdWdpblNldHRpbmcuVG9vbGJhckxvY2F0aW9uXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBja0VkaXRvci5vbignZG91YmxlY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcGx1Z2luU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSA9IENLRWRpdG9yUGx1Z2luVXRpbGl0eS5EaWFsb2dFeGVjdXRlRWRpdEFjdGlvbk5hbWU7XG4gICAgICAgIENLRWRpdG9yUGx1Z2luVXRpbGl0eS5PbkNLV3lzaXd5Z0VsZW1EQkNsaWNrRXZlbnQoZXZlbnQsIHBsdWdpblNldHRpbmcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIk9uQ0tXeXNpd3lnRWxlbURCQ2xpY2tFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBPbkNLV3lzaXd5Z0VsZW1EQkNsaWNrRXZlbnQoZXZlbnQsIGNvbnRyb2xTZXR0aW5nKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IGV2ZW50LmRhdGEuZWxlbWVudDtcblxuICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicnVudGltZV9hdXRvX3JlbW92ZVwiKSA9PSBcInRydWVcIikge1xuICAgICAgICBlbGVtZW50ID0gZXZlbnQuZGF0YS5lbGVtZW50LmdldFBhcmVudCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2luZ2xlTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwic2luZ2xlTmFtZVwiKTtcblxuICAgICAgaWYgKHNpbmdsZU5hbWUgPT0gY29udHJvbFNldHRpbmcuU2luZ2xlTmFtZSkge1xuICAgICAgICBDS0VkaXRvclV0aWxpdHkuU2V0U2VsZWN0ZWRFbGVtKGVsZW1lbnQuZ2V0T3V0ZXJIdG1sKCkpO1xuICAgICAgICBldmVudC5kYXRhLmRpYWxvZyA9IGNvbnRyb2xTZXR0aW5nLkRpYWxvZ05hbWU7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNlcmlhbGl6ZVByb3BzVG9FbGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNlcmlhbGl6ZVByb3BzVG9FbGVtKGVsZW0sIHByb3BzLCBjb250cm9sU2V0dGluZykge1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJqYnVpbGQ0ZF9jdXN0b21cIiwgXCJ0cnVlXCIpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJzaW5nbGVuYW1lXCIsIGNvbnRyb2xTZXR0aW5nLlNpbmdsZU5hbWUpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJpc19qYnVpbGQ0ZF9kYXRhXCIsIGNvbnRyb2xTZXR0aW5nLklzSkJ1aWxkNEREYXRhKTtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwiY29udHJvbF9jYXRlZ29yeVwiLCBjb250cm9sU2V0dGluZy5Db250cm9sQ2F0ZWdvcnkpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJzaG93X3JlbW92ZV9idXR0b25cIiwgY29udHJvbFNldHRpbmcuU2hvd1JlbW92ZUJ1dHRvbik7XG5cbiAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImJhc2VJbmZvXCJdKSB7XG4gICAgICAgICAgaWYgKGtleSA9PSBcInJlYWRvbmx5XCIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0gPT0gXCJyZWFkb25seVwiKSB7XG4gICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJyZWFkb25seVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGtleSA9PSBcImRpc2FibGVkXCIpIHtcbiAgICAgICAgICAgIGlmIChwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0gPT0gXCJkaXNhYmxlZFwiKSB7XG4gICAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImJhc2VJbmZvXCJdW2tleV0pO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoXCJkaXNhYmxlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wc1tcImJpbmRUb0ZpZWxkXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImJpbmRUb0ZpZWxkXCJdKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmluZFRvRmllbGRcIl1ba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzW1wiZGVmYXVsdFZhbHVlXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImRlZmF1bHRWYWx1ZVwiXSkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImRlZmF1bHRWYWx1ZVwiXVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHNbXCJ2YWxpZGF0ZVJ1bGVzXCJdKSB7XG4gICAgICAgIGlmIChwcm9wc1tcInZhbGlkYXRlUnVsZXNcIl0ucnVsZXMpIHtcbiAgICAgICAgICBpZiAocHJvcHNbXCJ2YWxpZGF0ZVJ1bGVzXCJdLnJ1bGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwidmFsaWRhdGVydWxlc1wiLCBlbmNvZGVVUklDb21wb25lbnQoSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nKHByb3BzW1widmFsaWRhdGVSdWxlc1wiXSkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzW1wibm9ybWFsUHJvcHNcIl0pIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzW1wibm9ybWFsUHJvcHNcIl0pIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShrZXkudG9Mb2NhbGVMb3dlckNhc2UoKSwgcHJvcHNbXCJub3JtYWxQcm9wc1wiXVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHNbXCJiaW5kVG9TZWFyY2hGaWVsZFwiXSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNbXCJiaW5kVG9TZWFyY2hGaWVsZFwiXSkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcImJpbmRUb1NlYXJjaEZpZWxkXCJdW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBlbGVtO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJEZXNlcmlhbGl6ZVByb3BzRnJvbUVsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gRGVzZXJpYWxpemVQcm9wc0Zyb21FbGVtKGVsZW0pIHtcbiAgICAgIHZhciBwcm9wcyA9IHt9O1xuICAgICAgdmFyICRlbGVtID0gJChlbGVtKTtcblxuICAgICAgZnVuY3Rpb24gYXR0clRvUHJvcChwcm9wcywgZ3JvdXBOYW1lKSB7XG4gICAgICAgIHZhciBncm91cFByb3AgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy5EZWZhdWx0UHJvcHNbZ3JvdXBOYW1lXSkge1xuICAgICAgICAgIGlmICgkZWxlbS5hdHRyKGtleSkpIHtcbiAgICAgICAgICAgIGdyb3VwUHJvcFtrZXldID0gJGVsZW0uYXR0cihrZXkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBncm91cFByb3Bba2V5XSA9IHRoaXMuRGVmYXVsdFByb3BzW2dyb3VwTmFtZV1ba2V5XTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm9wc1tncm91cE5hbWVdID0gZ3JvdXBQcm9wO1xuICAgICAgICByZXR1cm4gcHJvcHM7XG4gICAgICB9XG5cbiAgICAgIHByb3BzID0gYXR0clRvUHJvcC5jYWxsKHRoaXMsIHByb3BzLCBcImJhc2VJbmZvXCIpO1xuICAgICAgcHJvcHMgPSBhdHRyVG9Qcm9wLmNhbGwodGhpcywgcHJvcHMsIFwiYmluZFRvRmllbGRcIik7XG4gICAgICBwcm9wcyA9IGF0dHJUb1Byb3AuY2FsbCh0aGlzLCBwcm9wcywgXCJkZWZhdWx0VmFsdWVcIik7XG4gICAgICBwcm9wcyA9IGF0dHJUb1Byb3AuY2FsbCh0aGlzLCBwcm9wcywgXCJiaW5kVG9TZWFyY2hGaWVsZFwiKTtcblxuICAgICAgaWYgKCRlbGVtLmF0dHIoXCJ2YWxpZGF0ZVJ1bGVzXCIpKSB7XG4gICAgICAgIHByb3BzLnZhbGlkYXRlUnVsZXMgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oZGVjb2RlVVJJQ29tcG9uZW50KCRlbGVtLmF0dHIoXCJ2YWxpZGF0ZVJ1bGVzXCIpKSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9wcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiQnVpbGRHZW5lcmFsRWxlbVRvQ0tXeXNpd3lnXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEJ1aWxkR2VuZXJhbEVsZW1Ub0NLV3lzaXd5ZyhodG1sLCBjb250cm9sU2V0dGluZywgY29udHJvbFByb3BzLCBfaWZyYW1lKSB7XG4gICAgICBpZiAodGhpcy5WYWxpZGF0ZUJ1aWxkRW5hYmxlKGh0bWwsIGNvbnRyb2xTZXR0aW5nLCBjb250cm9sUHJvcHMsIF9pZnJhbWUpKSB7XG4gICAgICAgIGlmIChjb250cm9sU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSA9PSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUluc2VydEFjdGlvbk5hbWUpIHtcbiAgICAgICAgICB2YXIgZWxlbSA9IENLRURJVE9SLmRvbS5lbGVtZW50LmNyZWF0ZUZyb21IdG1sKGh0bWwpO1xuICAgICAgICAgIHRoaXMuU2VyaWFsaXplUHJvcHNUb0VsZW0oZWxlbSwgY29udHJvbFByb3BzLCBjb250cm9sU2V0dGluZyk7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmluc2VydEVsZW1lbnQoZWxlbSk7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LlNpbmdsZUVsZW1CaW5kRGVmYXVsdEV2ZW50KGVsZW0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBzZWxlY3RlZEVsZW0gPSBDS0VkaXRvclV0aWxpdHkuR2V0U2VsZWN0ZWRDS0VkaXRvckVsZW0oKTtcblxuICAgICAgICAgIGlmIChzZWxlY3RlZEVsZW0pIHtcbiAgICAgICAgICAgIHZhciByZUZyZXNoRWxlbSA9IG5ldyBDS0VESVRPUi5kb20uZWxlbWVudC5jcmVhdGVGcm9tSHRtbChzZWxlY3RlZEVsZW0uZ2V0T3V0ZXJIdG1sKCkpO1xuXG4gICAgICAgICAgICBpZiAocmVGcmVzaEVsZW0uZ2V0QXR0cmlidXRlKFwiY29udHJvbF9jYXRlZ29yeVwiKSA9PSBcIklucHV0Q29udHJvbFwiKSB7XG4gICAgICAgICAgICAgIHZhciBuZXdUZXh0ID0gJChodG1sKS50ZXh0KCk7XG4gICAgICAgICAgICAgIHJlRnJlc2hFbGVtLnNldFRleHQobmV3VGV4dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHNlbGVjdGVkRWxlbS5jb3B5QXR0cmlidXRlcyhyZUZyZXNoRWxlbSwge1xuICAgICAgICAgICAgICB0ZW1wOiBcInRlbXBcIlxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB0aGlzLlNlcmlhbGl6ZVByb3BzVG9FbGVtKHJlRnJlc2hFbGVtLCBjb250cm9sUHJvcHMsIGNvbnRyb2xTZXR0aW5nKTtcbiAgICAgICAgICAgIHJlRnJlc2hFbGVtLnJlcGxhY2Uoc2VsZWN0ZWRFbGVtKTtcbiAgICAgICAgICAgIENLRWRpdG9yVXRpbGl0eS5TaW5nbGVFbGVtQmluZERlZmF1bHRFdmVudChyZUZyZXNoRWxlbSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlZhbGlkYXRlQnVpbGRFbmFibGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gVmFsaWRhdGVCdWlsZEVuYWJsZShodG1sLCBjb250cm9sU2V0dGluZywgY29udHJvbFByb3BzLCBfaWZyYW1lKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiVmFsaWRhdGVTZXJpYWxpemVDb250cm9sRGlhbG9nQ29tcGxldGVkRW5hYmxlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFZhbGlkYXRlU2VyaWFsaXplQ29udHJvbERpYWxvZ0NvbXBsZXRlZEVuYWJsZShyZXR1cm5SZXN1bHQpIHtcbiAgICAgIGlmIChyZXR1cm5SZXN1bHQuYmFzZUluZm8uc2VyaWFsaXplID09IFwidHJ1ZVwiICYmIHJldHVyblJlc3VsdC5iaW5kVG9GaWVsZC5maWVsZE5hbWUgPT0gXCJcIikge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLluo/liJfljJbnmoTmjqfku7blv4Xpobvnu5HlrprlrZfmrrUhXCIsIG51bGwpO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHN1Y2Nlc3M6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXR1cm5SZXN1bHQ7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldEVsZW1Qcm9wc0luRWRpdERpYWxvZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRFbGVtUHJvcHNJbkVkaXREaWFsb2coaWZyYW1lT2JqLCBhY3Rpb25OYW1lKSB7XG4gICAgICB2YXIgc2VsID0gQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmdldFNlbGVjdGlvbigpLmdldFN0YXJ0RWxlbWVudCgpO1xuICAgICAgdmFyIHBhcmVudHMgPSBudWxsO1xuXG4gICAgICBpZiAoc2VsKSB7XG4gICAgICAgIHBhcmVudHMgPSBzZWwuZ2V0UGFyZW50cygpO1xuICAgICAgfVxuXG4gICAgICBpZnJhbWVPYmouY29udGVudFdpbmRvdy5EaWFsb2dBcHAucmVhZHkoYWN0aW9uTmFtZSwgc2VsLCBwYXJlbnRzKTtcblxuICAgICAgaWYgKGFjdGlvbk5hbWUgPT0gdGhpcy5EaWFsb2dFeGVjdXRlRWRpdEFjdGlvbk5hbWUpIHtcbiAgICAgICAgdmFyIGVsZW0gPSBDS0VkaXRvclV0aWxpdHkuR2V0U2VsZWN0ZWRFbGVtKCkub3V0ZXJIVE1MKCk7XG4gICAgICAgIHZhciBwcm9wcyA9IHRoaXMuRGVzZXJpYWxpemVQcm9wc0Zyb21FbGVtKGVsZW0pO1xuICAgICAgICBpZnJhbWVPYmouY29udGVudFdpbmRvdy5EaWFsb2dBcHAuc2V0Q29udHJvbFByb3BzKCQoZWxlbSksIHByb3BzKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0Q29udHJvbERlc2NUZXh0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldENvbnRyb2xEZXNjVGV4dChwbHVnaW5TZXR0aW5nLCBwcm9wcykge1xuICAgICAgcmV0dXJuIFwiW1wiICsgcGx1Z2luU2V0dGluZy5Ub29sYmFyTGFiZWwgKyBcIl0g57uR5a6aOltcIiArIHByb3BzLmJpbmRUb0ZpZWxkLnRhYmxlQ2FwdGlvbiArIFwiLVwiICsgcHJvcHMuYmluZFRvRmllbGQuZmllbGRDYXB0aW9uICsgXCJdXCI7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldFNlYXJjaENvbnRyb2xEZXNjVGV4dFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRTZWFyY2hDb250cm9sRGVzY1RleHQocGx1Z2luU2V0dGluZywgcHJvcHMpIHtcbiAgICAgIHJldHVybiBcIltcIiArIHBsdWdpblNldHRpbmcuVG9vbGJhckxhYmVsICsgXCJdIOe7keWumjpbXCIgKyBwcm9wcy5iaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5DYXB0aW9uICsgXCJdKFwiICsgcHJvcHMuYmluZFRvU2VhcmNoRmllbGQuY29sdW1uT3BlcmF0b3IgKyBcIilcIjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0QXV0b1JlbW92ZVRpcExhYmVsXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEF1dG9SZW1vdmVUaXBMYWJlbCh0aXBNc2cpIHtcbiAgICAgIGlmICghdGlwTXNnKSB7XG4gICAgICAgIHRpcE1zZyA9IFwi5Y+M5Ye757yW6L6R6K+l6YOo5Lu2XCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPGRpdiBydW50aW1lX2F1dG9fcmVtb3ZlPVwidHJ1ZVwiIGNsYXNzPVwid3lzaXd5Zy1hdXRvLXJlbW92ZS10aXBcIj4nICsgdGlwTXNnICsgJzwvZGl2Pic7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlRyeUdldExpc3RCdXR0b25zSW5QbHVnaW5QYWdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFRyeUdldExpc3RCdXR0b25zSW5QbHVnaW5QYWdlKCkge1xuICAgICAgdmFyIGJ1dHRvbnMgPSBbXTtcbiAgICAgIHZhciBodG1sID0gQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySFRNTEluUGx1Z2luUGFnZSgpO1xuICAgICAgdmFyICRidXR0b25zID0gJChodG1sKS5maW5kKFwiW2J1dHRvbmNhcHRpb25dXCIpO1xuICAgICAgJGJ1dHRvbnMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBidXR0b25DYXB0aW9uID0gJCh0aGlzKS5hdHRyKFwiYnV0dG9uY2FwdGlvblwiKTtcbiAgICAgICAgdmFyIGJ1dHRvbklkID0gJCh0aGlzKS5hdHRyKFwiaWRcIik7XG4gICAgICAgIGJ1dHRvbnMucHVzaCh7XG4gICAgICAgICAgYnV0dG9uQ2FwdGlvbjogYnV0dG9uQ2FwdGlvbixcbiAgICAgICAgICBidXR0b25JZDogYnV0dG9uSWRcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBidXR0b25zO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJUcnlHZXREYXRhU2V0SWRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gVHJ5R2V0RGF0YVNldElkKHNlbCwgcGFyZW50cykge1xuICAgICAgaWYgKHNlbCkge1xuICAgICAgICBmb3IgKHZhciBpID0gcGFyZW50cy5sZW5ndGggLSAxOyBpLS07IGkgPj0gMCkge1xuICAgICAgICAgIGlmIChwYXJlbnRzW2ldLmdldEF0dHJpYnV0ZShcImRhdGFzZXRpZFwiKSAhPSBudWxsICYmIHBhcmVudHNbaV0uZ2V0QXR0cmlidXRlKFwiZGF0YXNldGlkXCIpICE9IFwiXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBwYXJlbnRzW2ldLmdldEF0dHJpYnV0ZShcImRhdGFzZXRpZFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCF0aGlzLmRhdGFTZXRJZCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnBhcmVudC5saXN0RGVzaWduLmxpc3RSZXNvdXJjZUVudGl0eS5saXN0RGF0YXNldElkO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5O1xufSgpO1xuXG5fZGVmaW5lUHJvcGVydHkoQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LCBcIlBsdWdpbnNTZXJ2ZXJDb25maWdcIiwge30pO1xuXG5fZGVmaW5lUHJvcGVydHkoQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LCBcIlBsdWdpbnNcIiwge30pO1xuXG5fZGVmaW5lUHJvcGVydHkoQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LCBcIkRlZmF1bHRQcm9wc1wiLCB7XG4gIGJpbmRUb0ZpZWxkOiB7XG4gICAgdGFibGVJZDogXCJcIixcbiAgICB0YWJsZU5hbWU6IFwiXCIsXG4gICAgdGFibGVDYXB0aW9uOiBcIlwiLFxuICAgIGZpZWxkTmFtZTogXCJcIixcbiAgICBmaWVsZENhcHRpb246IFwiXCIsXG4gICAgZmllbGREYXRhVHlwZTogXCJcIixcbiAgICBmaWVsZExlbmd0aDogXCJcIlxuICB9LFxuICBkZWZhdWx0VmFsdWU6IHtcbiAgICBkZWZhdWx0VHlwZTogXCJcIixcbiAgICBkZWZhdWx0VmFsdWU6IFwiXCIsXG4gICAgZGVmYXVsdFRleHQ6IFwiXCJcbiAgfSxcbiAgdmFsaWRhdGVSdWxlczoge1xuICAgIG1zZzogXCJcIixcbiAgICBydWxlczogW11cbiAgfSxcbiAgYmFzZUluZm86IHtcbiAgICBpZDogXCJcIixcbiAgICBzZXJpYWxpemU6IFwidHJ1ZVwiLFxuICAgIG5hbWU6IFwiXCIsXG4gICAgY2xhc3NOYW1lOiBcIlwiLFxuICAgIHBsYWNlaG9sZGVyOiBcIlwiLFxuICAgIGN1c3RSZWFkb25seTogXCJub3JlYWRvbmx5XCIsXG4gICAgY3VzdERpc2FibGVkOiBcIm5vZGlzYWJsZWRcIixcbiAgICBzdHlsZTogXCJcIixcbiAgICBkZXNjOiBcIlwiXG4gIH0sXG4gIGJpbmRUb1NlYXJjaEZpZWxkOiB7XG4gICAgY29sdW1uVGl0bGU6IFwiXCIsXG4gICAgY29sdW1uVGFibGVOYW1lOiBcIlwiLFxuICAgIGNvbHVtbk5hbWU6IFwiXCIsXG4gICAgY29sdW1uQ2FwdGlvbjogXCJcIixcbiAgICBjb2x1bW5EYXRhVHlwZU5hbWU6IFwiXCIsXG4gICAgY29sdW1uT3BlcmF0b3I6IFwi5Yy56YWNXCJcbiAgfVxufSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiRGlhbG9nRXhlY3V0ZUVkaXRBY3Rpb25OYW1lXCIsIFwiRWRpdFwiKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgXCJEaWFsb2dFeGVjdXRlSW5zZXJ0QWN0aW9uTmFtZVwiLCBcIkluc2VydFwiKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgQ0tFZGl0b3JVdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDS0VkaXRvclV0aWxpdHkoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENLRWRpdG9yVXRpbGl0eSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ0tFZGl0b3JVdGlsaXR5LCBudWxsLCBbe1xuICAgIGtleTogXCJTZXRTZWxlY3RlZEVsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0U2VsZWN0ZWRFbGVtKGVsZW1IdG1sKSB7XG4gICAgICB0aGlzLl8kQ0tFZGl0b3JTZWxlY3RFbGVtID0gJChlbGVtSHRtbCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldFNlbGVjdGVkRWxlbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRTZWxlY3RlZEVsZW0oKSB7XG4gICAgICBpZiAodGhpcy5fJENLRWRpdG9yU2VsZWN0RWxlbSkge1xuICAgICAgICBpZiAodGhpcy5fJENLRWRpdG9yU2VsZWN0RWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuXyRDS0VkaXRvclNlbGVjdEVsZW07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldFNlbGVjdGVkQ0tFZGl0b3JFbGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFNlbGVjdGVkQ0tFZGl0b3JFbGVtKCkge1xuICAgICAgaWYgKHRoaXMuR2V0U2VsZWN0ZWRFbGVtKCkpIHtcbiAgICAgICAgdmFyIGlkID0gdGhpcy5HZXRTZWxlY3RlZEVsZW0oKS5hdHRyKFwiaWRcIik7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5HZXRDS0VkaXRvckluc3QoKS5kb2N1bWVudC5nZXRCeUlkKGlkKTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRDS0VkaXRvckluc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0Q0tFZGl0b3JJbnN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX0NLRWRpdG9ySW5zdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0Q0tFZGl0b3JJbnN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldENLRWRpdG9ySW5zdChpbnN0KSB7XG4gICAgICB0aGlzLl9DS0VkaXRvckluc3QgPSBpbnN0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRDS0VkaXRvckhUTUxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0Q0tFZGl0b3JIVE1MKCkge1xuICAgICAgdGhpcy5DbGVhckFMTEZvckRpdkVsZW1CdXR0b24oKTtcbiAgICAgIHJldHVybiB0aGlzLkdldENLRWRpdG9ySW5zdCgpLmdldERhdGEoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0Q0tFZGl0b3JIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldENLRWRpdG9ySFRNTChodG1sKSB7XG4gICAgICB0aGlzLkdldENLRWRpdG9ySW5zdCgpLnNldERhdGEoaHRtbCk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIENLRWRpdG9yVXRpbGl0eS5BTExFbGVtQmluZERlZmF1bHRFdmVudCgpO1xuICAgICAgfSwgNTAwKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0Q0tFZGl0b3JIVE1MSW5QbHVnaW5QYWdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldENLRWRpdG9ySFRNTEluUGx1Z2luUGFnZSgpIHtcbiAgICAgIHJldHVybiB3aW5kb3cucGFyZW50LkNLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckhUTUwoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiSW5pdGlhbGl6ZUNLRWRpdG9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEluaXRpYWxpemVDS0VkaXRvcih0ZXh0QXJlYUVsZW1JZCwgcGx1Z2luc0NvbmZpZywgbG9hZENvbXBsZXRlZEZ1bmMsIGNrZWRpdG9yQ29uZmlnRnVsbFBhdGgsIHBsdWdpbkJhc2VQYXRoLCB0aGVtZVZvKSB7XG4gICAgICB2YXIgZXh0cmFQbHVnaW5zID0gbmV3IEFycmF5KCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGx1Z2luc0NvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc2luZ2xlUGx1Z2luQ29uZmlnID0gcGx1Z2luc0NvbmZpZ1tpXTtcbiAgICAgICAgdmFyIHNpbmdsZU5hbWUgPSBzaW5nbGVQbHVnaW5Db25maWcuc2luZ2xlTmFtZTtcbiAgICAgICAgdmFyIHRvb2xiYXJMb2NhdGlvbiA9IHNpbmdsZVBsdWdpbkNvbmZpZy50b29sYmFyTG9jYXRpb247XG4gICAgICAgIHZhciB0ZXh0ID0gc2luZ2xlUGx1Z2luQ29uZmlnLnRleHQ7XG4gICAgICAgIHZhciBzZXJ2ZXJSZXNvbHZlID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNlcnZlclJlc29sdmU7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlID0gc2luZ2xlUGx1Z2luQ29uZmlnLmNsaWVudFJlc29sdmU7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlSnMgPSBzaW5nbGVQbHVnaW5Db25maWcuY2xpZW50UmVzb2x2ZUpzO1xuICAgICAgICB2YXIgZGlhbG9nV2lkdGggPSBzaW5nbGVQbHVnaW5Db25maWcuZGlhbG9nV2lkdGg7XG4gICAgICAgIHZhciBkaWFsb2dIZWlnaHQgPSBzaW5nbGVQbHVnaW5Db25maWcuZGlhbG9nSGVpZ2h0O1xuICAgICAgICB2YXIgaXNKQnVpbGQ0RERhdGEgPSBzaW5nbGVQbHVnaW5Db25maWcuaXNKQnVpbGQ0RERhdGE7XG4gICAgICAgIHZhciBjb250cm9sQ2F0ZWdvcnkgPSBzaW5nbGVQbHVnaW5Db25maWcuY29udHJvbENhdGVnb3J5O1xuICAgICAgICB2YXIgc2VydmVyRHluYW1pY0JpbmQgPSBzaW5nbGVQbHVnaW5Db25maWcuc2VydmVyRHluYW1pY0JpbmQ7XG4gICAgICAgIHZhciBzaG93UmVtb3ZlQnV0dG9uID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNob3dSZW1vdmVCdXR0b247XG4gICAgICAgIHZhciBzaG93SW5FZGl0b3JUb29sYmFyID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNob3dJbkVkaXRvclRvb2xiYXI7XG4gICAgICAgIHZhciBwbHVnaW5GaWxlTmFtZSA9IHNpbmdsZU5hbWUgKyBcIlBsdWdpbi5qc1wiO1xuICAgICAgICB2YXIgcGx1Z2luRm9sZGVyTmFtZSA9IHBsdWdpbkJhc2VQYXRoICsgc2luZ2xlTmFtZSArIFwiL1wiO1xuICAgICAgICBDS0VESVRPUi5wbHVnaW5zLmFkZEV4dGVybmFsKHNpbmdsZU5hbWUsIHBsdWdpbkZvbGRlck5hbWUsIHBsdWdpbkZpbGVOYW1lKTtcbiAgICAgICAgZXh0cmFQbHVnaW5zLnB1c2goc2luZ2xlTmFtZSk7XG4gICAgICAgIENLRWRpdG9yUGx1Z2luVXRpbGl0eS5BZGRQbHVnaW5zU2VydmVyQ29uZmlnKHNpbmdsZU5hbWUsIHRvb2xiYXJMb2NhdGlvbiwgdGV4dCwgY2xpZW50UmVzb2x2ZSwgc2VydmVyUmVzb2x2ZSwgY2xpZW50UmVzb2x2ZUpzLCBkaWFsb2dXaWR0aCwgZGlhbG9nSGVpZ2h0LCBpc0pCdWlsZDRERGF0YSwgY29udHJvbENhdGVnb3J5LCBzZXJ2ZXJEeW5hbWljQmluZCwgc2hvd1JlbW92ZUJ1dHRvbiwgc2hvd0luRWRpdG9yVG9vbGJhcik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuU2V0VGhlbWVWbyh0aGVtZVZvKTtcbiAgICAgIHZhciBlZGl0b3JDb25maWdVcmwgPSBCYXNlVXRpbGl0eS5BcHBlbmRUaW1lU3RhbXBVcmwoY2tlZGl0b3JDb25maWdGdWxsUGF0aCk7XG4gICAgICBDS0VESVRPUi5yZXBsYWNlKHRleHRBcmVhRWxlbUlkLCB7XG4gICAgICAgIGN1c3RvbUNvbmZpZzogZWRpdG9yQ29uZmlnVXJsLFxuICAgICAgICBleHRyYVBsdWdpbnM6IGV4dHJhUGx1Z2lucy5qb2luKFwiLFwiKVxuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oXCJiZWZvcmVQYXN0ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHt9KTtcbiAgICAgIENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbi5vbihcInBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgc291cmNlSFRNTCA9IGV2ZW50LmRhdGEuZGF0YVZhbHVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyICRzb3VyY2VIVE1MID0gJChzb3VyY2VIVE1MKTtcbiAgICAgICAgICAkc291cmNlSFRNTC5maW5kKFwiLmRlbC1idXR0b25cIikucmVtb3ZlKCk7XG5cbiAgICAgICAgICBpZiAoJHNvdXJjZUhUTUwuZmluZChcImRpdlwiKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZXZlbnQuZGF0YS5kYXRhVmFsdWUgPSAkc291cmNlSFRNTC5maW5kKFwiZGl2XCIpLm91dGVySFRNTCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGV2ZW50LmRhdGEuZGF0YVZhbHVlID0gc291cmNlSFRNTDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oXCJhZnRlclBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBDS0VkaXRvclV0aWxpdHkuQUxMRWxlbUJpbmREZWZhdWx0RXZlbnQoKTtcbiAgICAgIH0pO1xuICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzLmh0bWxfZGVzaWduLm9uKCdpbnNlcnRFbGVtZW50JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0RWxlbWVudFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oJ2luc2VydEh0bWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnRIdG1sXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuU2V0Q0tFZGl0b3JJbnN0KENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbik7XG4gICAgICBDS0VESVRPUi5vbignaW5zdGFuY2VSZWFkeScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbG9hZENvbXBsZXRlZEZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgbG9hZENvbXBsZXRlZEZ1bmMoKTtcbiAgICAgICAgICA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRUaGVtZVZvXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFRoZW1lVm8oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fVGhlbWVWbztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0VGhlbWVWb1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRUaGVtZVZvKF90aGVtZVZvKSB7XG4gICAgICB0aGlzLl9UaGVtZVZvID0gX3RoZW1lVm87XG4gICAgICB0aGlzLlJlc2V0Um9vdEVsZW1UaGVtZShfdGhlbWVWbyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlJlc2V0Um9vdEVsZW1UaGVtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBSZXNldFJvb3RFbGVtVGhlbWUoX3RoZW1lVm8pIHtcbiAgICAgIGlmICh0aGlzLkdldENLRWRpdG9ySW5zdCgpKSB7XG4gICAgICAgIHZhciBzb3VyY2VIVE1MID0gdGhpcy5HZXRDS0VkaXRvckhUTUwoKTtcblxuICAgICAgICBpZiAoc291cmNlSFRNTCAhPSBudWxsICYmIHNvdXJjZUhUTUwgIT0gXCJcIikge1xuICAgICAgICAgIHZhciByb290RWxlbSA9ICQoc291cmNlSFRNTCk7XG5cbiAgICAgICAgICBpZiAocm9vdEVsZW0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIGNsYXNzTGlzdCA9IHJvb3RFbGVtLmF0dHIoJ2NsYXNzJykuc3BsaXQoL1xccysvKTtcbiAgICAgICAgICAgIHZhciBjbGFzc2FyeSA9IFtdO1xuICAgICAgICAgICAgJC5lYWNoKGNsYXNzTGlzdCwgZnVuY3Rpb24gKGluZGV4LCBpdGVtKSB7XG4gICAgICAgICAgICAgIGlmIChpdGVtLmluZGV4T2YoJ2h0bWwtZGVzaWduLXRoZW1lLScpID49IDApIHtcbiAgICAgICAgICAgICAgICByb290RWxlbS5yZW1vdmVDbGFzcyhpdGVtKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByb290RWxlbS5hZGRDbGFzcyhfdGhlbWVWby5yb290RWxlbUNsYXNzKTtcbiAgICAgICAgICAgIHRoaXMuU2V0Q0tFZGl0b3JIVE1MKHJvb3RFbGVtLm91dGVySFRNTCgpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiQ2xlYXJBTExGb3JEaXZFbGVtQnV0dG9uXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIENsZWFyQUxMRm9yRGl2RWxlbUJ1dHRvbigpIHtcbiAgICAgIHZhciBvbGREZWxCdXR0b25zID0gQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmRvY3VtZW50LmZpbmQoXCIuZGVsLWJ1dHRvblwiKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvbGREZWxCdXR0b25zLmNvdW50KCk7IGkrKykge1xuICAgICAgICBvbGREZWxCdXR0b25zLmdldEl0ZW0oaSkucmVtb3ZlKCk7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNpbmdsZUVsZW1CaW5kRGVmYXVsdEV2ZW50XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNpbmdsZUVsZW1CaW5kRGVmYXVsdEV2ZW50KGVsZW0pIHtcbiAgICAgIGlmIChlbGVtLmdldEF0dHJpYnV0ZShcInNob3dfcmVtb3ZlX2J1dHRvblwiKSA9PSBcInRydWVcIikge1xuICAgICAgICBlbGVtLm9uKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JJbnN0KCkuZ2V0U2VsZWN0aW9uKCkuc2VsZWN0RWxlbWVudCh0aGlzKTtcbiAgICAgICAgICBDS0VkaXRvclV0aWxpdHkuU2V0U2VsZWN0ZWRFbGVtKHRoaXMuZ2V0T3V0ZXJIdG1sKCkpO1xuICAgICAgICAgIENLRWRpdG9yVXRpbGl0eS5DbGVhckFMTEZvckRpdkVsZW1CdXR0b24oKTtcbiAgICAgICAgICB2YXIgbmV3RGVsQnV0dG9uID0gbmV3IENLRURJVE9SLmRvbS5lbGVtZW50KCdkaXYnKTtcbiAgICAgICAgICBuZXdEZWxCdXR0b24uYWRkQ2xhc3MoXCJkZWwtYnV0dG9uXCIpO1xuICAgICAgICAgIGVsZW0uYXBwZW5kKG5ld0RlbEJ1dHRvbik7XG4gICAgICAgICAgbmV3RGVsQnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgZWxlbS5yZW1vdmUoKTtcbiAgICAgICAgICAgIHZhciBkb21FdmVudCA9IGV2LmRhdGE7XG4gICAgICAgICAgICBkb21FdmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZG9tRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJBTExFbGVtQmluZERlZmF1bHRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBBTExFbGVtQmluZERlZmF1bHRFdmVudCgpIHtcbiAgICAgIHZhciBlbGVtZW50cyA9IENLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckluc3QoKS5kb2N1bWVudC5nZXRCb2R5KCkuZ2V0RWxlbWVudHNCeVRhZygnKicpO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVsZW1lbnRzLmNvdW50KCk7ICsraSkge1xuICAgICAgICB2YXIgZWxlbSA9IGVsZW1lbnRzLmdldEl0ZW0oaSk7XG4gICAgICAgIHRoaXMuU2luZ2xlRWxlbUJpbmREZWZhdWx0RXZlbnQoZWxlbSk7XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIENLRWRpdG9yVXRpbGl0eTtcbn0oKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yVXRpbGl0eSwgXCJfJENLRWRpdG9yU2VsZWN0RWxlbVwiLCBudWxsKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yVXRpbGl0eSwgXCJfQ0tFZGl0b3JJbnN0XCIsIG51bGwpO1xuXG5fZGVmaW5lUHJvcGVydHkoQ0tFZGl0b3JVdGlsaXR5LCBcIl9UaGVtZVZvXCIsIG51bGwpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBIVE1MRWRpdG9yVXRpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gSFRNTEVkaXRvclV0aWxpdHkoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIEhUTUxFZGl0b3JVdGlsaXR5KTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhIVE1MRWRpdG9yVXRpbGl0eSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiR2V0SFRNTEVkaXRvckluc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0SFRNTEVkaXRvckluc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fSFRNTEVkaXRvckluc3Q7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldEhUTUxFZGl0b3JIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldEhUTUxFZGl0b3JIVE1MKGh0bWwpIHtcbiAgICAgIGlmICghU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KGh0bWwpKSB7XG4gICAgICAgIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5zZXRWYWx1ZShodG1sKTtcbiAgICAgICAgQ29kZU1pcnJvci5jb21tYW5kc1tcInNlbGVjdEFsbFwiXSh0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkpO1xuICAgICAgICB2YXIgcmFuZ2UgPSB7XG4gICAgICAgICAgZnJvbTogdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldEN1cnNvcih0cnVlKSxcbiAgICAgICAgICB0bzogdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldEN1cnNvcihmYWxzZSlcbiAgICAgICAgfTtcbiAgICAgICAgO1xuICAgICAgICB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuYXV0b0Zvcm1hdFJhbmdlKHJhbmdlLmZyb20sIHJhbmdlLnRvKTtcbiAgICAgICAgdmFyIGExID0ge1xuICAgICAgICAgIGxpbmU6IDAsXG4gICAgICAgICAgY2g6IDJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldERvYygpLmVhY2hMaW5lKGZ1bmN0aW9uIChsaW5lKSB7fSk7XG4gICAgICAgIHZhciBzZWxlY3RlZEVsZW0gPSBDS0VkaXRvclV0aWxpdHkuR2V0U2VsZWN0ZWRFbGVtKCk7XG4gICAgICAgIHZhciBzZWFyY2hIVE1MID0gXCJcIjtcblxuICAgICAgICBpZiAoc2VsZWN0ZWRFbGVtKSB7XG4gICAgICAgICAgc2VhcmNoSFRNTCA9IHNlbGVjdGVkRWxlbS5vdXRlckhUTUwoKS5zcGxpdChcIj5cIilbMF07XG4gICAgICAgIH1cblxuICAgICAgICBjb25zb2xlLmxvZyhcIi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cIik7XG4gICAgICAgIHZhciBjdXJzb3IgPSB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuZ2V0U2VhcmNoQ3Vyc29yKHNlYXJjaEhUTUwpO1xuICAgICAgICBjdXJzb3IuZmluZE5leHQoKTtcbiAgICAgICAgY29uc29sZS5sb2coY3Vyc29yKTtcbiAgICAgICAgY29uc29sZS5sb2coY3Vyc29yLmZyb20oKSArIFwifFwiICsgY3Vyc29yLnRvKCkpO1xuXG4gICAgICAgIGlmIChjdXJzb3IuZnJvbSgpICYmIGN1cnNvci50bygpKSB7XG4gICAgICAgICAgdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldERvYygpLnNldFNlbGVjdGlvbihjdXJzb3IuZnJvbSgpLCBjdXJzb3IudG8oKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0SHRtbEVkaXRvckhUTUxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0SHRtbEVkaXRvckhUTUwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldFZhbHVlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkluaXRpYWxpemVIVE1MQ29kZURlc2lnblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBJbml0aWFsaXplSFRNTENvZGVEZXNpZ24oKSB7XG4gICAgICB2YXIgbWl4ZWRNb2RlID0ge1xuICAgICAgICBuYW1lOiBcImh0bWxtaXhlZFwiLFxuICAgICAgICBzY3JpcHRUeXBlczogW3tcbiAgICAgICAgICBtYXRjaGVzOiAvXFwveC1oYW5kbGViYXJzLXRlbXBsYXRlfFxcL3gtbXVzdGFjaGUvaSxcbiAgICAgICAgICBtb2RlOiBudWxsXG4gICAgICAgIH0sIHtcbiAgICAgICAgICBtYXRjaGVzOiAvKHRleHR8YXBwbGljYXRpb24pXFwvKHgtKT92YihhfHNjcmlwdCkvaSxcbiAgICAgICAgICBtb2RlOiBcInZic2NyaXB0XCJcbiAgICAgICAgfV1cbiAgICAgIH07XG4gICAgICB0aGlzLl9IVE1MRWRpdG9ySW5zdCA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiVGV4dEFyZWFIVE1MRWRpdG9yXCIpLCB7XG4gICAgICAgIG1vZGU6IG1peGVkTW9kZSxcbiAgICAgICAgc2VsZWN0aW9uUG9pbnRlcjogdHJ1ZSxcbiAgICAgICAgdGhlbWU6IFwibW9ub2thaVwiLFxuICAgICAgICBmb2xkR3V0dGVyOiB0cnVlLFxuICAgICAgICBndXR0ZXJzOiBbXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCIsIFwiQ29kZU1pcnJvci1mb2xkZ3V0dGVyXCJdLFxuICAgICAgICBsaW5lTnVtYmVyczogdHJ1ZSxcbiAgICAgICAgbGluZVdyYXBwaW5nOiB0cnVlXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fSFRNTEVkaXRvckluc3Quc2V0U2l6ZShcIjEwMCVcIiwgUGFnZVN0eWxlVXRpbGl0eS5HZXRXaW5kb3dIZWlnaHQoKSAtIDg1KTtcbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSFRNTEVkaXRvclV0aWxpdHk7XG59KCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShIVE1MRWRpdG9yVXRpbGl0eSwgXCJfSFRNTEVkaXRvckluc3RcIiwgbnVsbCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIEpzRWRpdG9yVXRpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gSnNFZGl0b3JVdGlsaXR5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBKc0VkaXRvclV0aWxpdHkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKEpzRWRpdG9yVXRpbGl0eSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiX0dldE5ld0Zvcm1Kc1N0cmluZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBfR2V0TmV3Rm9ybUpzU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIFwiPHNjcmlwdD52YXIgRm9ybVBhZ2VPYmplY3RJbnN0YW5jZT17XCIgKyBcImRhdGE6e1wiICsgXCJ1c2VyRW50aXR5Ont9LFwiICsgXCJmb3JtRW50aXR5OltdLFwiICsgXCJjb25maWc6W11cIiArIFwifSxcIiArIFwicGFnZVJlYWR5OmZ1bmN0aW9uKCl7fSxcIiArIFwiYmluZFJlY29yZERhdGFSZWFkeTpmdW5jdGlvbigpe30sXCIgKyBcInZhbGlkYXRlRXZlcnlGcm9tQ29udHJvbDpmdW5jdGlvbihjb250cm9sT2JqKXt9XCIgKyBcIn08L3NjcmlwdD5cIjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0SnNFZGl0b3JJbnN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEpzRWRpdG9ySW5zdCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9Kc0VkaXRvckluc3Q7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNldEpzRWRpdG9ySnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0SnNFZGl0b3JKcyhqcykge1xuICAgICAgdGhpcy5HZXRKc0VkaXRvckluc3QoKS5zZXRWYWx1ZShqcyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEpzRWRpdG9ySnNcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0SnNFZGl0b3JKcygpIHtcbiAgICAgIHJldHVybiB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLmdldFZhbHVlKCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkluaXRpYWxpemVKc0NvZGVEZXNpZ25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gSW5pdGlhbGl6ZUpzQ29kZURlc2lnbihzdGF0dXMpIHtcbiAgICAgIHRoaXMuX0pzRWRpdG9ySW5zdCA9IENvZGVNaXJyb3IuZnJvbVRleHRBcmVhKCQoXCIjVGV4dEFyZWFKc0VkaXRvclwiKVswXSwge1xuICAgICAgICBtb2RlOiBcImFwcGxpY2F0aW9uL2xkK2pzb25cIixcbiAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZSxcbiAgICAgICAgZXh0cmFLZXlzOiB7XG4gICAgICAgICAgXCJDdHJsLVFcIjogZnVuY3Rpb24gQ3RybFEoY20pIHtcbiAgICAgICAgICAgIGNtLmZvbGRDb2RlKGNtLmdldEN1cnNvcigpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZvbGRHdXR0ZXI6IHRydWUsXG4gICAgICAgIHNtYXJ0SW5kZW50OiB0cnVlLFxuICAgICAgICBtYXRjaEJyYWNrZXRzOiB0cnVlLFxuICAgICAgICB0aGVtZTogXCJtb25va2FpXCIsXG4gICAgICAgIGd1dHRlcnM6IFtcIkNvZGVNaXJyb3ItbGluZW51bWJlcnNcIiwgXCJDb2RlTWlycm9yLWZvbGRndXR0ZXJcIl1cbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLl9Kc0VkaXRvckluc3Quc2V0U2l6ZShcIjEwMCVcIiwgUGFnZVN0eWxlVXRpbGl0eS5HZXRXaW5kb3dIZWlnaHQoKSAtIDg1KTtcblxuICAgICAgaWYgKHN0YXR1cyA9PSBcImFkZFwiKSB7XG4gICAgICAgIHRoaXMuU2V0SnNFZGl0b3JKcyh0aGlzLl9HZXROZXdGb3JtSnNTdHJpbmcoKSk7XG4gICAgICAgIENvZGVNaXJyb3IuY29tbWFuZHNbXCJzZWxlY3RBbGxcIl0odGhpcy5HZXRKc0VkaXRvckluc3QoKSk7XG4gICAgICAgIHZhciByYW5nZSA9IHtcbiAgICAgICAgICBmcm9tOiB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLmdldEN1cnNvcih0cnVlKSxcbiAgICAgICAgICB0bzogdGhpcy5HZXRKc0VkaXRvckluc3QoKS5nZXRDdXJzb3IoZmFsc2UpXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuYXV0b0Zvcm1hdFJhbmdlKHJhbmdlLmZyb20sIHJhbmdlLnRvKTtcbiAgICAgIH1cbiAgICB9XG4gIH1dKTtcblxuICByZXR1cm4gSnNFZGl0b3JVdGlsaXR5O1xufSgpO1xuXG5fZGVmaW5lUHJvcGVydHkoSnNFZGl0b3JVdGlsaXR5LCBcIl9Kc0VkaXRvckluc3RcIiwgbnVsbCk7Il19
