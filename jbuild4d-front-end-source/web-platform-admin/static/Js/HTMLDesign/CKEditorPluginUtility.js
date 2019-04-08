class CKEditorPluginUtility {

    static PluginsServerConfig={
        //来自服务端的插件的相关的配置,在初始的时候写入
    };

    static AddPluginsServerConfig(singleName,toolbarLocation,text,clientResolve,serverResolve,clientResolveJs,dialogWidth,dialogHeight,isJBuild4DData,controlCategory){
        this.PluginsServerConfig[singleName]={
            SingleName:singleName,
            ToolbarLocation:toolbarLocation,
            ToolbarLabel:text,
            ClientResolve:clientResolve,
            ServerResolve:serverResolve,
            ClientResolveJs:clientResolveJs,
            DialogWidth:dialogWidth,
            DialogHeight:dialogHeight,
            IsJBuild4DData:isJBuild4DData,
            ControlCategory:controlCategory
        }
    };

    static Plugins={
        //用于存储插件的最终的属性的定义
    };

    static _UseServerConfigCoverEmptyPluginProp(obj) {
        var coverObj = this.PluginsServerConfig[obj.SingleName];
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
    }

    static GetGeneralPluginInstance(pluginSingleName, exConfig) {
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
            IsJBuild4DData: "",
            //控件类别:输入控件或者为容器控件
            ControlCategory:""
        };
        //使用方法参数覆盖默认值
        defaultSetting = $.extend(true, {}, defaultSetting, exConfig);
        //使用服务端定义覆盖定义的空值;
        defaultSetting = CKEditorPluginUtility._UseServerConfigCoverEmptyPluginProp(defaultSetting);
        defaultSetting.DialogName = defaultSetting.SingleName;
        defaultSetting.ToolbarCommand = "JBuild4D.FormDesign.Plugins." + defaultSetting.SingleName;
        defaultSetting.DialogSettingTitle = defaultSetting.ToolbarLabel + "Web控件";
        //debugger;
        return {
            Setting: defaultSetting
        };
    }

    static RegGeneralPluginToEditor(ckEditor, path, pluginSetting, okFunc) {
        CKEDITOR.dialog.addIframe(
            pluginSetting.DialogName,
            pluginSetting.DialogSettingTitle,
            path + pluginSetting.DialogPageUrl, pluginSetting.DialogWidth, pluginSetting.DialogHeight,
            function () {
                var iframe = document.getElementById(this._.frameId);
                pluginSetting.IFrameWindow = iframe;
                CKEditorPluginUtility.SetElemPropsInEditDialog(pluginSetting.IFrameWindow, pluginSetting.IFrameExecuteActionName);
            },
            {
                //对话框确认按钮触发的事件
                onOk: function () {
                    //debugger;
                    var props = pluginSetting.IFrameWindow.contentWindow.DialogApp.getControlProps();
                    if (props.success == false) {
                        return false;
                    }

                    okFunc(ckEditor, pluginSetting, props, pluginSetting.IFrameWindow.contentWindow);
                    pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteInsertActionName;
                },
                //取消按钮对话框
                onCancel: function () {
                    pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteInsertActionName;
                }
            }
        );

        ckEditor.addCommand(pluginSetting.ToolbarCommand, new CKEDITOR.dialogCommand(pluginSetting.DialogName));

        ckEditor.ui.addButton(pluginSetting.SingleName, {
            label: pluginSetting.ToolbarLabel,
            icon: path + pluginSetting.ToolbarIcon,
            command: pluginSetting.ToolbarCommand,
            toolbar: pluginSetting.ToolbarLocation
        });

        ckEditor.on('doubleclick', function (event) {
            //debugger;
            //alert("1");
            pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteEditActionName;
            CKEditorPluginUtility.OnCKWysiwygElemDBClickEvent(event, pluginSetting)
        });

        //ckEditor.on('focus', function (event) {
            //debugger;
            //var element=event.data.element;
            //pluginSetting.IFrameExecuteActionName = CKEditorPluginUtility.DialogExecuteEditActionName;
            //CKEditorPluginUtility.OnCKWysiwygElemDBClickEvent(event, pluginSetting)
        //});
    }

    static DefaultProps={
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
    }
    static OnCKWysiwygElemDBClickEvent(event,controlSetting){
        //debugger;
        var element = event.data.element;
        if(element.getAttribute("auto_remove")=="true"){
            element=event.data.element.getParent();
        }
        var singleName=element.getAttribute("singleName");
        if(singleName==controlSetting.SingleName) {
            CKEditorUtility.SetSelectedElem(element.getOuterHtml());
            event.data.dialog =controlSetting.DialogName;
        }
    }

    static SerializePropsToElem(elem,props,controlSetting){
        elem.setAttribute("jbuild4d_custom", "true");
        elem.setAttribute("singlename",controlSetting.SingleName);
        elem.setAttribute("clientresolve",controlSetting.ClientResolve);
        elem.setAttribute("serverresolve",controlSetting.ServerResolve);
        elem.setAttribute("is_jbuild4d_data",controlSetting.IsJBuild4DData);
        elem.setAttribute("control_category",controlSetting.ControlCategory);

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
    }
    static DeserializePropsFromElem(elem){
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
    }
    static BuildGeneralElemToCKWysiwyg (html,controlSetting,controlProps,_iframe) {
        //debugger;
        if(this.ValidateBuildEnable(html,controlSetting,controlProps,_iframe)) {
            if (controlSetting.IFrameExecuteActionName == CKEditorPluginUtility.DialogExecuteInsertActionName) {
                var elem = CKEDITOR.dom.element.createFromHtml(html);
                /*elem.on('click', function() {
                    //alert( this == elem );        // true
                    CKEditorUtility.GetCKEditorInst().getSelection().selectElement(this);
                });*/
                this.SerializePropsToElem(elem,controlProps,controlSetting);
                //debugger;
                //var elem = CKEDITOR.dom.element.createFromHtml("<input />");
                //debugger;
                //var sel=CKEditorUtility.GetCKEditorInst().getSelection();
                //alert(elem.$.outerHTML);
                CKEditorUtility.GetCKEditorInst().insertElement(elem);
                CKEditorUtility.SingleElemBindDefaultEvent(elem);
                //选中之后会造成控件只能插入一次，意义不明?
                //CKEditorUtility.GetCKEditorInst().getSelection().selectElement(elem);
                //CKEDITOR.editor.insertElement(elem);
            }
            else {
                //debugger
                var selectedElem=CKEditorUtility.GetSelectedCKEditorElem();
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
    }

    static ValidateBuildEnable(html,controlSetting,controlProps,_iframe){
        return true;
    }
    static ValidateSerializeControlDialogCompletedEnable (returnResult) {
        //debugger;
        if (returnResult.baseInfo.serialize == "true" && returnResult.bindToField.fieldName == "") {
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "序列化的控件必须绑定字段!", null);
            return {success: false};
        }
        return returnResult;
    }

    static DialogExecuteEditActionName="Edit";
    static DialogExecuteInsertActionName="Insert";
    static SetElemPropsInEditDialog(iframeObj,actionName){
        iframeObj.contentWindow.DialogApp.ready(actionName);
        if(actionName==this.DialogExecuteEditActionName) {
            var elem=CKEditorUtility.GetSelectedElem().outerHTML();
            var props=this.DeserializePropsFromElem(elem);
            iframeObj.contentWindow.DialogApp.setControlProps(elem,props);
        }
    }

    static GetControlDescText(pluginSetting,props){
        console.log(pluginSetting);
        console.log(props);
        return "["+pluginSetting.ToolbarLabel+"] 绑定:["+props.bindToField.tableCaption+"-"+props.bindToField.fieldCaption+"]"
    }
}