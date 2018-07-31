/**
 * Created by zhuangrb on 2018/7/31.
 */

var EditTable_SelectFieldTypeDataLoader={
    _fieldDataTypeArray:null,
    GetFieldDataTypeArray:function() {
        //alert(this._fieldDataTypeHasMap);
        if (this._fieldDataTypeArray == null) {
            var _self = this;
            $.sssajax({
                type: "post",
                url: BaseUtil.GetRootPath() + "/table/getFieldDataType.do",
                dataType: 'json',
                async: false,
                success: function (data) {
                    //debugger;
                    if (data.success == true) {
                        var list = StringLib.StringToJson(data.data);
                        if (list != null && list != undefined) {
                            _self._fieldDataTypeArray = list;
                        }
                    } else {
                        Dialog.Alert(window, "AlertLoadingQueryError", "", "加载字段类型失败！");
                    }
                },
                error: function (data) {
                    debugger;
                    Dialog.Alert(window, "AlertLoadingQueryError", "", "加载字段类型失败！");
                }
            });
        }
        return this._fieldDataTypeArray;
    },
    GetFieldDataTypeObjectByCode:function(code){
        var arrayData=this.GetFieldDataTypeArray();
        for(var i=0;i<arrayData.length;i++){
            var obj=arrayData[i];
            if(obj.Code==code) {
                return obj;
            }
        }
        alert("找不到指定的数据类型，请确认是否支持该类型！");
    },
    GetFieldDataTypeObjectByText:function(text) {
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

var EditTable_SelectFieldType={
    // 1:整数  2:小数  3:日期时间  4:字符串  5:布尔值   6:意见型   7:日期
    //TODO 暂时限定只能选择字符串
    //fieldArray : new Array("4","1","2","3","5","6","7","8"),
    //fieldTypes : new Map(),//('','整数','小数','日期时间','字符串','布尔值','意见型','日期','长字符串'),
    initFieldTypes : function(){
        alert("数据初始化方法变更");
        //EditTable_SelectFieldTypeDataLoader.GetFieldDataType();
        /*this.fieldTypes.put("4","字符串");
        this.fieldTypes.put("1","整数");
        this.fieldTypes.put("2","小数");
        this.fieldTypes.put("3","日期时间");
        this.fieldTypes.put("5","布尔值");
        this.fieldTypes.put("6","意见型");
        this.fieldTypes.put("7","日期");
        this.fieldTypes.put("8","长字符串");
        this.fieldTypes.put("整数","1");
        this.fieldTypes.put("小数","2");
        this.fieldTypes.put("日期时间","3");
        this.fieldTypes.put("字符串","4");
        this.fieldTypes.put("布尔值","5");
        this.fieldTypes.put("意见型","6");
        this.fieldTypes.put("日期","7");
        this.fieldTypes.put("长字符串","8");*/
    },
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
            val = jsonDataSingle["fieldEntity.dataType"];
        }
        if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
            val = viewStausHtmlElem.attr("Value");
        }

        //意义不明
        /*if (isNaN(val)) {//如果值为非数字
            val = this.fieldTypes.get(val);
        }*/

        var _fieldDataTypeArray=EditTable_SelectFieldTypeDataLoader.GetFieldDataTypeArray();
        for(var i=0;i<_fieldDataTypeArray.length;i++) {
            var code=_fieldDataTypeArray[i].Code;
            var text=_fieldDataTypeArray[i].Text;
            //if (code == val) {//数据类型等于当前类型则选中
            //    $elem.append("<option value='" + code + "' selected='selected'>" + text + "</option>");
            //} else {
                $elem.append("<option value='" + code + "'>" + text + "</option>");
            //}
        }
        //alert(val);
        if(val!=""){
            $elem.val(val);
        }
        else {
            $elem.val(EditTable_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByText("字符串").Code);
        }

       /* for (var _index = 0; _index < this.fieldArray.length; _index++) {
            var key = this.fieldArray[_index];
            if (key == val) {//数据类型等于当前类型则选中
                $elem.append("<option value='" + key + "' selected='selected'>" + this.fieldTypes.get(key) + "</option>");
            } else {
                $elem.append("<option value='" + key + "'>" + this.fieldTypes.get(key) + "</option>");
            }
        }*/

        $elem.change(function () {
            var val = $(this).val();
            if (val == 1) { //如果是整数   禁用字段长度和小数位 并值都改为0
                $(hostCell).next().find("input").attr("disabled", true);
                $(hostCell).next().find("input").val(0);

                $(hostCell).next().next().find("input").attr("disabled", true);
                $(hostCell).next().next().find("input").val(0);
            } else if (val == 2) {//2小数 启用字段长度和小数位数 并把字段长度改为10 和 2
                $(hostCell).next().find("input").attr("disabled", false);
                $(hostCell).next().find("input").val(10);

                $(hostCell).next().next().find("input").attr("disabled", false);
                $(hostCell).next().next().find("input").val(2);
            } else if (val == 3) { //3：日期时间 禁用 字段长度和小数位数 并改为20 0
                $(hostCell).next().find("input").attr("disabled", true);
                $(hostCell).next().find("input").val(20);

                $(hostCell).next().next().find("input").attr("disabled", true);
                $(hostCell).next().next().find("input").val(0);
            } else if (val == 4) {//4: 字符串   禁用小数位选择框
                //启用字段长度
                $(hostCell).next().find("input").attr("disabled", false);
                $(hostCell).next().find("input").val(50);

                $(hostCell).next().next().find("input").attr("disabled", true);
                $(hostCell).next().next().find("input").val(0);
            } else if (val == 5) {// 5：布尔类型 禁用字段长度和小数 并把值改为0
                $(hostCell).next().find("input").attr("disabled", true);
                $(hostCell).next().find("input").val(0);

                $(hostCell).next().next().find("input").attr("disabled", true);
                $(hostCell).next().next().find("input").val(0);
            } else if (val == 6 || val == 8) { //6:意见型： 禁用字段长度和小数 并把值改为0
                $(hostCell).next().find("input").attr("disabled", true);
                $(hostCell).next().find("input").val(0);

                $(hostCell).next().next().find("input").attr("disabled", true);
                $(hostCell).next().next().find("input").val(0);
            } else if (val == 7) { //7:日期 禁用字段长度和小数 并把值改为 20 0
                $(hostCell).next().find("input").attr("disabled", true);
                $(hostCell).next().find("input").val(20);

                $(hostCell).next().next().find("input").attr("disabled", true);
                $(hostCell).next().next().find("input").val(0);
            }
        });

        return $elem;
    },
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        /*if(null == this.fieldTypes || this.fieldTypes.size() < 1){
            this.initFieldTypes();
        }*/
        var code = editStausHtmlElem.val();
        var text= EditTable_SelectFieldTypeDataLoader.GetFieldDataTypeObjectByCode(code).Text;
        var $elem = $("<label IsSerialize='true' BindName='"+template.BindName+"' Value='"+code+"'>" + text + "</label>");
        return $elem;
    },
    ValidateToCompletedEnable:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        return EditTableValidate.Validate(val,template);
    }
}