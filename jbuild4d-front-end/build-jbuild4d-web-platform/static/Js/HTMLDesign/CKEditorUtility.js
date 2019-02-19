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
    }
    static InitializeCKEditor(textAreaElemId,pluginsConfig,loadCompletedFunc) {
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
            CKEditorPluginUtility.AddPluginsServerConfig(singleName,toolbarLocation,text,clientResolve,serverResolve,clientResolveJs,dialogWidth,dialogHeight,isJBuild4DData)
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

        //加载默认配置文件
        var editorConfigUrl = BaseUtility.AppendTimeStampUrl('../../HTMLDesign/FormDesign/Plugins/CKEditorConfig.js');

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

        //this._CKEditorInst = CKEDITOR.instances.html_design;
        this.SetCKEditorInst(CKEDITOR.instances.html_design);

        CKEDITOR.on('instanceReady', function (e) {
            if(typeof(loadCompletedFunc)=="function"){
                loadCompletedFunc();
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
}

