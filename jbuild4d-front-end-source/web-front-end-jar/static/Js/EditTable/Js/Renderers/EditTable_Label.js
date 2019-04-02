/**
 * Created by zhuangrb on 2018/8/18.
 */
var EditTable_Label={
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
        //debugger;
        if(template.DefaultValue!=undefined&&template.DefaultValue!=null) {
            val = EditTableDefauleValue.GetValue(template);
        }
        if(jsonDataSingle!=null&&jsonDataSingle!=undefined) {
            val=jsonDataSingle[bindname];
        }
        if(viewStausHtmlElem!=null&&viewStausHtmlElem!=undefined) {
            if(typeof (template.Formater) === 'undefined') {
                val=viewStausHtmlElem.html();
            } else {
                val=viewStausHtmlElem.attr("Value");
            }
        }
        var $elem;
        if(typeof (template.Formater) === 'undefined') {
            $elem = $("<label IsSerialize='true' Text='"+ text +"' BindName='"+template.BindName+"' Value='"+val+"'>" + val + "</label>");
        } else {
            var text = template.Formater(val);
            $elem = $("<label IsSerialize='true' Text="+ text +" BindName='"+template.BindName+"' Value="+val+">" + text + "</label>");
        }
        $elem.val(val);
        return $elem;
    },
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var $elem;
        var val = editStausHtmlElem.val();
        if(typeof (template.Formater) === 'undefined') {
            $elem = $("<label IsSerialize='true' Text='"+ text +"' BindName='"+template.BindName+"' Value='"+val+"'>" + val + "</label>");
        } else {
            var text = template.Formater(val);
            $elem = $("<label IsSerialize='true' Text='"+ text +"' BindName='"+template.BindName+"' Value='"+val+"'>" + text + "</label>");
        }
        $elem.val(val);
        return $elem;
    },
    ValidateToCompletedEnable:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        return EditTableValidate.Validate(val,template);
    }
}