/**
 * Created by zhuangrb on 2018/8/18.
 */
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
        /*
        if((jsonDataSingle==null || jsonDataSingle==undefined)
            && (viewStausHtmlElem == null || viewStausHtmlElem==undefined)){
            defaultType = "none";
            defaultValue = "";
            defaultText = "无";
        }*/
        //debugger
        var fieldDefaultType = ""; //默认值类型
        var fieldDefaultValue = "";//默认值
        var fieldDefaultText = "";//默认值文本
        if(jsonDataSingle!=null&&jsonDataSingle!=undefined) {
            fieldDefaultType = jsonDataSingle["fieldDefaultType"] ? jsonDataSingle["fieldDefaultType"] : "";
            fieldDefaultValue = jsonDataSingle["fieldDefaultValue"] ? jsonDataSingle["fieldDefaultValue"] : "";
            fieldDefaultText = jsonDataSingle["fieldDefaultText"] ? jsonDataSingle["fieldDefaultText"] : "";
        }

        if(viewStausHtmlElem!=null&&viewStausHtmlElem!=undefined) {
            viewStausHtmlElem.find("label").each(function(){
                //debugger;
                if($(this).attr("BindName")=="fieldDefaultType"){
                    fieldDefaultType = $(this).attr("Value");
                }
                else if($(this).attr("BindName")=="fieldDefaultText"){
                    fieldDefaultText = $(this).attr("Value");
                }
                else if($(this).attr("BindName")=="fieldDefaultValue"){
                    fieldDefaultValue = $(this).attr("Value");
                }
            });
        }

        var $elem=$("<div></div>");
        var $inputTxt = $("<input type='text' style='width: 90%' readonly />");
        $inputTxt.attr("fieldDefaultType",fieldDefaultType);
        $inputTxt.attr("fieldDefaultValue",fieldDefaultValue);
        $inputTxt.attr("fieldDefaultText",fieldDefaultText);
        $inputTxt.val(JBuild4DSelectView.SelectEnvVariable.formatText(fieldDefaultType,fieldDefaultText));
        var $inputBtn = $("<input class='normalbutton-v1' style='margin-left: 4px;' type='button' value='...'/>")
        $elem.append($inputTxt).append($inputBtn);
        //将inputtext对象附加到window上,提供给后续的设置值的方法.
        window.$Temp$Inputtxt=$inputTxt;
        $inputBtn.click(function(){
            //JBuild4DSelectView.SelectEnvVariable.beginSelect("EditTable_SelectDefaultValue");
            if(window.tableDesion) {
                tableDesion.selectDefaultValueDialogBegin(EditTable_SelectDefaultValue, null)
            }
            else{
                window.parent.listDesign.selectDefaultValueDialogBegin(window,null);
                window._SelectBindObj={
                    setSelectEnvVariableResultValue:function (result) {
                        EditTable_SelectDefaultValue.setSelectEnvVariableResultValue(result);
                    }
                }
            }
        });
        return $elem;
    },
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var $inputTxt = editStausHtmlElem.find("input[type='text']");
        if($inputTxt.length > 0){
            var defaultType = $inputTxt.attr("fieldDefaultType");
            var defaultValue = $inputTxt.attr("fieldDefaultValue");
            var defaultText = $inputTxt.attr("fieldDefaultText");
            var  $elem = $("<div></div>");//一次只能返回一个标签对象
            $elem.append("<label>" + JBuild4DSelectView.SelectEnvVariable.formatText(defaultType,defaultText) + "</label>");
            $elem.append("<label IsSerialize='true' BindName='fieldDefaultType' Value='"+defaultType+"' style='display:none'/>");
            $elem.append("<label IsSerialize='true' BindName='fieldDefaultText' Value='"+defaultText+"' style='display:none'/>");
            $elem.append("<label IsSerialize='true' BindName='fieldDefaultValue' Value='"+defaultValue+"' style='display:none'/>");
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
            $inputTxt.attr("fieldDefaultType",defaultData.Type);
            $inputTxt.attr("fieldDefaultValue",defaultData.Value);
            $inputTxt.attr("fieldDefaultText",defaultData.Text);
            $inputTxt.val(JBuild4DSelectView.SelectEnvVariable.formatText(defaultData.Type,defaultData.Text));
        }
        else{
            $inputTxt.attr("fieldDefaultType","");
            $inputTxt.attr("fieldDefaultValue","");
            $inputTxt.attr("fieldDefaultText","");
            $inputTxt.val("");
        }
        //console.log(value);
    }
}