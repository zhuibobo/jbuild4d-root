/**
 * Created by zhuangrb on 2018/11/23.
 */
JBuild4D.FormDesign.Plugins.FDCT_TextBox=JBuild4D.FormDesign.Plugins.CreateGeneralPlugin("FDCT_TextBox",{});
/*(JBuild4D.FormDesign.Plugins.FDCT_TextBox={
    Setting:{
        //插件名称
        SingleName:'FDCT_TextBox',

        //设置对话框相关设置
        DialogName:'',
        DialogWidth:null,
        DialogHeight:null,
        DialogPageUrl:BaseUtility.AppendTimeStampUrl('Dialog.html'),
        DialogTitle:"DIV",

        //设计器工具栏相关设置
        ToolbarCommand:'',
        //工具栏触发命令的名称,需要保持唯一
        ToolbarIcon:'Icon.png',
        ToolbarLabel:"",
        ToolbarLocation:'',

        //设计控件相关的对话框
        IFrameWindow:null,
        //设计控件对话框将执行的工作
        IFrameExecuteActionName:"Insert",
        //需要引入到设计器的样式文件
        DesignModalInputCss:"",

        //客户端与服务端解析类
        ClientResolve:"",
        ServerResolve:"",

        Init:function () {
            JBuild4D.FormDesign.Plugins.InitPluginSetting(this);
        }
    }
}).Setting.Init();*/

CKEDITOR.plugins.add(JBuild4D.FormDesign.Plugins.FDCT_TextBox.Setting.SingleName, {
    init: function(editor) {
        var ControlSetting = JBuild4D.FormDesign.Plugins.FDCT_TextBox.Setting;

        function addToEditor(ckEditor, pluginSetting, props, contentWindow){
            JBuild4D.FormDesign.Control.BuildGeneralElemToCKWysiwyg("<input type='text' />", pluginSetting, props, contentWindow);
        }

        JBuild4D.FormDesign.Plugins.BuildGeneralPluginToEditor(editor, this.path, ControlSetting,addToEditor);

        /*CKEDITOR.dialog.addIframe(
            ControlSetting.DialogName,
            ControlSetting.DialogSettingTitle,
            this.path +ControlSetting.DialogPageUrl, ControlSetting.DialogWidth, ControlSetting.DialogHeight,
            function () {
                var iframe = document.getElementById(this._.frameId);
                ControlSetting.IFrameWindow = iframe;
                JBuild4D.FormDesign.Dialog.SetElemPropsInEditDialog(ControlSetting.IFrameWindow, ControlSetting.IFrameExecuteActionName);
            },
            {
                //对话框确认按钮触发的事件
                onOk: function () {
                    var props=ControlSetting.IFrameWindow.contentWindow.DialogApp.getControlProps();
                    if(props.success==false) {
                        return false;
                    }

                    ControlSetting.IFrameExecuteActionName=JBuild4D.FormDesign.Dialog.DialogExecuteInsertActionName;
                },
                //取消按钮对话框
                onCancel:function(){
                    ControlSetting.IFrameExecuteActionName=JBuild4D.FormDesign.Dialog.DialogExecuteInsertActionName;
                }
            }
        );*/

        /*editor.addCommand(ControlSetting.ToolbarCommand,new CKEDITOR.dialogCommand(ControlSetting.DialogName));

        editor.ui.addButton(ControlSetting.SingleName, {
            label: ControlSetting.ToolbarLabel,
            icon: this.path + ControlSetting.ToolbarIcon,
            command: ControlSetting.ToolbarCommand,
            toolbar: ControlSetting.ToolbarLocation
        });

        editor.on('doubleclick', function(event) {
            ControlSetting.IFrameExecuteActionName = JBuild4D.FormDesign.Dialog.DialogExecuteEditActionName;
            JBuild4D.FormDesign.Control.OnCKWysiwygElemDBClickEvent(event, ControlSetting)
        });*/
    }
});