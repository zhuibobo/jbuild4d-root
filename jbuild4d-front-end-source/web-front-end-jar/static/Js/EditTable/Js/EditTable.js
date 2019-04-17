/**
 * Created by zhuangrb on 2018/8/18.
 */
var EditTable= {
    _$Prop_TableElem: null,
    _$Prop_RendererToElem: null,
    _Prop_ConfigManager: null,
    _Prop_JsonData: new Object(),
    _$Prop_EditingRowElem: null, //当前选中的行对象<tr>
    _Status:"Edit",
    /*
     组件初始化
     */
    Initialization: function (_config) {
        this._Prop_ConfigManager = Object.create(EditTableConfigManager);
        this._Prop_ConfigManager.InitializationConfig(_config);
        var _C = this._Prop_ConfigManager.GetConfig();
        this._$Prop_RendererToElem = $("#" + _C.RendererTo);
        this._$Prop_TableElem = this.CreateTable();
        this._$Prop_TableElem.append(this.CreateTableTitleRow());
        this._$Prop_RendererToElem.append(this._$Prop_TableElem);
        if(_C.Status) {
            this._Status = _C.Status;
        }
    },

    LoadJsonData: function (jsonData) {
        if (jsonData != null && jsonData != undefined) {

            for (var i = 0; i < jsonData.length; i++) {
                var item = jsonData[i];
                var rowId = this.AddEditingRowByTemplate(jsonData, item);
                this._Prop_JsonData[rowId] = item;
            }
            this.CompletedEditingRow();//AddEditingRowByTemplate 已经有完成编辑方法,这里调用一次是最后一行完成编辑
        }
        else {
            alert("Json Data Object Error");
        }
    },

    //创建表格容器
    CreateTable: function () {
        var _C = this._Prop_ConfigManager.GetConfig();
        var _editTable = $("<table />");
        _editTable.addClass(_C.TableClass);
        _editTable.attr("Id", _C.TableId);
        _editTable.attr(_C.TableAttrs);
        return _editTable;
    },
    //创建表头
    CreateTableTitleRow: function () {
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
            if(typeof (template.Hidden) != 'undefined' && template.Hidden==true){
                th.hide();
            }
            _titleRow.append(th);
        }

        var _titleRowHead = $("<thead></thead>");
        _titleRowHead.append(_titleRow);
        return _titleRowHead;
    },

    // 增加行
    AddEmptyEditingRowByTemplate: function (callbackfun) {
        var rowId = this.AddEditingRowByTemplate(null);
        this._Prop_JsonData[rowId] = null;
    },
    // 往表格中增加新行,并注册相关的事件
    AddEditingRowByTemplate: function (jsonDatas, jsonDataSingle) {
        if(this.CompletedEditingRow()) {
            var rowId = StringUtility.Guid();
            var $rowElem = $("<tr />");
            $rowElem.attr("id", rowId);
            this._$Prop_EditingRowElem = $rowElem;

            if (jsonDataSingle != undefined && jsonDataSingle != null && jsonDataSingle.editEable == false) {

            }else {
                var event_data = {host: this};
                //console.log(this._Status);
                if(this._Status!="View") {
                    $rowElem.bind("click", event_data, function (event) {
                        //debugger;
                        // 行状态
                        var rowStatus = $rowElem.attr("status");
                        // 行状态为禁用状态不做任何操作
                        if (typeof (rowStatus) != 'undefined' && rowStatus == "disabled") {
                            return false;
                        }

                        var _host = event.data.host;
                        if (_host._$Prop_EditingRowElem != null && $(this).attr("id") == _host._$Prop_EditingRowElem.attr("id")) {
                            return
                        }
                        var _C = _host._Prop_ConfigManager.GetConfig();
                        if (typeof (_C.RowClick) != 'undefined' && typeof (_C.RowClick) == 'function') {
                            try {
                                var result = _C.RowClick();
                                if (result != 'undefined' && result == false) {
                                    return false;
                                }
                            }
                            catch (e) {
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
                                if (typeof (template.Hidden) != 'undefined' && template.Hidden == true) {
                                    $td.hide();
                                }
                                //alert(template.Style);
                                if (typeof (template.Style) != 'undefined') {
                                    $td.css(template.Style);
                                }
                                $td.html("");
                                $td.append($htmlelem);
                            })
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
                }
                catch (e) {
                    alert("实例化" + renderer + "失败!");
                }
                var $tdElem = null;
                $tdElem = $("<td />");
                $tdElem.attr("renderer", renderer);
                $tdElem.attr("templateId", template.TemplateId);
                if(typeof (template.Hidden) != 'undefined' && template.Hidden==true){
                    $tdElem.hide();
                }

                //宽度
                if(typeof (template.Width) != 'undefined'){
                    $tdElem.css("width",template.Width);
                }

                //对齐方式
                if(typeof (template.Align) != 'undefined'){
                    $tdElem.attr("align",template.Align);
                }

                var $elem = rendererObj.Get_EditStatus_HtmlElem(_C, template, $tdElem, $rowElem, this._$Prop_TableElem, null, jsonDatas, jsonDataSingle);
                if(typeof (template.Style) != 'undefined') {
                    $tdElem.css(template.Style);
                }
                $tdElem.append($elem);
                $rowElem.append($tdElem);
            }

            this._$Prop_TableElem.append($rowElem);

            // 增加行完成执行的方法
            if(typeof (_C.AddAfterRowEvent) !=='undefined' && typeof (_C.AddAfterRowEvent)== 'function') {
                _C.AddAfterRowEvent($rowElem);
            }
            return rowId;
        }
    },
    SetToViewStatus:function(){
        this._Status="View";
    },
    SetRowIsEditStatus: function (tr) {
        $(tr).attr("EditStatus", "EditStatus");
    },
    SetRowIsCompletedStatus: function (tr) {
        $(tr).attr("EditStatus", "CompletedStatus");
    },
    RowIsEditStatus: function (tr) {
        return $(tr).attr("EditStatus") == "EditStatus";
    },
    RowIsCompletedStatus: function (tr) {
        return $(tr).attr("EditStatus") == "CompletedStatus";
    },
    //完成表格行的编辑状态,并切换到完成状态
    CompletedEditingRow: function () {
        var result=true;
        if (this._$Prop_EditingRowElem != null) {
            // alert(this._$Prop_EditingRowElem.IsComplated);
            if (!this.RowIsCompletedStatus(this._$Prop_EditingRowElem)) {
                var _C = this._Prop_ConfigManager.GetConfig();
                var _host = this;
                if (this.ValidateCompletedEditingRowEnable(this._$Prop_EditingRowElem)) {
                    var _row = this._$Prop_EditingRowElem;
                    this.SetRowIsCompletedStatus(_row);
                    //this._$Prop_EditingRowElem.IsComplated!=true;
                    _row.find("td").each(function () {
                        var $td = $(this);
                        var renderer = $td.attr("renderer");
                        var templateId = $td.attr("templateId");
                        var template = _host._Prop_ConfigManager.GetTemplate(templateId);
                        var rendererObj = eval("Object.create(" + renderer + ")");
                        var $htmlelem = rendererObj.Get_CompletedStatus_HtmlElem(_C, template, $td, _row, this._$Prop_TableElem, $td.children());
                        $td.html("");
                        $td.append($htmlelem);
                    })
                    this._$Prop_EditingRowElem=null;
                }
                else {
                    result = false;
                }
            }
        }
        return result;
    },
    //校验编辑表格能否切换到完成状态
    ValidateCompletedEditingRowEnable: function (editRow) {
        var _C = this._Prop_ConfigManager.GetConfig();
        var _host = this;
        var result = true;
        var validateMsg="";

        var tds=$(editRow).find("td");
        for(var i=0;i<tds.length;i++) {
            var $td=$(tds[i]);
            var renderer = $td.attr("renderer");
            var templateId = $td.attr("templateId");
            var template = _host._Prop_ConfigManager.GetTemplate(templateId);
            var rendererObj = eval("Object.create(" + renderer + ")");
            var valresult = rendererObj.ValidateToCompletedEnable(_C, template, $td, editRow, this._$Prop_TableElem, $td.children());
            if(valresult.Success==false) {
                result=false;
                validateMsg=valresult.Msg;
                break;
            }
        }
        if(!result && validateMsg != null) {
           // alert(validateMsg);
            DialogUtility.Alert(window, DialogUtility.DialogAlertId,{}, validateMsg,null);
        }
        return result;
    },
    // 行移除
    RemoveRow : function(){
        if (this._$Prop_EditingRowElem != null) {
            this._$Prop_EditingRowElem.remove();
            this._$Prop_EditingRowElem = null;
        }
    },

    // 获取表格对象
    GetTableObject:function(){
        return this._$Prop_TableElem;
    },

    // 获取Table所有行
    GetRows:function(){
        if (this._$Prop_TableElem != null) {
            return this._$Prop_TableElem.find("tr:not(:first)");
        }
    },

    // 获取当前编辑行
    GetEditRow:function(){
        if (this._$Prop_EditingRowElem != null) {
            return this._$Prop_EditingRowElem;
        } else {
            return null;
        }
    },

    // 获取上一行
    GetLastRow:function(){
        var row = this.GetEditRow();
        if (row == null) return null;
        var rows = this.GetRows();
        var index = rows.index(row);
        if (index > 0) {
            return $(rows[index - 1]);
        }
        return null;
    },

    // 获取下一行
    GetNextRow:function(){
        var row = this.GetEditRow();
        if (row == null) return null;
        var rows = this.GetRows();
        var index = rows.index(row);
        if (index < rows.length - 1) {
            return $(rows[index + 1]);
        }
        return null;
    },

    //将当前行上移
    MoveUp: function() {
        var row = this.GetLastRow();

        if (row != null) {
            if (typeof (row.attr("status")) != "undefined" && row.attr("status") == "disabled") return false;
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

    //将当前行下移
    MoveDown: function() {
        var row = this.GetNextRow();

        if (row != null) {
            if (typeof (row.attr("state")) != "undefined" && row.attr("state") == "disabled") return false;
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

    // 移除所有行(不包括表头)
    RemoveAllRow : function(){
        if (this._$Prop_TableElem != null) {
            this._$Prop_TableElem.find("tr:not(:first)").each(function(){
               $(this).remove();
            });
        }
    },

    // 更新行数据
    UpdateToRow:function(rowId, rowData){
        var tableElement = this._$Prop_TableElem;
        var _host = this;
        tableElement.find("tr[isHeader!='true']").each(function () {
            var $tr = $(this);
            var _rowId = $tr.attr("id");
            if(rowId == _rowId) {
                for (var attrName in rowData) {
                    $tr.find("td").each(function(){
                        var $td = $(this);
                        var $displayElem = $td.find("[IsSerialize='true']");
                        var bindName = $displayElem.attr("BindName");

                        if(attrName == bindName) {
                            //debugger;
                            var templateId = $td.attr("templateId");
                            var template = _host._Prop_ConfigManager.GetTemplate(templateId);
                            var text = "";
                            var val = rowData[bindName];
                            if(typeof (template.Formatter) != 'undefined' && typeof (template.Formatter)== 'function') {
                                text = template.Formatter(val);
                            }
                            if(text == "") {
                                text = val;
                            }
                            if($displayElem.prop('tagName')=="INPUT"){
                                if($displayElem.attr("type").toLowerCase()=="checkbox"){

                                }
                                else {
                                    $displayElem.val(text);
                                }
                            }
                            else {
                                try {
                                    $displayElem.text(text);
                                }
                                catch(e){
                                    alert("UpdateToRow $label.text(text) Error!");
                                }
                                $displayElem.attr("Value", val);
                            }
                        }
                    });

                    /*$tr.find("[IsSerialize='true']").each(function () {
                        var $label = $(this);
                        var bindName = $(this).attr("BindName");

                        if(attrName == bindName) {
                            $label.text(rowData[bindName]);
                            $label.attr("Value", rowData[bindName]);
                        }
                    });*/
                }
            }
        });
    },

    // 根据rowId获取行数据
    GetSelectRowDataByRowId:function(rowId){
        var tableElement = this._$Prop_TableElem;
        var rowData = {};
        tableElement.find("tr[isHeader!='true']").each(function () {
            var $tr = $(this);
            var _rowId = $tr.attr("id");
            if(rowId == _rowId) {
                $tr.find("[IsSerialize='true']").each(function () {
                    if($(this).attr("Value")!=undefined) {
                        rowData[$(this).attr("BindName")] = $(this).attr("Value");
                    }
                    else {
                        rowData[$(this).attr("BindName")] = $(this).val();
                    }
                });
            }
        });
        return rowData;
    },
    // 根据rowId获取行对象
    GetSelectRowByRowId:function(rowId){
        var tableElement = this._$Prop_TableElem;
        return tableElement.find("tr[id='"+rowId+"']");
    },
    // 获取所有行数据
    GetAllRowData : function (){
        var tableElement = this._$Prop_TableElem;
        var rowDatas = new Array();
        tableElement.find("tr[isHeader!='true']").each(function () {
            var $tr = $(this);
            var rowData = {};
            $tr.find("[IsSerialize='true']").each(function () {
                rowData[$(this).attr("BindName")]= $(this).attr("Value");
                rowData[$(this).attr("BindName")+"___Text"]=$(this).attr("Text");
            });

            rowDatas.push(rowData);
        });

        return rowDatas;
    },

    GetSerializeJson:function(){
        var result=new Array();
        var table=this._$Prop_TableElem;
        table.find("tr[isHeader!='true']").each(function(){
            var rowdata=new Object();
            var  $tr=$(this);
            $tr.find("[IsSerialize='true']").each(function(){
                var seritem=$(this);
                var bindName=seritem.attr("BindName");
                var bindValue=seritem.attr("Value");
                var bindText=seritem.attr("Text");
                if(!bindText){
                    bindText="";
                }
                if(bindText=="undefined"){
                    bindText="";
                }
                rowdata[bindName]=bindValue;
                rowdata[bindName+"___Text"]=bindText;
            });
            result.push(rowdata);
        });
        return result;
    },
    GetTableElement : function(){
        return this._$Prop_TableElem;
    }
}

var EditTableConfigManager={
    _Prop_Config:{},
    InitializationConfig:function(_config){
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);

        var _templates= this._Prop_Config.Templates;
        for(var i=0;i<_templates.length;i++) {
            var template=_templates[i];
            template.TemplateId=StringUtility.Guid();
        }
    },
    GetConfig:function(){
        return this._Prop_Config;
    },
    GetTemplate:function(templateId) {
        var _templates= this._Prop_Config.Templates;
        for(var i=0;i<_templates.length;i++) {
            var template=_templates[i];
            if (template.TemplateId==templateId) {
                return template;
            }
        }
        return null;
    }
}

var EditTableValidate={
    _SQLKeyWordArray:new Array(),
    GetSQLKeyWords:function(){
        if(this._SQLKeyWordArray.length==0){
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
    Validate:function(val,template){
        var result = {Success: true, Msg: ""};
        var validateConfig=template.Validate;
        if(validateConfig!=undefined&&validateConfig!=null) {
            var validateType=validateConfig.Type;
            if(validateType!=undefined&&validateType!=null) {
                switch (validateType){
                    case "NotEmpty":{
                        if (val == "") {
                            result.Success = false;
                            result.Msg = "【"+template.Title+"】不能为空!";
                        }
                    }break;
                    case "LUNoOnly":{
                        if(/^[a-zA-Z][a-zA-Z0-9_]{0,}$/.test(val) == false)
                        {
                            result.Success = false;
                            result.Msg = "【"+template.Title+"】不能为空且只能是字母、下划线、数字并以字母开头！";
                        }
                    }break;
                    case "SQLKeyWord":{
                        if(/^[a-zA-Z][a-zA-Z0-9_]{0,}$/.test(val) == false)
                        {
                            result.Success = false;
                            result.Msg = "【"+template.Title+"】不能为空且只能是字母、下划线、数字并以字母开头！";
                        }
                        var val=val.toUpperCase();
                        var sqlKeyWords=this.GetSQLKeyWords();
                        for(var i=0;i<sqlKeyWords.length;i++){
                            if(val==sqlKeyWords[i].toUpperCase()){
                                result.Success = false;
                                result.Msg = "【"+template.Title+"】请不要使用SQL关键字作为列名！";
                                break;
                            }
                        }
                    }break;
                }
            }
        }
        return result;
    }
}

var EditTableDefauleValue={
    GetValue:function(template){
        var defaultValueConfig=template.DefaultValue;
        if(defaultValueConfig!=undefined&&defaultValueConfig!=null) {
            var defaultValueType=defaultValueConfig.Type;
            if(defaultValueType!=undefined&&defaultValueType!=null) {
                switch (defaultValueType){
                    case "Const":{
                        return defaultValueConfig.Value;
                    }
                    case "GUID":{
                        return StringUtility.Guid();
                    }
                    break;
                }
            }
        }
        return "";
    }
}