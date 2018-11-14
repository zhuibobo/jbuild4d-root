var FormDesignUtility={
    PropCKEditorInst:null,
    $PropSelectElem:null,
    InitializeCKEditor:function(loadComplatedFunc) {
        //加载默认配置文件
        var editorConfigUrl = StringUtility.GetTimeStampUrl('../../HTMLDesign/FormDesign/CKEditorConfig.js');

        //把扩展组件加入工具条
        CKEDITOR.replace('html_design', {
            customConfig: editorConfigUrl,
            extraPlugins: ""
        });

        //注册在编辑器中粘贴的处理事件
        CKEDITOR.instances.html_design.on("paste", function (event) {
            //event.data.dataValue="1";
            //尝试重新设置粘贴内容的id值
            try {
                //LogUtil.WriteLog(event.data.dataValue);
                var copytext = event.data.dataValue;

                var $Content = $(copytext);
                $Content.attr("id", "ct_copy_"+StringLib.RTimestamp());
                $Content.find("input").each(function () {
                    $(this).attr("id", "ct_copy_"+StringLib.RTimestamp());
                });
                var newhtml = $Content.outerHTML();
                if (typeof(newhtml) == "string") { //修复bug，在拷贝的是文本时，newhtml会被转换为jquery对象
                    event.data.dataValue = newhtml;
                }
            }
            catch (e) {
                //如果设置失败,则输出操作消息
            }
        });

        this.PropCKEditorInst = CKEDITOR.instances.form_design;

        CKEDITOR.on('instanceReady', function (e) {
            //alert(e.editor.name + '加载完毕！')
            if(typeof(loadComplatedFunc)=="function"){
                loadComplatedFunc();
            }
        });
    }
};