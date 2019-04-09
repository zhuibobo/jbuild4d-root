var FormRuntime={
    _Prop_Status:"Edit",
    _Prop_Config:{
        RendererTo:null,
        FormId:""
    },
    Initialization:function (_config) {
        this._Prop_Config= $.extend(true,{},this._Prop_Config,_config);

        this._LoadHTMLToEl();
    },
    _LoadHTMLToEl:function () {
        //debugger;
        $(this._Prop_Config.RendererTo).load(BaseUtility.GetRootPath()+"/PlatFormRest/Builder/FormRuntime/FormPreview?formId="+this._Prop_Config.FormId, function() {
            //alert( "Load was performed." );
            console.log("加载预览窗体成功!");
        });
    }
}