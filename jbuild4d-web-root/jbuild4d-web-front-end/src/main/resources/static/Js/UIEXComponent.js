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

    if (!val) {
      val = "";
    }

    if (!text) {
      text = "";
    }

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkpzL0NvbmZpZy5qcyIsIkpzL0VkaXRUYWJsZS5qcyIsIkpzL1JlbmRlcmVycy9FZGl0VGFibGVfQ2hlY2tCb3guanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX0Zvcm1hdHRlci5qcyIsIkpzL1JlbmRlcmVycy9FZGl0VGFibGVfTGFiZWwuanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX1JhZGlvLmpzIiwiSnMvUmVuZGVyZXJzL0VkaXRUYWJsZV9TZWxlY3QuanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX1NlbGVjdFJvd0NoZWNrQm94LmpzIiwiSnMvUmVuZGVyZXJzL0VkaXRUYWJsZV9UZXh0Qm94LmpzIiwiSnMvUmVuZGVyZXJzL0RhdGFTZXQvQ29sdW1uX1NlbGVjdERlZmF1bHRWYWx1ZS5qcyIsIkpzL1JlbmRlcmVycy9EYXRhU2V0L0NvbHVtbl9TZWxlY3RGaWVsZFR5cGUuanMiLCJKcy9SZW5kZXJlcnMvVGFibGVEZXNpZ24vRWRpdFRhYmxlX0ZpZWxkTmFtZS5qcyIsIkpzL1JlbmRlcmVycy9UYWJsZURlc2lnbi9FZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlLmpzIiwiSnMvUmVuZGVyZXJzL1RhYmxlRGVzaWduL0VkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGUuanMiLCJkZW1vL1RyZWVUYWJsZUNvbmZpZy5qcyIsIkpzL1RyZWVUYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6cUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlVJRVhDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaWYgKCFPYmplY3QuY3JlYXRlKSB7XG4gIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRigpIHt9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPYmplY3QuY3JlYXRlIGltcGxlbWVudGF0aW9uIG9ubHkgYWNjZXB0cyBvbmUgcGFyYW1ldGVyLicpO1xuICAgICAgfVxuXG4gICAgICBGLnByb3RvdHlwZSA9IG87XG4gICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICB9O1xuICB9KCk7XG59XG5cbnZhciBFZGl0VGFibGVDb25maWcgPSB7XG4gIFN0YXR1czogXCJFZGl0XCIsXG4gIFRlbXBsYXRlczogW3tcbiAgICBUaXRsZTogXCLooajlkI0xXCIsXG4gICAgRmllbGROYW1lOiBcIlRhYmxlRmllbGRcIixcbiAgICBSZW5kZXJlcjogXCJFZGl0VGFibGVfVGV4dEJveFwiLFxuICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fVxuICB9LCB7XG4gICAgVGl0bGU6IFwi5a2X5q6157G75Z6LXCIsXG4gICAgRmllbGROYW1lOiBcIlRhYmxlRmllbGRcIixcbiAgICBSZW5kZXJlcjogXCJFZGl0VGFibGVfVGV4dEJveFwiLFxuICAgIEhpZGRlbjogZmFsc2VcbiAgfSwge1xuICAgIFRpdGxlOiBcIuWkh+azqFwiLFxuICAgIEZpZWxkTmFtZTogXCJUYWJsZUZpZWxkXCIsXG4gICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX1RleHRCb3hcIixcbiAgICBIaWRkZW46IGZhbHNlXG4gIH1dLFxuICBSb3dJZENyZWF0ZXI6IGZ1bmN0aW9uIFJvd0lkQ3JlYXRlcigpIHt9LFxuICBUYWJsZUNsYXNzOiBcIkVkaXRUYWJsZVwiLFxuICBSZW5kZXJlclRvOiBcImRpdlRyZWVUYWJsZVwiLFxuICBUYWJsZUlkOiBcIkVkaXRUYWJsZVwiLFxuICBUYWJsZUF0dHJzOiB7XG4gICAgY2VsbHBhZGRpbmc6IFwiMVwiLFxuICAgIGNlbGxzcGFjaW5nOiBcIjFcIixcbiAgICBib3JkZXI6IFwiMVwiXG4gIH1cbn07XG52YXIgRWRpdFRhYmxlRGF0YSA9IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlID0ge1xuICBfJFByb3BfVGFibGVFbGVtOiBudWxsLFxuICBfJFByb3BfUmVuZGVyZXJUb0VsZW06IG51bGwsXG4gIF9Qcm9wX0NvbmZpZ01hbmFnZXI6IG51bGwsXG4gIF9Qcm9wX0pzb25EYXRhOiBuZXcgT2JqZWN0KCksXG4gIF8kUHJvcF9FZGl0aW5nUm93RWxlbTogbnVsbCxcbiAgX1N0YXR1czogXCJFZGl0XCIsXG4gIEluaXRpYWxpemF0aW9uOiBmdW5jdGlvbiBJbml0aWFsaXphdGlvbihfY29uZmlnKSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyID0gT2JqZWN0LmNyZWF0ZShFZGl0VGFibGVDb25maWdNYW5hZ2VyKTtcblxuICAgIHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5Jbml0aWFsaXphdGlvbkNvbmZpZyhfY29uZmlnKTtcblxuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgIHRoaXMuXyRQcm9wX1JlbmRlcmVyVG9FbGVtID0gJChcIiNcIiArIF9DLlJlbmRlcmVyVG8pO1xuICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbSA9IHRoaXMuQ3JlYXRlVGFibGUoKTtcblxuICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5hcHBlbmQodGhpcy5DcmVhdGVUYWJsZVRpdGxlUm93KCkpO1xuXG4gICAgdGhpcy5fJFByb3BfUmVuZGVyZXJUb0VsZW0uYXBwZW5kKHRoaXMuXyRQcm9wX1RhYmxlRWxlbSk7XG5cbiAgICBpZiAoX0MuU3RhdHVzKSB7XG4gICAgICB0aGlzLl9TdGF0dXMgPSBfQy5TdGF0dXM7XG4gICAgfVxuICB9LFxuICBMb2FkSnNvbkRhdGE6IGZ1bmN0aW9uIExvYWRKc29uRGF0YShqc29uRGF0YSkge1xuICAgIGlmIChqc29uRGF0YSAhPSBudWxsICYmIGpzb25EYXRhICE9IHVuZGVmaW5lZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IGpzb25EYXRhW2ldO1xuICAgICAgICB2YXIgcm93SWQgPSB0aGlzLkFkZEVkaXRpbmdSb3dCeVRlbXBsYXRlKGpzb25EYXRhLCBpdGVtKTtcbiAgICAgICAgdGhpcy5fUHJvcF9Kc29uRGF0YVtyb3dJZF0gPSBpdGVtO1xuICAgICAgfVxuXG4gICAgICB0aGlzLkNvbXBsZXRlZEVkaXRpbmdSb3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoXCJKc29uIERhdGEgT2JqZWN0IEVycm9yXCIpO1xuICAgIH1cbiAgfSxcbiAgQ3JlYXRlVGFibGU6IGZ1bmN0aW9uIENyZWF0ZVRhYmxlKCkge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgIHZhciBfZWRpdFRhYmxlID0gJChcIjx0YWJsZSAvPlwiKTtcblxuICAgIF9lZGl0VGFibGUuYWRkQ2xhc3MoX0MuVGFibGVDbGFzcyk7XG5cbiAgICBfZWRpdFRhYmxlLmF0dHIoXCJJZFwiLCBfQy5UYWJsZUlkKTtcblxuICAgIF9lZGl0VGFibGUuYXR0cihfQy5UYWJsZUF0dHJzKTtcblxuICAgIHJldHVybiBfZWRpdFRhYmxlO1xuICB9LFxuICBDcmVhdGVUYWJsZVRpdGxlUm93OiBmdW5jdGlvbiBDcmVhdGVUYWJsZVRpdGxlUm93KCkge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgIHZhciBfdGl0bGVSb3cgPSAkKFwiPHRyIGlzSGVhZGVyPSd0cnVlJyAvPlwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX0MuVGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfQy5UZW1wbGF0ZXNbaV07XG4gICAgICB2YXIgdGl0bGUgPSB0ZW1wbGF0ZS5UaXRsZTtcbiAgICAgIHZhciB0aCA9ICQoXCI8dGg+XCIgKyB0aXRsZSArIFwiPC90aD5cIik7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5UaXRsZUNlbGxDbGFzc05hbWUpIHtcbiAgICAgICAgdGguYWRkQ2xhc3ModGVtcGxhdGUuVGl0bGVDZWxsQ2xhc3NOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRlbXBsYXRlLlRpdGxlQ2VsbEF0dHJzKSB7XG4gICAgICAgIHRoLmF0dHIodGVtcGxhdGUuVGl0bGVDZWxsQXR0cnMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiB0ZW1wbGF0ZS5IaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICB0aC5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIF90aXRsZVJvdy5hcHBlbmQodGgpO1xuICAgIH1cblxuICAgIHZhciBfdGl0bGVSb3dIZWFkID0gJChcIjx0aGVhZD48L3RoZWFkPlwiKTtcblxuICAgIF90aXRsZVJvd0hlYWQuYXBwZW5kKF90aXRsZVJvdyk7XG5cbiAgICByZXR1cm4gX3RpdGxlUm93SGVhZDtcbiAgfSxcbiAgQWRkRW1wdHlFZGl0aW5nUm93QnlUZW1wbGF0ZTogZnVuY3Rpb24gQWRkRW1wdHlFZGl0aW5nUm93QnlUZW1wbGF0ZShjYWxsYmFja2Z1bikge1xuICAgIHZhciByb3dJZCA9IHRoaXMuQWRkRWRpdGluZ1Jvd0J5VGVtcGxhdGUobnVsbCk7XG4gICAgdGhpcy5fUHJvcF9Kc29uRGF0YVtyb3dJZF0gPSBudWxsO1xuICB9LFxuICBBZGRFZGl0aW5nUm93QnlUZW1wbGF0ZTogZnVuY3Rpb24gQWRkRWRpdGluZ1Jvd0J5VGVtcGxhdGUoanNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIGlmICh0aGlzLkNvbXBsZXRlZEVkaXRpbmdSb3coKSkge1xuICAgICAgdmFyIHJvd0lkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICB2YXIgJHJvd0VsZW0gPSAkKFwiPHRyIC8+XCIpO1xuICAgICAgJHJvd0VsZW0uYXR0cihcImlkXCIsIHJvd0lkKTtcbiAgICAgIHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtID0gJHJvd0VsZW07XG5cbiAgICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQgJiYganNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZS5lZGl0RWFibGUgPT0gZmFsc2UpIHt9IGVsc2Uge1xuICAgICAgICB2YXIgZXZlbnRfZGF0YSA9IHtcbiAgICAgICAgICBob3N0OiB0aGlzXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMuX1N0YXR1cyAhPSBcIlZpZXdcIikge1xuICAgICAgICAgICRyb3dFbGVtLmJpbmQoXCJjbGlja1wiLCBldmVudF9kYXRhLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciByb3dTdGF0dXMgPSAkcm93RWxlbS5hdHRyKFwic3RhdHVzXCIpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvd1N0YXR1cyAhPSAndW5kZWZpbmVkJyAmJiByb3dTdGF0dXMgPT0gXCJkaXNhYmxlZFwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9ob3N0ID0gZXZlbnQuZGF0YS5ob3N0O1xuXG4gICAgICAgICAgICBpZiAoX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtICE9IG51bGwgJiYgJCh0aGlzKS5hdHRyKFwiaWRcIikgPT0gX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtLmF0dHIoXCJpZFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfQyA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0Q29uZmlnKCk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgX0MuUm93Q2xpY2sgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIF9DLlJvd0NsaWNrID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gX0MuUm93Q2xpY2soKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJfQy5Sb3dDbGljaygpIEVycm9yXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfaG9zdC5Db21wbGV0ZWRFZGl0aW5nUm93KCkpIHtcbiAgICAgICAgICAgICAgX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICBfaG9zdC5TZXRSb3dJc0VkaXRTdGF0dXMoX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtKTtcblxuICAgICAgICAgICAgICB2YXIgX3JvdyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgX3Jvdy5maW5kKFwidGRcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0ZCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gJHRkLmF0dHIoXCJyZW5kZXJlclwiKTtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVJZCA9ICR0ZC5hdHRyKFwidGVtcGxhdGVJZFwiKTtcblxuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0VGVtcGxhdGUodGVtcGxhdGVJZCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXJPYmogPSBldmFsKFwiT2JqZWN0LmNyZWF0ZShcIiArIHJlbmRlcmVyICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIHZhciAkaHRtbGVsZW0gPSByZW5kZXJlck9iai5HZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfQywgdGVtcGxhdGUsICR0ZCwgX3JvdywgdGhpcy5fJFByb3BfVGFibGVFbGVtLCAkdGQuY2hpbGRyZW4oKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiB0ZW1wbGF0ZS5IaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgJHRkLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLlN0eWxlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAkdGQuY3NzKHRlbXBsYXRlLlN0eWxlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkdGQuaHRtbChcIlwiKTtcbiAgICAgICAgICAgICAgICAkdGQuYXBwZW5kKCRodG1sZWxlbSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfQy5UZW1wbGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gX0MuVGVtcGxhdGVzW2ldO1xuICAgICAgICB2YXIgcmVuZGVyZXIgPSBudWxsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVuZGVyZXIgPSB0ZW1wbGF0ZS5SZW5kZXJlcjtcbiAgICAgICAgICB2YXIgcmVuZGVyZXJPYmogPSBldmFsKFwiT2JqZWN0LmNyZWF0ZShcIiArIHJlbmRlcmVyICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgYWxlcnQoXCLlrp7kvovljJZcIiArIHJlbmRlcmVyICsgXCLlpLHotKUhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICR0ZEVsZW0gPSBudWxsO1xuICAgICAgICAkdGRFbGVtID0gJChcIjx0ZCAvPlwiKTtcbiAgICAgICAgJHRkRWxlbS5hdHRyKFwicmVuZGVyZXJcIiwgcmVuZGVyZXIpO1xuICAgICAgICAkdGRFbGVtLmF0dHIoXCJ0ZW1wbGF0ZUlkXCIsIHRlbXBsYXRlLlRlbXBsYXRlSWQpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuSGlkZGVuICE9ICd1bmRlZmluZWQnICYmIHRlbXBsYXRlLkhpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgICAgJHRkRWxlbS5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLldpZHRoICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgJHRkRWxlbS5jc3MoXCJ3aWR0aFwiLCB0ZW1wbGF0ZS5XaWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkFsaWduICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgJHRkRWxlbS5hdHRyKFwiYWxpZ25cIiwgdGVtcGxhdGUuQWxpZ24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRlbGVtID0gcmVuZGVyZXJPYmouR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX0MsIHRlbXBsYXRlLCAkdGRFbGVtLCAkcm93RWxlbSwgdGhpcy5fJFByb3BfVGFibGVFbGVtLCBudWxsLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLlN0eWxlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgJHRkRWxlbS5jc3ModGVtcGxhdGUuU3R5bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRkRWxlbS5hcHBlbmQoJGVsZW0pO1xuICAgICAgICAkcm93RWxlbS5hcHBlbmQoJHRkRWxlbSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5hcHBlbmQoJHJvd0VsZW0pO1xuXG4gICAgICBpZiAodHlwZW9mIF9DLkFkZEFmdGVyUm93RXZlbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBfQy5BZGRBZnRlclJvd0V2ZW50ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgX0MuQWRkQWZ0ZXJSb3dFdmVudCgkcm93RWxlbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByb3dJZDtcbiAgICB9XG4gIH0sXG4gIFNldFRvVmlld1N0YXR1czogZnVuY3Rpb24gU2V0VG9WaWV3U3RhdHVzKCkge1xuICAgIHRoaXMuX1N0YXR1cyA9IFwiVmlld1wiO1xuICB9LFxuICBTZXRSb3dJc0VkaXRTdGF0dXM6IGZ1bmN0aW9uIFNldFJvd0lzRWRpdFN0YXR1cyh0cikge1xuICAgICQodHIpLmF0dHIoXCJFZGl0U3RhdHVzXCIsIFwiRWRpdFN0YXR1c1wiKTtcbiAgfSxcbiAgU2V0Um93SXNDb21wbGV0ZWRTdGF0dXM6IGZ1bmN0aW9uIFNldFJvd0lzQ29tcGxldGVkU3RhdHVzKHRyKSB7XG4gICAgJCh0cikuYXR0cihcIkVkaXRTdGF0dXNcIiwgXCJDb21wbGV0ZWRTdGF0dXNcIik7XG4gIH0sXG4gIFJvd0lzRWRpdFN0YXR1czogZnVuY3Rpb24gUm93SXNFZGl0U3RhdHVzKHRyKSB7XG4gICAgcmV0dXJuICQodHIpLmF0dHIoXCJFZGl0U3RhdHVzXCIpID09IFwiRWRpdFN0YXR1c1wiO1xuICB9LFxuICBSb3dJc0NvbXBsZXRlZFN0YXR1czogZnVuY3Rpb24gUm93SXNDb21wbGV0ZWRTdGF0dXModHIpIHtcbiAgICByZXR1cm4gJCh0cikuYXR0cihcIkVkaXRTdGF0dXNcIikgPT0gXCJDb21wbGV0ZWRTdGF0dXNcIjtcbiAgfSxcbiAgQ29tcGxldGVkRWRpdGluZ1JvdzogZnVuY3Rpb24gQ29tcGxldGVkRWRpdGluZ1JvdygpIHtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSAhPSBudWxsKSB7XG4gICAgICBpZiAoIXRoaXMuUm93SXNDb21wbGV0ZWRTdGF0dXModGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0pKSB7XG4gICAgICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgICAgICB2YXIgX2hvc3QgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLlZhbGlkYXRlQ29tcGxldGVkRWRpdGluZ1Jvd0VuYWJsZSh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSkpIHtcbiAgICAgICAgICB2YXIgX3JvdyA9IHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtO1xuICAgICAgICAgIHRoaXMuU2V0Um93SXNDb21wbGV0ZWRTdGF0dXMoX3Jvdyk7XG5cbiAgICAgICAgICBfcm93LmZpbmQoXCJ0ZFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkdGQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gJHRkLmF0dHIoXCJyZW5kZXJlclwiKTtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUlkID0gJHRkLmF0dHIoXCJ0ZW1wbGF0ZUlkXCIpO1xuXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSBfaG9zdC5fUHJvcF9Db25maWdNYW5hZ2VyLkdldFRlbXBsYXRlKHRlbXBsYXRlSWQpO1xuXG4gICAgICAgICAgICB2YXIgcmVuZGVyZXJPYmogPSBldmFsKFwiT2JqZWN0LmNyZWF0ZShcIiArIHJlbmRlcmVyICsgXCIpXCIpO1xuICAgICAgICAgICAgdmFyICRodG1sZWxlbSA9IHJlbmRlcmVyT2JqLkdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX0MsIHRlbXBsYXRlLCAkdGQsIF9yb3csIHRoaXMuXyRQcm9wX1RhYmxlRWxlbSwgJHRkLmNoaWxkcmVuKCkpO1xuICAgICAgICAgICAgJHRkLmh0bWwoXCJcIik7XG4gICAgICAgICAgICAkdGQuYXBwZW5kKCRodG1sZWxlbSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBWYWxpZGF0ZUNvbXBsZXRlZEVkaXRpbmdSb3dFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlQ29tcGxldGVkRWRpdGluZ1Jvd0VuYWJsZShlZGl0Um93KSB7XG4gICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyLkdldENvbmZpZygpO1xuXG4gICAgdmFyIF9ob3N0ID0gdGhpcztcblxuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIHZhciB2YWxpZGF0ZU1zZyA9IFwiXCI7XG4gICAgdmFyIHRkcyA9ICQoZWRpdFJvdykuZmluZChcInRkXCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkdGQgPSAkKHRkc1tpXSk7XG4gICAgICB2YXIgcmVuZGVyZXIgPSAkdGQuYXR0cihcInJlbmRlcmVyXCIpO1xuICAgICAgdmFyIHRlbXBsYXRlSWQgPSAkdGQuYXR0cihcInRlbXBsYXRlSWRcIik7XG5cbiAgICAgIHZhciB0ZW1wbGF0ZSA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0VGVtcGxhdGUodGVtcGxhdGVJZCk7XG5cbiAgICAgIHZhciByZW5kZXJlck9iaiA9IGV2YWwoXCJPYmplY3QuY3JlYXRlKFwiICsgcmVuZGVyZXIgKyBcIilcIik7XG4gICAgICB2YXIgdmFscmVzdWx0ID0gcmVuZGVyZXJPYmouVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfQywgdGVtcGxhdGUsICR0ZCwgZWRpdFJvdywgdGhpcy5fJFByb3BfVGFibGVFbGVtLCAkdGQuY2hpbGRyZW4oKSk7XG5cbiAgICAgIGlmICh2YWxyZXN1bHQuU3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgdmFsaWRhdGVNc2cgPSB2YWxyZXN1bHQuTXNnO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXJlc3VsdCAmJiB2YWxpZGF0ZU1zZyAhPSBudWxsKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgdmFsaWRhdGVNc2csIG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFJlbW92ZVJvdzogZnVuY3Rpb24gUmVtb3ZlUm93KCkge1xuICAgIGlmICh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbS5yZW1vdmUoKTtcblxuICAgICAgdGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0gPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgR2V0VGFibGVPYmplY3Q6IGZ1bmN0aW9uIEdldFRhYmxlT2JqZWN0KCkge1xuICAgIHJldHVybiB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG4gIH0sXG4gIEdldFJvd3M6IGZ1bmN0aW9uIEdldFJvd3MoKSB7XG4gICAgaWYgKHRoaXMuXyRQcm9wX1RhYmxlRWxlbSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5fJFByb3BfVGFibGVFbGVtLmZpbmQoXCJ0cjpub3QoOmZpcnN0KVwiKTtcbiAgICB9XG4gIH0sXG4gIEdldEVkaXRSb3c6IGZ1bmN0aW9uIEdldEVkaXRSb3coKSB7XG4gICAgaWYgKHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LFxuICBHZXRMYXN0Um93OiBmdW5jdGlvbiBHZXRMYXN0Um93KCkge1xuICAgIHZhciByb3cgPSB0aGlzLkdldEVkaXRSb3coKTtcbiAgICBpZiAocm93ID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIHZhciByb3dzID0gdGhpcy5HZXRSb3dzKCk7XG4gICAgdmFyIGluZGV4ID0gcm93cy5pbmRleChyb3cpO1xuXG4gICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgcmV0dXJuICQocm93c1tpbmRleCAtIDFdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgR2V0TmV4dFJvdzogZnVuY3Rpb24gR2V0TmV4dFJvdygpIHtcbiAgICB2YXIgcm93ID0gdGhpcy5HZXRFZGl0Um93KCk7XG4gICAgaWYgKHJvdyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICB2YXIgcm93cyA9IHRoaXMuR2V0Um93cygpO1xuICAgIHZhciBpbmRleCA9IHJvd3MuaW5kZXgocm93KTtcblxuICAgIGlmIChpbmRleCA8IHJvd3MubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuICQocm93c1tpbmRleCArIDFdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgTW92ZVVwOiBmdW5jdGlvbiBNb3ZlVXAoKSB7XG4gICAgdmFyIHJvdyA9IHRoaXMuR2V0TGFzdFJvdygpO1xuXG4gICAgaWYgKHJvdyAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIHJvdy5hdHRyKFwic3RhdHVzXCIpICE9IFwidW5kZWZpbmVkXCIgJiYgcm93LmF0dHIoXCJzdGF0dXNcIikgPT0gXCJkaXNhYmxlZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICB2YXIgbWUgPSB0aGlzLkdldEVkaXRSb3coKTtcbiAgICAgIHZhciB0ZW1wID0gbWUuYXR0cihcImNsYXNzXCIpO1xuICAgICAgbWUuYXR0cihcImNsYXNzXCIsIHJvdy5hdHRyKFwiY2xhc3NcIikpO1xuICAgICAgcm93LmF0dHIoXCJjbGFzc1wiLCB0ZW1wKTtcblxuICAgICAgaWYgKG1lICE9IG51bGwpIHtcbiAgICAgICAgcm93LmJlZm9yZShtZVswXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBNb3ZlRG93bjogZnVuY3Rpb24gTW92ZURvd24oKSB7XG4gICAgdmFyIHJvdyA9IHRoaXMuR2V0TmV4dFJvdygpO1xuXG4gICAgaWYgKHJvdyAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIHJvdy5hdHRyKFwic3RhdGVcIikgIT0gXCJ1bmRlZmluZWRcIiAmJiByb3cuYXR0cihcInN0YXRlXCIpID09IFwiZGlzYWJsZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgdmFyIG1lID0gdGhpcy5HZXRFZGl0Um93KCk7XG4gICAgICB2YXIgdGVtcCA9IG1lLmF0dHIoXCJjbGFzc1wiKTtcbiAgICAgIG1lLmF0dHIoXCJjbGFzc1wiLCByb3cuYXR0cihcImNsYXNzXCIpKTtcbiAgICAgIHJvdy5hdHRyKFwiY2xhc3NcIiwgdGVtcCk7XG5cbiAgICAgIGlmIChtZSAhPSBudWxsKSB7XG4gICAgICAgIHJvdy5hZnRlcihtZVswXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBSZW1vdmVBbGxSb3c6IGZ1bmN0aW9uIFJlbW92ZUFsbFJvdygpIHtcbiAgICBpZiAodGhpcy5fJFByb3BfVGFibGVFbGVtICE9IG51bGwpIHtcbiAgICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5maW5kKFwidHI6bm90KDpmaXJzdClcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIFVwZGF0ZVRvUm93OiBmdW5jdGlvbiBVcGRhdGVUb1Jvdyhyb3dJZCwgcm93RGF0YSkge1xuICAgIHZhciB0YWJsZUVsZW1lbnQgPSB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG5cbiAgICB2YXIgX2hvc3QgPSB0aGlzO1xuXG4gICAgdGFibGVFbGVtZW50LmZpbmQoXCJ0cltpc0hlYWRlciE9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuXG4gICAgICB2YXIgX3Jvd0lkID0gJHRyLmF0dHIoXCJpZFwiKTtcblxuICAgICAgaWYgKHJvd0lkID09IF9yb3dJZCkge1xuICAgICAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiByb3dEYXRhKSB7XG4gICAgICAgICAgJHRyLmZpbmQoXCJ0ZFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkdGQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyICRkaXNwbGF5RWxlbSA9ICR0ZC5maW5kKFwiW0lzU2VyaWFsaXplPSd0cnVlJ11cIik7XG4gICAgICAgICAgICB2YXIgYmluZE5hbWUgPSAkZGlzcGxheUVsZW0uYXR0cihcIkJpbmROYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAoYXR0ck5hbWUgPT0gYmluZE5hbWUpIHtcbiAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlSWQgPSAkdGQuYXR0cihcInRlbXBsYXRlSWRcIik7XG5cbiAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gX2hvc3QuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcblxuICAgICAgICAgICAgICB2YXIgdGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgIHZhciB2YWwgPSByb3dEYXRhW2JpbmROYW1lXTtcblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkZvcm1hdHRlciAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgdGVtcGxhdGUuRm9ybWF0dGVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGVtcGxhdGUuRm9ybWF0dGVyKHZhbCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodGV4dCA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IHZhbDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICgkZGlzcGxheUVsZW0ucHJvcCgndGFnTmFtZScpID09IFwiSU5QVVRcIikge1xuICAgICAgICAgICAgICAgIGlmICgkZGlzcGxheUVsZW0uYXR0cihcInR5cGVcIikudG9Mb3dlckNhc2UoKSA9PSBcImNoZWNrYm94XCIpIHt9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgJGRpc3BsYXlFbGVtLnZhbCh0ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICRkaXNwbGF5RWxlbS50ZXh0KHRleHQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVXBkYXRlVG9Sb3cgJGxhYmVsLnRleHQodGV4dCkgRXJyb3IhXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRkaXNwbGF5RWxlbS5hdHRyKFwiVmFsdWVcIiwgdmFsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIEdldFNlbGVjdFJvd0RhdGFCeVJvd0lkOiBmdW5jdGlvbiBHZXRTZWxlY3RSb3dEYXRhQnlSb3dJZChyb3dJZCkge1xuICAgIHZhciB0YWJsZUVsZW1lbnQgPSB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG4gICAgdmFyIHJvd0RhdGEgPSB7fTtcbiAgICB0YWJsZUVsZW1lbnQuZmluZChcInRyW2lzSGVhZGVyIT0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0ciA9ICQodGhpcyk7XG5cbiAgICAgIHZhciBfcm93SWQgPSAkdHIuYXR0cihcImlkXCIpO1xuXG4gICAgICBpZiAocm93SWQgPT0gX3Jvd0lkKSB7XG4gICAgICAgICR0ci5maW5kKFwiW0lzU2VyaWFsaXplPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcIlZhbHVlXCIpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcm93RGF0YVskKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKV0gPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm93RGF0YVskKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKV0gPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvd0RhdGE7XG4gIH0sXG4gIEdldFNlbGVjdFJvd0J5Um93SWQ6IGZ1bmN0aW9uIEdldFNlbGVjdFJvd0J5Um93SWQocm93SWQpIHtcbiAgICB2YXIgdGFibGVFbGVtZW50ID0gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICAgIHJldHVybiB0YWJsZUVsZW1lbnQuZmluZChcInRyW2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgfSxcbiAgR2V0QWxsUm93RGF0YTogZnVuY3Rpb24gR2V0QWxsUm93RGF0YSgpIHtcbiAgICB2YXIgdGFibGVFbGVtZW50ID0gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICAgIHZhciByb3dEYXRhcyA9IG5ldyBBcnJheSgpO1xuICAgIHRhYmxlRWxlbWVudC5maW5kKFwidHJbaXNIZWFkZXIhPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRyID0gJCh0aGlzKTtcbiAgICAgIHZhciByb3dEYXRhID0ge307XG4gICAgICAkdHIuZmluZChcIltJc1NlcmlhbGl6ZT0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICByb3dEYXRhWyQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpXSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICByb3dEYXRhWyQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpICsgXCJfX19UZXh0XCJdID0gJCh0aGlzKS5hdHRyKFwiVGV4dFwiKTtcbiAgICAgIH0pO1xuICAgICAgcm93RGF0YXMucHVzaChyb3dEYXRhKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcm93RGF0YXM7XG4gIH0sXG4gIEdldFNlcmlhbGl6ZUpzb246IGZ1bmN0aW9uIEdldFNlcmlhbGl6ZUpzb24oKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSgpO1xuICAgIHZhciB0YWJsZSA9IHRoaXMuXyRQcm9wX1RhYmxlRWxlbTtcbiAgICB0YWJsZS5maW5kKFwidHJbaXNIZWFkZXIhPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcm93ZGF0YSA9IG5ldyBPYmplY3QoKTtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuICAgICAgJHRyLmZpbmQoXCJbSXNTZXJpYWxpemU9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlcml0ZW0gPSAkKHRoaXMpO1xuICAgICAgICB2YXIgYmluZE5hbWUgPSBzZXJpdGVtLmF0dHIoXCJCaW5kTmFtZVwiKTtcbiAgICAgICAgdmFyIGJpbmRWYWx1ZSA9IHNlcml0ZW0uYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB2YXIgYmluZFRleHQgPSBzZXJpdGVtLmF0dHIoXCJUZXh0XCIpO1xuICAgICAgICByb3dkYXRhW2JpbmROYW1lXSA9IGJpbmRWYWx1ZTtcbiAgICAgICAgcm93ZGF0YVtiaW5kTmFtZSArIFwiX19fVGV4dFwiXSA9IGJpbmRUZXh0O1xuICAgICAgfSk7XG4gICAgICByZXN1bHQucHVzaChyb3dkYXRhKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBHZXRUYWJsZUVsZW1lbnQ6IGZ1bmN0aW9uIEdldFRhYmxlRWxlbWVudCgpIHtcbiAgICByZXR1cm4gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICB9XG59O1xudmFyIEVkaXRUYWJsZUNvbmZpZ01hbmFnZXIgPSB7XG4gIF9Qcm9wX0NvbmZpZzoge30sXG4gIEluaXRpYWxpemF0aW9uQ29uZmlnOiBmdW5jdGlvbiBJbml0aWFsaXphdGlvbkNvbmZpZyhfY29uZmlnKSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgdGhpcy5fUHJvcF9Db25maWcsIF9jb25maWcpO1xuICAgIHZhciBfdGVtcGxhdGVzID0gdGhpcy5fUHJvcF9Db25maWcuVGVtcGxhdGVzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfdGVtcGxhdGVzW2ldO1xuICAgICAgdGVtcGxhdGUuVGVtcGxhdGVJZCA9IFN0cmluZ1V0aWxpdHkuR3VpZCgpO1xuICAgIH1cbiAgfSxcbiAgR2V0Q29uZmlnOiBmdW5jdGlvbiBHZXRDb25maWcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX1Byb3BfQ29uZmlnO1xuICB9LFxuICBHZXRUZW1wbGF0ZTogZnVuY3Rpb24gR2V0VGVtcGxhdGUodGVtcGxhdGVJZCkge1xuICAgIHZhciBfdGVtcGxhdGVzID0gdGhpcy5fUHJvcF9Db25maWcuVGVtcGxhdGVzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfdGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfdGVtcGxhdGVzW2ldO1xuXG4gICAgICBpZiAodGVtcGxhdGUuVGVtcGxhdGVJZCA9PSB0ZW1wbGF0ZUlkKSB7XG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufTtcbnZhciBFZGl0VGFibGVWYWxpZGF0ZSA9IHtcbiAgX1NRTEtleVdvcmRBcnJheTogbmV3IEFycmF5KCksXG4gIEdldFNRTEtleVdvcmRzOiBmdW5jdGlvbiBHZXRTUUxLZXlXb3JkcygpIHtcbiAgICBpZiAodGhpcy5fU1FMS2V5V29yZEFycmF5Lmxlbmd0aCA9PSAwKSB7XG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImluc2VydFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJ1cGRhdGVcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZGVsZXRlXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcInNlbGVjdFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJhc1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJmcm9tXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImRpc3RpbmN0XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIndoZXJlXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIm9yZGVyXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImJ5XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFzY1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJkZXNjXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImRlc2NcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiYW5kXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIm9yXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImJldHdlZW5cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwib3JkZXIgYnlcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiY291bnRcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZ3JvdXBcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZ3JvdXAgYnlcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiaGF2aW5nXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFsaWFzXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImpvaW5cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwibGVmdFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJyaWd0aFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJpbm5lZXJcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwidW5pb25cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwic3VtXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFsbFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJtaW51c1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJhbGVydFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJkcm9wXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImV4ZWNcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwidHJ1bmNhdGVcIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX1NRTEtleVdvcmRBcnJheTtcbiAgfSxcbiAgVmFsaWRhdGU6IGZ1bmN0aW9uIFZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpIHtcbiAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgU3VjY2VzczogdHJ1ZSxcbiAgICAgIE1zZzogXCJcIlxuICAgIH07XG4gICAgdmFyIHZhbGlkYXRlQ29uZmlnID0gdGVtcGxhdGUuVmFsaWRhdGU7XG5cbiAgICBpZiAodmFsaWRhdGVDb25maWcgIT0gdW5kZWZpbmVkICYmIHZhbGlkYXRlQ29uZmlnICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWxpZGF0ZVR5cGUgPSB2YWxpZGF0ZUNvbmZpZy5UeXBlO1xuXG4gICAgICBpZiAodmFsaWRhdGVUeXBlICE9IHVuZGVmaW5lZCAmJiB2YWxpZGF0ZVR5cGUgIT0gbnVsbCkge1xuICAgICAgICBzd2l0Y2ggKHZhbGlkYXRlVHlwZSkge1xuICAgICAgICAgIGNhc2UgXCJOb3RFbXB0eVwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZiAodmFsID09IFwiXCIpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5Nc2cgPSBcIuOAkFwiICsgdGVtcGxhdGUuVGl0bGUgKyBcIuOAkeS4jeiDveS4uuepuiFcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFwiTFVOb09ubHlcIjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgaWYgKC9eW2EtekEtWl1bYS16QS1aMC05X117MCx9JC8udGVzdCh2YWwpID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0LlN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICByZXN1bHQuTXNnID0gXCLjgJBcIiArIHRlbXBsYXRlLlRpdGxlICsgXCLjgJHkuI3og73kuLrnqbrkuJTlj6rog73mmK/lrZfmr43jgIHkuIvliJLnur/jgIHmlbDlrZflubbku6XlrZfmr43lvIDlpLTvvIFcIjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlIFwiU1FMS2V5V29yZFwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZiAoL15bYS16QS1aXVthLXpBLVowLTlfXXswLH0kLy50ZXN0KHZhbCkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5Nc2cgPSBcIuOAkFwiICsgdGVtcGxhdGUuVGl0bGUgKyBcIuOAkeS4jeiDveS4uuepuuS4lOWPquiDveaYr+Wtl+avjeOAgeS4i+WIkue6v+OAgeaVsOWtl+W5tuS7peWtl+avjeW8gOWktO+8gVwiO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdmFyIHZhbCA9IHZhbC50b1VwcGVyQ2FzZSgpO1xuICAgICAgICAgICAgICB2YXIgc3FsS2V5V29yZHMgPSB0aGlzLkdldFNRTEtleVdvcmRzKCk7XG5cbiAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzcWxLZXlXb3Jkcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh2YWwgPT0gc3FsS2V5V29yZHNbaV0udG9VcHBlckNhc2UoKSkge1xuICAgICAgICAgICAgICAgICAgcmVzdWx0LlN1Y2Nlc3MgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgIHJlc3VsdC5Nc2cgPSBcIuOAkFwiICsgdGVtcGxhdGUuVGl0bGUgKyBcIuOAkeivt+S4jeimgeS9v+eUqFNRTOWFs+mUruWtl+S9nOS4uuWIl+WQje+8gVwiO1xuICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG52YXIgRWRpdFRhYmxlRGVmYXVsZVZhbHVlID0ge1xuICBHZXRWYWx1ZTogZnVuY3Rpb24gR2V0VmFsdWUodGVtcGxhdGUpIHtcbiAgICB2YXIgZGVmYXVsdFZhbHVlQ29uZmlnID0gdGVtcGxhdGUuRGVmYXVsdFZhbHVlO1xuXG4gICAgaWYgKGRlZmF1bHRWYWx1ZUNvbmZpZyAhPSB1bmRlZmluZWQgJiYgZGVmYXVsdFZhbHVlQ29uZmlnICE9IG51bGwpIHtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWVUeXBlID0gZGVmYXVsdFZhbHVlQ29uZmlnLlR5cGU7XG5cbiAgICAgIGlmIChkZWZhdWx0VmFsdWVUeXBlICE9IHVuZGVmaW5lZCAmJiBkZWZhdWx0VmFsdWVUeXBlICE9IG51bGwpIHtcbiAgICAgICAgc3dpdGNoIChkZWZhdWx0VmFsdWVUeXBlKSB7XG4gICAgICAgICAgY2FzZSBcIkNvbnN0XCI6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJldHVybiBkZWZhdWx0VmFsdWVDb25maWcuVmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICBjYXNlIFwiR1VJRFwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICByZXR1cm4gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBcIlwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0NoZWNrQm94ID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFyIHZhbCA9IEVkaXRUYWJsZURlZmF1bGVWYWx1ZS5HZXRWYWx1ZSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5odG1sKCk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gXCJcIjtcblxuICAgIGlmICh2YWwgPT0gXCLmmK9cIikge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J2NoZWNrYm94JyBjaGVja2VkPSdjaGVja2VkJyAvPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J2NoZWNrYm94JyAvPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciAkZWxlbSA9IFwiXCI7XG5cbiAgICBpZiAodGVtcGxhdGUuSXNDTlZhbHVlKSB7XG4gICAgICBpZiAoZWRpdFN0YXVzSHRtbEVsZW0uYXR0cihcImNoZWNrZWRcIikgPT0gXCJjaGVja2VkXCIpIHtcbiAgICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyB2YWx1ZT0n5pivJz7mmK88L2xhYmVsPlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9J+WQpic+5ZCmPC9sYWJlbD5cIik7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChlZGl0U3RhdXNIdG1sRWxlbS5hdHRyKFwiY2hlY2tlZFwiKSA9PSBcImNoZWNrZWRcIikge1xuICAgICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIHZhbHVlPScxJz7mmK88L2xhYmVsPlwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9JzAnPuWQpjwvbGFiZWw+XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0Zvcm1hdHRlciA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIGlmICh0ZW1wbGF0ZS5Gb3JtYXR0ZXIgJiYgdHlwZW9mIHRlbXBsYXRlLkZvcm1hdHRlciA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIHZhciBlZGl0RGF0YXMgPSBFZGl0VGFibGUuX1Byb3BfSnNvbkRhdGE7XG5cbiAgICAgIGlmIChlZGl0RGF0YXMpIHtcbiAgICAgICAgdmFyIHJvd0lkID0gaG9zdFJvdy5hdHRyKFwiaWRcIik7XG4gICAgICAgIHZhciByb3dEYXRhID0gZWRpdERhdGFzW3Jvd0lkXTtcblxuICAgICAgICBpZiAocm93RGF0YSkge1xuICAgICAgICAgIHJldHVybiAkKHRlbXBsYXRlLkZvcm1hdHRlcih0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgcm93RGF0YSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiXCI7XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgaWYgKHRlbXBsYXRlLkZvcm1hdHRlciAmJiB0eXBlb2YgdGVtcGxhdGUuRm9ybWF0dGVyID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIGVkaXREYXRhcyA9IEVkaXRUYWJsZS5fUHJvcF9Kc29uRGF0YTtcblxuICAgICAgaWYgKGVkaXREYXRhcykge1xuICAgICAgICB2YXIgcm93SWQgPSBob3N0Um93LmF0dHIoXCJpZFwiKTtcbiAgICAgICAgdmFyIHJvd0RhdGEgPSBlZGl0RGF0YXNbcm93SWRdO1xuXG4gICAgICAgIGlmIChyb3dEYXRhKSB7XG4gICAgICAgICAgcmV0dXJuICQodGVtcGxhdGUuRm9ybWF0dGVyKHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCByb3dEYXRhKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0xhYmVsID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuRm9ybWF0ZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmh0bWwoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgJGVsZW07XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkZvcm1hdGVyID09PSAndW5kZWZpbmVkJykge1xuICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBUZXh0PSdcIiArIHRleHQgKyBcIicgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsICsgXCInPlwiICsgdmFsICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHRleHQgPSB0ZW1wbGF0ZS5Gb3JtYXRlcih2YWwpO1xuICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBUZXh0PVwiICsgdGV4dCArIFwiIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPVwiICsgdmFsICsgXCI+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyICRlbGVtO1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuRm9ybWF0ZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIFRleHQ9J1wiICsgdGV4dCArIFwiJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB2YWwgKyBcIjwvbGFiZWw+XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGV4dCA9IHRlbXBsYXRlLkZvcm1hdGVyKHZhbCk7XG4gICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIFRleHQ9J1wiICsgdGV4dCArIFwiJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9SYWRpbyA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gXCJcIjtcblxuICAgIGlmIChudWxsICE9IHZpZXdTdGF1c0h0bWxFbGVtICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCAmJiB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiY2hlY2tlZFwiKSA9PSBcImNoZWNrZWRcIiB8fCB2YWwgPT0gMSkge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3JhZGlvJyBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgbmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBjaGVja2VkPSdjaGVja2VkJyB2YWx1ZT0nMScvPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3JhZGlvJyBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgbmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyB2YWx1ZT0nMCcvPlwiKTtcbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciAkZWxlbSA9IFwiXCI7XG5cbiAgICBpZiAoZWRpdFN0YXVzSHRtbEVsZW0uYXR0cihcImNoZWNrZWRcIikgPT0gXCJjaGVja2VkXCIpIHtcbiAgICAgICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSdyYWRpbycgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIG5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIidjaGVja2VkPSdjaGVja2VkJyAgdmFsdWU9JzEnLz5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtID0gJChcIjxpbnB1dCB0eXBlPSdyYWRpbycgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIG5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9JzAnLz5cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfU2VsZWN0ID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIGNvbmZpZ1NvdXJjZSA9IG51bGw7XG5cbiAgICBpZiAodGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZSAhPSBudWxsKSB7XG4gICAgICBjb25maWdTb3VyY2UgPSB0ZW1wbGF0ZS5DbGllbnREYXRhU291cmNlO1xuICAgIH0gZWxzZSBpZiAodGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZUZ1bmMgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2VGdW5jICE9IG51bGwpIHtcbiAgICAgIGNvbmZpZ1NvdXJjZSA9IHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2VGdW5jKHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2VGdW5jUGFyYXMsIF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbmZpZ1NvdXJjZSA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJChcIjxsYWJlbD7mib7kuI3liLDmlbDmja7mupDorr7nva4s6K+35ZyodGVtcGxhdGXkuK3orr7nva7mlbDmja7mupA8L2xhYmVsPlwiKTtcbiAgICB9XG5cbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgdHh0ID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YXIgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPHNlbGVjdCBzdHlsZT0nd2lkdGg6IDEwMCUnIC8+XCIpO1xuXG4gICAgaWYgKGNvbmZpZ1NvdXJjZVswXS5ncm91cCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWdTb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIG9wdGdyb3VwID0gJChcIjxvcHRncm91cCAvPlwiKTtcbiAgICAgICAgb3B0Z3JvdXAuYXR0cihcImxhYmVsXCIsIGNvbmZpZ1NvdXJjZVtpXS5ncm91cCk7XG5cbiAgICAgICAgaWYgKGNvbmZpZ1NvdXJjZVtpXS5vcHRpb25zKSB7XG4gICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBjb25maWdTb3VyY2VbaV0ub3B0aW9ucy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgdmFyIG9wdGlvbiA9ICQoXCI8b3B0aW9uIC8+XCIpO1xuICAgICAgICAgICAgb3B0aW9uLmF0dHIoXCJ2YWx1ZVwiLCBjb25maWdTb3VyY2VbaV0ub3B0aW9uc1tqXS52YWx1ZSk7XG4gICAgICAgICAgICBvcHRpb24uYXR0cihcIlRleHRcIiwgY29uZmlnU291cmNlW2ldLm9wdGlvbnNbal0udGV4dCk7XG4gICAgICAgICAgICBvcHRpb24udGV4dChjb25maWdTb3VyY2VbaV0ub3B0aW9uc1tqXS50ZXh0KTtcbiAgICAgICAgICAgIG9wdGdyb3VwLmFwcGVuZChvcHRpb24pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICRlbGVtLmFwcGVuZChvcHRncm91cCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29uZmlnU291cmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0gY29uZmlnU291cmNlW2ldO1xuICAgICAgICAkZWxlbS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIGl0ZW0uVmFsdWUgKyBcIicgdGV4dD0nXCIgKyBpdGVtLlRleHQgKyBcIic+XCIgKyBpdGVtLlRleHQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAkZWxlbS52YWwodmFsKTtcblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuQ2hhbmdlRXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAkZWxlbS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgICB0ZW1wbGF0ZS5DaGFuZ2VFdmVudCh0aGlzLCBfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS5maW5kKFwib3B0aW9uOnNlbGVjdGVkXCIpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB2YXIgdGV4dCA9IGVkaXRTdGF1c0h0bWxFbGVtLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikuYXR0cihcIlRleHRcIik7XG5cbiAgICBpZiAoIXZhbCkge1xuICAgICAgdmFsID0gXCJcIjtcbiAgICB9XG5cbiAgICBpZiAoIXRleHQpIHtcbiAgICAgIHRleHQgPSBcIlwiO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbCArIFwiJyBUZXh0PSdcIiArIHRleHQgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9TZWxlY3RSb3dDaGVja0JveCA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiVmFsdWVcIik7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxpbnB1dCBJc1NlcmlhbGl6ZT0ndHJ1ZScgdHlwZT0nY2hlY2tib3gnIGNoZWNrZWQ9J2NoZWNrZWQnICBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyAvPlwiKTtcbiAgICAkZWxlbS5hdHRyKFwiVmFsdWVcIiwgdmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9ICQoZWRpdFN0YXVzSHRtbEVsZW0pLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGlucHV0IElzU2VyaWFsaXplPSd0cnVlJyB0eXBlPSdjaGVja2JveCcgIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIC8+XCIpO1xuICAgICRlbGVtLmF0dHIoXCJWYWx1ZVwiLCB2YWwpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX1RleHRCb3ggPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YXIgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmh0bWwoKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3RleHQnIElzU2VyaWFsaXplPSd0cnVlJyBzdHlsZT0nd2lkdGg6IDk4JScgLz5cIik7XG4gICAgJGVsZW0udmFsKHZhbCk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB2YWwgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG5cbiAgICBpZiAodHlwZW9mIHRlbXBsYXRlLlZhbGlkYXRlICE9ICd1bmRlZmluZWQnICYmIHR5cGVvZiB0ZW1wbGF0ZS5WYWxpZGF0ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB2YXIgcmVzdWx0ID0ge1xuICAgICAgICBTdWNjZXNzOiB0cnVlLFxuICAgICAgICBNc2c6IG51bGxcbiAgICAgIH07XG4gICAgICByZXN1bHQuU3VjY2VzcyA9IHRlbXBsYXRlLlZhbGlkYXRlKCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29sdW1uX1NlbGVjdERlZmF1bHRWYWx1ZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciBkZWZhdWx0VHlwZSA9IFwiXCI7XG4gICAgdmFyIGRlZmF1bHRWYWx1ZSA9IFwiXCI7XG4gICAgdmFyIGRlZmF1bHRUZXh0ID0gXCJcIjtcblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgZGVmYXVsdFR5cGUgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRUeXBlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VHlwZVwiXSA6IFwiXCI7XG4gICAgICBkZWZhdWx0VmFsdWUgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRWYWx1ZVwiXSA/IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFZhbHVlXCJdIDogXCJcIjtcbiAgICAgIGRlZmF1bHRUZXh0ID0ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VGV4dFwiXSA/IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFRleHRcIl0gOiBcIlwiO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmlld1N0YXVzSHRtbEVsZW0uZmluZChcImxhYmVsXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIikgPT0gXCJjb2x1bW5EZWZhdWx0VHlwZVwiKSB7XG4gICAgICAgICAgZGVmYXVsdFR5cGUgPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImNvbHVtbkRlZmF1bHRUZXh0XCIpIHtcbiAgICAgICAgICBkZWZhdWx0VGV4dCA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiY29sdW1uRGVmYXVsdFZhbHVlXCIpIHtcbiAgICAgICAgICBkZWZhdWx0VmFsdWUgPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgIHZhciAkaW5wdXRUeHQgPSAkKFwiPGlucHV0IHR5cGU9J3RleHQnIHN0eWxlPSd3aWR0aDogOTAlJyByZWFkb25seSAvPlwiKTtcbiAgICAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRUeXBlXCIsIGRlZmF1bHRUeXBlKTtcbiAgICAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRWYWx1ZVwiLCBkZWZhdWx0VmFsdWUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFRleHRcIiwgZGVmYXVsdFRleHQpO1xuICAgICRpbnB1dFR4dC52YWwoSkJ1aWxkNERTZWxlY3RWaWV3LlNlbGVjdEVudlZhcmlhYmxlLmZvcm1hdFRleHQoZGVmYXVsdFR5cGUsIGRlZmF1bHRUZXh0KSk7XG4gICAgdmFyICRpbnB1dEJ0biA9ICQoXCI8aW5wdXQgY2xhc3M9J25vcm1hbGJ1dHRvbi12MScgc3R5bGU9J21hcmdpbi1sZWZ0OiA0cHg7JyB0eXBlPSdidXR0b24nIHZhbHVlPScuLi4nLz5cIik7XG4gICAgJGVsZW0uYXBwZW5kKCRpbnB1dFR4dCkuYXBwZW5kKCRpbnB1dEJ0bik7XG4gICAgd2luZG93LiRUZW1wJElucHV0dHh0ID0gJGlucHV0VHh0O1xuICAgICRpbnB1dEJ0bi5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuYmVnaW5TZWxlY3QoXCJDb2x1bW5fU2VsZWN0RGVmYXVsdFZhbHVlXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgJGlucHV0VHh0ID0gZWRpdFN0YXVzSHRtbEVsZW0uZmluZChcImlucHV0W3R5cGU9J3RleHQnXVwiKTtcblxuICAgIGlmICgkaW5wdXRUeHQubGVuZ3RoID4gMCkge1xuICAgICAgdmFyIGRlZmF1bHRUeXBlID0gJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VHlwZVwiKTtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRWYWx1ZVwiKTtcbiAgICAgIHZhciBkZWZhdWx0VGV4dCA9ICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFRleHRcIik7XG4gICAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWw+XCIgKyBKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuZm9ybWF0VGV4dChkZWZhdWx0VHlwZSwgZGVmYXVsdFRleHQpICsgXCI8L2xhYmVsPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2NvbHVtbkRlZmF1bHRUeXBlJyBWYWx1ZT0nXCIgKyBkZWZhdWx0VHlwZSArIFwiJyBzdHlsZT0nZGlzcGxheTpub25lJy8+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nY29sdW1uRGVmYXVsdFRleHQnIFZhbHVlPSdcIiArIGRlZmF1bHRUZXh0ICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdjb2x1bW5EZWZhdWx0VmFsdWUnIFZhbHVlPSdcIiArIGRlZmF1bHRWYWx1ZSArIFwiJyBzdHlsZT0nZGlzcGxheTpub25lJy8+XCIpO1xuICAgICAgcmV0dXJuICRlbGVtO1xuICAgIH1cblxuICAgIHJldHVybiAkKFwiPGxhYmVsPjwvbGFiZWw+XCIpO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH0sXG4gIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUoZGVmYXVsdERhdGEpIHtcbiAgICB2YXIgJGlucHV0VHh0ID0gd2luZG93LiRUZW1wJElucHV0dHh0O1xuXG4gICAgaWYgKG51bGwgIT0gZGVmYXVsdERhdGEpIHtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFR5cGVcIiwgZGVmYXVsdERhdGEuVHlwZSk7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRWYWx1ZVwiLCBkZWZhdWx0RGF0YS5WYWx1ZSk7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRUZXh0XCIsIGRlZmF1bHREYXRhLlRleHQpO1xuICAgICAgJGlucHV0VHh0LnZhbChKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuZm9ybWF0VGV4dChkZWZhdWx0RGF0YS5UeXBlLCBkZWZhdWx0RGF0YS5UZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFR5cGVcIiwgXCJcIik7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRWYWx1ZVwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFRleHRcIiwgXCJcIik7XG4gICAgICAkaW5wdXRUeHQudmFsKFwiXCIpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENvbHVtbl9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyID0ge1xuICBfZmllbGREYXRhVHlwZUFycmF5OiBudWxsLFxuICBHZXRGaWVsZERhdGFUeXBlQXJyYXk6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVBcnJheSgpIHtcbiAgICBpZiAodGhpcy5fZmllbGREYXRhVHlwZUFycmF5ID09IG51bGwpIHtcbiAgICAgIHZhciBfc2VsZiA9IHRoaXM7XG5cbiAgICAgIEFqYXhVdGlsaXR5LlBvc3RTeW5jKFwiL1BsYXRGb3JtUmVzdC9CdWlsZGVyL0RhdGFTdG9yYWdlL0RhdGFCYXNlL1RhYmxlL0dldFRhYmxlRmllbGRUeXBlLmRvXCIsIHt9LCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IHRydWUpIHtcbiAgICAgICAgICB2YXIgbGlzdCA9IEpzb25VdGlsaXR5LlN0cmluZ1RvSnNvbihkYXRhLmRhdGEpO1xuXG4gICAgICAgICAgaWYgKGxpc3QgIT0gbnVsbCAmJiBsaXN0ICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgX3NlbGYuX2ZpZWxkRGF0YVR5cGVBcnJheSA9IGxpc3Q7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBcIkFsZXJ0TG9hZGluZ1F1ZXJ5RXJyb3JcIiwge30sIFwi5Yqg6L295a2X5q6157G75Z6L5aSx6LSl77yBXCIsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX2ZpZWxkRGF0YVR5cGVBcnJheTtcbiAgfSxcbiAgR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWU6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVZhbHVlKFZhbHVlKSB7XG4gICAgdmFyIGFycmF5RGF0YSA9IHRoaXMuR2V0RmllbGREYXRhVHlwZUFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9iaiA9IGFycmF5RGF0YVtpXTtcblxuICAgICAgaWYgKG9iai5WYWx1ZSA9PSBWYWx1ZSkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZXJ0KFwi5om+5LiN5Yiw5oyH5a6a55qE5pWw5o2u57G75Z6L77yM6K+356Gu6K6k5piv5ZCm5pSv5oyB6K+l57G75Z6L77yBXCIpO1xuICB9LFxuICBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0OiBmdW5jdGlvbiBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0KHRleHQpIHtcbiAgICB2YXIgYXJyYXlEYXRhID0gdGhpcy5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqID0gYXJyYXlEYXRhW2ldO1xuXG4gICAgICBpZiAob2JqLlRleHQgPT0gdGV4dCkge1xuICAgICAgICByZXR1cm4gb2JqO1xuICAgICAgfVxuICAgIH1cblxuICAgIGFsZXJ0KFwi5om+5LiN5Yiw5oyH5a6a55qE5pWw5o2u57G75Z6L77yM6K+356Gu6K6k5piv5ZCm5pSv5oyB6K+l57G75Z6L77yBXCIpO1xuICB9XG59O1xudmFyIENvbHVtbl9TZWxlY3RGaWVsZFR5cGUgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPHNlbGVjdCAvPlwiKTtcblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EYXRhVHlwZU5hbWVcIl07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiVmFsdWVcIik7XG4gICAgfVxuXG4gICAgdmFyIF9maWVsZERhdGFUeXBlQXJyYXkgPSBDb2x1bW5fU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2ZpZWxkRGF0YVR5cGVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gX2ZpZWxkRGF0YVR5cGVBcnJheVtpXS5WYWx1ZTtcbiAgICAgIHZhciB0ZXh0ID0gX2ZpZWxkRGF0YVR5cGVBcnJheVtpXS5UZXh0O1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyB2YWx1ZSArIFwiJz5cIiArIHRleHQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgICB9XG5cbiAgICBpZiAodmFsICE9IFwiXCIpIHtcbiAgICAgICRlbGVtLnZhbCh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZWxlbS52YWwoQ29sdW1uX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIuR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VGV4dChcIuWtl+espuS4slwiKS5WYWx1ZSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWx1ZSA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciB0ZXh0ID0gQ29sdW1uX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIuR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWUodmFsdWUpLlRleHQ7XG4gICAgdmFyICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsdWUgKyBcIic+XCIgKyB0ZXh0ICsgXCI8L2xhYmVsPlwiKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9GaWVsZE5hbWUgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YXIgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmh0bWwoKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3RleHQnIHN0eWxlPSd3aWR0aDogOTglJyAvPlwiKTtcbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICAkZWxlbS5hdHRyKFwiQmluZE5hbWVcIiwgdGVtcGxhdGUuQmluZE5hbWUpO1xuICAgICRlbGVtLmF0dHIoXCJWYWxcIiwgdmFsKTtcbiAgICAkZWxlbS5hdHRyKFwiSXNTZXJpYWxpemVcIiwgXCJ0cnVlXCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCkudG9VcHBlckNhc2UoKTtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB2YWwgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyIHJlc3VsdCA9IEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuXG4gICAgaWYgKHJlc3VsdC5TdWNjZXNzKSB7XG4gICAgICBob3N0VGFibGUuZmluZChcIltyZW5kZXJlcj1FZGl0VGFibGVfRmllbGROYW1lXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlcml0ZW0gPSAkKHRoaXMpO1xuICAgICAgICBzZXJpdGVtLmZpbmQoXCJsYWJlbFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB2YXIgbGFiZWxpdGVtID0gJCh0aGlzKTtcblxuICAgICAgICAgIGlmIChsYWJlbGl0ZW0udGV4dCgpID09IHZhbCB8fCBsYWJlbGl0ZW0udGV4dCgpID09IHZhbC50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICByZXN1bHQgPSB7XG4gICAgICAgICAgICAgIFN1Y2Nlc3M6IGZhbHNlLFxuICAgICAgICAgICAgICBNc2c6IFwiW+Wtl+auteWQjeensF3kuI3og73ph43lpI0hXCJcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIGZpZWxkRGVmYXVsdFR5cGUgPSBcIlwiO1xuICAgIHZhciBmaWVsZERlZmF1bHRWYWx1ZSA9IFwiXCI7XG4gICAgdmFyIGZpZWxkRGVmYXVsdFRleHQgPSBcIlwiO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBmaWVsZERlZmF1bHRUeXBlID0ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRUeXBlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRUeXBlXCJdIDogXCJcIjtcbiAgICAgIGZpZWxkRGVmYXVsdFZhbHVlID0ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRWYWx1ZVwiXSA/IGpzb25EYXRhU2luZ2xlW1wiZmllbGREZWZhdWx0VmFsdWVcIl0gOiBcIlwiO1xuICAgICAgZmllbGREZWZhdWx0VGV4dCA9IGpzb25EYXRhU2luZ2xlW1wiZmllbGREZWZhdWx0VGV4dFwiXSA/IGpzb25EYXRhU2luZ2xlW1wiZmllbGREZWZhdWx0VGV4dFwiXSA6IFwiXCI7XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2aWV3U3RhdXNIdG1sRWxlbS5maW5kKFwibGFiZWxcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImZpZWxkRGVmYXVsdFR5cGVcIikge1xuICAgICAgICAgIGZpZWxkRGVmYXVsdFR5cGUgPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImZpZWxkRGVmYXVsdFRleHRcIikge1xuICAgICAgICAgIGZpZWxkRGVmYXVsdFRleHQgPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgfSBlbHNlIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImZpZWxkRGVmYXVsdFZhbHVlXCIpIHtcbiAgICAgICAgICBmaWVsZERlZmF1bHRWYWx1ZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgdmFyICRpbnB1dFR4dCA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgc3R5bGU9J3dpZHRoOiA5MCUnIHJlYWRvbmx5IC8+XCIpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VHlwZVwiLCBmaWVsZERlZmF1bHRUeXBlKTtcbiAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFZhbHVlXCIsIGZpZWxkRGVmYXVsdFZhbHVlKTtcbiAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFRleHRcIiwgZmllbGREZWZhdWx0VGV4dCk7XG4gICAgJGlucHV0VHh0LnZhbChKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuZm9ybWF0VGV4dChmaWVsZERlZmF1bHRUeXBlLCBmaWVsZERlZmF1bHRUZXh0KSk7XG4gICAgdmFyICRpbnB1dEJ0biA9ICQoXCI8aW5wdXQgY2xhc3M9J25vcm1hbGJ1dHRvbi12MScgc3R5bGU9J21hcmdpbi1sZWZ0OiA0cHg7JyB0eXBlPSdidXR0b24nIHZhbHVlPScuLi4nLz5cIik7XG4gICAgJGVsZW0uYXBwZW5kKCRpbnB1dFR4dCkuYXBwZW5kKCRpbnB1dEJ0bik7XG4gICAgd2luZG93LiRUZW1wJElucHV0dHh0ID0gJGlucHV0VHh0O1xuICAgICRpbnB1dEJ0bi5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICB0YWJsZURlc2lvbi5zZWxlY3REZWZhdWx0VmFsdWVEaWFsb2dCZWdpbihFZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlLCBudWxsKTtcbiAgICB9KTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyICRpbnB1dFR4dCA9IGVkaXRTdGF1c0h0bWxFbGVtLmZpbmQoXCJpbnB1dFt0eXBlPSd0ZXh0J11cIik7XG5cbiAgICBpZiAoJGlucHV0VHh0Lmxlbmd0aCA+IDApIHtcbiAgICAgIHZhciBkZWZhdWx0VHlwZSA9ICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VHlwZVwiKTtcbiAgICAgIHZhciBkZWZhdWx0VmFsdWUgPSAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFZhbHVlXCIpO1xuICAgICAgdmFyIGRlZmF1bHRUZXh0ID0gJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUZXh0XCIpO1xuICAgICAgdmFyICRlbGVtID0gJChcIjxkaXY+PC9kaXY+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsPlwiICsgSkJ1aWxkNERTZWxlY3RWaWV3LlNlbGVjdEVudlZhcmlhYmxlLmZvcm1hdFRleHQoZGVmYXVsdFR5cGUsIGRlZmF1bHRUZXh0KSArIFwiPC9sYWJlbD5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdmaWVsZERlZmF1bHRUeXBlJyBWYWx1ZT0nXCIgKyBkZWZhdWx0VHlwZSArIFwiJyBzdHlsZT0nZGlzcGxheTpub25lJy8+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nZmllbGREZWZhdWx0VGV4dCcgVmFsdWU9J1wiICsgZGVmYXVsdFRleHQgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2ZpZWxkRGVmYXVsdFZhbHVlJyBWYWx1ZT0nXCIgKyBkZWZhdWx0VmFsdWUgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgIHJldHVybiAkZWxlbTtcbiAgICB9XG5cbiAgICByZXR1cm4gJChcIjxsYWJlbD48L2xhYmVsPlwiKTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9LFxuICBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlOiBmdW5jdGlvbiBzZXRTZWxlY3RFbnZWYXJpYWJsZVJlc3VsdFZhbHVlKGRlZmF1bHREYXRhKSB7XG4gICAgdmFyICRpbnB1dFR4dCA9IHdpbmRvdy4kVGVtcCRJbnB1dHR4dDtcblxuICAgIGlmIChudWxsICE9IGRlZmF1bHREYXRhKSB7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFR5cGVcIiwgZGVmYXVsdERhdGEuVHlwZSk7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFZhbHVlXCIsIGRlZmF1bHREYXRhLlZhbHVlKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VGV4dFwiLCBkZWZhdWx0RGF0YS5UZXh0KTtcbiAgICAgICRpbnB1dFR4dC52YWwoSkJ1aWxkNERTZWxlY3RWaWV3LlNlbGVjdEVudlZhcmlhYmxlLmZvcm1hdFRleHQoZGVmYXVsdERhdGEuVHlwZSwgZGVmYXVsdERhdGEuVGV4dCkpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFR5cGVcIiwgXCJcIik7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFZhbHVlXCIsIFwiXCIpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUZXh0XCIsIFwiXCIpO1xuICAgICAgJGlucHV0VHh0LnZhbChcIlwiKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlciA9IHtcbiAgX2ZpZWxkRGF0YVR5cGVBcnJheTogbnVsbCxcbiAgR2V0RmllbGREYXRhVHlwZUFycmF5OiBmdW5jdGlvbiBHZXRGaWVsZERhdGFUeXBlQXJyYXkoKSB7XG4gICAgaWYgKHRoaXMuX2ZpZWxkRGF0YVR5cGVBcnJheSA9PSBudWxsKSB7XG4gICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgICBBamF4VXRpbGl0eS5Qb3N0U3luYyhcIi9QbGF0Rm9ybVJlc3QvQnVpbGRlci9EYXRhU3RvcmFnZS9EYXRhQmFzZS9UYWJsZS9HZXRUYWJsZUZpZWxkVHlwZS5kb1wiLCB7fSwgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSB0cnVlKSB7XG4gICAgICAgICAgdmFyIGxpc3QgPSBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb24oZGF0YS5kYXRhKTtcblxuICAgICAgICAgIGlmIChsaXN0ICE9IG51bGwgJiYgbGlzdCAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIF9zZWxmLl9maWVsZERhdGFUeXBlQXJyYXkgPSBsaXN0O1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgXCJBbGVydExvYWRpbmdRdWVyeUVycm9yXCIsIHt9LCBcIuWKoOi9veWtl+auteexu+Wei+Wksei0pe+8gVwiLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9maWVsZERhdGFUeXBlQXJyYXk7XG4gIH0sXG4gIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVZhbHVlOiBmdW5jdGlvbiBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZShWYWx1ZSkge1xuICAgIHZhciBhcnJheURhdGEgPSB0aGlzLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmogPSBhcnJheURhdGFbaV07XG5cbiAgICAgIGlmIChvYmouVmFsdWUgPT0gVmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhbGVydChcIuaJvuS4jeWIsOaMh+WumueahOaVsOaNruexu+Wei++8jOivt+ehruiupOaYr+WQpuaUr+aMgeivpeexu+Wei++8gVwiKTtcbiAgfSxcbiAgR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VGV4dDogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VGV4dCh0ZXh0KSB7XG4gICAgdmFyIGFycmF5RGF0YSA9IHRoaXMuR2V0RmllbGREYXRhVHlwZUFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5RGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIG9iaiA9IGFycmF5RGF0YVtpXTtcblxuICAgICAgaWYgKG9iai5UZXh0ID09IHRleHQpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBhbGVydChcIuaJvuS4jeWIsOaMh+WumueahOaVsOaNruexu+Wei++8jOivt+ehruiupOaYr+WQpuaUr+aMgeivpeexu+Wei++8gVwiKTtcbiAgfVxufTtcbnZhciBFZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyICRlbGVtID0gJChcIjxzZWxlY3QgLz5cIik7XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW1wiZmllbGREYXRhVHlwZVwiXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgX2ZpZWxkRGF0YVR5cGVBcnJheSA9IEVkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfZmllbGREYXRhVHlwZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlZhbHVlO1xuICAgICAgdmFyIHRleHQgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlRleHQ7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHZhbHVlICsgXCInPlwiICsgdGV4dCArIFwiPC9vcHRpb24+XCIpO1xuICAgIH1cblxuICAgIGlmICh2YWwgIT0gXCJcIikge1xuICAgICAgJGVsZW0udmFsKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtLnZhbChFZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0KFwi5a2X56ym5LiyXCIpLlZhbHVlKTtcbiAgICB9XG5cbiAgICAkZWxlbS5jaGFuZ2UoZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XG5cbiAgICAgIGlmICh2YWwgPT0gXCLmlbTmlbBcIikge1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgfSBlbHNlIGlmICh2YWwgPT0gXCLlsI/mlbBcIikge1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDEwKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDIpO1xuICAgICAgfSBlbHNlIGlmICh2YWwgPT0gXCLml6XmnJ/ml7bpl7RcIikge1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMjApO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsID09IFwi5a2X56ym5LiyXCIpIHtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCg1MCk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgfSBlbHNlIGlmICh2YWwgPT0gXCLplb/lrZfnrKbkuLJcIikge1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCB0cnVlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsdWUgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICB2YXIgdGV4dCA9IEVkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyLkdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVZhbHVlKHZhbHVlKS5UZXh0O1xuICAgIHZhciAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbHVlICsgXCInPlwiICsgdGV4dCArIFwiPC9sYWJlbD5cIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBUcmVlVGFibGVDb25maWcgPSB7XG4gIENhbkRlbGV0ZVdoZW5IYXNDaGlsZDogZmFsc2UsXG4gIElkRmllbGQ6IFwiT3JnYW5fSWRcIixcbiAgUm93SWRQcmVmaXg6IFwiVHJlZVRhYmxlX1wiLFxuICBMb2FkQ2hpbGRKc29uVVJMOiBcIlwiLFxuICBMb2FkQ2hpbGRGdW5jOiBudWxsLFxuICBPcGVuTGV2ZWw6IDEsXG4gIENoaWxkVGVzdEZpZWxkOiBcIkNoaWxkX0NvdW50XCIsXG4gIFRlbXBsYXRlczogW3tcbiAgICBUaXRsZTogXCLnu4Tnu4fmnLrmnoTlkI3np7BcIixcbiAgICBGaWVsZE5hbWU6IFwiT3JnYW5fTmFtZVwiLFxuICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICBSZW5kZXJlcjogXCJMYWJsZVwiLFxuICAgIEhpZGRlbjogZmFsc2UsXG4gICAgVGl0bGVDZWxsQXR0cnM6IHt9LFxuICAgIFdpZHRoOiBcIjUwJVwiXG4gIH0sIHtcbiAgICBUaXRsZTogXCLnu4Tnu4fmnLrmnoTnvKnlhpnlkI3np7BcIixcbiAgICBGaWVsZE5hbWU6IFwiT3JnYW5fU2hvcnROYW1lXCIsXG4gICAgVGl0bGVDZWxsQ2xhc3NOYW1lOiBcIlRpdGxlQ2VsbFwiLFxuICAgIFJlbmRlcmVyOiBcIkxhYmxlXCIsXG4gICAgSGlkZGVuOiBmYWxzZSxcbiAgICBUaXRsZUNlbGxBdHRyczoge30sXG4gICAgV2lkdGg6IFwiMjAlXCJcbiAgfSwge1xuICAgIFRpdGxlOiBcIue7hOe7h+e8luWPt1wiLFxuICAgIEZpZWxkTmFtZTogXCJPcmdhbl9Db2RlXCIsXG4gICAgVGl0bGVDZWxsQ2xhc3NOYW1lOiBcIlRpdGxlQ2VsbFwiLFxuICAgIFJlbmRlcmVyOiBcIkxhYmxlXCIsXG4gICAgSGlkZGVuOiBmYWxzZSxcbiAgICBUaXRsZUNlbGxBdHRyczoge30sXG4gICAgV2lkdGg6IFwiMjAlXCJcbiAgfSwge1xuICAgIFRpdGxlOiBcIue7hOe7h0lEXCIsXG4gICAgRmllbGROYW1lOiBcIk9yZ2FuX0lkXCIsXG4gICAgVGl0bGVDZWxsQ2xhc3NOYW1lOiBcIlRpdGxlQ2VsbFwiLFxuICAgIFJlbmRlcmVyOiBcIkxhYmxlXCIsXG4gICAgSGlkZGVuOiBmYWxzZSxcbiAgICBUaXRsZUNlbGxBdHRyczoge30sXG4gICAgV2lkdGg6IFwiMTBcIlxuICB9XSxcbiAgVGFibGVDbGFzczogXCJUcmVlVGFibGVcIixcbiAgUmVuZGVyZXJUbzogXCJkaXZFZGl0VGFibGVcIixcbiAgVGFibGVJZDogXCJUcmVlVGFibGVcIixcbiAgVGFibGVBdHRyczoge1xuICAgIGNlbGxwYWRkaW5nOiBcIjBcIixcbiAgICBjZWxsc3BhY2luZzogXCIwXCIsXG4gICAgYm9yZGVyOiBcIjBcIlxuICB9XG59O1xudmFyIFRyZWVUYWJsZUpzb25EYXRhID0ge1xuICBPcmdhbl9JZDogXCIwXCIsXG4gIE9yZ2FuX05hbWU6IFwicm9vdFwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMlwiLFxuICBPcmdhbl9Db2RlOiBcIjJcIixcbiAgQ2hpbGRfQ291bnQ6IDIsXG4gIE5vZGVzOiBbe1xuICAgIE9yZ2FuX0lkOiBcIjFcIixcbiAgICBPcmdhbl9OYW1lOiBcIjFPcmdhbl9OYW1lXCIsXG4gICAgT3JnYW5fU2hvcnROYW1lOiBcIjFcIixcbiAgICBPcmdhbl9Db2RlOiBcIjFcIixcbiAgICBDaGlsZF9Db3VudDogMixcbiAgICBOb2RlczogW3tcbiAgICAgIE9yZ2FuX0lkOiBcIjEtMVwiLFxuICAgICAgT3JnYW5fTmFtZTogXCIxLTFPcmdhbl9OYW1lXCIsXG4gICAgICBPcmdhbl9TaG9ydE5hbWU6IFwiMS0xXCIsXG4gICAgICBPcmdhbl9Db2RlOiBcIjEtMVwiLFxuICAgICAgQ2hpbGRfQ291bnQ6IDEsXG4gICAgICBOb2RlczogW3tcbiAgICAgICAgT3JnYW5fSWQ6IFwiMS0xLTFcIixcbiAgICAgICAgT3JnYW5fTmFtZTogXCIxLTEtMU9yZ2FuX05hbWVcIixcbiAgICAgICAgT3JnYW5fU2hvcnROYW1lOiBcIjEtMS0xXCIsXG4gICAgICAgIE9yZ2FuX0NvZGU6IFwiMS0xXCIsXG4gICAgICAgIENoaWxkX0NvdW50OiAwXG4gICAgICB9XVxuICAgIH0sIHtcbiAgICAgIE9yZ2FuX0lkOiBcIjEtMlwiLFxuICAgICAgT3JnYW5fTmFtZTogXCIxLTJPcmdhbl9OYW1lXCIsXG4gICAgICBPcmdhbl9TaG9ydE5hbWU6IFwiMS0yXCIsXG4gICAgICBPcmdhbl9Db2RlOiBcIjEtMlwiLFxuICAgICAgQ2hpbGRfQ291bnQ6IDBcbiAgICB9XVxuICB9LCB7XG4gICAgT3JnYW5fSWQ6IFwiMlwiLFxuICAgIE9yZ2FuX05hbWU6IFwiMk9yZ2FuX05hbWVcIixcbiAgICBPcmdhbl9TaG9ydE5hbWU6IFwiMlwiLFxuICAgIE9yZ2FuX0NvZGU6IFwiMlwiLFxuICAgIENoaWxkX0NvdW50OiAwXG4gIH0sIHtcbiAgICBPcmdhbl9JZDogXCIzXCIsXG4gICAgT3JnYW5fTmFtZTogXCIzT3JnYW5fTmFtZVwiLFxuICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIzXCIsXG4gICAgT3JnYW5fQ29kZTogXCIzXCIsXG4gICAgQ2hpbGRfQ291bnQ6IDBcbiAgfSwge1xuICAgIE9yZ2FuX0lkOiBcIjRcIixcbiAgICBPcmdhbl9OYW1lOiBcIjRPcmdhbl9OYW1lXCIsXG4gICAgT3JnYW5fU2hvcnROYW1lOiBcIjRcIixcbiAgICBPcmdhbl9Db2RlOiBcIjRcIixcbiAgICBDaGlsZF9Db3VudDogMFxuICB9XVxufTtcbnZhciBUcmVlVGFibGVKc29uRGF0YUxpc3QgPSBbe1xuICBPcmdhbl9JZDogXCIwXCIsXG4gIE9yZ2FuX05hbWU6IFwicm9vdFwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMlwiLFxuICBPcmdhbl9Db2RlOiBcIjJcIixcbiAgQ2hpbGRfQ291bnQ6IDJcbn0sIHtcbiAgT3JnYW5fSWQ6IFwiMVwiLFxuICBPcmdhbl9OYW1lOiBcIjFPcmdhbl9OYW1lXCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIxXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMVwiLFxuICBDaGlsZF9Db3VudDogMixcbiAgUGFyZW50X0lkOiBcIjBcIlxufSwge1xuICBPcmdhbl9JZDogXCIyXCIsXG4gIE9yZ2FuX05hbWU6IFwiMk9yZ2FuX05hbWVcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjJcIixcbiAgT3JnYW5fQ29kZTogXCIyXCIsXG4gIENoaWxkX0NvdW50OiAwLFxuICBQYXJlbnRfSWQ6IFwiMFwiXG59LCB7XG4gIE9yZ2FuX0lkOiBcIjEtMVwiLFxuICBPcmdhbl9OYW1lOiBcIjEtMU9yZ2FuX05hbWVcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjEtMVwiLFxuICBPcmdhbl9Db2RlOiBcIjEtMVwiLFxuICBDaGlsZF9Db3VudDogMSxcbiAgUGFyZW50X0lkOiBcIjFcIlxufSwge1xuICBPcmdhbl9JZDogXCIxLTJcIixcbiAgT3JnYW5fTmFtZTogXCIxLTJPcmdhbl9OYW1lXCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTJcIixcbiAgT3JnYW5fQ29kZTogXCIxLTJcIixcbiAgQ2hpbGRfQ291bnQ6IDAsXG4gIFBhcmVudF9JZDogXCIxXCJcbn0sIHtcbiAgT3JnYW5fSWQ6IFwiMS0xLTFcIixcbiAgT3JnYW5fTmFtZTogXCIxLTEtMU9yZ2FuX05hbWVcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjEtMS0xXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMS0xXCIsXG4gIENoaWxkX0NvdW50OiAwLFxuICBQYXJlbnRfSWQ6IFwiMS0xXCJcbn1dOyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVHJlZVRhYmxlID0ge1xuICBfJFByb3BfVGFibGVFbGVtOiBudWxsLFxuICBfJFByb3BfUmVuZGVyZXJUb0VsZW06IG51bGwsXG4gIF9Qcm9wX0NvbmZpZzogbnVsbCxcbiAgX1Byb3BfSnNvbkRhdGE6IG51bGwsXG4gIF9Qcm9wX0F1dG9PcGVuTGV2ZWw6IDAsXG4gIF9Qcm9wX0ZpcnN0Q29sdW1uX0luZGVuOiAyMCxcbiAgX1Byb3BfQ3VycmVudFNlbGVjdGVkUm93SWQ6IG51bGwsXG4gIEluaXRpYWxpemF0aW9uOiBmdW5jdGlvbiBJbml0aWFsaXphdGlvbihfY29uZmlnKSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWcgPSBfY29uZmlnO1xuICAgIHRoaXMuXyRQcm9wX1JlbmRlcmVyVG9FbGVtID0gJChcIiNcIiArIHRoaXMuX1Byb3BfQ29uZmlnLlJlbmRlcmVyVG8pO1xuICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbSA9IHRoaXMuQ3JlYXRlVGFibGUoKTtcblxuICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5hcHBlbmQodGhpcy5DcmVhdGVUYWJsZVRpdGxlUm93KCkpO1xuXG4gICAgdGhpcy5fJFByb3BfUmVuZGVyZXJUb0VsZW0uYXBwZW5kKHRoaXMuXyRQcm9wX1RhYmxlRWxlbSk7XG4gIH0sXG4gIExvYWRKc29uRGF0YTogZnVuY3Rpb24gTG9hZEpzb25EYXRhKGpzb25EYXRhcykge1xuICAgIGlmIChqc29uRGF0YXMgIT0gbnVsbCAmJiBqc29uRGF0YXMgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9Qcm9wX0pzb25EYXRhID0ganNvbkRhdGFzO1xuICAgICAgdGhpcy5fUHJvcF9BdXRvT3BlbkxldmVsID0gdGhpcy5fUHJvcF9Db25maWcuT3BlbkxldmVsO1xuXG4gICAgICB2YXIgcm93SWQgPSB0aGlzLl9HZXRSb3dEYXRhSWQoanNvbkRhdGFzKTtcblxuICAgICAgdGhpcy5fQ3JlYXRlUm9vdFJvdyhqc29uRGF0YXMsIHJvd0lkKTtcblxuICAgICAgdGhpcy5fTG9vcENyZWF0ZVJvdyhqc29uRGF0YXMsIGpzb25EYXRhcy5Ob2RlcywgMSwgcm93SWQpO1xuXG4gICAgICB0aGlzLlJlbmRlcmVyU3R5bGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoXCJKc29uIERhdGEgT2JqZWN0IEVycm9yXCIpO1xuICAgIH1cbiAgfSxcbiAgX0NyZWF0ZVJvb3RSb3c6IGZ1bmN0aW9uIF9DcmVhdGVSb290Um93KHBhcmVudGpzb25Ob2RlLCBwYXJlbnRJZExpc3QpIHtcbiAgICB2YXIgcm93RWxlbSA9IHRoaXMuQ3JlYXRlUm93RWxlbShwYXJlbnRqc29uTm9kZSwgMCwgbnVsbCwgdHJ1ZSwgcGFyZW50SWRMaXN0KTtcblxuICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5hcHBlbmQocm93RWxlbSk7XG5cbiAgICB0aGlzLlNldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwocGFyZW50anNvbk5vZGUsIDApO1xuICAgIHRoaXMuU2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdChwYXJlbnRqc29uTm9kZSwgcGFyZW50SWRMaXN0KTtcbiAgfSxcbiAgX0xvb3BDcmVhdGVSb3c6IGZ1bmN0aW9uIF9Mb29wQ3JlYXRlUm93KHBhcmVudGpzb25Ob2RlLCBqc29uTm9kZUFycmF5LCBjdXJyZW50TGV2ZWwsIHBhcmVudElkTGlzdCkge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnLklzT3BlbkFMTDtcblxuICAgIGlmIChqc29uTm9kZUFycmF5ICE9IHVuZGVmaW5lZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uTm9kZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhciBpdGVtID0ganNvbk5vZGVBcnJheVtpXTtcblxuICAgICAgICB2YXIgcm93SXNPcGVuID0gdGhpcy5fVGVzdFJvd0lzT3BlbihjdXJyZW50TGV2ZWwpO1xuXG4gICAgICAgIHZhciByb3dJZCA9IHRoaXMuX0dldFJvd0RhdGFJZChpdGVtKTtcblxuICAgICAgICB2YXIgX3BJZExpc3QgPSB0aGlzLl9DcmVhdGVQYXJlbnRJZExpc3QocGFyZW50SWRMaXN0LCByb3dJZCk7XG5cbiAgICAgICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKGl0ZW0sIGN1cnJlbnRMZXZlbCk7XG4gICAgICAgIHRoaXMuU2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdChpdGVtLCBfcElkTGlzdCk7XG4gICAgICAgIHZhciByb3dFbGVtID0gdGhpcy5DcmVhdGVSb3dFbGVtKGl0ZW0sIGN1cnJlbnRMZXZlbCwgcGFyZW50anNvbk5vZGUsIHJvd0lzT3BlbiwgX3BJZExpc3QpO1xuXG4gICAgICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5hcHBlbmQocm93RWxlbSk7XG5cbiAgICAgICAgaWYgKGl0ZW0uTm9kZXMgIT0gdW5kZWZpbmVkICYmIGl0ZW0uTm9kZXMgIT0gbnVsbCAmJiBpdGVtLk5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICB2YXIgX3RwID0gY3VycmVudExldmVsICsgMTtcblxuICAgICAgICAgIHRoaXMuX0xvb3BDcmVhdGVSb3coaXRlbSwgaXRlbS5Ob2RlcywgX3RwLCBfcElkTGlzdCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIENyZWF0ZVRhYmxlOiBmdW5jdGlvbiBDcmVhdGVUYWJsZSgpIHtcbiAgICB2YXIgX0MgPSB0aGlzLl9Qcm9wX0NvbmZpZztcblxuICAgIHZhciBfZWRpdFRhYmxlID0gJChcIjx0YWJsZSAvPlwiKTtcblxuICAgIF9lZGl0VGFibGUuYWRkQ2xhc3MoX0MuVGFibGVDbGFzcyk7XG5cbiAgICBfZWRpdFRhYmxlLmF0dHIoXCJJZFwiLCBfQy5UYWJsZUlkKTtcblxuICAgIF9lZGl0VGFibGUuYXR0cihfQy5UYWJsZUF0dHJzKTtcblxuICAgIHJldHVybiBfZWRpdFRhYmxlO1xuICB9LFxuICBTZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsOiBmdW5jdGlvbiBTZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKGpzb25EYXRhLCB2YWx1ZSkge1xuICAgIGpzb25EYXRhLl9FeHRlbmRfQ3VycmVudExldmVsID0gdmFsdWU7XG4gIH0sXG4gIEdldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWw6IGZ1bmN0aW9uIEdldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwoanNvbkRhdGEpIHtcbiAgICByZXR1cm4ganNvbkRhdGEuX0V4dGVuZF9DdXJyZW50TGV2ZWw7XG4gIH0sXG4gIFNldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3Q6IGZ1bmN0aW9uIFNldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3QoanNvbkRhdGEsIHZhbHVlKSB7XG4gICAganNvbkRhdGEuX0V4dGVuZF9QYXJlbnRJZExpc3QgPSB2YWx1ZTtcbiAgfSxcbiAgR2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdDogZnVuY3Rpb24gR2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdChqc29uRGF0YSkge1xuICAgIHJldHVybiBqc29uRGF0YS5fRXh0ZW5kX1BhcmVudElkTGlzdDtcbiAgfSxcbiAgQ3JlYXRlVGFibGVUaXRsZVJvdzogZnVuY3Rpb24gQ3JlYXRlVGFibGVUaXRsZVJvdygpIHtcbiAgICB2YXIgX0MgPSB0aGlzLl9Qcm9wX0NvbmZpZztcblxuICAgIHZhciBfdGhlYWQgPSAkKFwiPHRoZWFkPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIGlzSGVhZGVyPSd0cnVlJyAvPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlwiKTtcblxuICAgIHZhciBfdGl0bGVSb3cgPSBfdGhlYWQuZmluZChcInRyXCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfQy5UZW1wbGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IF9DLlRlbXBsYXRlc1tpXTtcbiAgICAgIHZhciB0aXRsZSA9IHRlbXBsYXRlLlRpdGxlO1xuICAgICAgdmFyIHRoID0gJChcIjx0aD5cIiArIHRpdGxlICsgXCI8L3RoPlwiKTtcblxuICAgICAgaWYgKHRlbXBsYXRlLlRpdGxlQ2VsbENsYXNzTmFtZSkge1xuICAgICAgICB0aC5hZGRDbGFzcyh0ZW1wbGF0ZS5UaXRsZUNlbGxDbGFzc05hbWUpO1xuICAgICAgfVxuXG4gICAgICBpZiAodGVtcGxhdGUuVGl0bGVDZWxsQXR0cnMpIHtcbiAgICAgICAgdGguYXR0cih0ZW1wbGF0ZS5UaXRsZUNlbGxBdHRycyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuSGlkZGVuICE9ICd1bmRlZmluZWQnICYmIHRlbXBsYXRlLkhpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgIHRoLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRlbXBsYXRlLlN0eWxlKSB7XG4gICAgICAgIHRoLmNzcyh0ZW1wbGF0ZS5TdHlsZSk7XG4gICAgICB9XG5cbiAgICAgIF90aXRsZVJvdy5hcHBlbmQodGgpO1xuICAgIH1cblxuICAgIHJldHVybiBfdGhlYWQ7XG4gIH0sXG4gIENyZWF0ZVJvd0VsZW06IGZ1bmN0aW9uIENyZWF0ZVJvd0VsZW0ocm93RGF0YSwgY3VycmVudExldmVsLCBwYXJlbnRSb3dEYXRhLCByb3dJc09wZW4sIHBhcmVudElkTGlzdCkge1xuICAgIHZhciBfYyA9IHRoaXMuX1Byb3BfQ29uZmlnO1xuICAgIHZhciAkdHIgPSAkKFwiPHRyIC8+XCIpO1xuXG4gICAgdmFyIGVsZW1JZCA9IHRoaXMuX0NyZWF0ZUVsZW1JZChyb3dEYXRhKTtcblxuICAgIHZhciByb3dJZCA9IHRoaXMuX0dldFJvd0RhdGFJZChyb3dEYXRhKTtcblxuICAgIHZhciBwcm93SWQgPSB0aGlzLl9DcmVhdGVQYXJlbnRSb3dJZChwYXJlbnRSb3dEYXRhKTtcblxuICAgICR0ci5hdHRyKFwicm93SWRcIiwgcm93SWQpLmF0dHIoXCJwaWRcIiwgcHJvd0lkKS5hdHRyKFwiaWRcIiwgZWxlbUlkKS5hdHRyKFwiY3VycmVudExldmVsXCIsIGN1cnJlbnRMZXZlbCkuYXR0cihcImlzZGF0YXJvd1wiLCBcInRydWVcIik7XG4gICAgdmFyIF90ZXN0ZmllbGQgPSBfYy5DaGlsZFRlc3RGaWVsZDtcbiAgICB2YXIgaGFzQ2hpbGQgPSByb3dEYXRhW190ZXN0ZmllbGRdO1xuXG4gICAgaWYgKGhhc0NoaWxkID09IHRydWUgfHwgaGFzQ2hpbGQgPT0gXCJ0cnVlXCIgfHwgaGFzQ2hpbGQgPiAwKSB7XG4gICAgICAkdHIuYXR0cihcImhhc0NoaWxkXCIsIFwidHJ1ZVwiKTtcbiAgICB9XG5cbiAgICAkdHIuYXR0cihcInJvd0lzT3BlblwiLCByb3dJc09wZW4pLmF0dHIoXCJwYXJlbnRJZExpc3RcIiwgcGFyZW50SWRMaXN0KTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2MuVGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgX2NjID0gX2MuVGVtcGxhdGVzW2ldO1xuICAgICAgdmFyIF9jZCA9IHJvd0RhdGFbX2NjLkZpZWxkTmFtZV07XG4gICAgICB2YXIgX3dpZHRoID0gX2NjLldpZHRoO1xuICAgICAgdmFyIF9yZW5kZXJlciA9IF9jYy5SZW5kZXJlcjtcbiAgICAgIHZhciAkdGQgPSAkKFwiPHRkIGJpbmRGaWVsZD1cXFwiXCIgKyBfY2MuRmllbGROYW1lICsgXCJcXFwiIFJlbmRlcmVyPSdcIiArIF9yZW5kZXJlciArIFwiJz5cIiArIF9jZCArIFwiPC90ZD5cIikuY3NzKFwid2lkdGhcIiwgX3dpZHRoKTtcblxuICAgICAgaWYgKF9yZW5kZXJlciA9PSBcIkRhdGVUaW1lXCIpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShfY2QpO1xuICAgICAgICB2YXIgZGF0ZVN0ciA9IERhdGVVdGlsaXR5LkZvcm1hdChkYXRlLCAneXl5eS1NTS1kZCcpO1xuICAgICAgICAkdGQudGV4dChkYXRlU3RyKTtcbiAgICAgIH1cblxuICAgICAgaWYgKF9jYy5UZXh0QWxpZ24pIHtcbiAgICAgICAgJHRkLmNzcyhcInRleHRBbGlnblwiLCBfY2MuVGV4dEFsaWduKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGkgPT0gMCkge31cblxuICAgICAgaWYgKHR5cGVvZiBfY2MuSGlkZGVuICE9ICd1bmRlZmluZWQnICYmIF9jYy5IaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICAkdGQuaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIF9jYy5TdHlsZSAhPSAndW5kZWZpbmVkJykge1xuICAgICAgICAkdGQuY3NzKF9jYy5TdHlsZSk7XG4gICAgICB9XG5cbiAgICAgICR0ci5hcHBlbmQoJHRkKTtcbiAgICB9XG5cbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgJHRyLmJpbmQoXCJjbGlja1wiLCBudWxsLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICQoXCIudHItc2VsZWN0ZWRcIikucmVtb3ZlQ2xhc3MoXCJ0ci1zZWxlY3RlZFwiKTtcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJ0ci1zZWxlY3RlZFwiKTtcbiAgICAgIF9zZWxmLl9Qcm9wX0N1cnJlbnRTZWxlY3RlZFJvd0lkID0gJCh0aGlzKS5hdHRyKFwicm93SWRcIik7XG5cbiAgICAgIGlmICh0eXBlb2YgX2MuQ2xpY2tSb3dFdmVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIF9jLkNsaWNrUm93RXZlbnQgPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBfYy5DbGlja1Jvd0V2ZW50KHJvd0lkKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICAkdHIuaG92ZXIoZnVuY3Rpb24gKCkge1xuICAgICAgaWYgKCEkKHRoaXMpLmhhc0NsYXNzKFwidHItc2VsZWN0ZWRcIikpIHtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcInRyLWhvdmVyXCIpO1xuICAgICAgfVxuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICQoXCIudHItaG92ZXJcIikucmVtb3ZlQ2xhc3MoXCJ0ci1ob3ZlclwiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gJHRyO1xuICB9LFxuICBfVGVzdFJvd0lzT3BlbjogZnVuY3Rpb24gX1Rlc3RSb3dJc09wZW4oY3VycmVudExldmVsKSB7XG4gICAgaWYgKHRoaXMuX1Byb3BfQ29uZmlnLk9wZW5MZXZlbCA+IGN1cnJlbnRMZXZlbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBfQ3JlYXRlRWxlbUlkOiBmdW5jdGlvbiBfQ3JlYXRlRWxlbUlkKHJvd0RhdGEpIHtcbiAgICB2YXIgcm93SWRQcmVmaXggPSBcIlwiO1xuXG4gICAgaWYgKHRoaXMuX1Byb3BfQ29uZmlnLlJvd0lkUHJlZml4ICE9IHVuZGVmaW5lZCAmJiB0aGlzLl9Qcm9wX0NvbmZpZy5Sb3dJZFByZWZpeCAhPSB1bmRlZmluZWQgIT0gbnVsbCkge1xuICAgICAgcm93SWRQcmVmaXggPSB0aGlzLl9Qcm9wX0NvbmZpZy5Sb3dJZFByZWZpeDtcbiAgICB9XG5cbiAgICByZXR1cm4gcm93SWRQcmVmaXggKyB0aGlzLl9HZXRSb3dEYXRhSWQocm93RGF0YSk7XG4gIH0sXG4gIF9DcmVhdGVQYXJlbnRJZExpc3Q6IGZ1bmN0aW9uIF9DcmVhdGVQYXJlbnRJZExpc3QocGFyZW50SWRMaXN0LCByb3dJZCkge1xuICAgIHJldHVybiBwYXJlbnRJZExpc3QgKyBcIuKAu1wiICsgcm93SWQ7XG4gIH0sXG4gIF9DcmVhdGVQYXJlbnRJZExpc3RCeVBhcmVudEpzb25EYXRhOiBmdW5jdGlvbiBfQ3JlYXRlUGFyZW50SWRMaXN0QnlQYXJlbnRKc29uRGF0YShwYXJlbnRKc29uRGF0YSwgc2VsZkpzb25EYXRhKSB7XG4gICAgdmFyIHBhcmVudElkTGlzdCA9IHRoaXMuR2V0SnNvbkRhdGFFeHRlbmRBdHRyX1BhcmVudElkTGlzdChwYXJlbnRKc29uRGF0YSk7XG5cbiAgICB2YXIgcm93SWQgPSB0aGlzLl9HZXRSb3dEYXRhSWQoc2VsZkpzb25EYXRhKTtcblxuICAgIHJldHVybiB0aGlzLl9DcmVhdGVQYXJlbnRJZExpc3QocGFyZW50SWRMaXN0LCByb3dJZCk7XG4gIH0sXG4gIF9HZXRSb3dEYXRhSWQ6IGZ1bmN0aW9uIF9HZXRSb3dEYXRhSWQocm93RGF0YSkge1xuICAgIHZhciBpZEZpZWxkID0gdGhpcy5fUHJvcF9Db25maWcuSWRGaWVsZDtcblxuICAgIGlmIChyb3dEYXRhW2lkRmllbGRdICE9IHVuZGVmaW5lZCAmJiByb3dEYXRhW2lkRmllbGRdICE9IG51bGwpIHtcbiAgICAgIHJldHVybiByb3dEYXRhW2lkRmllbGRdO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbGVydChcIuWcqOaVsOaNrua6kOS4reaJvuS4jeWIsOeUqOS6juaehOW7uklk55qE5a2X5q6177yM6K+35qOA5p+l6YWN572u5Y+K5pWw5o2u5rqQXCIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LFxuICBfQ3JlYXRlUGFyZW50Um93SWQ6IGZ1bmN0aW9uIF9DcmVhdGVQYXJlbnRSb3dJZChwYXJlbnRSb3dEYXRhKSB7XG4gICAgaWYgKHBhcmVudFJvd0RhdGEgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIFwiUm9vdFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fR2V0Um93RGF0YUlkKHBhcmVudFJvd0RhdGEpO1xuICAgIH1cbiAgfSxcbiAgUmVuZGVyZXJTdHlsZTogZnVuY3Rpb24gUmVuZGVyZXJTdHlsZSgpIHtcbiAgICB2YXIgX3NlbGYgPSB0aGlzO1xuXG4gICAgJChcInRyW2lzZGF0YXJvdz0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0ciA9ICQodGhpcyk7XG4gICAgICB2YXIgJGZpcnN0dGQgPSAkKHRoaXMpLmZpbmQoXCJ0ZDpmaXJzdFwiKTtcbiAgICAgIHZhciByb3dpZCA9ICR0ci5hdHRyKFwicm93SWRcIik7XG4gICAgICB2YXIgc291cmNlVGV4dCA9ICRmaXJzdHRkLnRleHQoKTtcbiAgICAgICRmaXJzdHRkLmNzcyhcInBhZGRpbmctbGVmdFwiLCBfc2VsZi5fUHJvcF9GaXJzdENvbHVtbl9JbmRlbiAqIHBhcnNlSW50KCQodGhpcykuYXR0cihcImN1cnJlbnRMZXZlbFwiKSkpO1xuICAgICAgdmFyIGhhc0NoaWxkID0gZmFsc2U7XG5cbiAgICAgIGlmICgkdHIuYXR0cihcImhhc0NoaWxkXCIpID09IFwidHJ1ZVwiKSB7XG4gICAgICAgIGhhc0NoaWxkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHJvd0lzT3BlbiA9IGZhbHNlO1xuXG4gICAgICBpZiAoJHRyLmF0dHIoXCJyb3dJc09wZW5cIikgPT0gXCJ0cnVlXCIpIHtcbiAgICAgICAgcm93SXNPcGVuID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHN3aXRjaEVsZW0gPSBfc2VsZi5fQ3JlYXRlUm93U3dpdGNoRWxlbShoYXNDaGlsZCwgcm93SXNPcGVuLCByb3dpZCk7XG5cbiAgICAgICRmaXJzdHRkLmh0bWwoXCJcIik7XG4gICAgICAkZmlyc3R0ZC5hcHBlbmQoc3dpdGNoRWxlbSkuYXBwZW5kKFwiPHNwYW4+XCIgKyBzb3VyY2VUZXh0ICsgXCI8L3NwYW4+XCIpO1xuXG4gICAgICBpZiAoIXJvd0lzT3Blbikge1xuICAgICAgICAkKFwidHJbcGlkPSdcIiArIHJvd2lkICsgXCInXVwiKS5oaWRlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIF9HZXRJbmRlbkNsYXNzOiBmdW5jdGlvbiBfR2V0SW5kZW5DbGFzcyhoYXNDaGlsZCwgaXNPcGVuKSB7XG4gICAgaWYgKGhhc0NoaWxkICYmIGlzT3Blbikge1xuICAgICAgcmV0dXJuIFwiaW1nLXN3aXRjaC1vcGVuXCI7XG4gICAgfVxuXG4gICAgaWYgKGhhc0NoaWxkICYmICFpc09wZW4pIHtcbiAgICAgIHJldHVybiBcImltZy1zd2l0Y2gtY2xvc2VcIjtcbiAgICB9XG5cbiAgICBpZiAoIWhhc0NoaWxkKSB7XG4gICAgICByZXR1cm4gXCJpbWctc3dpdGNoLW9wZW5cIjtcbiAgICB9XG5cbiAgICByZXR1cm4gXCJpbWctc3dpdGNoLWNsb3NlXCI7XG4gIH0sXG4gIF9DcmVhdGVSb3dTd2l0Y2hFbGVtOiBmdW5jdGlvbiBfQ3JlYXRlUm93U3dpdGNoRWxlbShoYXNDaGlsZCwgaXNPcGVuLCByb3dJZCkge1xuICAgIHZhciBlbGVtID0gJChcIjxkaXYgaXNzd2l0Y2g9XFxcInRydWVcXFwiPjwvZGl2PlwiKTtcblxuICAgIHZhciBjbHMgPSB0aGlzLl9HZXRJbmRlbkNsYXNzKGhhc0NoaWxkLCBpc09wZW4pO1xuXG4gICAgZWxlbS5hZGRDbGFzcyhjbHMpO1xuICAgIHZhciBzZW5kZGF0YSA9IHtcbiAgICAgIFJvd0lkOiByb3dJZFxuICAgIH07XG4gICAgZWxlbS5iaW5kKFwiY2xpY2tcIiwgc2VuZGRhdGEsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgaWYgKCFoYXNDaGlsZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpO1xuICAgICAgdmFyIHJvd2lkID0gJHRyLmF0dHIoXCJyb3dJZFwiKTtcbiAgICAgIHZhciByb3dJc09wZW4gPSBmYWxzZTtcblxuICAgICAgaWYgKCR0ci5hdHRyKFwicm93SXNPcGVuXCIpID09IFwidHJ1ZVwiKSB7XG4gICAgICAgIHJvd0lzT3BlbiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyb3dJc09wZW4pIHtcbiAgICAgICAgcm93SXNPcGVuID0gZmFsc2U7XG4gICAgICAgICQoXCJ0cltwYXJlbnRJZExpc3QqPSdcIiArIHJvd2lkICsgXCLigLsnXVwiKS5oaWRlKCk7XG4gICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJpbWctc3dpdGNoLW9wZW5cIikuYWRkQ2xhc3MoXCJpbWctc3dpdGNoLWNsb3NlXCIpO1xuICAgICAgICAkKFwidHJbcGFyZW50SWRMaXN0Kj0nXCIgKyByb3dpZCArIFwi4oC7J11baGFzY2hpbGQ9J3RydWUnXVwiKS5maW5kKFwiW2lzc3dpdGNoPSd0cnVlJ11cIikucmVtb3ZlQ2xhc3MoXCJpbWctc3dpdGNoLW9wZW5cIikuYWRkQ2xhc3MoXCJpbWctc3dpdGNoLWNsb3NlXCIpO1xuICAgICAgICAkKFwidHJbcGFyZW50SWRMaXN0Kj0nXCIgKyByb3dpZCArIFwi4oC7J11baGFzY2hpbGQ9J3RydWUnXVwiKS5hdHRyKFwicm93aXNvcGVuXCIsIGZhbHNlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvd0lzT3BlbiA9IHRydWU7XG4gICAgICAgICQoXCJ0cltwaWQ9J1wiICsgcm93aWQgKyBcIiddXCIpLnNob3coKTtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcyhcImltZy1zd2l0Y2gtY2xvc2VcIikuYWRkQ2xhc3MoXCJpbWctc3dpdGNoLW9wZW5cIik7XG4gICAgICB9XG5cbiAgICAgICR0ci5hdHRyKFwicm93SXNPcGVuXCIsIHJvd0lzT3Blbik7XG4gICAgfSk7XG4gICAgcmV0dXJuIGVsZW07XG4gIH0sXG4gIEdldENoaWxkc1Jvd0VsZW06IGZ1bmN0aW9uIEdldENoaWxkc1Jvd0VsZW0obG9vcCwgaWQpIHtcbiAgICBpZiAobG9vcCkge1xuICAgICAgcmV0dXJuICQoXCJ0cltwYXJlbnRJZExpc3QqPSdcIiArIGlkICsgXCInXVwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICQoXCJ0cltwaWQ9J1wiICsgaWQgKyBcIiddXCIpO1xuICAgIH1cbiAgfSxcbiAgX1Byb3BfU2VsZWN0ZWRSb3dEYXRhOiBudWxsLFxuICBfUHJvcF9UZW1wR2V0Um93RGF0YTogbnVsbCxcbiAgX0dldFNlbGVjdGVkUm93RGF0YTogZnVuY3Rpb24gX0dldFNlbGVjdGVkUm93RGF0YShub2RlLCBpZCwgaXNTZXRTZWxlY3RlZCkge1xuICAgIHZhciBmaWVsZE5hbWUgPSB0aGlzLl9Qcm9wX0NvbmZpZy5JZEZpZWxkO1xuICAgIHZhciBmaWVsZFZhbHVlID0gbm9kZVtmaWVsZE5hbWVdO1xuXG4gICAgaWYgKGZpZWxkVmFsdWUgPT0gaWQpIHtcbiAgICAgIGlmIChpc1NldFNlbGVjdGVkKSB7XG4gICAgICAgIHRoaXMuX1Byb3BfU2VsZWN0ZWRSb3dEYXRhID0gbm9kZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX1Byb3BfVGVtcEdldFJvd0RhdGEgPSBub2RlO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAobm9kZS5Ob2RlcyAhPSB1bmRlZmluZWQgJiYgbm9kZS5Ob2RlcyAhPSBudWxsKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbm9kZS5Ob2Rlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHRoaXMuX0dldFNlbGVjdGVkUm93RGF0YShub2RlLk5vZGVzW2ldLCBpZCwgaXNTZXRTZWxlY3RlZCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIEdldFNlbGVjdGVkUm93RGF0YTogZnVuY3Rpb24gR2V0U2VsZWN0ZWRSb3dEYXRhKCkge1xuICAgIGlmICh0aGlzLl9Qcm9wX0N1cnJlbnRTZWxlY3RlZFJvd0lkID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuX0dldFNlbGVjdGVkUm93RGF0YSh0aGlzLl9Qcm9wX0pzb25EYXRhLCB0aGlzLl9Qcm9wX0N1cnJlbnRTZWxlY3RlZFJvd0lkLCB0cnVlKTtcblxuICAgIHJldHVybiB0aGlzLl9Qcm9wX1NlbGVjdGVkUm93RGF0YTtcbiAgfSxcbiAgR2V0Um93RGF0YUJ5Um93SWQ6IGZ1bmN0aW9uIEdldFJvd0RhdGFCeVJvd0lkKHJvd0lkKSB7XG4gICAgdGhpcy5fUHJvcF9UZW1wR2V0Um93RGF0YSA9IG51bGw7XG5cbiAgICB0aGlzLl9HZXRTZWxlY3RlZFJvd0RhdGEodGhpcy5fUHJvcF9Kc29uRGF0YSwgcm93SWQsIGZhbHNlKTtcblxuICAgIHJldHVybiB0aGlzLl9Qcm9wX1RlbXBHZXRSb3dEYXRhO1xuICB9LFxuICBBcHBlbmRDaGlsZFJvd1RvQ3VycmVudFNlbGVjdGVkUm93OiBmdW5jdGlvbiBBcHBlbmRDaGlsZFJvd1RvQ3VycmVudFNlbGVjdGVkUm93KHJvd0RhdGEpIHtcbiAgICB2YXIgc2VsZWN0ZWRSb3dEYXRhID0gdGhpcy5HZXRTZWxlY3RlZFJvd0RhdGEoKTtcblxuICAgIGlmIChzZWxlY3RlZFJvd0RhdGEuTm9kZXMgIT0gdW5kZWZpbmVkICYmIHNlbGVjdGVkUm93RGF0YS5Ob2RlcyAhPSBudWxsKSB7XG4gICAgICBzZWxlY3RlZFJvd0RhdGEuTm9kZXMucHVzaChyb3dEYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2VsZWN0ZWRSb3dEYXRhLk5vZGVzID0gbmV3IEFycmF5KCk7XG4gICAgICBzZWxlY3RlZFJvd0RhdGEuTm9kZXMucHVzaChyb3dEYXRhKTtcbiAgICB9XG5cbiAgICB0aGlzLlNldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwocm93RGF0YSwgdGhpcy5HZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKHNlbGVjdGVkUm93RGF0YSkgKyAxKTtcbiAgICB0aGlzLlNldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3Qocm93RGF0YSwgdGhpcy5fQ3JlYXRlUGFyZW50SWRMaXN0QnlQYXJlbnRKc29uRGF0YShzZWxlY3RlZFJvd0RhdGEsIHJvd0RhdGEpKTtcbiAgICB2YXIgJHRyID0gdGhpcy5DcmVhdGVSb3dFbGVtKHJvd0RhdGEsIHRoaXMuR2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChzZWxlY3RlZFJvd0RhdGEpICsgMSwgc2VsZWN0ZWRSb3dEYXRhLCB0cnVlLCB0aGlzLkdldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3Qocm93RGF0YSkpO1xuXG4gICAgdmFyIHNlbGVjdGVkUm93SWQgPSB0aGlzLl9HZXRSb3dEYXRhSWQoc2VsZWN0ZWRSb3dEYXRhKTtcblxuICAgIHZhciBjdXJyZW50U2VsZWN0RWxlbSA9ICQoXCJ0cltyb3dJZD0nXCIgKyBzZWxlY3RlZFJvd0lkICsgXCInXVwiKTtcbiAgICBjdXJyZW50U2VsZWN0RWxlbS5hdHRyKFwiaGFzY2hpbGRcIiwgXCJ0cnVlXCIpO1xuICAgIHZhciBsYXN0Q2hpbGRzID0gJChcInRyW3BhcmVudGlkbGlzdCo9J1wiICsgc2VsZWN0ZWRSb3dJZCArIFwi4oC7J106bGFzdFwiKTtcblxuICAgIGlmIChsYXN0Q2hpbGRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxhc3RDaGlsZHMuYWZ0ZXIoJHRyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY3VycmVudFNlbGVjdEVsZW0uYXR0cihcInJvd2lzb3BlblwiLCB0cnVlKTtcbiAgICAgIGN1cnJlbnRTZWxlY3RFbGVtLmFmdGVyKCR0cik7XG4gICAgfVxuXG4gICAgdGhpcy5SZW5kZXJlclN0eWxlKCk7XG4gIH0sXG4gIFVwZGF0ZVRvUm93OiBmdW5jdGlvbiBVcGRhdGVUb1Jvdyhyb3dJZCwgcm93RGF0YSkge1xuICAgIHZhciBzZWxlY3RlZFJvd0RhdGEgPSB0aGlzLkdldFJvd0RhdGFCeVJvd0lkKHJvd0lkKTtcblxuICAgIGZvciAodmFyIGF0dHJOYW1lIGluIHJvd0RhdGEpIHtcbiAgICAgIGlmIChhdHRyTmFtZSAhPSBcIk5vZGVzXCIpIHtcbiAgICAgICAgc2VsZWN0ZWRSb3dEYXRhW2F0dHJOYW1lXSA9IHJvd0RhdGFbYXR0ck5hbWVdO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciByb3dJZCA9IHRoaXMuX0dldFJvd0RhdGFJZChzZWxlY3RlZFJvd0RhdGEpO1xuXG4gICAgdmFyICR0ciA9ICQoXCJ0cltyb3dpZD0nXCIgKyByb3dJZCArIFwiJ11cIik7XG4gICAgJHRyLmZpbmQoXCJ0ZFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBiaW5kRmllbGQgPSAkKHRoaXMpLmF0dHIoXCJiaW5kRmllbGRcIik7XG4gICAgICB2YXIgbmV3dGV4dCA9IHNlbGVjdGVkUm93RGF0YVtiaW5kRmllbGRdO1xuICAgICAgdmFyIHJlbmRlcmVyID0gJCh0aGlzKS5hdHRyKFwiUmVuZGVyZXJcIik7XG5cbiAgICAgIGlmIChyZW5kZXJlciA9PSBcIkRhdGVUaW1lXCIpIHtcbiAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShuZXd0ZXh0KTtcbiAgICAgICAgbmV3dGV4dCA9IERhdGVVdGlsaXR5LkZvcm1hdChkYXRlLCAneXl5eS1NTS1kZCcpO1xuICAgICAgfVxuXG4gICAgICBpZiAoJCh0aGlzKS5maW5kKFwiW2lzc3dpdGNoPSd0cnVlJ11cIikubGVuZ3RoID4gMCkge1xuICAgICAgICAkKHRoaXMpLmZpbmQoXCJzcGFuXCIpLnRleHQobmV3dGV4dCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKHRoaXMpLnRleHQobmV3dGV4dCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIExvYWRDaGlsZEJ5QWpheDogZnVuY3Rpb24gTG9hZENoaWxkQnlBamF4KCkge30sXG4gIERlbGV0ZVJvdzogZnVuY3Rpb24gRGVsZXRlUm93KHJvd0lkKSB7XG4gICAgdmFyIGhhc0NoaWxkID0gZmFsc2U7XG5cbiAgICBpZiAoJChcInRyW3BpZD0nXCIgKyByb3dJZCArIFwiJ11cIikubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKCF0aGlzLl9Qcm9wX0NvbmZpZy5DYW5EZWxldGVXaGVuSGFzQ2hpbGQpIHtcbiAgICAgICAgYWxlcnQoXCLmjIflrprnmoToioLngrnlrZjlnKjlrZDoioLngrnvvIzor7flhYjliKDpmaTlrZDoioLngrnvvIFcIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgJChcInRyW3BhcmVudGlkbGlzdCo9J+KAu1wiICsgcm93SWQgKyBcIiddXCIpLnJlbW92ZSgpO1xuICAgIHRoaXMuX1Byb3BfQ3VycmVudFNlbGVjdGVkUm93SWQgPSBudWxsO1xuICB9LFxuICBNb3ZlVXBSb3c6IGZ1bmN0aW9uIE1vdmVVcFJvdyhyb3dJZCkge1xuICAgIHZhciB0aGlzdHIgPSAkKFwidHJbcm93aWQ9J1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgIHZhciBwaWQgPSB0aGlzdHIuYXR0cihcInBpZFwiKTtcbiAgICB2YXIgbmVhcnRyID0gJCh0aGlzdHIucHJldkFsbChcIltwaWQ9J1wiICsgcGlkICsgXCInXVwiKVswXSk7XG4gICAgdmFyIG1vdmV0cnMgPSAkKFwidHJbcGFyZW50aWRsaXN0Kj0n4oC7XCIgKyByb3dJZCArIFwiJ11cIik7XG4gICAgbW92ZXRycy5pbnNlcnRCZWZvcmUobmVhcnRyKTtcbiAgfSxcbiAgTW92ZURvd25Sb3c6IGZ1bmN0aW9uIE1vdmVEb3duUm93KHJvd0lkKSB7XG4gICAgdmFyIHRoaXN0ciA9ICQoXCJ0cltyb3dpZD0nXCIgKyByb3dJZCArIFwiJ11cIik7XG4gICAgdmFyIHBpZCA9IHRoaXN0ci5hdHRyKFwicGlkXCIpO1xuICAgIHZhciBuZWFydHIgPSAkKHRoaXN0ci5uZXh0QWxsKFwiW3BpZD0nXCIgKyBwaWQgKyBcIiddXCIpWzBdKTtcbiAgICB2YXIgbmVhcnRycmlkID0gbmVhcnRyLmF0dHIoXCJyb3dpZFwiKTtcbiAgICB2YXIgb2ZmdHJzID0gJChcInRyW3BhcmVudGlkbGlzdCo9J+KAu1wiICsgbmVhcnRycmlkICsgXCInXVwiKTtcbiAgICB2YXIgb2ZmbGFzdHRyID0gJChvZmZ0cnNbb2ZmdHJzLmxlbmd0aCAtIDFdKTtcbiAgICB2YXIgbW92ZXRycyA9ICQoXCJ0cltwYXJlbnRpZGxpc3QqPSfigLtcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICBtb3ZldHJzLmluc2VydEFmdGVyKG9mZmxhc3R0cik7XG4gIH0sXG4gIEdldEJyb3RoZXJzTm9kZURhdGFzQnlQYXJlbnRJZDogZnVuY3Rpb24gR2V0QnJvdGhlcnNOb2RlRGF0YXNCeVBhcmVudElkKHJvd0lkKSB7XG4gICAgdmFyIHRoaXN0ciA9ICQoXCJ0cltyb3dpZD0nXCIgKyByb3dJZCArIFwiJ11cIik7XG4gICAgdmFyIHBpZCA9IHRoaXN0ci5hdHRyKFwicGlkXCIpO1xuICAgIHZhciBicm90aGVyc3RyID0gJCh0aGlzdHIucGFyZW50KCkuZmluZChcIltwaWQ9J1wiICsgcGlkICsgXCInXVwiKSk7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBicm90aGVyc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXN1bHQucHVzaCh0aGlzLkdldFJvd0RhdGFCeVJvd0lkKCQoYnJvdGhlcnN0cltpXSkuYXR0cihcInJvd2lkXCIpKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgUmVtb3ZlQWxsUm93OiBmdW5jdGlvbiBSZW1vdmVBbGxSb3coKSB7XG4gICAgaWYgKHRoaXMuXyRQcm9wX1RhYmxlRWxlbSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uZmluZChcInRyOm5vdCg6Zmlyc3QpXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59OyJdfQ==
