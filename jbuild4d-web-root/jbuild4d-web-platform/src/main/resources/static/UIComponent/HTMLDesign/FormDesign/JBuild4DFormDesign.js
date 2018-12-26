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
            _$CKEditorSelectElem:null,
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
                    this.SetSelectedElem(element.getOuterHtml());
                    event.data.dialog =controlSetting.DialogName;
                }
            },
            SetSelectedElem:function(elemHtml){
                this._$CKEditorSelectElem=$(elemHtml);
            },
            GetSelectedElem:function(){
                if(this._$CKEditorSelectElem.length>0) {
                    return this._$CKEditorSelectElem;
                }
                return null;
            },
            GetSelectedCKEditorElem:function(){
                var id=this.GetSelectedElem().attr("id");
                var element =JBuild4D.FormDesign.GetCKEditorInst().document.getById(id);
                return element;
            },
            SerializePropsToElem:function(elem,props,controlSetting){
                elem.setAttribute("jbuild4d_custom", "true");
                elem.setAttribute("singlename",controlSetting.SingleName);
                elem.setAttribute("clientresolve",controlSetting.ClientResolve);
                elem.setAttribute("serverresolve",controlSetting.ServerResolve);
                elem.setAttribute("is_jbuild4d_data",controlSetting.IsJBuild4DData);

                if(props["baseInfo"]){
                    for (var key in props["baseInfo"]) {
                        if(key=="readonly"){
                            if(props["baseInfo"][key]=="readonly"){
                                elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
                            }
                            else{
                                elem.removeAttribute("readonly");
                            }
                        }
                        else if(key=="disabled"){
                            if(props["baseInfo"][key]=="disabled"){
                                elem.setAttribute(key.toLocaleLowerCase(), props["baseInfo"][key]);
                            }
                            else{
                                elem.removeAttribute("disabled");
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
                        else{
                            groupProp[key]=this.DefaultProps[groupName][key];
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
                        JBuild4D.FormDesign.GetCKEditorInst().insertElement(elem);
                        JBuild4D.FormDesign.GetCKEditorInst().getSelection().selectElement(elem);
                    }
                    else {
                        //debugger
                        var selectedElem=this.GetSelectedCKEditorElem();
                        if(selectedElem) {
                            var reFreshElem = new CKEDITOR.dom.element.createFromHtml(selectedElem.getOuterHtml());
                            selectedElem.copyAttributes(reFreshElem, {temp: "temp"});
                            this.SerializePropsToElem(reFreshElem,controlProps,controlSetting);
                            reFreshElem.replace(selectedElem);
                        }
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
            _CoverEmptyPluginProp: function(obj) {
                var coverObj = JBuild4D.FormDesign.PluginsServerConfig[obj.SingleName];
                //debugger;
                for (var prop in obj) {
                    if (typeof(obj[prop]) != "function") {
                        if (obj[prop] == "" || obj[prop] == null) {
                            if (coverObj[prop]) {
                                obj[prop] = coverObj[prop];
                            }
                        }
                    }
                }
                return obj;
            },
            InitPluginSetting:function(setting){
                //待移除
            },
            CreateGeneralPlugin:function (pluginSingleName,exConfig) {
                //设置为""时才会使用服务端的配置进行覆盖
                var defaultSetting = {
                    //插件名称
                    SingleName: pluginSingleName,
                    //设置对话框相关设置
                    DialogName: '',
                    DialogWidth: null,
                    DialogHeight: null,
                    DialogPageUrl: BaseUtility.AppendTimeStampUrl('Dialog.html'),
                    DialogTitle: "DIV",
                    //设计器工具栏相关设置
                    ToolbarCommand: '',
                    //工具栏触发命令的名称,需要保持唯一
                    ToolbarIcon: 'Icon.png',
                    ToolbarLabel: "",
                    ToolbarLocation: '',
                    //设计控件相关的对话框
                    IFrameWindow: null,
                    //设计控件对话框将执行的工作
                    IFrameExecuteActionName: "Insert",
                    //需要引入到设计器的样式文件
                    DesignModalInputCss: "",
                    //客户端与服务端解析类
                    ClientResolve: "",
                    ServerResolve: "",
                    //是否是数据控件
                    IsJBuild4DData:""
                };
                //使用方法参数覆盖默认值
                defaultSetting = $.extend(true, {}, defaultSetting, exConfig);
                //使用服务端定义覆盖定义的空值;
                defaultSetting = this._CoverEmptyPluginProp(defaultSetting);
                defaultSetting.DialogName = defaultSetting.SingleName;
                defaultSetting.ToolbarCommand = "JBuild4D.FormDesign.Plugins." + defaultSetting.SingleName;
                defaultSetting.DialogSettingTitle = defaultSetting.ToolbarLabel + "Web控件";
                //debugger;
                return {
                    Setting: defaultSetting
                };
            },
            RegGeneralPluginToEditor:function (ckEditor,path,pluginSetting, okFunc) {
                CKEDITOR.dialog.addIframe(
                    pluginSetting.DialogName,
                    pluginSetting.DialogSettingTitle,
                    path + pluginSetting.DialogPageUrl, pluginSetting.DialogWidth, pluginSetting.DialogHeight,
                    function () {
                        var iframe = document.getElementById(this._.frameId);
                        pluginSetting.IFrameWindow = iframe;
                        JBuild4D.FormDesign.Dialog.SetElemPropsInEditDialog(pluginSetting.IFrameWindow, pluginSetting.IFrameExecuteActionName);
                    },
                    {
                        //对话框确认按钮触发的事件
                        onOk: function () {
                            var props=pluginSetting.IFrameWindow.contentWindow.DialogApp.getControlProps();
                            if(props.success==false) {
                                return false;
                            }
                            //JBuild4D.FormDesign.Control.BuildGeneralElemToCKWysiwyg("<input type='text' />",ControlSetting,props,ControlSetting.IFrameWindow.contentWindow);
                            okFunc(ckEditor,pluginSetting,props,pluginSetting.IFrameWindow.contentWindow);
                            pluginSetting.IFrameExecuteActionName=JBuild4D.FormDesign.Dialog.DialogExecuteInsertActionName;
                        },
                        //取消按钮对话框
                        onCancel:function(){
                            pluginSetting.IFrameExecuteActionName=JBuild4D.FormDesign.Dialog.DialogExecuteInsertActionName;
                        }
                    }
                );

                ckEditor.addCommand(pluginSetting.ToolbarCommand,new CKEDITOR.dialogCommand(pluginSetting.DialogName));

                ckEditor.ui.addButton(pluginSetting.SingleName, {
                    label: pluginSetting.ToolbarLabel,
                    icon: path + pluginSetting.ToolbarIcon,
                    command: pluginSetting.ToolbarCommand,
                    toolbar: pluginSetting.ToolbarLocation
                });

                ckEditor.on('doubleclick', function(event) {
                    pluginSetting.IFrameExecuteActionName = JBuild4D.FormDesign.Dialog.DialogExecuteEditActionName;
                    JBuild4D.FormDesign.Control.OnCKWysiwygElemDBClickEvent(event, pluginSetting)
                });
            }
        },
        PluginsServerConfig:{

        },

        //CKEditor
        _CKEditorInst:null,
        GetCKEditorInst:function(){
            return this._CKEditorInst;
        },
        GetCKEditorHTML:function(){
            return this._CKEditorInst.getData();
        },
        SetCKEditorHTML:function(html){
            this._CKEditorInst.setData(html);
        },
        InitializeCKEditor:function(textAreaElemId,pluginsConfig,loadCompletedFunc) {
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
                var isJBuild4DData=singlePluginConfig.isJBuild4DData;
                //debugger;
                var pluginFileName = singleName + "Plugin.js";
                var pluginFolderName = "../../HTMLDesign/FormDesign/Plugins/" + singleName + "/";
                //注册扩展组件
                CKEDITOR.plugins.addExternal(singleName, pluginFolderName, pluginFileName);
                extraPlugins.push(singleName);

                //设置默认值
                JBuild4D.FormDesign.PluginsServerConfig[singleName]={
                    SingleName:singleName,
                    ToolbarLocation:toolbarLocation,
                    ToolbarLabel:text,
                    ClientResolve:clientResolve,
                    ServerResolve:serverResolve,
                    ClientResolveJs:clientResolveJs,
                    DialogWidth:dialogWidth,
                    DialogHeight:dialogHeight,
                    IsJBuild4DData:isJBuild4DData
                }
            }

            //加载默认配置文件
            var editorConfigUrl = BaseUtility.AppendTimeStampUrl('../../HTMLDesign/FormDesign/CKEditorConfig.js');

            //把扩展组件加入工具条
            CKEDITOR.replace(textAreaElemId, {
                customConfig: editorConfigUrl,
                extraPlugins: extraPlugins.join(",")
            });

            //注册在编辑器中粘贴的处理事件
            CKEDITOR.instances.html_design.on("paste", function (event) {
                try {
                    alert("暂时不支持!");
                    var copyData = event.data.dataValue;

                    var $copyData = $(copyData);
                    $copyData.attr("id", "ct_copy_"+StringUtility.Timestamp());
                    $copyData.find("input").each(function () {
                        $(this).attr("id", "ct_copy_"+StringUtility.Timestamp());
                    });
                    var newHtml = $copyData.outerHTML();
                    if (typeof(newHtml) == "string") { //修复bug，在拷贝的是文本时，newhtml会被转换为jquery对象
                        event.data.dataValue = newHtml;
                    }
                }
                catch (e) {
                    alert("粘贴操作失败!")
                }
            });

            this._CKEditorInst = CKEDITOR.instances.html_design;

            CKEDITOR.on('instanceReady', function (e) {
                if(typeof(loadCompletedFunc)=="function"){
                    loadCompletedFunc();
                }
            });
        },
        //HTML
        _HTMLEditorInst:null,
        GetHTMLEditorInst:function(){
            return this._HTMLEditorInst;
        },
        SetHTMLEditorHTML:function(html){
            //debugger;
            if(!StringUtility.IsNullOrEmpty(html)) {
                this.GetHTMLEditorInst().setValue(html);
                //this.GetHTMLEditorInst().commands["selectAll"](myCodeMirror);
                CodeMirror.commands["selectAll"](this.GetHTMLEditorInst());
                var range = { from: this.GetHTMLEditorInst().getCursor(true), to: this.GetHTMLEditorInst().getCursor(false) };;
                this.GetHTMLEditorInst().autoFormatRange(range.from, range.to);
            }
        },
        GetHtmlEditorHTML:function(){
            return this.GetHTMLEditorInst().getValue();
        },
        InitializeHTMLCodeDesign:function () {
            var mixedMode = {
                name: "htmlmixed",
                scriptTypes: [{matches: /\/x-handlebars-template|\/x-mustache/i,
                    mode: null},
                    {matches: /(text|application)\/(x-)?vb(a|script)/i,
                        mode: "vbscript"}]
            };
            this._HTMLEditorInst = CodeMirror.fromTextArea(document.getElementById("TextAreaHTMLEditor"), {
                mode: mixedMode,
                selectionPointer: true,
                theme: "monokai",
                foldGutter: true,
                gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
                lineNumbers: true,
                lineWrapping: true
            });
            this._HTMLEditorInst.setSize("100%",PageStyleUtility.GetWindowHeight()-60);
            //$(".CodeMirror").height(PageStyleUtility.GetWindowHeight()-60);

            /*this._HTMLEditorInst=CodeMirror.fromTextArea($("#TextAreaJsEidtor")[0], {
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
            });*/
        }
        //Js
    }
}