var JBuild4D={
    FormDesign:{
        Dialog:{
            DialogExecuteEditActionName:"Edit",
            DialogExecuteInsertActionName:"Insert",
            SetDialogProp:function (iframeObj,actionName) {
                iframeObj.contentWindow.PageFunc.Load(actionName);
                if(actionName==this.DialogExecuteEditActionName) {
                    //iframeObj.contentWindow.DialogApp.SetProps(DesignUtil.GetSelectedElem().outerHTML());
                }
            },
            ShowIframeDialogInDesignPage:function (url) {
                var dialogObj=DialogUtility.OpenIframeWindow(window,"11",url,{modal:true},2);
                $(".ui-widget-overlay").css("zIndex",10100);
                $(".ui-dialog").css("zIndex",10101);
            }
        },
        /*InnerDialog:{
            SelectBindTableFieldTo:function () {
                alert("1");
            },
            SelectValidateTo:function () {

            }
        },*/
        //IFrameExecuteInsertActionName:"Insert",
        //DialogExecuteEditActionName:"Edit",
        PropCKEditorInst:null,
        $PropSelectElem:null,
        CoverEmptyPluginProp:function(obj){
            var coverObj=JBuild4D.FormDesign.PluginsDefConfig[obj.Name];
            for(var prop in obj){
                if(typeof(obj[prop])!="function"){
                    if(obj[prop]==""||obj[prop]==null){
                        if(coverObj[prop]){
                            obj[prop]=coverObj[prop];
                        }
                    }
                }
            }
        },
        InitControlSetting:function(setting){
            //使用默认值覆盖定义的空值
            JBuild4D.FormDesign.CoverEmptyPluginProp(setting);
            setting.DialogName=setting.Name;
            setting.ToolbarCommand="JBuild4D.FormDesign.Plugins."+setting.Name;
            setting.DialogSettingTitle=setting.ToolbarLabel+"Web控件";
        },
        ImportCssToWysiwyg:function(sender,controlSetting,editor){
            if(controlSetting.DesignModalInputCss!=undefined&&controlSetting.DesignModalInputCss!=null&&controlSetting.DesignModalInputCss!="") {
                var cssPath = sender.path + controlSetting.DesignModalInputCss;
                editor.on('mode', function () {
                    if (editor.mode == 'wysiwyg') {
                        this.document.appendStyleSheet(cssPath);
                    }
                });
            }
        },
        Plugins:{

        },
        PluginsDefConfig:{

        },
        InitializeCKEditor:function(textAreaElemId,pluginsConfig,loadCompletedFunc) {
            //注册扩展组件
            /*CKEDITOR.plugins.addExternal('FDCT_Div_Wraper', '../../HTMLDesign/FormDesign/Plugins//FDCT_Div_Wraper/',
                "FDCT_Div_WraperPlugin.js");*/
            //debugger;
            var extraPlugins=new Array();
            for(var i=0;i<pluginsConfig.length;i++) {
                var singlePluginConfig = pluginsConfig[i];
                var singleName = singlePluginConfig.singleName;
                var toolbarLocation=singlePluginConfig.toolbarLocation;
                var text=singlePluginConfig.text;
                var serverResolve=singlePluginConfig.serverResolve;
                var clientResolve=singlePluginConfig.clientResolve;
                var clientResolveJs=singlePluginConfig.clientResolveJs;
                var dialogWidth=singlePluginConfig.dialogWidth;
                var dialogHeight=singlePluginConfig.dialogHeight;
                var pluginFileName = singleName + "Plugin.js";
                var pluginFolderName = "../../HTMLDesign/FormDesign/Plugins/" + singleName + "/";
                //注册扩展组件
                CKEDITOR.plugins.addExternal(singleName, pluginFolderName, pluginFileName);
                extraPlugins.push(singleName);

                //设置默认值
                JBuild4D.FormDesign.PluginsDefConfig[singleName]={
                    Name:singleName,
                    ToolbarLocation:toolbarLocation,
                    ToolbarLabel:text,
                    ClientResolve:clientResolve,
                    ServerResolve:serverResolve,
                    ClientResolveJs:clientResolveJs,
                    DialogWidth:dialogWidth,
                    DialogHeight:dialogHeight
                }
            }

            //加载默认配置文件
            var editorConfigUrl = StringUtility.GetTimeStampUrl('../../HTMLDesign/FormDesign/CKEditorConfig.js');

            //把扩展组件加入工具条
            CKEDITOR.replace(textAreaElemId, {
                customConfig: editorConfigUrl,
                extraPlugins: extraPlugins.join(",")
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
                if(typeof(loadCompletedFunc)=="function"){
                    loadCompletedFunc();
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
    }
}