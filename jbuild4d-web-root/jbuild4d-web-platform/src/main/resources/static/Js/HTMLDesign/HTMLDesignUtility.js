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
      debugger;
      elem.setAttribute("jbuild4d_custom", "true");
      elem.setAttribute("singlename", controlSetting.SingleName);
      elem.setAttribute("is_jbuild4d_data", controlSetting.IsJBuild4DData);
      elem.setAttribute("control_category", controlSetting.ControlCategory);
      elem.setAttribute("show_remove_button", controlSetting.ShowRemoveButton);
      elem.setAttribute("clientresolve", controlSetting.ClientResolve);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNLRWRpdG9yUGx1Z2luVXRpbGl0eS5qcyIsIkNLRWRpdG9yVXRpbGl0eS5qcyIsIkhUTUxFZGl0b3JVdGlsaXR5LmpzIiwiSnNFZGl0b3JVdGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IkhUTUxEZXNpZ25VdGlsaXR5LmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHsgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykgeyB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldOyBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7IGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTsgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpOyB9IH1cblxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cblxudmFyIENLRWRpdG9yUGx1Z2luVXRpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBDS0VkaXRvclBsdWdpblV0aWxpdHkpO1xuICB9XG5cbiAgX2NyZWF0ZUNsYXNzKENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgbnVsbCwgW3tcbiAgICBrZXk6IFwiQWRkUGx1Z2luc1NlcnZlckNvbmZpZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBBZGRQbHVnaW5zU2VydmVyQ29uZmlnKHNpbmdsZU5hbWUsIHRvb2xiYXJMb2NhdGlvbiwgdGV4dCwgY2xpZW50UmVzb2x2ZSwgc2VydmVyUmVzb2x2ZSwgY2xpZW50UmVzb2x2ZUpzLCBkaWFsb2dXaWR0aCwgZGlhbG9nSGVpZ2h0LCBpc0pCdWlsZDRERGF0YSwgY29udHJvbENhdGVnb3J5LCBzZXJ2ZXJEeW5hbWljQmluZCwgc2hvd1JlbW92ZUJ1dHRvbiwgc2hvd0luRWRpdG9yVG9vbGJhcikge1xuICAgICAgdGhpcy5QbHVnaW5zU2VydmVyQ29uZmlnW3NpbmdsZU5hbWVdID0ge1xuICAgICAgICBTaW5nbGVOYW1lOiBzaW5nbGVOYW1lLFxuICAgICAgICBUb29sYmFyTG9jYXRpb246IHRvb2xiYXJMb2NhdGlvbixcbiAgICAgICAgVG9vbGJhckxhYmVsOiB0ZXh0LFxuICAgICAgICBDbGllbnRSZXNvbHZlOiBjbGllbnRSZXNvbHZlLFxuICAgICAgICBTZXJ2ZXJSZXNvbHZlOiBzZXJ2ZXJSZXNvbHZlLFxuICAgICAgICBDbGllbnRSZXNvbHZlSnM6IGNsaWVudFJlc29sdmVKcyxcbiAgICAgICAgRGlhbG9nV2lkdGg6IGRpYWxvZ1dpZHRoLFxuICAgICAgICBEaWFsb2dIZWlnaHQ6IGRpYWxvZ0hlaWdodCxcbiAgICAgICAgSXNKQnVpbGQ0RERhdGE6IGlzSkJ1aWxkNEREYXRhLFxuICAgICAgICBDb250cm9sQ2F0ZWdvcnk6IGNvbnRyb2xDYXRlZ29yeSxcbiAgICAgICAgU2VydmVyRHluYW1pY0JpbmQ6IHNlcnZlckR5bmFtaWNCaW5kLFxuICAgICAgICBTaG93UmVtb3ZlQnV0dG9uOiBzaG93UmVtb3ZlQnV0dG9uLFxuICAgICAgICBTaG93SW5FZGl0b3JUb29sYmFyOiBzaG93SW5FZGl0b3JUb29sYmFyXG4gICAgICB9O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJfVXNlU2VydmVyQ29uZmlnQ292ZXJFbXB0eVBsdWdpblByb3BcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX1VzZVNlcnZlckNvbmZpZ0NvdmVyRW1wdHlQbHVnaW5Qcm9wKG9iaikge1xuICAgICAgdmFyIGNvdmVyT2JqID0gdGhpcy5QbHVnaW5zU2VydmVyQ29uZmlnW29iai5TaW5nbGVOYW1lXTtcblxuICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmopIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvYmpbcHJvcF0gIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgaWYgKG9ialtwcm9wXSA9PSBcIlwiIHx8IG9ialtwcm9wXSA9PSBudWxsKSB7XG4gICAgICAgICAgICBpZiAoY292ZXJPYmpbcHJvcF0pIHtcbiAgICAgICAgICAgICAgb2JqW3Byb3BdID0gY292ZXJPYmpbcHJvcF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEdlbmVyYWxQbHVnaW5JbnN0YW5jZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRHZW5lcmFsUGx1Z2luSW5zdGFuY2UocGx1Z2luU2luZ2xlTmFtZSwgZXhDb25maWcpIHtcbiAgICAgIHZhciBkZWZhdWx0U2V0dGluZyA9IHtcbiAgICAgICAgU2luZ2xlTmFtZTogcGx1Z2luU2luZ2xlTmFtZSxcbiAgICAgICAgRGlhbG9nTmFtZTogJycsXG4gICAgICAgIERpYWxvZ1dpZHRoOiBudWxsLFxuICAgICAgICBEaWFsb2dIZWlnaHQ6IG51bGwsXG4gICAgICAgIERpYWxvZ1BhZ2VVcmw6IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybCgnRGlhbG9nLmh0bWwnKSxcbiAgICAgICAgRGlhbG9nVGl0bGU6IFwiRElWXCIsXG4gICAgICAgIFRvb2xiYXJDb21tYW5kOiAnJyxcbiAgICAgICAgVG9vbGJhckljb246ICdJY29uLnBuZycsXG4gICAgICAgIFRvb2xiYXJMYWJlbDogXCJcIixcbiAgICAgICAgVG9vbGJhckxvY2F0aW9uOiAnJyxcbiAgICAgICAgSUZyYW1lV2luZG93OiBudWxsLFxuICAgICAgICBJRnJhbWVFeGVjdXRlQWN0aW9uTmFtZTogXCJJbnNlcnRcIixcbiAgICAgICAgRGVzaWduTW9kYWxJbnB1dENzczogXCJcIixcbiAgICAgICAgQ2xpZW50UmVzb2x2ZTogXCJcIixcbiAgICAgICAgU2VydmVyUmVzb2x2ZTogXCJcIixcbiAgICAgICAgSXNKQnVpbGQ0RERhdGE6IFwiXCIsXG4gICAgICAgIENvbnRyb2xDYXRlZ29yeTogXCJcIixcbiAgICAgICAgU2VydmVyRHluYW1pY0JpbmQ6IFwiXCIsXG4gICAgICAgIFNob3dSZW1vdmVCdXR0b246IFwiXCIsXG4gICAgICAgIFNob3dJbkVkaXRvclRvb2xiYXI6IFwiXCJcbiAgICAgIH07XG4gICAgICBkZWZhdWx0U2V0dGluZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0U2V0dGluZywgZXhDb25maWcpO1xuICAgICAgZGVmYXVsdFNldHRpbmcgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuX1VzZVNlcnZlckNvbmZpZ0NvdmVyRW1wdHlQbHVnaW5Qcm9wKGRlZmF1bHRTZXR0aW5nKTtcbiAgICAgIGRlZmF1bHRTZXR0aW5nLkRpYWxvZ05hbWUgPSBkZWZhdWx0U2V0dGluZy5TaW5nbGVOYW1lO1xuICAgICAgZGVmYXVsdFNldHRpbmcuVG9vbGJhckNvbW1hbmQgPSBcIkpCdWlsZDRELkZvcm1EZXNpZ24uUGx1Z2lucy5cIiArIGRlZmF1bHRTZXR0aW5nLlNpbmdsZU5hbWU7XG4gICAgICBkZWZhdWx0U2V0dGluZy5EaWFsb2dTZXR0aW5nVGl0bGUgPSBkZWZhdWx0U2V0dGluZy5Ub29sYmFyTGFiZWwgKyBcIldlYuaOp+S7tlwiO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgU2V0dGluZzogZGVmYXVsdFNldHRpbmdcbiAgICAgIH07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlJlZ0dlbmVyYWxQbHVnaW5Ub0VkaXRvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBSZWdHZW5lcmFsUGx1Z2luVG9FZGl0b3IoY2tFZGl0b3IsIHBhdGgsIHBsdWdpblNldHRpbmcsIG9rRnVuYykge1xuICAgICAgQ0tFRElUT1IuZGlhbG9nLmFkZElmcmFtZShwbHVnaW5TZXR0aW5nLkRpYWxvZ05hbWUsIHBsdWdpblNldHRpbmcuRGlhbG9nU2V0dGluZ1RpdGxlLCBwYXRoICsgcGx1Z2luU2V0dGluZy5EaWFsb2dQYWdlVXJsLCBwbHVnaW5TZXR0aW5nLkRpYWxvZ1dpZHRoLCBwbHVnaW5TZXR0aW5nLkRpYWxvZ0hlaWdodCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaWZyYW1lID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5fLmZyYW1lSWQpO1xuICAgICAgICBwbHVnaW5TZXR0aW5nLklGcmFtZVdpbmRvdyA9IGlmcmFtZTtcbiAgICAgICAgQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LlNldEVsZW1Qcm9wc0luRWRpdERpYWxvZyhwbHVnaW5TZXR0aW5nLklGcmFtZVdpbmRvdywgcGx1Z2luU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSk7XG4gICAgICB9LCB7XG4gICAgICAgIG9uT2s6IGZ1bmN0aW9uIG9uT2soKSB7XG4gICAgICAgICAgdmFyIHByb3BzID0gcGx1Z2luU2V0dGluZy5JRnJhbWVXaW5kb3cuY29udGVudFdpbmRvdy5EaWFsb2dBcHAuZ2V0Q29udHJvbFByb3BzKCk7XG5cbiAgICAgICAgICBpZiAocHJvcHMuc3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIG9rRnVuYyhja0VkaXRvciwgcGx1Z2luU2V0dGluZywgcHJvcHMsIHBsdWdpblNldHRpbmcuSUZyYW1lV2luZG93LmNvbnRlbnRXaW5kb3cpO1xuICAgICAgICAgIHBsdWdpblNldHRpbmcuSUZyYW1lRXhlY3V0ZUFjdGlvbk5hbWUgPSBDS0VkaXRvclBsdWdpblV0aWxpdHkuRGlhbG9nRXhlY3V0ZUluc2VydEFjdGlvbk5hbWU7XG4gICAgICAgIH0sXG4gICAgICAgIG9uQ2FuY2VsOiBmdW5jdGlvbiBvbkNhbmNlbCgpIHtcbiAgICAgICAgICBwbHVnaW5TZXR0aW5nLklGcmFtZUV4ZWN1dGVBY3Rpb25OYW1lID0gQ0tFZGl0b3JQbHVnaW5VdGlsaXR5LkRpYWxvZ0V4ZWN1dGVJbnNlcnRBY3Rpb25OYW1lO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIGNrRWRpdG9yLmFkZENvbW1hbmQocGx1Z2luU2V0dGluZy5Ub29sYmFyQ29tbWFuZCwgbmV3IENLRURJVE9SLmRpYWxvZ0NvbW1hbmQocGx1Z2luU2V0dGluZy5EaWFsb2dOYW1lKSk7XG5cbiAgICAgIGlmIChwbHVnaW5TZXR0aW5nLlNob3dJbkVkaXRvclRvb2xiYXIgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgY2tFZGl0b3IudWkuYWRkQnV0dG9uKHBsdWdpblNldHRpbmcuU2luZ2xlTmFtZSwge1xuICAgICAgICAgIGxhYmVsOiBwbHVnaW5TZXR0aW5nLlRvb2xiYXJMYWJlbCxcbiAgICAgICAgICBpY29uOiBwYXRoICsgcGx1Z2luU2V0dGluZy5Ub29sYmFySWNvbixcbiAgICAgICAgICBjb21tYW5kOiBwbHVnaW5TZXR0aW5nLlRvb2xiYXJDb21tYW5kLFxuICAgICAgICAgIHRvb2xiYXI6IHBsdWdpblNldHRpbmcuVG9vbGJhckxvY2F0aW9uXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBja0VkaXRvci5vbignZG91YmxlY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgcGx1Z2luU2V0dGluZy5JRnJhbWVFeGVjdXRlQWN0aW9uTmFtZSA9IENLRWRpdG9yUGx1Z2luVXRpbGl0eS5EaWFsb2dFeGVjdXRlRWRpdEFjdGlvbk5hbWU7XG4gICAgICAgIENLRWRpdG9yUGx1Z2luVXRpbGl0eS5PbkNLV3lzaXd5Z0VsZW1EQkNsaWNrRXZlbnQoZXZlbnQsIHBsdWdpblNldHRpbmcpO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIk9uQ0tXeXNpd3lnRWxlbURCQ2xpY2tFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBPbkNLV3lzaXd5Z0VsZW1EQkNsaWNrRXZlbnQoZXZlbnQsIGNvbnRyb2xTZXR0aW5nKSB7XG4gICAgICB2YXIgZWxlbWVudCA9IGV2ZW50LmRhdGEuZWxlbWVudDtcblxuICAgICAgaWYgKGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwicnVudGltZV9hdXRvX3JlbW92ZVwiKSA9PSBcInRydWVcIikge1xuICAgICAgICBlbGVtZW50ID0gZXZlbnQuZGF0YS5lbGVtZW50LmdldFBhcmVudCgpO1xuICAgICAgfVxuXG4gICAgICB2YXIgc2luZ2xlTmFtZSA9IGVsZW1lbnQuZ2V0QXR0cmlidXRlKFwic2luZ2xlTmFtZVwiKTtcblxuICAgICAgaWYgKHNpbmdsZU5hbWUgPT0gY29udHJvbFNldHRpbmcuU2luZ2xlTmFtZSkge1xuICAgICAgICBDS0VkaXRvclV0aWxpdHkuU2V0U2VsZWN0ZWRFbGVtKGVsZW1lbnQuZ2V0T3V0ZXJIdG1sKCkpO1xuICAgICAgICBldmVudC5kYXRhLmRpYWxvZyA9IGNvbnRyb2xTZXR0aW5nLkRpYWxvZ05hbWU7XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlNlcmlhbGl6ZVByb3BzVG9FbGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNlcmlhbGl6ZVByb3BzVG9FbGVtKGVsZW0sIHByb3BzLCBjb250cm9sU2V0dGluZykge1xuICAgICAgZGVidWdnZXI7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImpidWlsZDRkX2N1c3RvbVwiLCBcInRydWVcIik7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNpbmdsZW5hbWVcIiwgY29udHJvbFNldHRpbmcuU2luZ2xlTmFtZSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcImlzX2pidWlsZDRkX2RhdGFcIiwgY29udHJvbFNldHRpbmcuSXNKQnVpbGQ0RERhdGEpO1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJjb250cm9sX2NhdGVnb3J5XCIsIGNvbnRyb2xTZXR0aW5nLkNvbnRyb2xDYXRlZ29yeSk7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZShcInNob3dfcmVtb3ZlX2J1dHRvblwiLCBjb250cm9sU2V0dGluZy5TaG93UmVtb3ZlQnV0dG9uKTtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKFwiY2xpZW50cmVzb2x2ZVwiLCBjb250cm9sU2V0dGluZy5DbGllbnRSZXNvbHZlKTtcblxuICAgICAgaWYgKHByb3BzW1wiYmFzZUluZm9cIl0pIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzW1wiYmFzZUluZm9cIl0pIHtcbiAgICAgICAgICBpZiAoa2V5ID09IFwicmVhZG9ubHlcIikge1xuICAgICAgICAgICAgaWYgKHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSA9PSBcInJlYWRvbmx5XCIpIHtcbiAgICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZShcInJlYWRvbmx5XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoa2V5ID09IFwiZGlzYWJsZWRcIikge1xuICAgICAgICAgICAgaWYgKHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSA9PSBcImRpc2FibGVkXCIpIHtcbiAgICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmFzZUluZm9cIl1ba2V5XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBlbGVtLnJlbW92ZUF0dHJpYnV0ZShcImRpc2FibGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShrZXkudG9Mb2NhbGVMb3dlckNhc2UoKSwgcHJvcHNbXCJiYXNlSW5mb1wiXVtrZXldKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByb3BzW1wiYmluZFRvRmllbGRcIl0pIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzW1wiYmluZFRvRmllbGRcIl0pIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZShrZXkudG9Mb2NhbGVMb3dlckNhc2UoKSwgcHJvcHNbXCJiaW5kVG9GaWVsZFwiXVtrZXldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHNbXCJkZWZhdWx0VmFsdWVcIl0pIHtcbiAgICAgICAgZm9yICh2YXIga2V5IGluIHByb3BzW1wiZGVmYXVsdFZhbHVlXCJdKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiZGVmYXVsdFZhbHVlXCJdW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wc1tcInZhbGlkYXRlUnVsZXNcIl0pIHtcbiAgICAgICAgaWYgKHByb3BzW1widmFsaWRhdGVSdWxlc1wiXS5ydWxlcykge1xuICAgICAgICAgIGlmIChwcm9wc1tcInZhbGlkYXRlUnVsZXNcIl0ucnVsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoXCJ2YWxpZGF0ZXJ1bGVzXCIsIGVuY29kZVVSSUNvbXBvbmVudChKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmcocHJvcHNbXCJ2YWxpZGF0ZVJ1bGVzXCJdKSkpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJvcHNbXCJub3JtYWxQcm9wc1wiXSkge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gcHJvcHNbXCJub3JtYWxQcm9wc1wiXSkge1xuICAgICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKGtleS50b0xvY2FsZUxvd2VyQ2FzZSgpLCBwcm9wc1tcIm5vcm1hbFByb3BzXCJdW2tleV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcm9wc1tcImJpbmRUb1NlYXJjaEZpZWxkXCJdKSB7XG4gICAgICAgIGZvciAodmFyIGtleSBpbiBwcm9wc1tcImJpbmRUb1NlYXJjaEZpZWxkXCJdKSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoa2V5LnRvTG9jYWxlTG93ZXJDYXNlKCksIHByb3BzW1wiYmluZFRvU2VhcmNoRmllbGRcIl1ba2V5XSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGVsZW07XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkRlc2VyaWFsaXplUHJvcHNGcm9tRWxlbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBEZXNlcmlhbGl6ZVByb3BzRnJvbUVsZW0oZWxlbSkge1xuICAgICAgdmFyIHByb3BzID0ge307XG4gICAgICB2YXIgJGVsZW0gPSAkKGVsZW0pO1xuXG4gICAgICBmdW5jdGlvbiBhdHRyVG9Qcm9wKHByb3BzLCBncm91cE5hbWUpIHtcbiAgICAgICAgdmFyIGdyb3VwUHJvcCA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLkRlZmF1bHRQcm9wc1tncm91cE5hbWVdKSB7XG4gICAgICAgICAgaWYgKCRlbGVtLmF0dHIoa2V5KSkge1xuICAgICAgICAgICAgZ3JvdXBQcm9wW2tleV0gPSAkZWxlbS5hdHRyKGtleSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGdyb3VwUHJvcFtrZXldID0gdGhpcy5EZWZhdWx0UHJvcHNbZ3JvdXBOYW1lXVtrZXldO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHByb3BzW2dyb3VwTmFtZV0gPSBncm91cFByb3A7XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICAgIH1cblxuICAgICAgcHJvcHMgPSBhdHRyVG9Qcm9wLmNhbGwodGhpcywgcHJvcHMsIFwiYmFzZUluZm9cIik7XG4gICAgICBwcm9wcyA9IGF0dHJUb1Byb3AuY2FsbCh0aGlzLCBwcm9wcywgXCJiaW5kVG9GaWVsZFwiKTtcbiAgICAgIHByb3BzID0gYXR0clRvUHJvcC5jYWxsKHRoaXMsIHByb3BzLCBcImRlZmF1bHRWYWx1ZVwiKTtcbiAgICAgIHByb3BzID0gYXR0clRvUHJvcC5jYWxsKHRoaXMsIHByb3BzLCBcImJpbmRUb1NlYXJjaEZpZWxkXCIpO1xuXG4gICAgICBpZiAoJGVsZW0uYXR0cihcInZhbGlkYXRlUnVsZXNcIikpIHtcbiAgICAgICAgcHJvcHMudmFsaWRhdGVSdWxlcyA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihkZWNvZGVVUklDb21wb25lbnQoJGVsZW0uYXR0cihcInZhbGlkYXRlUnVsZXNcIikpKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3BzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJCdWlsZEdlbmVyYWxFbGVtVG9DS1d5c2l3eWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gQnVpbGRHZW5lcmFsRWxlbVRvQ0tXeXNpd3lnKGh0bWwsIGNvbnRyb2xTZXR0aW5nLCBjb250cm9sUHJvcHMsIF9pZnJhbWUpIHtcbiAgICAgIGlmICh0aGlzLlZhbGlkYXRlQnVpbGRFbmFibGUoaHRtbCwgY29udHJvbFNldHRpbmcsIGNvbnRyb2xQcm9wcywgX2lmcmFtZSkpIHtcbiAgICAgICAgaWYgKGNvbnRyb2xTZXR0aW5nLklGcmFtZUV4ZWN1dGVBY3Rpb25OYW1lID09IENLRWRpdG9yUGx1Z2luVXRpbGl0eS5EaWFsb2dFeGVjdXRlSW5zZXJ0QWN0aW9uTmFtZSkge1xuICAgICAgICAgIHZhciBlbGVtID0gQ0tFRElUT1IuZG9tLmVsZW1lbnQuY3JlYXRlRnJvbUh0bWwoaHRtbCk7XG4gICAgICAgICAgdGhpcy5TZXJpYWxpemVQcm9wc1RvRWxlbShlbGVtLCBjb250cm9sUHJvcHMsIGNvbnRyb2xTZXR0aW5nKTtcbiAgICAgICAgICBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JJbnN0KCkuaW5zZXJ0RWxlbWVudChlbGVtKTtcbiAgICAgICAgICBDS0VkaXRvclV0aWxpdHkuU2luZ2xlRWxlbUJpbmREZWZhdWx0RXZlbnQoZWxlbSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHNlbGVjdGVkRWxlbSA9IENLRWRpdG9yVXRpbGl0eS5HZXRTZWxlY3RlZENLRWRpdG9yRWxlbSgpO1xuXG4gICAgICAgICAgaWYgKHNlbGVjdGVkRWxlbSkge1xuICAgICAgICAgICAgdmFyIHJlRnJlc2hFbGVtID0gbmV3IENLRURJVE9SLmRvbS5lbGVtZW50LmNyZWF0ZUZyb21IdG1sKHNlbGVjdGVkRWxlbS5nZXRPdXRlckh0bWwoKSk7XG5cbiAgICAgICAgICAgIGlmIChyZUZyZXNoRWxlbS5nZXRBdHRyaWJ1dGUoXCJjb250cm9sX2NhdGVnb3J5XCIpID09IFwiSW5wdXRDb250cm9sXCIpIHtcbiAgICAgICAgICAgICAgdmFyIG5ld1RleHQgPSAkKGh0bWwpLnRleHQoKTtcbiAgICAgICAgICAgICAgcmVGcmVzaEVsZW0uc2V0VGV4dChuZXdUZXh0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc2VsZWN0ZWRFbGVtLmNvcHlBdHRyaWJ1dGVzKHJlRnJlc2hFbGVtLCB7XG4gICAgICAgICAgICAgIHRlbXA6IFwidGVtcFwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHRoaXMuU2VyaWFsaXplUHJvcHNUb0VsZW0ocmVGcmVzaEVsZW0sIGNvbnRyb2xQcm9wcywgY29udHJvbFNldHRpbmcpO1xuICAgICAgICAgICAgcmVGcmVzaEVsZW0ucmVwbGFjZShzZWxlY3RlZEVsZW0pO1xuICAgICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LlNpbmdsZUVsZW1CaW5kRGVmYXVsdEV2ZW50KHJlRnJlc2hFbGVtKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiVmFsaWRhdGVCdWlsZEVuYWJsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBWYWxpZGF0ZUJ1aWxkRW5hYmxlKGh0bWwsIGNvbnRyb2xTZXR0aW5nLCBjb250cm9sUHJvcHMsIF9pZnJhbWUpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJWYWxpZGF0ZVNlcmlhbGl6ZUNvbnRyb2xEaWFsb2dDb21wbGV0ZWRFbmFibGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gVmFsaWRhdGVTZXJpYWxpemVDb250cm9sRGlhbG9nQ29tcGxldGVkRW5hYmxlKHJldHVyblJlc3VsdCkge1xuICAgICAgaWYgKHJldHVyblJlc3VsdC5iYXNlSW5mby5zZXJpYWxpemUgPT0gXCJ0cnVlXCIgJiYgcmV0dXJuUmVzdWx0LmJpbmRUb0ZpZWxkLmZpZWxkTmFtZSA9PSBcIlwiKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuW6j+WIl+WMlueahOaOp+S7tuW/hemhu+e7keWumuWtl+autSFcIiwgbnVsbCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3VjY2VzczogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJldHVyblJlc3VsdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0RWxlbVByb3BzSW5FZGl0RGlhbG9nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldEVsZW1Qcm9wc0luRWRpdERpYWxvZyhpZnJhbWVPYmosIGFjdGlvbk5hbWUpIHtcbiAgICAgIHZhciBzZWwgPSBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JJbnN0KCkuZ2V0U2VsZWN0aW9uKCkuZ2V0U3RhcnRFbGVtZW50KCk7XG4gICAgICB2YXIgcGFyZW50cyA9IG51bGw7XG5cbiAgICAgIGlmIChzZWwpIHtcbiAgICAgICAgcGFyZW50cyA9IHNlbC5nZXRQYXJlbnRzKCk7XG4gICAgICB9XG5cbiAgICAgIGlmcmFtZU9iai5jb250ZW50V2luZG93LkRpYWxvZ0FwcC5yZWFkeShhY3Rpb25OYW1lLCBzZWwsIHBhcmVudHMpO1xuXG4gICAgICBpZiAoYWN0aW9uTmFtZSA9PSB0aGlzLkRpYWxvZ0V4ZWN1dGVFZGl0QWN0aW9uTmFtZSkge1xuICAgICAgICB2YXIgZWxlbSA9IENLRWRpdG9yVXRpbGl0eS5HZXRTZWxlY3RlZEVsZW0oKS5vdXRlckhUTUwoKTtcbiAgICAgICAgdmFyIHByb3BzID0gdGhpcy5EZXNlcmlhbGl6ZVByb3BzRnJvbUVsZW0oZWxlbSk7XG4gICAgICAgIGlmcmFtZU9iai5jb250ZW50V2luZG93LkRpYWxvZ0FwcC5zZXRDb250cm9sUHJvcHMoJChlbGVtKSwgcHJvcHMpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRDb250cm9sRGVzY1RleHRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0Q29udHJvbERlc2NUZXh0KHBsdWdpblNldHRpbmcsIHByb3BzKSB7XG4gICAgICByZXR1cm4gXCJbXCIgKyBwbHVnaW5TZXR0aW5nLlRvb2xiYXJMYWJlbCArIFwiXSDnu5Hlrpo6W1wiICsgcHJvcHMuYmluZFRvRmllbGQudGFibGVDYXB0aW9uICsgXCItXCIgKyBwcm9wcy5iaW5kVG9GaWVsZC5maWVsZENhcHRpb24gKyBcIl1cIjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0U2VhcmNoQ29udHJvbERlc2NUZXh0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFNlYXJjaENvbnRyb2xEZXNjVGV4dChwbHVnaW5TZXR0aW5nLCBwcm9wcykge1xuICAgICAgcmV0dXJuIFwiW1wiICsgcGx1Z2luU2V0dGluZy5Ub29sYmFyTGFiZWwgKyBcIl0g57uR5a6aOltcIiArIHByb3BzLmJpbmRUb1NlYXJjaEZpZWxkLmNvbHVtbkNhcHRpb24gKyBcIl0oXCIgKyBwcm9wcy5iaW5kVG9TZWFyY2hGaWVsZC5jb2x1bW5PcGVyYXRvciArIFwiKVwiO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRBdXRvUmVtb3ZlVGlwTGFiZWxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0QXV0b1JlbW92ZVRpcExhYmVsKHRpcE1zZykge1xuICAgICAgaWYgKCF0aXBNc2cpIHtcbiAgICAgICAgdGlwTXNnID0gXCLlj4zlh7vnvJbovpHor6Xpg6jku7ZcIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8ZGl2IHJ1bnRpbWVfYXV0b19yZW1vdmU9XCJ0cnVlXCIgY2xhc3M9XCJ3eXNpd3lnLWF1dG8tcmVtb3ZlLXRpcFwiPicgKyB0aXBNc2cgKyAnPC9kaXY+JztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiVHJ5R2V0TGlzdEJ1dHRvbnNJblBsdWdpblBhZ2VcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gVHJ5R2V0TGlzdEJ1dHRvbnNJblBsdWdpblBhZ2UoKSB7XG4gICAgICB2YXIgYnV0dG9ucyA9IFtdO1xuICAgICAgdmFyIGh0bWwgPSBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JIVE1MSW5QbHVnaW5QYWdlKCk7XG4gICAgICB2YXIgJGJ1dHRvbnMgPSAkKGh0bWwpLmZpbmQoXCJbYnV0dG9uY2FwdGlvbl1cIik7XG4gICAgICAkYnV0dG9ucy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGJ1dHRvbkNhcHRpb24gPSAkKHRoaXMpLmF0dHIoXCJidXR0b25jYXB0aW9uXCIpO1xuICAgICAgICB2YXIgYnV0dG9uSWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgYnV0dG9ucy5wdXNoKHtcbiAgICAgICAgICBidXR0b25DYXB0aW9uOiBidXR0b25DYXB0aW9uLFxuICAgICAgICAgIGJ1dHRvbklkOiBidXR0b25JZFxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGJ1dHRvbnM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlRyeUdldERhdGFTZXRJZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBUcnlHZXREYXRhU2V0SWQoc2VsLCBwYXJlbnRzKSB7XG4gICAgICBpZiAoc2VsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSBwYXJlbnRzLmxlbmd0aCAtIDE7IGktLTsgaSA+PSAwKSB7XG4gICAgICAgICAgaWYgKHBhcmVudHNbaV0uZ2V0QXR0cmlidXRlKFwiZGF0YXNldGlkXCIpICE9IG51bGwgJiYgcGFyZW50c1tpXS5nZXRBdHRyaWJ1dGUoXCJkYXRhc2V0aWRcIikgIT0gXCJcIikge1xuICAgICAgICAgICAgcmV0dXJuIHBhcmVudHNbaV0uZ2V0QXR0cmlidXRlKFwiZGF0YXNldGlkXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoIXRoaXMuZGF0YVNldElkKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cucGFyZW50Lmxpc3REZXNpZ24ubGlzdFJlc291cmNlRW50aXR5Lmxpc3REYXRhc2V0SWQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDS0VkaXRvclBsdWdpblV0aWxpdHk7XG59KCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiUGx1Z2luc1NlcnZlckNvbmZpZ1wiLCB7fSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiUGx1Z2luc1wiLCB7fSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiRGVmYXVsdFByb3BzXCIsIHtcbiAgYmluZFRvRmllbGQ6IHtcbiAgICB0YWJsZUlkOiBcIlwiLFxuICAgIHRhYmxlTmFtZTogXCJcIixcbiAgICB0YWJsZUNhcHRpb246IFwiXCIsXG4gICAgZmllbGROYW1lOiBcIlwiLFxuICAgIGZpZWxkQ2FwdGlvbjogXCJcIixcbiAgICBmaWVsZERhdGFUeXBlOiBcIlwiLFxuICAgIGZpZWxkTGVuZ3RoOiBcIlwiXG4gIH0sXG4gIGRlZmF1bHRWYWx1ZToge1xuICAgIGRlZmF1bHRUeXBlOiBcIlwiLFxuICAgIGRlZmF1bHRWYWx1ZTogXCJcIixcbiAgICBkZWZhdWx0VGV4dDogXCJcIlxuICB9LFxuICB2YWxpZGF0ZVJ1bGVzOiB7XG4gICAgbXNnOiBcIlwiLFxuICAgIHJ1bGVzOiBbXVxuICB9LFxuICBiYXNlSW5mbzoge1xuICAgIGlkOiBcIlwiLFxuICAgIHNlcmlhbGl6ZTogXCJ0cnVlXCIsXG4gICAgbmFtZTogXCJcIixcbiAgICBjbGFzc05hbWU6IFwiXCIsXG4gICAgcGxhY2Vob2xkZXI6IFwiXCIsXG4gICAgcmVhZG9ubHk6IFwibm9yZWFkb25seVwiLFxuICAgIGRpc2FibGVkOiBcIm5vZGlzYWJsZWRcIixcbiAgICBzdHlsZTogXCJcIixcbiAgICBkZXNjOiBcIlwiXG4gIH0sXG4gIGJpbmRUb1NlYXJjaEZpZWxkOiB7XG4gICAgY29sdW1uVGl0bGU6IFwiXCIsXG4gICAgY29sdW1uVGFibGVOYW1lOiBcIlwiLFxuICAgIGNvbHVtbk5hbWU6IFwiXCIsXG4gICAgY29sdW1uQ2FwdGlvbjogXCJcIixcbiAgICBjb2x1bW5EYXRhVHlwZU5hbWU6IFwiXCIsXG4gICAgY29sdW1uT3BlcmF0b3I6IFwi5Yy56YWNXCJcbiAgfVxufSk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclBsdWdpblV0aWxpdHksIFwiRGlhbG9nRXhlY3V0ZUVkaXRBY3Rpb25OYW1lXCIsIFwiRWRpdFwiKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yUGx1Z2luVXRpbGl0eSwgXCJEaWFsb2dFeGVjdXRlSW5zZXJ0QWN0aW9uTmFtZVwiLCBcIkluc2VydFwiKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgQ0tFZGl0b3JVdGlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDS0VkaXRvclV0aWxpdHkoKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIENLRWRpdG9yVXRpbGl0eSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoQ0tFZGl0b3JVdGlsaXR5LCBudWxsLCBbe1xuICAgIGtleTogXCJTZXRTZWxlY3RlZEVsZW1cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gU2V0U2VsZWN0ZWRFbGVtKGVsZW1IdG1sKSB7XG4gICAgICB0aGlzLl8kQ0tFZGl0b3JTZWxlY3RFbGVtID0gJChlbGVtSHRtbCk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldFNlbGVjdGVkRWxlbVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRTZWxlY3RlZEVsZW0oKSB7XG4gICAgICBpZiAodGhpcy5fJENLRWRpdG9yU2VsZWN0RWxlbSkge1xuICAgICAgICBpZiAodGhpcy5fJENLRWRpdG9yU2VsZWN0RWxlbS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuXyRDS0VkaXRvclNlbGVjdEVsZW07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldFNlbGVjdGVkQ0tFZGl0b3JFbGVtXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFNlbGVjdGVkQ0tFZGl0b3JFbGVtKCkge1xuICAgICAgaWYgKHRoaXMuR2V0U2VsZWN0ZWRFbGVtKCkpIHtcbiAgICAgICAgdmFyIGlkID0gdGhpcy5HZXRTZWxlY3RlZEVsZW0oKS5hdHRyKFwiaWRcIik7XG4gICAgICAgIHZhciBlbGVtZW50ID0gdGhpcy5HZXRDS0VkaXRvckluc3QoKS5kb2N1bWVudC5nZXRCeUlkKGlkKTtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRDS0VkaXRvckluc3RcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0Q0tFZGl0b3JJbnN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX0NLRWRpdG9ySW5zdDtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0Q0tFZGl0b3JJbnN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldENLRWRpdG9ySW5zdChpbnN0KSB7XG4gICAgICB0aGlzLl9DS0VkaXRvckluc3QgPSBpbnN0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRDS0VkaXRvckhUTUxcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gR2V0Q0tFZGl0b3JIVE1MKCkge1xuICAgICAgdGhpcy5DbGVhckFMTEZvckRpdkVsZW1CdXR0b24oKTtcbiAgICAgIHJldHVybiB0aGlzLkdldENLRWRpdG9ySW5zdCgpLmdldERhdGEoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0Q0tFZGl0b3JIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldENLRWRpdG9ySFRNTChodG1sKSB7XG4gICAgICB0aGlzLkdldENLRWRpdG9ySW5zdCgpLnNldERhdGEoaHRtbCk7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgIENLRWRpdG9yVXRpbGl0eS5BTExFbGVtQmluZERlZmF1bHRFdmVudCgpO1xuICAgICAgfSwgNTAwKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiR2V0Q0tFZGl0b3JIVE1MSW5QbHVnaW5QYWdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldENLRWRpdG9ySFRNTEluUGx1Z2luUGFnZSgpIHtcbiAgICAgIHJldHVybiB3aW5kb3cucGFyZW50LkNLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckhUTUwoKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiSW5pdGlhbGl6ZUNLRWRpdG9yXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEluaXRpYWxpemVDS0VkaXRvcih0ZXh0QXJlYUVsZW1JZCwgcGx1Z2luc0NvbmZpZywgbG9hZENvbXBsZXRlZEZ1bmMsIGNrZWRpdG9yQ29uZmlnRnVsbFBhdGgsIHBsdWdpbkJhc2VQYXRoLCB0aGVtZVZvKSB7XG4gICAgICB2YXIgZXh0cmFQbHVnaW5zID0gbmV3IEFycmF5KCk7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGx1Z2luc0NvbmZpZy5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgc2luZ2xlUGx1Z2luQ29uZmlnID0gcGx1Z2luc0NvbmZpZ1tpXTtcbiAgICAgICAgdmFyIHNpbmdsZU5hbWUgPSBzaW5nbGVQbHVnaW5Db25maWcuc2luZ2xlTmFtZTtcbiAgICAgICAgdmFyIHRvb2xiYXJMb2NhdGlvbiA9IHNpbmdsZVBsdWdpbkNvbmZpZy50b29sYmFyTG9jYXRpb247XG4gICAgICAgIHZhciB0ZXh0ID0gc2luZ2xlUGx1Z2luQ29uZmlnLnRleHQ7XG4gICAgICAgIHZhciBzZXJ2ZXJSZXNvbHZlID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNlcnZlclJlc29sdmU7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlID0gc2luZ2xlUGx1Z2luQ29uZmlnLmNsaWVudFJlc29sdmU7XG4gICAgICAgIHZhciBjbGllbnRSZXNvbHZlSnMgPSBzaW5nbGVQbHVnaW5Db25maWcuY2xpZW50UmVzb2x2ZUpzO1xuICAgICAgICB2YXIgZGlhbG9nV2lkdGggPSBzaW5nbGVQbHVnaW5Db25maWcuZGlhbG9nV2lkdGg7XG4gICAgICAgIHZhciBkaWFsb2dIZWlnaHQgPSBzaW5nbGVQbHVnaW5Db25maWcuZGlhbG9nSGVpZ2h0O1xuICAgICAgICB2YXIgaXNKQnVpbGQ0RERhdGEgPSBzaW5nbGVQbHVnaW5Db25maWcuaXNKQnVpbGQ0RERhdGE7XG4gICAgICAgIHZhciBjb250cm9sQ2F0ZWdvcnkgPSBzaW5nbGVQbHVnaW5Db25maWcuY29udHJvbENhdGVnb3J5O1xuICAgICAgICB2YXIgc2VydmVyRHluYW1pY0JpbmQgPSBzaW5nbGVQbHVnaW5Db25maWcuc2VydmVyRHluYW1pY0JpbmQ7XG4gICAgICAgIHZhciBzaG93UmVtb3ZlQnV0dG9uID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNob3dSZW1vdmVCdXR0b247XG4gICAgICAgIHZhciBzaG93SW5FZGl0b3JUb29sYmFyID0gc2luZ2xlUGx1Z2luQ29uZmlnLnNob3dJbkVkaXRvclRvb2xiYXI7XG4gICAgICAgIHZhciBwbHVnaW5GaWxlTmFtZSA9IHNpbmdsZU5hbWUgKyBcIlBsdWdpbi5qc1wiO1xuICAgICAgICB2YXIgcGx1Z2luRm9sZGVyTmFtZSA9IHBsdWdpbkJhc2VQYXRoICsgc2luZ2xlTmFtZSArIFwiL1wiO1xuICAgICAgICBDS0VESVRPUi5wbHVnaW5zLmFkZEV4dGVybmFsKHNpbmdsZU5hbWUsIHBsdWdpbkZvbGRlck5hbWUsIHBsdWdpbkZpbGVOYW1lKTtcbiAgICAgICAgZXh0cmFQbHVnaW5zLnB1c2goc2luZ2xlTmFtZSk7XG4gICAgICAgIENLRWRpdG9yUGx1Z2luVXRpbGl0eS5BZGRQbHVnaW5zU2VydmVyQ29uZmlnKHNpbmdsZU5hbWUsIHRvb2xiYXJMb2NhdGlvbiwgdGV4dCwgY2xpZW50UmVzb2x2ZSwgc2VydmVyUmVzb2x2ZSwgY2xpZW50UmVzb2x2ZUpzLCBkaWFsb2dXaWR0aCwgZGlhbG9nSGVpZ2h0LCBpc0pCdWlsZDRERGF0YSwgY29udHJvbENhdGVnb3J5LCBzZXJ2ZXJEeW5hbWljQmluZCwgc2hvd1JlbW92ZUJ1dHRvbiwgc2hvd0luRWRpdG9yVG9vbGJhcik7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuU2V0VGhlbWVWbyh0aGVtZVZvKTtcbiAgICAgIHZhciBlZGl0b3JDb25maWdVcmwgPSBCYXNlVXRpbGl0eS5BcHBlbmRUaW1lU3RhbXBVcmwoY2tlZGl0b3JDb25maWdGdWxsUGF0aCk7XG4gICAgICBDS0VESVRPUi5yZXBsYWNlKHRleHRBcmVhRWxlbUlkLCB7XG4gICAgICAgIGN1c3RvbUNvbmZpZzogZWRpdG9yQ29uZmlnVXJsLFxuICAgICAgICBleHRyYVBsdWdpbnM6IGV4dHJhUGx1Z2lucy5qb2luKFwiLFwiKVxuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oXCJiZWZvcmVQYXN0ZVwiLCBmdW5jdGlvbiAoZXZlbnQpIHt9KTtcbiAgICAgIENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbi5vbihcInBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICB2YXIgc291cmNlSFRNTCA9IGV2ZW50LmRhdGEuZGF0YVZhbHVlO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyICRzb3VyY2VIVE1MID0gJChzb3VyY2VIVE1MKTtcbiAgICAgICAgICAkc291cmNlSFRNTC5maW5kKFwiLmRlbC1idXR0b25cIikucmVtb3ZlKCk7XG5cbiAgICAgICAgICBpZiAoJHNvdXJjZUhUTUwuZmluZChcImRpdlwiKS5sZW5ndGggPT0gMSkge1xuICAgICAgICAgICAgZXZlbnQuZGF0YS5kYXRhVmFsdWUgPSAkc291cmNlSFRNTC5maW5kKFwiZGl2XCIpLm91dGVySFRNTCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGV2ZW50LmRhdGEuZGF0YVZhbHVlID0gc291cmNlSFRNTDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oXCJhZnRlclBhc3RlXCIsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBDS0VkaXRvclV0aWxpdHkuQUxMRWxlbUJpbmREZWZhdWx0RXZlbnQoKTtcbiAgICAgIH0pO1xuICAgICAgQ0tFRElUT1IuaW5zdGFuY2VzLmh0bWxfZGVzaWduLm9uKCdpbnNlcnRFbGVtZW50JywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiaW5zZXJ0RWxlbWVudFwiKTtcbiAgICAgICAgY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgfSk7XG4gICAgICBDS0VESVRPUi5pbnN0YW5jZXMuaHRtbF9kZXNpZ24ub24oJ2luc2VydEh0bWwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJpbnNlcnRIdG1sXCIpO1xuICAgICAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuU2V0Q0tFZGl0b3JJbnN0KENLRURJVE9SLmluc3RhbmNlcy5odG1sX2Rlc2lnbik7XG4gICAgICBDS0VESVRPUi5vbignaW5zdGFuY2VSZWFkeScsIGZ1bmN0aW9uIChlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbG9hZENvbXBsZXRlZEZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgbG9hZENvbXBsZXRlZEZ1bmMoKTtcbiAgICAgICAgICA7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRUaGVtZVZvXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldFRoZW1lVm8oKSB7XG4gICAgICByZXR1cm4gdGhpcy5fVGhlbWVWbztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiU2V0VGhlbWVWb1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRUaGVtZVZvKF90aGVtZVZvKSB7XG4gICAgICB0aGlzLl9UaGVtZVZvID0gX3RoZW1lVm87XG4gICAgICB0aGlzLlJlc2V0Um9vdEVsZW1UaGVtZShfdGhlbWVWbyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIlJlc2V0Um9vdEVsZW1UaGVtZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBSZXNldFJvb3RFbGVtVGhlbWUoX3RoZW1lVm8pIHtcbiAgICAgIGlmICh0aGlzLkdldENLRWRpdG9ySW5zdCgpKSB7XG4gICAgICAgIHZhciBzb3VyY2VIVE1MID0gdGhpcy5HZXRDS0VkaXRvckhUTUwoKTtcblxuICAgICAgICBpZiAoc291cmNlSFRNTCAhPSBudWxsICYmIHNvdXJjZUhUTUwgIT0gXCJcIikge1xuICAgICAgICAgIHZhciByb290RWxlbSA9ICQoc291cmNlSFRNTCk7XG5cbiAgICAgICAgICBpZiAocm9vdEVsZW0uYXR0cihcImlzX2NvbnRhaW5lcl9yb290XCIpICE9IFwidHJ1ZVwiKSB7XG4gICAgICAgICAgICByb290RWxlbSA9ICQoc291cmNlSFRNTCkuZmluZChcIltpc19jb250YWluZXJfcm9vdF1cIik7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHJvb3RFbGVtLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHZhciBjbGFzc0xpc3QgPSByb290RWxlbS5hdHRyKCdjbGFzcycpLnNwbGl0KC9cXHMrLyk7XG4gICAgICAgICAgICB2YXIgY2xhc3NhcnkgPSBbXTtcbiAgICAgICAgICAgICQuZWFjaChjbGFzc0xpc3QsIGZ1bmN0aW9uIChpbmRleCwgaXRlbSkge1xuICAgICAgICAgICAgICBpZiAoaXRlbS5pbmRleE9mKCdodG1sLWRlc2lnbi10aGVtZS0nKSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcm9vdEVsZW0ucmVtb3ZlQ2xhc3MoaXRlbSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcm9vdEVsZW0uYWRkQ2xhc3MoX3RoZW1lVm8ucm9vdEVsZW1DbGFzcyk7XG4gICAgICAgICAgICB0aGlzLlNldENLRWRpdG9ySFRNTChyb290RWxlbS5vdXRlckhUTUwoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkNsZWFyQUxMRm9yRGl2RWxlbUJ1dHRvblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBDbGVhckFMTEZvckRpdkVsZW1CdXR0b24oKSB7XG4gICAgICB2YXIgb2xkRGVsQnV0dG9ucyA9IENLRWRpdG9yVXRpbGl0eS5HZXRDS0VkaXRvckluc3QoKS5kb2N1bWVudC5maW5kKFwiLmRlbC1idXR0b25cIik7XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2xkRGVsQnV0dG9ucy5jb3VudCgpOyBpKyspIHtcbiAgICAgICAgb2xkRGVsQnV0dG9ucy5nZXRJdGVtKGkpLnJlbW92ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTaW5nbGVFbGVtQmluZERlZmF1bHRFdmVudFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTaW5nbGVFbGVtQmluZERlZmF1bHRFdmVudChlbGVtKSB7XG4gICAgICBpZiAoZWxlbS5nZXRBdHRyaWJ1dGUoXCJzaG93X3JlbW92ZV9idXR0b25cIikgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgZWxlbS5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LkdldENLRWRpdG9ySW5zdCgpLmdldFNlbGVjdGlvbigpLnNlbGVjdEVsZW1lbnQodGhpcyk7XG4gICAgICAgICAgQ0tFZGl0b3JVdGlsaXR5LlNldFNlbGVjdGVkRWxlbSh0aGlzLmdldE91dGVySHRtbCgpKTtcbiAgICAgICAgICBDS0VkaXRvclV0aWxpdHkuQ2xlYXJBTExGb3JEaXZFbGVtQnV0dG9uKCk7XG4gICAgICAgICAgdmFyIG5ld0RlbEJ1dHRvbiA9IG5ldyBDS0VESVRPUi5kb20uZWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgbmV3RGVsQnV0dG9uLmFkZENsYXNzKFwiZGVsLWJ1dHRvblwiKTtcbiAgICAgICAgICBlbGVtLmFwcGVuZChuZXdEZWxCdXR0b24pO1xuICAgICAgICAgIG5ld0RlbEJ1dHRvbi5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBlbGVtLnJlbW92ZSgpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiQUxMRWxlbUJpbmREZWZhdWx0RXZlbnRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gQUxMRWxlbUJpbmREZWZhdWx0RXZlbnQoKSB7XG4gICAgICB2YXIgZWxlbWVudHMgPSBDS0VkaXRvclV0aWxpdHkuR2V0Q0tFZGl0b3JJbnN0KCkuZG9jdW1lbnQuZ2V0Qm9keSgpLmdldEVsZW1lbnRzQnlUYWcoJyonKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtZW50cy5jb3VudCgpOyArK2kpIHtcbiAgICAgICAgdmFyIGVsZW0gPSBlbGVtZW50cy5nZXRJdGVtKGkpO1xuICAgICAgICB0aGlzLlNpbmdsZUVsZW1CaW5kRGVmYXVsdEV2ZW50KGVsZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfV0pO1xuXG4gIHJldHVybiBDS0VkaXRvclV0aWxpdHk7XG59KCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclV0aWxpdHksIFwiXyRDS0VkaXRvclNlbGVjdEVsZW1cIiwgbnVsbCk7XG5cbl9kZWZpbmVQcm9wZXJ0eShDS0VkaXRvclV0aWxpdHksIFwiX0NLRWRpdG9ySW5zdFwiLCBudWxsKTtcblxuX2RlZmluZVByb3BlcnR5KENLRWRpdG9yVXRpbGl0eSwgXCJfVGhlbWVWb1wiLCBudWxsKTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3RvcikgeyBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkgeyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpOyB9IH1cblxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykgeyBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7IHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07IGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTsgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlOyBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlOyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBkZXNjcmlwdG9yLmtleSwgZGVzY3JpcHRvcik7IH0gfVxuXG5mdW5jdGlvbiBfY3JlYXRlQ2xhc3MoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7IGlmIChwcm90b1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvci5wcm90b3R5cGUsIHByb3RvUHJvcHMpOyBpZiAoc3RhdGljUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7IHJldHVybiBDb25zdHJ1Y3RvcjsgfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHZhbHVlKSB7IGlmIChrZXkgaW4gb2JqKSB7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgeyB2YWx1ZTogdmFsdWUsIGVudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZSwgd3JpdGFibGU6IHRydWUgfSk7IH0gZWxzZSB7IG9ialtrZXldID0gdmFsdWU7IH0gcmV0dXJuIG9iajsgfVxuXG52YXIgSFRNTEVkaXRvclV0aWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEhUTUxFZGl0b3JVdGlsaXR5KCkge1xuICAgIF9jbGFzc0NhbGxDaGVjayh0aGlzLCBIVE1MRWRpdG9yVXRpbGl0eSk7XG4gIH1cblxuICBfY3JlYXRlQ2xhc3MoSFRNTEVkaXRvclV0aWxpdHksIG51bGwsIFt7XG4gICAga2V5OiBcIkdldEhUTUxFZGl0b3JJbnN0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEhUTUxFZGl0b3JJbnN0KCkge1xuICAgICAgcmV0dXJuIHRoaXMuX0hUTUxFZGl0b3JJbnN0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTZXRIVE1MRWRpdG9ySFRNTFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBTZXRIVE1MRWRpdG9ySFRNTChodG1sKSB7XG4gICAgICBpZiAoIVN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShodG1sKSkge1xuICAgICAgICB0aGlzLkdldEhUTUxFZGl0b3JJbnN0KCkuc2V0VmFsdWUoaHRtbCk7XG4gICAgICAgIENvZGVNaXJyb3IuY29tbWFuZHNbXCJzZWxlY3RBbGxcIl0odGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpKTtcbiAgICAgICAgdmFyIHJhbmdlID0ge1xuICAgICAgICAgIGZyb206IHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXRDdXJzb3IodHJ1ZSksXG4gICAgICAgICAgdG86IHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXRDdXJzb3IoZmFsc2UpXG4gICAgICAgIH07XG4gICAgICAgIDtcbiAgICAgICAgdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmF1dG9Gb3JtYXRSYW5nZShyYW5nZS5mcm9tLCByYW5nZS50byk7XG4gICAgICAgIHZhciBhMSA9IHtcbiAgICAgICAgICBsaW5lOiAwLFxuICAgICAgICAgIGNoOiAyXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXREb2MoKS5lYWNoTGluZShmdW5jdGlvbiAobGluZSkge30pO1xuICAgICAgICB2YXIgc2VsZWN0ZWRFbGVtID0gQ0tFZGl0b3JVdGlsaXR5LkdldFNlbGVjdGVkRWxlbSgpO1xuICAgICAgICB2YXIgc2VhcmNoSFRNTCA9IFwiXCI7XG5cbiAgICAgICAgaWYgKHNlbGVjdGVkRWxlbSkge1xuICAgICAgICAgIHNlYXJjaEhUTUwgPSBzZWxlY3RlZEVsZW0ub3V0ZXJIVE1MKCkuc3BsaXQoXCI+XCIpWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc29sZS5sb2coXCItLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXCIpO1xuICAgICAgICB2YXIgY3Vyc29yID0gdGhpcy5HZXRIVE1MRWRpdG9ySW5zdCgpLmdldFNlYXJjaEN1cnNvcihzZWFyY2hIVE1MKTtcbiAgICAgICAgY3Vyc29yLmZpbmROZXh0KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGN1cnNvcik7XG4gICAgICAgIGNvbnNvbGUubG9nKGN1cnNvci5mcm9tKCkgKyBcInxcIiArIGN1cnNvci50bygpKTtcblxuICAgICAgICBpZiAoY3Vyc29yLmZyb20oKSAmJiBjdXJzb3IudG8oKSkge1xuICAgICAgICAgIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXREb2MoKS5zZXRTZWxlY3Rpb24oY3Vyc29yLmZyb20oKSwgY3Vyc29yLnRvKCkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEh0bWxFZGl0b3JIVE1MXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEh0bWxFZGl0b3JIVE1MKCkge1xuICAgICAgcmV0dXJuIHRoaXMuR2V0SFRNTEVkaXRvckluc3QoKS5nZXRWYWx1ZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJJbml0aWFsaXplSFRNTENvZGVEZXNpZ25cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gSW5pdGlhbGl6ZUhUTUxDb2RlRGVzaWduKCkge1xuICAgICAgdmFyIG1peGVkTW9kZSA9IHtcbiAgICAgICAgbmFtZTogXCJodG1sbWl4ZWRcIixcbiAgICAgICAgc2NyaXB0VHlwZXM6IFt7XG4gICAgICAgICAgbWF0Y2hlczogL1xcL3gtaGFuZGxlYmFycy10ZW1wbGF0ZXxcXC94LW11c3RhY2hlL2ksXG4gICAgICAgICAgbW9kZTogbnVsbFxuICAgICAgICB9LCB7XG4gICAgICAgICAgbWF0Y2hlczogLyh0ZXh0fGFwcGxpY2F0aW9uKVxcLyh4LSk/dmIoYXxzY3JpcHQpL2ksXG4gICAgICAgICAgbW9kZTogXCJ2YnNjcmlwdFwiXG4gICAgICAgIH1dXG4gICAgICB9O1xuICAgICAgdGhpcy5fSFRNTEVkaXRvckluc3QgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYShkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIlRleHRBcmVhSFRNTEVkaXRvclwiKSwge1xuICAgICAgICBtb2RlOiBtaXhlZE1vZGUsXG4gICAgICAgIHNlbGVjdGlvblBvaW50ZXI6IHRydWUsXG4gICAgICAgIHRoZW1lOiBcIm1vbm9rYWlcIixcbiAgICAgICAgZm9sZEd1dHRlcjogdHJ1ZSxcbiAgICAgICAgZ3V0dGVyczogW1wiQ29kZU1pcnJvci1saW5lbnVtYmVyc1wiLCBcIkNvZGVNaXJyb3ItZm9sZGd1dHRlclwiXSxcbiAgICAgICAgbGluZU51bWJlcnM6IHRydWUsXG4gICAgICAgIGxpbmVXcmFwcGluZzogdHJ1ZVxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuX0hUTUxFZGl0b3JJbnN0LnNldFNpemUoXCIxMDAlXCIsIFBhZ2VTdHlsZVV0aWxpdHkuR2V0V2luZG93SGVpZ2h0KCkgLSA4NSk7XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEhUTUxFZGl0b3JVdGlsaXR5O1xufSgpO1xuXG5fZGVmaW5lUHJvcGVydHkoSFRNTEVkaXRvclV0aWxpdHksIFwiX0hUTUxFZGl0b3JJbnN0XCIsIG51bGwpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfY2xhc3NDYWxsQ2hlY2soaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7IGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7IH0gfVxuXG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTsgfSB9XG5cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHsgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7IGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTsgcmV0dXJuIENvbnN0cnVjdG9yOyB9XG5cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5cbnZhciBKc0VkaXRvclV0aWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIEpzRWRpdG9yVXRpbGl0eSgpIHtcbiAgICBfY2xhc3NDYWxsQ2hlY2sodGhpcywgSnNFZGl0b3JVdGlsaXR5KTtcbiAgfVxuXG4gIF9jcmVhdGVDbGFzcyhKc0VkaXRvclV0aWxpdHksIG51bGwsIFt7XG4gICAga2V5OiBcIl9HZXROZXdGb3JtSnNTdHJpbmdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gX0dldE5ld0Zvcm1Kc1N0cmluZygpIHtcbiAgICAgIHJldHVybiBcIjxzY3JpcHQ+dmFyIEZvcm1QYWdlT2JqZWN0SW5zdGFuY2U9e1wiICsgXCJkYXRhOntcIiArIFwidXNlckVudGl0eTp7fSxcIiArIFwiZm9ybUVudGl0eTpbXSxcIiArIFwiY29uZmlnOltdXCIgKyBcIn0sXCIgKyBcInBhZ2VSZWFkeTpmdW5jdGlvbigpe30sXCIgKyBcImJpbmRSZWNvcmREYXRhUmVhZHk6ZnVuY3Rpb24oKXt9LFwiICsgXCJ2YWxpZGF0ZUV2ZXJ5RnJvbUNvbnRyb2w6ZnVuY3Rpb24oY29udHJvbE9iail7fVwiICsgXCJ9PC9zY3JpcHQ+XCI7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcIkdldEpzRWRpdG9ySW5zdFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBHZXRKc0VkaXRvckluc3QoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fSnNFZGl0b3JJbnN0O1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJTZXRKc0VkaXRvckpzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIFNldEpzRWRpdG9ySnMoanMpIHtcbiAgICAgIHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuc2V0VmFsdWUoanMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJHZXRKc0VkaXRvckpzXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEdldEpzRWRpdG9ySnMoKSB7XG4gICAgICByZXR1cm4gdGhpcy5HZXRKc0VkaXRvckluc3QoKS5nZXRWYWx1ZSgpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJJbml0aWFsaXplSnNDb2RlRGVzaWduXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIEluaXRpYWxpemVKc0NvZGVEZXNpZ24oc3RhdHVzKSB7XG4gICAgICB0aGlzLl9Kc0VkaXRvckluc3QgPSBDb2RlTWlycm9yLmZyb21UZXh0QXJlYSgkKFwiI1RleHRBcmVhSnNFZGl0b3JcIilbMF0sIHtcbiAgICAgICAgbW9kZTogXCJhcHBsaWNhdGlvbi9sZCtqc29uXCIsXG4gICAgICAgIGxpbmVOdW1iZXJzOiB0cnVlLFxuICAgICAgICBsaW5lV3JhcHBpbmc6IHRydWUsXG4gICAgICAgIGV4dHJhS2V5czoge1xuICAgICAgICAgIFwiQ3RybC1RXCI6IGZ1bmN0aW9uIEN0cmxRKGNtKSB7XG4gICAgICAgICAgICBjbS5mb2xkQ29kZShjbS5nZXRDdXJzb3IoKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmb2xkR3V0dGVyOiB0cnVlLFxuICAgICAgICBzbWFydEluZGVudDogdHJ1ZSxcbiAgICAgICAgbWF0Y2hCcmFja2V0czogdHJ1ZSxcbiAgICAgICAgdGhlbWU6IFwibW9ub2thaVwiLFxuICAgICAgICBndXR0ZXJzOiBbXCJDb2RlTWlycm9yLWxpbmVudW1iZXJzXCIsIFwiQ29kZU1pcnJvci1mb2xkZ3V0dGVyXCJdXG4gICAgICB9KTtcblxuICAgICAgdGhpcy5fSnNFZGl0b3JJbnN0LnNldFNpemUoXCIxMDAlXCIsIFBhZ2VTdHlsZVV0aWxpdHkuR2V0V2luZG93SGVpZ2h0KCkgLSA4NSk7XG5cbiAgICAgIGlmIChzdGF0dXMgPT0gXCJhZGRcIikge1xuICAgICAgICB0aGlzLlNldEpzRWRpdG9ySnModGhpcy5fR2V0TmV3Rm9ybUpzU3RyaW5nKCkpO1xuICAgICAgICBDb2RlTWlycm9yLmNvbW1hbmRzW1wic2VsZWN0QWxsXCJdKHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkpO1xuICAgICAgICB2YXIgcmFuZ2UgPSB7XG4gICAgICAgICAgZnJvbTogdGhpcy5HZXRKc0VkaXRvckluc3QoKS5nZXRDdXJzb3IodHJ1ZSksXG4gICAgICAgICAgdG86IHRoaXMuR2V0SnNFZGl0b3JJbnN0KCkuZ2V0Q3Vyc29yKGZhbHNlKVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLkdldEpzRWRpdG9ySW5zdCgpLmF1dG9Gb3JtYXRSYW5nZShyYW5nZS5mcm9tLCByYW5nZS50byk7XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG5cbiAgcmV0dXJuIEpzRWRpdG9yVXRpbGl0eTtcbn0oKTtcblxuX2RlZmluZVByb3BlcnR5KEpzRWRpdG9yVXRpbGl0eSwgXCJfSnNFZGl0b3JJbnN0XCIsIG51bGwpOyJdfQ==
