var JBuild4D={
    FromDesign:{
        Plugins:{

        }
    }
}

var FormDesignUtility={
    PropCKEditorInst:null,
    $PropSelectElem:null,
    InitializeCKEditor:function(textAreaElemId,loadComplatedFunc) {
        //注册扩展组件：div容器组件
        CKEDITOR.plugins.addExternal('FormDesign_DEF_Container_Div', '../../HTMLDesign/FormDesign/Plugins/FD_Div_Wraper/',
            "FD_Div_WraperPlugin.js");

        //加载默认配置文件
        var editorConfigUrl = StringUtility.GetTimeStampUrl('../../HTMLDesign/FormDesign/CKEditorConfig.js');

        //把扩展组件加入工具条
        CKEDITOR.replace(textAreaElemId, {
            customConfig: editorConfigUrl,
            extraPlugins: "FormDesign_DEF_Container_Div"
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
    },
    InitializeCodeDesign:function () {
        var mixedMode = {
            name: "htmlmixed",
            scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                mode: null},
                {matches: /(text|application)\/(x-)?vb(a|script)/i,
                    mode: "vbscript"}]
        };
        var editor = CodeMirror.fromTextArea(document.getElementById("TextAreaHTMLEditor"), {
            mode: mixedMode,
            selectionPointer: true,
            theme: "monokai"
        });
        $(".CodeMirror").height(PageStyleUtility.GetWindowHeight()-60);

        CodeMirror.fromTextArea($("#TextAreaJsEidtor")[0], {
            mode: "javascript",
            lineNumbers: true,
            lineWrapping: true,
            extraKeys: {
                "Ctrl-Q": function (cm) {
                    cm.foldCode(cm.getCursor());
                }
            },
            foldGutter: true,
            theme: "monokai",
            gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
    }
};