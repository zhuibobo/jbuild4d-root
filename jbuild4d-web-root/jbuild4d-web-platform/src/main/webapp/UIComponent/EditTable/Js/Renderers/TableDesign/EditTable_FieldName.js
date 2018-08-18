/**
 * Created by zhuangrb on 2018/8/18.
 */
var EditTable_FieldName = {
    /*
     _config:配置对象
     template:当前模版
     hostCell:所处的单元格
     hostRow:所处的列
     hostTable:所处的表格
     viewStausHtmlElem:浏览状态的html元素
     jsonDataItem:json数据源
     */
    Get_EditStatus_HtmlElem: function (_config, template, hostCell, hostRow, hostTable, viewStausHtmlElem, jsonDatas, jsonDataSingle) {
        var val = "";
        var bindname = template.BindName;
        if (template.DefaultValue != undefined && template.DefaultValue != null) {
            var val = EditTableDefauleValue.GetValue(template);
        }
        if (jsonDataSingle != null && jsonDataSingle != undefined) {
            val = jsonDataSingle[bindname];
        }
        if (viewStausHtmlElem != null && viewStausHtmlElem != undefined) {
            val = viewStausHtmlElem.html();
        }
        var $elem = $("<input type='text' style='width: 98%' />")
        $elem.val(val);
        $elem.attr("BindName", template.BindName);
        $elem.attr("Val", val);
        $elem.attr("IsSerialize", "true");
        return $elem;
    },
    Get_CompletedStatus_HtmlElem: function (_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
        var val = (editStausHtmlElem.val()).toUpperCase();
        var $elem = $("<label IsSerialize='true' BindName='" + template.BindName + "' Value='" + val + "'>" + val + "</label>");
        return $elem;
    },
    ValidateToCompletedEnable: function (_config, template, hostCell, hostRow, hostTable, editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        var result = EditTableValidate.Validate(val, template);
        if (result.Success) {
            hostTable.find("[renderer=EditTable_FieldName]").each(function () {
                var seritem = $(this);
                seritem.find("label").each(function () {
                    var labelitem = $(this);
                    if (labelitem.text() == val || labelitem.text() == val.toUpperCase()) {
                        result = {Success: false, Msg: "[字段名称]不能重复!"};
                        return;
                    }
                });
            });
        }
        return result;
    }
}