/**
 * Created by zhuangrb on 2018/8/18.
 */
if (!Object.create) {
    Object.create = (function(){
        function F(){}

        return function(o){
            if (arguments.length != 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o;
            return new F()
        }
    })()
}

var EditTableConfig={
    Status:"Edit",//状态 编辑 Edit 浏览 View
    Templates:[
        {
            Title:"表名1",
            FieldName:"TableField",
            Renderer:"EditTable_TextBox",
            TitleCellClassName:"TitleCell",
            Hidden:false,
            TitleCellAttrs:{}
        },{
            Title:"字段类型",
            FieldName:"TableField",
            Renderer:"EditTable_TextBox",
            Hidden:false
        },{
            Title:"备注",
            FieldName:"TableField",
            Renderer:"EditTable_TextBox",
            Hidden:false
        }
    ],
    RowIdCreater:function(){

    },
    TableClass:"EditTable",
    RendererTo:"divTreeTable",//div elem
    TableId:"EditTable",
    TableAttrs:{cellpadding:"1",cellspacing:"1",border:"1"}
}
var EditTableData={

}