class CKEditorPluginUtility {


    static PluginsServerConfig={
        //来自服务端的插件的相关的配置,在初始的时候写入
    };

    static AddPluginsServerConfig(singleName,toolbarLocation,text,clientResolve,serverResolve,clientResolveJs,dialogWidth,dialogHeight,isJBuild4DData){
        this.PluginsServerConfig[singleName]={
            SingleName:singleName,
            ToolbarLocation:toolbarLocation,
            ToolbarLabel:text,
            ClientResolve:clientResolve,
            ServerResolve:serverResolve,
            ClientResolveJs:clientResolveJs,
            DialogWidth:dialogWidth,
            DialogHeight:dialogHeight,
            IsJBuild4DData:isJBuild4DData
        }
    };

    static Plugins={
        //用于存储插件的最终的属性的定义
    };

    static _UseServerConfigCoverEmptyPluginProp(obj) {
        var coverObj = this.PluginsServerConfig[obj.SingleName];
        //debugger;
        for (var prop in obj) {
            if (typeof(obj[prop]) != "function") {
                if (obj[prop] == "" || obj[prop] == null) {
                    if (coverObj[prop]) {
                        obj[prop] = coverObj[prop];
                    }
                }
            }
        }
        return obj;
    }

    static GetGeneralPluginInstance(pluginSingleName, exConfig) {
        //设置为""时才会使用服务端的配置进行覆盖
        var defaultSetting = {
            //插件名称
            SingleName: pluginSingleName,
            //设置对话框相关设置
            DialogName: '',
            DialogWidth: null,
            DialogHeight: null,
            DialogPageUrl: BaseUtility.AppendTimeStampUrl('Dialog.html'),
            DialogTitle: "DIV",
            //设计器工具栏相关设置
            ToolbarCommand: '',
            //工具栏触发命令的名称,需要保持唯一
            ToolbarIcon: 'Icon.png',
            ToolbarLabel: "",
            ToolbarLocation: '',
            //设计控件相关的对话框
            IFrameWindow: null,
            //设计控件对话框将执行的工作
            IFrameExecuteActionName: "Insert",
            //需要引入到设计器的样式文件
            DesignModalInputCss: "",
            //客户端与服务端解析类
            ClientResolve: "",
            ServerResolve: "",
            //是否是数据控件
            IsJBuild4DData: ""
        };
        //使用方法参数覆盖默认值
        defaultSetting = $.extend(true, {}, defaultSetting, exConfig);
        //使用服务端定义覆盖定义的空值;
        defaultSetting = CKEditorPluginUtility._UseServerConfigCoverEmptyPluginProp(defaultSetting);
        defaultSetting.DialogName = defaultSetting.SingleName;
        defaultSetting.ToolbarCommand = "JBuild4D.FormDesign.Plugins." + defaultSetting.SingleName;
        defaultSetting.DialogSettingTitle = defaultSetting.ToolbarLabel + "Web控件";
        //debugger;
        return {
            Setting: defaultSetting
        };
    }

    static RegGeneralPluginToEditor(ckEditor, path, pluginSetting, okFunc) {
        CKEDITOR.dialog.addIframe(
            pluginSetting.DialogName,
            pluginSetting.DialogSettingTitle,
            path + pluginSetting.DialogPageUrl, pluginSetting.DialogWidth, pluginSetting.DialogHeight,
            function () {
                var iframe = document.getElementById(this._.frameId);
                pluginSetting.IFrameWindow = iframe;
                JBuild4D.FormDesign.Dialog.SetElemPropsInEditDialog(pluginSetting.IFrameWindow, pluginSetting.IFrameExecuteActionName);
            },
            {
                //对话框确认按钮触发的事件
                onOk: function () {
                    var props = pluginSetting.IFrameWindow.contentWindow.DialogApp.getControlProps();
                    if (props.success == false) {
                        return false;
                    }
                    //JBuild4D.FormDesign.Control.BuildGeneralElemToCKWysiwyg("<input type='text' />",ControlSetting,props,ControlSetting.IFrameWindow.contentWindow);
                    okFunc(ckEditor, pluginSetting, props, pluginSetting.IFrameWindow.contentWindow);
                    pluginSetting.IFrameExecuteActionName = JBuild4D.FormDesign.Dialog.DialogExecuteInsertActionName;
                },
                //取消按钮对话框
                onCancel: function () {
                    pluginSetting.IFrameExecuteActionName = JBuild4D.FormDesign.Dialog.DialogExecuteInsertActionName;
                }
            }
        );

        ckEditor.addCommand(pluginSetting.ToolbarCommand, new CKEDITOR.dialogCommand(pluginSetting.DialogName));

        ckEditor.ui.addButton(pluginSetting.SingleName, {
            label: pluginSetting.ToolbarLabel,
            icon: path + pluginSetting.ToolbarIcon,
            command: pluginSetting.ToolbarCommand,
            toolbar: pluginSetting.ToolbarLocation
        });

        ckEditor.on('doubleclick', function (event) {
            pluginSetting.IFrameExecuteActionName = JBuild4D.FormDesign.Dialog.DialogExecuteEditActionName;
            JBuild4D.FormDesign.Control.OnCKWysiwygElemDBClickEvent(event, pluginSetting)
        });
    }
}