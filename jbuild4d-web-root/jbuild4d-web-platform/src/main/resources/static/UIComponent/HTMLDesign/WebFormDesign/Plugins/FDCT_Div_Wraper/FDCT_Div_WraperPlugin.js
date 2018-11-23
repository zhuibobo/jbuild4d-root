/**
 * Created by zhuangrb on 2018/11/23.
 */
(JBuild4D.FormDesign.Plugins.FDCT_Div_Wraper={
    Setting:{
        //插件名称
        Name:'FDCT_Div_Wraper',

        //设置对话框相关设置
        DialogName:'',
        DialogWidth:580,
        DialogHeight:350,
        DialogPageUrl:StringUtility.GetTimeStampUrl('Dialog.html'),
        DialogTitle:"DIV",

        //设计器工具栏相关设置
        ToolbarCommand:'',
        //工具栏触发命令的名称,需要保持唯一
        ToolbarIcon:'Icon.png',
        ToolbarLabel:"",
        ToolbarLocation:'',

        IFrameWindow:null,
        IRCommandName:"Insert",
        DesignModalInputCss:"Css.css",

        //客户端与服务端解析类
        ClientResolve:"",
        ServerResolve:"",

        Init:function () {
            //使用默认值覆盖定义的空值
            JBuild4D.FormDesign.CoverEmptyPluginProp(this);
            //alert(this.ToolbarLocation);
            this.DialogName=this.Name;
            this.ToolbarCommand="JBuild4D.FormDesign.Plugins."+this.Name;
            this.DialogSettingTitle=this.ToolbarLabel+"控件";
        }
    }
}).Setting.Init();

CKEDITOR.plugins.add(JBuild4D.FormDesign.Plugins.FDCT_Div_Wraper.Setting.Name, {
    init: function(editor) {
        var ControlSetting=JBuild4D.FormDesign.Plugins.FDCT_Div_Wraper.Setting;

        if(ControlSetting.DesignModalInputCss!=undefined&&ControlSetting.DesignModalInputCss!=null&&ControlSetting.DesignModalInputCss!="") {
            var cssPath = this.path + ControlSetting.DesignModalInputCss;
            editor.on('mode', function () {
                if (editor.mode == 'wysiwyg') {
                    this.document.appendStyleSheet(cssPath);
                }
            });
        }

        CKEDITOR.dialog.addIframe(
            ControlSetting.DialogName,
            ControlSetting.DialogSettingTitle,
            this.path +ControlSetting.DialogSettingPageUrl, ControlSetting.DialogWidth, ControlSetting.DialogHeight,
            function () {
                var iframe = document.getElementById(this._.frameId);
                ControlSetting.IFrameWindow = iframe;
                SimpleControlUtil.SetElemPropsInEditDialog(exsetting.IFrameWindow, exsetting.IRCommandName);
            }, {
                onOk: function () {
                    var propsJson = ControlSetting.IFrameWindow.contentWindow.PageFunc.GetProps();
                    var $html=$("<div><div is_container='true' server_resolve='"+exsetting.ServerResolve+"' class='Form_Container_DivPlugin_Design_Modal' renderer_type="+exsetting.RendererType+" /></div>");
                    if(propsJson.ishide=="true"){
                        $html.find("div").addClass("Form_Container_DivPlugin_Design_Modal_Hidden");
                    }
                    if(propsJson.createinnertable=="true"){
                        $html.find("div").html("<table style='width: 80%;margin:auto' border='1'>" +
                            "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>" +
                            "<tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>" +
                            "</table>")
                    }
                    SimpleControlUtil.PluginDialogOkEvent(exsetting,$html.html());
                },
                onCancel:function(){
                    //SimpleControlUtil.PluginDialogCancelEvent(exsetting);
                }
            }
        );

        editor.addCommand(ControlSetting.ToolbarCommand,new CKEDITOR.dialogCommand(ControlSetting.DialogName));

        editor.ui.addButton(ControlSetting.Name, {
            label: ControlSetting.ToolbarLabel,
            icon: this.path + ControlSetting.ToolbarIcon,
            command: ControlSetting.ToolbarCommand,
            toolbar: ControlSetting.ToolbarLocation
        });

        editor.on('doubleclick', function( evt ) {
            SimpleControlUtil.CKEditorElemDBClickEvent(evt,ControlSetting);
        })
    }
});