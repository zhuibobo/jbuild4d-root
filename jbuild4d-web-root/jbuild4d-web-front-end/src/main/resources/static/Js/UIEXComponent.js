"use strict";

if (!Object.create) {
  Object.create = function () {
    function F() {}

    return function (o) {
      if (arguments.length != 1) {
        throw new Error('Object.create implementation only accepts one parameter.');
      }

      F.prototype = o;
      return new F();
    };
  }();
}

var EditTableConfig = {
  Status: "Edit",
  Templates: [{
    Title: "表名1",
    FieldName: "TableField",
    Renderer: "EditTable_TextBox",
    TitleCellClassName: "TitleCell",
    Hidden: false,
    TitleCellAttrs: {}
  }, {
    Title: "字段类型",
    FieldName: "TableField",
    Renderer: "EditTable_TextBox",
    Hidden: false
  }, {
    Title: "备注",
    FieldName: "TableField",
    Renderer: "EditTable_TextBox",
    Hidden: false
  }],
  RowIdCreater: function RowIdCreater() {},
  TableClass: "EditTable",
  RendererTo: "divTreeTable",
  TableId: "EditTable",
  TableAttrs: {
    cellpadding: "1",
    cellspacing: "1",
    border: "1"
  }
};
var EditTableData = {};
"use strict";

var EditTable = {
  _$Prop_TableElem: null,
  _$Prop_RendererToElem: null,
  _Prop_ConfigManager: null,
  _Prop_JsonData: new Object(),
  _$Prop_EditingRowElem: null,
  _Status: "Edit",
  Initialization: function Initialization(_config) {
    this._Prop_ConfigManager = Object.create(EditTableConfigManager);

    this._Prop_ConfigManager.InitializationConfig(_config);

    var _C = this._Prop_ConfigManager.GetConfig();

    this._$Prop_RendererToElem = $("#" + _C.RendererTo);
    this._$Prop_TableElem = this.CreateTable();

    this._$Prop_TableElem.append(this.CreateTableTitleRow());

    this._$Prop_RendererToElem.append(this._$Prop_TableElem);

    if (_C.Status) {
      this._Status = _C.Status;
    }
  },
  LoadJsonData: function LoadJsonData(jsonData) {
    if (jsonData != null && jsonData != undefined) {
      for (var i = 0; i < jsonData.length; i++) {
        var item = jsonData[i];
        var rowId = this.AddEditingRowByTemplate(jsonData, item);
        this._Prop_JsonData[rowId] = item;
      }

      this.CompletedEditingRow();
    } else {
      alert("Json Data Object Error");
    }
  },
  CreateTable: function CreateTable() {
    var _C = this._Prop_ConfigManager.GetConfig();

    var _editTable = $("<table />");

    _editTable.addClass(_C.TableClass);

    _editTable.attr("Id", _C.TableId);

    _editTable.attr(_C.TableAttrs);

    return _editTable;
  },
  CreateTableTitleRow: function CreateTableTitleRow() {
    var _C = this._Prop_ConfigManager.GetConfig();

    var _titleRow = $("<tr isHeader='true' />");

    for (var i = 0; i < _C.Templates.length; i++) {
      var template = _C.Templates[i];
      var title = template.Title;
      var th = $("<th>" + title + "</th>");

      if (template.TitleCellClassName) {
        th.addClass(template.TitleCellClassName);
      }

      if (template.TitleCellAttrs) {
        th.attr(template.TitleCellAttrs);
      }

      if (typeof template.Hidden != 'undefined' && template.Hidden == true) {
        th.hide();
      }

      _titleRow.append(th);
    }

    var _titleRowHead = $("<thead></thead>");

    _titleRowHead.append(_titleRow);

    return _titleRowHead;
  },
  AddEmptyEditingRowByTemplate: function AddEmptyEditingRowByTemplate(callbackfun) {
    var rowId = this.AddEditingRowByTemplate(null);
    this._Prop_JsonData[rowId] = null;
  },
  AddEditingRowByTemplate: function AddEditingRowByTemplate(jsonDatas, jsonDataSingle) {
    if (this.CompletedEditingRow()) {
      var rowId = StringUtility.Guid();
      var $rowElem = $("<tr />");
      $rowElem.attr("id", rowId);
      this._$Prop_EditingRowElem = $rowElem;

      if (jsonDataSingle != undefined && jsonDataSingle != null && jsonDataSingle.editEable == false) {} else {
        var event_data = {
          host: this
        };

        if (this._Status != "View") {
          $rowElem.bind("click", event_data, function (event) {
            var rowStatus = $rowElem.attr("status");

            if (typeof rowStatus != 'undefined' && rowStatus == "disabled") {
              return false;
            }

            var _host = event.data.host;

            if (_host._$Prop_EditingRowElem != null && $(this).attr("id") == _host._$Prop_EditingRowElem.attr("id")) {
              return;
            }

            var _C = _host._Prop_ConfigManager.GetConfig();

            if (typeof _C.RowClick != 'undefined' && typeof _C.RowClick == 'function') {
              try {
                var result = _C.RowClick();

                if (result != 'undefined' && result == false) {
                  return false;
                }
              } catch (e) {
                alert("_C.RowClick() Error");
              }
            }

            if (_host.CompletedEditingRow()) {
              _host._$Prop_EditingRowElem = $(this);

              _host.SetRowIsEditStatus(_host._$Prop_EditingRowElem);

              var _row = $(this);

              _row.find("td").each(function () {
                var $td = $(this);
                var renderer = $td.attr("renderer");
                var templateId = $td.attr("templateId");

                var template = _host._Prop_ConfigManager.GetTemplate(templateId);

                var rendererObj = eval("Object.create(" + renderer + ")");
                var $htmlelem = rendererObj.Get_EditStatus_HtmlElem(_C, template, $td, _row, this._$Prop_TableElem, $td.children());

                if (typeof template.Hidden != 'undefined' && template.Hidden == true) {
                  $td.hide();
                }

                if (typeof template.Style != 'undefined') {
                  $td.css(template.Style);
                }

                $td.html("");
                $td.append($htmlelem);
              });
            }
          });
        }
      }

      var _C = this._Prop_ConfigManager.GetConfig();

      for (var i = 0; i < _C.Templates.length; i++) {
        var template = _C.Templates[i];
        var renderer = null;

        try {
          renderer = template.Renderer;
          var rendererObj = eval("Object.create(" + renderer + ")");
        } catch (e) {
          alert("实例化" + renderer + "失败!");
        }

        var $tdElem = null;
        $tdElem = $("<td />");
        $tdElem.attr("renderer", renderer);
        $tdElem.attr("templateId", template.TemplateId);

        if (typeof template.Hidden != 'undefined' && template.Hidden == true) {
          $tdElem.hide();
        }

        if (typeof template.Width != 'undefined') {
          $tdElem.css("width", template.Width);
        }

        if (typeof template.Align != 'undefined') {
          $tdElem.attr("align", template.Align);
        }

        var $elem = rendererObj.Get_EditStatus_HtmlElem(_C, template, $tdElem, $rowElem, this._$Prop_TableElem, null, jsonDatas, jsonDataSingle);

        if (typeof template.Style != 'undefined') {
          $tdElem.css(template.Style);
        }

        $tdElem.append($elem);
        $rowElem.append($tdElem);
      }

      this._$Prop_TableElem.append($rowElem);

      if (typeof _C.AddAfterRowEvent !== 'undefined' && typeof _C.AddAfterRowEvent == 'function') {
        _C.AddAfterRowEvent($rowElem);
      }

      return rowId;
    }
  },
  SetToViewStatus: function SetToViewStatus() {
    this._Status = "View";
  },
  SetRowIsEditStatus: function SetRowIsEditStatus(tr) {
    $(tr).attr("EditStatus", "EditStatus");
  },
  SetRowIsCompletedStatus: function SetRowIsCompletedStatus(tr) {
    $(tr).attr("EditStatus", "CompletedStatus");
  },
  RowIsEditStatus: function RowIsEditStatus(tr) {
    return $(tr).attr("EditStatus") == "EditStatus";
  },
  RowIsCompletedStatus: function RowIsCompletedStatus(tr) {
    return $(tr).attr("EditStatus") == "CompletedStatus";
  },
  CompletedEditingRow: function CompletedEditingRow() {
    var result = true;

    if (this._$Prop_EditingRowElem != null) {
      if (!this.RowIsCompletedStatus(this._$Prop_EditingRowElem)) {
        var _C = this._Prop_ConfigManager.GetConfig();

        var _host = this;

        if (this.ValidateCompletedEditingRowEnable(this._$Prop_EditingRowElem)) {
          var _row = this._$Prop_EditingRowElem;
          this.SetRowIsCompletedStatus(_row);

          _row.find("td").each(function () {
            var $td = $(this);
            var renderer = $td.attr("renderer");
            var templateId = $td.attr("templateId");

            var template = _host._Prop_ConfigManager.GetTemplate(templateId);

            var rendererObj = eval("Object.create(" + renderer + ")");
            var $htmlelem = rendererObj.Get_CompletedStatus_HtmlElem(_C, template, $td, _row, this._$Prop_TableElem, $td.children());
            $td.html("");
            $td.append($htmlelem);
          });

          this._$Prop_EditingRowElem = null;
        } else {
          result = false;
        }
      }
    }

    return result;
  },
  ValidateCompletedEditingRowEnable: function ValidateCompletedEditingRowEnable(editRow) {
    var _C = this._Prop_ConfigManager.GetConfig();

    var _host = this;

    var result = true;
    var validateMsg = "";
    var tds = $(editRow).find("td");

    for (var i = 0; i < tds.length; i++) {
      var $td = $(tds[i]);
      var renderer = $td.attr("renderer");
      var templateId = $td.attr("templateId");

      var template = _host._Prop_ConfigManager.GetTemplate(templateId);

      var rendererObj = eval("Object.create(" + renderer + ")");
      var valresult = rendererObj.ValidateToCompletedEnable(_C, template, $td, editRow, this._$Prop_TableElem, $td.children());

      if (valresult.Success == false) {
        result = false;
        validateMsg = valresult.Msg;
        break;
      }
    }

    if (!result && validateMsg != null) {
      DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, validateMsg, null);
    }

    return result;
  },
  RemoveRow: function RemoveRow() {
    if (this._$Prop_EditingRowElem != null) {
      this._$Prop_EditingRowElem.remove();

      this._$Prop_EditingRowElem = null;
    }
  },
  GetTableObject: function GetTableObject() {
    return this._$Prop_TableElem;
  },
  GetRows: function GetRows() {
    if (this._$Prop_TableElem != null) {
      return this._$Prop_TableElem.find("tr:not(:first)");
    }
  },
  GetEditRow: function GetEditRow() {
    if (this._$Prop_EditingRowElem != null) {
      return this._$Prop_EditingRowElem;
    } else {
      return null;
    }
  },
  GetLastRow: function GetLastRow() {
    var row = this.GetEditRow();
    if (row == null) return null;
    var rows = this.GetRows();
    var index = rows.index(row);

    if (index > 0) {
      return $(rows[index - 1]);
    }

    return null;
  },
  GetNextRow: function GetNextRow() {
    var row = this.GetEditRow();
    if (row == null) return null;
    var rows = this.GetRows();
    var index = rows.index(row);

    if (index < rows.length - 1) {
      return $(rows[index + 1]);
    }

    return null;
  },
  MoveUp: function MoveUp() {
    var row = this.GetLastRow();

    if (row != null) {
      if (typeof row.attr("status") != "undefined" && row.attr("status") == "disabled") return false;
      var me = this.GetEditRow();
      var temp = me.attr("class");
      me.attr("class", row.attr("class"));
      row.attr("class", temp);

      if (me != null) {
        row.before(me[0]);
        return true;
      }

      return false;
    }

    return false;
  },
  MoveDown: function MoveDown() {
    var row = this.GetNextRow();

    if (row != null) {
      if (typeof row.attr("state") != "undefined" && row.attr("state") == "disabled") return false;
      var me = this.GetEditRow();
      var temp = me.attr("class");
      me.attr("class", row.attr("class"));
      row.attr("class", temp);

      if (me != null) {
        row.after(me[0]);
        return true;
      }

      return false;
    }

    return false;
  },
  RemoveAllRow: function RemoveAllRow() {
    if (this._$Prop_TableElem != null) {
      this._$Prop_TableElem.find("tr:not(:first)").each(function () {
        $(this).remove();
      });
    }
  },
  UpdateToRow: function UpdateToRow(rowId, rowData) {
    var tableElement = this._$Prop_TableElem;

    var _host = this;

    tableElement.find("tr[isHeader!='true']").each(function () {
      var $tr = $(this);

      var _rowId = $tr.attr("id");

      if (rowId == _rowId) {
        for (var attrName in rowData) {
          $tr.find("td").each(function () {
            var $td = $(this);
            var $displayElem = $td.find("[IsSerialize='true']");
            var bindName = $displayElem.attr("BindName");

            if (attrName == bindName) {
              var templateId = $td.attr("templateId");

              var template = _host._Prop_ConfigManager.GetTemplate(templateId);

              var text = "";
              var val = rowData[bindName];

              if (typeof template.Formatter != 'undefined' && typeof template.Formatter == 'function') {
                text = template.Formatter(val);
              }

              if (text == "") {
                text = val;
              }

              if ($displayElem.prop('tagName') == "INPUT") {
                if ($displayElem.attr("type").toLowerCase() == "checkbox") {} else {
                  $displayElem.val(text);
                }
              } else {
                try {
                  $displayElem.text(text);
                } catch (e) {
                  alert("UpdateToRow $label.text(text) Error!");
                }

                $displayElem.attr("Value", val);
              }
            }
          });
        }
      }
    });
  },
  GetSelectRowDataByRowId: function GetSelectRowDataByRowId(rowId) {
    var tableElement = this._$Prop_TableElem;
    var rowData = {};
    tableElement.find("tr[isHeader!='true']").each(function () {
      var $tr = $(this);

      var _rowId = $tr.attr("id");

      if (rowId == _rowId) {
        $tr.find("[IsSerialize='true']").each(function () {
          if ($(this).attr("Value") != undefined) {
            rowData[$(this).attr("BindName")] = $(this).attr("Value");
          } else {
            rowData[$(this).attr("BindName")] = $(this).val();
          }
        });
      }
    });
    return rowData;
  },
  GetSelectRowByRowId: function GetSelectRowByRowId(rowId) {
    var tableElement = this._$Prop_TableElem;
    return tableElement.find("tr[id='" + rowId + "']");
  },
  GetAllRowData: function GetAllRowData() {
    var tableElement = this._$Prop_TableElem;
    var rowDatas = new Array();
    tableElement.find("tr[isHeader!='true']").each(function () {
      var $tr = $(this);
      var rowData = {};
      $tr.find("[IsSerialize='true']").each(function () {
        rowData[$(this).attr("BindName")] = $(this).attr("Value");
        rowData[$(this).attr("BindName") + "___Text"] = $(this).attr("Text");
      });
      rowDatas.push(rowData);
    });
    return rowDatas;
  },
  GetSerializeJson: function GetSerializeJson() {
    var result = new Array();
    var table = this._$Prop_TableElem;
    table.find("tr[isHeader!='true']").each(function () {
      var rowdata = new Object();
      var $tr = $(this);
      $tr.find("[IsSerialize='true']").each(function () {
        var seritem = $(this);
        var bindName = seritem.attr("BindName");
        var bindValue = seritem.attr("Value");
        var bindText = seritem.attr("Text");
        rowdata[bindName] = bindValue;
        rowdata[bindName + "___Text"] = bindText;
      });
      result.push(rowdata);
    });
    return result;
  },
  GetTableElement: function GetTableElement() {
    return this._$Prop_TableElem;
  }
};
var EditTableConfigManager = {
  _Prop_Config: {},
  InitializationConfig: function InitializationConfig(_config) {
    this._Prop_Config = $.extend(true, {}, this._Prop_Config, _config);
    var _templates = this._Prop_Config.Templates;

    for (var i = 0; i < _templates.length; i++) {
      var template = _templates[i];
      template.TemplateId = StringUtility.Guid();
    }
  },
  GetConfig: function GetConfig() {
    return this._Prop_Config;
  },
  GetTemplate: function GetTemplate(templateId) {
    var _templates = this._Prop_Config.Templates;

    for (var i = 0; i < _templates.length; i++) {
      var template = _templates[i];

      if (template.TemplateId == templateId) {
        return template;
      }
    }

    return null;
  }
};
var EditTableValidate = {
  _SQLKeyWordArray: new Array(),
  GetSQLKeyWords: function GetSQLKeyWords() {
    if (this._SQLKeyWordArray.length == 0) {
      this._SQLKeyWordArray.push("insert");

      this._SQLKeyWordArray.push("update");

      this._SQLKeyWordArray.push("delete");

      this._SQLKeyWordArray.push("select");

      this._SQLKeyWordArray.push("as");

      this._SQLKeyWordArray.push("from");

      this._SQLKeyWordArray.push("distinct");

      this._SQLKeyWordArray.push("where");

      this._SQLKeyWordArray.push("order");

      this._SQLKeyWordArray.push("by");

      this._SQLKeyWordArray.push("asc");

      this._SQLKeyWordArray.push("desc");

      this._SQLKeyWordArray.push("desc");

      this._SQLKeyWordArray.push("and");

      this._SQLKeyWordArray.push("or");

      this._SQLKeyWordArray.push("between");

      this._SQLKeyWordArray.push("order by");

      this._SQLKeyWordArray.push("count");

      this._SQLKeyWordArray.push("group");

      this._SQLKeyWordArray.push("group by");

      this._SQLKeyWordArray.push("having");

      this._SQLKeyWordArray.push("alias");

      this._SQLKeyWordArray.push("join");

      this._SQLKeyWordArray.push("left");

      this._SQLKeyWordArray.push("rigth");

      this._SQLKeyWordArray.push("inneer");

      this._SQLKeyWordArray.push("union");

      this._SQLKeyWordArray.push("sum");

      this._SQLKeyWordArray.push("all");

      this._SQLKeyWordArray.push("minus");

      this._SQLKeyWordArray.push("alert");

      this._SQLKeyWordArray.push("drop");

      this._SQLKeyWordArray.push("exec");

      this._SQLKeyWordArray.push("truncate");
    }

    return this._SQLKeyWordArray;
  },
  Validate: function Validate(val, template) {
    var result = {
      Success: true,
      Msg: ""
    };
    var validateConfig = template.Validate;

    if (validateConfig != undefined && validateConfig != null) {
      var validateType = validateConfig.Type;

      if (validateType != undefined && validateType != null) {
        switch (validateType) {
          case "NotEmpty":
            {
              if (val == "") {
                result.Success = false;
                result.Msg = "【" + template.Title + "】不能为空!";
              }
            }
            break;

          case "LUNoOnly":
            {
              if (/^[a-zA-Z][a-zA-Z0-9_]{0,}$/.test(val) == false) {
                result.Success = false;
                result.Msg = "【" + template.Title + "】不能为空且只能是字母、下划线、数字并以字母开头！";
              }
            }
            break;

          case "SQLKeyWord":
            {
              if (/^[a-zA-Z][a-zA-Z0-9_]{0,}$/.test(val) == false) {
                result.Success = false;
                result.Msg = "【" + template.Title + "】不能为空且只能是字母、下划线、数字并以字母开头！";
              }

              var val = val.toUpperCase();
              var sqlKeyWords = this.GetSQLKeyWords();

              for (var i = 0; i < sqlKeyWords.length; i++) {
                if (val == sqlKeyWords[i].toUpperCase()) {
                  result.Success = false;
                  result.Msg = "【" + template.Title + "】请不要使用SQL关键字作为列名！";
                  break;
                }
              }
            }
            break;
        }
      }
    }

    return result;
  }
};
var EditTableDefauleValue = {
  GetValue: function GetValue(template) {
    var defaultValueConfig = template.DefaultValue;

    if (defaultValueConfig != undefined && defaultValueConfig != null) {
      var defaultValueType = defaultValueConfig.Type;

      if (defaultValueType != undefined && defaultValueType != null) {
        switch (defaultValueType) {
          case "Const":
            {
              return defaultValueConfig.Value;
            }

          case "GUID":
            {
              return StringUtility.Guid();
            }
            break;
        }
      }
    }

    return "";
  }
};
"use strict";

var EditTable_CheckBox = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.html();
    }

    var $elem = "";

    if (val == "是") {
      $elem = $("<input type='checkbox' checked='checked' />");
    } else {
      $elem = $("<input type='checkbox' />");
    }

    $elem.val(val);
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    var $elem = "";

    if (template.IsCNValue) {
      if (editStausHtmlElem.attr("checked") == "checked") {
        $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='是'>是</label>");
      } else {
        $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='否'>否</label>");
      }
    } else {
      if (editStausHtmlElem.attr("checked") == "checked") {
        $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='1'>是</label>");
      } else {
        $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='0'>否</label>");
      }
    }

    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_Formatter = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    if (template.Formatter && typeof template.Formatter == "function") {
      var editDatas = EditTable._Prop_JsonData;

      if (editDatas) {
        var rowId = hostRow.attr("id");
        var rowData = editDatas[rowId];

        if (rowData) {
          return $(template.Formatter(template, hostCell, hostRow, hostTable, rowData));
        }
      }
    }

    return "";
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem, jsonDatas, jsonDataSingle) {
    if (template.Formatter && typeof template.Formatter == "function") {
      var editDatas = EditTable._Prop_JsonData;

      if (editDatas) {
        var rowId = hostRow.attr("id");
        var rowData = editDatas[rowId];

        if (rowData) {
          return $(template.Formatter(template, hostCell, hostRow, hostTable, rowData));
        }
      }
    }

    return "";
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_Label = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      if (typeof template.Formater === 'undefined') {
        val = viewStausHtmlElem.html();
      } else {
        val = viewStausHtmlElem.attr("Value");
      }
    }

    var $elem;

    if (typeof template.Formater === 'undefined') {
      $elem = $("<label IsSerialize='true' Text='" + text + "' BindName='" + template.BindName + "' Value='" + val + "'>" + val + "</label>");
    } else {
      var text = template.Formater(val);
      $elem = $("<label IsSerialize='true' Text=" + text + " BindName='" + template.BindName + "' Value=" + val + ">" + text + "</label>");
    }

    $elem.val(val);
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var $elem;
    var val = editStausHtmlElem.val();

    if (typeof template.Formater === 'undefined') {
      $elem = $("<label IsSerialize='true' Text='" + text + "' BindName='" + template.BindName + "' Value='" + val + "'>" + val + "</label>");
    } else {
      var text = template.Formater(val);
      $elem = $("<label IsSerialize='true' Text='" + text + "' BindName='" + template.BindName + "' Value='" + val + "'>" + text + "</label>");
    }

    $elem.val(val);
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_Radio = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.val();
    }

    var $elem = "";

    if (null != viewStausHtmlElem && viewStausHtmlElem != undefined && viewStausHtmlElem.attr("checked") == "checked" || val == 1) {
      $elem = $("<input type='radio' IsSerialize='true' BindName='" + template.BindName + "' name='" + template.BindName + "' checked='checked' value='1'/>");
    } else {
      $elem = $("<input type='radio' IsSerialize='true' BindName='" + template.BindName + "' name='" + template.BindName + "' value='0'/>");
    }

    $elem.val(val);
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    var $elem = "";

    if (editStausHtmlElem.attr("checked") == "checked") {
      $elem = $("<input type='radio' IsSerialize='true' BindName='" + template.BindName + "' name='" + template.BindName + "'checked='checked'  value='1'/>");
    } else {
      $elem = $("<input type='radio' IsSerialize='true' BindName='" + template.BindName + "' name='" + template.BindName + "' value='0'/>");
    }

    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_Select = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var configSource = null;

    if (template.ClientDataSource != undefined && template.ClientDataSource != null) {
      configSource = template.ClientDataSource;
    } else if (template.ClientDataSourceFunc != undefined && template.ClientDataSourceFunc != null) {
      configSource = template.ClientDataSourceFunc(template.ClientDataSourceFuncParas, _config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle);
    }

    if (configSource == null) {
      return $("<label>找不到数据源设置,请在template中设置数据源</label>");
    }

    var val = "";
    var txt = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.attr("Value");
    }

    var $elem = $("<select style='width: 100%' />");

    if (configSource[0].group) {
      for (var i = 0; i < configSource.length; i++) {
        var optgroup = $("<optgroup />");
        optgroup.attr("label", configSource[i].group);

        if (configSource[i].options) {
          for (var j = 0; j < configSource[i].options.length; j++) {
            var option = $("<option />");
            option.attr("value", configSource[i].options[j].value);
            option.attr("Text", configSource[i].options[j].text);
            option.text(configSource[i].options[j].text);
            optgroup.append(option);
          }
        }

        $elem.append(optgroup);
      }
    } else {
      for (var i = 0; i < configSource.length; i++) {
        var item = configSource[i];
        $elem.append("<option value='" + item.Value + "' text='" + item.Text + "'>" + item.Text + "</option>");
      }
    }

    $elem.val(val);

    if (typeof template.ChangeEvent == "function") {
      $elem.change(function () {
        template.ChangeEvent(this, _config, template, hostCell, hostRow, hostTable, viewStausHtmlElem);
      });
    }

    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.find("option:selected").attr("Value");
    var text = editStausHtmlElem.find("option:selected").attr("Text");
    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + val + "' Text='" + text + "'>" + text + "</label>");
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_SelectRowCheckBox = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.attr("Value");
    }

    var $elem = $("<input IsSerialize='true' type='checkbox' checked='checked'  BindName='" + template.BindName + "' />");
    $elem.attr("Value", val);
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = $(editStausHtmlElem).attr("Value");
    var $elem = $("<input IsSerialize='true' type='checkbox'  BindName='" + template.BindName + "' />");
    $elem.attr("Value", val);
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_TextBox = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.html();
    }

    var $elem = $("<input type='text' IsSerialize='true' style='width: 98%' />");
    $elem.val(val);
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + val + "'>" + val + "</label>");
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();

    if (typeof template.Validate != 'undefined' && typeof template.Validate == 'function') {
      var result = {
        Success: true,
        Msg: null
      };
      result.Success = template.Validate();
      return result;
    } else {
      return EditTableValidate.Validate(val, template);
    }
  }
};
"use strict";

var Column_SelectDefaultValue = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var defaultType = "";
    var defaultValue = "";
    var defaultText = "";

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      defaultType = jsonDataSingle["columnDefaultType"] ? jsonDataSingle["columnDefaultType"] : "";
      defaultValue = jsonDataSingle["columnDefaultValue"] ? jsonDataSingle["columnDefaultValue"] : "";
      defaultText = jsonDataSingle["columnDefaultText"] ? jsonDataSingle["columnDefaultText"] : "";
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      viewStausHtmlElem.find("label").each(function () {
        if ($(this).attr("BindName") == "columnDefaultType") {
          defaultType = $(this).attr("Value");
        } else if ($(this).attr("BindName") == "columnDefaultText") {
          defaultText = $(this).attr("Value");
        } else if ($(this).attr("BindName") == "columnDefaultValue") {
          defaultValue = $(this).attr("Value");
        }
      });
    }

    var $elem = $("<div></div>");
    var $inputTxt = $("<input type='text' style='width: 90%' readonly />");
    $inputTxt.attr("columnDefaultType", defaultType);
    $inputTxt.attr("columnDefaultValue", defaultValue);
    $inputTxt.attr("columnDefaultText", defaultText);
    $inputTxt.val(JBuild4DSelectView.SelectEnvVariable.formatText(defaultType, defaultText));
    var $inputBtn = $("<input class='normalbutton-v1' style='margin-left: 4px;' type='button' value='...'/>");
    $elem.append($inputTxt).append($inputBtn);
    window.$Temp$Inputtxt = $inputTxt;
    $inputBtn.click(function () {
      JBuild4DSelectView.SelectEnvVariable.beginSelect("Column_SelectDefaultValue");
    });
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var $inputTxt = editStausHtmlElem.find("input[type='text']");

    if ($inputTxt.length > 0) {
      var defaultType = $inputTxt.attr("columnDefaultType");
      var defaultValue = $inputTxt.attr("columnDefaultValue");
      var defaultText = $inputTxt.attr("columnDefaultText");
      var $elem = $("<div></div>");
      $elem.append("<label>" + JBuild4DSelectView.SelectEnvVariable.formatText(defaultType, defaultText) + "</label>");
      $elem.append("<label IsSerialize='true' BindName='columnDefaultType' Value='" + defaultType + "' style='display:none'/>");
      $elem.append("<label IsSerialize='true' BindName='columnDefaultText' Value='" + defaultText + "' style='display:none'/>");
      $elem.append("<label IsSerialize='true' BindName='columnDefaultValue' Value='" + defaultValue + "' style='display:none'/>");
      return $elem;
    }

    return $("<label></label>");
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  },
  setSelectEnvVariableResultValue: function setSelectEnvVariableResultValue(defaultData) {
    var $inputTxt = window.$Temp$Inputtxt;

    if (null != defaultData) {
      $inputTxt.attr("columnDefaultType", defaultData.Type);
      $inputTxt.attr("columnDefaultValue", defaultData.Value);
      $inputTxt.attr("columnDefaultText", defaultData.Text);
      $inputTxt.val(JBuild4DSelectView.SelectEnvVariable.formatText(defaultData.Type, defaultData.Text));
    } else {
      $inputTxt.attr("columnDefaultType", "");
      $inputTxt.attr("columnDefaultValue", "");
      $inputTxt.attr("columnDefaultText", "");
      $inputTxt.val("");
    }
  }
};
"use strict";

var Column_SelectFieldTypeDataLoader = {
  _fieldDataTypeArray: null,
  GetFieldDataTypeArray: function GetFieldDataTypeArray() {
    if (this._fieldDataTypeArray == null) {
      var _self = this;

      AjaxUtility.PostSync("/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTableFieldType.do", {}, function (data) {
        if (data.success == true) {
          var list = JsonUtility.StringToJson(data.data);

          if (list != null && list != undefined) {
            _self._fieldDataTypeArray = list;
          }
        } else {
          DialogUtility.Alert(window, "AlertLoadingQueryError", {}, "加载字段类型失败！", null);
        }
      }, "json");
    }

    return this._fieldDataTypeArray;
  },
  GetFieldDataTypeObjectByValue: function GetFieldDataTypeObjectByValue(Value) {
    var arrayData = this.GetFieldDataTypeArray();

    for (var i = 0; i < arrayData.length; i++) {
      var obj = arrayData[i];

      if (obj.Value == Value) {
        return obj;
      }
    }

    alert("找不到指定的数据类型，请确认是否支持该类型！");
  },
  GetFieldDataTypeObjectByText: function GetFieldDataTypeObjectByText(text) {
    var arrayData = this.GetFieldDataTypeArray();

    for (var i = 0; i < arrayData.length; i++) {
      var obj = arrayData[i];

      if (obj.Text == text) {
        return obj;
      }
    }

    alert("找不到指定的数据类型，请确认是否支持该类型！");
  }
};
var Column_SelectFieldType = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var $elem = $("<select />");

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle["columnDataTypeName"];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.attr("Value");
    }

    var _fieldDataTypeArray = Column_SelectFieldTypeDataLoader.GetFieldDataTypeArray();

    for (var i = 0; i < _fieldDataTypeArray.length; i++) {
      var value = _fieldDataTypeArray[i].Value;
      var text = _fieldDataTypeArray[i].Text;
      $elem.append("<option value='" + value + "'>" + text + "</option>");
    }

    if (val != "") {
      $elem.val(val);
    } else {
      $elem.val(Column_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByText("字符串").Value);
    }

    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var value = editStausHtmlElem.val();
    var text = Column_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByValue(value).Text;
    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + value + "'>" + text + "</label>");
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var EditTable_FieldName = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var bindname = template.BindName;

    if (template.DefaultValue != undefined && template.DefaultValue != null) {
      var val = EditTableDefauleValue.GetValue(template);
    }

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle[bindname];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.html();
    }

    var $elem = $("<input type='text' style='width: 98%' />");
    $elem.val(val);
    $elem.attr("BindName", template.BindName);
    $elem.attr("Val", val);
    $elem.attr("IsSerialize", "true");
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val().toUpperCase();
    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + val + "'>" + val + "</label>");
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    var result = EditTableValidate.Validate(val, template);

    if (result.Success) {
      hostTable.find("[renderer=EditTable_FieldName]").each(function () {
        var seritem = $(this);
        seritem.find("label").each(function () {
          var labelitem = $(this);

          if (labelitem.text() == val || labelitem.text() == val.toUpperCase()) {
            result = {
              Success: false,
              Msg: "[字段名称]不能重复!"
            };
            return;
          }
        });
      });
    }

    return result;
  }
};
"use strict";

var EditTable_SelectDefaultValue = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var fieldDefaultType = "";
    var fieldDefaultValue = "";
    var fieldDefaultText = "";

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      fieldDefaultType = jsonDataSingle["fieldDefaultType"] ? jsonDataSingle["fieldDefaultType"] : "";
      fieldDefaultValue = jsonDataSingle["fieldDefaultValue"] ? jsonDataSingle["fieldDefaultValue"] : "";
      fieldDefaultText = jsonDataSingle["fieldDefaultText"] ? jsonDataSingle["fieldDefaultText"] : "";
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      viewStausHtmlElem.find("label").each(function () {
        if ($(this).attr("BindName") == "fieldDefaultType") {
          fieldDefaultType = $(this).attr("Value");
        } else if ($(this).attr("BindName") == "fieldDefaultText") {
          fieldDefaultText = $(this).attr("Value");
        } else if ($(this).attr("BindName") == "fieldDefaultValue") {
          fieldDefaultValue = $(this).attr("Value");
        }
      });
    }

    var $elem = $("<div></div>");
    var $inputTxt = $("<input type='text' style='width: 90%' readonly />");
    $inputTxt.attr("fieldDefaultType", fieldDefaultType);
    $inputTxt.attr("fieldDefaultValue", fieldDefaultValue);
    $inputTxt.attr("fieldDefaultText", fieldDefaultText);
    $inputTxt.val(JBuild4DSelectView.SelectEnvVariable.formatText(fieldDefaultType, fieldDefaultText));
    var $inputBtn = $("<input class='normalbutton-v1' style='margin-left: 4px;' type='button' value='...'/>");
    $elem.append($inputTxt).append($inputBtn);
    window.$Temp$Inputtxt = $inputTxt;
    $inputBtn.click(function () {
      tableDesion.selectDefaultValueDialogBegin(EditTable_SelectDefaultValue, null);
    });
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var $inputTxt = editStausHtmlElem.find("input[type='text']");

    if ($inputTxt.length > 0) {
      var defaultType = $inputTxt.attr("fieldDefaultType");
      var defaultValue = $inputTxt.attr("fieldDefaultValue");
      var defaultText = $inputTxt.attr("fieldDefaultText");
      var $elem = $("<div></div>");
      $elem.append("<label>" + JBuild4DSelectView.SelectEnvVariable.formatText(defaultType, defaultText) + "</label>");
      $elem.append("<label IsSerialize='true' BindName='fieldDefaultType' Value='" + defaultType + "' style='display:none'/>");
      $elem.append("<label IsSerialize='true' BindName='fieldDefaultText' Value='" + defaultText + "' style='display:none'/>");
      $elem.append("<label IsSerialize='true' BindName='fieldDefaultValue' Value='" + defaultValue + "' style='display:none'/>");
      return $elem;
    }

    return $("<label></label>");
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  },
  setSelectEnvVariableResultValue: function setSelectEnvVariableResultValue(defaultData) {
    var $inputTxt = window.$Temp$Inputtxt;

    if (null != defaultData) {
      $inputTxt.attr("fieldDefaultType", defaultData.Type);
      $inputTxt.attr("fieldDefaultValue", defaultData.Value);
      $inputTxt.attr("fieldDefaultText", defaultData.Text);
      $inputTxt.val(JBuild4DSelectView.SelectEnvVariable.formatText(defaultData.Type, defaultData.Text));
    } else {
      $inputTxt.attr("fieldDefaultType", "");
      $inputTxt.attr("fieldDefaultValue", "");
      $inputTxt.attr("fieldDefaultText", "");
      $inputTxt.val("");
    }
  }
};
"use strict";

var EditTable_SelectFieldTypeDataLoader = {
  _fieldDataTypeArray: null,
  GetFieldDataTypeArray: function GetFieldDataTypeArray() {
    if (this._fieldDataTypeArray == null) {
      var _self = this;

      AjaxUtility.PostSync("/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTableFieldType.do", {}, function (data) {
        if (data.success == true) {
          var list = JsonUtility.StringToJson(data.data);

          if (list != null && list != undefined) {
            _self._fieldDataTypeArray = list;
          }
        } else {
          DialogUtility.Alert(window, "AlertLoadingQueryError", {}, "加载字段类型失败！", null);
        }
      }, "json");
    }

    return this._fieldDataTypeArray;
  },
  GetFieldDataTypeObjectByValue: function GetFieldDataTypeObjectByValue(Value) {
    var arrayData = this.GetFieldDataTypeArray();

    for (var i = 0; i < arrayData.length; i++) {
      var obj = arrayData[i];

      if (obj.Value == Value) {
        return obj;
      }
    }

    alert("找不到指定的数据类型，请确认是否支持该类型！");
  },
  GetFieldDataTypeObjectByText: function GetFieldDataTypeObjectByText(text) {
    var arrayData = this.GetFieldDataTypeArray();

    for (var i = 0; i < arrayData.length; i++) {
      var obj = arrayData[i];

      if (obj.Text == text) {
        return obj;
      }
    }

    alert("找不到指定的数据类型，请确认是否支持该类型！");
  }
};
var EditTable_SelectFieldType = {
  Get_EditStatus_HtmlElem: function Get_EditStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
    var val = "";
    var $elem = $("<select />");

    if (jsonDataSingle != null && jsonDataSingle != undefined) {
      val = jsonDataSingle["fieldDataType"];
    }

    if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
      val = viewStausHtmlElem.attr("Value");
    }

    var _fieldDataTypeArray = EditTable_SelectFieldTypeDataLoader.GetFieldDataTypeArray();

    for (var i = 0; i < _fieldDataTypeArray.length; i++) {
      var value = _fieldDataTypeArray[i].Value;
      var text = _fieldDataTypeArray[i].Text;
      $elem.append("<option value='" + value + "'>" + text + "</option>");
    }

    if (val != "") {
      $elem.val(val);
    } else {
      $elem.val(EditTable_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByText("字符串").Value);
    }

    $elem.change(function () {
      var val = $(this).val();

      if (val == "整数") {
        $(hostCell).next().find("input").attr("disabled", true);
        $(hostCell).next().find("input").val(0);
        $(hostCell).next().next().find("input").attr("disabled", true);
        $(hostCell).next().next().find("input").val(0);
      } else if (val == "小数") {
        $(hostCell).next().find("input").attr("disabled", false);
        $(hostCell).next().find("input").val(10);
        $(hostCell).next().next().find("input").attr("disabled", false);
        $(hostCell).next().next().find("input").val(2);
      } else if (val == "日期时间") {
        $(hostCell).next().find("input").attr("disabled", true);
        $(hostCell).next().find("input").val(20);
        $(hostCell).next().next().find("input").attr("disabled", true);
        $(hostCell).next().next().find("input").val(0);
      } else if (val == "字符串") {
        $(hostCell).next().find("input").attr("disabled", false);
        $(hostCell).next().find("input").val(50);
        $(hostCell).next().next().find("input").attr("disabled", true);
        $(hostCell).next().next().find("input").val(0);
      } else if (val == "长字符串") {
        $(hostCell).next().find("input").attr("disabled", true);
        $(hostCell).next().find("input").val(0);
        $(hostCell).next().next().find("input").attr("disabled", true);
        $(hostCell).next().next().find("input").val(0);
      }
    });
    return $elem;
  },
  Get_CompletedStatus_HtmlElem: function Get_CompletedStatus_HtmlElem(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var value = editStausHtmlElem.val();
    var text = EditTable_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByValue(value).Text;
    var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + value + "'>" + text + "</label>");
    return $elem;
  },
  ValidateToCompletedEnable: function ValidateToCompletedEnable(_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
    var val = editStausHtmlElem.val();
    return EditTableValidate.Validate(val, template);
  }
};
"use strict";

var TreeTableConfig = {
  CanDeleteWhenHasChild: false,
  IdField: "Organ_Id",
  RowIdPrefix: "TreeTable_",
  LoadChildJsonURL: "",
  LoadChildFunc: null,
  OpenLevel: 1,
  ChildTestField: "Child_Count",
  Templates: [{
    Title: "组织机构名称",
    FieldName: "Organ_Name",
    TitleCellClassName: "TitleCell",
    Renderer: "Lable",
    Hidden: false,
    TitleCellAttrs: {},
    Width: "50%"
  }, {
    Title: "组织机构缩写名称",
    FieldName: "Organ_ShortName",
    TitleCellClassName: "TitleCell",
    Renderer: "Lable",
    Hidden: false,
    TitleCellAttrs: {},
    Width: "20%"
  }, {
    Title: "组织编号",
    FieldName: "Organ_Code",
    TitleCellClassName: "TitleCell",
    Renderer: "Lable",
    Hidden: false,
    TitleCellAttrs: {},
    Width: "20%"
  }, {
    Title: "组织ID",
    FieldName: "Organ_Id",
    TitleCellClassName: "TitleCell",
    Renderer: "Lable",
    Hidden: false,
    TitleCellAttrs: {},
    Width: "10"
  }],
  TableClass: "TreeTable",
  RendererTo: "divEditTable",
  TableId: "TreeTable",
  TableAttrs: {
    cellpadding: "0",
    cellspacing: "0",
    border: "0"
  }
};
var TreeTableJsonData = {
  Organ_Id: "0",
  Organ_Name: "root",
  Organ_ShortName: "2",
  Organ_Code: "2",
  Child_Count: 2,
  Nodes: [{
    Organ_Id: "1",
    Organ_Name: "1Organ_Name",
    Organ_ShortName: "1",
    Organ_Code: "1",
    Child_Count: 2,
    Nodes: [{
      Organ_Id: "1-1",
      Organ_Name: "1-1Organ_Name",
      Organ_ShortName: "1-1",
      Organ_Code: "1-1",
      Child_Count: 1,
      Nodes: [{
        Organ_Id: "1-1-1",
        Organ_Name: "1-1-1Organ_Name",
        Organ_ShortName: "1-1-1",
        Organ_Code: "1-1",
        Child_Count: 0
      }]
    }, {
      Organ_Id: "1-2",
      Organ_Name: "1-2Organ_Name",
      Organ_ShortName: "1-2",
      Organ_Code: "1-2",
      Child_Count: 0
    }]
  }, {
    Organ_Id: "2",
    Organ_Name: "2Organ_Name",
    Organ_ShortName: "2",
    Organ_Code: "2",
    Child_Count: 0
  }, {
    Organ_Id: "3",
    Organ_Name: "3Organ_Name",
    Organ_ShortName: "3",
    Organ_Code: "3",
    Child_Count: 0
  }, {
    Organ_Id: "4",
    Organ_Name: "4Organ_Name",
    Organ_ShortName: "4",
    Organ_Code: "4",
    Child_Count: 0
  }]
};
var TreeTableJsonDataList = [{
  Organ_Id: "0",
  Organ_Name: "root",
  Organ_ShortName: "2",
  Organ_Code: "2",
  Child_Count: 2
}, {
  Organ_Id: "1",
  Organ_Name: "1Organ_Name",
  Organ_ShortName: "1",
  Organ_Code: "1",
  Child_Count: 2,
  Parent_Id: "0"
}, {
  Organ_Id: "2",
  Organ_Name: "2Organ_Name",
  Organ_ShortName: "2",
  Organ_Code: "2",
  Child_Count: 0,
  Parent_Id: "0"
}, {
  Organ_Id: "1-1",
  Organ_Name: "1-1Organ_Name",
  Organ_ShortName: "1-1",
  Organ_Code: "1-1",
  Child_Count: 1,
  Parent_Id: "1"
}, {
  Organ_Id: "1-2",
  Organ_Name: "1-2Organ_Name",
  Organ_ShortName: "1-2",
  Organ_Code: "1-2",
  Child_Count: 0,
  Parent_Id: "1"
}, {
  Organ_Id: "1-1-1",
  Organ_Name: "1-1-1Organ_Name",
  Organ_ShortName: "1-1-1",
  Organ_Code: "1-1",
  Child_Count: 0,
  Parent_Id: "1-1"
}];
"use strict";

var TreeTable = {
  _$Prop_TableElem: null,
  _$Prop_RendererToElem: null,
  _Prop_Config: null,
  _Prop_JsonData: null,
  _Prop_AutoOpenLevel: 0,
  _Prop_FirstColumn_Inden: 20,
  _Prop_CurrentSelectedRowId: null,
  Initialization: function Initialization(_config) {
    this._Prop_Config = _config;
    this._$Prop_RendererToElem = $("#" + this._Prop_Config.RendererTo);
    this._$Prop_TableElem = this.CreateTable();

    this._$Prop_TableElem.append(this.CreateTableTitleRow());

    this._$Prop_RendererToElem.append(this._$Prop_TableElem);
  },
  LoadJsonData: function LoadJsonData(jsonDatas) {
    if (jsonDatas != null && jsonDatas != undefined) {
      this._Prop_JsonData = jsonDatas;
      this._Prop_AutoOpenLevel = this._Prop_Config.OpenLevel;

      var rowId = this._GetRowDataId(jsonDatas);

      this._CreateRootRow(jsonDatas, rowId);

      this._LoopCreateRow(jsonDatas, jsonDatas.Nodes, 1, rowId);

      this.RendererStyle();
    } else {
      alert("Json Data Object Error");
    }
  },
  _CreateRootRow: function _CreateRootRow(parentjsonNode, parentIdList) {
    var rowElem = this.CreateRowElem(parentjsonNode, 0, null, true, parentIdList);

    this._$Prop_TableElem.append(rowElem);

    this.SetJsonDataExtendAttr_CurrentLevel(parentjsonNode, 0);
    this.SetJsonDataExtendAttr_ParentIdList(parentjsonNode, parentIdList);
  },
  _LoopCreateRow: function _LoopCreateRow(parentjsonNode, jsonNodeArray, currentLevel, parentIdList) {
    this._Prop_Config.IsOpenALL;

    if (jsonNodeArray != undefined) {
      for (var i = 0; i < jsonNodeArray.length; i++) {
        var item = jsonNodeArray[i];

        var rowIsOpen = this._TestRowIsOpen(currentLevel);

        var rowId = this._GetRowDataId(item);

        var _pIdList = this._CreateParentIdList(parentIdList, rowId);

        this.SetJsonDataExtendAttr_CurrentLevel(item, currentLevel);
        this.SetJsonDataExtendAttr_ParentIdList(item, _pIdList);
        var rowElem = this.CreateRowElem(item, currentLevel, parentjsonNode, rowIsOpen, _pIdList);

        this._$Prop_TableElem.append(rowElem);

        if (item.Nodes != undefined && item.Nodes != null && item.Nodes.length > 0) {
          var _tp = currentLevel + 1;

          this._LoopCreateRow(item, item.Nodes, _tp, _pIdList);
        }
      }
    }
  },
  CreateTable: function CreateTable() {
    var _C = this._Prop_Config;

    var _editTable = $("<table />");

    _editTable.addClass(_C.TableClass);

    _editTable.attr("Id", _C.TableId);

    _editTable.attr(_C.TableAttrs);

    return _editTable;
  },
  SetJsonDataExtendAttr_CurrentLevel: function SetJsonDataExtendAttr_CurrentLevel(jsonData, value) {
    jsonData._Extend_CurrentLevel = value;
  },
  GetJsonDataExtendAttr_CurrentLevel: function GetJsonDataExtendAttr_CurrentLevel(jsonData) {
    return jsonData._Extend_CurrentLevel;
  },
  SetJsonDataExtendAttr_ParentIdList: function SetJsonDataExtendAttr_ParentIdList(jsonData, value) {
    jsonData._Extend_ParentIdList = value;
  },
  GetJsonDataExtendAttr_ParentIdList: function GetJsonDataExtendAttr_ParentIdList(jsonData) {
    return jsonData._Extend_ParentIdList;
  },
  CreateTableTitleRow: function CreateTableTitleRow() {
    var _C = this._Prop_Config;

    var _thead = $("<thead>\
                                <tr isHeader='true' />\
                            </thead>");

    var _titleRow = _thead.find("tr");

    for (var i = 0; i < _C.Templates.length; i++) {
      var template = _C.Templates[i];
      var title = template.Title;
      var th = $("<th>" + title + "</th>");

      if (template.TitleCellClassName) {
        th.addClass(template.TitleCellClassName);
      }

      if (template.TitleCellAttrs) {
        th.attr(template.TitleCellAttrs);
      }

      if (typeof template.Hidden != 'undefined' && template.Hidden == true) {
        th.hide();
      }

      if (template.Style) {
        th.css(template.Style);
      }

      _titleRow.append(th);
    }

    return _thead;
  },
  CreateRowElem: function CreateRowElem(rowData, currentLevel, parentRowData, rowIsOpen, parentIdList) {
    var _c = this._Prop_Config;
    var $tr = $("<tr />");

    var elemId = this._CreateElemId(rowData);

    var rowId = this._GetRowDataId(rowData);

    var prowId = this._CreateParentRowId(parentRowData);

    $tr.attr("rowId", rowId).attr("pid", prowId).attr("id", elemId).attr("currentLevel", currentLevel).attr("isdatarow", "true");
    var _testfield = _c.ChildTestField;
    var hasChild = rowData[_testfield];

    if (hasChild == true || hasChild == "true" || hasChild > 0) {
      $tr.attr("hasChild", "true");
    }

    $tr.attr("rowIsOpen", rowIsOpen).attr("parentIdList", parentIdList);

    for (var i = 0; i < _c.Templates.length; i++) {
      var _cc = _c.Templates[i];
      var _cd = rowData[_cc.FieldName];
      var _width = _cc.Width;
      var _renderer = _cc.Renderer;
      var $td = $("<td bindField=\"" + _cc.FieldName + "\" Renderer='" + _renderer + "'>" + _cd + "</td>").css("width", _width);

      if (_renderer == "DateTime") {
        var date = new Date(_cd);
        var dateStr = DateUtility.Format(date, 'yyyy-MM-dd');
        $td.text(dateStr);
      }

      if (_cc.TextAlign) {
        $td.css("textAlign", _cc.TextAlign);
      }

      if (i == 0) {}

      if (typeof _cc.Hidden != 'undefined' && _cc.Hidden == true) {
        $td.hide();
      }

      if (typeof _cc.Style != 'undefined') {
        $td.css(_cc.Style);
      }

      $tr.append($td);
    }

    var _self = this;

    $tr.bind("click", null, function (event) {
      $(".tr-selected").removeClass("tr-selected");
      $(this).addClass("tr-selected");
      _self._Prop_CurrentSelectedRowId = $(this).attr("rowId");

      if (typeof _c.ClickRowEvent !== 'undefined' && typeof _c.ClickRowEvent == 'function') {
        _c.ClickRowEvent(rowId);
      }
    });
    $tr.hover(function () {
      if (!$(this).hasClass("tr-selected")) {
        $(this).addClass("tr-hover");
      }
    }, function () {
      $(".tr-hover").removeClass("tr-hover");
    });
    return $tr;
  },
  _TestRowIsOpen: function _TestRowIsOpen(currentLevel) {
    if (this._Prop_Config.OpenLevel > currentLevel) {
      return true;
    }

    return false;
  },
  _CreateElemId: function _CreateElemId(rowData) {
    var rowIdPrefix = "";

    if (this._Prop_Config.RowIdPrefix != undefined && this._Prop_Config.RowIdPrefix != undefined != null) {
      rowIdPrefix = this._Prop_Config.RowIdPrefix;
    }

    return rowIdPrefix + this._GetRowDataId(rowData);
  },
  _CreateParentIdList: function _CreateParentIdList(parentIdList, rowId) {
    return parentIdList + "※" + rowId;
  },
  _CreateParentIdListByParentJsonData: function _CreateParentIdListByParentJsonData(parentJsonData, selfJsonData) {
    var parentIdList = this.GetJsonDataExtendAttr_ParentIdList(parentJsonData);

    var rowId = this._GetRowDataId(selfJsonData);

    return this._CreateParentIdList(parentIdList, rowId);
  },
  _GetRowDataId: function _GetRowDataId(rowData) {
    var idField = this._Prop_Config.IdField;

    if (rowData[idField] != undefined && rowData[idField] != null) {
      return rowData[idField];
    } else {
      alert("在数据源中找不到用于构建Id的字段，请检查配置及数据源");
      return null;
    }
  },
  _CreateParentRowId: function _CreateParentRowId(parentRowData) {
    if (parentRowData == null) {
      return "Root";
    } else {
      return this._GetRowDataId(parentRowData);
    }
  },
  RendererStyle: function RendererStyle() {
    var _self = this;

    $("tr[isdatarow='true']").each(function () {
      var $tr = $(this);
      var $firsttd = $(this).find("td:first");
      var rowid = $tr.attr("rowId");
      var sourceText = $firsttd.text();
      $firsttd.css("padding-left", _self._Prop_FirstColumn_Inden * parseInt($(this).attr("currentLevel")));
      var hasChild = false;

      if ($tr.attr("hasChild") == "true") {
        hasChild = true;
      }

      var rowIsOpen = false;

      if ($tr.attr("rowIsOpen") == "true") {
        rowIsOpen = true;
      }

      var switchElem = _self._CreateRowSwitchElem(hasChild, rowIsOpen, rowid);

      $firsttd.html("");
      $firsttd.append(switchElem).append("<span>" + sourceText + "</span>");

      if (!rowIsOpen) {
        $("tr[pid='" + rowid + "']").hide();
      }
    });
  },
  _GetIndenClass: function _GetIndenClass(hasChild, isOpen) {
    if (hasChild && isOpen) {
      return "img-switch-open";
    }

    if (hasChild && !isOpen) {
      return "img-switch-close";
    }

    if (!hasChild) {
      return "img-switch-open";
    }

    return "img-switch-close";
  },
  _CreateRowSwitchElem: function _CreateRowSwitchElem(hasChild, isOpen, rowId) {
    var elem = $("<div isswitch=\"true\"></div>");

    var cls = this._GetIndenClass(hasChild, isOpen);

    elem.addClass(cls);
    var senddata = {
      RowId: rowId
    };
    elem.bind("click", senddata, function (event) {
      if (!hasChild) {
        return;
      }

      var $tr = $(this).parent().parent();
      var rowid = $tr.attr("rowId");
      var rowIsOpen = false;

      if ($tr.attr("rowIsOpen") == "true") {
        rowIsOpen = true;
      }

      if (rowIsOpen) {
        rowIsOpen = false;
        $("tr[parentIdList*='" + rowid + "※']").hide();
        $(this).removeClass("img-switch-open").addClass("img-switch-close");
        $("tr[parentIdList*='" + rowid + "※'][haschild='true']").find("[isswitch='true']").removeClass("img-switch-open").addClass("img-switch-close");
        $("tr[parentIdList*='" + rowid + "※'][haschild='true']").attr("rowisopen", false);
      } else {
        rowIsOpen = true;
        $("tr[pid='" + rowid + "']").show();
        $(this).removeClass("img-switch-close").addClass("img-switch-open");
      }

      $tr.attr("rowIsOpen", rowIsOpen);
    });
    return elem;
  },
  GetChildsRowElem: function GetChildsRowElem(loop, id) {
    if (loop) {
      return $("tr[parentIdList*='" + id + "']");
    } else {
      return $("tr[pid='" + id + "']");
    }
  },
  _Prop_SelectedRowData: null,
  _Prop_TempGetRowData: null,
  _GetSelectedRowData: function _GetSelectedRowData(node, id, isSetSelected) {
    var fieldName = this._Prop_Config.IdField;
    var fieldValue = node[fieldName];

    if (fieldValue == id) {
      if (isSetSelected) {
        this._Prop_SelectedRowData = node;
      } else {
        this._Prop_TempGetRowData = node;
      }
    } else {
      if (node.Nodes != undefined && node.Nodes != null) {
        for (var i = 0; i < node.Nodes.length; i++) {
          this._GetSelectedRowData(node.Nodes[i], id, isSetSelected);
        }
      }
    }
  },
  GetSelectedRowData: function GetSelectedRowData() {
    if (this._Prop_CurrentSelectedRowId == null) {
      return null;
    }

    this._GetSelectedRowData(this._Prop_JsonData, this._Prop_CurrentSelectedRowId, true);

    return this._Prop_SelectedRowData;
  },
  GetRowDataByRowId: function GetRowDataByRowId(rowId) {
    this._Prop_TempGetRowData = null;

    this._GetSelectedRowData(this._Prop_JsonData, rowId, false);

    return this._Prop_TempGetRowData;
  },
  AppendChildRowToCurrentSelectedRow: function AppendChildRowToCurrentSelectedRow(rowData) {
    var selectedRowData = this.GetSelectedRowData();

    if (selectedRowData.Nodes != undefined && selectedRowData.Nodes != null) {
      selectedRowData.Nodes.push(rowData);
    } else {
      selectedRowData.Nodes = new Array();
      selectedRowData.Nodes.push(rowData);
    }

    this.SetJsonDataExtendAttr_CurrentLevel(rowData, this.GetJsonDataExtendAttr_CurrentLevel(selectedRowData) + 1);
    this.SetJsonDataExtendAttr_ParentIdList(rowData, this._CreateParentIdListByParentJsonData(selectedRowData, rowData));
    var $tr = this.CreateRowElem(rowData, this.GetJsonDataExtendAttr_CurrentLevel(selectedRowData) + 1, selectedRowData, true, this.GetJsonDataExtendAttr_ParentIdList(rowData));

    var selectedRowId = this._GetRowDataId(selectedRowData);

    var currentSelectElem = $("tr[rowId='" + selectedRowId + "']");
    currentSelectElem.attr("haschild", "true");
    var lastChilds = $("tr[parentidlist*='" + selectedRowId + "※']:last");

    if (lastChilds.length > 0) {
      lastChilds.after($tr);
    } else {
      currentSelectElem.attr("rowisopen", true);
      currentSelectElem.after($tr);
    }

    this.RendererStyle();
  },
  UpdateToRow: function UpdateToRow(rowId, rowData) {
    var selectedRowData = this.GetRowDataByRowId(rowId);

    for (var attrName in rowData) {
      if (attrName != "Nodes") {
        selectedRowData[attrName] = rowData[attrName];
      }
    }

    var rowId = this._GetRowDataId(selectedRowData);

    var $tr = $("tr[rowid='" + rowId + "']");
    $tr.find("td").each(function () {
      var bindField = $(this).attr("bindField");
      var newtext = selectedRowData[bindField];
      var renderer = $(this).attr("Renderer");

      if (renderer == "DateTime") {
        var date = new Date(newtext);
        newtext = DateUtility.Format(date, 'yyyy-MM-dd');
      }

      if ($(this).find("[isswitch='true']").length > 0) {
        $(this).find("span").text(newtext);
      } else {
        $(this).text(newtext);
      }
    });
  },
  LoadChildByAjax: function LoadChildByAjax() {},
  DeleteRow: function DeleteRow(rowId) {
    var hasChild = false;

    if ($("tr[pid='" + rowId + "']").length > 0) {
      if (!this._Prop_Config.CanDeleteWhenHasChild) {
        alert("指定的节点存在子节点，请先删除子节点！");
      }
    }

    $("tr[parentidlist*='※" + rowId + "']").remove();
    this._Prop_CurrentSelectedRowId = null;
  },
  MoveUpRow: function MoveUpRow(rowId) {
    var thistr = $("tr[rowid='" + rowId + "']");
    var pid = thistr.attr("pid");
    var neartr = $(thistr.prevAll("[pid='" + pid + "']")[0]);
    var movetrs = $("tr[parentidlist*='※" + rowId + "']");
    movetrs.insertBefore(neartr);
  },
  MoveDownRow: function MoveDownRow(rowId) {
    var thistr = $("tr[rowid='" + rowId + "']");
    var pid = thistr.attr("pid");
    var neartr = $(thistr.nextAll("[pid='" + pid + "']")[0]);
    var neartrrid = neartr.attr("rowid");
    var offtrs = $("tr[parentidlist*='※" + neartrrid + "']");
    var offlasttr = $(offtrs[offtrs.length - 1]);
    var movetrs = $("tr[parentidlist*='※" + rowId + "']");
    movetrs.insertAfter(offlasttr);
  },
  GetBrothersNodeDatasByParentId: function GetBrothersNodeDatasByParentId(rowId) {
    var thistr = $("tr[rowid='" + rowId + "']");
    var pid = thistr.attr("pid");
    var brotherstr = $(thistr.parent().find("[pid='" + pid + "']"));
    var result = new Array();

    for (var i = 0; i < brotherstr.length; i++) {
      result.push(this.GetRowDataByRowId($(brotherstr[i]).attr("rowid")));
    }

    return result;
  },
  RemoveAllRow: function RemoveAllRow() {
    if (this._$Prop_TableElem != null) {
      this._$Prop_TableElem.find("tr:not(:first)").each(function () {
        $(this).remove();
      });
    }
  }
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkpzL0NvbmZpZy5qcyIsIkpzL0VkaXRUYWJsZS5qcyIsIkpzL1JlbmRlcmVycy9FZGl0VGFibGVfQ2hlY2tCb3guanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX0Zvcm1hdHRlci5qcyIsIkpzL1JlbmRlcmVycy9FZGl0VGFibGVfTGFiZWwuanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX1JhZGlvLmpzIiwiSnMvUmVuZGVyZXJzL0VkaXRUYWJsZV9TZWxlY3QuanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX1NlbGVjdFJvd0NoZWNrQm94LmpzIiwiSnMvUmVuZGVyZXJzL0VkaXRUYWJsZV9UZXh0Qm94LmpzIiwiSnMvUmVuZGVyZXJzL0RhdGFTZXQvQ29sdW1uX1NlbGVjdERlZmF1bHRWYWx1ZS5qcyIsIkpzL1JlbmRlcmVycy9EYXRhU2V0L0NvbHVtbl9TZWxlY3RGaWVsZFR5cGUuanMiLCJKcy9SZW5kZXJlcnMvVGFibGVEZXNpZ24vRWRpdFRhYmxlX0ZpZWxkTmFtZS5qcyIsIkpzL1JlbmRlcmVycy9UYWJsZURlc2lnbi9FZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlLmpzIiwiSnMvUmVuZGVyZXJzL1RhYmxlRGVzaWduL0VkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGUuanMiLCJkZW1vL1RyZWVUYWJsZUNvbmZpZy5qcyIsIkpzL1RyZWVUYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6cUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlVJRVhDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaWYgKCFPYmplY3QuY3JlYXRlKSB7XG4gIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRigpIHt9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPYmplY3QuY3JlYXRlIGltcGxlbWVudGF0aW9uIG9ubHkgYWNjZXB0cyBvbmUgcGFyYW1ldGVyLicpO1xuICAgICAgfVxuXG4gICAgICBGLnByb3RvdHlwZSA9IG87XG4gICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICB9O1xuICB9KCk7XG59XG5cbnZhciBFZGl0VGFibGVDb25maWcgPSB7XG4gIFN0YXR1czogXCJFZGl0XCIsXG4gIFRlbXBsYXRlczogW3tcbiAgICBUaXRsZTogXCLooajlkI0xXCIsXG4gICAgRmllbGROYW1lOiBcIlRhYmxlRmllbGRcIixcbiAgICBSZW5kZXJlcjogXCJFZGl0VGFibGVfVGV4dEJveFwiLFxuICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fVxuICB9LCB7XG4gICAgVGl0bGU6IFwi5a2X5q6157G75Z6LXCIsXG4gICAgRmllbGROYW1lOiBcIlRhYmxlRmllbGRcIixcbiAgICBSZW5kZXJlcjogXCJFZGl0VGFibGVfVGV4dEJveFwiLFxuICAgIEhpZGRlbjogZmFsc2VcbiAgfSwge1xuICAgIFRpdGxlOiBcIuWkh+azqFwiLFxuICAgIEZpZWxkTmFtZTogXCJUYWJsZUZpZWxkXCIsXG4gICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX1RleHRCb3hcIixcbiAgICBIaWRkZW46IGZhbHNlXG4gIH1dLFxuICBSb3dJZENyZWF0ZXI6IGZ1bmN0aW9uIFJvd0lkQ3JlYXRlcigpIHt9LFxuICBUYWJsZUNsYXNzOiBcIkVkaXRUYWJsZVwiLFxuICBSZW5kZXJlclRvOiBcImRpdlRyZWVUYWJsZVwiLFxuICBUYWJsZUlkOiBcIkVkaXRUYWJsZVwiLFxuICBUYWJsZUF0dHJzOiB7XG4gICAgY2VsbHBhZGRpbmc6IFwiMVwiLFxuICAgIGNlbGxzcGFjaW5nOiBcIjFcIixcbiAgICBib3JkZXI6IFwiMVwiXG4gIH1cbn07XG52YXIgRWRpdFRhYmxlRGF0YSA9IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlID0ge1xuICBfJFByb3BfVGFibGVFbGVtOiBudWxsLFxuICBfJFByb3BfUmVuZGVyZXJUb0VsZW06IG51bGwsXG4gIF9Qcm9wX0NvbmZpZ01hbmFnZXI6IG51bGwsXG4gIF9Qcm9wX0pzb25EYXRhOiBuZXcgT2JqZWN0KCksXG4gIF8kUHJvcF9FZGl0aW5nUm93RWxlbTogbnVsbCxcbiAgX1N0YXR1czogXCJFZGl0XCIsXG4gIEluaXRpYWxpemF0aW9uOiBmdW5jdGlvbiBJbml0aWFsaXphdGlvbihfY29uZmlnKSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyID0gT2JqZWN0LmNyZWF0ZShFZGl0VGFibGVDb25maWdNYW5hZ2VyKTtcblxuICAgIHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5Jbml0aWFsaXphdGlvbkNvbmZpZyhfY29uZmlnKTtcblxuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgIHRoaXMuXyRQcm9wX1JlbmRlcmVyVG9FbGVtID0gJChcIiNcIiArIF9DLlJlbmRlcmVyVG8pO1xuICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbSA9IHRoaXMuQ3JlYXRlVGFibGUoKTtcblxuICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5hcHBlbmQodGhpcy5DcmVhdGVUYWJsZVRpdGxlUm93KCkpO1xuXG4gICAgdGhpcy5fJFByb3BfUmVuZGVyZXJUb0VsZW0uYXBwZW5kKHRoaXMuXyRQcm9wX1RhYmxlRWxlbSk7XG5cbiAgICBpZiAoX0MuU3RhdHVzKSB7XG4gICAgICB0aGlzLl9TdGF0dXMgPSBfQy5TdGF0dXM7XG4gICAgfVxuICB9LFxuICBMb2FkSnNvbkRhdGE6IGZ1bmN0aW9uIExvYWRKc29uRGF0YShqc29uRGF0YSkge1xuICAgIGlmIChqc29uRGF0YSAhPSBudWxsICYmIGpzb25EYXRhICE9IHVuZGVmaW5lZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IGpzb25EYXRhW2ldO1xuICAgICAgICB2YXIgcm93SWQgPSB0aGlzLkFkZEVkaXRpbmdSb3dCeVRlbXBsYXRlKGpzb25EYXRhLCBpdGVtKTtcbiAgICAgICAgdGhpcy5fUHJvcF9Kc29uRGF0YVtyb3dJZF0gPSBpdGVtO1xuICAgICAgfVxuXG4gICAgICB0aGlzLkNvbXBsZXRlZEVkaXRpbmdSb3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoXCJKc29uIERhdGEgT2JqZWN0IEVycm9yXCIpO1xuICAgIH1cbiAgfSxcbiAgQ3JlYXRlVGFibGU6IGZ1bmN0aW9uIENyZWF0ZVRhYmxlKCkge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgIHZhciBfZWRpdFRhYmxlID0gJChcIjx0YWJsZSAvPlwiKTtcblxuICAgIF9lZGl0VGFibGUuYWRkQ2xhc3MoX0MuVGFibGVDbGFzcyk7XG5cbiAgICBfZWRpdFRhYmxlLmF0dHIoXCJJZFwiLCBfQy5UYWJsZUlkKTtcblxuICAgIF9lZGl0VGFibGUuYXR0cihfQy5UYWJsZUF0dHJzKTtcblxuICAgIHJldHVybiBfZWRpdFRhYmxlO1xuICB9LFxuICBDcmVhdGVUYWJsZVRpdGxlUm93OiBmdW5jdGlvbiBDcmVhdGVUYWJsZVRpdGxlUm93KCkge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgIHZhciBfdGl0bGVSb3cgPSAkKFwiPHRyIGlzSGVhZGVyPSd0cnVlJyAvPlwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX0MuVGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfQy5UZW1wbGF0ZXNbaV07XG4gICAgICB2YXIgdGl0bGUgPSB0ZW1wbGF0ZS5UaXRsZTtcbiAgICAgIHZhciB0aCA9ICQoXCI8dGg+XCIgKyB0aXRsZSArIFwiPC90aD5cIik7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5UaXRsZUNlbGxDbGFzc05hbWUpIHtcbiAgICAgICAgdGguYWRkQ2xhc3ModGVtcGxhdGUuVGl0bGVDZWxsQ2xhc3NOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRlbXBsYXRlLlRpdGxlQ2VsbEF0dHJzKSB7XG4gICAgICAgIHRoLmF0dHIodGVtcGxhdGUuVGl0bGVDZWxsQXR0cnMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiB0ZW1wbGF0ZS5IaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICB0aC5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIF90aXRsZVJvdy5hcHBlbmQodGgpO1xuICAgIH1cblxuICAgIHZhciBfdGl0bGVSb3dIZWFkID0gJChcIjx0aGVhZD48L3RoZWFkPlwiKTtcblxuICAgIF90aXRsZVJvd0hlYWQuYXBwZW5kKF90aXRsZVJvdyk7XG5cbiAgICByZXR1cm4gX3RpdGxlUm93SGVhZDtcbiAgfSxcbiAgQWRkRW1wdHlFZGl0aW5nUm93QnlUZW1wbGF0ZTogZnVuY3Rpb24gQWRkRW1wdHlFZGl0aW5nUm93QnlUZW1wbGF0ZShjYWxsYmFja2Z1bikge1xuICAgIHZhciByb3dJZCA9IHRoaXMuQWRkRWRpdGluZ1Jvd0J5VGVtcGxhdGUobnVsbCk7XG4gICAgdGhpcy5fUHJvcF9Kc29uRGF0YVtyb3dJZF0gPSBudWxsO1xuICB9LFxuICBBZGRFZGl0aW5nUm93QnlUZW1wbGF0ZTogZnVuY3Rpb24gQWRkRWRpdGluZ1Jvd0J5VGVtcGxhdGUoanNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIGlmICh0aGlzLkNvbXBsZXRlZEVkaXRpbmdSb3coKSkge1xuICAgICAgdmFyIHJvd0lkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICB2YXIgJHJvd0VsZW0gPSAkKFwiPHRyIC8+XCIpO1xuICAgICAgJHJvd0VsZW0uYXR0cihcImlkXCIsIHJvd0lkKTtcbiAgICAgIHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtID0gJHJvd0VsZW07XG5cbiAgICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQgJiYganNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZS5lZGl0RWFibGUgPT0gZmFsc2UpIHt9IGVsc2Uge1xuICAgICAgICB2YXIgZXZlbnRfZGF0YSA9IHtcbiAgICAgICAgICBob3N0OiB0aGlzXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMuX1N0YXR1cyAhPSBcIlZpZXdcIikge1xuICAgICAgICAgICRyb3dFbGVtLmJpbmQoXCJjbGlja1wiLCBldmVudF9kYXRhLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciByb3dTdGF0dXMgPSAkcm93RWxlbS5hdHRyKFwic3RhdHVzXCIpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvd1N0YXR1cyAhPSAndW5kZWZpbmVkJyAmJiByb3dTdGF0dXMgPT0gXCJkaXNhYmxlZFwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9ob3N0ID0gZXZlbnQuZGF0YS5ob3N0O1xuXG4gICAgICAgICAgICBpZiAoX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtICE9IG51bGwgJiYgJCh0aGlzKS5hdHRyKFwiaWRcIikgPT0gX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtLmF0dHIoXCJpZFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfQyA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0Q29uZmlnKCk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgX0MuUm93Q2xpY2sgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIF9DLlJvd0NsaWNrID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gX0MuUm93Q2xpY2soKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJfQy5Sb3dDbGljaygpIEVycm9yXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfaG9zdC5Db21wbGV0ZWRFZGl0aW5nUm93KCkpIHtcbiAgICAgICAgICAgICAgX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICBfaG9zdC5TZXRSb3dJc0VkaXRTdGF0dXMoX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtKTtcblxuICAgICAgICAgICAgICB2YXIgX3JvdyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgX3Jvdy5maW5kKFwidGRcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0ZCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gJHRkLmF0dHIoXCJyZW5kZXJlclwiKTtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVJZCA9ICR0ZC5hdHRyKFwidGVtcGxhdGVJZFwiKTtcblxuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0VGVtcGxhdGUodGVtcGxhdGVJZCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXJPYmogPSBldmFsKFwiT2JqZWN0LmNyZWF0ZShcIiArIHJlbmRlcmVyICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIHZhciAkaHRtbGVsZW0gPSByZW5kZXJlck9iai5HZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfQywgdGVtcGxhdGUsICR0ZCwgX3JvdywgdGhpcy5fJFByb3BfVGFibGVFbGVtLCAkdGQuY2hpbGRyZW4oKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiB0ZW1wbGF0ZS5IaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgJHRkLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLlN0eWxlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAkdGQuY3NzKHRlbXBsYXRlLlN0eWxlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkdGQuaHRtbChcIlwiKTtcbiAgICAgICAgICAgICAgICAkdGQuYXBwZW5kKCRodG1sZWxlbSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfQy5UZW1wbGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gX0MuVGVtcGxhdGVzW2ldO1xuICAgICAgICB2YXIgcmVuZGVyZXIgPSBudWxsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVuZGVyZXIgPSB0ZW1wbGF0ZS5SZW5kZXJlcjtcbiAgICAgICAgICB2YXIgcmVuZGVyZXJPYmogPSBldmFsKFwiT2JqZWN0LmNyZWF0ZShcIiArIHJlbmRlcmVyICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgYWxlcnQoXCLlrp7kvovljJZcIiArIHJlbmRlcmVyICsgXCLlpLHotKUhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICR0ZEVsZW0gPSBudWxsO1xuICAgICAgICAkdGRFbGVtID0gJChcIjx0ZCAvPlwiKTtcbiAgICAgICAgJHRkRWxlbS5hdHRyKFwicmVuZGVyZXJcIiwgcmVuZGVyZXIpO1xuICAgICAgICAkdGRFbGVtLmF0dHIoXCJ0ZW1wbGF0ZUlkXCIsIHRlbXBsYXRlLlRlbXBsYXRlSWQpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuSGlkZGVuICE9ICd1bmRlZmluZWQnICYmIHRlbXBsYXRlLkhpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgICAgJHRkRWxlbS5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLldpZHRoICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgJHRkRWxlbS5jc3MoXCJ3aWR0aFwiLCB0ZW1wbGF0ZS5XaWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkFsaWduICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgJHRkRWxlbS5hdHRyKFwiYWxpZ25cIiwgdGVtcGxhdGUuQWxpZ24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRlbGVtID0gcmVuZGVyZXJPYmouR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX0MsIHRlbXBsYXRlLCAkdGRFbGVtLCAkcm93RWxlbSwgdGhpcy5fJFByb3BfVGFibGVFbGVtLCBudWxsLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLlN0eWxlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgJHRkRWxlbS5jc3ModGVtcGxhdGUuU3R5bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRkRWxlbS5hcHBlbmQoJGVsZW0pO1xuICAgICAgICAkcm93RWxlbS5hcHBlbmQoJHRkRWxlbSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5hcHBlbmQoJHJvd0VsZW0pO1xuXG4gICAgICBpZiAodHlwZW9mIF9DLkFkZEFmdGVyUm93RXZlbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBfQy5BZGRBZnRlclJvd0V2ZW50ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgX0MuQWRkQWZ0ZXJSb3dFdmVudCgkcm93RWxlbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByb3dJZDtcbiAgICB9XG4gIH0sXG4gIFNldFRvVmlld1N0YXR1czogZnVuY3Rpb24gU2V0VG9WaWV3U3RhdHVzKCkge1xuICAgIHRoaXMuX1N0YXR1cyA9IFwiVmlld1wiO1xuICB9LFxuICBTZXRSb3dJc0VkaXRTdGF0dXM6IGZ1bmN0aW9uIFNldFJvd0lzRWRpdFN0YXR1cyh0cikge1xuICAgICQodHIpLmF0dHIoXCJFZGl0U3RhdHVzXCIsIFwiRWRpdFN0YXR1c1wiKTtcbiAgfSxcbiAgU2V0Um93SXNDb21wbGV0ZWRTdGF0dXM6IGZ1bmN0aW9uIFNldFJvd0lzQ29tcGxldGVkU3RhdHVzKHRyKSB7XG4gICAgJCh0cikuYXR0cihcIkVkaXRTdGF0dXNcIiwgXCJDb21wbGV0ZWRTdGF0dXNcIik7XG4gIH0sXG4gIFJvd0lzRWRpdFN0YXR1czogZnVuY3Rpb24gUm93SXNFZGl0U3RhdHVzKHRyKSB7XG4gICAgcmV0dXJuICQodHIpLmF0dHIoXCJFZGl0U3RhdHVzXCIpID09IFwiRWRpdFN0YXR1c1wiO1xuICB9LFxuICBSb3dJc0NvbXBsZXRlZFN0YXR1czogZnVuY3Rpb24gUm93SXNDb21wbGV0ZWRTdGF0dXModHIpIHtcbiAgICByZXR1cm4gJCh0cikuYXR0cihcIkVkaXRTdGF0dXNcIikgPT0gXCJDb21wbGV0ZWRTdGF0dXNcIjtcbiAgfSxcbiAgQ29tcGxldGVkRWRpdGluZ1JvdzogZnVuY3Rpb24gQ29tcGxldGVkRWRpdGluZ1JvdygpIHtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSAhPSBudWxsKSB7XG4gICAgICBpZiAoIXRoaXMuUm93SXNDb21wbGV0ZWRTdGF0dXModGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0pKSB7XG4gICAgICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgICAgICB2YXIgX2hvc3QgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLlZhbGlkYXRlQ29tcGxldGVkRWRpdGluZ1Jvd0VuYWJsZSh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSkpIHtcbiAgICAgICAgICB2YXIgX3JvdyA9IHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtO1xuICAgICAgICAgIHRoaXMuU2V0Um93SXNDb21wbGV0ZWRTdGF0dXMoX3Jvdyk7XG5cbiAgICAgICAgICBfcm93LmZpbmQoXCJ0ZFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkdGQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gJHRkLmF0dHIoXCJyZW5kZXJlclwiKTtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUlkID0gJHRkLmF0dHIoXCJ0ZW1wbGF0ZUlkXCIpO1xuXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSBfaG9zdC5fUHJvcF9Db25maWdNYW5hZ2VyLkdldFRlbXBsYXRlKHRlbXBsYXRlSWQpO1xuXG4gICAgICAgICAgICB2YXIgcmVuZGVyZXJPYmogPSBldmFsKFwiT2JqZWN0LmNyZWF0ZShcIiArIHJlbmRlcmVyICsgXCIpXCIpO1xuICAgICAgICAgICAgdmFyICRodG1sZWxlbSA9IHJlbmRlcmVyT2JqLkdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX0MsIHRlbXBsYXRlLCAkdGQsIF9yb3csIHRoaXMuXyRQcm9wX1RhYmxlRWxlbSwgJHRkLmNoaWxkcmVuKCkpO1xuICAgICAgICAgICAgJHRkLmh0bWwoXCJcIik7XG4gICAgICAgICAgICAkdGQuYXBwZW5kKCRodG1sZWxlbSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBWYWxpZGF0ZUNvbXBsZXRlZEVkaXRpbmdSb3dFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlQ29tcGxldGVkRWRpdGluZ1Jvd0VuYWJsZShlZGl0Um93KSB7XG4gICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyLkdldENvbmZpZygpO1xuXG4gICAgdmFyIF9ob3N0ID0gdGhpcztcblxuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIHZhciB2YWxpZGF0ZU1zZyA9IFwiXCI7XG4gICAgdmFyIHRkcyA9ICQoZWRpdFJvdykuZmluZChcInRkXCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkdGQgPSAkKHRkc1tpXSk7XG4gICAgICB2YXIgcmVuZGVyZXIgPSAkdGQuYXR0cihcInJlbmRlcmVyXCIpO1xuICAgICAgdmFyIHRlbXBsYXRlSWQgPSAkdGQuYXR0cihcInRlbXBsYXRlSWRcIik7XG5cbiAgICAgIHZhciB0ZW1wbGF0ZSA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0VGVtcGxhdGUodGVtcGxhdGVJZCk7XG5cbiAgICAgIHZhciByZW5kZXJlck9iaiA9IGV2YWwoXCJPYmplY3QuY3JlYXRlKFwiICsgcmVuZGVyZXIgKyBcIilcIik7XG4gICAgICB2YXIgdmFscmVzdWx0ID0gcmVuZGVyZXJPYmouVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfQywgdGVtcGxhdGUsICR0ZCwgZWRpdFJvdywgdGhpcy5fJFByb3BfVGFibGVFbGVtLCAkdGQuY2hpbGRyZW4oKSk7XG5cbiAgICAgIGlmICh2YWxyZXN1bHQuU3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgdmFsaWRhdGVNc2cgPSB2YWxyZXN1bHQuTXNnO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXJlc3VsdCAmJiB2YWxpZGF0ZU1zZyAhPSBudWxsKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgdmFsaWRhdGVNc2csIG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFJlbW92ZVJvdzogZnVuY3Rpb24gUmVtb3ZlUm93KCkge1xuICAgIGlmICh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbS5yZW1vdmUoKTtcblxuICAgICAgdGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0gPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgR2V0VGFibGVPYmplY3Q6IGZ1bmN0aW9uIEdldFRhYmxlT2JqZWN0KCkge1xuICAgIHJldHVybiB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG4gIH0sXG4gIEdldFJvd3M6IGZ1bmN0aW9uIEdldFJvd3MoKSB7XG4gICAgaWYgKHRoaXMuXyRQcm9wX1RhYmxlRWxlbSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5fJFByb3BfVGFibGVFbGVtLmZpbmQoXCJ0cjpub3QoOmZpcnN0KVwiKTtcbiAgICB9XG4gIH0sXG4gIEdldEVkaXRSb3c6IGZ1bmN0aW9uIEdldEVkaXRSb3coKSB7XG4gICAgaWYgKHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LFxuICBHZXRMYXN0Um93OiBmdW5jdGlvbiBHZXRMYXN0Um93KCkge1xuICAgIHZhciByb3cgPSB0aGlzLkdldEVkaXRSb3coKTtcbiAgICBpZiAocm93ID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIHZhciByb3dzID0gdGhpcy5HZXRSb3dzKCk7XG4gICAgdmFyIGluZGV4ID0gcm93cy5pbmRleChyb3cpO1xuXG4gICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgcmV0dXJuICQocm93c1tpbmRleCAtIDFdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgR2V0TmV4dFJvdzogZnVuY3Rpb24gR2V0TmV4dFJvdygpIHtcbiAgICB2YXIgcm93ID0gdGhpcy5HZXRFZGl0Um93KCk7XG4gICAgaWYgKHJvdyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICB2YXIgcm93cyA9IHRoaXMuR2V0Um93cygpO1xuICAgIHZhciBpbmRleCA9IHJvd3MuaW5kZXgocm93KTtcblxuICAgIGlmIChpbmRleCA8IHJvd3MubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuICQocm93c1tpbmRleCArIDFdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgTW92ZVVwOiBmdW5jdGlvbiBNb3ZlVXAoKSB7XG4gICAgdmFyIHJvdyA9IHRoaXMuR2V0TGFzdFJvdygpO1xuXG4gICAgaWYgKHJvdyAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIHJvdy5hdHRyKFwic3RhdHVzXCIpICE9IFwidW5kZWZpbmVkXCIgJiYgcm93LmF0dHIoXCJzdGF0dXNcIikgPT0gXCJkaXNhYmxlZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICB2YXIgbWUgPSB0aGlzLkdldEVkaXRSb3coKTtcbiAgICAgIHZhciB0ZW1wID0gbWUuYXR0cihcImNsYXNzXCIpO1xuICAgICAgbWUuYXR0cihcImNsYXNzXCIsIHJvdy5hdHRyKFwiY2xhc3NcIikpO1xuICAgICAgcm93LmF0dHIoXCJjbGFzc1wiLCB0ZW1wKTtcblxuICAgICAgaWYgKG1lICE9IG51bGwpIHtcbiAgICAgICAgcm93LmJlZm9yZShtZVswXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBNb3ZlRG93bjogZnVuY3Rpb24gTW92ZURvd24oKSB7XG4gICAgdmFyIHJvdyA9IHRoaXMuR2V0TmV4dFJvdygpO1xuXG4gICAgaWYgKHJvdyAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIHJvdy5hdHRyKFwic3RhdGVcIikgIT0gXCJ1bmRlZmluZWRcIiAmJiByb3cuYXR0cihcInN0YXRlXCIpID09IFwiZGlzYWJsZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgdmFyIG1lID0gdGhpcy5HZXRFZGl0Um93KCk7XG4gICAgICB2YXIgdGVtcCA9IG1lLmF0dHIoXCJjbGFzc1wiKTtcbiAgICAgIG1lLmF0dHIoXCJjbGFzc1wiLCByb3cuYXR0cihcImNsYXNzXCIpKTtcbiAgICAgIHJvdy5hdHRyKFwiY2xhc3NcIiwgdGVtcCk7XG5cbiAgICAgIGlmIChtZSAhPSBudWxsKSB7XG4gICAgICAgIHJvdy5hZnRlcihtZVswXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBSZW1vdmVBbGxSb3c6IGZ1bmN0aW9uIFJlbW92ZUFsbFJvdygpIHtcbiAgICBpZiAodGhpcy5fJFByb3BfVGFibGVFbGVtICE9IG51bGwpIHtcbiAgICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5maW5kKFwidHI6bm90KDpmaXJzdClcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIFVwZGF0ZVRvUm93OiBmdW5jdGlvbiBVcGRhdGVUb1Jvdyhyb3dJZCwgcm93RGF0YSkge1xuICAgIHZhciB0YWJsZUVsZW1lbnQgPSB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG5cbiAgICB2YXIgX2hvc3QgPSB0aGlzO1xuXG4gICAgdGFibGVFbGVtZW50LmZpbmQoXCJ0cltpc0hlYWRlciE9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuXG4gICAgICB2YXIgX3Jvd0lkID0gJHRyLmF0dHIoXCJpZFwiKTtcblxuICAgICAgaWYgKHJvd0lkID09IF9yb3dJZCkge1xuICAgICAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiByb3dEYXRhKSB7XG4gICAgICAgICAgJHRyLmZpbmQoXCJ0ZFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkdGQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyICRkaXNwbGF5RWxlbSA9ICR0ZC5maW5kKFwiW0lzU2VyaWFsaXplPSd0cnVlJ11cIik7XG4gICAgICAgICAgICB2YXIgYmluZE5hbWUgPSAkZGlzcGxheUVsZW0uYXR0cihcIkJpbmROYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAoYXR0ck5hbWUgPT0gYmluZE5hbWUpIHtcbiAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlSWQgPSAkdGQuYXR0cihcInRlbXBsYXRlSWRcIik7XG5cbiAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gX2hvc3QuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcblxuICAgICAgICAgICAgICB2YXIgdGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgIHZhciB2YWwgPSByb3dEYXRhW2JpbmROYW1lXTtcblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkZvcm1hdHRlciAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgdGVtcGxhdGUuRm9ybWF0dGVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGVtcGxhdGUuRm9ybWF0dGVyKHZhbCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodGV4dCA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IHZhbDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICgkZGlzcGxheUVsZW0ucHJvcCgndGFnTmFtZScpID09IFwiSU5QVVRcIikge1xuICAgICAgICAgICAgICAgIGlmICgkZGlzcGxheUVsZW0uYXR0cihcInR5cGVcIikudG9Mb3dlckNhc2UoKSA9PSBcImNoZWNrYm94XCIpIHt9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgJGRpc3BsYXlFbGVtLnZhbCh0ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICRkaXNwbGF5RWxlbS50ZXh0KHRleHQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVXBkYXRlVG9Sb3cgJGxhYmVsLnRleHQodGV4dCkgRXJyb3IhXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRkaXNwbGF5RWxlbS5hdHRyKFwiVmFsdWVcIiwgdmFsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIEdldFNlbGVjdFJvd0RhdGFCeVJvd0lkOiBmdW5jdGlvbiBHZXRTZWxlY3RSb3dEYXRhQnlSb3dJZChyb3dJZCkge1xuICAgIHZhciB0YWJsZUVsZW1lbnQgPSB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG4gICAgdmFyIHJvd0RhdGEgPSB7fTtcbiAgICB0YWJsZUVsZW1lbnQuZmluZChcInRyW2lzSGVhZGVyIT0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0ciA9ICQodGhpcyk7XG5cbiAgICAgIHZhciBfcm93SWQgPSAkdHIuYXR0cihcImlkXCIpO1xuXG4gICAgICBpZiAocm93SWQgPT0gX3Jvd0lkKSB7XG4gICAgICAgICR0ci5maW5kKFwiW0lzU2VyaWFsaXplPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcIlZhbHVlXCIpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcm93RGF0YVskKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKV0gPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm93RGF0YVskKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKV0gPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvd0RhdGE7XG4gIH0sXG4gIEdldFNlbGVjdFJvd0J5Um93SWQ6IGZ1bmN0aW9uIEdldFNlbGVjdFJvd0J5Um93SWQocm93SWQpIHtcbiAgICB2YXIgdGFibGVFbGVtZW50ID0gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICAgIHJldHVybiB0YWJsZUVsZW1lbnQuZmluZChcInRyW2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgfSxcbiAgR2V0QWxsUm93RGF0YTogZnVuY3Rpb24gR2V0QWxsUm93RGF0YSgpIHtcbiAgICB2YXIgdGFibGVFbGVtZW50ID0gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICAgIHZhciByb3dEYXRhcyA9IG5ldyBBcnJheSgpO1xuICAgIHRhYmxlRWxlbWVudC5maW5kKFwidHJbaXNIZWFkZXIhPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRyID0gJCh0aGlzKTtcbiAgICAgIHZhciByb3dEYXRhID0ge307XG4gICAgICAkdHIuZmluZChcIltJc1NlcmlhbGl6ZT0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICByb3dEYXRhWyQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpXSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICByb3dEYXRhWyQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpICsgXCJfX19UZXh0XCJdID0gJCh0aGlzKS5hdHRyKFwiVGV4dFwiKTtcbiAgICAgIH0pO1xuICAgICAgcm93RGF0YXMucHVzaChyb3dEYXRhKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcm93RGF0YXM7XG4gIH0sXG4gIEdldFNlcmlhbGl6ZUpzb246IGZ1bmN0aW9uIEdldFNlcmlhbGl6ZUpzb24oKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSgpO1xuICAgIHZhciB0YWJsZSA9IHRoaXMuXyRQcm9wX1RhYmxlRWxlbTtcbiAgICB0YWJsZS5maW5kKFwidHJbaXNIZWFkZXIhPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcm93ZGF0YSA9IG5ldyBPYmplY3QoKTtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuICAgICAgJHRyLmZpbmQoXCJbSXNTZXJpYWxpemU9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlcml0ZW0gPSAkKHRoaXMpO1xuICAgICAgICB2YXIgYmluZE5hbWUgPSBzZXJpdGVtLmF0dHIoXCJCaW5kTmFtZVwiKTtcbiAgICAgICAgdmFyIGJpbmRWYWx1ZSA9IHNlcml0ZW0uYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB2YXIgYmluZFRleHQgPSBzZXJpdGVtLmF0dHIoXCJUZXh0XCIpO1xuICAgICAgICByb3dkYXRhW2JpbmROYW1lXSA9IGJpbmRWYWx1ZTtcbiAgICAgICAgcm93ZGF0YVtiaW5kTmFtZSArIFwiX19fVGV4dFwiXSA9IGJpbmRUZXh0O1xuICAgICAgfSk7XG4gICAgICByZXN1bHQucHVzaChyb3dkYXRhKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBHZXRUYWJsZUVsZW1lbnQ6IGZ1bmN0aW9uIEdldFRhYmxlRWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICB9XG59O1xudmFyIEVkaXRUYWJsZUNvbmZpZ01hbmFnZXIgPSB7XG4gIF9Qcm9wX0NvbmZpZzoge30sXG4gIEluaXRpYWxpemF0aW9uQ29uZmlnOiBmdW5jdGlvbiBJbml0aWFsaXphdGlvbkNvbmZpZyhfY29uZmlnKSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fUHJvcF9Db25maWcsIF9jb25maWcpO1xuICAgIHZhciBfdGVtcGxhdGVzID0gdGhpcy5fUHJvcF9Db25maWcuVGVtcGxhdGVzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfdGVtcGxhdGVzW2ldO1xuICAgICAgdGVtcGxhdGUuVGVtcGxhdGVJZCA9IFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgIH1cbiAgfSxcbiAgR2V0Q29uZmlnOiBmdW5jdGlvbiBHZXRDb25maWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfQ29uZmlnO1xuICB9LFxuICBHZXRUZW1wbGF0ZTogZnVuY3Rpb24gR2V0VGVtcGxhdGUodGVtcGxhdGVJZCkge1xuICAgIHZhciBfdGVtcGxhdGVzID0gdGhpcy5fUHJvcF9Db25maWcuVGVtcGxhdGVzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfdGVtcGxhdGVzW2ldO1xuXG4gICAgICBpZiAodGVtcGxhdGUuVGVtcGxhdGVJZCA9PSB0ZW1wbGF0ZUlkKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcbnZhciBFZGl0VGFibGVWYWxpZGF0ZSA9IHtcbiAgX1NRTEtleVdvcmRBcnJheTogbmV3IEFycmF5KCksXG4gIEdldFNRTEtleVdvcmRzOiBmdW5jdGlvbiBHZXRTUUxLZXlXb3JkcygpIHtcbiAgICBpZiAodGhpcy5fU1FMS2V5V29yZEFycmF5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImluc2VydFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJ1cGRhdGVcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZGVsZXRlXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcInNlbGVjdFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJhc1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJmcm9tXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImRpc3RpbmN0XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIndoZXJlXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIm9yZGVyXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImJ5XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFzY1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJkZXNjXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImRlc2NcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiYW5kXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIm9yXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImJldHdlZW5cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwib3JkZXIgYnlcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiY291bnRcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZ3JvdXBcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZ3JvdXAgYnlcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiaGF2aW5nXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFsaWFzXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImpvaW5cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwibGVmdFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJyaWd0aFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJpbm5lZXJcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwidW5pb25cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwic3VtXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFsbFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJtaW51c1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJhbGVydFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJkcm9wXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImV4ZWNcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwidHJ1bmNhdGVcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX1NRTEtleVdvcmRBcnJheTtcbiAgfSxcbiAgVmFsaWRhdGU6IGZ1bmN0aW9uIFZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgU3VjY2VzczogdHJ1ZSxcbiAgICAgIE1zZzogXCJcIlxuICAgIH07XG4gICAgdmFyIHZhbGlkYXRlQ29uZmlnID0gdGVtcGxhdGUuVmFsaWRhdGU7XG5cbiAgICBpZiAodmFsaWRhdGVDb25maWcgIT0gdW5kZWZpbmVkICYmIHZhbGlkYXRlQ29uZmlnICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWxpZGF0ZVR5cGUgPSB2YWxpZGF0ZUNvbmZpZy5UeXBlO1xuXG4gICAgICBpZiAodmFsaWRhdGVUeXBlICE9IHVuZGVmaW5lZCAmJiB2YWxpZGF0ZVR5cGUgIT0gbnVsbCkge1xuICAgICAgICBzd2l0Y2ggKHZhbGlkYXRlVHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJOb3RFbXB0eVwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZiAodmFsID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5Nc2cgPSBcIuOAkFwiICsgdGVtcGxhdGUuVGl0bGUgKyBcIuOAkeS4jeiDveS4uuepuiFcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFwiTFVOb09ubHlcIjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWYgKC9eW2EtekEtWl1bYS16QS1aMC05X117MCx9JC8udGVzdCh2YWwpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LlN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXN1bHQuTXNnID0gXCLjgJBcIiArIHRlbXBsYXRlLlRpdGxlICsgXCLjgJHkuI3og73kuLrnqbrkuJTlj6rog73mmK/lrZfmr43jgIHkuIvliJLnur/jgIHmlbDlrZflubbku6XlrZfmr43lvIDlpLTvvIFcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFwiU1FMS2V5V29yZFwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZiAoL15bYS16QS1aXVthLXpBLVowLTlfXXswLH0kLy50ZXN0KHZhbCkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5Nc2cgPSBcIuOAkFwiICsgdGVtcGxhdGUuVGl0bGUgKyBcIuOAkeS4jeiDveS4uuepuuS4lOWPquiDveaYr+Wtl+avjeOAgeS4i+WIkue6v+OAgeaVsOWtl+W5tuS7peWtl+avjeW8gOWktO+8gVwiO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHZhbCA9IHZhbC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICB2YXIgc3FsS2V5V29yZHMgPSB0aGlzLkdldFNRTEtleVdvcmRzKCk7XG5cbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcWxLZXlXb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgPT0gc3FsS2V5V29yZHNbaV0udG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0LlN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5Nc2cgPSBcIuOAkFwiICsgdGVtcGxhdGUuVGl0bGUgKyBcIuOAkeivt+S4jeimgeS9v+eUqFNRTOWFs+mUruWtl+S9nOS4uuWIl+WQje+8gVwiO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG52YXIgRWRpdFRhYmxlRGVmYXVsZVZhbHVlID0ge1xuICBHZXRWYWx1ZTogZnVuY3Rpb24gR2V0VmFsdWUodGVtcGxhdGUpIHtcbiAgICB2YXIgZGVmYXVsdFZhbHVlQ29uZmlnID0gdGVtcGxhdGUuRGVmYXVsdFZhbHVlO1xuXG4gICAgaWYgKGRlZmF1bHRWYWx1ZUNvbmZpZyAhPSB1bmRlZmluZWQgJiYgZGVmYXVsdFZhbHVlQ29uZmlnICE9IG51bGwpIHtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWVUeXBlID0gZGVmYXVsdFZhbHVlQ29uZmlnLlR5cGU7XG5cbiAgICAgIGlmIChkZWZhdWx0VmFsdWVUeXBlICE9IHVuZGVmaW5lZCAmJiBkZWZhdWx0VmFsdWVUeXBlICE9IG51bGwpIHtcbiAgICAgICAgc3dpdGNoIChkZWZhdWx0VmFsdWVUeXBlKSB7XG4gICAgICAgICAgY2FzZSBcIkNvbnN0XCI6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWVDb25maWcuVmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlIFwiR1VJRFwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBcIlwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0NoZWNrQm94ID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFyIHZhbCA9IEVkaXRUYWJsZURlZmF1bGVWYWx1ZS5HZXRWYWx1ZSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5odG1sKCk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gXCJcIjtcblxuICAgIGlmICh2YWwgPT0gXCLmmK9cIikge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J2NoZWNrYm94JyBjaGVja2VkPSdjaGVja2VkJyAvPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J2NoZWNrYm94JyAvPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciAkZWxlbSA9IFwiXCI7XG5cbiAgICBpZiAodGVtcGxhdGUuSXNDTlZhbHVlKSB7XG4gICAgICBpZiAoZWRpdFN0YXVzSHRtbEVsZW0uYXR0cihcImNoZWNrZWRcIikgPT0gXCJjaGVja2VkXCIpIHtcbiAgICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyB2YWx1ZT0n5pivJz7mmK88L2xhYmVsPlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9J+WQpic+5ZCmPC9sYWJlbD5cIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlZGl0U3RhdXNIdG1sRWxlbS5hdHRyKFwiY2hlY2tlZFwiKSA9PSBcImNoZWNrZWRcIikge1xuICAgICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIHZhbHVlPScxJz7mmK88L2xhYmVsPlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9JzAnPuWQpjwvbGFiZWw+XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0Zvcm1hdHRlciA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIGlmICh0ZW1wbGF0ZS5Gb3JtYXR0ZXIgJiYgdHlwZW9mIHRlbXBsYXRlLkZvcm1hdHRlciA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhciBlZGl0RGF0YXMgPSBFZGl0VGFibGUuX1Byb3BfSnNvbkRhdGE7XG5cbiAgICAgIGlmIChlZGl0RGF0YXMpIHtcbiAgICAgICAgdmFyIHJvd0lkID0gaG9zdFJvdy5hdHRyKFwiaWRcIik7XG4gICAgICAgIHZhciByb3dEYXRhID0gZWRpdERhdGFzW3Jvd0lkXTtcblxuICAgICAgICBpZiAocm93RGF0YSkge1xuICAgICAgICAgIHJldHVybiAkKHRlbXBsYXRlLkZvcm1hdHRlcih0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgcm93RGF0YSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiXCI7XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgaWYgKHRlbXBsYXRlLkZvcm1hdHRlciAmJiB0eXBlb2YgdGVtcGxhdGUuRm9ybWF0dGVyID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIGVkaXREYXRhcyA9IEVkaXRUYWJsZS5fUHJvcF9Kc29uRGF0YTtcblxuICAgICAgaWYgKGVkaXREYXRhcykge1xuICAgICAgICB2YXIgcm93SWQgPSBob3N0Um93LmF0dHIoXCJpZFwiKTtcbiAgICAgICAgdmFyIHJvd0RhdGEgPSBlZGl0RGF0YXNbcm93SWRdO1xuXG4gICAgICAgIGlmIChyb3dEYXRhKSB7XG4gICAgICAgICAgcmV0dXJuICQodGVtcGxhdGUuRm9ybWF0dGVyKHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCByb3dEYXRhKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0xhYmVsID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuRm9ybWF0ZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmh0bWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgJGVsZW07XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkZvcm1hdGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBUZXh0PSdcIiArIHRleHQgKyBcIicgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsICsgXCInPlwiICsgdmFsICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRleHQgPSB0ZW1wbGF0ZS5Gb3JtYXRlcih2YWwpO1xuICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBUZXh0PVwiICsgdGV4dCArIFwiIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPVwiICsgdmFsICsgXCI+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyICRlbGVtO1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuRm9ybWF0ZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIFRleHQ9J1wiICsgdGV4dCArIFwiJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB2YWwgKyBcIjwvbGFiZWw+XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGV4dCA9IHRlbXBsYXRlLkZvcm1hdGVyKHZhbCk7XG4gICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIFRleHQ9J1wiICsgdGV4dCArIFwiJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9SYWRpbyA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gXCJcIjtcblxuICAgIGlmIChudWxsICE9IHZpZXdTdGF1c0h0bWxFbGVtICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCAmJiB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiY2hlY2tlZFwiKSA9PSBcImNoZWNrZWRcIiB8fCB2YWwgPT0gMSkge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3JhZGlvJyBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgbmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBjaGVja2VkPSdjaGVja2VkJyB2YWx1ZT0nMScvPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3JhZGlvJyBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgbmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyB2YWx1ZT0nMCcvPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciAkZWxlbSA9IFwiXCI7XG5cbiAgICBpZiAoZWRpdFN0YXVzSHRtbEVsZW0uYXR0cihcImNoZWNrZWRcIikgPT0gXCJjaGVja2VkXCIpIHtcbiAgICAgICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSdyYWRpbycgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIG5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIidjaGVja2VkPSdjaGVja2VkJyAgdmFsdWU9JzEnLz5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSdyYWRpbycgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIG5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9JzAnLz5cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfU2VsZWN0ID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIGNvbmZpZ1NvdXJjZSA9IG51bGw7XG5cbiAgICBpZiAodGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZSAhPSBudWxsKSB7XG4gICAgICBjb25maWdTb3VyY2UgPSB0ZW1wbGF0ZS5DbGllbnREYXRhU291cmNlO1xuICAgIH0gZWxzZSBpZiAodGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZUZ1bmMgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2VGdW5jICE9IG51bGwpIHtcbiAgICAgIGNvbmZpZ1NvdXJjZSA9IHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2VGdW5jKHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2VGdW5jUGFyYXMsIF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZ1NvdXJjZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJChcIjxsYWJlbD7mib7kuI3liLDmlbDmja7mupDorr7nva4s6K+35ZyodGVtcGxhdGXkuK3orr7nva7mlbDmja7mupA8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgdHh0ID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YXIgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPHNlbGVjdCBzdHlsZT0nd2lkdGg6IDEwMCUnIC8+XCIpO1xuXG4gICAgaWYgKGNvbmZpZ1NvdXJjZVswXS5ncm91cCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWdTb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG9wdGdyb3VwID0gJChcIjxvcHRncm91cCAvPlwiKTtcbiAgICAgICAgb3B0Z3JvdXAuYXR0cihcImxhYmVsXCIsIGNvbmZpZ1NvdXJjZVtpXS5ncm91cCk7XG5cbiAgICAgICAgaWYgKGNvbmZpZ1NvdXJjZVtpXS5vcHRpb25zKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb25maWdTb3VyY2VbaV0ub3B0aW9ucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIG9wdGlvbiA9ICQoXCI8b3B0aW9uIC8+XCIpO1xuICAgICAgICAgICAgb3B0aW9uLmF0dHIoXCJ2YWx1ZVwiLCBjb25maWdTb3VyY2VbaV0ub3B0aW9uc1tqXS52YWx1ZSk7XG4gICAgICAgICAgICBvcHRpb24uYXR0cihcIlRleHRcIiwgY29uZmlnU291cmNlW2ldLm9wdGlvbnNbal0udGV4dCk7XG4gICAgICAgICAgICBvcHRpb24udGV4dChjb25maWdTb3VyY2VbaV0ub3B0aW9uc1tqXS50ZXh0KTtcbiAgICAgICAgICAgIG9wdGdyb3VwLmFwcGVuZChvcHRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRlbGVtLmFwcGVuZChvcHRncm91cCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnU291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gY29uZmlnU291cmNlW2ldO1xuICAgICAgICAkZWxlbS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIGl0ZW0uVmFsdWUgKyBcIicgdGV4dD0nXCIgKyBpdGVtLlRleHQgKyBcIic+XCIgKyBpdGVtLlRleHQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuQ2hhbmdlRXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAkZWxlbS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICB0ZW1wbGF0ZS5DaGFuZ2VFdmVudCh0aGlzLCBfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB2YXIgdGV4dCA9IGVkaXRTdGF1c0h0bWxFbGVtLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikuYXR0cihcIlRleHRcIik7XG4gICAgdmFyICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsICsgXCInIFRleHQ9J1wiICsgdGV4dCArIFwiJz5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX1NlbGVjdFJvd0NoZWNrQm94ID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGlucHV0IElzU2VyaWFsaXplPSd0cnVlJyB0eXBlPSdjaGVja2JveCcgY2hlY2tlZD0nY2hlY2tlZCcgIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIC8+XCIpO1xuICAgICRlbGVtLmF0dHIoXCJWYWx1ZVwiLCB2YWwpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gJChlZGl0U3RhdXNIdG1sRWxlbSkuYXR0cihcIlZhbHVlXCIpO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8aW5wdXQgSXNTZXJpYWxpemU9J3RydWUnIHR5cGU9J2NoZWNrYm94JyAgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgLz5cIik7XG4gICAgJGVsZW0uYXR0cihcIlZhbHVlXCIsIHZhbCk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfVGV4dEJveCA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uaHRtbCgpO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgSXNTZXJpYWxpemU9J3RydWUnIHN0eWxlPSd3aWR0aDogOTglJyAvPlwiKTtcbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbCArIFwiJz5cIiArIHZhbCArIFwiPC9sYWJlbD5cIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuVmFsaWRhdGUgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHRlbXBsYXRlLlZhbGlkYXRlID09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIFN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIE1zZzogbnVsbFxuICAgICAgfTtcbiAgICAgIHJlc3VsdC5TdWNjZXNzID0gdGVtcGxhdGUuVmFsaWRhdGUoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDb2x1bW5fU2VsZWN0RGVmYXVsdFZhbHVlID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIGRlZmF1bHRUeXBlID0gXCJcIjtcbiAgICB2YXIgZGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICB2YXIgZGVmYXVsdFRleHQgPSBcIlwiO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWZhdWx0VHlwZSA9IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFR5cGVcIl0gPyBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRUeXBlXCJdIDogXCJcIjtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFZhbHVlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VmFsdWVcIl0gOiBcIlwiO1xuICAgICAgZGVmYXVsdFRleHQgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRUZXh0XCJdID8ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VGV4dFwiXSA6IFwiXCI7XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2aWV3U3RhdXNIdG1sRWxlbS5maW5kKFwibGFiZWxcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImNvbHVtbkRlZmF1bHRUeXBlXCIpIHtcbiAgICAgICAgICBkZWZhdWx0VHlwZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiY29sdW1uRGVmYXVsdFRleHRcIikge1xuICAgICAgICAgIGRlZmF1bHRUZXh0ID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIikgPT0gXCJjb2x1bW5EZWZhdWx0VmFsdWVcIikge1xuICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgdmFyICRpbnB1dFR4dCA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgc3R5bGU9J3dpZHRoOiA5MCUnIHJlYWRvbmx5IC8+XCIpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFR5cGVcIiwgZGVmYXVsdFR5cGUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIGRlZmF1bHRWYWx1ZSk7XG4gICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiLCBkZWZhdWx0VGV4dCk7XG4gICAgJGlucHV0VHh0LnZhbChKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuZm9ybWF0VGV4dChkZWZhdWx0VHlwZSwgZGVmYXVsdFRleHQpKTtcbiAgICB2YXIgJGlucHV0QnRuID0gJChcIjxpbnB1dCBjbGFzcz0nbm9ybWFsYnV0dG9uLXYxJyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDRweDsnIHR5cGU9J2J1dHRvbicgdmFsdWU9Jy4uLicvPlwiKTtcbiAgICAkZWxlbS5hcHBlbmQoJGlucHV0VHh0KS5hcHBlbmQoJGlucHV0QnRuKTtcbiAgICB3aW5kb3cuJFRlbXAkSW5wdXR0eHQgPSAkaW5wdXRUeHQ7XG4gICAgJGlucHV0QnRuLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5iZWdpblNlbGVjdChcIkNvbHVtbl9TZWxlY3REZWZhdWx0VmFsdWVcIik7XG4gICAgfSk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciAkaW5wdXRUeHQgPSBlZGl0U3RhdXNIdG1sRWxlbS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpO1xuXG4gICAgaWYgKCRpbnB1dFR4dC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgZGVmYXVsdFR5cGUgPSAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRUeXBlXCIpO1xuICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9ICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIpO1xuICAgICAgdmFyIGRlZmF1bHRUZXh0ID0gJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiKTtcbiAgICAgIHZhciAkZWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbD5cIiArIEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KGRlZmF1bHRUeXBlLCBkZWZhdWx0VGV4dCkgKyBcIjwvbGFiZWw+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nY29sdW1uRGVmYXVsdFR5cGUnIFZhbHVlPSdcIiArIGRlZmF1bHRUeXBlICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdjb2x1bW5EZWZhdWx0VGV4dCcgVmFsdWU9J1wiICsgZGVmYXVsdFRleHQgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2NvbHVtbkRlZmF1bHRWYWx1ZScgVmFsdWU9J1wiICsgZGVmYXVsdFZhbHVlICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICByZXR1cm4gJGVsZW07XG4gICAgfVxuXG4gICAgcmV0dXJuICQoXCI8bGFiZWw+PC9sYWJlbD5cIik7XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfSxcbiAgc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZShkZWZhdWx0RGF0YSkge1xuICAgIHZhciAkaW5wdXRUeHQgPSB3aW5kb3cuJFRlbXAkSW5wdXR0eHQ7XG5cbiAgICBpZiAobnVsbCAhPSBkZWZhdWx0RGF0YSkge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VHlwZVwiLCBkZWZhdWx0RGF0YS5UeXBlKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIGRlZmF1bHREYXRhLlZhbHVlKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFRleHRcIiwgZGVmYXVsdERhdGEuVGV4dCk7XG4gICAgICAkaW5wdXRUeHQudmFsKEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KGRlZmF1bHREYXRhLlR5cGUsIGRlZmF1bHREYXRhLlRleHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VHlwZVwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIFwiXCIpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC52YWwoXCJcIik7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29sdW1uX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIgPSB7XG4gIF9maWVsZERhdGFUeXBlQXJyYXk6IG51bGwsXG4gIEdldEZpZWxkRGF0YVR5cGVBcnJheTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZUFycmF5KCkge1xuICAgIGlmICh0aGlzLl9maWVsZERhdGFUeXBlQXJyYXkgPT0gbnVsbCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmMoXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVGaWVsZFR5cGUuZG9cIiwge30sIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBsaXN0ID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKGRhdGEuZGF0YSk7XG5cbiAgICAgICAgICBpZiAobGlzdCAhPSBudWxsICYmIGxpc3QgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBfc2VsZi5fZmllbGREYXRhVHlwZUFycmF5ID0gbGlzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIFwiQWxlcnRMb2FkaW5nUXVlcnlFcnJvclwiLCB7fSwgXCLliqDovb3lrZfmrrXnsbvlnovlpLHotKXvvIFcIiwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZmllbGREYXRhVHlwZUFycmF5O1xuICB9LFxuICBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWUoVmFsdWUpIHtcbiAgICB2YXIgYXJyYXlEYXRhID0gdGhpcy5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqID0gYXJyYXlEYXRhW2ldO1xuXG4gICAgICBpZiAob2JqLlZhbHVlID09IFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH0sXG4gIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQ6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQodGV4dCkge1xuICAgIHZhciBhcnJheURhdGEgPSB0aGlzLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmogPSBhcnJheURhdGFbaV07XG5cbiAgICAgIGlmIChvYmouVGV4dCA9PSB0ZXh0KSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH1cbn07XG52YXIgQ29sdW1uX1NlbGVjdEZpZWxkVHlwZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8c2VsZWN0IC8+XCIpO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRhdGFUeXBlTmFtZVwiXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgX2ZpZWxkRGF0YVR5cGVBcnJheSA9IENvbHVtbl9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfZmllbGREYXRhVHlwZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlZhbHVlO1xuICAgICAgdmFyIHRleHQgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlRleHQ7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHZhbHVlICsgXCInPlwiICsgdGV4dCArIFwiPC9vcHRpb24+XCIpO1xuICAgIH1cblxuICAgIGlmICh2YWwgIT0gXCJcIikge1xuICAgICAgJGVsZW0udmFsKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtLnZhbChDb2x1bW5fU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0KFwi5a2X56ym5LiyXCIpLlZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbHVlID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyIHRleHQgPSBDb2x1bW5fU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZSh2YWx1ZSkuVGV4dDtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWx1ZSArIFwiJz5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0ZpZWxkTmFtZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uaHRtbCgpO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgc3R5bGU9J3dpZHRoOiA5OCUnIC8+XCIpO1xuICAgICRlbGVtLnZhbCh2YWwpO1xuICAgICRlbGVtLmF0dHIoXCJCaW5kTmFtZVwiLCB0ZW1wbGF0ZS5CaW5kTmFtZSk7XG4gICAgJGVsZW0uYXR0cihcIlZhbFwiLCB2YWwpO1xuICAgICRlbGVtLmF0dHIoXCJJc1NlcmlhbGl6ZVwiLCBcInRydWVcIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKS50b1VwcGVyQ2FzZSgpO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbCArIFwiJz5cIiArIHZhbCArIFwiPC9sYWJlbD5cIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICB2YXIgcmVzdWx0ID0gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG5cbiAgICBpZiAocmVzdWx0LlN1Y2Nlc3MpIHtcbiAgICAgIGhvc3RUYWJsZS5maW5kKFwiW3JlbmRlcmVyPUVkaXRUYWJsZV9GaWVsZE5hbWVdXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2VyaXRlbSA9ICQodGhpcyk7XG4gICAgICAgIHNlcml0ZW0uZmluZChcImxhYmVsXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBsYWJlbGl0ZW0gPSAkKHRoaXMpO1xuXG4gICAgICAgICAgaWYgKGxhYmVsaXRlbS50ZXh0KCkgPT0gdmFsIHx8IGxhYmVsaXRlbS50ZXh0KCkgPT0gdmFsLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgU3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgIE1zZzogXCJb5a2X5q615ZCN56ewXeS4jeiDvemHjeWkjSFcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9TZWxlY3REZWZhdWx0VmFsdWUgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgZmllbGREZWZhdWx0VHlwZSA9IFwiXCI7XG4gICAgdmFyIGZpZWxkRGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICB2YXIgZmllbGREZWZhdWx0VGV4dCA9IFwiXCI7XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGZpZWxkRGVmYXVsdFR5cGUgPSBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFR5cGVcIl0gPyBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFR5cGVcIl0gOiBcIlwiO1xuICAgICAgZmllbGREZWZhdWx0VmFsdWUgPSBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFZhbHVlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRWYWx1ZVwiXSA6IFwiXCI7XG4gICAgICBmaWVsZERlZmF1bHRUZXh0ID0ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRUZXh0XCJdID8ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRUZXh0XCJdIDogXCJcIjtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZpZXdTdGF1c0h0bWxFbGVtLmZpbmQoXCJsYWJlbFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiZmllbGREZWZhdWx0VHlwZVwiKSB7XG4gICAgICAgICAgZmllbGREZWZhdWx0VHlwZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiZmllbGREZWZhdWx0VGV4dFwiKSB7XG4gICAgICAgICAgZmllbGREZWZhdWx0VGV4dCA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiZmllbGREZWZhdWx0VmFsdWVcIikge1xuICAgICAgICAgIGZpZWxkRGVmYXVsdFZhbHVlID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcbiAgICB2YXIgJGlucHV0VHh0ID0gJChcIjxpbnB1dCB0eXBlPSd0ZXh0JyBzdHlsZT0nd2lkdGg6IDkwJScgcmVhZG9ubHkgLz5cIik7XG4gICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUeXBlXCIsIGZpZWxkRGVmYXVsdFR5cGUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VmFsdWVcIiwgZmllbGREZWZhdWx0VmFsdWUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VGV4dFwiLCBmaWVsZERlZmF1bHRUZXh0KTtcbiAgICAkaW5wdXRUeHQudmFsKEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KGZpZWxkRGVmYXVsdFR5cGUsIGZpZWxkRGVmYXVsdFRleHQpKTtcbiAgICB2YXIgJGlucHV0QnRuID0gJChcIjxpbnB1dCBjbGFzcz0nbm9ybWFsYnV0dG9uLXYxJyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDRweDsnIHR5cGU9J2J1dHRvbicgdmFsdWU9Jy4uLicvPlwiKTtcbiAgICAkZWxlbS5hcHBlbmQoJGlucHV0VHh0KS5hcHBlbmQoJGlucHV0QnRuKTtcbiAgICB3aW5kb3cuJFRlbXAkSW5wdXR0eHQgPSAkaW5wdXRUeHQ7XG4gICAgJGlucHV0QnRuLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIHRhYmxlRGVzaW9uLnNlbGVjdERlZmF1bHRWYWx1ZURpYWxvZ0JlZ2luKEVkaXRUYWJsZV9TZWxlY3REZWZhdWx0VmFsdWUsIG51bGwpO1xuICAgIH0pO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgJGlucHV0VHh0ID0gZWRpdFN0YXVzSHRtbEVsZW0uZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKTtcblxuICAgIGlmICgkaW5wdXRUeHQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGRlZmF1bHRUeXBlID0gJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUeXBlXCIpO1xuICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9ICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VmFsdWVcIik7XG4gICAgICB2YXIgZGVmYXVsdFRleHQgPSAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFRleHRcIik7XG4gICAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWw+XCIgKyBKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuZm9ybWF0VGV4dChkZWZhdWx0VHlwZSwgZGVmYXVsdFRleHQpICsgXCI8L2xhYmVsPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2ZpZWxkRGVmYXVsdFR5cGUnIFZhbHVlPSdcIiArIGRlZmF1bHRUeXBlICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdmaWVsZERlZmF1bHRUZXh0JyBWYWx1ZT0nXCIgKyBkZWZhdWx0VGV4dCArIFwiJyBzdHlsZT0nZGlzcGxheTpub25lJy8+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nZmllbGREZWZhdWx0VmFsdWUnIFZhbHVlPSdcIiArIGRlZmF1bHRWYWx1ZSArIFwiJyBzdHlsZT0nZGlzcGxheTpub25lJy8+XCIpO1xuICAgICAgcmV0dXJuICRlbGVtO1xuICAgIH1cblxuICAgIHJldHVybiAkKFwiPGxhYmVsPjwvbGFiZWw+XCIpO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH0sXG4gIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUoZGVmYXVsdERhdGEpIHtcbiAgICB2YXIgJGlucHV0VHh0ID0gd2luZG93LiRUZW1wJElucHV0dHh0O1xuXG4gICAgaWYgKG51bGwgIT0gZGVmYXVsdERhdGEpIHtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VHlwZVwiLCBkZWZhdWx0RGF0YS5UeXBlKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VmFsdWVcIiwgZGVmYXVsdERhdGEuVmFsdWUpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUZXh0XCIsIGRlZmF1bHREYXRhLlRleHQpO1xuICAgICAgJGlucHV0VHh0LnZhbChKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuZm9ybWF0VGV4dChkZWZhdWx0RGF0YS5UeXBlLCBkZWZhdWx0RGF0YS5UZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VHlwZVwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VmFsdWVcIiwgXCJcIik7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFRleHRcIiwgXCJcIik7XG4gICAgICAkaW5wdXRUeHQudmFsKFwiXCIpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyID0ge1xuICBfZmllbGREYXRhVHlwZUFycmF5OiBudWxsLFxuICBHZXRGaWVsZERhdGFUeXBlQXJyYXk6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVBcnJheSgpIHtcbiAgICBpZiAodGhpcy5fZmllbGREYXRhVHlwZUFycmF5ID09IG51bGwpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3RTeW5jKFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlRmllbGRUeXBlLmRvXCIsIHt9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IHRydWUpIHtcbiAgICAgICAgICB2YXIgbGlzdCA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihkYXRhLmRhdGEpO1xuXG4gICAgICAgICAgaWYgKGxpc3QgIT0gbnVsbCAmJiBsaXN0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgX3NlbGYuX2ZpZWxkRGF0YVR5cGVBcnJheSA9IGxpc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBcIkFsZXJ0TG9hZGluZ1F1ZXJ5RXJyb3JcIiwge30sIFwi5Yqg6L295a2X5q6157G75Z6L5aSx6LSl77yBXCIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2ZpZWxkRGF0YVR5cGVBcnJheTtcbiAgfSxcbiAgR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWU6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVZhbHVlKFZhbHVlKSB7XG4gICAgdmFyIGFycmF5RGF0YSA9IHRoaXMuR2V0RmllbGREYXRhVHlwZUFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9iaiA9IGFycmF5RGF0YVtpXTtcblxuICAgICAgaWYgKG9iai5WYWx1ZSA9PSBWYWx1ZSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZXJ0KFwi5om+5LiN5Yiw5oyH5a6a55qE5pWw5o2u57G75Z6L77yM6K+356Gu6K6k5piv5ZCm5pSv5oyB6K+l57G75Z6L77yBXCIpO1xuICB9LFxuICBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0OiBmdW5jdGlvbiBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0KHRleHQpIHtcbiAgICB2YXIgYXJyYXlEYXRhID0gdGhpcy5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqID0gYXJyYXlEYXRhW2ldO1xuXG4gICAgICBpZiAob2JqLlRleHQgPT0gdGV4dCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZXJ0KFwi5om+5LiN5Yiw5oyH5a6a55qE5pWw5o2u57G75Z6L77yM6K+356Gu6K6k5piv5ZCm5pSv5oyB6K+l57G75Z6L77yBXCIpO1xuICB9XG59O1xudmFyIEVkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGUgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPHNlbGVjdCAvPlwiKTtcblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERhdGFUeXBlXCJdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uYXR0cihcIlZhbHVlXCIpO1xuICAgIH1cblxuICAgIHZhciBfZmllbGREYXRhVHlwZUFycmF5ID0gRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIuR2V0RmllbGREYXRhVHlwZUFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9maWVsZERhdGFUeXBlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB2YWx1ZSA9IF9maWVsZERhdGFUeXBlQXJyYXlbaV0uVmFsdWU7XG4gICAgICB2YXIgdGV4dCA9IF9maWVsZERhdGFUeXBlQXJyYXlbaV0uVGV4dDtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgdmFsdWUgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L29wdGlvbj5cIik7XG4gICAgfVxuXG4gICAgaWYgKHZhbCAhPSBcIlwiKSB7XG4gICAgICAkZWxlbS52YWwodmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0udmFsKEVkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyLkdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQoXCLlrZfnrKbkuLJcIikuVmFsdWUpO1xuICAgIH1cblxuICAgICRlbGVtLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsID0gJCh0aGlzKS52YWwoKTtcblxuICAgICAgaWYgKHZhbCA9PSBcIuaVtOaVsFwiKSB7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICB9IGVsc2UgaWYgKHZhbCA9PSBcIuWwj+aVsFwiKSB7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMTApO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMik7XG4gICAgICB9IGVsc2UgaWYgKHZhbCA9PSBcIuaXpeacn+aXtumXtFwiKSB7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgyMCk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgfSBlbHNlIGlmICh2YWwgPT0gXCLlrZfnrKbkuLJcIikge1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDUwKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICB9IGVsc2UgaWYgKHZhbCA9PSBcIumVv+Wtl+espuS4slwiKSB7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWx1ZSA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciB0ZXh0ID0gRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIuR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWUodmFsdWUpLlRleHQ7XG4gICAgdmFyICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsdWUgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFRyZWVUYWJsZUNvbmZpZyA9IHtcbiAgQ2FuRGVsZXRlV2hlbkhhc0NoaWxkOiBmYWxzZSxcbiAgSWRGaWVsZDogXCJPcmdhbl9JZFwiLFxuICBSb3dJZFByZWZpeDogXCJUcmVlVGFibGVfXCIsXG4gIExvYWRDaGlsZEpzb25VUkw6IFwiXCIsXG4gIExvYWRDaGlsZEZ1bmM6IG51bGwsXG4gIE9wZW5MZXZlbDogMSxcbiAgQ2hpbGRUZXN0RmllbGQ6IFwiQ2hpbGRfQ291bnRcIixcbiAgVGVtcGxhdGVzOiBbe1xuICAgIFRpdGxlOiBcIue7hOe7h+acuuaehOWQjeensFwiLFxuICAgIEZpZWxkTmFtZTogXCJPcmdhbl9OYW1lXCIsXG4gICAgVGl0bGVDZWxsQ2xhc3NOYW1lOiBcIlRpdGxlQ2VsbFwiLFxuICAgIFJlbmRlcmVyOiBcIkxhYmxlXCIsXG4gICAgSGlkZGVuOiBmYWxzZSxcbiAgICBUaXRsZUNlbGxBdHRyczoge30sXG4gICAgV2lkdGg6IFwiNTAlXCJcbiAgfSwge1xuICAgIFRpdGxlOiBcIue7hOe7h+acuuaehOe8qeWGmeWQjeensFwiLFxuICAgIEZpZWxkTmFtZTogXCJPcmdhbl9TaG9ydE5hbWVcIixcbiAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgUmVuZGVyZXI6IFwiTGFibGVcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fSxcbiAgICBXaWR0aDogXCIyMCVcIlxuICB9LCB7XG4gICAgVGl0bGU6IFwi57uE57uH57yW5Y+3XCIsXG4gICAgRmllbGROYW1lOiBcIk9yZ2FuX0NvZGVcIixcbiAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgUmVuZGVyZXI6IFwiTGFibGVcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fSxcbiAgICBXaWR0aDogXCIyMCVcIlxuICB9LCB7XG4gICAgVGl0bGU6IFwi57uE57uHSURcIixcbiAgICBGaWVsZE5hbWU6IFwiT3JnYW5fSWRcIixcbiAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgUmVuZGVyZXI6IFwiTGFibGVcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fSxcbiAgICBXaWR0aDogXCIxMFwiXG4gIH1dLFxuICBUYWJsZUNsYXNzOiBcIlRyZWVUYWJsZVwiLFxuICBSZW5kZXJlclRvOiBcImRpdkVkaXRUYWJsZVwiLFxuICBUYWJsZUlkOiBcIlRyZWVUYWJsZVwiLFxuICBUYWJsZUF0dHJzOiB7XG4gICAgY2VsbHBhZGRpbmc6IFwiMFwiLFxuICAgIGNlbGxzcGFjaW5nOiBcIjBcIixcbiAgICBib3JkZXI6IFwiMFwiXG4gIH1cbn07XG52YXIgVHJlZVRhYmxlSnNvbkRhdGEgPSB7XG4gIE9yZ2FuX0lkOiBcIjBcIixcbiAgT3JnYW5fTmFtZTogXCJyb290XCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIyXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMlwiLFxuICBDaGlsZF9Db3VudDogMixcbiAgTm9kZXM6IFt7XG4gICAgT3JnYW5fSWQ6IFwiMVwiLFxuICAgIE9yZ2FuX05hbWU6IFwiMU9yZ2FuX05hbWVcIixcbiAgICBPcmdhbl9TaG9ydE5hbWU6IFwiMVwiLFxuICAgIE9yZ2FuX0NvZGU6IFwiMVwiLFxuICAgIENoaWxkX0NvdW50OiAyLFxuICAgIE5vZGVzOiBbe1xuICAgICAgT3JnYW5fSWQ6IFwiMS0xXCIsXG4gICAgICBPcmdhbl9OYW1lOiBcIjEtMU9yZ2FuX05hbWVcIixcbiAgICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTFcIixcbiAgICAgIE9yZ2FuX0NvZGU6IFwiMS0xXCIsXG4gICAgICBDaGlsZF9Db3VudDogMSxcbiAgICAgIE5vZGVzOiBbe1xuICAgICAgICBPcmdhbl9JZDogXCIxLTEtMVwiLFxuICAgICAgICBPcmdhbl9OYW1lOiBcIjEtMS0xT3JnYW5fTmFtZVwiLFxuICAgICAgICBPcmdhbl9TaG9ydE5hbWU6IFwiMS0xLTFcIixcbiAgICAgICAgT3JnYW5fQ29kZTogXCIxLTFcIixcbiAgICAgICAgQ2hpbGRfQ291bnQ6IDBcbiAgICAgIH1dXG4gICAgfSwge1xuICAgICAgT3JnYW5fSWQ6IFwiMS0yXCIsXG4gICAgICBPcmdhbl9OYW1lOiBcIjEtMk9yZ2FuX05hbWVcIixcbiAgICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTJcIixcbiAgICAgIE9yZ2FuX0NvZGU6IFwiMS0yXCIsXG4gICAgICBDaGlsZF9Db3VudDogMFxuICAgIH1dXG4gIH0sIHtcbiAgICBPcmdhbl9JZDogXCIyXCIsXG4gICAgT3JnYW5fTmFtZTogXCIyT3JnYW5fTmFtZVwiLFxuICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIyXCIsXG4gICAgT3JnYW5fQ29kZTogXCIyXCIsXG4gICAgQ2hpbGRfQ291bnQ6IDBcbiAgfSwge1xuICAgIE9yZ2FuX0lkOiBcIjNcIixcbiAgICBPcmdhbl9OYW1lOiBcIjNPcmdhbl9OYW1lXCIsXG4gICAgT3JnYW5fU2hvcnROYW1lOiBcIjNcIixcbiAgICBPcmdhbl9Db2RlOiBcIjNcIixcbiAgICBDaGlsZF9Db3VudDogMFxuICB9LCB7XG4gICAgT3JnYW5fSWQ6IFwiNFwiLFxuICAgIE9yZ2FuX05hbWU6IFwiNE9yZ2FuX05hbWVcIixcbiAgICBPcmdhbl9TaG9ydE5hbWU6IFwiNFwiLFxuICAgIE9yZ2FuX0NvZGU6IFwiNFwiLFxuICAgIENoaWxkX0NvdW50OiAwXG4gIH1dXG59O1xudmFyIFRyZWVUYWJsZUpzb25EYXRhTGlzdCA9IFt7XG4gIE9yZ2FuX0lkOiBcIjBcIixcbiAgT3JnYW5fTmFtZTogXCJyb290XCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIyXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMlwiLFxuICBDaGlsZF9Db3VudDogMlxufSwge1xuICBPcmdhbl9JZDogXCIxXCIsXG4gIE9yZ2FuX05hbWU6IFwiMU9yZ2FuX05hbWVcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjFcIixcbiAgT3JnYW5fQ29kZTogXCIxXCIsXG4gIENoaWxkX0NvdW50OiAyLFxuICBQYXJlbnRfSWQ6IFwiMFwiXG59LCB7XG4gIE9yZ2FuX0lkOiBcIjJcIixcbiAgT3JnYW5fTmFtZTogXCIyT3JnYW5fTmFtZVwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMlwiLFxuICBPcmdhbl9Db2RlOiBcIjJcIixcbiAgQ2hpbGRfQ291bnQ6IDAsXG4gIFBhcmVudF9JZDogXCIwXCJcbn0sIHtcbiAgT3JnYW5fSWQ6IFwiMS0xXCIsXG4gIE9yZ2FuX05hbWU6IFwiMS0xT3JnYW5fTmFtZVwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMS0xXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMS0xXCIsXG4gIENoaWxkX0NvdW50OiAxLFxuICBQYXJlbnRfSWQ6IFwiMVwiXG59LCB7XG4gIE9yZ2FuX0lkOiBcIjEtMlwiLFxuICBPcmdhbl9OYW1lOiBcIjEtMk9yZ2FuX05hbWVcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjEtMlwiLFxuICBPcmdhbl9Db2RlOiBcIjEtMlwiLFxuICBDaGlsZF9Db3VudDogMCxcbiAgUGFyZW50X0lkOiBcIjFcIlxufSwge1xuICBPcmdhbl9JZDogXCIxLTEtMVwiLFxuICBPcmdhbl9OYW1lOiBcIjEtMS0xT3JnYW5fTmFtZVwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMS0xLTFcIixcbiAgT3JnYW5fQ29kZTogXCIxLTFcIixcbiAgQ2hpbGRfQ291bnQ6IDAsXG4gIFBhcmVudF9JZDogXCIxLTFcIlxufV07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUcmVlVGFibGUgPSB7XG4gIF8kUHJvcF9UYWJsZUVsZW06IG51bGwsXG4gIF8kUHJvcF9SZW5kZXJlclRvRWxlbTogbnVsbCxcbiAgX1Byb3BfQ29uZmlnOiBudWxsLFxuICBfUHJvcF9Kc29uRGF0YTogbnVsbCxcbiAgX1Byb3BfQXV0b09wZW5MZXZlbDogMCxcbiAgX1Byb3BfRmlyc3RDb2x1bW5fSW5kZW46IDIwLFxuICBfUHJvcF9DdXJyZW50U2VsZWN0ZWRSb3dJZDogbnVsbCxcbiAgSW5pdGlhbGl6YXRpb246IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZyA9IF9jb25maWc7XG4gICAgdGhpcy5fJFByb3BfUmVuZGVyZXJUb0VsZW0gPSAkKFwiI1wiICsgdGhpcy5fUHJvcF9Db25maWcuUmVuZGVyZXJUbyk7XG4gICAgdGhpcy5fJFByb3BfVGFibGVFbGVtID0gdGhpcy5DcmVhdGVUYWJsZSgpO1xuXG4gICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmFwcGVuZCh0aGlzLkNyZWF0ZVRhYmxlVGl0bGVSb3coKSk7XG5cbiAgICB0aGlzLl8kUHJvcF9SZW5kZXJlclRvRWxlbS5hcHBlbmQodGhpcy5fJFByb3BfVGFibGVFbGVtKTtcbiAgfSxcbiAgTG9hZEpzb25EYXRhOiBmdW5jdGlvbiBMb2FkSnNvbkRhdGEoanNvbkRhdGFzKSB7XG4gICAgaWYgKGpzb25EYXRhcyAhPSBudWxsICYmIGpzb25EYXRhcyAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX1Byb3BfSnNvbkRhdGEgPSBqc29uRGF0YXM7XG4gICAgICB0aGlzLl9Qcm9wX0F1dG9PcGVuTGV2ZWwgPSB0aGlzLl9Qcm9wX0NvbmZpZy5PcGVuTGV2ZWw7XG5cbiAgICAgIHZhciByb3dJZCA9IHRoaXMuX0dldFJvd0RhdGFJZChqc29uRGF0YXMpO1xuXG4gICAgICB0aGlzLl9DcmVhdGVSb290Um93KGpzb25EYXRhcywgcm93SWQpO1xuXG4gICAgICB0aGlzLl9Mb29wQ3JlYXRlUm93KGpzb25EYXRhcywganNvbkRhdGFzLk5vZGVzLCAxLCByb3dJZCk7XG5cbiAgICAgIHRoaXMuUmVuZGVyZXJTdHlsZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbGVydChcIkpzb24gRGF0YSBPYmplY3QgRXJyb3JcIik7XG4gICAgfVxuICB9LFxuICBfQ3JlYXRlUm9vdFJvdzogZnVuY3Rpb24gX0NyZWF0ZVJvb3RSb3cocGFyZW50anNvbk5vZGUsIHBhcmVudElkTGlzdCkge1xuICAgIHZhciByb3dFbGVtID0gdGhpcy5DcmVhdGVSb3dFbGVtKHBhcmVudGpzb25Ob2RlLCAwLCBudWxsLCB0cnVlLCBwYXJlbnRJZExpc3QpO1xuXG4gICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmFwcGVuZChyb3dFbGVtKTtcblxuICAgIHRoaXMuU2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChwYXJlbnRqc29uTm9kZSwgMCk7XG4gICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KHBhcmVudGpzb25Ob2RlLCBwYXJlbnRJZExpc3QpO1xuICB9LFxuICBfTG9vcENyZWF0ZVJvdzogZnVuY3Rpb24gX0xvb3BDcmVhdGVSb3cocGFyZW50anNvbk5vZGUsIGpzb25Ob2RlQXJyYXksIGN1cnJlbnRMZXZlbCwgcGFyZW50SWRMaXN0KSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWcuSXNPcGVuQUxMO1xuXG4gICAgaWYgKGpzb25Ob2RlQXJyYXkgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGpzb25Ob2RlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBqc29uTm9kZUFycmF5W2ldO1xuXG4gICAgICAgIHZhciByb3dJc09wZW4gPSB0aGlzLl9UZXN0Um93SXNPcGVuKGN1cnJlbnRMZXZlbCk7XG5cbiAgICAgICAgdmFyIHJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKGl0ZW0pO1xuXG4gICAgICAgIHZhciBfcElkTGlzdCA9IHRoaXMuX0NyZWF0ZVBhcmVudElkTGlzdChwYXJlbnRJZExpc3QsIHJvd0lkKTtcblxuICAgICAgICB0aGlzLlNldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwoaXRlbSwgY3VycmVudExldmVsKTtcbiAgICAgICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KGl0ZW0sIF9wSWRMaXN0KTtcbiAgICAgICAgdmFyIHJvd0VsZW0gPSB0aGlzLkNyZWF0ZVJvd0VsZW0oaXRlbSwgY3VycmVudExldmVsLCBwYXJlbnRqc29uTm9kZSwgcm93SXNPcGVuLCBfcElkTGlzdCk7XG5cbiAgICAgICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmFwcGVuZChyb3dFbGVtKTtcblxuICAgICAgICBpZiAoaXRlbS5Ob2RlcyAhPSB1bmRlZmluZWQgJiYgaXRlbS5Ob2RlcyAhPSBudWxsICYmIGl0ZW0uTm9kZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHZhciBfdHAgPSBjdXJyZW50TGV2ZWwgKyAxO1xuXG4gICAgICAgICAgdGhpcy5fTG9vcENyZWF0ZVJvdyhpdGVtLCBpdGVtLk5vZGVzLCBfdHAsIF9wSWRMaXN0KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgQ3JlYXRlVGFibGU6IGZ1bmN0aW9uIENyZWF0ZVRhYmxlKCkge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnO1xuXG4gICAgdmFyIF9lZGl0VGFibGUgPSAkKFwiPHRhYmxlIC8+XCIpO1xuXG4gICAgX2VkaXRUYWJsZS5hZGRDbGFzcyhfQy5UYWJsZUNsYXNzKTtcblxuICAgIF9lZGl0VGFibGUuYXR0cihcIklkXCIsIF9DLlRhYmxlSWQpO1xuXG4gICAgX2VkaXRUYWJsZS5hdHRyKF9DLlRhYmxlQXR0cnMpO1xuXG4gICAgcmV0dXJuIF9lZGl0VGFibGU7XG4gIH0sXG4gIFNldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWw6IGZ1bmN0aW9uIFNldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwoanNvbkRhdGEsIHZhbHVlKSB7XG4gICAganNvbkRhdGEuX0V4dGVuZF9DdXJyZW50TGV2ZWwgPSB2YWx1ZTtcbiAgfSxcbiAgR2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbDogZnVuY3Rpb24gR2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChqc29uRGF0YSkge1xuICAgIHJldHVybiBqc29uRGF0YS5fRXh0ZW5kX0N1cnJlbnRMZXZlbDtcbiAgfSxcbiAgU2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdDogZnVuY3Rpb24gU2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdChqc29uRGF0YSwgdmFsdWUpIHtcbiAgICBqc29uRGF0YS5fRXh0ZW5kX1BhcmVudElkTGlzdCA9IHZhbHVlO1xuICB9LFxuICBHZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0OiBmdW5jdGlvbiBHZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KGpzb25EYXRhKSB7XG4gICAgcmV0dXJuIGpzb25EYXRhLl9FeHRlbmRfUGFyZW50SWRMaXN0O1xuICB9LFxuICBDcmVhdGVUYWJsZVRpdGxlUm93OiBmdW5jdGlvbiBDcmVhdGVUYWJsZVRpdGxlUm93KCkge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnO1xuXG4gICAgdmFyIF90aGVhZCA9ICQoXCI8dGhlYWQ+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgaXNIZWFkZXI9J3RydWUnIC8+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XCIpO1xuXG4gICAgdmFyIF90aXRsZVJvdyA9IF90aGVhZC5maW5kKFwidHJcIik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9DLlRlbXBsYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHRlbXBsYXRlID0gX0MuVGVtcGxhdGVzW2ldO1xuICAgICAgdmFyIHRpdGxlID0gdGVtcGxhdGUuVGl0bGU7XG4gICAgICB2YXIgdGggPSAkKFwiPHRoPlwiICsgdGl0bGUgKyBcIjwvdGg+XCIpO1xuXG4gICAgICBpZiAodGVtcGxhdGUuVGl0bGVDZWxsQ2xhc3NOYW1lKSB7XG4gICAgICAgIHRoLmFkZENsYXNzKHRlbXBsYXRlLlRpdGxlQ2VsbENsYXNzTmFtZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5UaXRsZUNlbGxBdHRycykge1xuICAgICAgICB0aC5hdHRyKHRlbXBsYXRlLlRpdGxlQ2VsbEF0dHJzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5IaWRkZW4gIT0gJ3VuZGVmaW5lZCcgJiYgdGVtcGxhdGUuSGlkZGVuID09IHRydWUpIHtcbiAgICAgICAgdGguaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGVtcGxhdGUuU3R5bGUpIHtcbiAgICAgICAgdGguY3NzKHRlbXBsYXRlLlN0eWxlKTtcbiAgICAgIH1cblxuICAgICAgX3RpdGxlUm93LmFwcGVuZCh0aCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIF90aGVhZDtcbiAgfSxcbiAgQ3JlYXRlUm93RWxlbTogZnVuY3Rpb24gQ3JlYXRlUm93RWxlbShyb3dEYXRhLCBjdXJyZW50TGV2ZWwsIHBhcmVudFJvd0RhdGEsIHJvd0lzT3BlbiwgcGFyZW50SWRMaXN0KSB7XG4gICAgdmFyIF9jID0gdGhpcy5fUHJvcF9Db25maWc7XG4gICAgdmFyICR0ciA9ICQoXCI8dHIgLz5cIik7XG5cbiAgICB2YXIgZWxlbUlkID0gdGhpcy5fQ3JlYXRlRWxlbUlkKHJvd0RhdGEpO1xuXG4gICAgdmFyIHJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKHJvd0RhdGEpO1xuXG4gICAgdmFyIHByb3dJZCA9IHRoaXMuX0NyZWF0ZVBhcmVudFJvd0lkKHBhcmVudFJvd0RhdGEpO1xuXG4gICAgJHRyLmF0dHIoXCJyb3dJZFwiLCByb3dJZCkuYXR0cihcInBpZFwiLCBwcm93SWQpLmF0dHIoXCJpZFwiLCBlbGVtSWQpLmF0dHIoXCJjdXJyZW50TGV2ZWxcIiwgY3VycmVudExldmVsKS5hdHRyKFwiaXNkYXRhcm93XCIsIFwidHJ1ZVwiKTtcbiAgICB2YXIgX3Rlc3RmaWVsZCA9IF9jLkNoaWxkVGVzdEZpZWxkO1xuICAgIHZhciBoYXNDaGlsZCA9IHJvd0RhdGFbX3Rlc3RmaWVsZF07XG5cbiAgICBpZiAoaGFzQ2hpbGQgPT0gdHJ1ZSB8fCBoYXNDaGlsZCA9PSBcInRydWVcIiB8fCBoYXNDaGlsZCA+IDApIHtcbiAgICAgICR0ci5hdHRyKFwiaGFzQ2hpbGRcIiwgXCJ0cnVlXCIpO1xuICAgIH1cblxuICAgICR0ci5hdHRyKFwicm93SXNPcGVuXCIsIHJvd0lzT3BlbikuYXR0cihcInBhcmVudElkTGlzdFwiLCBwYXJlbnRJZExpc3QpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfYy5UZW1wbGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBfY2MgPSBfYy5UZW1wbGF0ZXNbaV07XG4gICAgICB2YXIgX2NkID0gcm93RGF0YVtfY2MuRmllbGROYW1lXTtcbiAgICAgIHZhciBfd2lkdGggPSBfY2MuV2lkdGg7XG4gICAgICB2YXIgX3JlbmRlcmVyID0gX2NjLlJlbmRlcmVyO1xuICAgICAgdmFyICR0ZCA9ICQoXCI8dGQgYmluZEZpZWxkPVxcXCJcIiArIF9jYy5GaWVsZE5hbWUgKyBcIlxcXCIgUmVuZGVyZXI9J1wiICsgX3JlbmRlcmVyICsgXCInPlwiICsgX2NkICsgXCI8L3RkPlwiKS5jc3MoXCJ3aWR0aFwiLCBfd2lkdGgpO1xuXG4gICAgICBpZiAoX3JlbmRlcmVyID09IFwiRGF0ZVRpbWVcIikge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKF9jZCk7XG4gICAgICAgIHZhciBkYXRlU3RyID0gRGF0ZVV0aWxpdHkuRm9ybWF0KGRhdGUsICd5eXl5LU1NLWRkJyk7XG4gICAgICAgICR0ZC50ZXh0KGRhdGVTdHIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoX2NjLlRleHRBbGlnbikge1xuICAgICAgICAkdGQuY3NzKFwidGV4dEFsaWduXCIsIF9jYy5UZXh0QWxpZ24pO1xuICAgICAgfVxuXG4gICAgICBpZiAoaSA9PSAwKSB7fVxuXG4gICAgICBpZiAodHlwZW9mIF9jYy5IaWRkZW4gIT0gJ3VuZGVmaW5lZCcgJiYgX2NjLkhpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgICR0ZC5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgX2NjLlN0eWxlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICR0ZC5jc3MoX2NjLlN0eWxlKTtcbiAgICAgIH1cblxuICAgICAgJHRyLmFwcGVuZCgkdGQpO1xuICAgIH1cblxuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAkdHIuYmluZChcImNsaWNrXCIsIG51bGwsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgJChcIi50ci1zZWxlY3RlZFwiKS5yZW1vdmVDbGFzcyhcInRyLXNlbGVjdGVkXCIpO1xuICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcInRyLXNlbGVjdGVkXCIpO1xuICAgICAgX3NlbGYuX1Byb3BfQ3VycmVudFNlbGVjdGVkUm93SWQgPSAkKHRoaXMpLmF0dHIoXCJyb3dJZFwiKTtcblxuICAgICAgaWYgKHR5cGVvZiBfYy5DbGlja1Jvd0V2ZW50ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgX2MuQ2xpY2tSb3dFdmVudCA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIF9jLkNsaWNrUm93RXZlbnQocm93SWQpO1xuICAgICAgfVxuICAgIH0pO1xuICAgICR0ci5ob3ZlcihmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoISQodGhpcykuaGFzQ2xhc3MoXCJ0ci1zZWxlY3RlZFwiKSkge1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwidHItaG92ZXJcIik7XG4gICAgICB9XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgJChcIi50ci1ob3ZlclwiKS5yZW1vdmVDbGFzcyhcInRyLWhvdmVyXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiAkdHI7XG4gIH0sXG4gIF9UZXN0Um93SXNPcGVuOiBmdW5jdGlvbiBfVGVzdFJvd0lzT3BlbihjdXJyZW50TGV2ZWwpIHtcbiAgICBpZiAodGhpcy5fUHJvcF9Db25maWcuT3BlbkxldmVsID4gY3VycmVudExldmVsKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIF9DcmVhdGVFbGVtSWQ6IGZ1bmN0aW9uIF9DcmVhdGVFbGVtSWQocm93RGF0YSkge1xuICAgIHZhciByb3dJZFByZWZpeCA9IFwiXCI7XG5cbiAgICBpZiAodGhpcy5fUHJvcF9Db25maWcuUm93SWRQcmVmaXggIT0gdW5kZWZpbmVkICYmIHRoaXMuX1Byb3BfQ29uZmlnLlJvd0lkUHJlZml4ICE9IHVuZGVmaW5lZCAhPSBudWxsKSB7XG4gICAgICByb3dJZFByZWZpeCA9IHRoaXMuX1Byb3BfQ29uZmlnLlJvd0lkUHJlZml4O1xuICAgIH1cblxuICAgIHJldHVybiByb3dJZFByZWZpeCArIHRoaXMuX0dldFJvd0RhdGFJZChyb3dEYXRhKTtcbiAgfSxcbiAgX0NyZWF0ZVBhcmVudElkTGlzdDogZnVuY3Rpb24gX0NyZWF0ZVBhcmVudElkTGlzdChwYXJlbnRJZExpc3QsIHJvd0lkKSB7XG4gICAgcmV0dXJuIHBhcmVudElkTGlzdCArIFwi4oC7XCIgKyByb3dJZDtcbiAgfSxcbiAgX0NyZWF0ZVBhcmVudElkTGlzdEJ5UGFyZW50SnNvbkRhdGE6IGZ1bmN0aW9uIF9DcmVhdGVQYXJlbnRJZExpc3RCeVBhcmVudEpzb25EYXRhKHBhcmVudEpzb25EYXRhLCBzZWxmSnNvbkRhdGEpIHtcbiAgICB2YXIgcGFyZW50SWRMaXN0ID0gdGhpcy5HZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KHBhcmVudEpzb25EYXRhKTtcblxuICAgIHZhciByb3dJZCA9IHRoaXMuX0dldFJvd0RhdGFJZChzZWxmSnNvbkRhdGEpO1xuXG4gICAgcmV0dXJuIHRoaXMuX0NyZWF0ZVBhcmVudElkTGlzdChwYXJlbnRJZExpc3QsIHJvd0lkKTtcbiAgfSxcbiAgX0dldFJvd0RhdGFJZDogZnVuY3Rpb24gX0dldFJvd0RhdGFJZChyb3dEYXRhKSB7XG4gICAgdmFyIGlkRmllbGQgPSB0aGlzLl9Qcm9wX0NvbmZpZy5JZEZpZWxkO1xuXG4gICAgaWYgKHJvd0RhdGFbaWRGaWVsZF0gIT0gdW5kZWZpbmVkICYmIHJvd0RhdGFbaWRGaWVsZF0gIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHJvd0RhdGFbaWRGaWVsZF07XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsZXJ0KFwi5Zyo5pWw5o2u5rqQ5Lit5om+5LiN5Yiw55So5LqO5p6E5bu6SWTnmoTlrZfmrrXvvIzor7fmo4Dmn6XphY3nva7lj4rmlbDmja7mupBcIik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVQYXJlbnRSb3dJZDogZnVuY3Rpb24gX0NyZWF0ZVBhcmVudFJvd0lkKHBhcmVudFJvd0RhdGEpIHtcbiAgICBpZiAocGFyZW50Um93RGF0YSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gXCJSb290XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9HZXRSb3dEYXRhSWQocGFyZW50Um93RGF0YSk7XG4gICAgfVxuICB9LFxuICBSZW5kZXJlclN0eWxlOiBmdW5jdGlvbiBSZW5kZXJlclN0eWxlKCkge1xuICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAkKFwidHJbaXNkYXRhcm93PSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRyID0gJCh0aGlzKTtcbiAgICAgIHZhciAkZmlyc3R0ZCA9ICQodGhpcykuZmluZChcInRkOmZpcnN0XCIpO1xuICAgICAgdmFyIHJvd2lkID0gJHRyLmF0dHIoXCJyb3dJZFwiKTtcbiAgICAgIHZhciBzb3VyY2VUZXh0ID0gJGZpcnN0dGQudGV4dCgpO1xuICAgICAgJGZpcnN0dGQuY3NzKFwicGFkZGluZy1sZWZ0XCIsIF9zZWxmLl9Qcm9wX0ZpcnN0Q29sdW1uX0luZGVuICogcGFyc2VJbnQoJCh0aGlzKS5hdHRyKFwiY3VycmVudExldmVsXCIpKSk7XG4gICAgICB2YXIgaGFzQ2hpbGQgPSBmYWxzZTtcblxuICAgICAgaWYgKCR0ci5hdHRyKFwiaGFzQ2hpbGRcIikgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgaGFzQ2hpbGQgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgcm93SXNPcGVuID0gZmFsc2U7XG5cbiAgICAgIGlmICgkdHIuYXR0cihcInJvd0lzT3BlblwiKSA9PSBcInRydWVcIikge1xuICAgICAgICByb3dJc09wZW4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3dpdGNoRWxlbSA9IF9zZWxmLl9DcmVhdGVSb3dTd2l0Y2hFbGVtKGhhc0NoaWxkLCByb3dJc09wZW4sIHJvd2lkKTtcblxuICAgICAgJGZpcnN0dGQuaHRtbChcIlwiKTtcbiAgICAgICRmaXJzdHRkLmFwcGVuZChzd2l0Y2hFbGVtKS5hcHBlbmQoXCI8c3Bhbj5cIiArIHNvdXJjZVRleHQgKyBcIjwvc3Bhbj5cIik7XG5cbiAgICAgIGlmICghcm93SXNPcGVuKSB7XG4gICAgICAgICQoXCJ0cltwaWQ9J1wiICsgcm93aWQgKyBcIiddXCIpLmhpZGUoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgX0dldEluZGVuQ2xhc3M6IGZ1bmN0aW9uIF9HZXRJbmRlbkNsYXNzKGhhc0NoaWxkLCBpc09wZW4pIHtcbiAgICBpZiAoaGFzQ2hpbGQgJiYgaXNPcGVuKSB7XG4gICAgICByZXR1cm4gXCJpbWctc3dpdGNoLW9wZW5cIjtcbiAgICB9XG5cbiAgICBpZiAoaGFzQ2hpbGQgJiYgIWlzT3Blbikge1xuICAgICAgcmV0dXJuIFwiaW1nLXN3aXRjaC1jbG9zZVwiO1xuICAgIH1cblxuICAgIGlmICghaGFzQ2hpbGQpIHtcbiAgICAgIHJldHVybiBcImltZy1zd2l0Y2gtb3BlblwiO1xuICAgIH1cblxuICAgIHJldHVybiBcImltZy1zd2l0Y2gtY2xvc2VcIjtcbiAgfSxcbiAgX0NyZWF0ZVJvd1N3aXRjaEVsZW06IGZ1bmN0aW9uIF9DcmVhdGVSb3dTd2l0Y2hFbGVtKGhhc0NoaWxkLCBpc09wZW4sIHJvd0lkKSB7XG4gICAgdmFyIGVsZW0gPSAkKFwiPGRpdiBpc3N3aXRjaD1cXFwidHJ1ZVxcXCI+PC9kaXY+XCIpO1xuXG4gICAgdmFyIGNscyA9IHRoaXMuX0dldEluZGVuQ2xhc3MoaGFzQ2hpbGQsIGlzT3Blbik7XG5cbiAgICBlbGVtLmFkZENsYXNzKGNscyk7XG4gICAgdmFyIHNlbmRkYXRhID0ge1xuICAgICAgUm93SWQ6IHJvd0lkXG4gICAgfTtcbiAgICBlbGVtLmJpbmQoXCJjbGlja1wiLCBzZW5kZGF0YSwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICBpZiAoIWhhc0NoaWxkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdmFyICR0ciA9ICQodGhpcykucGFyZW50KCkucGFyZW50KCk7XG4gICAgICB2YXIgcm93aWQgPSAkdHIuYXR0cihcInJvd0lkXCIpO1xuICAgICAgdmFyIHJvd0lzT3BlbiA9IGZhbHNlO1xuXG4gICAgICBpZiAoJHRyLmF0dHIoXCJyb3dJc09wZW5cIikgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgcm93SXNPcGVuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgaWYgKHJvd0lzT3Blbikge1xuICAgICAgICByb3dJc09wZW4gPSBmYWxzZTtcbiAgICAgICAgJChcInRyW3BhcmVudElkTGlzdCo9J1wiICsgcm93aWQgKyBcIuKAuyddXCIpLmhpZGUoKTtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImltZy1zd2l0Y2gtb3BlblwiKS5hZGRDbGFzcyhcImltZy1zd2l0Y2gtY2xvc2VcIik7XG4gICAgICAgICQoXCJ0cltwYXJlbnRJZExpc3QqPSdcIiArIHJvd2lkICsgXCLigLsnXVtoYXNjaGlsZD0ndHJ1ZSddXCIpLmZpbmQoXCJbaXNzd2l0Y2g9J3RydWUnXVwiKS5yZW1vdmVDbGFzcyhcImltZy1zd2l0Y2gtb3BlblwiKS5hZGRDbGFzcyhcImltZy1zd2l0Y2gtY2xvc2VcIik7XG4gICAgICAgICQoXCJ0cltwYXJlbnRJZExpc3QqPSdcIiArIHJvd2lkICsgXCLigLsnXVtoYXNjaGlsZD0ndHJ1ZSddXCIpLmF0dHIoXCJyb3dpc29wZW5cIiwgZmFsc2UpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcm93SXNPcGVuID0gdHJ1ZTtcbiAgICAgICAgJChcInRyW3BpZD0nXCIgKyByb3dpZCArIFwiJ11cIikuc2hvdygpO1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiaW1nLXN3aXRjaC1jbG9zZVwiKS5hZGRDbGFzcyhcImltZy1zd2l0Y2gtb3BlblwiKTtcbiAgICAgIH1cblxuICAgICAgJHRyLmF0dHIoXCJyb3dJc09wZW5cIiwgcm93SXNPcGVuKTtcbiAgICB9KTtcbiAgICByZXR1cm4gZWxlbTtcbiAgfSxcbiAgR2V0Q2hpbGRzUm93RWxlbTogZnVuY3Rpb24gR2V0Q2hpbGRzUm93RWxlbShsb29wLCBpZCkge1xuICAgIGlmIChsb29wKSB7XG4gICAgICByZXR1cm4gJChcInRyW3BhcmVudElkTGlzdCo9J1wiICsgaWQgKyBcIiddXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gJChcInRyW3BpZD0nXCIgKyBpZCArIFwiJ11cIik7XG4gICAgfVxuICB9LFxuICBfUHJvcF9TZWxlY3RlZFJvd0RhdGE6IG51bGwsXG4gIF9Qcm9wX1RlbXBHZXRSb3dEYXRhOiBudWxsLFxuICBfR2V0U2VsZWN0ZWRSb3dEYXRhOiBmdW5jdGlvbiBfR2V0U2VsZWN0ZWRSb3dEYXRhKG5vZGUsIGlkLCBpc1NldFNlbGVjdGVkKSB7XG4gICAgdmFyIGZpZWxkTmFtZSA9IHRoaXMuX1Byb3BfQ29uZmlnLklkRmllbGQ7XG4gICAgdmFyIGZpZWxkVmFsdWUgPSBub2RlW2ZpZWxkTmFtZV07XG5cbiAgICBpZiAoZmllbGRWYWx1ZSA9PSBpZCkge1xuICAgICAgaWYgKGlzU2V0U2VsZWN0ZWQpIHtcbiAgICAgICAgdGhpcy5fUHJvcF9TZWxlY3RlZFJvd0RhdGEgPSBub2RlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fUHJvcF9UZW1wR2V0Um93RGF0YSA9IG5vZGU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChub2RlLk5vZGVzICE9IHVuZGVmaW5lZCAmJiBub2RlLk5vZGVzICE9IG51bGwpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLk5vZGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdGhpcy5fR2V0U2VsZWN0ZWRSb3dEYXRhKG5vZGUuTm9kZXNbaV0sIGlkLCBpc1NldFNlbGVjdGVkKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgR2V0U2VsZWN0ZWRSb3dEYXRhOiBmdW5jdGlvbiBHZXRTZWxlY3RlZFJvd0RhdGEoKSB7XG4gICAgaWYgKHRoaXMuX1Byb3BfQ3VycmVudFNlbGVjdGVkUm93SWQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdGhpcy5fR2V0U2VsZWN0ZWRSb3dEYXRhKHRoaXMuX1Byb3BfSnNvbkRhdGEsIHRoaXMuX1Byb3BfQ3VycmVudFNlbGVjdGVkUm93SWQsIHRydWUpO1xuXG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfU2VsZWN0ZWRSb3dEYXRhO1xuICB9LFxuICBHZXRSb3dEYXRhQnlSb3dJZDogZnVuY3Rpb24gR2V0Um93RGF0YUJ5Um93SWQocm93SWQpIHtcbiAgICB0aGlzLl9Qcm9wX1RlbXBHZXRSb3dEYXRhID0gbnVsbDtcblxuICAgIHRoaXMuX0dldFNlbGVjdGVkUm93RGF0YSh0aGlzLl9Qcm9wX0pzb25EYXRhLCByb3dJZCwgZmFsc2UpO1xuXG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfVGVtcEdldFJvd0RhdGE7XG4gIH0sXG4gIEFwcGVuZENoaWxkUm93VG9DdXJyZW50U2VsZWN0ZWRSb3c6IGZ1bmN0aW9uIEFwcGVuZENoaWxkUm93VG9DdXJyZW50U2VsZWN0ZWRSb3cocm93RGF0YSkge1xuICAgIHZhciBzZWxlY3RlZFJvd0RhdGEgPSB0aGlzLkdldFNlbGVjdGVkUm93RGF0YSgpO1xuXG4gICAgaWYgKHNlbGVjdGVkUm93RGF0YS5Ob2RlcyAhPSB1bmRlZmluZWQgJiYgc2VsZWN0ZWRSb3dEYXRhLk5vZGVzICE9IG51bGwpIHtcbiAgICAgIHNlbGVjdGVkUm93RGF0YS5Ob2Rlcy5wdXNoKHJvd0RhdGEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzZWxlY3RlZFJvd0RhdGEuTm9kZXMgPSBuZXcgQXJyYXkoKTtcbiAgICAgIHNlbGVjdGVkUm93RGF0YS5Ob2Rlcy5wdXNoKHJvd0RhdGEpO1xuICAgIH1cblxuICAgIHRoaXMuU2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChyb3dEYXRhLCB0aGlzLkdldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwoc2VsZWN0ZWRSb3dEYXRhKSArIDEpO1xuICAgIHRoaXMuU2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdChyb3dEYXRhLCB0aGlzLl9DcmVhdGVQYXJlbnRJZExpc3RCeVBhcmVudEpzb25EYXRhKHNlbGVjdGVkUm93RGF0YSwgcm93RGF0YSkpO1xuICAgIHZhciAkdHIgPSB0aGlzLkNyZWF0ZVJvd0VsZW0ocm93RGF0YSwgdGhpcy5HZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKHNlbGVjdGVkUm93RGF0YSkgKyAxLCBzZWxlY3RlZFJvd0RhdGEsIHRydWUsIHRoaXMuR2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdChyb3dEYXRhKSk7XG5cbiAgICB2YXIgc2VsZWN0ZWRSb3dJZCA9IHRoaXMuX0dldFJvd0RhdGFJZChzZWxlY3RlZFJvd0RhdGEpO1xuXG4gICAgdmFyIGN1cnJlbnRTZWxlY3RFbGVtID0gJChcInRyW3Jvd0lkPSdcIiArIHNlbGVjdGVkUm93SWQgKyBcIiddXCIpO1xuICAgIGN1cnJlbnRTZWxlY3RFbGVtLmF0dHIoXCJoYXNjaGlsZFwiLCBcInRydWVcIik7XG4gICAgdmFyIGxhc3RDaGlsZHMgPSAkKFwidHJbcGFyZW50aWRsaXN0Kj0nXCIgKyBzZWxlY3RlZFJvd0lkICsgXCLigLsnXTpsYXN0XCIpO1xuXG4gICAgaWYgKGxhc3RDaGlsZHMubGVuZ3RoID4gMCkge1xuICAgICAgbGFzdENoaWxkcy5hZnRlcigkdHIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjdXJyZW50U2VsZWN0RWxlbS5hdHRyKFwicm93aXNvcGVuXCIsIHRydWUpO1xuICAgICAgY3VycmVudFNlbGVjdEVsZW0uYWZ0ZXIoJHRyKTtcbiAgICB9XG5cbiAgICB0aGlzLlJlbmRlcmVyU3R5bGUoKTtcbiAgfSxcbiAgVXBkYXRlVG9Sb3c6IGZ1bmN0aW9uIFVwZGF0ZVRvUm93KHJvd0lkLCByb3dEYXRhKSB7XG4gICAgdmFyIHNlbGVjdGVkUm93RGF0YSA9IHRoaXMuR2V0Um93RGF0YUJ5Um93SWQocm93SWQpO1xuXG4gICAgZm9yICh2YXIgYXR0ck5hbWUgaW4gcm93RGF0YSkge1xuICAgICAgaWYgKGF0dHJOYW1lICE9IFwiTm9kZXNcIikge1xuICAgICAgICBzZWxlY3RlZFJvd0RhdGFbYXR0ck5hbWVdID0gcm93RGF0YVthdHRyTmFtZV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKHNlbGVjdGVkUm93RGF0YSk7XG5cbiAgICB2YXIgJHRyID0gJChcInRyW3Jvd2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICAkdHIuZmluZChcInRkXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGJpbmRGaWVsZCA9ICQodGhpcykuYXR0cihcImJpbmRGaWVsZFwiKTtcbiAgICAgIHZhciBuZXd0ZXh0ID0gc2VsZWN0ZWRSb3dEYXRhW2JpbmRGaWVsZF07XG4gICAgICB2YXIgcmVuZGVyZXIgPSAkKHRoaXMpLmF0dHIoXCJSZW5kZXJlclwiKTtcblxuICAgICAgaWYgKHJlbmRlcmVyID09IFwiRGF0ZVRpbWVcIikge1xuICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKG5ld3RleHQpO1xuICAgICAgICBuZXd0ZXh0ID0gRGF0ZVV0aWxpdHkuRm9ybWF0KGRhdGUsICd5eXl5LU1NLWRkJyk7XG4gICAgICB9XG5cbiAgICAgIGlmICgkKHRoaXMpLmZpbmQoXCJbaXNzd2l0Y2g9J3RydWUnXVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQodGhpcykuZmluZChcInNwYW5cIikudGV4dChuZXd0ZXh0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQodGhpcykudGV4dChuZXd0ZXh0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSxcbiAgTG9hZENoaWxkQnlBamF4OiBmdW5jdGlvbiBMb2FkQ2hpbGRCeUFqYXgoKSB7fSxcbiAgRGVsZXRlUm93OiBmdW5jdGlvbiBEZWxldGVSb3cocm93SWQpIHtcbiAgICB2YXIgaGFzQ2hpbGQgPSBmYWxzZTtcblxuICAgIGlmICgkKFwidHJbcGlkPSdcIiArIHJvd0lkICsgXCInXVwiKS5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAoIXRoaXMuX1Byb3BfQ29uZmlnLkNhbkRlbGV0ZVdoZW5IYXNDaGlsZCkge1xuICAgICAgICBhbGVydChcIuaMh+WumueahOiKgueCueWtmOWcqOWtkOiKgueCue+8jOivt+WFiOWIoOmZpOWtkOiKgueCue+8gVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkKFwidHJbcGFyZW50aWRsaXN0Kj0n4oC7XCIgKyByb3dJZCArIFwiJ11cIikucmVtb3ZlKCk7XG4gICAgdGhpcy5fUHJvcF9DdXJyZW50U2VsZWN0ZWRSb3dJZCA9IG51bGw7XG4gIH0sXG4gIE1vdmVVcFJvdzogZnVuY3Rpb24gTW92ZVVwUm93KHJvd0lkKSB7XG4gICAgdmFyIHRoaXN0ciA9ICQoXCJ0cltyb3dpZD0nXCIgKyByb3dJZCArIFwiJ11cIik7XG4gICAgdmFyIHBpZCA9IHRoaXN0ci5hdHRyKFwicGlkXCIpO1xuICAgIHZhciBuZWFydHIgPSAkKHRoaXN0ci5wcmV2QWxsKFwiW3BpZD0nXCIgKyBwaWQgKyBcIiddXCIpWzBdKTtcbiAgICB2YXIgbW92ZXRycyA9ICQoXCJ0cltwYXJlbnRpZGxpc3QqPSfigLtcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICBtb3ZldHJzLmluc2VydEJlZm9yZShuZWFydHIpO1xuICB9LFxuICBNb3ZlRG93blJvdzogZnVuY3Rpb24gTW92ZURvd25Sb3cocm93SWQpIHtcbiAgICB2YXIgdGhpc3RyID0gJChcInRyW3Jvd2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICB2YXIgcGlkID0gdGhpc3RyLmF0dHIoXCJwaWRcIik7XG4gICAgdmFyIG5lYXJ0ciA9ICQodGhpc3RyLm5leHRBbGwoXCJbcGlkPSdcIiArIHBpZCArIFwiJ11cIilbMF0pO1xuICAgIHZhciBuZWFydHJyaWQgPSBuZWFydHIuYXR0cihcInJvd2lkXCIpO1xuICAgIHZhciBvZmZ0cnMgPSAkKFwidHJbcGFyZW50aWRsaXN0Kj0n4oC7XCIgKyBuZWFydHJyaWQgKyBcIiddXCIpO1xuICAgIHZhciBvZmZsYXN0dHIgPSAkKG9mZnRyc1tvZmZ0cnMubGVuZ3RoIC0gMV0pO1xuICAgIHZhciBtb3ZldHJzID0gJChcInRyW3BhcmVudGlkbGlzdCo9J+KAu1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgIG1vdmV0cnMuaW5zZXJ0QWZ0ZXIob2ZmbGFzdHRyKTtcbiAgfSxcbiAgR2V0QnJvdGhlcnNOb2RlRGF0YXNCeVBhcmVudElkOiBmdW5jdGlvbiBHZXRCcm90aGVyc05vZGVEYXRhc0J5UGFyZW50SWQocm93SWQpIHtcbiAgICB2YXIgdGhpc3RyID0gJChcInRyW3Jvd2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICB2YXIgcGlkID0gdGhpc3RyLmF0dHIoXCJwaWRcIik7XG4gICAgdmFyIGJyb3RoZXJzdHIgPSAkKHRoaXN0ci5wYXJlbnQoKS5maW5kKFwiW3BpZD0nXCIgKyBwaWQgKyBcIiddXCIpKTtcbiAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGJyb3RoZXJzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc3VsdC5wdXNoKHRoaXMuR2V0Um93RGF0YUJ5Um93SWQoJChicm90aGVyc3RyW2ldKS5hdHRyKFwicm93aWRcIikpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBSZW1vdmVBbGxSb3c6IGZ1bmN0aW9uIFJlbW92ZUFsbFJvdygpIHtcbiAgICBpZiAodGhpcy5fJFByb3BfVGFibGVFbGVtICE9IG51bGwpIHtcbiAgICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5maW5kKFwidHI6bm90KDpmaXJzdClcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07Il19
