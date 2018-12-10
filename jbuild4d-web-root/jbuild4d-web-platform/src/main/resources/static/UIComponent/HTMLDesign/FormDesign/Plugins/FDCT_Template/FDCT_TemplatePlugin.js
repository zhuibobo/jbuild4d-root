/**
 * Created by zhuangrb on 2018/11/23.
 */

(function(pluginName){
    JBuild4D.FormDesign.Plugins[pluginName]=JBuild4D.FormDesign.Plugins.CreateGeneralPlugin(pluginName,{});

    CKEDITOR.plugins.add(JBuild4D.FormDesign.Plugins[pluginName].Setting.SingleName, {
        init: function(editor) {
            //点击确认时候指定的操作
            function addToEditor(ckEditor, pluginSetting, props, contentWindow){
                JBuild4D.FormDesign.Control.BuildGeneralElemToCKWysiwyg("<input type='text' />", pluginSetting, props, contentWindow);
            }
            //注册常规插件的操作
            JBuild4D.FormDesign.Plugins.RegGeneralPluginToEditor(editor, this.path, JBuild4D.FormDesign.Plugins[pluginName].Setting,addToEditor);
        }
    });
})("FDCT_Template");
