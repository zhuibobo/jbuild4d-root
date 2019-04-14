(function(pluginName){
    CKEditorPluginUtility.Plugins[pluginName]=CKEditorPluginUtility.GetGeneralPluginInstance(pluginName,{});

    CKEDITOR.plugins.add(CKEditorPluginUtility.Plugins[pluginName].Setting.SingleName, {
        init: function(editor) {

            var pluginSetting=CKEditorPluginUtility.Plugins[pluginName].Setting;
            editor.ui.addButton(pluginSetting.SingleName, {
                label: pluginSetting.ToolbarLabel,
                icon: this.path + pluginSetting.ToolbarIcon,
                command: pluginSetting.ToolbarCommand,
                toolbar: pluginSetting.ToolbarLocation
            });

            var allowedContent = 'dl dd dt (ckeditor-tabber)';

            editor.addCommand(pluginSetting.ToolbarCommand, {
                allowedContent: allowedContent,

                exec: function (editor) {
                    //alert(1);
                    var dl = new CKEDITOR.dom.element.createFromHtml(
                        '<dl class="wysiwyg-wldct-group-by">' +
                            '<dt class="label">简单查询[请在以下的单元格中编辑简单查询]</dt>' +
                            '<dd class="content"></dd>' +
                            '<dt class="label">操作按钮[请在以下的单元格中编辑操作按钮]</dt>' +
                            '<dd class="content operation-button-wrap"></dd>' +
                            '<dt class="label">列表内容[请在以下的单元格中编辑列表内容]</dt>' +
                            '<dd class="content"></dd>' +
                            '<dt class="label">高级查询[请在以下的单元格中编辑高级查询]</dt>' +
                            '<dd class="content"></dd>' +
                        '</dl>');
                    editor.insertElement(dl);
                }
            });
        }
    });
})("WLDCT_GroupBy");
