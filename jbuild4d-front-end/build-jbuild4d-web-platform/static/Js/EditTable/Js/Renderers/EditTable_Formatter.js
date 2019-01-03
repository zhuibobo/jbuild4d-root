/**
 * Created by zhuangrb on 2018/8/18.
 */
var EditTable_Formatter={
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
        if(template.Formatter && typeof(template.Formatter) == "function"){
            //var $editTable = hostTable;
            var editDatas = EditTable._Prop_JsonData;
            if(editDatas){
                var rowId = hostRow.attr("id");
                var rowData = editDatas[rowId];
                if(rowData){
                    return $(template.Formatter(template,hostCell,hostRow,hostTable,rowData));
                }
            }
        }
        return "";
    },
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem,jsonDatas, jsonDataSingle) {
        if(template.Formatter && typeof(template.Formatter) == "function"){
            //var $editTable = hostTable;
            var editDatas = EditTable._Prop_JsonData;
            if(editDatas){
                var rowId = hostRow.attr("id");
                var rowData = editDatas[rowId];
                if(rowData) {
                    return $(template.Formatter(template, hostCell, hostRow, hostTable, rowData));
                }
            }
        }
        return "";
    },
    ValidateToCompletedEnable:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        return EditTableValidate.Validate(val,template);
    }
}