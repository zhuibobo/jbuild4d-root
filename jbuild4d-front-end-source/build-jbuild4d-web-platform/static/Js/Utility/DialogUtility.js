//对话框工具类
var DialogUtility={
    DialogAlertId:"DefaultDialogAlertUtility01",
    DialogPromptId:"DefaultDialogPromptUtility01",
    DialogId:"DefaultDialogUtility01",
    DialogId02:"DefaultDialogUtility02",
    DialogId03:"DefaultDialogUtility03",
    DialogId04:"DefaultDialogUtility04",
    DialogId05:"DefaultDialogUtility05",
    _GetElem:function(dialogId){
        return $("#"+dialogId);
    },
    _CreateDialogElem:function(docobj,dialogId){
        if(this._GetElem(dialogId).length==0) {
            var dialogEle = $("<div id=" + dialogId + " title='系统提示' style='display:none'>\
                    </div>");
            $(docobj.body).append(dialogEle);
            return dialogEle;
        }
        else {
            return this._GetElem(dialogId);
        }
    },
    _CreateAlertLoadingMsgElement: function (docobj,dialogId) {
        if(this._GetElem(dialogId).length==0) {
            var dialogEle = $("<div id=" + dialogId + " title='系统提示' style='display:none'>\
                               <div class='alertloading-img'></div>\
                               <div class='alertloading-txt'></div>\
                           </div>");
            $(docobj.body).append(dialogEle);
            return dialogEle;
        }
        else {
            return this._GetElem(dialogId);
        }
    },
    _CreateIfrmaeDialogElement: function (docobj, dialogid, url) {
        /*var dialogEle = $("<div id=" + dialogid + " title='Basic dialog'>\
                        <iframe name='dialogIframe' width='100%' height='98%' frameborder='0' src='" + url + "'>\
                        </iframe>\
                    </div>");*/
        //直接设置iframe的src会造成一次请求http的canceled.
        var dialogEle = $("<div id=" + dialogid + " title='Basic dialog'>\
                        <iframe name='dialogIframe' width='100%' height='98%' frameborder='0'>\
                        </iframe>\
                    </div>");
        $(docobj.body).append(dialogEle);
        //alert(url);
        return dialogEle;
    },
    _TestDialogElemIsExist:function(dialogId){
        if(this._GetElem(dialogId).length>0){
            return true;
        }
        return false;
    },
    _TestRunEnable:function(){
        return true;
    },
    AlertError:function (opererWindow,dialogId,config,htmlmsg,sFunc) {
        var defaultConfig={
            height: 400,
            width: 600
        };
        defaultConfig = $.extend(true, {}, defaultConfig, config);
        this.Alert(opererWindow,dialogId,defaultConfig,htmlmsg,sFunc);
    },
    AlertText:function(text){
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {},text, null);
    },
    Alert:function(opererWindow,dialogId,config,htmlmsg,sFunc) {
        //debugger;
        var htmlElem = this._CreateDialogElem(opererWindow.document.body,dialogId);
        var defaultConfig = {
            height: 200,
            width: 300,
            title:"系统提示",
            show:true,
            modal:true,
            buttons:{
                "关闭": function () {
                    $(htmlElem).dialog("close");
                }
            },
            open:function () {
            },
            close:function () {
                if(sFunc){
                    sFunc();
                }
            }
        };
        var defaultConfig = $.extend(true, {}, defaultConfig, config);
        $(htmlElem).html(htmlmsg);
        $(htmlElem).dialog(defaultConfig);
    },
    AlertJsonCode:function(json){
        if(typeof(json)=="object") {
            json = JsonUtility.JsonToStringFormat(json);
        }
        json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
        json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function(match) {
            var cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
        //this.Alert(window, DialogUtility.DialogAlertId, {width:900,height:600},"<pre class='json-pre'>"+json+"</pre>", null);
        var htmlElem = this._CreateDialogElem(window.document.body,DialogUtility.DialogAlertId);
        var defaultConfig = {
            height: 600,
            width: 900,
            title:"系统提示",
            show:true,
            modal:true,
            buttons:{
                "关闭": function () {
                    $(htmlElem).dialog("close");
                },
                "复制并关闭": function () {
                    //var value=json;
                    //alert(value);
                    $(htmlElem).dialog("close");
                    BaseUtility.CopyValueClipboard($(".json-pre").text());
                    //$(htmlElem).dialog("close");
                }
            },
            open:function () {
            },
            close:function () {
                /*if(sFunc){
                    sFunc();
                }*/
            }
        };

        //var defaultConfig = $.extend(true, {}, defaultConfig, config);
        $(htmlElem).html("<div id='pscontainer' style='width: 100%;height: 100%;overflow: auto;position: relative;'><pre class='json-pre'>"+json+"</pre></div>");
        $(htmlElem).dialog(defaultConfig);

        //var $qs = document.querySelector.bind(document);
        var ps = new PerfectScrollbar('#pscontainer');
    },
    ShowHTML:function (opererWindow,dialogId,config,htmlmsg,close_after_event,params) {
        var htmlElem = this._CreateDialogElem(opererWindow.document.body,dialogId);
        var defaultConfig = {
            height: 200,
            width: 300,
            title:"系统提示",
            show:true,
            modal:true,
            close: function (event, ui) {
                try {
                    if(typeof(close_after_event)=="function"){
                        close_after_event(params);
                    }
                }
                catch(e){

                }
            }
        };
        var defaultConfig = $.extend(true, {}, defaultConfig, config);
        $(htmlElem).html(htmlmsg);
        return $(htmlElem).dialog(defaultConfig);
    },
    AlertLoading:function(opererWindow,dialogId,config,htmlmsg){
        var htmlElem = this._CreateAlertLoadingMsgElement(opererWindow.document.body,dialogId);
        var defaultConfig = {
            height: 200,
            width: 300,
            title:"",
            show:true,
            modal:true
        };
        var defaultConfig = $.extend(true, {}, defaultConfig, config);
        $(htmlElem).find(".alertloading-txt").html(htmlmsg);
        $(htmlElem).dialog(defaultConfig);
    },
    Confirm : function(opererWindow, htmlmsg, okFn) {
        this.ConfirmConfig(opererWindow, htmlmsg, null, okFn);
    },
    ConfirmConfig : function(opererWindow, htmlmsg, config,okFn) {
        var htmlElem = this._CreateDialogElem(opererWindow.document.body, "AlertConfirmMsg");
        var paras= null;
        var defaultConfig = {
            okfunc:function(paras){
                if(okFn != undefined){
                    return okFn();
                } else {
                    opererWindow.close();
                }
            },
            cancelfunc:function(paras){

            },
            validatefunc:function(paras){
                return true;
            },
            closeafterfunc:true,
            height: 200,
            width: 300,
            title:"系统提示",
            show:true,
            modal:true,
            buttons:{
                "确认": function () {
                    if(defaultConfig.validatefunc(paras)) {
                        var r= defaultConfig.okfunc(paras);
                        r=(r==null?true:r);
                        if(r && defaultConfig.closeafterfunc) {
                            $(htmlElem).dialog("close");
                        }
                    }
                },
                "取消":function() {
                    defaultConfig.cancelfunc(paras);
                    if(defaultConfig.closeafterfunc) {
                        $(htmlElem).dialog("close");
                    }
                }
            }
        };
        var defaultConfig = $.extend(true, {}, defaultConfig, config);
        $(htmlElem).html(htmlmsg);
        $(htmlElem).dialog(defaultConfig);
        paras={
            "ElementObj":htmlElem
        };
    },
    Prompt:function(opererWindow,config,dialogId,labelMsg,okFunc) {
        var htmlElem = this._CreateDialogElem(opererWindow.document.body, dialogId);
        var paras = null;
        var textArea=$("<textarea />");
        var defaultConfig = {
            height: 200,
            width: 300,
            title: "",
            show: true,
            modal: true,
            buttons: {
                "确认": function () {
                    //debugger;
                    if(typeof(okFunc)=="function") {
                        var inputText = textArea.val();
                        okFunc(inputText);
                    }
                    $(htmlElem).dialog("close");
                },
                "取消": function () {
                    $(htmlElem).dialog("close");
                }
            }
        };
        var defaultConfig = $.extend(true, {}, defaultConfig, config);
        $(textArea).css("height",defaultConfig.height - 130).css("width","100%");

        var htmlContent = $("<div><div style='width: 100%'>" + labelMsg + "：</div></div>").append(textArea);
        $(htmlElem).html(htmlContent);
        $(htmlElem).dialog(defaultConfig);
        //dialog.textAreaObj=textArea;
    },
    DialogElem:function (elemId,config) {
        $("#"+elemId).dialog(config);
    },
    DialogElemObj:function (elemObj,config) {
        $(elemObj).dialog(config);
    },
    OpenIframeWindow:function(openerwindow, dialogId, url, options, whtype){
        var defaultoptions = {
            height: 410,
            width: 600,
            close: function (event, ui) {
                var autodialogid = $(this).attr("id");
                $(this).find("iframe").remove();
                $(this).dialog('close')
                $(this).dialog("destroy");
                $("#" + autodialogid).remove();
                if (BrowserInfoUtility.IsIE8DocumentMode()) {
                    CollectGarbage();
                }
                if(typeof(options.close_after_event)=="function"){
                    options.close_after_event();
                }
                try {
                    if($("#Forfocus").length>0){
                        $("#Forfocus")[0].focus();
                    }
                }
                catch(e){

                }
            }
        };
        //debugger;
        if (whtype == 1) {
            defaultoptions = $.extend(true, {}, defaultoptions, {height: 680, width: 980});
        }
        else if (whtype == 2) {
            defaultoptions = $.extend(true, {}, defaultoptions, {height: 600, width: 800});
        }
        else if (whtype == 4) {
            defaultoptions = $.extend(true, {}, defaultoptions, {height: 380, width: 480});
        }
        else if (whtype == 5) {
            defaultoptions = $.extend(true, {}, defaultoptions, {height: 180, width: 300});
        }

        //如果宽度，高度设置为0，则自动设置为全屏
        if(options.width==0) {
            options.width = PageStyleUtil.GetPageWidth()-20;
        }
        if(options.height==0) {
            options.height = PageStyleUtil.GetPageHeight()-10;
        }

        defaultoptions = $.extend(true, {}, defaultoptions, options);
        var autodialogid = dialogId;
        var dialogEle = this._CreateIfrmaeDialogElement(openerwindow.document, autodialogid, url);

        var dialogObj=$(dialogEle).dialog(defaultoptions);
        var $iframeobj = $(dialogEle).find("iframe");

        $iframeobj.on("load",function () {
            //alert("load");
            if(StringUtility.IsSameOrgin(window.location.href,url)) {
                this.contentWindow.FrameWindowId = autodialogid;
                this.contentWindow.OpenerWindowObj = openerwindow;
                this.contentWindow.IsOpenForFrame = true;
            }
            else{
                console.log("跨域Iframe,无法设置属性!");
            }
        });

        $iframeobj.attr("src",url);
        //$iframeobj[0].contentWindow.FrameWindowId = autodialogid;
        //$iframeobj[0].contentWindow.OpenerWindowObj = openerwindow;
        return dialogObj;
        /*$iframeobj.load(function () {
            try {
                var elem = $(this).contents().find("input:text:first");
                if (elem.attr("readonly") != "readonly"&& elem.attr("disabled") != "disabled") {
                    elem[0].focus();
                }
                else {
                    var elems = $(this).contents().find("input:text");
                    for (var i = 0; i < elems.length; i++) {
                        var elem = $(elems[i]);
                        if (elem.attr("readonly") != "readonly"&&elem.attr("disabled") != "disabled") {
                            elem[0].focus();
                            break;
                        }
                    }
                }
            }
            catch (e) {
            }
        });*/
    },
    CloseOpenIframeWindow:function(openerwindow,dialogId){
        //alert(dialogId);
        openerwindow.OpenerWindowObj.DialogUtility.CloseDialog(dialogId)
    },
    CloseDialogElem:function(dialogElem){
        //debugger;
        $(dialogElem).find("iframe").remove();
        $(dialogElem).dialog("close");

        try {
            if($("#Forfocus").length>0){
                $("#Forfocus")[0].focus();
            }
        }
        catch(e){

        }
    },
    CloseDialog:function(dialogId){
        //debugger;
        /*this._GetElem(dialogId).find("iframe").remove();
        $(this._GetElem(dialogId)).dialog("close");

        try {
            if($("#Forfocus").length>0){
                $("#Forfocus")[0].focus();
            }
        }
        catch(e){

        }*/
        this.CloseDialogElem(this._GetElem(dialogId));
    },
    OpenNewWindow: function (openerwindow, dialogId, url, options, whtype) {
        var width=0;
        var height=0;
        if(options){
            width=options.width;
            height=options.height;
        }
        var left = parseInt((screen.availWidth - width) / 2).toString();
        var top = parseInt((screen.availHeight - height) / 2).toString();
        if (width.toString() == "0" && height.toString() == "0") {
            width = window.screen.availWidth-30;
            height = window.screen.availHeight - 60;
            left = "0";
            top = "0";
        }
        var winHandle = window.open(url, "", "scrollbars=no,toolbar=no,menubar=no,resizable=yes,center=yes,help=no, status=yes,top= " + top + "px,left=" + left + "px,width=" + width + "px,height=" + height + "px");
        if (winHandle == null) {
            alert("请解除浏览器对本系统弹出窗口的阻止设置！");
        }
    },
    _TryGetParentWindow: function (win) {
        if (win.parent != null) {
            return win.parent;
        }
        return null;
    },
    _Frame_TryGetFrameWindowObj: function (win, tryfindtime, currenttryfindtime) {
        if (tryfindtime > currenttryfindtime) {
            //var document = win;
            var istopFramepage = false;
            currenttryfindtime++;
            try {
                istopFramepage = win.IsTopFramePage;
                if (istopFramepage) {
                    return win;
                }
                else {
                    return this._Frame_TryGetFrameWindowObj(this._TryGetParentWindow(win), tryfindtime, currenttryfindtime)
                }
            } catch (e) {
                return this._Frame_TryGetFrameWindowObj(this._TryGetParentWindow(win), tryfindtime, currenttryfindtime)
            }
        }
        return null;
    },
    _OpenWindowInFramePage: function (openerwindow, dialogId, url, options, whtype) {

        if (StringUtility.IsNullOrEmpty(dialogId)) {
            alert("dialogId不能为空");
            return;
        }
        //debugger;
        url = BaseUtility.AppendTimeStampUrl(url);
        var autodialogid = "FrameDialogEle" + dialogId;

        if ($(this.FramePageRef.document).find("#" + autodialogid).length == 0) {
            var dialogEle = this._CreateIfrmaeDialogElement(this.FramePageRef.document, autodialogid, url);
            var defaultoptions = {
                height: 400,
                width: 600,
                modal:true,
                title:"系统",
                close: function (event, ui) {
                    var autodialogid = $(this).attr("id");
                    $(this).find("iframe").remove();
                    $(this).dialog('close');
                    $(this).dialog("destroy");
                    $("#" + autodialogid).remove();
                    if (BrowserInfoUtility.IsIE8DocumentMode()) {
                        CollectGarbage();
                    }
                    if(typeof(options.close_after_event)=="function"){
                        options.close_after_event();
                    }
                }
            };
            if (whtype == 0) {
                options.width = PageStyleUtility.GetPageWidth()-20;
                options.height = PageStyleUtility.GetPageHeight()-180;
            }
            else if (whtype == 1) {
                defaultoptions = $.extend(true, {}, defaultoptions, {height: 610, width: 980});
            }
            else if (whtype == 2) {
                defaultoptions = $.extend(true, {}, defaultoptions, {height: 600, width: 800});
            }
            else if (whtype == 4) {
                defaultoptions = $.extend(true, {}, defaultoptions, {height: 380, width: 480});
            }
            else if (whtype == 5) {
                defaultoptions = $.extend(true, {}, defaultoptions, {height: 180, width: 300});
            }

            //如果宽度，高度设置为0，则自动设置为全屏
            if(options.width==0) {
                options.width = PageStyleUtility.GetPageWidth()-20;
            }
            if(options.height==0) {
                options.height = PageStyleUtility.GetPageHeight()-180;
            }

            defaultoptions = $.extend(true, {}, defaultoptions, options);
            $(dialogEle).dialog(defaultoptions);
            $(".ui-widget-overlay").css("zIndex","2000");
            $(".ui-dialog").css("zIndex","2001");
            var $iframeobj = $(dialogEle).find("iframe");
            $iframeobj.on("load",function () {
                //alert("load");
                if(StringUtility.IsSameOrgin(window.location.href,url)) {
                    this.contentWindow.FrameWindowId = autodialogid;
                    this.contentWindow.OpenerWindowObj = openerwindow;
                    this.contentWindow.IsOpenForFrame = true;
                }
                else{
                    console.log("跨域Iframe,无法设置属性!");
                }
            });
            $iframeobj.attr("src",url);
            //$iframeobj[0].contentWindow.FrameWindowId = autodialogid;
            //$iframeobj[0].contentWindow.OpenerWindowObj = openerwindow;
            //alert(1);
            //$iframeobj[0].contentWindow.IsOpenForFrame=true;
            /*$iframeobj.load(function () {
                //alert($(this).contents().find("input").length);
                try {
                    //debugger;
                    //var elem=$(this).contents().find("input:first")[0].focus();
                    var elem = $(this).contents().find("input:text:first");
                    if (elem.attr("readonly") != "readonly"&& elem.attr("disabled") != "disabled") {
                        elem[0].focus();
                    }
                    else {
                        var elems = $(this).contents().find("input:text");
                        for (var i = 0; i < elems.length; i++) {
                            var elem = $(elems[i]);
                            if (elem.attr("readonly") != "readonly"&&elem.attr("disabled") != "disabled") {
                                elem[0].focus();
                                break;
                            }
                        }
                    }
                }
                catch (e) {

                }
            });*/
        }
        else {
            $("#" + autodialogid).dialog("moveToTop");
        }
    },
    _Frame_FramePageCloseDialog: function (dialogid) {
        $("#" + dialogid).dialog("close");
    },
    Frame_TryGetFrameWindowObj: function () {
        var tryfindtime = 5;
        var currenttryfindtime = 1;
        return this._Frame_TryGetFrameWindowObj(window, tryfindtime, currenttryfindtime);
    },
    Frame_Alert:function () {

    },
    Frame_Comfirm:function () {

    },
    Frame_OpenIframeWindow:function (openerwindow, dialogId, url, options, whtype) {
        //debugger;
        if(url==""){
            alert("url不能为空字符串!");
            return;
        }
        var wrwin = this.Frame_TryGetFrameWindowObj();
        this.FramePageRef = wrwin;
        if (wrwin != null) {
            //alert("show");
            this.FramePageRef.DialogUtility.FramePageRef = wrwin;
            this.FramePageRef.DialogUtility._OpenWindowInFramePage(openerwindow, dialogId, url, options, whtype);
        }
        else {
            alert("找不到FramePage!!");
        }
    },
    Frame_CloseDialog:function (opererWindow) {
        //debugger;
        //console.log("close Frame_CloseDialog");
        //window.setInterval()
        var wrwin = this.Frame_TryGetFrameWindowObj();
        var openerwin = opererWindow.OpenerWindowObj;
        var autodialogid = opererWindow.FrameWindowId;
        wrwin.DialogUtility._Frame_FramePageCloseDialog(autodialogid);
    }
}