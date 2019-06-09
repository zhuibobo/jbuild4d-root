/*
**Created by IntelliJ IDEA.
**User: zhuangrb
**Date: 2019/4/23
**To change this template use File | Settings | File Templates.
*/
(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});

    CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
        init: function(editor) {
            //点击确认时候指定的操作
            function addToEditor(ckEditor, pluginSetting, props, contentWindow){
                console.log(props);
                var controlDescText=props.normalProps.columnCaption+"[默认值:"+props.defaultValue.defaultText+"]";
                CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg("<div class='wysiwyg-input-text'>"+controlDescText+"</div>", pluginSetting, props, contentWindow);
            }
            //注册常规插件的操作
            CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting,addToEditor);
        }
    });
})("WLDCT_ListTableLabel");