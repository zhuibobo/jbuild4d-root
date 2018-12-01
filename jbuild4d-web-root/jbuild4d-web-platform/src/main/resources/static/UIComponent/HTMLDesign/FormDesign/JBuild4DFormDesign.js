var JBuild4D={
    FormDesign:{
        Dialog:{
            DialogExecuteEditActionName:"Edit",
            DialogExecuteInsertActionName:"Insert",
            SetElemPropsInEditDialog:function(iframeObj,actionName){
                iframeObj.contentWindow.DialogApp.ready(actionName);
                if(actionName==this.DialogExecuteEditActionName) {
                    var elem=JBuild4D.FormDesign.Control.GetSelectedElem().outerHTML();
                    var props=JBuild4D.FormDesign.Control.DeserializePropsFromElem(elem);
                    iframeObj.contentWindow.DialogApp.setControlProps(elem,props);
                }
            }
        },
        Control:{
            DefaultProps:{
                bindToField:{
                    tableId: "",
                    tableName: "",
                    tableCaption: "",
                    fieldName: "",
                    fieldCaption: "",
                    fieldDataType: "",
                    fieldLength:""
                },
                defaultValue:{
                    defaultType: "",
                    defaultValue: "",
                    defaultText: ""
                },
                validateRules:{
                    msg:"",
                    rules:[]
                },
                baseInfo:{
                    id:"",
                    serialize:"true",
                    name:"",
                    className:"",
                    placeholder:"",
                    readonly:"noreadonly",
                    disabled:"nodisabled",
                    style:"",
                    desc:""
                }
            },
            OnCKWysiwygElemDBClickEvent:function(event,controlSetting){
                //debugger;
                var element = event.data.element;
                if(element.getAttribute("auto_remove")=="true"){
                    element=event.data.element.getParent();
                }
                var singleName=element.getAttribute("singleName");
                if(singleName==controlSetting.SingleName) {
                    controlSetting.IFrameExecuteActionName = JBuild4D.FormDesign.Dialog.DialogExecuteEditActionName;
                    this.SetSelectedElem(element.getOuterHtml());
                    event.data.dialog =controlSetting.DialogName;
                }
            },
            SetSelectedElem:function(elemhtml){
                this.$CKEditorSelectElem=$(elemhtml);
            },
            GetSelectedElem:function(){
                if(this.$CKEditorSelectElem.length>0) {
                    return this.$CKEditorSelectElem;
                }
            },
            SerializePropsToElem:function(elem,props,controlSetting){
                elem.setAttribute("jbuild4d_custom", "true");
                elem.setAttribute("singlename",controlSetting.SingleName);
                elem.setAttribute("clientresolve",controlSetting.ClientResolve);
                elem.setAttribute("serverresolve",controlSetting.ServerResolve);

                if(props["baseInfo"]){
                    for (var key in props["baseInfo"]) {
                        if(key=="readonly"){
                            if(props["baseInfo"][key]=="readonly"){
                                elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
                            }
                        }
                        else if(key=="disabled"){
                            if(props["baseInfo"][key]=="disabled"){
                                elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
                            }
                        }
                        else{
                            elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
                        }
                    }
                }

                if(props["bindToField"]){
                    for (var key in props["bindToField"]) {
                        elem.setAttribute(key.toLocaleLowerCase(), props["bindToField"][key]);
                    }
                }

                if(props["defaultValue"]){
                    for (var key in props["defaultValue"]) {
                        elem.setAttribute(key.toLocaleLowerCase(), props["defaultValue"][key]);
                    }
                }

                if(props["validateRules"]){
                    if(props["validateRules"].rules) {
                        if (props["validateRules"].rules.length > 0) {
                            elem.setAttribute("validaterules", encodeURIComponent(JsonUtility.JsonToString(props["validateRules"])));
                        }
                    }
                }
                return elem;
            },
            DeserializePropsFromElem:function(elem){
                var props={};
                var $elem=$(elem);

                function attrToProp(props,groupName) {
                    var groupProp={};
                    for(var key in this.DefaultProps[groupName]){
                        if($elem.attr(key)){
                            groupProp[key]=$elem.attr(key);
                        }
                    }
                    props[groupName]=groupProp;
                    return props;
                }

                props=attrToProp.call(this,props,"baseInfo");
                props=attrToProp.call(this,props,"bindToField");
                props=attrToProp.call(this,props,"defaultValue");

                if($elem.attr("validateRules")){
                    props.validateRules=JsonUtility.StringToJson(decodeURIComponent($elem.attr("validateRules")));
                }

                return props;
            },
            BuildGeneralElemToCKWysiwyg:function (html,controlSetting,controlProps,_iframe) {
                if(this.ValidateBuildEnable(html,controlSetting,controlProps,_iframe)) {
                    if (controlSetting.IFrameExecuteActionName == JBuild4D.FormDesign.Dialog.DialogExecuteInsertActionName) {
                        var elem = CKEDITOR.dom.element.createFromHtml(html);
                        this.SerializePropsToElem(elem,controlProps,controlSetting);
                        JBuild4D.FormDesign.CKEditorInst.insertElement(elem);
                        JBuild4D.FormDesign.CKEditorInst.getSelection().selectElement(elem);
                    }
                    else {
                        //SimpleControlUtil.CommInsertOrReplaceElemInCKEditor(exsetting.IFrameWindow,exsetting.IRCommandName,"");
                    }
                    //exsetting.IRCommandName=SimpleControlUtil.PropInsertCommand;
                }
            },
            ValidateBuildEnable:function(html,controlSetting,controlProps,_iframe){
                return true;
            },
            ValidateSerializeControlDialogCompletedEnable:function (returnResult) {
                //debugger;
                if (returnResult.baseInfo.serialize == "true" && returnResult.bindToField.fieldName == "") {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "序列化的控件必须绑定字段!", null);
                    return {success: false};
                }
                return returnResult;
            }
        },
        CKEditorInst:null,
        $CKEditorSelectElem:null,
        CoverEmptyPluginProp:function(obj){
            var coverObj=JBuild4D.FormDesign.PluginsDefConfig[obj.SingleName];
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
            setting.DialogName=setting.SingleName;
            setting.ToolbarCommand="JBuild4D.FormDesign.Plugins."+setting.SingleName;
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
                    SingleName:singleName,
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

            this.CKEditorInst = CKEDITOR.instances.html_design;

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