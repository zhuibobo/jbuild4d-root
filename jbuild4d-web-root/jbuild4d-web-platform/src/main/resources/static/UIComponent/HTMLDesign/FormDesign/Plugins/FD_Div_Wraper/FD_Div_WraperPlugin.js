/**
 * Created by zhuangrb on 2016/01/20.
 */

JBuild4D.FromDesign.Plugins.FD_Div_WraperPlugin={
    Setting:{
        Name:'FormDesign_DEF_Container_Div',                                          //插件名称
        GroupName:'Form_Container,1',                                                 //所在工具栏分组

        RendererType:'Form_Container_Div',

        DialogName:'',                                                              //设置对话框名称
        DialogWidth:580,                                                            //对话框的宽度
        DialogHeight:350,                                                           //对话框的高度
        DialogSettingPageUrl:StringUtility.GetTimeStampUrl('dialogs/htmldialog.html'),   //设置的页面地址
        DialogSettingTitle:"DIV",

        ToolbarCommand:'',                                                        //工具栏触发命令的名称,需要保持唯一
        ToolbarIcon:'',                                                           //工具栏图标
        ToolbarLabel:"DIV",                                                   //工具栏提示

        IFrameWindow:null,
        IRCommandName:"Insert",
        DesignModalInputCss:"Css.css",
        ServerResolve:"com.sevenstar.platform.categoryfrom.controls.impl.ContainerDivImpl",//服务端的解析类

        Init:function () {
            this.DialogName=this.Name;
            this.DialogSettingPageUrl=StringUtility.GetTimeStampUrl("dialogs/"+this.Name+"_Dialog.jsp");
            this.ToolbarCommand="COM.FromDesign.CKEditorPlugins."+this.Name;
            this.ToolbarIcon="Icon.png";
            this.DialogSettingTitle=this.ToolbarLabel+"控件";
        }
    }
}

JBuild4D.FromDesign.Plugins.FD_Div_WraperPlugin.Setting.Init();

CKEDITOR.plugins.add(JBuild4D.FromDesign.Plugins.FD_Div_WraperPlugin.Setting.Name, {

    init: function( editor ) {
        var exsetting=JBuild4D.FromDesign.Plugins.FD_Div_WraperPlugin.Setting;

        if(exsetting.DesignModalInputCss!=undefined&&exsetting.DesignModalInputCss!=null&&exsetting.DesignModalInputCss!="") {
            var cssPath = this.path + exsetting.DesignModalInputCss;
            editor.on('mode', function () {
                if (editor.mode == 'wysiwyg') {
                    this.document.appendStyleSheet(cssPath);
                }
            });
        }

        CKEDITOR.dialog.addIframe(
            exsetting.DialogName,
            exsetting.DialogSettingTitle,
            this.path +exsetting.DialogSettingPageUrl, exsetting.DialogWidth, exsetting.DialogHeight,
            function () {
                var iframe = document.getElementById(this._.frameId);
                exsetting.IFrameWindow = iframe;
                SimpleControlUtil.SetElemPropsInEditDialog(exsetting.IFrameWindow, exsetting.IRCommandName);
            }, {
                onOk: function () {
                    var propsJson = exsetting.IFrameWindow.contentWindow.PageFunc.GetProps();
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

        editor.addCommand(exsetting.ToolbarCommand,new CKEDITOR.dialogCommand(exsetting.DialogName));

        editor.ui.addButton(exsetting.Name, {
            label: exsetting.ToolbarLabel,
            icon: this.path + exsetting.ToolbarIcon,
            command: exsetting.ToolbarCommand,
            toolbar: exsetting.GroupName
        });

        editor.on('doubleclick', function( evt ) {
            SimpleControlUtil.CKEditorElemDBClickEvent(evt,exsetting);
        })
    }
});