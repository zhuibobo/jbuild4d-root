/**
 * Created by zhuangrb on 2018/8/18.
 */
var EditTable_Select={
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
        //获取下拉列表的数据源
        var configSource=null;
        if(template.ClientDataSource!=undefined&&template.ClientDataSource!=null) {
            configSource = template.ClientDataSource;
        }
        else if(template.ClientDataSourceFunc!=undefined&&template.ClientDataSourceFunc!=null) {
            configSource = template.ClientDataSourceFunc(template.ClientDataSourceFuncParas,_config,template,hostCell,hostRow,hostTable,viewStausHtmlElem,jsonDatas,jsonDataSingle);
        }

        if(configSource==null)
        {
            return $("<label>找不到数据源设置,请在template中设置数据源</label>")
        }

        var val="";
        var txt="";
        var bindname=template.BindName;
        if(template.DefaultValue!=undefined&&template.DefaultValue!=null) {
            var val = EditTableDefauleValue.GetValue(template);
        }
        if(jsonDataSingle!=null&&jsonDataSingle!=undefined) {
            val=jsonDataSingle[bindname];
        }
        if(viewStausHtmlElem!=null&&viewStausHtmlElem!=undefined) {
            val=viewStausHtmlElem.attr("Value");
        }

        //var txt=configSource[val]

        /*configSource=[{
            group:"name",
            options:[{
                value:"1",
                text:"2"
            },{
                value:"",
                text:""
            }]
        },{
            group:"name",
            options:[{
                value:"",
                text:""
            },{
                value:"",
                text:""
            }]
        }]*/

        //debugger;
        var $elem=$("<select style='width: 100%' />");

        if(configSource[0].Group) {
            for (var i = 0; i < configSource.length; i++) {
                var optgroup=$("<optgroup />");
                optgroup.attr("label",configSource[i].Group);
                if(configSource[i].Options){
                    for(var j=0;j<configSource[i].Options.length;j++){
                        var option=$("<option />");
                        option.attr("value",configSource[i].Options[j].Value);
                        option.attr("text",configSource[i].Options[j].Text);
                        option.text(configSource[i].Options[j].Text);
                        optgroup.append(option);
                    }
                }
                $elem.append(optgroup);
            }
        }
        else{
            for (var i = 0; i < configSource.length; i++) {
                var item=configSource[i];
                $elem.append("<option value='"+item.Value+"' text='"+item.Text+"'>"+item.Text+"</option>");
            }
        }

        $elem.val(val);

        if(typeof(template.ChangeEvent)=="function") {
            $elem.change(function () {
                template.ChangeEvent(this,_config,template,hostCell,hostRow,hostTable,viewStausHtmlElem);
            });
        }

        return $elem;
    },
    Get_CompletedStatus_HtmlElem:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.find("option:selected").attr("Value");
        var text = editStausHtmlElem.find("option:selected").attr("Text");
        if(!val){
            val="";
        }
        if(!text){
            text="";
        }
        var $elem = $("<label IsSerialize='true' BindName='"+template.BindName+"' Value='"+val+"' Text='"+text+"'>" + text + "</label>");
        return $elem;
    },
    ValidateToCompletedEnable:function(_config,template,hostCell,hostRow,hostTable,editStausHtmlElem) {
        var val = editStausHtmlElem.val();
        return EditTableValidate.Validate(val,template);
    }
}