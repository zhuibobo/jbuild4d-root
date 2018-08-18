/**
 * Created by zhuangrb on 2018/8/18.
 */
var EditTable_CheckBox={
    /*
     _config:配置对象
     template:当前模版
     hostCell:所处的单元格
     hostRow:所处的列
     hostTable:所处的表格
     viewStausHtmlElem:浏览状态的html元素
     jsonDataItem:json数据源
     */
    // 编辑时显示的标签
    Get_EditStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,viewStausHtmlElem,jsonDatas,jsonDataSingle){
        var val="";
        var bindname=template.BindName;
        if(template.DefaultValue!=undefined&&template.DefaultValue!=null) {
            var val = EditTableDefauleValue.GetValue(template);
        }
        if(jsonDataSingle!=null&&jsonDataSingle!=undefined) {
            val=jsonDataSingle[bindname];
        }
        if(viewStausHtmlElem!=null&&viewStausHtmlElem!=undefined) {
            val=viewStausHtmlElem.html();
        }
        var $elem="";
        if(val == "是"){
            $elem=$("<input type='checkbox' checked='checked' />")
        }else{
            $elem=$("<input type='checkbox' />")
        }
        $elem.val(val);
        return $elem;
    },
    //编辑完成时显示的状态 ， 数据初始化时调用方法
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        var $elem ="";
        if(template.IsCNValue){
            if (editStausHtmlElem.attr("checked") == "checked") {
                $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='是'>是</label>");
            } else {
                $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='否'>否</label>");
            }
        }
        else {
            if (editStausHtmlElem.attr("checked") == "checked") {
                $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='1'>是</label>");
            } else {
                $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' value='0'>否</label>");
            }
        }
        return $elem;
    },
    //值校验
    ValidateToCompletedEnable:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        return EditTableValidate.Validate(val,template);
    }
}