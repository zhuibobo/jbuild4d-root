/**
 * Created by zhuangrb on 2018/8/18.
 */
var EditTable_TextBox={
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

        var $elem=$("<input type='text' IsSerialize='true' style='width: 98%' />")
        $elem.val(val);
        return $elem;
    },
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        var $elem = $("<label IsSerialize='true' BindName='"+template.BindName+"' Value='"+val+"'>" + val + "</label>");
        return $elem;
    },
    ValidateToCompletedEnable:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        // 是否有自定义校验方法
        if(typeof (template.Validate) != 'undefined' && typeof (template.Validate)== 'function') {
            var result = {Success: true, Msg: null};
            result.Success = template.Validate();
            return result;
        } else {
            return EditTableValidate.Validate(val, template);
        }
    }
}