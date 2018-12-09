/**
 * Created by zhuangrb on 2018/11/05.
 */
var Column_SelectDefaultValue={
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
        /*
        if((jsonDataSingle==null || jsonDataSingle==undefined)
            && (viewStausHtmlElem == null || viewStausHtmlElem==undefined)){
            defaultType = "none";
            defaultValue = "";
            defaultText = "无";
        }*/
        //debugger
        var defaultType = ""; //默认值类型
        var defaultValue = "";//默认值
        var defaultText = "";//默认值文本
        if(jsonDataSingle!=null&&jsonDataSingle!=undefined) {
            defaultType = jsonDataSingle["columnDefaultType"] ? jsonDataSingle["columnDefaultType"] : "";
            defaultValue = jsonDataSingle["columnDefaultValue"] ? jsonDataSingle["columnDefaultValue"] : "";
            defaultText = jsonDataSingle["columnDefaultText"] ? jsonDataSingle["columnDefaultText"] : "";
        }

        if(viewStausHtmlElem!=null&&viewStausHtmlElem!=undefined) {
            viewStausHtmlElem.find("label").each(function(){
                //debugger;
                if($(this).attr("BindName")=="columnDefaultType"){
                    defaultType = $(this).attr("Value");
                }
                else if($(this).attr("BindName")=="columnDefaultText"){
                    defaultText = $(this).attr("Value");
                }
                else if($(this).attr("BindName")=="columnDefaultValue"){
                    defaultValue = $(this).attr("Value");
                }
            });
        }

        var $elem=$("<div></div>");
        var $inputTxt = $("<input type='text' style='width: 90%' readonly />");
        $inputTxt.attr("columnDefaultType",defaultType);
        $inputTxt.attr("columnDefaultValue",defaultValue);
        $inputTxt.attr("columnDefaultText",defaultText);
        $inputTxt.val(JBuild4DSelectView.SelectEnvVariable.formatText(defaultType,defaultText));
        var $inputBtn = $("<input class='normalbutton-v1' style='margin-left: 4px;' type='button' value='...'/>")
        $elem.append($inputTxt).append($inputBtn);
        //将inputtext对象附加到window上,提供给后续的设置值的方法.
        window.$Temp$Inputtxt=$inputTxt;
        $inputBtn.click(function(){
            JBuild4DSelectView.SelectEnvVariable.beginSelect("Column_SelectDefaultValue");
        });
        return $elem;
    },
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var $inputTxt = editStausHtmlElem.find("input[type='text']");
        if($inputTxt.length > 0){
            var defaultType = $inputTxt.attr("columnDefaultType");
            var defaultValue = $inputTxt.attr("columnDefaultValue");
            var defaultText = $inputTxt.attr("columnDefaultText");
            var  $elem = $("<div></div>");//一次只能返回一个标签对象
            $elem.append("<label>" + JBuild4DSelectView.SelectEnvVariable.formatText(defaultType,defaultText) + "</label>");
            $elem.append("<label IsSerialize='true' BindName='columnDefaultType' Value='"+defaultType+"' style='display:none'/>");
            $elem.append("<label IsSerialize='true' BindName='columnDefaultText' Value='"+defaultText+"' style='display:none'/>");
            $elem.append("<label IsSerialize='true' BindName='columnDefaultValue' Value='"+defaultValue+"' style='display:none'/>");
            return $elem;
        }
        return $("<label></label>");
    },
    ValidateToCompletedEnable:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        return EditTableValidate.Validate(val,template);
    },
    setSelectEnvVariableResultValue:function (defaultData) {
        var $inputTxt=window.$Temp$Inputtxt;
        if(null != defaultData){
            $inputTxt.attr("columnDefaultType",defaultData.Type);
            $inputTxt.attr("columnDefaultValue",defaultData.Value);
            $inputTxt.attr("columnDefaultText",defaultData.Text);
            $inputTxt.val(JBuild4DSelectView.SelectEnvVariable.formatText(defaultData.Type,defaultData.Text));
        }
        else
        {
            $inputTxt.attr("columnDefaultType","");
            $inputTxt.attr("columnDefaultValue","");
            $inputTxt.attr("columnDefaultText","");
            $inputTxt.val("");
        }
        //console.log(value);
    }
}