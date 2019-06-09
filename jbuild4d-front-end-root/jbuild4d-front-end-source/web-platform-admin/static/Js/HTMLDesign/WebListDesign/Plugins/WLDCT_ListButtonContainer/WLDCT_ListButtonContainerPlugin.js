(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});

    CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
        init: function(editor) {
            //点击确认时候指定的操作
            function addToEditor(ckEditor, pluginSetting, props, contentWindow){
                //var controlDescText=CKEditorPluginUtility.GetControlDescText(pluginSetting,props);
                var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel("操作按钮区域[双击编辑该部件],在下边div中编辑操作按钮");
                CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg("<div class=\"wysiwyg-wldct-list-button-outer-wrap wldct-list-button-outer-wrap\">"+tip+
                    "<div class=\"wysiwyg-wldct-list-button-inner-wrap wldct-list-button-inner-wrap\">" +
                    "    <table is-op-button-wrap-table=\"true\">" +
                    "        <colgroup>" +
                    "            <col style=\"width: 10%\" />" +
                    "            <col style=\"width: 10%\" />" +
                    "            <col style=\"width: 10%\" />" +
                    "            <col style=\"width: 10%\" />" +
                    "            <col style=\"width: 10%\" />" +
                    "            <col style=\"width: 10%\" />" +
                    "            <col style=\"width: 10%\" />" +
                    "            <col style=\"width: 10%\" />" +
                    "        </colgroup>" +
                    "        <tr>" +
                    "            <td></td>" +
                    "            <td></td>" +
                    "            <td></td>" +
                    "            <td></td>" +
                    "            <td></td>" +
                    "            <td></td>" +
                    "            <td></td>" +
                    "            <td></td>" +
                    "        </tr>" +
                    "    </table>" +
                    "</div>"+
                    "</div>", pluginSetting, props, contentWindow);
            }
            //注册常规插件的操作
            CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting,addToEditor);
        }
    });
})("WLDCT_ListButtonContainer");
