/**
 * Created by zhuangrb on 2018/7/31.
 */
var Column_SelectFieldTypeDataLoader={
    _fieldDataTypeArray:null,
    GetFieldDataTypeArray:function() {
        //alert(this._fieldDataTypeHasMap);
        if (this._fieldDataTypeArray == null) {
            var _self = this;

            AjaxUtility.PostSync("/PlatFormRest/Builder/DataStorage/DataBase/Table/GetTableFieldType.do",{},function(data){
                //debugger;
                if (data.success == true) {
                    var list = JsonUtility.StringToJson(data.data);
                    if (list != null && list != undefined) {
                        _self._fieldDataTypeArray = list;
                    }
                } else {
                    DialogUtility.Alert(window, "AlertLoadingQueryError",{}, "加载字段类型失败！",null);
                }
            },"json");
        }
        return this._fieldDataTypeArray;
    },
    GetFieldDataTypeObjectByValue:function(Value){
        //debugger;
        var arrayData=this.GetFieldDataTypeArray();
        for(var i=0;i<arrayData.length;i++){
            var obj=arrayData[i];
            if(obj.Value==Value) {
                return obj;
            }
        }

        alert("找不到指定的数据类型，请确认是否支持该类型！");
    },
    GetFieldDataTypeObjectByText:function(text) {
        //debugger;
        var arrayData=this.GetFieldDataTypeArray();
        for(var i=0;i<arrayData.length;i++){
            var obj=arrayData[i];
            if(obj.Text==text) {
                return obj;
            }
        }

        alert("找不到指定的数据类型，请确认是否支持该类型！");
    }
}

var Column_SelectFieldType={
    /*
     _config:配置对象
     template:当前模版
     hostCell:所处的单元格
     hostRow:所处的列
     hostTable:所处的表格
     viewStausHtmlElem:浏览状态的html元素
     jsonDataItem:json数据源
     */
    Get_EditStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,viewStausHtmlElem,jsonDatas,jsonDataSingle) {
        /*if(null == this.fieldTypes || this.fieldTypes.size() < 1){
         this.initFieldTypes();
         }*/
        var val = "";//从单元格中获取到的值
        var $elem = $("<select />");
        if (jsonDataSingle != null && jsonDataSingle != undefined) {
            val = jsonDataSingle["columnDataTypeName"];
        }
        if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
            val = viewStausHtmlElem.attr("Value");
        }

        var _fieldDataTypeArray=Column_SelectFieldTypeDataLoader.GetFieldDataTypeArray();
        //debugger;
        for(var i=0;i<_fieldDataTypeArray.length;i++) {
            var value=_fieldDataTypeArray[i].Value;
            var text=_fieldDataTypeArray[i].Text;
            $elem.append("<option value='" + value + "'>" + text + "</option>");
        }
        //alert(val);
        if(val!=""){
            $elem.val(val);
        }
        else {
            $elem.val(Column_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByText("字符串").Value);
        }

        /*$elem.change(function () {
            var val = $(this).val();
            if (val == "整数") { //如果是整数   禁用字段长度和小数位 并值都改为0
                $(hostCell).next().find("input").attr("disabled", true);
                $(hostCell).next().find("input").val(0);

                $(hostCell).next().next().find("input").attr("disabled", true);
                $(hostCell).next().next().find("input").val(0);
            } else if (val == "小数") {//2小数 启用字段长度和小数位数 并把字段长度改为10 和 2
                $(hostCell).next().find("input").attr("disabled", false);
                $(hostCell).next().find("input").val(10);

                $(hostCell).next().next().find("input").attr("disabled", false);
                $(hostCell).next().next().find("input").val(2);
            } else if (val == "日期时间") { //3：日期时间 禁用 字段长度和小数位数 并改为20 0
                $(hostCell).next().find("input").attr("disabled", true);
                $(hostCell).next().find("input").val(20);

                $(hostCell).next().next().find("input").attr("disabled", true);
                $(hostCell).next().next().find("input").val(0);
            } else if (val == "字符串") {//4: 字符串   禁用小数位选择框
                //启用字段长度
                $(hostCell).next().find("input").attr("disabled", false);
                $(hostCell).next().find("input").val(50);

                $(hostCell).next().next().find("input").attr("disabled", true);
                $(hostCell).next().next().find("input").val(0);
            } else if (val == "长字符串") { //6:意见型： 禁用字段长度和小数 并把值改为0
                $(hostCell).next().find("input").attr("disabled", true);
                $(hostCell).next().find("input").val(0);

                $(hostCell).next().next().find("input").attr("disabled", true);
                $(hostCell).next().next().find("input").val(0);
            }
        });*/

        return $elem;
    },
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        /*if(null == this.fieldTypes || this.fieldTypes.size() < 1){
            this.initFieldTypes();
        }*/
        //debugger;
        var value = editStausHtmlElem.val();
        var text= Column_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByValue(value).Text;
        var $elem = $("<label IsSerialize='true' BindName='"+template.BindName+"' Value='"+value+"'>" + text + "</label>");
        return $elem;
    },
    ValidateToCompletedEnable:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        return EditTableValidate.Validate(val,template);
    }
}