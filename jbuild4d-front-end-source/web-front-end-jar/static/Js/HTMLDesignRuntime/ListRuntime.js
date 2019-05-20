/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2019/5/6
**To change this template use File | Settings | File Templates.
*/
var ListRuntime={
    _Prop_Status:"Edit",
    _Prop_Config:{
        RendererTo:null,
        ListId:""
    },
    Initialization:function (_config) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);

        this._LoadHTMLToEl();
    },
    _LoadHTMLToEl:function () {
        //debugger;
        $(this._Prop_Config.RendererTo).load(BaseUtility.GetRootPath()+"/PlatFormRest/Builder/ListRuntime/ListPreview?listId="+this._Prop_Config.ListId, function() {
            console.log("加载预览列表成功!");
        });
    }
}