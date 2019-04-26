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

        if (!bindText) {
          bindText = "";
        }

        if (bindText == "undefined") {
          bindText = "";
        }

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

    if (configSource[0].Group) {
      for (var i = 0; i < configSource.length; i++) {
        var optgroup = $("<optgroup />");
        optgroup.attr("label", configSource[i].Group);

        if (configSource[i].Options) {
          for (var j = 0; j < configSource[i].Options.length; j++) {
            var option = $("<option />");
            option.attr("value", configSource[i].Options[j].Value);
            option.attr("text", configSource[i].Options[j].Text);
            option.text(configSource[i].Options[j].Text);
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
      if (window.tableDesion) {
        tableDesion.selectDefaultValueDialogBegin(EditTable_SelectDefaultValue, null);
      } else {
        window.parent.listDesign.selectDefaultValueDialogBegin(window, null);
        window._SelectBindObj = {
          setSelectEnvVariableResultValue: function setSelectEnvVariableResultValue(result) {
            EditTable_SelectDefaultValue.setSelectEnvVariableResultValue(result);
          }
        };
      }
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkpzL0NvbmZpZy5qcyIsIkpzL0VkaXRUYWJsZS5qcyIsIkpzL1JlbmRlcmVycy9FZGl0VGFibGVfQ2hlY2tCb3guanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX0Zvcm1hdHRlci5qcyIsIkpzL1JlbmRlcmVycy9FZGl0VGFibGVfTGFiZWwuanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX1JhZGlvLmpzIiwiSnMvUmVuZGVyZXJzL0VkaXRUYWJsZV9TZWxlY3QuanMiLCJKcy9SZW5kZXJlcnMvRWRpdFRhYmxlX1NlbGVjdFJvd0NoZWNrQm94LmpzIiwiSnMvUmVuZGVyZXJzL0VkaXRUYWJsZV9UZXh0Qm94LmpzIiwiSnMvUmVuZGVyZXJzL0RhdGFTZXQvQ29sdW1uX1NlbGVjdERlZmF1bHRWYWx1ZS5qcyIsIkpzL1JlbmRlcmVycy9EYXRhU2V0L0NvbHVtbl9TZWxlY3RGaWVsZFR5cGUuanMiLCJKcy9SZW5kZXJlcnMvVGFibGVEZXNpZ24vRWRpdFRhYmxlX0ZpZWxkTmFtZS5qcyIsIkpzL1JlbmRlcmVycy9UYWJsZURlc2lnbi9FZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlLmpzIiwiSnMvUmVuZGVyZXJzL1RhYmxlRGVzaWduL0VkaXRUYWJsZV9TZWxlY3RGaWVsZFR5cGUuanMiLCJkZW1vL1RyZWVUYWJsZUNvbmZpZy5qcyIsIkpzL1RyZWVUYWJsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6IlVJRVhDb21wb25lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuaWYgKCFPYmplY3QuY3JlYXRlKSB7XG4gIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRigpIHt9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPYmplY3QuY3JlYXRlIGltcGxlbWVudGF0aW9uIG9ubHkgYWNjZXB0cyBvbmUgcGFyYW1ldGVyLicpO1xuICAgICAgfVxuXG4gICAgICBGLnByb3RvdHlwZSA9IG87XG4gICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICB9O1xuICB9KCk7XG59XG5cbnZhciBFZGl0VGFibGVDb25maWcgPSB7XG4gIFN0YXR1czogXCJFZGl0XCIsXG4gIFRlbXBsYXRlczogW3tcbiAgICBUaXRsZTogXCLooajlkI0xXCIsXG4gICAgRmllbGROYW1lOiBcIlRhYmxlRmllbGRcIixcbiAgICBSZW5kZXJlcjogXCJFZGl0VGFibGVfVGV4dEJveFwiLFxuICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fVxuICB9LCB7XG4gICAgVGl0bGU6IFwi5a2X5q6157G75Z6LXCIsXG4gICAgRmllbGROYW1lOiBcIlRhYmxlRmllbGRcIixcbiAgICBSZW5kZXJlcjogXCJFZGl0VGFibGVfVGV4dEJveFwiLFxuICAgIEhpZGRlbjogZmFsc2VcbiAgfSwge1xuICAgIFRpdGxlOiBcIuWkh+azqFwiLFxuICAgIEZpZWxkTmFtZTogXCJUYWJsZUZpZWxkXCIsXG4gICAgUmVuZGVyZXI6IFwiRWRpdFRhYmxlX1RleHRCb3hcIixcbiAgICBIaWRkZW46IGZhbHNlXG4gIH1dLFxuICBSb3dJZENyZWF0ZXI6IGZ1bmN0aW9uIFJvd0lkQ3JlYXRlcigpIHt9LFxuICBUYWJsZUNsYXNzOiBcIkVkaXRUYWJsZVwiLFxuICBSZW5kZXJlclRvOiBcImRpdlRyZWVUYWJsZVwiLFxuICBUYWJsZUlkOiBcIkVkaXRUYWJsZVwiLFxuICBUYWJsZUF0dHJzOiB7XG4gICAgY2VsbHBhZGRpbmc6IFwiMVwiLFxuICAgIGNlbGxzcGFjaW5nOiBcIjFcIixcbiAgICBib3JkZXI6IFwiMVwiXG4gIH1cbn07XG52YXIgRWRpdFRhYmxlRGF0YSA9IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlID0ge1xuICBfJFByb3BfVGFibGVFbGVtOiBudWxsLFxuICBfJFByb3BfUmVuZGVyZXJUb0VsZW06IG51bGwsXG4gIF9Qcm9wX0NvbmZpZ01hbmFnZXI6IG51bGwsXG4gIF9Qcm9wX0pzb25EYXRhOiBuZXcgT2JqZWN0KCksXG4gIF8kUHJvcF9FZGl0aW5nUm93RWxlbTogbnVsbCxcbiAgX1N0YXR1czogXCJFZGl0XCIsXG4gIEluaXRpYWxpemF0aW9uOiBmdW5jdGlvbiBJbml0aWFsaXphdGlvbihfY29uZmlnKSB7XG4gICAgdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyID0gT2JqZWN0LmNyZWF0ZShFZGl0VGFibGVDb25maWdNYW5hZ2VyKTtcblxuICAgIHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5Jbml0aWFsaXphdGlvbkNvbmZpZyhfY29uZmlnKTtcblxuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgIHRoaXMuXyRQcm9wX1JlbmRlcmVyVG9FbGVtID0gJChcIiNcIiArIF9DLlJlbmRlcmVyVG8pO1xuICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbSA9IHRoaXMuQ3JlYXRlVGFibGUoKTtcblxuICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5hcHBlbmQodGhpcy5DcmVhdGVUYWJsZVRpdGxlUm93KCkpO1xuXG4gICAgdGhpcy5fJFByb3BfUmVuZGVyZXJUb0VsZW0uYXBwZW5kKHRoaXMuXyRQcm9wX1RhYmxlRWxlbSk7XG5cbiAgICBpZiAoX0MuU3RhdHVzKSB7XG4gICAgICB0aGlzLl9TdGF0dXMgPSBfQy5TdGF0dXM7XG4gICAgfVxuICB9LFxuICBMb2FkSnNvbkRhdGE6IGZ1bmN0aW9uIExvYWRKc29uRGF0YShqc29uRGF0YSkge1xuICAgIGlmIChqc29uRGF0YSAhPSBudWxsICYmIGpzb25EYXRhICE9IHVuZGVmaW5lZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBqc29uRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IGpzb25EYXRhW2ldO1xuICAgICAgICB2YXIgcm93SWQgPSB0aGlzLkFkZEVkaXRpbmdSb3dCeVRlbXBsYXRlKGpzb25EYXRhLCBpdGVtKTtcbiAgICAgICAgdGhpcy5fUHJvcF9Kc29uRGF0YVtyb3dJZF0gPSBpdGVtO1xuICAgICAgfVxuXG4gICAgICB0aGlzLkNvbXBsZXRlZEVkaXRpbmdSb3coKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoXCJKc29uIERhdGEgT2JqZWN0IEVycm9yXCIpO1xuICAgIH1cbiAgfSxcbiAgQ3JlYXRlVGFibGU6IGZ1bmN0aW9uIENyZWF0ZVRhYmxlKCkge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgIHZhciBfZWRpdFRhYmxlID0gJChcIjx0YWJsZSAvPlwiKTtcblxuICAgIF9lZGl0VGFibGUuYWRkQ2xhc3MoX0MuVGFibGVDbGFzcyk7XG5cbiAgICBfZWRpdFRhYmxlLmF0dHIoXCJJZFwiLCBfQy5UYWJsZUlkKTtcblxuICAgIF9lZGl0VGFibGUuYXR0cihfQy5UYWJsZUF0dHJzKTtcblxuICAgIHJldHVybiBfZWRpdFRhYmxlO1xuICB9LFxuICBDcmVhdGVUYWJsZVRpdGxlUm93OiBmdW5jdGlvbiBDcmVhdGVUYWJsZVRpdGxlUm93KCkge1xuICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgIHZhciBfdGl0bGVSb3cgPSAkKFwiPHRyIGlzSGVhZGVyPSd0cnVlJyAvPlwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX0MuVGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfQy5UZW1wbGF0ZXNbaV07XG4gICAgICB2YXIgdGl0bGUgPSB0ZW1wbGF0ZS5UaXRsZTtcbiAgICAgIHZhciB0aCA9ICQoXCI8dGg+XCIgKyB0aXRsZSArIFwiPC90aD5cIik7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5UaXRsZUNlbGxDbGFzc05hbWUpIHtcbiAgICAgICAgdGguYWRkQ2xhc3ModGVtcGxhdGUuVGl0bGVDZWxsQ2xhc3NOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRlbXBsYXRlLlRpdGxlQ2VsbEF0dHJzKSB7XG4gICAgICAgIHRoLmF0dHIodGVtcGxhdGUuVGl0bGVDZWxsQXR0cnMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiB0ZW1wbGF0ZS5IaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICB0aC5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIF90aXRsZVJvdy5hcHBlbmQodGgpO1xuICAgIH1cblxuICAgIHZhciBfdGl0bGVSb3dIZWFkID0gJChcIjx0aGVhZD48L3RoZWFkPlwiKTtcblxuICAgIF90aXRsZVJvd0hlYWQuYXBwZW5kKF90aXRsZVJvdyk7XG5cbiAgICByZXR1cm4gX3RpdGxlUm93SGVhZDtcbiAgfSxcbiAgQWRkRW1wdHlFZGl0aW5nUm93QnlUZW1wbGF0ZTogZnVuY3Rpb24gQWRkRW1wdHlFZGl0aW5nUm93QnlUZW1wbGF0ZShjYWxsYmFja2Z1bikge1xuICAgIHZhciByb3dJZCA9IHRoaXMuQWRkRWRpdGluZ1Jvd0J5VGVtcGxhdGUobnVsbCk7XG4gICAgdGhpcy5fUHJvcF9Kc29uRGF0YVtyb3dJZF0gPSBudWxsO1xuICB9LFxuICBBZGRFZGl0aW5nUm93QnlUZW1wbGF0ZTogZnVuY3Rpb24gQWRkRWRpdGluZ1Jvd0J5VGVtcGxhdGUoanNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIGlmICh0aGlzLkNvbXBsZXRlZEVkaXRpbmdSb3coKSkge1xuICAgICAgdmFyIHJvd0lkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgICB2YXIgJHJvd0VsZW0gPSAkKFwiPHRyIC8+XCIpO1xuICAgICAgJHJvd0VsZW0uYXR0cihcImlkXCIsIHJvd0lkKTtcbiAgICAgIHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtID0gJHJvd0VsZW07XG5cbiAgICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQgJiYganNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZS5lZGl0RWFibGUgPT0gZmFsc2UpIHt9IGVsc2Uge1xuICAgICAgICB2YXIgZXZlbnRfZGF0YSA9IHtcbiAgICAgICAgICBob3N0OiB0aGlzXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYgKHRoaXMuX1N0YXR1cyAhPSBcIlZpZXdcIikge1xuICAgICAgICAgICRyb3dFbGVtLmJpbmQoXCJjbGlja1wiLCBldmVudF9kYXRhLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciByb3dTdGF0dXMgPSAkcm93RWxlbS5hdHRyKFwic3RhdHVzXCIpO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIHJvd1N0YXR1cyAhPSAndW5kZWZpbmVkJyAmJiByb3dTdGF0dXMgPT0gXCJkaXNhYmxlZFwiKSB7XG4gICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIF9ob3N0ID0gZXZlbnQuZGF0YS5ob3N0O1xuXG4gICAgICAgICAgICBpZiAoX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtICE9IG51bGwgJiYgJCh0aGlzKS5hdHRyKFwiaWRcIikgPT0gX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtLmF0dHIoXCJpZFwiKSkge1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBfQyA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0Q29uZmlnKCk7XG5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgX0MuUm93Q2xpY2sgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIF9DLlJvd0NsaWNrID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gX0MuUm93Q2xpY2soKTtcblxuICAgICAgICAgICAgICAgIGlmIChyZXN1bHQgIT0gJ3VuZGVmaW5lZCcgJiYgcmVzdWx0ID09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJfQy5Sb3dDbGljaygpIEVycm9yXCIpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChfaG9zdC5Db21wbGV0ZWRFZGl0aW5nUm93KCkpIHtcbiAgICAgICAgICAgICAgX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtID0gJCh0aGlzKTtcblxuICAgICAgICAgICAgICBfaG9zdC5TZXRSb3dJc0VkaXRTdGF0dXMoX2hvc3QuXyRQcm9wX0VkaXRpbmdSb3dFbGVtKTtcblxuICAgICAgICAgICAgICB2YXIgX3JvdyA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgX3Jvdy5maW5kKFwidGRcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyICR0ZCA9ICQodGhpcyk7XG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gJHRkLmF0dHIoXCJyZW5kZXJlclwiKTtcbiAgICAgICAgICAgICAgICB2YXIgdGVtcGxhdGVJZCA9ICR0ZC5hdHRyKFwidGVtcGxhdGVJZFwiKTtcblxuICAgICAgICAgICAgICAgIHZhciB0ZW1wbGF0ZSA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0VGVtcGxhdGUodGVtcGxhdGVJZCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVyZXJPYmogPSBldmFsKFwiT2JqZWN0LmNyZWF0ZShcIiArIHJlbmRlcmVyICsgXCIpXCIpO1xuICAgICAgICAgICAgICAgIHZhciAkaHRtbGVsZW0gPSByZW5kZXJlck9iai5HZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfQywgdGVtcGxhdGUsICR0ZCwgX3JvdywgdGhpcy5fJFByb3BfVGFibGVFbGVtLCAkdGQuY2hpbGRyZW4oKSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiB0ZW1wbGF0ZS5IaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgJHRkLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLlN0eWxlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgICAkdGQuY3NzKHRlbXBsYXRlLlN0eWxlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkdGQuaHRtbChcIlwiKTtcbiAgICAgICAgICAgICAgICAkdGQuYXBwZW5kKCRodG1sZWxlbSk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfQy5UZW1wbGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIHRlbXBsYXRlID0gX0MuVGVtcGxhdGVzW2ldO1xuICAgICAgICB2YXIgcmVuZGVyZXIgPSBudWxsO1xuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVuZGVyZXIgPSB0ZW1wbGF0ZS5SZW5kZXJlcjtcbiAgICAgICAgICB2YXIgcmVuZGVyZXJPYmogPSBldmFsKFwiT2JqZWN0LmNyZWF0ZShcIiArIHJlbmRlcmVyICsgXCIpXCIpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgYWxlcnQoXCLlrp7kvovljJZcIiArIHJlbmRlcmVyICsgXCLlpLHotKUhXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICR0ZEVsZW0gPSBudWxsO1xuICAgICAgICAkdGRFbGVtID0gJChcIjx0ZCAvPlwiKTtcbiAgICAgICAgJHRkRWxlbS5hdHRyKFwicmVuZGVyZXJcIiwgcmVuZGVyZXIpO1xuICAgICAgICAkdGRFbGVtLmF0dHIoXCJ0ZW1wbGF0ZUlkXCIsIHRlbXBsYXRlLlRlbXBsYXRlSWQpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuSGlkZGVuICE9ICd1bmRlZmluZWQnICYmIHRlbXBsYXRlLkhpZGRlbiA9PSB0cnVlKSB7XG4gICAgICAgICAgJHRkRWxlbS5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLldpZHRoICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgJHRkRWxlbS5jc3MoXCJ3aWR0aFwiLCB0ZW1wbGF0ZS5XaWR0aCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkFsaWduICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgJHRkRWxlbS5hdHRyKFwiYWxpZ25cIiwgdGVtcGxhdGUuQWxpZ24pO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRlbGVtID0gcmVuZGVyZXJPYmouR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX0MsIHRlbXBsYXRlLCAkdGRFbGVtLCAkcm93RWxlbSwgdGhpcy5fJFByb3BfVGFibGVFbGVtLCBudWxsLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKTtcblxuICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLlN0eWxlICE9ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgJHRkRWxlbS5jc3ModGVtcGxhdGUuU3R5bGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHRkRWxlbS5hcHBlbmQoJGVsZW0pO1xuICAgICAgICAkcm93RWxlbS5hcHBlbmQoJHRkRWxlbSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5hcHBlbmQoJHJvd0VsZW0pO1xuXG4gICAgICBpZiAodHlwZW9mIF9DLkFkZEFmdGVyUm93RXZlbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBfQy5BZGRBZnRlclJvd0V2ZW50ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgX0MuQWRkQWZ0ZXJSb3dFdmVudCgkcm93RWxlbSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByb3dJZDtcbiAgICB9XG4gIH0sXG4gIFNldFRvVmlld1N0YXR1czogZnVuY3Rpb24gU2V0VG9WaWV3U3RhdHVzKCkge1xuICAgIHRoaXMuX1N0YXR1cyA9IFwiVmlld1wiO1xuICB9LFxuICBTZXRSb3dJc0VkaXRTdGF0dXM6IGZ1bmN0aW9uIFNldFJvd0lzRWRpdFN0YXR1cyh0cikge1xuICAgICQodHIpLmF0dHIoXCJFZGl0U3RhdHVzXCIsIFwiRWRpdFN0YXR1c1wiKTtcbiAgfSxcbiAgU2V0Um93SXNDb21wbGV0ZWRTdGF0dXM6IGZ1bmN0aW9uIFNldFJvd0lzQ29tcGxldGVkU3RhdHVzKHRyKSB7XG4gICAgJCh0cikuYXR0cihcIkVkaXRTdGF0dXNcIiwgXCJDb21wbGV0ZWRTdGF0dXNcIik7XG4gIH0sXG4gIFJvd0lzRWRpdFN0YXR1czogZnVuY3Rpb24gUm93SXNFZGl0U3RhdHVzKHRyKSB7XG4gICAgcmV0dXJuICQodHIpLmF0dHIoXCJFZGl0U3RhdHVzXCIpID09IFwiRWRpdFN0YXR1c1wiO1xuICB9LFxuICBSb3dJc0NvbXBsZXRlZFN0YXR1czogZnVuY3Rpb24gUm93SXNDb21wbGV0ZWRTdGF0dXModHIpIHtcbiAgICByZXR1cm4gJCh0cikuYXR0cihcIkVkaXRTdGF0dXNcIikgPT0gXCJDb21wbGV0ZWRTdGF0dXNcIjtcbiAgfSxcbiAgQ29tcGxldGVkRWRpdGluZ1JvdzogZnVuY3Rpb24gQ29tcGxldGVkRWRpdGluZ1JvdygpIHtcbiAgICB2YXIgcmVzdWx0ID0gdHJ1ZTtcblxuICAgIGlmICh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSAhPSBudWxsKSB7XG4gICAgICBpZiAoIXRoaXMuUm93SXNDb21wbGV0ZWRTdGF0dXModGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0pKSB7XG4gICAgICAgIHZhciBfQyA9IHRoaXMuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRDb25maWcoKTtcblxuICAgICAgICB2YXIgX2hvc3QgPSB0aGlzO1xuXG4gICAgICAgIGlmICh0aGlzLlZhbGlkYXRlQ29tcGxldGVkRWRpdGluZ1Jvd0VuYWJsZSh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSkpIHtcbiAgICAgICAgICB2YXIgX3JvdyA9IHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtO1xuICAgICAgICAgIHRoaXMuU2V0Um93SXNDb21wbGV0ZWRTdGF0dXMoX3Jvdyk7XG5cbiAgICAgICAgICBfcm93LmZpbmQoXCJ0ZFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkdGQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyIHJlbmRlcmVyID0gJHRkLmF0dHIoXCJyZW5kZXJlclwiKTtcbiAgICAgICAgICAgIHZhciB0ZW1wbGF0ZUlkID0gJHRkLmF0dHIoXCJ0ZW1wbGF0ZUlkXCIpO1xuXG4gICAgICAgICAgICB2YXIgdGVtcGxhdGUgPSBfaG9zdC5fUHJvcF9Db25maWdNYW5hZ2VyLkdldFRlbXBsYXRlKHRlbXBsYXRlSWQpO1xuXG4gICAgICAgICAgICB2YXIgcmVuZGVyZXJPYmogPSBldmFsKFwiT2JqZWN0LmNyZWF0ZShcIiArIHJlbmRlcmVyICsgXCIpXCIpO1xuICAgICAgICAgICAgdmFyICRodG1sZWxlbSA9IHJlbmRlcmVyT2JqLkdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX0MsIHRlbXBsYXRlLCAkdGQsIF9yb3csIHRoaXMuXyRQcm9wX1RhYmxlRWxlbSwgJHRkLmNoaWxkcmVuKCkpO1xuICAgICAgICAgICAgJHRkLmh0bWwoXCJcIik7XG4gICAgICAgICAgICAkdGQuYXBwZW5kKCRodG1sZWxlbSk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSA9IG51bGw7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVzdWx0ID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBWYWxpZGF0ZUNvbXBsZXRlZEVkaXRpbmdSb3dFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlQ29tcGxldGVkRWRpdGluZ1Jvd0VuYWJsZShlZGl0Um93KSB7XG4gICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWdNYW5hZ2VyLkdldENvbmZpZygpO1xuXG4gICAgdmFyIF9ob3N0ID0gdGhpcztcblxuICAgIHZhciByZXN1bHQgPSB0cnVlO1xuICAgIHZhciB2YWxpZGF0ZU1zZyA9IFwiXCI7XG4gICAgdmFyIHRkcyA9ICQoZWRpdFJvdykuZmluZChcInRkXCIpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0ZHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciAkdGQgPSAkKHRkc1tpXSk7XG4gICAgICB2YXIgcmVuZGVyZXIgPSAkdGQuYXR0cihcInJlbmRlcmVyXCIpO1xuICAgICAgdmFyIHRlbXBsYXRlSWQgPSAkdGQuYXR0cihcInRlbXBsYXRlSWRcIik7XG5cbiAgICAgIHZhciB0ZW1wbGF0ZSA9IF9ob3N0Ll9Qcm9wX0NvbmZpZ01hbmFnZXIuR2V0VGVtcGxhdGUodGVtcGxhdGVJZCk7XG5cbiAgICAgIHZhciByZW5kZXJlck9iaiA9IGV2YWwoXCJPYmplY3QuY3JlYXRlKFwiICsgcmVuZGVyZXIgKyBcIilcIik7XG4gICAgICB2YXIgdmFscmVzdWx0ID0gcmVuZGVyZXJPYmouVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfQywgdGVtcGxhdGUsICR0ZCwgZWRpdFJvdywgdGhpcy5fJFByb3BfVGFibGVFbGVtLCAkdGQuY2hpbGRyZW4oKSk7XG5cbiAgICAgIGlmICh2YWxyZXN1bHQuU3VjY2VzcyA9PSBmYWxzZSkge1xuICAgICAgICByZXN1bHQgPSBmYWxzZTtcbiAgICAgICAgdmFsaWRhdGVNc2cgPSB2YWxyZXN1bHQuTXNnO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIXJlc3VsdCAmJiB2YWxpZGF0ZU1zZyAhPSBudWxsKSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgdmFsaWRhdGVNc2csIG51bGwpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFJlbW92ZVJvdzogZnVuY3Rpb24gUmVtb3ZlUm93KCkge1xuICAgIGlmICh0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbSAhPSBudWxsKSB7XG4gICAgICB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbS5yZW1vdmUoKTtcblxuICAgICAgdGhpcy5fJFByb3BfRWRpdGluZ1Jvd0VsZW0gPSBudWxsO1xuICAgIH1cbiAgfSxcbiAgR2V0VGFibGVPYmplY3Q6IGZ1bmN0aW9uIEdldFRhYmxlT2JqZWN0KCkge1xuICAgIHJldHVybiB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG4gIH0sXG4gIEdldFJvd3M6IGZ1bmN0aW9uIEdldFJvd3MoKSB7XG4gICAgaWYgKHRoaXMuXyRQcm9wX1RhYmxlRWxlbSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gdGhpcy5fJFByb3BfVGFibGVFbGVtLmZpbmQoXCJ0cjpub3QoOmZpcnN0KVwiKTtcbiAgICB9XG4gIH0sXG4gIEdldEVkaXRSb3c6IGZ1bmN0aW9uIEdldEVkaXRSb3coKSB7XG4gICAgaWYgKHRoaXMuXyRQcm9wX0VkaXRpbmdSb3dFbGVtICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB0aGlzLl8kUHJvcF9FZGl0aW5nUm93RWxlbTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9LFxuICBHZXRMYXN0Um93OiBmdW5jdGlvbiBHZXRMYXN0Um93KCkge1xuICAgIHZhciByb3cgPSB0aGlzLkdldEVkaXRSb3coKTtcbiAgICBpZiAocm93ID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIHZhciByb3dzID0gdGhpcy5HZXRSb3dzKCk7XG4gICAgdmFyIGluZGV4ID0gcm93cy5pbmRleChyb3cpO1xuXG4gICAgaWYgKGluZGV4ID4gMCkge1xuICAgICAgcmV0dXJuICQocm93c1tpbmRleCAtIDFdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgR2V0TmV4dFJvdzogZnVuY3Rpb24gR2V0TmV4dFJvdygpIHtcbiAgICB2YXIgcm93ID0gdGhpcy5HZXRFZGl0Um93KCk7XG4gICAgaWYgKHJvdyA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICB2YXIgcm93cyA9IHRoaXMuR2V0Um93cygpO1xuICAgIHZhciBpbmRleCA9IHJvd3MuaW5kZXgocm93KTtcblxuICAgIGlmIChpbmRleCA8IHJvd3MubGVuZ3RoIC0gMSkge1xuICAgICAgcmV0dXJuICQocm93c1tpbmRleCArIDFdKTtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgTW92ZVVwOiBmdW5jdGlvbiBNb3ZlVXAoKSB7XG4gICAgdmFyIHJvdyA9IHRoaXMuR2V0TGFzdFJvdygpO1xuXG4gICAgaWYgKHJvdyAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIHJvdy5hdHRyKFwic3RhdHVzXCIpICE9IFwidW5kZWZpbmVkXCIgJiYgcm93LmF0dHIoXCJzdGF0dXNcIikgPT0gXCJkaXNhYmxlZFwiKSByZXR1cm4gZmFsc2U7XG4gICAgICB2YXIgbWUgPSB0aGlzLkdldEVkaXRSb3coKTtcbiAgICAgIHZhciB0ZW1wID0gbWUuYXR0cihcImNsYXNzXCIpO1xuICAgICAgbWUuYXR0cihcImNsYXNzXCIsIHJvdy5hdHRyKFwiY2xhc3NcIikpO1xuICAgICAgcm93LmF0dHIoXCJjbGFzc1wiLCB0ZW1wKTtcblxuICAgICAgaWYgKG1lICE9IG51bGwpIHtcbiAgICAgICAgcm93LmJlZm9yZShtZVswXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBNb3ZlRG93bjogZnVuY3Rpb24gTW92ZURvd24oKSB7XG4gICAgdmFyIHJvdyA9IHRoaXMuR2V0TmV4dFJvdygpO1xuXG4gICAgaWYgKHJvdyAhPSBudWxsKSB7XG4gICAgICBpZiAodHlwZW9mIHJvdy5hdHRyKFwic3RhdGVcIikgIT0gXCJ1bmRlZmluZWRcIiAmJiByb3cuYXR0cihcInN0YXRlXCIpID09IFwiZGlzYWJsZWRcIikgcmV0dXJuIGZhbHNlO1xuICAgICAgdmFyIG1lID0gdGhpcy5HZXRFZGl0Um93KCk7XG4gICAgICB2YXIgdGVtcCA9IG1lLmF0dHIoXCJjbGFzc1wiKTtcbiAgICAgIG1lLmF0dHIoXCJjbGFzc1wiLCByb3cuYXR0cihcImNsYXNzXCIpKTtcbiAgICAgIHJvdy5hdHRyKFwiY2xhc3NcIiwgdGVtcCk7XG5cbiAgICAgIGlmIChtZSAhPSBudWxsKSB7XG4gICAgICAgIHJvdy5hZnRlcihtZVswXSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBSZW1vdmVBbGxSb3c6IGZ1bmN0aW9uIFJlbW92ZUFsbFJvdygpIHtcbiAgICBpZiAodGhpcy5fJFByb3BfVGFibGVFbGVtICE9IG51bGwpIHtcbiAgICAgIHRoaXMuXyRQcm9wX1RhYmxlRWxlbS5maW5kKFwidHI6bm90KDpmaXJzdClcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICQodGhpcykucmVtb3ZlKCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG4gIFVwZGF0ZVRvUm93OiBmdW5jdGlvbiBVcGRhdGVUb1Jvdyhyb3dJZCwgcm93RGF0YSkge1xuICAgIHZhciB0YWJsZUVsZW1lbnQgPSB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG5cbiAgICB2YXIgX2hvc3QgPSB0aGlzO1xuXG4gICAgdGFibGVFbGVtZW50LmZpbmQoXCJ0cltpc0hlYWRlciE9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuXG4gICAgICB2YXIgX3Jvd0lkID0gJHRyLmF0dHIoXCJpZFwiKTtcblxuICAgICAgaWYgKHJvd0lkID09IF9yb3dJZCkge1xuICAgICAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiByb3dEYXRhKSB7XG4gICAgICAgICAgJHRyLmZpbmQoXCJ0ZFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciAkdGQgPSAkKHRoaXMpO1xuICAgICAgICAgICAgdmFyICRkaXNwbGF5RWxlbSA9ICR0ZC5maW5kKFwiW0lzU2VyaWFsaXplPSd0cnVlJ11cIik7XG4gICAgICAgICAgICB2YXIgYmluZE5hbWUgPSAkZGlzcGxheUVsZW0uYXR0cihcIkJpbmROYW1lXCIpO1xuXG4gICAgICAgICAgICBpZiAoYXR0ck5hbWUgPT0gYmluZE5hbWUpIHtcbiAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlSWQgPSAkdGQuYXR0cihcInRlbXBsYXRlSWRcIik7XG5cbiAgICAgICAgICAgICAgdmFyIHRlbXBsYXRlID0gX2hvc3QuX1Byb3BfQ29uZmlnTWFuYWdlci5HZXRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKTtcblxuICAgICAgICAgICAgICB2YXIgdGV4dCA9IFwiXCI7XG4gICAgICAgICAgICAgIHZhciB2YWwgPSByb3dEYXRhW2JpbmROYW1lXTtcblxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkZvcm1hdHRlciAhPSAndW5kZWZpbmVkJyAmJiB0eXBlb2YgdGVtcGxhdGUuRm9ybWF0dGVyID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICB0ZXh0ID0gdGVtcGxhdGUuRm9ybWF0dGVyKHZhbCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICBpZiAodGV4dCA9PSBcIlwiKSB7XG4gICAgICAgICAgICAgICAgdGV4dCA9IHZhbDtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIGlmICgkZGlzcGxheUVsZW0ucHJvcCgndGFnTmFtZScpID09IFwiSU5QVVRcIikge1xuICAgICAgICAgICAgICAgIGlmICgkZGlzcGxheUVsZW0uYXR0cihcInR5cGVcIikudG9Mb3dlckNhc2UoKSA9PSBcImNoZWNrYm94XCIpIHt9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgJGRpc3BsYXlFbGVtLnZhbCh0ZXh0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICRkaXNwbGF5RWxlbS50ZXh0KHRleHQpO1xuICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiVXBkYXRlVG9Sb3cgJGxhYmVsLnRleHQodGV4dCkgRXJyb3IhXCIpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRkaXNwbGF5RWxlbS5hdHRyKFwiVmFsdWVcIiwgdmFsKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIEdldFNlbGVjdFJvd0RhdGFCeVJvd0lkOiBmdW5jdGlvbiBHZXRTZWxlY3RSb3dEYXRhQnlSb3dJZChyb3dJZCkge1xuICAgIHZhciB0YWJsZUVsZW1lbnQgPSB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG4gICAgdmFyIHJvd0RhdGEgPSB7fTtcbiAgICB0YWJsZUVsZW1lbnQuZmluZChcInRyW2lzSGVhZGVyIT0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICR0ciA9ICQodGhpcyk7XG5cbiAgICAgIHZhciBfcm93SWQgPSAkdHIuYXR0cihcImlkXCIpO1xuXG4gICAgICBpZiAocm93SWQgPT0gX3Jvd0lkKSB7XG4gICAgICAgICR0ci5maW5kKFwiW0lzU2VyaWFsaXplPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgaWYgKCQodGhpcykuYXR0cihcIlZhbHVlXCIpICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcm93RGF0YVskKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKV0gPSAkKHRoaXMpLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcm93RGF0YVskKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKV0gPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJvd0RhdGE7XG4gIH0sXG4gIEdldFNlbGVjdFJvd0J5Um93SWQ6IGZ1bmN0aW9uIEdldFNlbGVjdFJvd0J5Um93SWQocm93SWQpIHtcbiAgICB2YXIgdGFibGVFbGVtZW50ID0gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICAgIHJldHVybiB0YWJsZUVsZW1lbnQuZmluZChcInRyW2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgfSxcbiAgR2V0QWxsUm93RGF0YTogZnVuY3Rpb24gR2V0QWxsUm93RGF0YSgpIHtcbiAgICB2YXIgdGFibGVFbGVtZW50ID0gdGhpcy5fJFByb3BfVGFibGVFbGVtO1xuICAgIHZhciByb3dEYXRhcyA9IG5ldyBBcnJheSgpO1xuICAgIHRhYmxlRWxlbWVudC5maW5kKFwidHJbaXNIZWFkZXIhPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHRyID0gJCh0aGlzKTtcbiAgICAgIHZhciByb3dEYXRhID0ge307XG4gICAgICAkdHIuZmluZChcIltJc1NlcmlhbGl6ZT0ndHJ1ZSddXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICByb3dEYXRhWyQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpXSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICByb3dEYXRhWyQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpICsgXCJfX19UZXh0XCJdID0gJCh0aGlzKS5hdHRyKFwiVGV4dFwiKTtcbiAgICAgIH0pO1xuICAgICAgcm93RGF0YXMucHVzaChyb3dEYXRhKTtcbiAgICB9KTtcbiAgICByZXR1cm4gcm93RGF0YXM7XG4gIH0sXG4gIEdldFNlcmlhbGl6ZUpzb246IGZ1bmN0aW9uIEdldFNlcmlhbGl6ZUpzb24oKSB7XG4gICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSgpO1xuICAgIHZhciB0YWJsZSA9IHRoaXMuXyRQcm9wX1RhYmxlRWxlbTtcbiAgICB0YWJsZS5maW5kKFwidHJbaXNIZWFkZXIhPSd0cnVlJ11cIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgcm93ZGF0YSA9IG5ldyBPYmplY3QoKTtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuICAgICAgJHRyLmZpbmQoXCJbSXNTZXJpYWxpemU9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNlcml0ZW0gPSAkKHRoaXMpO1xuICAgICAgICB2YXIgYmluZE5hbWUgPSBzZXJpdGVtLmF0dHIoXCJCaW5kTmFtZVwiKTtcbiAgICAgICAgdmFyIGJpbmRWYWx1ZSA9IHNlcml0ZW0uYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB2YXIgYmluZFRleHQgPSBzZXJpdGVtLmF0dHIoXCJUZXh0XCIpO1xuXG4gICAgICAgIGlmICghYmluZFRleHQpIHtcbiAgICAgICAgICBiaW5kVGV4dCA9IFwiXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYmluZFRleHQgPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGJpbmRUZXh0ID0gXCJcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIHJvd2RhdGFbYmluZE5hbWVdID0gYmluZFZhbHVlO1xuICAgICAgICByb3dkYXRhW2JpbmROYW1lICsgXCJfX19UZXh0XCJdID0gYmluZFRleHQ7XG4gICAgICB9KTtcbiAgICAgIHJlc3VsdC5wdXNoKHJvd2RhdGEpO1xuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIEdldFRhYmxlRWxlbWVudDogZnVuY3Rpb24gR2V0VGFibGVFbGVtZW50KCkge1xuICAgIHJldHVybiB0aGlzLl8kUHJvcF9UYWJsZUVsZW07XG4gIH1cbn07XG52YXIgRWRpdFRhYmxlQ29uZmlnTWFuYWdlciA9IHtcbiAgX1Byb3BfQ29uZmlnOiB7fSxcbiAgSW5pdGlhbGl6YXRpb25Db25maWc6IGZ1bmN0aW9uIEluaXRpYWxpemF0aW9uQ29uZmlnKF9jb25maWcpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCB0aGlzLl9Qcm9wX0NvbmZpZywgX2NvbmZpZyk7XG4gICAgdmFyIF90ZW1wbGF0ZXMgPSB0aGlzLl9Qcm9wX0NvbmZpZy5UZW1wbGF0ZXM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90ZW1wbGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IF90ZW1wbGF0ZXNbaV07XG4gICAgICB0ZW1wbGF0ZS5UZW1wbGF0ZUlkID0gU3RyaW5nVXRpbGl0eS5HdWlkKCk7XG4gICAgfVxuICB9LFxuICBHZXRDb25maWc6IGZ1bmN0aW9uIEdldENvbmZpZygpIHtcbiAgICByZXR1cm4gdGhpcy5fUHJvcF9Db25maWc7XG4gIH0sXG4gIEdldFRlbXBsYXRlOiBmdW5jdGlvbiBHZXRUZW1wbGF0ZSh0ZW1wbGF0ZUlkKSB7XG4gICAgdmFyIF90ZW1wbGF0ZXMgPSB0aGlzLl9Qcm9wX0NvbmZpZy5UZW1wbGF0ZXM7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IF90ZW1wbGF0ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciB0ZW1wbGF0ZSA9IF90ZW1wbGF0ZXNbaV07XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5UZW1wbGF0ZUlkID09IHRlbXBsYXRlSWQpIHtcbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9XG59O1xudmFyIEVkaXRUYWJsZVZhbGlkYXRlID0ge1xuICBfU1FMS2V5V29yZEFycmF5OiBuZXcgQXJyYXkoKSxcbiAgR2V0U1FMS2V5V29yZHM6IGZ1bmN0aW9uIEdldFNRTEtleVdvcmRzKCkge1xuICAgIGlmICh0aGlzLl9TUUxLZXlXb3JkQXJyYXkubGVuZ3RoID09IDApIHtcbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiaW5zZXJ0XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcInVwZGF0ZVwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJkZWxldGVcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwic2VsZWN0XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFzXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImZyb21cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZGlzdGluY3RcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwid2hlcmVcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwib3JkZXJcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiYnlcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiYXNjXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImRlc2NcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZGVzY1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJhbmRcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwib3JcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiYmV0d2VlblwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJvcmRlciBieVwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJjb3VudFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJncm91cFwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJncm91cCBieVwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJoYXZpbmdcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiYWxpYXNcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiam9pblwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJsZWZ0XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcInJpZ3RoXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImlubmVlclwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJ1bmlvblwiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJzdW1cIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiYWxsXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcIm1pbnVzXCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImFsZXJ0XCIpO1xuXG4gICAgICB0aGlzLl9TUUxLZXlXb3JkQXJyYXkucHVzaChcImRyb3BcIik7XG5cbiAgICAgIHRoaXMuX1NRTEtleVdvcmRBcnJheS5wdXNoKFwiZXhlY1wiKTtcblxuICAgICAgdGhpcy5fU1FMS2V5V29yZEFycmF5LnB1c2goXCJ0cnVuY2F0ZVwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fU1FMS2V5V29yZEFycmF5O1xuICB9LFxuICBWYWxpZGF0ZTogZnVuY3Rpb24gVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSkge1xuICAgIHZhciByZXN1bHQgPSB7XG4gICAgICBTdWNjZXNzOiB0cnVlLFxuICAgICAgTXNnOiBcIlwiXG4gICAgfTtcbiAgICB2YXIgdmFsaWRhdGVDb25maWcgPSB0ZW1wbGF0ZS5WYWxpZGF0ZTtcblxuICAgIGlmICh2YWxpZGF0ZUNvbmZpZyAhPSB1bmRlZmluZWQgJiYgdmFsaWRhdGVDb25maWcgIT0gbnVsbCkge1xuICAgICAgdmFyIHZhbGlkYXRlVHlwZSA9IHZhbGlkYXRlQ29uZmlnLlR5cGU7XG5cbiAgICAgIGlmICh2YWxpZGF0ZVR5cGUgIT0gdW5kZWZpbmVkICYmIHZhbGlkYXRlVHlwZSAhPSBudWxsKSB7XG4gICAgICAgIHN3aXRjaCAodmFsaWRhdGVUeXBlKSB7XG4gICAgICAgICAgY2FzZSBcIk5vdEVtcHR5XCI6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlmICh2YWwgPT0gXCJcIikge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5TdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVzdWx0Lk1zZyA9IFwi44CQXCIgKyB0ZW1wbGF0ZS5UaXRsZSArIFwi44CR5LiN6IO95Li656m6IVwiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgXCJMVU5vT25seVwiOlxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBpZiAoL15bYS16QS1aXVthLXpBLVowLTlfXXswLH0kLy50ZXN0KHZhbCkgPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQuU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHJlc3VsdC5Nc2cgPSBcIuOAkFwiICsgdGVtcGxhdGUuVGl0bGUgKyBcIuOAkeS4jeiDveS4uuepuuS4lOWPquiDveaYr+Wtl+avjeOAgeS4i+WIkue6v+OAgeaVsOWtl+W5tuS7peWtl+avjeW8gOWktO+8gVwiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgXCJTUUxLZXlXb3JkXCI6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIGlmICgvXlthLXpBLVpdW2EtekEtWjAtOV9dezAsfSQvLnRlc3QodmFsKSA9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5TdWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgcmVzdWx0Lk1zZyA9IFwi44CQXCIgKyB0ZW1wbGF0ZS5UaXRsZSArIFwi44CR5LiN6IO95Li656m65LiU5Y+q6IO95piv5a2X5q+N44CB5LiL5YiS57q/44CB5pWw5a2X5bm25Lul5a2X5q+N5byA5aS077yBXCI7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICB2YXIgdmFsID0gdmFsLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgICAgICAgIHZhciBzcWxLZXlXb3JkcyA9IHRoaXMuR2V0U1FMS2V5V29yZHMoKTtcblxuICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNxbEtleVdvcmRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZhbCA9PSBzcWxLZXlXb3Jkc1tpXS50b1VwcGVyQ2FzZSgpKSB7XG4gICAgICAgICAgICAgICAgICByZXN1bHQuU3VjY2VzcyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgcmVzdWx0Lk1zZyA9IFwi44CQXCIgKyB0ZW1wbGF0ZS5UaXRsZSArIFwi44CR6K+35LiN6KaB5L2/55SoU1FM5YWz6ZSu5a2X5L2c5Li65YiX5ZCN77yBXCI7XG4gICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbnZhciBFZGl0VGFibGVEZWZhdWxlVmFsdWUgPSB7XG4gIEdldFZhbHVlOiBmdW5jdGlvbiBHZXRWYWx1ZSh0ZW1wbGF0ZSkge1xuICAgIHZhciBkZWZhdWx0VmFsdWVDb25maWcgPSB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWU7XG5cbiAgICBpZiAoZGVmYXVsdFZhbHVlQ29uZmlnICE9IHVuZGVmaW5lZCAmJiBkZWZhdWx0VmFsdWVDb25maWcgIT0gbnVsbCkge1xuICAgICAgdmFyIGRlZmF1bHRWYWx1ZVR5cGUgPSBkZWZhdWx0VmFsdWVDb25maWcuVHlwZTtcblxuICAgICAgaWYgKGRlZmF1bHRWYWx1ZVR5cGUgIT0gdW5kZWZpbmVkICYmIGRlZmF1bHRWYWx1ZVR5cGUgIT0gbnVsbCkge1xuICAgICAgICBzd2l0Y2ggKGRlZmF1bHRWYWx1ZVR5cGUpIHtcbiAgICAgICAgICBjYXNlIFwiQ29uc3RcIjpcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGRlZmF1bHRWYWx1ZUNvbmZpZy5WYWx1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIGNhc2UgXCJHVUlEXCI6XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHJldHVybiBTdHJpbmdVdGlsaXR5Lkd1aWQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiXCI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfQ2hlY2tCb3ggPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YXIgdmFsID0gRWRpdFRhYmxlRGVmYXVsZVZhbHVlLkdldFZhbHVlKHRlbXBsYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmh0bWwoKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSBcIlwiO1xuXG4gICAgaWYgKHZhbCA9PSBcIuaYr1wiKSB7XG4gICAgICAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0nY2hlY2tib3gnIGNoZWNrZWQ9J2NoZWNrZWQnIC8+XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0nY2hlY2tib3gnIC8+XCIpO1xuICAgIH1cblxuICAgICRlbGVtLnZhbCh2YWwpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyICRlbGVtID0gXCJcIjtcblxuICAgIGlmICh0ZW1wbGF0ZS5Jc0NOVmFsdWUpIHtcbiAgICAgIGlmIChlZGl0U3RhdXNIdG1sRWxlbS5hdHRyKFwiY2hlY2tlZFwiKSA9PSBcImNoZWNrZWRcIikge1xuICAgICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIHZhbHVlPSfmmK8nPuaYrzwvbGFiZWw+XCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyB2YWx1ZT0n5ZCmJz7lkKY8L2xhYmVsPlwiKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGVkaXRTdGF1c0h0bWxFbGVtLmF0dHIoXCJjaGVja2VkXCIpID09IFwiY2hlY2tlZFwiKSB7XG4gICAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgdmFsdWU9JzEnPuaYrzwvbGFiZWw+XCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyB2YWx1ZT0nMCc+5ZCmPC9sYWJlbD5cIik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfRm9ybWF0dGVyID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgaWYgKHRlbXBsYXRlLkZvcm1hdHRlciAmJiB0eXBlb2YgdGVtcGxhdGUuRm9ybWF0dGVyID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgdmFyIGVkaXREYXRhcyA9IEVkaXRUYWJsZS5fUHJvcF9Kc29uRGF0YTtcblxuICAgICAgaWYgKGVkaXREYXRhcykge1xuICAgICAgICB2YXIgcm93SWQgPSBob3N0Um93LmF0dHIoXCJpZFwiKTtcbiAgICAgICAgdmFyIHJvd0RhdGEgPSBlZGl0RGF0YXNbcm93SWRdO1xuXG4gICAgICAgIGlmIChyb3dEYXRhKSB7XG4gICAgICAgICAgcmV0dXJuICQodGVtcGxhdGUuRm9ybWF0dGVyKHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCByb3dEYXRhKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICBpZiAodGVtcGxhdGUuRm9ybWF0dGVyICYmIHR5cGVvZiB0ZW1wbGF0ZS5Gb3JtYXR0ZXIgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICB2YXIgZWRpdERhdGFzID0gRWRpdFRhYmxlLl9Qcm9wX0pzb25EYXRhO1xuXG4gICAgICBpZiAoZWRpdERhdGFzKSB7XG4gICAgICAgIHZhciByb3dJZCA9IGhvc3RSb3cuYXR0cihcImlkXCIpO1xuICAgICAgICB2YXIgcm93RGF0YSA9IGVkaXREYXRhc1tyb3dJZF07XG5cbiAgICAgICAgaWYgKHJvd0RhdGEpIHtcbiAgICAgICAgICByZXR1cm4gJCh0ZW1wbGF0ZS5Gb3JtYXR0ZXIodGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHJvd0RhdGEpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBcIlwiO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfTGFiZWwgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgdmFsID0gXCJcIjtcbiAgICB2YXIgYmluZG5hbWUgPSB0ZW1wbGF0ZS5CaW5kTmFtZTtcblxuICAgIGlmICh0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gdW5kZWZpbmVkICYmIHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSBudWxsKSB7XG4gICAgICB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5Gb3JtYXRlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uaHRtbCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uYXR0cihcIlZhbHVlXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciAkZWxlbTtcblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuRm9ybWF0ZXIgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIFRleHQ9J1wiICsgdGV4dCArIFwiJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWwgKyBcIic+XCIgKyB2YWwgKyBcIjwvbGFiZWw+XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdGV4dCA9IHRlbXBsYXRlLkZvcm1hdGVyKHZhbCk7XG4gICAgICAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIFRleHQ9XCIgKyB0ZXh0ICsgXCIgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9XCIgKyB2YWwgKyBcIj5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIH1cblxuICAgICRlbGVtLnZhbCh2YWwpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgJGVsZW07XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuXG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5Gb3JtYXRlciA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgVGV4dD0nXCIgKyB0ZXh0ICsgXCInIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbCArIFwiJz5cIiArIHZhbCArIFwiPC9sYWJlbD5cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB0ZXh0ID0gdGVtcGxhdGUuRm9ybWF0ZXIodmFsKTtcbiAgICAgICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgVGV4dD0nXCIgKyB0ZXh0ICsgXCInIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbCArIFwiJz5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIH1cblxuICAgICRlbGVtLnZhbCh2YWwpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX1JhZGlvID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAodGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5EZWZhdWx0VmFsdWUgIT0gbnVsbCkge1xuICAgICAgdmFyIHZhbCA9IEVkaXRUYWJsZURlZmF1bGVWYWx1ZS5HZXRWYWx1ZSh0ZW1wbGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtiaW5kbmFtZV07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSBcIlwiO1xuXG4gICAgaWYgKG51bGwgIT0gdmlld1N0YXVzSHRtbEVsZW0gJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkICYmIHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJjaGVja2VkXCIpID09IFwiY2hlY2tlZFwiIHx8IHZhbCA9PSAxKSB7XG4gICAgICAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0ncmFkaW8nIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBuYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIGNoZWNrZWQ9J2NoZWNrZWQnIHZhbHVlPScxJy8+XCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0ncmFkaW8nIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBuYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIHZhbHVlPScwJy8+XCIpO1xuICAgIH1cblxuICAgICRlbGVtLnZhbCh2YWwpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyICRlbGVtID0gXCJcIjtcblxuICAgIGlmIChlZGl0U3RhdXNIdG1sRWxlbS5hdHRyKFwiY2hlY2tlZFwiKSA9PSBcImNoZWNrZWRcIikge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3JhZGlvJyBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgbmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJ2NoZWNrZWQ9J2NoZWNrZWQnICB2YWx1ZT0nMScvPlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGVsZW0gPSAkKFwiPGlucHV0IHR5cGU9J3JhZGlvJyBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgbmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyB2YWx1ZT0nMCcvPlwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9TZWxlY3QgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgY29uZmlnU291cmNlID0gbnVsbDtcblxuICAgIGlmICh0ZW1wbGF0ZS5DbGllbnREYXRhU291cmNlICE9IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5DbGllbnREYXRhU291cmNlICE9IG51bGwpIHtcbiAgICAgIGNvbmZpZ1NvdXJjZSA9IHRlbXBsYXRlLkNsaWVudERhdGFTb3VyY2U7XG4gICAgfSBlbHNlIGlmICh0ZW1wbGF0ZS5DbGllbnREYXRhU291cmNlRnVuYyAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZUZ1bmMgIT0gbnVsbCkge1xuICAgICAgY29uZmlnU291cmNlID0gdGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZUZ1bmModGVtcGxhdGUuQ2xpZW50RGF0YVNvdXJjZUZ1bmNQYXJhcywgX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKTtcbiAgICB9XG5cbiAgICBpZiAoY29uZmlnU291cmNlID09IG51bGwpIHtcbiAgICAgIHJldHVybiAkKFwiPGxhYmVsPuaJvuS4jeWIsOaVsOaNrua6kOiuvue9rizor7flnKh0ZW1wbGF0ZeS4reiuvue9ruaVsOaNrua6kDwvbGFiZWw+XCIpO1xuICAgIH1cblxuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciB0eHQgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uYXR0cihcIlZhbHVlXCIpO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8c2VsZWN0IHN0eWxlPSd3aWR0aDogMTAwJScgLz5cIik7XG5cbiAgICBpZiAoY29uZmlnU291cmNlWzBdLkdyb3VwKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvbmZpZ1NvdXJjZS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgb3B0Z3JvdXAgPSAkKFwiPG9wdGdyb3VwIC8+XCIpO1xuICAgICAgICBvcHRncm91cC5hdHRyKFwibGFiZWxcIiwgY29uZmlnU291cmNlW2ldLkdyb3VwKTtcblxuICAgICAgICBpZiAoY29uZmlnU291cmNlW2ldLk9wdGlvbnMpIHtcbiAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGNvbmZpZ1NvdXJjZVtpXS5PcHRpb25zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICB2YXIgb3B0aW9uID0gJChcIjxvcHRpb24gLz5cIik7XG4gICAgICAgICAgICBvcHRpb24uYXR0cihcInZhbHVlXCIsIGNvbmZpZ1NvdXJjZVtpXS5PcHRpb25zW2pdLlZhbHVlKTtcbiAgICAgICAgICAgIG9wdGlvbi5hdHRyKFwidGV4dFwiLCBjb25maWdTb3VyY2VbaV0uT3B0aW9uc1tqXS5UZXh0KTtcbiAgICAgICAgICAgIG9wdGlvbi50ZXh0KGNvbmZpZ1NvdXJjZVtpXS5PcHRpb25zW2pdLlRleHQpO1xuICAgICAgICAgICAgb3B0Z3JvdXAuYXBwZW5kKG9wdGlvbik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgJGVsZW0uYXBwZW5kKG9wdGdyb3VwKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjb25maWdTb3VyY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgdmFyIGl0ZW0gPSBjb25maWdTb3VyY2VbaV07XG4gICAgICAgICRlbGVtLmFwcGVuZChcIjxvcHRpb24gdmFsdWU9J1wiICsgaXRlbS5WYWx1ZSArIFwiJyB0ZXh0PSdcIiArIGl0ZW0uVGV4dCArIFwiJz5cIiArIGl0ZW0uVGV4dCArIFwiPC9vcHRpb24+XCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgICRlbGVtLnZhbCh2YWwpO1xuXG4gICAgaWYgKHR5cGVvZiB0ZW1wbGF0ZS5DaGFuZ2VFdmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICRlbGVtLmNoYW5nZShmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRlbXBsYXRlLkNoYW5nZUV2ZW50KHRoaXMsIF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLmZpbmQoXCJvcHRpb246c2VsZWN0ZWRcIikuYXR0cihcIlZhbHVlXCIpO1xuICAgIHZhciB0ZXh0ID0gZWRpdFN0YXVzSHRtbEVsZW0uZmluZChcIm9wdGlvbjpzZWxlY3RlZFwiKS5hdHRyKFwiVGV4dFwiKTtcblxuICAgIGlmICghdmFsKSB7XG4gICAgICB2YWwgPSBcIlwiO1xuICAgIH1cblxuICAgIGlmICghdGV4dCkge1xuICAgICAgdGV4dCA9IFwiXCI7XG4gICAgfVxuXG4gICAgdmFyICRlbGVtID0gJChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgVmFsdWU9J1wiICsgdmFsICsgXCInIFRleHQ9J1wiICsgdGV4dCArIFwiJz5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX1NlbGVjdFJvd0NoZWNrQm94ID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIHZhbCA9IFwiXCI7XG4gICAgdmFyIGJpbmRuYW1lID0gdGVtcGxhdGUuQmluZE5hbWU7XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IGpzb25EYXRhU2luZ2xlW2JpbmRuYW1lXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGlucHV0IElzU2VyaWFsaXplPSd0cnVlJyB0eXBlPSdjaGVja2JveCcgY2hlY2tlZD0nY2hlY2tlZCcgIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIC8+XCIpO1xuICAgICRlbGVtLmF0dHIoXCJWYWx1ZVwiLCB2YWwpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0NvbXBsZXRlZFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gJChlZGl0U3RhdXNIdG1sRWxlbSkuYXR0cihcIlZhbHVlXCIpO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8aW5wdXQgSXNTZXJpYWxpemU9J3RydWUnIHR5cGU9J2NoZWNrYm94JyAgQmluZE5hbWU9J1wiICsgdGVtcGxhdGUuQmluZE5hbWUgKyBcIicgLz5cIik7XG4gICAgJGVsZW0uYXR0cihcIlZhbHVlXCIsIHZhbCk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICByZXR1cm4gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBFZGl0VGFibGVfVGV4dEJveCA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uaHRtbCgpO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgSXNTZXJpYWxpemU9J3RydWUnIHN0eWxlPSd3aWR0aDogOTglJyAvPlwiKTtcbiAgICAkZWxlbS52YWwodmFsKTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbCArIFwiJz5cIiArIHZhbCArIFwiPC9sYWJlbD5cIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcblxuICAgIGlmICh0eXBlb2YgdGVtcGxhdGUuVmFsaWRhdGUgIT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHRlbXBsYXRlLlZhbGlkYXRlID09ICdmdW5jdGlvbicpIHtcbiAgICAgIHZhciByZXN1bHQgPSB7XG4gICAgICAgIFN1Y2Nlc3M6IHRydWUsXG4gICAgICAgIE1zZzogbnVsbFxuICAgICAgfTtcbiAgICAgIHJlc3VsdC5TdWNjZXNzID0gdGVtcGxhdGUuVmFsaWRhdGUoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDb2x1bW5fU2VsZWN0RGVmYXVsdFZhbHVlID0ge1xuICBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbTogZnVuY3Rpb24gR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIHZpZXdTdGF1c0h0bWxFbGVtLCBqc29uRGF0YXMsIGpzb25EYXRhU2luZ2xlKSB7XG4gICAgdmFyIGRlZmF1bHRUeXBlID0gXCJcIjtcbiAgICB2YXIgZGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICB2YXIgZGVmYXVsdFRleHQgPSBcIlwiO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICBkZWZhdWx0VHlwZSA9IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFR5cGVcIl0gPyBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRUeXBlXCJdIDogXCJcIjtcbiAgICAgIGRlZmF1bHRWYWx1ZSA9IGpzb25EYXRhU2luZ2xlW1wiY29sdW1uRGVmYXVsdFZhbHVlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VmFsdWVcIl0gOiBcIlwiO1xuICAgICAgZGVmYXVsdFRleHQgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRlZmF1bHRUZXh0XCJdID8ganNvbkRhdGFTaW5nbGVbXCJjb2x1bW5EZWZhdWx0VGV4dFwiXSA6IFwiXCI7XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2aWV3U3RhdXNIdG1sRWxlbS5maW5kKFwibGFiZWxcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICgkKHRoaXMpLmF0dHIoXCJCaW5kTmFtZVwiKSA9PSBcImNvbHVtbkRlZmF1bHRUeXBlXCIpIHtcbiAgICAgICAgICBkZWZhdWx0VHlwZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiY29sdW1uRGVmYXVsdFRleHRcIikge1xuICAgICAgICAgIGRlZmF1bHRUZXh0ID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIH0gZWxzZSBpZiAoJCh0aGlzKS5hdHRyKFwiQmluZE5hbWVcIikgPT0gXCJjb2x1bW5EZWZhdWx0VmFsdWVcIikge1xuICAgICAgICAgIGRlZmF1bHRWYWx1ZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB2YXIgJGVsZW0gPSAkKFwiPGRpdj48L2Rpdj5cIik7XG4gICAgdmFyICRpbnB1dFR4dCA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgc3R5bGU9J3dpZHRoOiA5MCUnIHJlYWRvbmx5IC8+XCIpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFR5cGVcIiwgZGVmYXVsdFR5cGUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIGRlZmF1bHRWYWx1ZSk7XG4gICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiLCBkZWZhdWx0VGV4dCk7XG4gICAgJGlucHV0VHh0LnZhbChKQnVpbGQ0RFNlbGVjdFZpZXcuU2VsZWN0RW52VmFyaWFibGUuZm9ybWF0VGV4dChkZWZhdWx0VHlwZSwgZGVmYXVsdFRleHQpKTtcbiAgICB2YXIgJGlucHV0QnRuID0gJChcIjxpbnB1dCBjbGFzcz0nbm9ybWFsYnV0dG9uLXYxJyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDRweDsnIHR5cGU9J2J1dHRvbicgdmFsdWU9Jy4uLicvPlwiKTtcbiAgICAkZWxlbS5hcHBlbmQoJGlucHV0VHh0KS5hcHBlbmQoJGlucHV0QnRuKTtcbiAgICB3aW5kb3cuJFRlbXAkSW5wdXR0eHQgPSAkaW5wdXRUeHQ7XG4gICAgJGlucHV0QnRuLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5iZWdpblNlbGVjdChcIkNvbHVtbl9TZWxlY3REZWZhdWx0VmFsdWVcIik7XG4gICAgfSk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciAkaW5wdXRUeHQgPSBlZGl0U3RhdXNIdG1sRWxlbS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpO1xuXG4gICAgaWYgKCRpbnB1dFR4dC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgZGVmYXVsdFR5cGUgPSAkaW5wdXRUeHQuYXR0cihcImNvbHVtbkRlZmF1bHRUeXBlXCIpO1xuICAgICAgdmFyIGRlZmF1bHRWYWx1ZSA9ICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIpO1xuICAgICAgdmFyIGRlZmF1bHRUZXh0ID0gJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiKTtcbiAgICAgIHZhciAkZWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbD5cIiArIEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KGRlZmF1bHRUeXBlLCBkZWZhdWx0VGV4dCkgKyBcIjwvbGFiZWw+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nY29sdW1uRGVmYXVsdFR5cGUnIFZhbHVlPSdcIiArIGRlZmF1bHRUeXBlICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdjb2x1bW5EZWZhdWx0VGV4dCcgVmFsdWU9J1wiICsgZGVmYXVsdFRleHQgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2NvbHVtbkRlZmF1bHRWYWx1ZScgVmFsdWU9J1wiICsgZGVmYXVsdFZhbHVlICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICByZXR1cm4gJGVsZW07XG4gICAgfVxuXG4gICAgcmV0dXJuICQoXCI8bGFiZWw+PC9sYWJlbD5cIik7XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfSxcbiAgc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZShkZWZhdWx0RGF0YSkge1xuICAgIHZhciAkaW5wdXRUeHQgPSB3aW5kb3cuJFRlbXAkSW5wdXR0eHQ7XG5cbiAgICBpZiAobnVsbCAhPSBkZWZhdWx0RGF0YSkge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VHlwZVwiLCBkZWZhdWx0RGF0YS5UeXBlKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIGRlZmF1bHREYXRhLlZhbHVlKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFRleHRcIiwgZGVmYXVsdERhdGEuVGV4dCk7XG4gICAgICAkaW5wdXRUeHQudmFsKEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KGRlZmF1bHREYXRhLlR5cGUsIGRlZmF1bHREYXRhLlRleHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VHlwZVwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiY29sdW1uRGVmYXVsdFZhbHVlXCIsIFwiXCIpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJjb2x1bW5EZWZhdWx0VGV4dFwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC52YWwoXCJcIik7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29sdW1uX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIgPSB7XG4gIF9maWVsZERhdGFUeXBlQXJyYXk6IG51bGwsXG4gIEdldEZpZWxkRGF0YVR5cGVBcnJheTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZUFycmF5KCkge1xuICAgIGlmICh0aGlzLl9maWVsZERhdGFUeXBlQXJyYXkgPT0gbnVsbCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmMoXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVGaWVsZFR5cGUuZG9cIiwge30sIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBsaXN0ID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKGRhdGEuZGF0YSk7XG5cbiAgICAgICAgICBpZiAobGlzdCAhPSBudWxsICYmIGxpc3QgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBfc2VsZi5fZmllbGREYXRhVHlwZUFycmF5ID0gbGlzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIFwiQWxlcnRMb2FkaW5nUXVlcnlFcnJvclwiLCB7fSwgXCLliqDovb3lrZfmrrXnsbvlnovlpLHotKXvvIFcIiwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZmllbGREYXRhVHlwZUFycmF5O1xuICB9LFxuICBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWUoVmFsdWUpIHtcbiAgICB2YXIgYXJyYXlEYXRhID0gdGhpcy5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqID0gYXJyYXlEYXRhW2ldO1xuXG4gICAgICBpZiAob2JqLlZhbHVlID09IFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH0sXG4gIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQ6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQodGV4dCkge1xuICAgIHZhciBhcnJheURhdGEgPSB0aGlzLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmogPSBhcnJheURhdGFbaV07XG5cbiAgICAgIGlmIChvYmouVGV4dCA9PSB0ZXh0KSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH1cbn07XG52YXIgQ29sdW1uX1NlbGVjdEZpZWxkVHlwZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8c2VsZWN0IC8+XCIpO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtcImNvbHVtbkRhdGFUeXBlTmFtZVwiXTtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZhbCA9IHZpZXdTdGF1c0h0bWxFbGVtLmF0dHIoXCJWYWx1ZVwiKTtcbiAgICB9XG5cbiAgICB2YXIgX2ZpZWxkRGF0YVR5cGVBcnJheSA9IENvbHVtbl9TZWxlY3RGaWVsZFR5cGVEYXRhTG9hZGVyLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBfZmllbGREYXRhVHlwZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdmFsdWUgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlZhbHVlO1xuICAgICAgdmFyIHRleHQgPSBfZmllbGREYXRhVHlwZUFycmF5W2ldLlRleHQ7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8b3B0aW9uIHZhbHVlPSdcIiArIHZhbHVlICsgXCInPlwiICsgdGV4dCArIFwiPC9vcHRpb24+XCIpO1xuICAgIH1cblxuICAgIGlmICh2YWwgIT0gXCJcIikge1xuICAgICAgJGVsZW0udmFsKHZhbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICRlbGVtLnZhbChDb2x1bW5fU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlUZXh0KFwi5a2X56ym5LiyXCIpLlZhbHVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbHVlID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyIHRleHQgPSBDb2x1bW5fU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZSh2YWx1ZSkuVGV4dDtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWx1ZSArIFwiJz5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX0ZpZWxkTmFtZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciBiaW5kbmFtZSA9IHRlbXBsYXRlLkJpbmROYW1lO1xuXG4gICAgaWYgKHRlbXBsYXRlLkRlZmF1bHRWYWx1ZSAhPSB1bmRlZmluZWQgJiYgdGVtcGxhdGUuRGVmYXVsdFZhbHVlICE9IG51bGwpIHtcbiAgICAgIHZhciB2YWwgPSBFZGl0VGFibGVEZWZhdWxlVmFsdWUuR2V0VmFsdWUodGVtcGxhdGUpO1xuICAgIH1cblxuICAgIGlmIChqc29uRGF0YVNpbmdsZSAhPSBudWxsICYmIGpzb25EYXRhU2luZ2xlICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0ganNvbkRhdGFTaW5nbGVbYmluZG5hbWVdO1xuICAgIH1cblxuICAgIGlmICh2aWV3U3RhdXNIdG1sRWxlbSAhPSBudWxsICYmIHZpZXdTdGF1c0h0bWxFbGVtICE9IHVuZGVmaW5lZCkge1xuICAgICAgdmFsID0gdmlld1N0YXVzSHRtbEVsZW0uaHRtbCgpO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8aW5wdXQgdHlwZT0ndGV4dCcgc3R5bGU9J3dpZHRoOiA5OCUnIC8+XCIpO1xuICAgICRlbGVtLnZhbCh2YWwpO1xuICAgICRlbGVtLmF0dHIoXCJCaW5kTmFtZVwiLCB0ZW1wbGF0ZS5CaW5kTmFtZSk7XG4gICAgJGVsZW0uYXR0cihcIlZhbFwiLCB2YWwpO1xuICAgICRlbGVtLmF0dHIoXCJJc1NlcmlhbGl6ZVwiLCBcInRydWVcIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKS50b1VwcGVyQ2FzZSgpO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdcIiArIHRlbXBsYXRlLkJpbmROYW1lICsgXCInIFZhbHVlPSdcIiArIHZhbCArIFwiJz5cIiArIHZhbCArIFwiPC9sYWJlbD5cIik7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlOiBmdW5jdGlvbiBWYWxpZGF0ZVRvQ29tcGxldGVkRW5hYmxlKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciB2YWwgPSBlZGl0U3RhdXNIdG1sRWxlbS52YWwoKTtcbiAgICB2YXIgcmVzdWx0ID0gRWRpdFRhYmxlVmFsaWRhdGUuVmFsaWRhdGUodmFsLCB0ZW1wbGF0ZSk7XG5cbiAgICBpZiAocmVzdWx0LlN1Y2Nlc3MpIHtcbiAgICAgIGhvc3RUYWJsZS5maW5kKFwiW3JlbmRlcmVyPUVkaXRUYWJsZV9GaWVsZE5hbWVdXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2VyaXRlbSA9ICQodGhpcyk7XG4gICAgICAgIHNlcml0ZW0uZmluZChcImxhYmVsXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHZhciBsYWJlbGl0ZW0gPSAkKHRoaXMpO1xuXG4gICAgICAgICAgaWYgKGxhYmVsaXRlbS50ZXh0KCkgPT0gdmFsIHx8IGxhYmVsaXRlbS50ZXh0KCkgPT0gdmFsLnRvVXBwZXJDYXNlKCkpIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IHtcbiAgICAgICAgICAgICAgU3VjY2VzczogZmFsc2UsXG4gICAgICAgICAgICAgIE1zZzogXCJb5a2X5q615ZCN56ewXeS4jeiDvemHjeWkjSFcIlxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEVkaXRUYWJsZV9TZWxlY3REZWZhdWx0VmFsdWUgPSB7XG4gIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfRWRpdFN0YXR1c19IdG1sRWxlbShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgdmlld1N0YXVzSHRtbEVsZW0sIGpzb25EYXRhcywganNvbkRhdGFTaW5nbGUpIHtcbiAgICB2YXIgZmllbGREZWZhdWx0VHlwZSA9IFwiXCI7XG4gICAgdmFyIGZpZWxkRGVmYXVsdFZhbHVlID0gXCJcIjtcbiAgICB2YXIgZmllbGREZWZhdWx0VGV4dCA9IFwiXCI7XG5cbiAgICBpZiAoanNvbkRhdGFTaW5nbGUgIT0gbnVsbCAmJiBqc29uRGF0YVNpbmdsZSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGZpZWxkRGVmYXVsdFR5cGUgPSBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFR5cGVcIl0gPyBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFR5cGVcIl0gOiBcIlwiO1xuICAgICAgZmllbGREZWZhdWx0VmFsdWUgPSBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGVmYXVsdFZhbHVlXCJdID8ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRWYWx1ZVwiXSA6IFwiXCI7XG4gICAgICBmaWVsZERlZmF1bHRUZXh0ID0ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRUZXh0XCJdID8ganNvbkRhdGFTaW5nbGVbXCJmaWVsZERlZmF1bHRUZXh0XCJdIDogXCJcIjtcbiAgICB9XG5cbiAgICBpZiAodmlld1N0YXVzSHRtbEVsZW0gIT0gbnVsbCAmJiB2aWV3U3RhdXNIdG1sRWxlbSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIHZpZXdTdGF1c0h0bWxFbGVtLmZpbmQoXCJsYWJlbFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiZmllbGREZWZhdWx0VHlwZVwiKSB7XG4gICAgICAgICAgZmllbGREZWZhdWx0VHlwZSA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiZmllbGREZWZhdWx0VGV4dFwiKSB7XG4gICAgICAgICAgZmllbGREZWZhdWx0VGV4dCA9ICQodGhpcykuYXR0cihcIlZhbHVlXCIpO1xuICAgICAgICB9IGVsc2UgaWYgKCQodGhpcykuYXR0cihcIkJpbmROYW1lXCIpID09IFwiZmllbGREZWZhdWx0VmFsdWVcIikge1xuICAgICAgICAgIGZpZWxkRGVmYXVsdFZhbHVlID0gJCh0aGlzKS5hdHRyKFwiVmFsdWVcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHZhciAkZWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcbiAgICB2YXIgJGlucHV0VHh0ID0gJChcIjxpbnB1dCB0eXBlPSd0ZXh0JyBzdHlsZT0nd2lkdGg6IDkwJScgcmVhZG9ubHkgLz5cIik7XG4gICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUeXBlXCIsIGZpZWxkRGVmYXVsdFR5cGUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VmFsdWVcIiwgZmllbGREZWZhdWx0VmFsdWUpO1xuICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VGV4dFwiLCBmaWVsZERlZmF1bHRUZXh0KTtcbiAgICAkaW5wdXRUeHQudmFsKEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KGZpZWxkRGVmYXVsdFR5cGUsIGZpZWxkRGVmYXVsdFRleHQpKTtcbiAgICB2YXIgJGlucHV0QnRuID0gJChcIjxpbnB1dCBjbGFzcz0nbm9ybWFsYnV0dG9uLXYxJyBzdHlsZT0nbWFyZ2luLWxlZnQ6IDRweDsnIHR5cGU9J2J1dHRvbicgdmFsdWU9Jy4uLicvPlwiKTtcbiAgICAkZWxlbS5hcHBlbmQoJGlucHV0VHh0KS5hcHBlbmQoJGlucHV0QnRuKTtcbiAgICB3aW5kb3cuJFRlbXAkSW5wdXR0eHQgPSAkaW5wdXRUeHQ7XG4gICAgJGlucHV0QnRuLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICh3aW5kb3cudGFibGVEZXNpb24pIHtcbiAgICAgICAgdGFibGVEZXNpb24uc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nQmVnaW4oRWRpdFRhYmxlX1NlbGVjdERlZmF1bHRWYWx1ZSwgbnVsbCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cucGFyZW50Lmxpc3REZXNpZ24uc2VsZWN0RGVmYXVsdFZhbHVlRGlhbG9nQmVnaW4od2luZG93LCBudWxsKTtcbiAgICAgICAgd2luZG93Ll9TZWxlY3RCaW5kT2JqID0ge1xuICAgICAgICAgIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWU6IGZ1bmN0aW9uIHNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUocmVzdWx0KSB7XG4gICAgICAgICAgICBFZGl0VGFibGVfU2VsZWN0RGVmYXVsdFZhbHVlLnNldFNlbGVjdEVudlZhcmlhYmxlUmVzdWx0VmFsdWUocmVzdWx0KTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuICRlbGVtO1xuICB9LFxuICBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtOiBmdW5jdGlvbiBHZXRfQ29tcGxldGVkU3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCBlZGl0U3RhdXNIdG1sRWxlbSkge1xuICAgIHZhciAkaW5wdXRUeHQgPSBlZGl0U3RhdXNIdG1sRWxlbS5maW5kKFwiaW5wdXRbdHlwZT0ndGV4dCddXCIpO1xuXG4gICAgaWYgKCRpbnB1dFR4dC5sZW5ndGggPiAwKSB7XG4gICAgICB2YXIgZGVmYXVsdFR5cGUgPSAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFR5cGVcIik7XG4gICAgICB2YXIgZGVmYXVsdFZhbHVlID0gJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRWYWx1ZVwiKTtcbiAgICAgIHZhciBkZWZhdWx0VGV4dCA9ICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VGV4dFwiKTtcbiAgICAgIHZhciAkZWxlbSA9ICQoXCI8ZGl2PjwvZGl2PlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbD5cIiArIEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KGRlZmF1bHRUeXBlLCBkZWZhdWx0VGV4dCkgKyBcIjwvbGFiZWw+XCIpO1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nZmllbGREZWZhdWx0VHlwZScgVmFsdWU9J1wiICsgZGVmYXVsdFR5cGUgKyBcIicgc3R5bGU9J2Rpc3BsYXk6bm9uZScvPlwiKTtcbiAgICAgICRlbGVtLmFwcGVuZChcIjxsYWJlbCBJc1NlcmlhbGl6ZT0ndHJ1ZScgQmluZE5hbWU9J2ZpZWxkRGVmYXVsdFRleHQnIFZhbHVlPSdcIiArIGRlZmF1bHRUZXh0ICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICAkZWxlbS5hcHBlbmQoXCI8bGFiZWwgSXNTZXJpYWxpemU9J3RydWUnIEJpbmROYW1lPSdmaWVsZERlZmF1bHRWYWx1ZScgVmFsdWU9J1wiICsgZGVmYXVsdFZhbHVlICsgXCInIHN0eWxlPSdkaXNwbGF5Om5vbmUnLz5cIik7XG4gICAgICByZXR1cm4gJGVsZW07XG4gICAgfVxuXG4gICAgcmV0dXJuICQoXCI8bGFiZWw+PC9sYWJlbD5cIik7XG4gIH0sXG4gIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGU6IGZ1bmN0aW9uIFZhbGlkYXRlVG9Db21wbGV0ZWRFbmFibGUoX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbCA9IGVkaXRTdGF1c0h0bWxFbGVtLnZhbCgpO1xuICAgIHJldHVybiBFZGl0VGFibGVWYWxpZGF0ZS5WYWxpZGF0ZSh2YWwsIHRlbXBsYXRlKTtcbiAgfSxcbiAgc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZTogZnVuY3Rpb24gc2V0U2VsZWN0RW52VmFyaWFibGVSZXN1bHRWYWx1ZShkZWZhdWx0RGF0YSkge1xuICAgIHZhciAkaW5wdXRUeHQgPSB3aW5kb3cuJFRlbXAkSW5wdXR0eHQ7XG5cbiAgICBpZiAobnVsbCAhPSBkZWZhdWx0RGF0YSkge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUeXBlXCIsIGRlZmF1bHREYXRhLlR5cGUpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRWYWx1ZVwiLCBkZWZhdWx0RGF0YS5WYWx1ZSk7XG4gICAgICAkaW5wdXRUeHQuYXR0cihcImZpZWxkRGVmYXVsdFRleHRcIiwgZGVmYXVsdERhdGEuVGV4dCk7XG4gICAgICAkaW5wdXRUeHQudmFsKEpCdWlsZDREU2VsZWN0Vmlldy5TZWxlY3RFbnZWYXJpYWJsZS5mb3JtYXRUZXh0KGRlZmF1bHREYXRhLlR5cGUsIGRlZmF1bHREYXRhLlRleHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRUeXBlXCIsIFwiXCIpO1xuICAgICAgJGlucHV0VHh0LmF0dHIoXCJmaWVsZERlZmF1bHRWYWx1ZVwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC5hdHRyKFwiZmllbGREZWZhdWx0VGV4dFwiLCBcIlwiKTtcbiAgICAgICRpbnB1dFR4dC52YWwoXCJcIik7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIgPSB7XG4gIF9maWVsZERhdGFUeXBlQXJyYXk6IG51bGwsXG4gIEdldEZpZWxkRGF0YVR5cGVBcnJheTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZUFycmF5KCkge1xuICAgIGlmICh0aGlzLl9maWVsZERhdGFUeXBlQXJyYXkgPT0gbnVsbCkge1xuICAgICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmMoXCIvUGxhdEZvcm1SZXN0L0J1aWxkZXIvRGF0YVN0b3JhZ2UvRGF0YUJhc2UvVGFibGUvR2V0VGFibGVGaWVsZFR5cGUuZG9cIiwge30sIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gdHJ1ZSkge1xuICAgICAgICAgIHZhciBsaXN0ID0gSnNvblV0aWxpdHkuU3RyaW5nVG9Kc29uKGRhdGEuZGF0YSk7XG5cbiAgICAgICAgICBpZiAobGlzdCAhPSBudWxsICYmIGxpc3QgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICBfc2VsZi5fZmllbGREYXRhVHlwZUFycmF5ID0gbGlzdDtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIFwiQWxlcnRMb2FkaW5nUXVlcnlFcnJvclwiLCB7fSwgXCLliqDovb3lrZfmrrXnsbvlnovlpLHotKXvvIFcIiwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fZmllbGREYXRhVHlwZUFycmF5O1xuICB9LFxuICBHZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZTogZnVuY3Rpb24gR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VmFsdWUoVmFsdWUpIHtcbiAgICB2YXIgYXJyYXlEYXRhID0gdGhpcy5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgb2JqID0gYXJyYXlEYXRhW2ldO1xuXG4gICAgICBpZiAob2JqLlZhbHVlID09IFZhbHVlKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH0sXG4gIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQ6IGZ1bmN0aW9uIEdldEZpZWxkRGF0YVR5cGVPYmplY3RCeVRleHQodGV4dCkge1xuICAgIHZhciBhcnJheURhdGEgPSB0aGlzLkdldEZpZWxkRGF0YVR5cGVBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBvYmogPSBhcnJheURhdGFbaV07XG5cbiAgICAgIGlmIChvYmouVGV4dCA9PSB0ZXh0KSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgICB9XG4gICAgfVxuXG4gICAgYWxlcnQoXCLmib7kuI3liLDmjIflrprnmoTmlbDmja7nsbvlnovvvIzor7fnoa7orqTmmK/lkKbmlK/mjIHor6XnsbvlnovvvIFcIik7XG4gIH1cbn07XG52YXIgRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZSA9IHtcbiAgR2V0X0VkaXRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9FZGl0U3RhdHVzX0h0bWxFbGVtKF9jb25maWcsIHRlbXBsYXRlLCBob3N0Q2VsbCwgaG9zdFJvdywgaG9zdFRhYmxlLCB2aWV3U3RhdXNIdG1sRWxlbSwganNvbkRhdGFzLCBqc29uRGF0YVNpbmdsZSkge1xuICAgIHZhciB2YWwgPSBcIlwiO1xuICAgIHZhciAkZWxlbSA9ICQoXCI8c2VsZWN0IC8+XCIpO1xuXG4gICAgaWYgKGpzb25EYXRhU2luZ2xlICE9IG51bGwgJiYganNvbkRhdGFTaW5nbGUgIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSBqc29uRGF0YVNpbmdsZVtcImZpZWxkRGF0YVR5cGVcIl07XG4gICAgfVxuXG4gICAgaWYgKHZpZXdTdGF1c0h0bWxFbGVtICE9IG51bGwgJiYgdmlld1N0YXVzSHRtbEVsZW0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICB2YWwgPSB2aWV3U3RhdXNIdG1sRWxlbS5hdHRyKFwiVmFsdWVcIik7XG4gICAgfVxuXG4gICAgdmFyIF9maWVsZERhdGFUeXBlQXJyYXkgPSBFZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX2ZpZWxkRGF0YVR5cGVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHZhbHVlID0gX2ZpZWxkRGF0YVR5cGVBcnJheVtpXS5WYWx1ZTtcbiAgICAgIHZhciB0ZXh0ID0gX2ZpZWxkRGF0YVR5cGVBcnJheVtpXS5UZXh0O1xuICAgICAgJGVsZW0uYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT0nXCIgKyB2YWx1ZSArIFwiJz5cIiArIHRleHQgKyBcIjwvb3B0aW9uPlwiKTtcbiAgICB9XG5cbiAgICBpZiAodmFsICE9IFwiXCIpIHtcbiAgICAgICRlbGVtLnZhbCh2YWwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkZWxlbS52YWwoRWRpdFRhYmxlX1NlbGVjdEZpZWxkVHlwZURhdGFMb2FkZXIuR2V0RmllbGREYXRhVHlwZU9iamVjdEJ5VGV4dChcIuWtl+espuS4slwiKS5WYWx1ZSk7XG4gICAgfVxuXG4gICAgJGVsZW0uY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuXG4gICAgICBpZiAodmFsID09IFwi5pW05pWwXCIpIHtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsID09IFwi5bCP5pWwXCIpIHtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgZmFsc2UpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgxMCk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLmF0dHIoXCJkaXNhYmxlZFwiLCBmYWxzZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgyKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsID09IFwi5pel5pyf5pe26Ze0XCIpIHtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDIwKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIHRydWUpO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoMCk7XG4gICAgICB9IGVsc2UgaWYgKHZhbCA9PSBcIuWtl+espuS4slwiKSB7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikuYXR0cihcImRpc2FibGVkXCIsIGZhbHNlKTtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS52YWwoNTApO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgIH0gZWxzZSBpZiAodmFsID09IFwi6ZW/5a2X56ym5LiyXCIpIHtcbiAgICAgICAgJChob3N0Q2VsbCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5maW5kKFwiaW5wdXRcIikudmFsKDApO1xuICAgICAgICAkKGhvc3RDZWxsKS5uZXh0KCkubmV4dCgpLmZpbmQoXCJpbnB1dFwiKS5hdHRyKFwiZGlzYWJsZWRcIiwgdHJ1ZSk7XG4gICAgICAgICQoaG9zdENlbGwpLm5leHQoKS5uZXh0KCkuZmluZChcImlucHV0XCIpLnZhbCgwKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gJGVsZW07XG4gIH0sXG4gIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW06IGZ1bmN0aW9uIEdldF9Db21wbGV0ZWRTdGF0dXNfSHRtbEVsZW0oX2NvbmZpZywgdGVtcGxhdGUsIGhvc3RDZWxsLCBob3N0Um93LCBob3N0VGFibGUsIGVkaXRTdGF1c0h0bWxFbGVtKSB7XG4gICAgdmFyIHZhbHVlID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgdmFyIHRleHQgPSBFZGl0VGFibGVfU2VsZWN0RmllbGRUeXBlRGF0YUxvYWRlci5HZXRGaWVsZERhdGFUeXBlT2JqZWN0QnlWYWx1ZSh2YWx1ZSkuVGV4dDtcbiAgICB2YXIgJGVsZW0gPSAkKFwiPGxhYmVsIElzU2VyaWFsaXplPSd0cnVlJyBCaW5kTmFtZT0nXCIgKyB0ZW1wbGF0ZS5CaW5kTmFtZSArIFwiJyBWYWx1ZT0nXCIgKyB2YWx1ZSArIFwiJz5cIiArIHRleHQgKyBcIjwvbGFiZWw+XCIpO1xuICAgIHJldHVybiAkZWxlbTtcbiAgfSxcbiAgVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZTogZnVuY3Rpb24gVmFsaWRhdGVUb0NvbXBsZXRlZEVuYWJsZShfY29uZmlnLCB0ZW1wbGF0ZSwgaG9zdENlbGwsIGhvc3RSb3csIGhvc3RUYWJsZSwgZWRpdFN0YXVzSHRtbEVsZW0pIHtcbiAgICB2YXIgdmFsID0gZWRpdFN0YXVzSHRtbEVsZW0udmFsKCk7XG4gICAgcmV0dXJuIEVkaXRUYWJsZVZhbGlkYXRlLlZhbGlkYXRlKHZhbCwgdGVtcGxhdGUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgVHJlZVRhYmxlQ29uZmlnID0ge1xuICBDYW5EZWxldGVXaGVuSGFzQ2hpbGQ6IGZhbHNlLFxuICBJZEZpZWxkOiBcIk9yZ2FuX0lkXCIsXG4gIFJvd0lkUHJlZml4OiBcIlRyZWVUYWJsZV9cIixcbiAgTG9hZENoaWxkSnNvblVSTDogXCJcIixcbiAgTG9hZENoaWxkRnVuYzogbnVsbCxcbiAgT3BlbkxldmVsOiAxLFxuICBDaGlsZFRlc3RGaWVsZDogXCJDaGlsZF9Db3VudFwiLFxuICBUZW1wbGF0ZXM6IFt7XG4gICAgVGl0bGU6IFwi57uE57uH5py65p6E5ZCN56ewXCIsXG4gICAgRmllbGROYW1lOiBcIk9yZ2FuX05hbWVcIixcbiAgICBUaXRsZUNlbGxDbGFzc05hbWU6IFwiVGl0bGVDZWxsXCIsXG4gICAgUmVuZGVyZXI6IFwiTGFibGVcIixcbiAgICBIaWRkZW46IGZhbHNlLFxuICAgIFRpdGxlQ2VsbEF0dHJzOiB7fSxcbiAgICBXaWR0aDogXCI1MCVcIlxuICB9LCB7XG4gICAgVGl0bGU6IFwi57uE57uH5py65p6E57yp5YaZ5ZCN56ewXCIsXG4gICAgRmllbGROYW1lOiBcIk9yZ2FuX1Nob3J0TmFtZVwiLFxuICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICBSZW5kZXJlcjogXCJMYWJsZVwiLFxuICAgIEhpZGRlbjogZmFsc2UsXG4gICAgVGl0bGVDZWxsQXR0cnM6IHt9LFxuICAgIFdpZHRoOiBcIjIwJVwiXG4gIH0sIHtcbiAgICBUaXRsZTogXCLnu4Tnu4fnvJblj7dcIixcbiAgICBGaWVsZE5hbWU6IFwiT3JnYW5fQ29kZVwiLFxuICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICBSZW5kZXJlcjogXCJMYWJsZVwiLFxuICAgIEhpZGRlbjogZmFsc2UsXG4gICAgVGl0bGVDZWxsQXR0cnM6IHt9LFxuICAgIFdpZHRoOiBcIjIwJVwiXG4gIH0sIHtcbiAgICBUaXRsZTogXCLnu4Tnu4dJRFwiLFxuICAgIEZpZWxkTmFtZTogXCJPcmdhbl9JZFwiLFxuICAgIFRpdGxlQ2VsbENsYXNzTmFtZTogXCJUaXRsZUNlbGxcIixcbiAgICBSZW5kZXJlcjogXCJMYWJsZVwiLFxuICAgIEhpZGRlbjogZmFsc2UsXG4gICAgVGl0bGVDZWxsQXR0cnM6IHt9LFxuICAgIFdpZHRoOiBcIjEwXCJcbiAgfV0sXG4gIFRhYmxlQ2xhc3M6IFwiVHJlZVRhYmxlXCIsXG4gIFJlbmRlcmVyVG86IFwiZGl2RWRpdFRhYmxlXCIsXG4gIFRhYmxlSWQ6IFwiVHJlZVRhYmxlXCIsXG4gIFRhYmxlQXR0cnM6IHtcbiAgICBjZWxscGFkZGluZzogXCIwXCIsXG4gICAgY2VsbHNwYWNpbmc6IFwiMFwiLFxuICAgIGJvcmRlcjogXCIwXCJcbiAgfVxufTtcbnZhciBUcmVlVGFibGVKc29uRGF0YSA9IHtcbiAgT3JnYW5fSWQ6IFwiMFwiLFxuICBPcmdhbl9OYW1lOiBcInJvb3RcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjJcIixcbiAgT3JnYW5fQ29kZTogXCIyXCIsXG4gIENoaWxkX0NvdW50OiAyLFxuICBOb2RlczogW3tcbiAgICBPcmdhbl9JZDogXCIxXCIsXG4gICAgT3JnYW5fTmFtZTogXCIxT3JnYW5fTmFtZVwiLFxuICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIxXCIsXG4gICAgT3JnYW5fQ29kZTogXCIxXCIsXG4gICAgQ2hpbGRfQ291bnQ6IDIsXG4gICAgTm9kZXM6IFt7XG4gICAgICBPcmdhbl9JZDogXCIxLTFcIixcbiAgICAgIE9yZ2FuX05hbWU6IFwiMS0xT3JnYW5fTmFtZVwiLFxuICAgICAgT3JnYW5fU2hvcnROYW1lOiBcIjEtMVwiLFxuICAgICAgT3JnYW5fQ29kZTogXCIxLTFcIixcbiAgICAgIENoaWxkX0NvdW50OiAxLFxuICAgICAgTm9kZXM6IFt7XG4gICAgICAgIE9yZ2FuX0lkOiBcIjEtMS0xXCIsXG4gICAgICAgIE9yZ2FuX05hbWU6IFwiMS0xLTFPcmdhbl9OYW1lXCIsXG4gICAgICAgIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTEtMVwiLFxuICAgICAgICBPcmdhbl9Db2RlOiBcIjEtMVwiLFxuICAgICAgICBDaGlsZF9Db3VudDogMFxuICAgICAgfV1cbiAgICB9LCB7XG4gICAgICBPcmdhbl9JZDogXCIxLTJcIixcbiAgICAgIE9yZ2FuX05hbWU6IFwiMS0yT3JnYW5fTmFtZVwiLFxuICAgICAgT3JnYW5fU2hvcnROYW1lOiBcIjEtMlwiLFxuICAgICAgT3JnYW5fQ29kZTogXCIxLTJcIixcbiAgICAgIENoaWxkX0NvdW50OiAwXG4gICAgfV1cbiAgfSwge1xuICAgIE9yZ2FuX0lkOiBcIjJcIixcbiAgICBPcmdhbl9OYW1lOiBcIjJPcmdhbl9OYW1lXCIsXG4gICAgT3JnYW5fU2hvcnROYW1lOiBcIjJcIixcbiAgICBPcmdhbl9Db2RlOiBcIjJcIixcbiAgICBDaGlsZF9Db3VudDogMFxuICB9LCB7XG4gICAgT3JnYW5fSWQ6IFwiM1wiLFxuICAgIE9yZ2FuX05hbWU6IFwiM09yZ2FuX05hbWVcIixcbiAgICBPcmdhbl9TaG9ydE5hbWU6IFwiM1wiLFxuICAgIE9yZ2FuX0NvZGU6IFwiM1wiLFxuICAgIENoaWxkX0NvdW50OiAwXG4gIH0sIHtcbiAgICBPcmdhbl9JZDogXCI0XCIsXG4gICAgT3JnYW5fTmFtZTogXCI0T3JnYW5fTmFtZVwiLFxuICAgIE9yZ2FuX1Nob3J0TmFtZTogXCI0XCIsXG4gICAgT3JnYW5fQ29kZTogXCI0XCIsXG4gICAgQ2hpbGRfQ291bnQ6IDBcbiAgfV1cbn07XG52YXIgVHJlZVRhYmxlSnNvbkRhdGFMaXN0ID0gW3tcbiAgT3JnYW5fSWQ6IFwiMFwiLFxuICBPcmdhbl9OYW1lOiBcInJvb3RcIixcbiAgT3JnYW5fU2hvcnROYW1lOiBcIjJcIixcbiAgT3JnYW5fQ29kZTogXCIyXCIsXG4gIENoaWxkX0NvdW50OiAyXG59LCB7XG4gIE9yZ2FuX0lkOiBcIjFcIixcbiAgT3JnYW5fTmFtZTogXCIxT3JnYW5fTmFtZVwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMVwiLFxuICBPcmdhbl9Db2RlOiBcIjFcIixcbiAgQ2hpbGRfQ291bnQ6IDIsXG4gIFBhcmVudF9JZDogXCIwXCJcbn0sIHtcbiAgT3JnYW5fSWQ6IFwiMlwiLFxuICBPcmdhbl9OYW1lOiBcIjJPcmdhbl9OYW1lXCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIyXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMlwiLFxuICBDaGlsZF9Db3VudDogMCxcbiAgUGFyZW50X0lkOiBcIjBcIlxufSwge1xuICBPcmdhbl9JZDogXCIxLTFcIixcbiAgT3JnYW5fTmFtZTogXCIxLTFPcmdhbl9OYW1lXCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTFcIixcbiAgT3JnYW5fQ29kZTogXCIxLTFcIixcbiAgQ2hpbGRfQ291bnQ6IDEsXG4gIFBhcmVudF9JZDogXCIxXCJcbn0sIHtcbiAgT3JnYW5fSWQ6IFwiMS0yXCIsXG4gIE9yZ2FuX05hbWU6IFwiMS0yT3JnYW5fTmFtZVwiLFxuICBPcmdhbl9TaG9ydE5hbWU6IFwiMS0yXCIsXG4gIE9yZ2FuX0NvZGU6IFwiMS0yXCIsXG4gIENoaWxkX0NvdW50OiAwLFxuICBQYXJlbnRfSWQ6IFwiMVwiXG59LCB7XG4gIE9yZ2FuX0lkOiBcIjEtMS0xXCIsXG4gIE9yZ2FuX05hbWU6IFwiMS0xLTFPcmdhbl9OYW1lXCIsXG4gIE9yZ2FuX1Nob3J0TmFtZTogXCIxLTEtMVwiLFxuICBPcmdhbl9Db2RlOiBcIjEtMVwiLFxuICBDaGlsZF9Db3VudDogMCxcbiAgUGFyZW50X0lkOiBcIjEtMVwiXG59XTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFRyZWVUYWJsZSA9IHtcbiAgXyRQcm9wX1RhYmxlRWxlbTogbnVsbCxcbiAgXyRQcm9wX1JlbmRlcmVyVG9FbGVtOiBudWxsLFxuICBfUHJvcF9Db25maWc6IG51bGwsXG4gIF9Qcm9wX0pzb25EYXRhOiBudWxsLFxuICBfUHJvcF9BdXRvT3BlbkxldmVsOiAwLFxuICBfUHJvcF9GaXJzdENvbHVtbl9JbmRlbjogMjAsXG4gIF9Qcm9wX0N1cnJlbnRTZWxlY3RlZFJvd0lkOiBudWxsLFxuICBJbml0aWFsaXphdGlvbjogZnVuY3Rpb24gSW5pdGlhbGl6YXRpb24oX2NvbmZpZykge1xuICAgIHRoaXMuX1Byb3BfQ29uZmlnID0gX2NvbmZpZztcbiAgICB0aGlzLl8kUHJvcF9SZW5kZXJlclRvRWxlbSA9ICQoXCIjXCIgKyB0aGlzLl9Qcm9wX0NvbmZpZy5SZW5kZXJlclRvKTtcbiAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0gPSB0aGlzLkNyZWF0ZVRhYmxlKCk7XG5cbiAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uYXBwZW5kKHRoaXMuQ3JlYXRlVGFibGVUaXRsZVJvdygpKTtcblxuICAgIHRoaXMuXyRQcm9wX1JlbmRlcmVyVG9FbGVtLmFwcGVuZCh0aGlzLl8kUHJvcF9UYWJsZUVsZW0pO1xuICB9LFxuICBMb2FkSnNvbkRhdGE6IGZ1bmN0aW9uIExvYWRKc29uRGF0YShqc29uRGF0YXMpIHtcbiAgICBpZiAoanNvbkRhdGFzICE9IG51bGwgJiYganNvbkRhdGFzICE9IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fUHJvcF9Kc29uRGF0YSA9IGpzb25EYXRhcztcbiAgICAgIHRoaXMuX1Byb3BfQXV0b09wZW5MZXZlbCA9IHRoaXMuX1Byb3BfQ29uZmlnLk9wZW5MZXZlbDtcblxuICAgICAgdmFyIHJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKGpzb25EYXRhcyk7XG5cbiAgICAgIHRoaXMuX0NyZWF0ZVJvb3RSb3coanNvbkRhdGFzLCByb3dJZCk7XG5cbiAgICAgIHRoaXMuX0xvb3BDcmVhdGVSb3coanNvbkRhdGFzLCBqc29uRGF0YXMuTm9kZXMsIDEsIHJvd0lkKTtcblxuICAgICAgdGhpcy5SZW5kZXJlclN0eWxlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsZXJ0KFwiSnNvbiBEYXRhIE9iamVjdCBFcnJvclwiKTtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVSb290Um93OiBmdW5jdGlvbiBfQ3JlYXRlUm9vdFJvdyhwYXJlbnRqc29uTm9kZSwgcGFyZW50SWRMaXN0KSB7XG4gICAgdmFyIHJvd0VsZW0gPSB0aGlzLkNyZWF0ZVJvd0VsZW0ocGFyZW50anNvbk5vZGUsIDAsIG51bGwsIHRydWUsIHBhcmVudElkTGlzdCk7XG5cbiAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uYXBwZW5kKHJvd0VsZW0pO1xuXG4gICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKHBhcmVudGpzb25Ob2RlLCAwKTtcbiAgICB0aGlzLlNldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3QocGFyZW50anNvbk5vZGUsIHBhcmVudElkTGlzdCk7XG4gIH0sXG4gIF9Mb29wQ3JlYXRlUm93OiBmdW5jdGlvbiBfTG9vcENyZWF0ZVJvdyhwYXJlbnRqc29uTm9kZSwganNvbk5vZGVBcnJheSwgY3VycmVudExldmVsLCBwYXJlbnRJZExpc3QpIHtcbiAgICB0aGlzLl9Qcm9wX0NvbmZpZy5Jc09wZW5BTEw7XG5cbiAgICBpZiAoanNvbk5vZGVBcnJheSAhPSB1bmRlZmluZWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwganNvbk5vZGVBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICB2YXIgaXRlbSA9IGpzb25Ob2RlQXJyYXlbaV07XG5cbiAgICAgICAgdmFyIHJvd0lzT3BlbiA9IHRoaXMuX1Rlc3RSb3dJc09wZW4oY3VycmVudExldmVsKTtcblxuICAgICAgICB2YXIgcm93SWQgPSB0aGlzLl9HZXRSb3dEYXRhSWQoaXRlbSk7XG5cbiAgICAgICAgdmFyIF9wSWRMaXN0ID0gdGhpcy5fQ3JlYXRlUGFyZW50SWRMaXN0KHBhcmVudElkTGlzdCwgcm93SWQpO1xuXG4gICAgICAgIHRoaXMuU2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChpdGVtLCBjdXJyZW50TGV2ZWwpO1xuICAgICAgICB0aGlzLlNldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3QoaXRlbSwgX3BJZExpc3QpO1xuICAgICAgICB2YXIgcm93RWxlbSA9IHRoaXMuQ3JlYXRlUm93RWxlbShpdGVtLCBjdXJyZW50TGV2ZWwsIHBhcmVudGpzb25Ob2RlLCByb3dJc09wZW4sIF9wSWRMaXN0KTtcblxuICAgICAgICB0aGlzLl8kUHJvcF9UYWJsZUVsZW0uYXBwZW5kKHJvd0VsZW0pO1xuXG4gICAgICAgIGlmIChpdGVtLk5vZGVzICE9IHVuZGVmaW5lZCAmJiBpdGVtLk5vZGVzICE9IG51bGwgJiYgaXRlbS5Ob2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgdmFyIF90cCA9IGN1cnJlbnRMZXZlbCArIDE7XG5cbiAgICAgICAgICB0aGlzLl9Mb29wQ3JlYXRlUm93KGl0ZW0sIGl0ZW0uTm9kZXMsIF90cCwgX3BJZExpc3QpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBDcmVhdGVUYWJsZTogZnVuY3Rpb24gQ3JlYXRlVGFibGUoKSB7XG4gICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWc7XG5cbiAgICB2YXIgX2VkaXRUYWJsZSA9ICQoXCI8dGFibGUgLz5cIik7XG5cbiAgICBfZWRpdFRhYmxlLmFkZENsYXNzKF9DLlRhYmxlQ2xhc3MpO1xuXG4gICAgX2VkaXRUYWJsZS5hdHRyKFwiSWRcIiwgX0MuVGFibGVJZCk7XG5cbiAgICBfZWRpdFRhYmxlLmF0dHIoX0MuVGFibGVBdHRycyk7XG5cbiAgICByZXR1cm4gX2VkaXRUYWJsZTtcbiAgfSxcbiAgU2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbDogZnVuY3Rpb24gU2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChqc29uRGF0YSwgdmFsdWUpIHtcbiAgICBqc29uRGF0YS5fRXh0ZW5kX0N1cnJlbnRMZXZlbCA9IHZhbHVlO1xuICB9LFxuICBHZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsOiBmdW5jdGlvbiBHZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKGpzb25EYXRhKSB7XG4gICAgcmV0dXJuIGpzb25EYXRhLl9FeHRlbmRfQ3VycmVudExldmVsO1xuICB9LFxuICBTZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0OiBmdW5jdGlvbiBTZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KGpzb25EYXRhLCB2YWx1ZSkge1xuICAgIGpzb25EYXRhLl9FeHRlbmRfUGFyZW50SWRMaXN0ID0gdmFsdWU7XG4gIH0sXG4gIEdldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3Q6IGZ1bmN0aW9uIEdldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3QoanNvbkRhdGEpIHtcbiAgICByZXR1cm4ganNvbkRhdGEuX0V4dGVuZF9QYXJlbnRJZExpc3Q7XG4gIH0sXG4gIENyZWF0ZVRhYmxlVGl0bGVSb3c6IGZ1bmN0aW9uIENyZWF0ZVRhYmxlVGl0bGVSb3coKSB7XG4gICAgdmFyIF9DID0gdGhpcy5fUHJvcF9Db25maWc7XG5cbiAgICB2YXIgX3RoZWFkID0gJChcIjx0aGVhZD5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBpc0hlYWRlcj0ndHJ1ZScgLz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cIik7XG5cbiAgICB2YXIgX3RpdGxlUm93ID0gX3RoZWFkLmZpbmQoXCJ0clwiKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgX0MuVGVtcGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgdGVtcGxhdGUgPSBfQy5UZW1wbGF0ZXNbaV07XG4gICAgICB2YXIgdGl0bGUgPSB0ZW1wbGF0ZS5UaXRsZTtcbiAgICAgIHZhciB0aCA9ICQoXCI8dGg+XCIgKyB0aXRsZSArIFwiPC90aD5cIik7XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5UaXRsZUNlbGxDbGFzc05hbWUpIHtcbiAgICAgICAgdGguYWRkQ2xhc3ModGVtcGxhdGUuVGl0bGVDZWxsQ2xhc3NOYW1lKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHRlbXBsYXRlLlRpdGxlQ2VsbEF0dHJzKSB7XG4gICAgICAgIHRoLmF0dHIodGVtcGxhdGUuVGl0bGVDZWxsQXR0cnMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodHlwZW9mIHRlbXBsYXRlLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiB0ZW1wbGF0ZS5IaWRkZW4gPT0gdHJ1ZSkge1xuICAgICAgICB0aC5oaWRlKCk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0ZW1wbGF0ZS5TdHlsZSkge1xuICAgICAgICB0aC5jc3ModGVtcGxhdGUuU3R5bGUpO1xuICAgICAgfVxuXG4gICAgICBfdGl0bGVSb3cuYXBwZW5kKHRoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3RoZWFkO1xuICB9LFxuICBDcmVhdGVSb3dFbGVtOiBmdW5jdGlvbiBDcmVhdGVSb3dFbGVtKHJvd0RhdGEsIGN1cnJlbnRMZXZlbCwgcGFyZW50Um93RGF0YSwgcm93SXNPcGVuLCBwYXJlbnRJZExpc3QpIHtcbiAgICB2YXIgX2MgPSB0aGlzLl9Qcm9wX0NvbmZpZztcbiAgICB2YXIgJHRyID0gJChcIjx0ciAvPlwiKTtcblxuICAgIHZhciBlbGVtSWQgPSB0aGlzLl9DcmVhdGVFbGVtSWQocm93RGF0YSk7XG5cbiAgICB2YXIgcm93SWQgPSB0aGlzLl9HZXRSb3dEYXRhSWQocm93RGF0YSk7XG5cbiAgICB2YXIgcHJvd0lkID0gdGhpcy5fQ3JlYXRlUGFyZW50Um93SWQocGFyZW50Um93RGF0YSk7XG5cbiAgICAkdHIuYXR0cihcInJvd0lkXCIsIHJvd0lkKS5hdHRyKFwicGlkXCIsIHByb3dJZCkuYXR0cihcImlkXCIsIGVsZW1JZCkuYXR0cihcImN1cnJlbnRMZXZlbFwiLCBjdXJyZW50TGV2ZWwpLmF0dHIoXCJpc2RhdGFyb3dcIiwgXCJ0cnVlXCIpO1xuICAgIHZhciBfdGVzdGZpZWxkID0gX2MuQ2hpbGRUZXN0RmllbGQ7XG4gICAgdmFyIGhhc0NoaWxkID0gcm93RGF0YVtfdGVzdGZpZWxkXTtcblxuICAgIGlmIChoYXNDaGlsZCA9PSB0cnVlIHx8IGhhc0NoaWxkID09IFwidHJ1ZVwiIHx8IGhhc0NoaWxkID4gMCkge1xuICAgICAgJHRyLmF0dHIoXCJoYXNDaGlsZFwiLCBcInRydWVcIik7XG4gICAgfVxuXG4gICAgJHRyLmF0dHIoXCJyb3dJc09wZW5cIiwgcm93SXNPcGVuKS5hdHRyKFwicGFyZW50SWRMaXN0XCIsIHBhcmVudElkTGlzdCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IF9jLlRlbXBsYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIF9jYyA9IF9jLlRlbXBsYXRlc1tpXTtcbiAgICAgIHZhciBfY2QgPSByb3dEYXRhW19jYy5GaWVsZE5hbWVdO1xuICAgICAgdmFyIF93aWR0aCA9IF9jYy5XaWR0aDtcbiAgICAgIHZhciBfcmVuZGVyZXIgPSBfY2MuUmVuZGVyZXI7XG4gICAgICB2YXIgJHRkID0gJChcIjx0ZCBiaW5kRmllbGQ9XFxcIlwiICsgX2NjLkZpZWxkTmFtZSArIFwiXFxcIiBSZW5kZXJlcj0nXCIgKyBfcmVuZGVyZXIgKyBcIic+XCIgKyBfY2QgKyBcIjwvdGQ+XCIpLmNzcyhcIndpZHRoXCIsIF93aWR0aCk7XG5cbiAgICAgIGlmIChfcmVuZGVyZXIgPT0gXCJEYXRlVGltZVwiKSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoX2NkKTtcbiAgICAgICAgdmFyIGRhdGVTdHIgPSBEYXRlVXRpbGl0eS5Gb3JtYXQoZGF0ZSwgJ3l5eXktTU0tZGQnKTtcbiAgICAgICAgJHRkLnRleHQoZGF0ZVN0cik7XG4gICAgICB9XG5cbiAgICAgIGlmIChfY2MuVGV4dEFsaWduKSB7XG4gICAgICAgICR0ZC5jc3MoXCJ0ZXh0QWxpZ25cIiwgX2NjLlRleHRBbGlnbik7XG4gICAgICB9XG5cbiAgICAgIGlmIChpID09IDApIHt9XG5cbiAgICAgIGlmICh0eXBlb2YgX2NjLkhpZGRlbiAhPSAndW5kZWZpbmVkJyAmJiBfY2MuSGlkZGVuID09IHRydWUpIHtcbiAgICAgICAgJHRkLmhpZGUoKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHR5cGVvZiBfY2MuU3R5bGUgIT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgJHRkLmNzcyhfY2MuU3R5bGUpO1xuICAgICAgfVxuXG4gICAgICAkdHIuYXBwZW5kKCR0ZCk7XG4gICAgfVxuXG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICR0ci5iaW5kKFwiY2xpY2tcIiwgbnVsbCwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAkKFwiLnRyLXNlbGVjdGVkXCIpLnJlbW92ZUNsYXNzKFwidHItc2VsZWN0ZWRcIik7XG4gICAgICAkKHRoaXMpLmFkZENsYXNzKFwidHItc2VsZWN0ZWRcIik7XG4gICAgICBfc2VsZi5fUHJvcF9DdXJyZW50U2VsZWN0ZWRSb3dJZCA9ICQodGhpcykuYXR0cihcInJvd0lkXCIpO1xuXG4gICAgICBpZiAodHlwZW9mIF9jLkNsaWNrUm93RXZlbnQgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBfYy5DbGlja1Jvd0V2ZW50ID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgX2MuQ2xpY2tSb3dFdmVudChyb3dJZCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgJHRyLmhvdmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmICghJCh0aGlzKS5oYXNDbGFzcyhcInRyLXNlbGVjdGVkXCIpKSB7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJ0ci1ob3ZlclwiKTtcbiAgICAgIH1cbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICAkKFwiLnRyLWhvdmVyXCIpLnJlbW92ZUNsYXNzKFwidHItaG92ZXJcIik7XG4gICAgfSk7XG4gICAgcmV0dXJuICR0cjtcbiAgfSxcbiAgX1Rlc3RSb3dJc09wZW46IGZ1bmN0aW9uIF9UZXN0Um93SXNPcGVuKGN1cnJlbnRMZXZlbCkge1xuICAgIGlmICh0aGlzLl9Qcm9wX0NvbmZpZy5PcGVuTGV2ZWwgPiBjdXJyZW50TGV2ZWwpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgX0NyZWF0ZUVsZW1JZDogZnVuY3Rpb24gX0NyZWF0ZUVsZW1JZChyb3dEYXRhKSB7XG4gICAgdmFyIHJvd0lkUHJlZml4ID0gXCJcIjtcblxuICAgIGlmICh0aGlzLl9Qcm9wX0NvbmZpZy5Sb3dJZFByZWZpeCAhPSB1bmRlZmluZWQgJiYgdGhpcy5fUHJvcF9Db25maWcuUm93SWRQcmVmaXggIT0gdW5kZWZpbmVkICE9IG51bGwpIHtcbiAgICAgIHJvd0lkUHJlZml4ID0gdGhpcy5fUHJvcF9Db25maWcuUm93SWRQcmVmaXg7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJvd0lkUHJlZml4ICsgdGhpcy5fR2V0Um93RGF0YUlkKHJvd0RhdGEpO1xuICB9LFxuICBfQ3JlYXRlUGFyZW50SWRMaXN0OiBmdW5jdGlvbiBfQ3JlYXRlUGFyZW50SWRMaXN0KHBhcmVudElkTGlzdCwgcm93SWQpIHtcbiAgICByZXR1cm4gcGFyZW50SWRMaXN0ICsgXCLigLtcIiArIHJvd0lkO1xuICB9LFxuICBfQ3JlYXRlUGFyZW50SWRMaXN0QnlQYXJlbnRKc29uRGF0YTogZnVuY3Rpb24gX0NyZWF0ZVBhcmVudElkTGlzdEJ5UGFyZW50SnNvbkRhdGEocGFyZW50SnNvbkRhdGEsIHNlbGZKc29uRGF0YSkge1xuICAgIHZhciBwYXJlbnRJZExpc3QgPSB0aGlzLkdldEpzb25EYXRhRXh0ZW5kQXR0cl9QYXJlbnRJZExpc3QocGFyZW50SnNvbkRhdGEpO1xuXG4gICAgdmFyIHJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKHNlbGZKc29uRGF0YSk7XG5cbiAgICByZXR1cm4gdGhpcy5fQ3JlYXRlUGFyZW50SWRMaXN0KHBhcmVudElkTGlzdCwgcm93SWQpO1xuICB9LFxuICBfR2V0Um93RGF0YUlkOiBmdW5jdGlvbiBfR2V0Um93RGF0YUlkKHJvd0RhdGEpIHtcbiAgICB2YXIgaWRGaWVsZCA9IHRoaXMuX1Byb3BfQ29uZmlnLklkRmllbGQ7XG5cbiAgICBpZiAocm93RGF0YVtpZEZpZWxkXSAhPSB1bmRlZmluZWQgJiYgcm93RGF0YVtpZEZpZWxkXSAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gcm93RGF0YVtpZEZpZWxkXTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoXCLlnKjmlbDmja7mupDkuK3mib7kuI3liLDnlKjkuo7mnoTlu7pJZOeahOWtl+aute+8jOivt+ajgOafpemFjee9ruWPiuaVsOaNrua6kFwiKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgfSxcbiAgX0NyZWF0ZVBhcmVudFJvd0lkOiBmdW5jdGlvbiBfQ3JlYXRlUGFyZW50Um93SWQocGFyZW50Um93RGF0YSkge1xuICAgIGlmIChwYXJlbnRSb3dEYXRhID09IG51bGwpIHtcbiAgICAgIHJldHVybiBcIlJvb3RcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX0dldFJvd0RhdGFJZChwYXJlbnRSb3dEYXRhKTtcbiAgICB9XG4gIH0sXG4gIFJlbmRlcmVyU3R5bGU6IGZ1bmN0aW9uIFJlbmRlcmVyU3R5bGUoKSB7XG4gICAgdmFyIF9zZWxmID0gdGhpcztcblxuICAgICQoXCJ0cltpc2RhdGFyb3c9J3RydWUnXVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciAkdHIgPSAkKHRoaXMpO1xuICAgICAgdmFyICRmaXJzdHRkID0gJCh0aGlzKS5maW5kKFwidGQ6Zmlyc3RcIik7XG4gICAgICB2YXIgcm93aWQgPSAkdHIuYXR0cihcInJvd0lkXCIpO1xuICAgICAgdmFyIHNvdXJjZVRleHQgPSAkZmlyc3R0ZC50ZXh0KCk7XG4gICAgICAkZmlyc3R0ZC5jc3MoXCJwYWRkaW5nLWxlZnRcIiwgX3NlbGYuX1Byb3BfRmlyc3RDb2x1bW5fSW5kZW4gKiBwYXJzZUludCgkKHRoaXMpLmF0dHIoXCJjdXJyZW50TGV2ZWxcIikpKTtcbiAgICAgIHZhciBoYXNDaGlsZCA9IGZhbHNlO1xuXG4gICAgICBpZiAoJHRyLmF0dHIoXCJoYXNDaGlsZFwiKSA9PSBcInRydWVcIikge1xuICAgICAgICBoYXNDaGlsZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciByb3dJc09wZW4gPSBmYWxzZTtcblxuICAgICAgaWYgKCR0ci5hdHRyKFwicm93SXNPcGVuXCIpID09IFwidHJ1ZVwiKSB7XG4gICAgICAgIHJvd0lzT3BlbiA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBzd2l0Y2hFbGVtID0gX3NlbGYuX0NyZWF0ZVJvd1N3aXRjaEVsZW0oaGFzQ2hpbGQsIHJvd0lzT3Blbiwgcm93aWQpO1xuXG4gICAgICAkZmlyc3R0ZC5odG1sKFwiXCIpO1xuICAgICAgJGZpcnN0dGQuYXBwZW5kKHN3aXRjaEVsZW0pLmFwcGVuZChcIjxzcGFuPlwiICsgc291cmNlVGV4dCArIFwiPC9zcGFuPlwiKTtcblxuICAgICAgaWYgKCFyb3dJc09wZW4pIHtcbiAgICAgICAgJChcInRyW3BpZD0nXCIgKyByb3dpZCArIFwiJ11cIikuaGlkZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBfR2V0SW5kZW5DbGFzczogZnVuY3Rpb24gX0dldEluZGVuQ2xhc3MoaGFzQ2hpbGQsIGlzT3Blbikge1xuICAgIGlmIChoYXNDaGlsZCAmJiBpc09wZW4pIHtcbiAgICAgIHJldHVybiBcImltZy1zd2l0Y2gtb3BlblwiO1xuICAgIH1cblxuICAgIGlmIChoYXNDaGlsZCAmJiAhaXNPcGVuKSB7XG4gICAgICByZXR1cm4gXCJpbWctc3dpdGNoLWNsb3NlXCI7XG4gICAgfVxuXG4gICAgaWYgKCFoYXNDaGlsZCkge1xuICAgICAgcmV0dXJuIFwiaW1nLXN3aXRjaC1vcGVuXCI7XG4gICAgfVxuXG4gICAgcmV0dXJuIFwiaW1nLXN3aXRjaC1jbG9zZVwiO1xuICB9LFxuICBfQ3JlYXRlUm93U3dpdGNoRWxlbTogZnVuY3Rpb24gX0NyZWF0ZVJvd1N3aXRjaEVsZW0oaGFzQ2hpbGQsIGlzT3Blbiwgcm93SWQpIHtcbiAgICB2YXIgZWxlbSA9ICQoXCI8ZGl2IGlzc3dpdGNoPVxcXCJ0cnVlXFxcIj48L2Rpdj5cIik7XG5cbiAgICB2YXIgY2xzID0gdGhpcy5fR2V0SW5kZW5DbGFzcyhoYXNDaGlsZCwgaXNPcGVuKTtcblxuICAgIGVsZW0uYWRkQ2xhc3MoY2xzKTtcbiAgICB2YXIgc2VuZGRhdGEgPSB7XG4gICAgICBSb3dJZDogcm93SWRcbiAgICB9O1xuICAgIGVsZW0uYmluZChcImNsaWNrXCIsIHNlbmRkYXRhLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgIGlmICghaGFzQ2hpbGQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB2YXIgJHRyID0gJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKTtcbiAgICAgIHZhciByb3dpZCA9ICR0ci5hdHRyKFwicm93SWRcIik7XG4gICAgICB2YXIgcm93SXNPcGVuID0gZmFsc2U7XG5cbiAgICAgIGlmICgkdHIuYXR0cihcInJvd0lzT3BlblwiKSA9PSBcInRydWVcIikge1xuICAgICAgICByb3dJc09wZW4gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocm93SXNPcGVuKSB7XG4gICAgICAgIHJvd0lzT3BlbiA9IGZhbHNlO1xuICAgICAgICAkKFwidHJbcGFyZW50SWRMaXN0Kj0nXCIgKyByb3dpZCArIFwi4oC7J11cIikuaGlkZSgpO1xuICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKFwiaW1nLXN3aXRjaC1vcGVuXCIpLmFkZENsYXNzKFwiaW1nLXN3aXRjaC1jbG9zZVwiKTtcbiAgICAgICAgJChcInRyW3BhcmVudElkTGlzdCo9J1wiICsgcm93aWQgKyBcIuKAuyddW2hhc2NoaWxkPSd0cnVlJ11cIikuZmluZChcIltpc3N3aXRjaD0ndHJ1ZSddXCIpLnJlbW92ZUNsYXNzKFwiaW1nLXN3aXRjaC1vcGVuXCIpLmFkZENsYXNzKFwiaW1nLXN3aXRjaC1jbG9zZVwiKTtcbiAgICAgICAgJChcInRyW3BhcmVudElkTGlzdCo9J1wiICsgcm93aWQgKyBcIuKAuyddW2hhc2NoaWxkPSd0cnVlJ11cIikuYXR0cihcInJvd2lzb3BlblwiLCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByb3dJc09wZW4gPSB0cnVlO1xuICAgICAgICAkKFwidHJbcGlkPSdcIiArIHJvd2lkICsgXCInXVwiKS5zaG93KCk7XG4gICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoXCJpbWctc3dpdGNoLWNsb3NlXCIpLmFkZENsYXNzKFwiaW1nLXN3aXRjaC1vcGVuXCIpO1xuICAgICAgfVxuXG4gICAgICAkdHIuYXR0cihcInJvd0lzT3BlblwiLCByb3dJc09wZW4pO1xuICAgIH0pO1xuICAgIHJldHVybiBlbGVtO1xuICB9LFxuICBHZXRDaGlsZHNSb3dFbGVtOiBmdW5jdGlvbiBHZXRDaGlsZHNSb3dFbGVtKGxvb3AsIGlkKSB7XG4gICAgaWYgKGxvb3ApIHtcbiAgICAgIHJldHVybiAkKFwidHJbcGFyZW50SWRMaXN0Kj0nXCIgKyBpZCArIFwiJ11cIik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAkKFwidHJbcGlkPSdcIiArIGlkICsgXCInXVwiKTtcbiAgICB9XG4gIH0sXG4gIF9Qcm9wX1NlbGVjdGVkUm93RGF0YTogbnVsbCxcbiAgX1Byb3BfVGVtcEdldFJvd0RhdGE6IG51bGwsXG4gIF9HZXRTZWxlY3RlZFJvd0RhdGE6IGZ1bmN0aW9uIF9HZXRTZWxlY3RlZFJvd0RhdGEobm9kZSwgaWQsIGlzU2V0U2VsZWN0ZWQpIHtcbiAgICB2YXIgZmllbGROYW1lID0gdGhpcy5fUHJvcF9Db25maWcuSWRGaWVsZDtcbiAgICB2YXIgZmllbGRWYWx1ZSA9IG5vZGVbZmllbGROYW1lXTtcblxuICAgIGlmIChmaWVsZFZhbHVlID09IGlkKSB7XG4gICAgICBpZiAoaXNTZXRTZWxlY3RlZCkge1xuICAgICAgICB0aGlzLl9Qcm9wX1NlbGVjdGVkUm93RGF0YSA9IG5vZGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9Qcm9wX1RlbXBHZXRSb3dEYXRhID0gbm9kZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG5vZGUuTm9kZXMgIT0gdW5kZWZpbmVkICYmIG5vZGUuTm9kZXMgIT0gbnVsbCkge1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG5vZGUuTm9kZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB0aGlzLl9HZXRTZWxlY3RlZFJvd0RhdGEobm9kZS5Ob2Rlc1tpXSwgaWQsIGlzU2V0U2VsZWN0ZWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBHZXRTZWxlY3RlZFJvd0RhdGE6IGZ1bmN0aW9uIEdldFNlbGVjdGVkUm93RGF0YSgpIHtcbiAgICBpZiAodGhpcy5fUHJvcF9DdXJyZW50U2VsZWN0ZWRSb3dJZCA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLl9HZXRTZWxlY3RlZFJvd0RhdGEodGhpcy5fUHJvcF9Kc29uRGF0YSwgdGhpcy5fUHJvcF9DdXJyZW50U2VsZWN0ZWRSb3dJZCwgdHJ1ZSk7XG5cbiAgICByZXR1cm4gdGhpcy5fUHJvcF9TZWxlY3RlZFJvd0RhdGE7XG4gIH0sXG4gIEdldFJvd0RhdGFCeVJvd0lkOiBmdW5jdGlvbiBHZXRSb3dEYXRhQnlSb3dJZChyb3dJZCkge1xuICAgIHRoaXMuX1Byb3BfVGVtcEdldFJvd0RhdGEgPSBudWxsO1xuXG4gICAgdGhpcy5fR2V0U2VsZWN0ZWRSb3dEYXRhKHRoaXMuX1Byb3BfSnNvbkRhdGEsIHJvd0lkLCBmYWxzZSk7XG5cbiAgICByZXR1cm4gdGhpcy5fUHJvcF9UZW1wR2V0Um93RGF0YTtcbiAgfSxcbiAgQXBwZW5kQ2hpbGRSb3dUb0N1cnJlbnRTZWxlY3RlZFJvdzogZnVuY3Rpb24gQXBwZW5kQ2hpbGRSb3dUb0N1cnJlbnRTZWxlY3RlZFJvdyhyb3dEYXRhKSB7XG4gICAgdmFyIHNlbGVjdGVkUm93RGF0YSA9IHRoaXMuR2V0U2VsZWN0ZWRSb3dEYXRhKCk7XG5cbiAgICBpZiAoc2VsZWN0ZWRSb3dEYXRhLk5vZGVzICE9IHVuZGVmaW5lZCAmJiBzZWxlY3RlZFJvd0RhdGEuTm9kZXMgIT0gbnVsbCkge1xuICAgICAgc2VsZWN0ZWRSb3dEYXRhLk5vZGVzLnB1c2gocm93RGF0YSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHNlbGVjdGVkUm93RGF0YS5Ob2RlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgc2VsZWN0ZWRSb3dEYXRhLk5vZGVzLnB1c2gocm93RGF0YSk7XG4gICAgfVxuXG4gICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfQ3VycmVudExldmVsKHJvd0RhdGEsIHRoaXMuR2V0SnNvbkRhdGFFeHRlbmRBdHRyX0N1cnJlbnRMZXZlbChzZWxlY3RlZFJvd0RhdGEpICsgMSk7XG4gICAgdGhpcy5TZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KHJvd0RhdGEsIHRoaXMuX0NyZWF0ZVBhcmVudElkTGlzdEJ5UGFyZW50SnNvbkRhdGEoc2VsZWN0ZWRSb3dEYXRhLCByb3dEYXRhKSk7XG4gICAgdmFyICR0ciA9IHRoaXMuQ3JlYXRlUm93RWxlbShyb3dEYXRhLCB0aGlzLkdldEpzb25EYXRhRXh0ZW5kQXR0cl9DdXJyZW50TGV2ZWwoc2VsZWN0ZWRSb3dEYXRhKSArIDEsIHNlbGVjdGVkUm93RGF0YSwgdHJ1ZSwgdGhpcy5HZXRKc29uRGF0YUV4dGVuZEF0dHJfUGFyZW50SWRMaXN0KHJvd0RhdGEpKTtcblxuICAgIHZhciBzZWxlY3RlZFJvd0lkID0gdGhpcy5fR2V0Um93RGF0YUlkKHNlbGVjdGVkUm93RGF0YSk7XG5cbiAgICB2YXIgY3VycmVudFNlbGVjdEVsZW0gPSAkKFwidHJbcm93SWQ9J1wiICsgc2VsZWN0ZWRSb3dJZCArIFwiJ11cIik7XG4gICAgY3VycmVudFNlbGVjdEVsZW0uYXR0cihcImhhc2NoaWxkXCIsIFwidHJ1ZVwiKTtcbiAgICB2YXIgbGFzdENoaWxkcyA9ICQoXCJ0cltwYXJlbnRpZGxpc3QqPSdcIiArIHNlbGVjdGVkUm93SWQgKyBcIuKAuyddOmxhc3RcIik7XG5cbiAgICBpZiAobGFzdENoaWxkcy5sZW5ndGggPiAwKSB7XG4gICAgICBsYXN0Q2hpbGRzLmFmdGVyKCR0cik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGN1cnJlbnRTZWxlY3RFbGVtLmF0dHIoXCJyb3dpc29wZW5cIiwgdHJ1ZSk7XG4gICAgICBjdXJyZW50U2VsZWN0RWxlbS5hZnRlcigkdHIpO1xuICAgIH1cblxuICAgIHRoaXMuUmVuZGVyZXJTdHlsZSgpO1xuICB9LFxuICBVcGRhdGVUb1JvdzogZnVuY3Rpb24gVXBkYXRlVG9Sb3cocm93SWQsIHJvd0RhdGEpIHtcbiAgICB2YXIgc2VsZWN0ZWRSb3dEYXRhID0gdGhpcy5HZXRSb3dEYXRhQnlSb3dJZChyb3dJZCk7XG5cbiAgICBmb3IgKHZhciBhdHRyTmFtZSBpbiByb3dEYXRhKSB7XG4gICAgICBpZiAoYXR0ck5hbWUgIT0gXCJOb2Rlc1wiKSB7XG4gICAgICAgIHNlbGVjdGVkUm93RGF0YVthdHRyTmFtZV0gPSByb3dEYXRhW2F0dHJOYW1lXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcm93SWQgPSB0aGlzLl9HZXRSb3dEYXRhSWQoc2VsZWN0ZWRSb3dEYXRhKTtcblxuICAgIHZhciAkdHIgPSAkKFwidHJbcm93aWQ9J1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgICR0ci5maW5kKFwidGRcIikuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYmluZEZpZWxkID0gJCh0aGlzKS5hdHRyKFwiYmluZEZpZWxkXCIpO1xuICAgICAgdmFyIG5ld3RleHQgPSBzZWxlY3RlZFJvd0RhdGFbYmluZEZpZWxkXTtcbiAgICAgIHZhciByZW5kZXJlciA9ICQodGhpcykuYXR0cihcIlJlbmRlcmVyXCIpO1xuXG4gICAgICBpZiAocmVuZGVyZXIgPT0gXCJEYXRlVGltZVwiKSB7XG4gICAgICAgIHZhciBkYXRlID0gbmV3IERhdGUobmV3dGV4dCk7XG4gICAgICAgIG5ld3RleHQgPSBEYXRlVXRpbGl0eS5Gb3JtYXQoZGF0ZSwgJ3l5eXktTU0tZGQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCQodGhpcykuZmluZChcIltpc3N3aXRjaD0ndHJ1ZSddXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJCh0aGlzKS5maW5kKFwic3BhblwiKS50ZXh0KG5ld3RleHQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJCh0aGlzKS50ZXh0KG5ld3RleHQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9LFxuICBMb2FkQ2hpbGRCeUFqYXg6IGZ1bmN0aW9uIExvYWRDaGlsZEJ5QWpheCgpIHt9LFxuICBEZWxldGVSb3c6IGZ1bmN0aW9uIERlbGV0ZVJvdyhyb3dJZCkge1xuICAgIHZhciBoYXNDaGlsZCA9IGZhbHNlO1xuXG4gICAgaWYgKCQoXCJ0cltwaWQ9J1wiICsgcm93SWQgKyBcIiddXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICghdGhpcy5fUHJvcF9Db25maWcuQ2FuRGVsZXRlV2hlbkhhc0NoaWxkKSB7XG4gICAgICAgIGFsZXJ0KFwi5oyH5a6a55qE6IqC54K55a2Y5Zyo5a2Q6IqC54K577yM6K+35YWI5Yig6Zmk5a2Q6IqC54K577yBXCIpO1xuICAgICAgfVxuICAgIH1cblxuICAgICQoXCJ0cltwYXJlbnRpZGxpc3QqPSfigLtcIiArIHJvd0lkICsgXCInXVwiKS5yZW1vdmUoKTtcbiAgICB0aGlzLl9Qcm9wX0N1cnJlbnRTZWxlY3RlZFJvd0lkID0gbnVsbDtcbiAgfSxcbiAgTW92ZVVwUm93OiBmdW5jdGlvbiBNb3ZlVXBSb3cocm93SWQpIHtcbiAgICB2YXIgdGhpc3RyID0gJChcInRyW3Jvd2lkPSdcIiArIHJvd0lkICsgXCInXVwiKTtcbiAgICB2YXIgcGlkID0gdGhpc3RyLmF0dHIoXCJwaWRcIik7XG4gICAgdmFyIG5lYXJ0ciA9ICQodGhpc3RyLnByZXZBbGwoXCJbcGlkPSdcIiArIHBpZCArIFwiJ11cIilbMF0pO1xuICAgIHZhciBtb3ZldHJzID0gJChcInRyW3BhcmVudGlkbGlzdCo9J+KAu1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgIG1vdmV0cnMuaW5zZXJ0QmVmb3JlKG5lYXJ0cik7XG4gIH0sXG4gIE1vdmVEb3duUm93OiBmdW5jdGlvbiBNb3ZlRG93blJvdyhyb3dJZCkge1xuICAgIHZhciB0aGlzdHIgPSAkKFwidHJbcm93aWQ9J1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgIHZhciBwaWQgPSB0aGlzdHIuYXR0cihcInBpZFwiKTtcbiAgICB2YXIgbmVhcnRyID0gJCh0aGlzdHIubmV4dEFsbChcIltwaWQ9J1wiICsgcGlkICsgXCInXVwiKVswXSk7XG4gICAgdmFyIG5lYXJ0cnJpZCA9IG5lYXJ0ci5hdHRyKFwicm93aWRcIik7XG4gICAgdmFyIG9mZnRycyA9ICQoXCJ0cltwYXJlbnRpZGxpc3QqPSfigLtcIiArIG5lYXJ0cnJpZCArIFwiJ11cIik7XG4gICAgdmFyIG9mZmxhc3R0ciA9ICQob2ZmdHJzW29mZnRycy5sZW5ndGggLSAxXSk7XG4gICAgdmFyIG1vdmV0cnMgPSAkKFwidHJbcGFyZW50aWRsaXN0Kj0n4oC7XCIgKyByb3dJZCArIFwiJ11cIik7XG4gICAgbW92ZXRycy5pbnNlcnRBZnRlcihvZmZsYXN0dHIpO1xuICB9LFxuICBHZXRCcm90aGVyc05vZGVEYXRhc0J5UGFyZW50SWQ6IGZ1bmN0aW9uIEdldEJyb3RoZXJzTm9kZURhdGFzQnlQYXJlbnRJZChyb3dJZCkge1xuICAgIHZhciB0aGlzdHIgPSAkKFwidHJbcm93aWQ9J1wiICsgcm93SWQgKyBcIiddXCIpO1xuICAgIHZhciBwaWQgPSB0aGlzdHIuYXR0cihcInBpZFwiKTtcbiAgICB2YXIgYnJvdGhlcnN0ciA9ICQodGhpc3RyLnBhcmVudCgpLmZpbmQoXCJbcGlkPSdcIiArIHBpZCArIFwiJ11cIikpO1xuICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYnJvdGhlcnN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzdWx0LnB1c2godGhpcy5HZXRSb3dEYXRhQnlSb3dJZCgkKGJyb3RoZXJzdHJbaV0pLmF0dHIoXCJyb3dpZFwiKSkpO1xuICAgIH1cblxuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFJlbW92ZUFsbFJvdzogZnVuY3Rpb24gUmVtb3ZlQWxsUm93KCkge1xuICAgIGlmICh0aGlzLl8kUHJvcF9UYWJsZUVsZW0gIT0gbnVsbCkge1xuICAgICAgdGhpcy5fJFByb3BfVGFibGVFbGVtLmZpbmQoXCJ0cjpub3QoOmZpcnN0KVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTsiXX0=
