var EditTable_SelectDefaultValue={
    /*
     _config:配置对象
     template:当前模版
     hostCell:所处的单元格
     hostRow:所处的列
     hostTable:所处的表格
     viewStausHtmlElem:浏览状态的html元素
     jsonDataItem:json数据源
     */
    Get_EditStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,viewStausHtmlElem,jsonDatas,jsonDataSingle){
        var defaultType = ""; //默认值类型
        var defaultValue = "";//默认值
        var defaultText = "";//默认值文本
        if(jsonDataSingle!=null&&jsonDataSingle!=undefined) {
            var tmpdeftext =  jsonDataSingle["fieldDefaultEntity.defaultValueName"];
            defaultText = (tmpdeftext == undefined || null == tmpdeftext) ? "" : tmpdeftext;
            var tmpdeftype = jsonDataSingle["fieldDefaultEntity.defaultType"];
            defaultType = (tmpdeftype == undefined || null == tmpdeftype) ? "none" : tmpdeftype;
            var tmpdefval = jsonDataSingle["fieldDefaultEntity.defaultValue"];
            defaultValue = (tmpdefval == undefined || null == tmpdefval) ? "" : tmpdefval;
        }

        if(viewStausHtmlElem!=null&&viewStausHtmlElem!=undefined) {
            viewStausHtmlElem.find("[labeltype='text']").each(function(){
                var seritem=$(this);
                defaultText = seritem.attr("Value");
            });
            viewStausHtmlElem.find("[labeltype='defaultType']").each(function(){
                var seritem=$(this);
                defaultType = seritem.attr("Value");
            });
            viewStausHtmlElem.find("[labeltype='defaultValue']").each(function(){
                var seritem=$(this);
                defaultValue = seritem.attr("Value");
            });
        }

        if((jsonDataSingle==null || jsonDataSingle==undefined)
            && (viewStausHtmlElem == null || viewStausHtmlElem==undefined)){
            defaultType = "none";
            defaultValue = "";
            defaultText = "无";
        }

        var $elem=$("<div></div>");
        var $inputtxt = $("<input type='text' style='width: 95%' />");
        $inputtxt.val(defaultText);
        $inputtxt.attr("defaulttype",defaultType);
        $inputtxt.attr("defaultval",defaultValue);
        var $inputbtn = $("<input class='normalbutton-v1' style='margin-left: 4px;' type='button' value='...'/>")
        if(null != viewStausHtmlElem && undefined != viewStausHtmlElem){
            $inputtxt.val(viewStausHtmlElem.text());
        }
        $elem.append($inputtxt).append($inputbtn);
        //将inputtext对象附加到window上,提供给后续的设置值的方法.
        window.$Temp$Inputtxt=$inputtxt;
        $inputbtn.click(function(){
            SelectEnvVariable.beginSelect("EditTable_SelectDefaultValue");
        });
        return $elem;
    },
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var $inputtxt = editStausHtmlElem.find("input[type='text']");
        if($inputtxt.length > 0){
            var val =   $inputtxt.val();
            var defaulttype = $inputtxt.attr("defaulttype");
            var defaultval = $inputtxt.attr("defaultval");
            if(null == val || "" == $.trim(val)  || "无" == val || "无:" == val){
                val = "无";
                defaulttype　= "none" ;
                defaultval = "";
            }
            var  $elem = $("<div></div>");//一次只能返回一个标签对象
            $elem.append("<label labeltype='text' IsSerialize='true'BindName='"+template.BindName+"' Value='"+val+"'>" + val + "</label>");
            $elem.append("<label labeltype='defaultType' IsSerialize='true'BindName='fieldDefaultEntity.defaultType' Value='"+defaulttype+"' style='display:none'/>");
            $elem.append("<label labeltype='defaultValue' IsSerialize='true'BindName='fieldDefaultEntity.defaultValue' Value='"+defaultval+"' style='display:none'/>");
            return $elem;
        }
        return $("<label></label>");
    },
    ValidateToCompletedEnable:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        return EditTableValidate.Validate(val,template);
    },
    SetSelectResultValue:function (defaultData) {
        var $inputtxt=window.$Temp$Inputtxt;
        if(null != defaultData){
            $inputtxt.attr("selectType",defaultData.Type);
            $inputtxt.attr("selectValue",defaultData.Value);
            $inputtxt.attr("selectText",defaultData.Text);
            $inputtxt.val(SelectEnvVariable.formatText(defaultData.Type,defaultData.Text));
        }
        //console.log(value);
    }
}