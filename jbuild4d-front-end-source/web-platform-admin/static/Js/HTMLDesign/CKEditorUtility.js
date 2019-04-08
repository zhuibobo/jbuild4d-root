class CKEditorUtility {
    static _$CKEditorSelectElem=null;
    static SetSelectedElem(elemHtml){
        this._$CKEditorSelectElem=$(elemHtml);
    }
    static GetSelectedElem(){
        if(this._$CKEditorSelectElem.length>0) {
            return this._$CKEditorSelectElem;
        }
        return null;
    }
    static GetSelectedCKEditorElem(){
        if(this.GetSelectedElem()) {
            var id = this.GetSelectedElem().attr("id");
            var element = this.GetCKEditorInst().document.getById(id);
            return element;
        }
        return null;
    }

    static _CKEditorInst=null;
    static GetCKEditorInst() {
        return this._CKEditorInst;
    }
    static SetCKEditorInst(inst){
        this._CKEditorInst=inst;
    }

    static GetCKEditorHTML(){
        return this.GetCKEditorInst().getData();
    }
    static SetCKEditorHTML(html){
        this.GetCKEditorInst().setData(html);
        window.setTimeout(function () {
            CKEditorUtility.ALLElemBindDefaultEvent();
        },1000);
    }
    static InitializeCKEditor(textAreaElemId,pluginsConfig,loadCompletedFunc,ckeditorConfigFullPath,pluginBasePath,themeVo) {

        console.log(pluginsConfig);

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
            var controlCategory=singlePluginConfig.controlCategory;
            //debugger;
            var pluginFileName = singleName + "Plugin.js";
            var pluginFolderName = pluginBasePath + singleName + "/";
            //注册扩展组件
            CKEDITOR.plugins.addExternal(singleName, pluginFolderName, pluginFileName);
            extraPlugins.push(singleName);

            //设置默认值
            CKEditorPluginUtility.AddPluginsServerConfig(singleName,toolbarLocation,text,clientResolve,serverResolve,clientResolveJs,dialogWidth,dialogHeight,isJBuild4DData,controlCategory)
            /*CKEditorPluginUtility.PluginsServerConfig[singleName]={
                SingleName:singleName,
                ToolbarLocation:toolbarLocation,
                ToolbarLabel:text,
                ClientResolve:clientResolve,
                ServerResolve:serverResolve,
                ClientResolveJs:clientResolveJs,
                DialogWidth:dialogWidth,
                DialogHeight:dialogHeight,
                IsJBuild4DData:isJBuild4DData
            }*/
        }

        //console.log(themeVo);
        this.SetThemeVo(themeVo);

        //加载默认配置文件
        var editorConfigUrl = BaseUtility.AppendTimeStampUrl(ckeditorConfigFullPath);

        //把扩展组件加入工具条
        CKEDITOR.replace(textAreaElemId, {
            customConfig: editorConfigUrl,
            extraPlugins: extraPlugins.join(",")
        });

        //注册在编辑器中粘贴的处理事件
        CKEDITOR.instances.html_design.on("paste", function (event) {
            var sourceHTML = event.data.dataValue;
            try {
                /*alert("暂时不支持!");
                var copyData = event.data.dataValue;

                var $copyData = $(copyData);
                $copyData.attr("id", "ct_copy_"+StringUtility.Timestamp());
                $copyData.find("input").each(function () {
                    $(this).attr("id", "ct_copy_"+StringUtility.Timestamp());
                });
                var newHtml = $copyData.outerHTML();
                if (typeof(newHtml) == "string") { //修复bug，在拷贝的是文本时，newhtml会被转换为jquery对象
                    event.data.dataValue = newHtml;
                }*/
                //alert(event.data.dataValue);

                var $sourceHTML = $(sourceHTML);
                //如果其中包含一个用于显示控件呈现的div,取其进行替换
                if($(sourceHTML).find("div").length==1){
                    event.data.dataValue = $(sourceHTML).find("div").outerHTML();
                }
            }
            catch (e) {
                //还原html
                event.data.dataValue = sourceHTML;
            }
        });

        CKEDITOR.instances.html_design.on("afterPaste", function (event) {
            try {
                CKEditorUtility.ALLElemBindDefaultEvent();
            }
            catch (e) {
                alert("粘贴操作失败!")
            }
        });

        CKEDITOR.instances.html_design.on('insertElement', function (event) {
            console.log("insertElement");
            console.log(event);
        });

        CKEDITOR.instances.html_design.on('insertHtml', function (event) {
            console.log("insertHtml");
            console.log(event);
        });

        //this._CKEditorInst = CKEDITOR.instances.html_design;
        this.SetCKEditorInst(CKEDITOR.instances.html_design);

        CKEDITOR.on('instanceReady', function (e) {
            if(typeof(loadCompletedFunc)=="function"){
                loadCompletedFunc();

                //console.log(CKEDITOR.instances.html_design.document);
                //debugger;
                //console.log(CKEDITOR.instances.html_design.document.$.head);

                /*var link=document.createElement('link');
                link.href='../../../static/Themes/Default/Css/FormDesignWysiwyg.css';
                link.rel='rel';

                CKEDITOR.instances.html_design.document.$.head.appendChild(link);
                var link1=document.createElement('link');
                link1.href='../../../static/Themes/Default/Css/Jbuild4dPlatform.css';
                link1.rel='rel';

                CKEDITOR.instances.html_design.document.$.head.appendChild(link1)*/;

                //alert("1");
                //CKEDITOR.instances.html_design.config.contentsCss = ['../../../Themes/Default/Css/FormDesignWysiwyg1.css','../../../Themes/Default/Css/Jbuild4dPlatform2.css'];
                /*JBuild4D.FormDesign.SetCKEditorHTML("<div class=\"table-width-wraper-1024\" clientresolve=\"2\" is_jbuild4d_data=\"false\" jbuild4d_custom=\"true\" serialize=\"false\" serverresolve=\"1\" singlename=\"FDCT_Template\">" +
                    "<table border=\"0\" cellpadding=\"0\" cellspacing=\"0\" class=\"wathet-blue-table\">" +
                    "<colgroup>" +
                    "<col style=\"width: 10%;\" />" +
                    "<col style=\"width: 23%;\" />" +
                    "<col style=\"width: 10%;\" />" +
                    "<col style=\"width: 23%;\" />" +
                    "<col style=\"width: 10%;\" />" +
                    "<col style=\"width: 24%;\" />" +
                    "</colgroup>" +
                    "<tbody>" +
                    "<tr>" +
                    "<td colspan=\"6\" height=\"60\">" +
                    "<h3 class=\"title\">请输入表单名称</h3>" +
                    "</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "</tr>" +
                    "<tr>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "<td class=\"label\">&nbsp;</td>" +
                    "<td>&nbsp;</td>" +
                    "</tr>" +
                    "</tbody>" +
                    "</table>" +
                    "</div>");*/
            }
        });


    }

    static _ThemeVo=null;
    static GetThemeVo() {
        return this._ThemeVo;
    }
    static SetThemeVo(_themeVo){
        this._ThemeVo=_themeVo;
    }

    static ALLElemBindDefaultEvent(){
        console.log(CKEditorUtility.GetCKEditorInst());
        var elements = CKEditorUtility.GetCKEditorInst().document.getBody().getElementsByTag( '*' );
        for ( var i = 0; i < elements.count(); ++i ) {
            if(elements.getItem(i).getAttribute("singlename")=="WFDCT_TextBox") {
                console.log(elements.getItem(i).getName());
                var elem = elements.getItem(i);
                elem.on('click', function () {
                    //alert( this == elem );        // true
                    CKEditorUtility.GetCKEditorInst().getSelection().selectElement(this);
                });
            }
        }
    }
}

