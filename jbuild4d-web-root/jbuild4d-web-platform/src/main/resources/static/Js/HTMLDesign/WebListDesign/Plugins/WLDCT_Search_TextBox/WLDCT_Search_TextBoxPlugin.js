/**
 * Created by zhuangrb on 2018/11/23.
 */

(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});

    CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
        init: function(editor) {
            //点击确认时候指定的操作
            function addToEditor(ckEditor, pluginSetting, props, contentWindow){
                var controlDescText=CKEditorPluginUtility.GetSearchControlDescText(pluginSetting,props);
                CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg("<div class='wysiwyg-input-text'>"+controlDescText+"</div>", pluginSetting, props, contentWindow);
            }
            //注册常规插件的操作
            CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting,addToEditor);
        }
    });
})("WLDCT_Search_TextBox");

