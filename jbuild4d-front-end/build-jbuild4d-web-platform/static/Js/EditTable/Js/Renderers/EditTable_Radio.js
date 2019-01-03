/**
 * Created by zhuangrb on 2018/8/18.
 */
var EditTable_Radio={
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
            //val=viewStausHtmlElem.html();
            val = viewStausHtmlElem.val();
        }
        var $elem="";
        if(null != viewStausHtmlElem &&
            viewStausHtmlElem!=undefined &&
            viewStausHtmlElem.attr("checked") == "checked" || val == 1){
            $elem=$("<input type='radio' IsSerialize='true' BindName='"+template.BindName+"' name='"+template.BindName+"' checked='checked' value='1'/>");
        }else{
            $elem=$("<input type='radio' IsSerialize='true' BindName='"+template.BindName+"' name='"+template.BindName+"' value='0'/>");
        }
        $elem.val(val);
        return $elem;
    },
    //编辑完成时显示的状态 ， 数据初始化时调用方法
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        var $elem ="";
        if(editStausHtmlElem.attr("checked") =="checked"){
            $elem=$("<input type='radio' IsSerialize='true' BindName='"+template.BindName+"' name='"+template.BindName+"'checked='checked'  value='1'/>");
        }else{
            $elem=$("<input type='radio' IsSerialize='true' BindName='"+template.BindName+"' name='"+template.BindName+"' value='0'/>");
        }
        return $elem;
    },
    //值校验
    ValidateToCompletedEnable:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        return EditTableValidate.Validate(val,template);
    }
}