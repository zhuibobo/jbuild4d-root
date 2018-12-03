var JBuild4D={
    FormDesign:{
        _CKEditorInst:null,
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
            SetSelectedElem:function(elemhtml){
                this._$CKEditorSelectElem=$(elemhtml);
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
                var coverObj = JBuild4D.FormDesign.PluginsDefConfig[obj.SingleName];
                for (var prop in obj) {
                    if (typeof(obj[prop]) != "function") {
                        if (obj[prop] == "" || obj[prop] == null) {
                            if (coverObj[prop]) {
                                obj[prop] = coverObj[prop];
                            }
                        }
                    }
                }
            },
            InitPluginSetting:function(setting){
                //使用默认值覆盖定义的空值
                this._CoverEmptyPluginProp(setting);
                setting.DialogName=setting.SingleName;
                setting.ToolbarCommand="JBuild4D.FormDesign.Plugins."+setting.SingleName;
                setting.DialogSettingTitle=setting.ToolbarLabel+"Web控件";
            }
        },
        PluginsDefConfig:{

        },
        GetCKEditorInst:function(){
            return this._CKEditorInst;
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