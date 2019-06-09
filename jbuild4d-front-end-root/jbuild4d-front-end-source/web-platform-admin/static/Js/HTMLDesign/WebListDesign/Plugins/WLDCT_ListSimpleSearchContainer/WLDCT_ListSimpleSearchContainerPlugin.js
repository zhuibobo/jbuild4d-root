(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});

    CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
        init: function(editor) {
            //点击确认时候指定的操作
            function addToEditor(ckEditor, pluginSetting, props, contentWindow) {
                //var controlDescText=CKEditorPluginUtility.GetControlDescText(pluginSetting,props);
                var tip = CKEditorPluginUtility.GetAutoRemoveTipLabel("简单查询区域[双击编辑该部件],在下边div中编辑查询内容");
                CKEditorPluginUtility.BuildGeneralElemToCKWysiwyg("<div class=\"wysiwyg-wldct-list-simple-search-outer-wrap wldct-list-simple-search-outer-wrap\">" + tip +
                    "   <div class=\"wysiwyg-wldct-list-simple-search-inner-wrap wldct-list-simple-search-inner-wrap\">" +
                    "       <table>" +
                    "           <colgroup>" +
                    "               <col style=\"width: 8%\" />" +
                    "               <col style=\"width: 17%\" />" +
                    "               <col style=\"width: 8%\" />" +
                    "               <col style=\"width: 17%\" />" +
                    "               <col style=\"width: 8%\" />" +
                    "               <col style=\"width: 17%\" />" +
                    "               <col style=\"width: 8%\" />" +
                    "               <col style=\"width: 17%\" />" +
                    "           </colgroup>" +
                    "           <tr>" +
                    "               <td class=\"label\">名称:</td>" +
                    "               <td></td>" +
                    "               <td class=\"label\">标题:</td>" +
                    "               <td></td>" +
                    "               <td class=\"label\">时间(从):</td>" +
                    "               <td></td>" +
                    "               <td class=\"label\">(到):</td>" +
                    "               <td></td>" +
                    "           </tr>" +
                    "       </table>" +
                    "   </div>" +
                    "</div>", pluginSetting, props, contentWindow);
            }
            //注册常规插件的操作
            CKEditorPluginUtility.RegGeneralPluginToEditor(editor, this.path, CKEditorPluginUtility.Plugins[pluginName].Setting,addToEditor);
        }
    });
})("WLDCT_ListSimpleSearchContainer");
