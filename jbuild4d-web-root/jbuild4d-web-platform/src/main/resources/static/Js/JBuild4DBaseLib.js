var console = console || {
    log: function () {
    },
    warn:function () {
    },
    error:function () {
    }
};

//重写Date方法，解决T16:00:00.000Z问题
function DateExtend_DateFormat(date, fmt) {
    if (null == date || undefined == date) return '';
    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "S": date.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
Date.prototype.toJSON = function () { return DateExtend_DateFormat(this,'yyyy-MM-dd mm:hh:ss')}

//扩展js对象功能
if (!Object.create) {
    Object.create = (function () {
        alert("Extend Object.create");
        function F() {
        }
        return function (o) {
            if (arguments.length !== 1) {
                throw new Error('Object.create implementation only accepts one parameter.');
            }
            F.prototype = o;
            return new F()
        }
    })()
}

$.fn.outerHTML = function () {
    // IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
    return (!this.length) ? this : (this[0].outerHTML || (function (el) {
        var div = document.createElement('div');
        div.appendChild(el.cloneNode(true));
        var contents = div.innerHTML;
        div = null;
        alert(contents);
        return contents;
    })(this[0]));
};

//基础工具
var BaseUtility = {
    GetRootPath: function () {
        var fullHref = window.document.location.href;
        var pathName = window.document.location.pathname;
        var lac = fullHref.indexOf(pathName);
        var localhostPath = fullHref.substring(0, lac);
        var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return (localhostPath + projectName);
    },
    ReplaceUrlVariable:function (sourceUrl) {
        alert("ReplaceUrlVariable迁移到BuildAction");
        //return sourceUrl.replace("${ctxpath}", this.GetRootPath());
    },
    GetTopWindow: function () {
        alert("BaseUtility.GetTopWindow 已停用");
        /*var windowTop = window;
        var windowParent = window.dialogArguments || opener || parent;
        while (windowParent && windowTop != windowParent) {
            windowTop = windowParent;
            if(windowTop.IsTopWorkaroundPage){
                break;
            }
            windowParent = windowParent.dialogArguments || windowParent.opener || windowParent.parent;
        }
        return windowTop;*/
    },
    TrySetControlFocus:function () {
        alert("BaseUtility.TrySetControlFocus 已停用");
        /*var cts=$("input[type='text']");
        for(var i=0;i<cts.length;i++){
            var ct=$(cts[i]);
            if (ct.attr("readonly") != "readonly"&& ct.attr("disabled") != "disabled") {
                try {
                    ct[0].focus();
                }
                catch (e) {

                }
                return;
            }
        }*/
    },
    BuildUrl:function (url) {
        alert("BaseUtility.BuildUrl 已停用");

        /*var _url=this.GetRootPath()+url;
        return StringUtility.GetTimeStampUrl(_url);*/
    },
    BuildAction:function (action,para) {
        var urlPara = "";
        if (para) {
            urlPara = $.param(para);
        }
        var _url = this.GetRootPath() + action + ".do";
        if (urlPara != "") {
            _url += "?" + urlPara;
        }
        //alert(_url);
        return this.AppendTimeStampUrl(_url);
    },
    RedirectToLogin:function () {
        var url=BaseUtility.GetRootPath()+"/Login.do";
        window.parent.parent.location.href=url;
    },
    AppendTimeStampUrl:function (url) {
        if (url.indexOf("timestamp") > "0") {
            return url;
        }
        var getTimestamp = new Date().getTime();
        if (url.indexOf("?") > -1) {
            url = url + "&timestamp=" + getTimestamp
        } else {
            url = url + "?timestamp=" + getTimestamp
        }
        return url;
    },
    GetUrlParaValue: function (paraName) {
        return this.GetUrlParaValueByString(paraName,window.location.search);
    },
    GetUrlParaValueByString:function (paraName,urlString) {
        var reg = new RegExp("(^|&)" + paraName + "=([^&]*)(&|$)");
        var r = urlString.substr(1).match(reg);
        if (r != null)return decodeURIComponent(r[2]);
        return "";
    }
};

//浏览下信息类
var BrowserInfoUtility = {
    BrowserAppName: function () {
        if (navigator.userAgent.indexOf("Firefox") > 0) {
            return "Firefox";
        }
        else if (navigator.userAgent.indexOf("MSIE") > 0) {
            return "IE";
        }
        else if (navigator.userAgent.indexOf("Chrome") > 0) {
            return "Chrome";
        }
    },
    IsIE: function () {
        if (!!window.ActiveXObject || "ActiveXObject" in window)
            return true;
        else
            return false;
    },
    IsIE6: function () {
        return navigator.userAgent.indexOf("MSIE 6.0") > 0;
    },
    IsIE7: function () {
        return navigator.userAgent.indexOf("MSIE 7.0") > 0;
    },
    IsIE8: function () {
        return navigator.userAgent.indexOf("MSIE 8.0") > 0;

    },
    IsIE8X64: function () {
        if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
            return navigator.userAgent.indexOf("x64") > 0;

        }
        return false;
    },
    IsIE9: function () {
        return navigator.userAgent.indexOf("MSIE 9.0") > 0;

    },
    IsIE9X64: function () {
        if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
            return navigator.userAgent.indexOf("x64") > 0;

        }
        return false;
    },
    IsIE10: function () {
        return navigator.userAgent.indexOf("MSIE 10.0") > 0;

    },
    IsIE10X64: function () {
        if (navigator.userAgent.indexOf("MSIE 10.0") > 0) {
            return navigator.userAgent.indexOf("x64") > 0;

        }
        return false;
    },
    IEDocumentMode: function () {
        return document.documentMode;
    },
    IsIE8DocumentMode: function () {
        return this.IEDocumentMode() == 8;
    },
    IsFirefox: function () {
        return this.BrowserAppName() == "Firefox";

    },
    IsChrome: function () {
        return this.BrowserAppName() == "Chrome";

    }
};

//字符串操作类
var StringUtility = {
    GetTimeStampUrl: function (url) {
        alert("迁移到BaseUtility.AppendTimeStampUrl");
    },
    GetAllQueryString: function () {
        alert("StringUtility.GetAllQueryString 已停用");
        /*var urlString = document.location.search;
        var urlStringArray = [];
        if (urlString != null) {
            var itemArray = urlString.split("&");
            for (var i = 0; i < itemArray.length; i++) {
                var item = itemArray[i];
                urlStringArray.push({Name: item.split("=")[0], Value: item.split("=")[1]});
            }
        }
        return urlStringArray;*/
    },
    QueryString: function (fieldName) {
        alert("迁移到BaseUtility.GetUrlParaValue");
        /*var urlString = document.location.search;
        while (urlString.indexOf("& ") >= 0) {
            urlString = urlString.replace("& ", "&")
        }
        while (urlString.indexOf("? ") >= 0) {
            urlString = urlString.replace("? ", "?")
        }
        if (urlString != null) {
            var typeQu = "?" + fieldName + "=";
            var urlEnd = urlString.toUpperCase().indexOf(typeQu.toUpperCase());
            if (urlEnd == -1) {
                typeQu = "&" + fieldName + "=";
                urlEnd = urlString.toUpperCase().indexOf(typeQu.toUpperCase())
            }
            if (urlEnd != -1) {
                var paramsUrl = urlString.substring(urlEnd + typeQu.length);
                var isEnd = paramsUrl.indexOf('&');
                if (isEnd != -1) {
                    return paramsUrl.substring(0, isEnd)
                } else {
                    return paramsUrl
                }
            } else return ""
        } else return "";*/
    },
    QueryStringUrlString: function (fieldName, urlString) {
        alert("迁移到BaseUtility.GetUrlParaValueByString");
        /*while (urlString.indexOf("& ") >= 0) {
            urlString = urlString.replace("& ", "&")
        }
        while (urlString.indexOf("? ") >= 0) {
            urlString = urlString.replace("? ", "?")
        }
        if (urlString != null) {
            var typeQu = "?" + fieldName + "=";
            var urlEnd = urlString.toUpperCase().indexOf(typeQu.toUpperCase());
            if (urlEnd == -1) {
                typeQu = "&" + fieldName + "=";
                urlEnd = urlString.toUpperCase().indexOf(typeQu.toUpperCase())
            }
            if (urlEnd != -1) {
                var paramsUrl = urlString.substring(urlEnd + typeQu.length);
                var isEnd = paramsUrl.indexOf('&');
                if (isEnd != -1) {
                    return paramsUrl.substring(0, isEnd)
                } else {
                    return paramsUrl
                }
            } else return ""
        } else return "";*/
    },
    XMLEncode: function (str) {
        alert("StringUtility.XMLEncode 已停用");
        /*if (str) {
            var re;
            re = new RegExp("&", "g");
            str = str.replace(re, "&amp;");
            re = new RegExp("<", "g");
            str = str.replace(re, "&lt;");
            re = new RegExp(">", "g");
            str = str.replace(re, "&gt;");
            re = new RegExp("'", "g");
            str = str.replace(re, "&apos;");
            re = new RegExp("\"", "g");
            str = str.replace(re, "&quot;");
        }
        return str;*/
    },
    XMLDeCode: function (str) {
        alert("StringUtility.XMLDeCode 已停用");
        /*if (str) {
            var re;
            re = new RegExp("&lt;", "g");
            str = str.replace(re, "<");
            re = new RegExp("&gt;", "g");
            str = str.replace(re, ">");
            re = new RegExp("&apos;", "g");
            str = str.replace(re, "'");
            re = new RegExp("&quot;", "g");
            str = str.replace(re, "\"");
            re = new RegExp("&amp;", "g");
            str = str.replace(re, "&");
        }
        return str;*/
    },
    HTMLEncode: function (str) {
        alert("StringUtility.HTMLEncode 已停用");
        /*var temp = $("<div />");
        temp.text(str);
        return temp.html();*/
    },
    HTMLDecode: function (str) {
        alert("StringUtility.HTMLDecode 已停用");
        /*var temp = $("<div />");
        temp.html(str);
        return temp.text();*/
    },
    Format: function () {
        alert("StringUtility.HTMLDecode 已停用");
        /*if (arguments.length == 0) return null;
        var str = arguments[0];
        for (var i = 1; i < arguments.length; i++) {
            var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
            str = str.replace(re, arguments[i]);
        }
        return str;*/
    },
    GuidNotSplit: function () {
        alert("StringUtility.GuidNotSplit 已停用");
    },
    GuidSplit: function (split) {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            guid += Math.floor(Math.random() * 16.0).toString(16);
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += split;
        }
        return guid;
    },
    Guid: function () {
        return this.GuidSplit("-");
    },
    RTimestamp: function () {
        alert("迁移到StringUtility.Timestamp");
        /*var getTimestamp = new Date().getTime();
        //var n = Math.floor(Math.random() * 100.0).toString(5);
        return getTimestamp.toString().substr(4, 9);*/
    },
    Timestamp: function () {
        var timestamp = new Date().getTime();
        return timestamp.toString().substr(4, 10);
    },
    Trim: function (str) {
        return str.replace(/(^[　\s]*)|([　\s]*$)/g, "");
    },
    LTrim: function (str) {
        alert("StringUtility.LTrim 已停用");
        //return str.replace(/(^[　\s]*)/g, "");
    },
    RTrim: function (str) {
        alert("StringUtility.RTrim 已停用");
        //return str.replace(/([　\s]*$)/g, "");
    },
    TrimLastChar: function (str) {
        alert("迁移到StringUtility.RemoveLastChar");
        return str.substring(0, str.length - 1)
    },
    RemoveLastChar: function (str) {
        return str.substring(0, str.length - 1)
    },
    StringToJson: function (str) {
        alert("迁移到JsonUtility.StringToJson");
        //return eval("(" + str + ")");
    },
    Level1JsonToString: function (jsonObj) {
        alert("迁移到JsonUtility.JsonToString");
        /*var result = [];
        result.push("{");
        for (var key in jsonObj) {
            //alert(key+":\""+jsonObj[key].replace(/"/g,"\\\"")+"\",");
            //alert("\\\"");
            //alert();
            if (jQuery.type(jsonObj[key]) == "string") {
                result.push(key + ":\"" + jsonObj[key].replace(/"/g, "\\\"") + "\",");
            }
            else if (jQuery.type(jsonObj[key]) == "array") {
                result.push(key + ":[");
                for (var i = 0; i < jsonObj[key].length; i++) {
                    var innjson = jsonObj[key][i];
                    result.push(this.Level1JsonToString(innjson));
                    result.push(",");
                }
                if (jsonObj[key].length > 0) {
                    result[result.length - 1] = this.TrimLastChar(result[result.length - 1]);
                }
                result.push("]");
            }
        }
        if (result[result.length - 1].indexOf(",") == result[result.length - 1].length - 1) {
            result[result.length - 1] = this.TrimLastChar(result[result.length - 1]);
        }
        result.push("}");
        return result.join("");*/
    },
    Level1JsonToStringKeyString: function (jsonObj) {
        alert("迁移到JsonUtility.JsonToString");
        /*var result = [];
        result.push("{");
        for (var key in jsonObj) {
            //alert(key+":\""+jsonObj[key].replace(/"/g,"\\\"")+"\",");
            //alert("\\\"");
            //alert();
            if (jQuery.type(jsonObj[key]) == "string") {
                result.push("\"" + key + "\"" + ":\"" + jsonObj[key].replace(/"/g, "\\\"") + "\",");
            }
            else if (jQuery.type(jsonObj[key]) == "array") {
                result.push("\"" + key + "\"" + ":[");
                for (var i = 0; i < jsonObj[key].length; i++) {
                    var innjson = jsonObj[key][i];
                    result.push(this.Level1JsonToStringKeyString(innjson));
                    result.push(",");
                }
                if (jsonObj[key].length > 0) {
                    result[result.length - 1] = this.TrimLastChar(result[result.length - 1]);
                }
                result.push("]");
            }
        }
        if (result[result.length - 1].indexOf(",") == result[result.length - 1].length - 1) {
            result[result.length - 1] = this.TrimLastChar(result[result.length - 1]);
        }
        result.push("}");
        return result.join("");*/
    },
    Level1JsonToStringValueEncode: function (jsonObj) {
        alert("迁移到JsonUtility.JsonToString");
        /*var result = [];
        result.push("{");
        for (var key in jsonObj) {
            //alert(key+":\""+jsonObj[key].replace(/"/g,"\\\"")+"\",");
            //alert("\\\"");
            //alert();
            if (jQuery.type(jsonObj[key]) == "string") {
                result.push(key + ":\"" + encodeURIComponent(jsonObj[key]) + "\",");
            }
            else if (jQuery.type(jsonObj[key]) == "array") {
                result.push(key + ":[");
                for (var i = 0; i < jsonObj[key].length; i++) {
                    var innjson = jsonObj[key][i];
                    result.push(this.Level1JsonToStringValueEncode(innjson));
                    result.push(",");
                }
                result[result.length - 1] = this.TrimLastChar(result[result.length - 1]);
                result.push("]");
            }
        }
        if (result[result.length - 1].indexOf(",") == result[result.length - 1].length - 1) {
            result[result.length - 1] = this.TrimLastChar(result[result.length - 1]);
        }
        result.push("}");
        return result.join("");*/
    },
    Level1StringToJsonValueDecode: function (str) {
        alert("迁移到JsonUtility.JsonToString");
        /*var json = this.StringToJson(str);
        for (var key in json) {
            if (jQuery.type(json[key]) == "string") {
                json[key] = decodeURIComponent(json[key]);
            }
            else if (jQuery.type(json[key]) == "array") {
                for (var i = 0; i < json[key].length; i++) {
                    var innobj = json[key][i];
                    for (var innkey in innobj) {
                        innobj[innkey] = decodeURIComponent(innobj[innkey]);
                    }
                }
            }
        }
        return json;*/
    },
    GetBrithdayByIdCard: function (str) {
        alert("StringUtility.GetBrithdayByIdCard 已停用");
        /*var year, month, day;
        if (str.length != 15 && str.length != 18) {
            return "";
        }
        if (str.length == 15) {
            year = str.substring(6, 8);
            month = str.substring(8, 10);
            day = str.substring(10, 12);
        }
        else if (str.length == 18) {
            year = str.substring(6, 10);
            month = str.substring(10, 12);
            day = str.substring(12, 14);
        }
        if (year.length == 2) year = "19" + year;
        if (month.indexOf("0") == 0) month = month.substring(1);
        if (day.indexOf("0") == 0) day = day.substring(1);
        return year + "-" + month + "-" + day;*/
    },
    GetSexByIdCard: function (str) {
        alert("StringUtility.GetSexByIdCard 已停用");
        /*if (parseInt(str.substr(16, 1)) % 2 == 1) {
            return "男性";
        } else {
            return "女性";
        }*/
    },
    IsNullOrEmpty: function (obj) {
        return obj == undefined || obj == "" || obj == null || obj == "undefined" || obj == "null"
    },
    IsNullOrEmptyObject: function (obj) {
        alert("StringUtility.IsNullOrEmptyObject 已停用");
        //return obj == undefined || obj == null
    },
    GetFuntionName: function (func) {
        if (typeof func == "function" || typeof func == "object")
            var fName = ("" + func).match(
                /function\s*([\w\$]*)\s*\(/
            );
        if (fName !== null) return fName[1];
    },
    ToLowerCase: function (str) {
        return str.toLowerCase();
    },
    toUpperCase: function (str) {
        return str.toUpperCase();
    },
    Padding: function (num, length) {
        alert("StringUtility.Padding 已停用");
        /*var len = (num + "").length;
        var diff = length - len;
        if(diff > 0) {
            return Array(diff).join("0") + num;
        }
        return num;*/
    }
};

//日期时间工具类
var DateUtility={
    GetCurrentDataString:function (split) {
        alert("DateUtility.GetCurrentDataString 已停用");
        /*this.SetSplit(split);*/
        /*var myDate = new Date();
        var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = myDate.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        return year + split + month + split + day;*/
    },
    DateFormat:function (myDate,split) {
        alert("DateUtility.GetCurrentDataString 已停用");
        /*this.SetSplit(split);*/
        /*var year = myDate.getFullYear();
        var month = myDate.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        var day = myDate.getDate();
        if (day < 10) {
            day = "0" + day;
        }
        return year + split + month + split + day;*/
    },
    Format:function (myDate,formatString) {
        var o = {
            "M+" : myDate.getMonth()+1, //month
            "d+" : myDate.getDate(),    //day
            "h+" : myDate.getHours(),   //hour
            "m+" : myDate.getMinutes(), //minute
            "s+" : myDate.getSeconds(), //second
            "q+" : Math.floor((myDate.getMonth()+3)/3),  //quarter
            "S" : myDate.getMilliseconds() //millisecond
        };
        if(/(y+)/.test(formatString)) formatString=formatString.replace(RegExp.$1,
            (myDate.getFullYear()+"").substr(4 - RegExp.$1.length));
        for(var k in o)if(new RegExp("("+ k +")").test(formatString))
            formatString = formatString.replace(RegExp.$1,
                RegExp.$1.length==1 ? o[k] :
                    ("00"+ o[k]).substr((""+ o[k]).length));
        return formatString;
    },
    FormatCurrentData:function (formatString) {
        var myDate = new Date();
        return this.Format(myDate,formatString);
    },
    GetCurrentData:function () {
        return new Date();
    }
};

//Json操作工具类
var JsonUtility = {
    ParseArrayJsonToTreeJson:function (config, sourceArray, rootId){
        var _config = {
            KeyField: "",
            RelationField: "",
            ChildFieldName: ""
        };

        function FindJsonById(keyField, id) {
            for (var i = 0; i < sourceArray.length; i++) {
                if (sourceArray[i][keyField] == id) {
                    return sourceArray[i];
                }
            }
            alert("ParseArrayJsonToTreeJson.FindJsonById:在sourceArray中找不到指定Id的记录");
        }

        function FindChildJson(relationField, pid) {
            var result = [];
            for (var i = 0; i < sourceArray.length; i++) {
                if (sourceArray[i][relationField] == pid) {
                    result.push(sourceArray[i]);
                }
            }
            return result;
        }

        function FindChildNodeAndParse(pid, result) {
            var childjsons = FindChildJson(config.RelationField, pid);
            if (childjsons.length > 0) {
                if (result[config.ChildFieldName] == undefined) {
                    result[config.ChildFieldName] = [];
                }
                for (var i = 0; i < childjsons.length; i++) {
                    var toObj = {};
                    toObj = JsonUtility.SimpleCloneAttr(toObj, childjsons[i]);
                    result[config.ChildFieldName].push(toObj);
                    var id = toObj[config.KeyField];
                    FindChildNodeAndParse(id, toObj);
                }
            }
        }

        var result = {};
        var rootJson = FindJsonById(config.KeyField, rootId);
        result = this.SimpleCloneAttr(result, rootJson);
        FindChildNodeAndParse(rootId, result);
        return result;
    },
    ResolveSimpleArrayJsonToTreeJson: function (config, sourceJson, rootNodeId) {
        alert("JsonUtility.ResolveSimpleArrayJsonToTreeJson 已停用");
    },
    SimpleCloneAttr: function (toObj, fromObj) {
        for (var attr in fromObj) {
            toObj[attr] = fromObj[attr];
        }
        return toObj;
    },
    CloneSimple:function (source) {
        var newJson = jQuery.extend(true,{}, source);
        return newJson;
    },
    JsonToString:function (obj) {
        return JSON.stringify(obj);
    },
    JsonToStringFormat:function (obj) {
        return JSON.stringify(obj, null, 2);
    },
    StringToJson: function (str) {
        return eval("(" + str + ")");
    }
};

//页面样式辅助功能类
var PageStyleUtility = {
    GetPageHeight: function () {
        return jQuery(window.document).height();
    },
    GetPageWidth: function () {
        return jQuery(window.document).width();
    },
    GetWindowHeight:function () {
        return $(window).height();
    },
    GetWindowWidth:function () {
        return $(window).width();
    },
    GetListButtonOuterHeight: function () {
        alert("PageStyleUtility.GetListButtonOuterHeight 已停用");
        return jQuery(".list-button-outer-c").outerHeight();
    }
};

//XML处理工具类
var XMLUtility={

}

//对话框工具类
var DialogUtility={
    DialogAlertId:"DefaultDialogAlertUtility01",
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
        var dialogEle = $("<div id=" + dialogid + " title='Basic dialog' style='display:none'>\
                        <iframe width='100%' height='98%' frameborder='0' src='" + url + "'>\
                        </iframe>\
                    </div>");
        $(docobj.body).append(dialogEle);
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
                    $("#bgDailogIframe").hide();
                }
            },
            open:function () {
                if($("object[classid='clsid:FF1FE7A0-0578-4FEE-A34E-FB21B277D561']").length>0) {
                    //alert(111);
                    var bgiframe = $("#bgDailogIframe");
                    if (bgiframe.length == 0) {
                        $(opererWindow.document.body).append("<iframe id='bgDailogIframe' frameborder='0' style='position:absolute;z-index: 100;' src='" + BaseUtil.GetRootPath() + "/UIComponent/Dialog/BGTransparent.html'></iframe>");
                        bgiframe = $("#bgDailogIframe");
                    }
                    var dialogHeight = $(this).closest('.ui-dialog').height();
                    var dialogWidth = $(this).closest('.ui-dialog').width();
                    var position = $(this).closest('.ui-dialog').position();
                    bgiframe.css('height', dialogHeight + 8);
                    bgiframe.css('width', dialogWidth + 8);
                    bgiframe.css('top', position.top);
                    bgiframe.css('left', position.left);
                    bgiframe.show();
                }
            },
            close:function () {
                $("#bgDailogIframe").hide();
                if(sFunc){
                    sFunc();
                }
            }
        };
        var defaultConfig = $.extend(true, {}, defaultConfig, config);
        $(htmlElem).html(htmlmsg);
        //alert();
        $(htmlElem).dialog(defaultConfig);
    },
    AlertJsonCode:function(json){
        json=JsonUtility.JsonToStringFormat(json);
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
        this.Alert(window, DialogUtility.DialogAlertId, {width:900,height:600},"<pre class='json-pre'>"+json+"</pre>", null);
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
    Prompt:function(opererWindow,config,dialogId,title,htmlmsg,okFunc){
        alert("DialogUtility.Prompt 已停用");
        var htmlElem = this._CreateDialogElem(opererWindow.document.body,dialogId);
        var paras=null;
        var defaultConfig = {
            height: 200,
            width: 300,
            title:"",
            show:true,
            modal:true,
            buttons:{
                "确认": function () {
                    if(defaultConfig.validatefunc(paras)) {
                        defaultConfig.okfunc(paras);
                        if(defaultConfig.closeafterfunc) {
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
    DialogElem:function (elem,config) {
        $(elem).dialog(config);
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
        $iframeobj[0].contentWindow.FrameWindowId = autodialogid;
        $iframeobj[0].contentWindow.OpenerWindowObj = openerwindow;
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
    CloseDialog:function(dialogId){
        //debugger;
        this._GetElem(dialogId).find("iframe").remove();
        $(this._GetElem(dialogId)).dialog("close");

        try {
            if($("#Forfocus").length>0){
                $("#Forfocus")[0].focus();
            }
        }
        catch(e){

        }
    },
    OpenNewWindow: function (openerwindow, dialogId, url, options, whtype) {
        var width=options.width;
        var height=options.height;
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
                options.height = PageStyleUtility.GetPageHeight()-10;
            }
            else if (whtype == 1) {
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
                options.width = PageStyleUtility.GetPageWidth()-20;
            }
            if(options.height==0) {
                options.height = PageStyleUtility.GetPageHeight()-10;
            }

            defaultoptions = $.extend(true, {}, defaultoptions, options);
            $(dialogEle).dialog(defaultoptions);
            $(".ui-widget-overlay").css("zIndex","1000");
            $(".ui-dialog").css("zIndex","1001");
            var $iframeobj = $(dialogEle).find("iframe");
            $iframeobj[0].contentWindow.FrameWindowId = autodialogid;
            $iframeobj[0].contentWindow.OpenerWindowObj = openerwindow;
            $iframeobj[0].contentWindow.IsOpenForFrame=true;
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
        var wrwin = this.Frame_TryGetFrameWindowObj();
        var openerwin = opererWindow.OpenerWindowObj;
        var autodialogid = opererWindow.FrameWindowId;
        wrwin.DialogUtility._Frame_FramePageCloseDialog(autodialogid);
    }
}

//Ajax处理工具类
var AjaxUtility={
    PostRequestBody:function (_url,sendData,func,dataType) {
        this.Post(_url,sendData,func,dataType,"application/json; charset=utf-8");
    },
    PostSync:function (_url,sendData,func,dataType,contentType) {
        var result=this.Post(_url,sendData,func,dataType,contentType,false);
        return result;
    },
    Post:function (_url,sendData,func,dataType,contentType,isAsync) {
        var url = BaseUtility.BuildAction(_url);
        if (dataType == undefined || dataType == null) {
            dataType = "text";
        }
        if (isAsync == undefined || isAsync == null) {
            isAsync = true;
        }
        if(contentType==undefined||contentType==null){
            contentType="application/x-www-form-urlencoded; charset=UTF-8";
        }
        var innerResult=null;
        $.ajax({
            type: "POST",
            url: url,
            cache: false,
            async:isAsync,
            contentType: contentType,//"application/json; charset=utf-8",*/
            dataType: dataType,
            data: sendData,
            success: function (result) {
                try{
                    if(result!=null&&result.success!=null&&!result.success){
                        if(result.message=="登录Session过期"){
                            DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"Session超时，请重新登陆系统",function () {
                                BaseUtility.RedirectToLogin();
                            });
                        }
                    }
                }
                catch(e) {
                    console.log("AjaxUtility.Post Exception "+url);
                }
                func(result);
                innerResult=result;
            },
            complete: function (msg) {
                //debugger;
            },
            error: function (msg) {
                //debugger;
                try{
                    if(msg.responseText.indexOf("请重新登陆系统")>=0){
                        BaseUtility.RedirectToLogin();
                    }
                    console.log(msg);
                    DialogUtility.Alert(window,"AjaxUtility.Post.Error",{},"Ajax请求发生错误！"+"status:"+msg.status+",responseText:"+msg.responseText,null);
                }catch (e){

                }
            }
        });
        return innerResult;
    },
    GetSync:function (_url,sendData,func,dataType) {
        this.Post(_url,sendData,func,dataType,false);
    },
    Get:function (_url,sendData,func,dataType,isAsync) {
        var url = BaseUtility.BuildUrl(_url);
        if (dataType == undefined || dataType == null) {
            dataType = "text";
        }
        if (isAsync == undefined || isAsync == null) {
            isAsync = true;
        }
        $.ajax({
            type: "GET",
            url: url,
            cache: false,
            async:isAsync,
            contentType: "application/json; charset=utf-8",
            dataType: dataType,
            data: sendData,
            success: function (result) {
                func(result);
            },
            complete: function (msg) {
                //debugger;
            },
            error: function (msg) {
                debugger;
            }
        });
    }
}

//查询处理工具类
var SearchUtility={
    SearchFieldType:{
        IntType:"IntType",
        NumberType:"NumberType",
        DataType:"DateType",
        LikeStringType:"LikeStringType",
        LeftLikeStringType:"LeftLikeStringType",
        RightLikeStringType:"RightLikeStringType",
        StringType:"StringType",
        DataStringType:"DateStringType",
        ArrayLikeStringType:"ArrayLikeStringType"
    },
    SerializationSearchCondition:function (searchCondition) {
        var searchConditionClone=JsonUtility.CloneSimple(searchCondition);
        //debugger;
        for(var key in searchConditionClone){
            if(searchConditionClone[key].type==SearchUtility.SearchFieldType.ArrayLikeStringType){
                if(searchConditionClone[key].value!=null&&searchConditionClone[key].value.length>0) {
                    searchConditionClone[key].value = searchConditionClone[key].value.join(";");
                }
                else{
                    searchConditionClone[key].value="";
                }
            }
        }
        //debugger;
        return JSON.stringify(searchConditionClone);
    }
}

//列表页面处理工具类
var ListPageUtility={
    GetGeneralPageHeight:function (fixHeight) {
        var pageHeight=jQuery(document).height();
        //alert(pageHeight);
        //alert(pageHeight);
        if($("#list-simple-search-wrap").length>0){
            //alert($("#list-button-wrap").height()+"||"+$("#list-simple-search-wrap").outerHeight());
            pageHeight=pageHeight-$("#list-simple-search-wrap").outerHeight()+fixHeight-$("#list-button-wrap").outerHeight()-$("#list-pager-wrap").outerHeight()-30;
        }
        else {
            pageHeight=pageHeight-$("#list-button-wrap").outerHeight()+fixHeight-$("#list-pager-wrap").outerHeight()-30;
        }
        //alert(pageHeight);
        return pageHeight;
    },
    GetFixHeight:function () {
        return -70;
    },
    IViewTableRenderer:{
        ToDateYYYY_MM_DD:function (h,datetime) {
            //debugger;
            var date=new Date(datetime);
            var dateStr=DateUtility.Format(date,'yyyy-MM-dd');
            //var dateStr=datetime.split(" ")[0];
            return h('div',dateStr);
        },
        StringToDateYYYY_MM_DD:function (h,datetime) {
            //debugger;
            //debugger;
            //var date=new Date(datetime);
            //var dateStr=DateUtility.Format(date,'yyyy-MM-dd');
            var dateStr=datetime.split(" ")[0];
            return h('div',dateStr);
        },
        ToStatusEnable:function (h,status) {
            if(status==0){
                return h('div',"禁用");
            }
            else if(status==1){
                return h('div',"启用");
            }
        },
        ToYesNoEnable:function (h,status) {
            if(status==0){
                return h('div',"否");
            }
            else if(status==1){
                return h('div',"是");
            }
        },
        ToDictionaryText:function (h,dictionaryJson,groupValue,dictionaryValue) {
            //debugger;
            var simpleDictionaryJson=DictionaryUtility.GroupValueListJsonToSimpleJson(dictionaryJson);
            if(dictionaryValue==null||dictionaryValue==""){
                return h('div', "");
            }
            if(simpleDictionaryJson[groupValue]!=undefined) {
                if (simpleDictionaryJson[groupValue]) {
                    if(simpleDictionaryJson[groupValue][dictionaryValue]) {
                        return h('div', simpleDictionaryJson[groupValue][dictionaryValue]);
                    }
                    else {
                        return h('div', "找不到装换的TEXT");
                    }
                }
                else {
                    return h('div', "找不到装换的分组");
                }
            }
            else {
                return h('div', "找不到装换的分组");
            }
        }
    },
    IViewTableMareSureSelected:function (selectionRows) {
        if(selectionRows!=null&&selectionRows.length>0) {
            return {
                then:function (func) {
                    func(selectionRows);
                }
            }
        }
        else{
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的行!", null);
            return {
                then:function (func) {
                }
            }
        }
    },
    IViewTableMareSureSelectedOne:function (selectionRows) {
        if(selectionRows!=null&&selectionRows.length>0&&selectionRows.length==1) {
            return {
                then:function (func) {
                    func(selectionRows);
                }
            }
        }
        else{
            DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的行，每次只能选中一行!", null);
            return {
                then:function (func) {
                }
            }
        }
    },
    IViewChangeServerStatus:function (url,selectionRows,idField, statusName,pageAppObj) {
        var idArray=new Array();
        for (var i=0;i<selectionRows.length;i++){
            idArray.push(selectionRows[i][idField]);
        }
        AjaxUtility.Post(url,
            {
                ids: idArray.join(";"),
                status: statusName
            },
            function (result) {
                if (result.success) {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                    });
                    pageAppObj.reloadData();
                }
                else{
                    DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},result.message,null);
                }
            }, "json"
        );
    },
    //上下移动封装
    IViewMoveFace:function (url,selectionRows,idField, type,pageAppObj) {
        this.IViewTableMareSureSelectedOne(selectionRows).then(function (selectionRows) {
            //debugger;
            AjaxUtility.Post(url,
                {
                    recordId: selectionRows[0][idField],
                    type: type
                },
                function (result) {
                    if (result.success) {
                        pageAppObj.reloadData();
                    }
                    else{
                        DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},result.message,null);
                    }
                }, "json"
            );
        });
    },
    //改变状态封装
    IViewChangeServerStatusFace:function (url,selectionRows,idField, statusName,pageAppObj) {
        this.IViewTableMareSureSelected(selectionRows).then(function (selectionRows) {
            ListPageUtility.IViewChangeServerStatus(url,selectionRows,idField,statusName,pageAppObj);
        });
    },
    IViewTableDeleteRow:function (url, recordId,pageAppObj) {
        DialogUtility.Confirm(window, "确认要删除当前记录吗？", function () {
            AjaxUtility.Post(url, {recordId: recordId}, function (result) {
                if (result.success) {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
                        pageAppObj.reloadData();
                    });
                }
                else {
                    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            }, "json");
        });
    },

    IViewTableLoadDataSearch:function (url,pageNum,pageSize,searchCondition,pageAppObj,idField,autoSelectedOldRows,successFunc,loadDict) {
        //var loadDict=false;
        //if(pageNum===1) {
        //    loadDict = true;
        //}
        if(loadDict==undefined||loadDict==null){
            loadDict=false;
        }
        //debugger;
        AjaxUtility.Post(url,
            {
                "pageNum": pageNum,
                "pageSize": pageSize,
                "searchCondition":SearchUtility.SerializationSearchCondition(searchCondition),
                "loadDict":loadDict
            },
            function (result) {
                if (result.success) {
                    if(typeof (successFunc)=="function") {
                        successFunc(result,pageAppObj);
                    }
                    pageAppObj.tableData = new Array();
                    pageAppObj.tableData = result.data.list;
                    pageAppObj.pageTotal = result.data.total;
                    if(autoSelectedOldRows){
                        if(pageAppObj.selectionRows!=null) {
                            for (var i = 0; i < pageAppObj.tableData.length; i++) {
                                for (var j = 0; j < pageAppObj.selectionRows.length;j++) {
                                    if(pageAppObj.selectionRows[j][idField]==pageAppObj.tableData[i][idField]){
                                        pageAppObj.tableData[i]._checked=true;
                                    }
                                }
                            }
                        }
                    }
                }
                else
                {
                    DialogUtility.AlertError(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
                }
            }, "json");
    },
    IViewTableLoadDataNoSearch:function (url,pageNum,pageSize,pageAppObj,idField,autoSelectedOldRows,successFunc) {
        //debugger;
        AjaxUtility.Post(url,
            {
                pageNum: pageNum,
                pageSize: pageSize
            },
            function (result) {
                if (result.success) {
                    pageAppObj.tableData = new Array();
                    pageAppObj.tableData = result.data.list;
                    pageAppObj.pageTotal = result.data.total;
                    if(autoSelectedOldRows){
                        if(pageAppObj.selectionRows!=null) {
                            for (var i = 0; i < pageAppObj.tableData.length; i++) {
                                for (var j = 0; j < pageAppObj.selectionRows.length;j++) {
                                    if(pageAppObj.selectionRows[j][idField]==pageAppObj.tableData[i][idField]){
                                        pageAppObj.tableData[i]._checked=true;
                                    }
                                }
                            }
                        }
                    }
                    if(typeof (successFunc)=="function") {
                        successFunc(result,pageAppObj);
                    }
                }
            }, "json");
    },
    IViewTableInnerButton:{
        ViewButton:function (h, params,idField,pageAppObj) {
            return h('div', {
                class: "list-row-button list-row-button-view",
                on: {
                    click: function () {
                        pageAppObj.view(params.row[idField]);
                    }
                }
            });
        },
        EditButton:function (h, params,idField,pageAppObj) {
            return h('div', {
                class: "list-row-button list-row-button-edit",
                on: {
                    click: function () {
                        pageAppObj.edit(params.row[idField]);
                    }
                }
            });
        },
        DeleteButton:function (h, params,idField,pageAppObj) {
            return h('div', {
                class: "list-row-button list-row-button-del",
                on: {
                    click: function () {
                        //debugger;
                        pageAppObj.del(params.row[idField]);
                    }
                }
            });
        }
    }
}

var DetailPageUtility={
    IViewPageToViewStatus:function () {
        //alert("1");
        return;
        window.setTimeout(function () {
            //alert("1");
            $("input").each(function () {
                $(this).hide();
                var val = $(this).val();
                $(this).after($("<label />").text(val));
            });
            $(".ivu-date-picker-editor").find(".ivu-icon").hide();
            $(".ivu-radio").hide();
            $(".ivu-radio-group-item").hide();
            $(".ivu-radio-wrapper-checked").show();
            $(".ivu-radio-wrapper-checked").find("span").hide();

            $("textarea").each(function () {
                $(this).hide();
                var val = $(this).val();
                $(this).after($("<label />").text(val));
            });
        },100)
    },
    OverrideObjectValue:function (sourceObject, dataObject) {
        //console.log(dataObject);
        for(var key in sourceObject){
            if(dataObject[key]!=undefined&&dataObject[key]!=null&&dataObject[key]!=""){
                sourceObject[key]=dataObject[key];
            }
        }
    },
    BindFormData:function(interfaceUrl,vueFormData,recordId,op,befFunc,afFunc){
        //获取数据并赋值
        AjaxUtility.Post(interfaceUrl,{recordId:recordId,op:op},function (result) {
            if(result.success) {
                if(typeof(befFunc)=="function"){
                    befFunc(result);
                }
                DetailPageUtility.OverrideObjectValue(vueFormData, result.data);
                if(typeof(afFunc)=="function"){
                    afFunc(result);
                }
                if(op=="view") {
                    DetailPageUtility.IViewPageToViewStatus();
                }
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
            }
        },"json");
    },
}

var DictionaryUtility={
    _GroupValueListJsonToSimpleJson:null,
    GroupValueListJsonToSimpleJson:function (sourceDictionaryJson) {
        if(this._GroupValueListJsonToSimpleJson==null) {
            if (sourceDictionaryJson != null) {
                var result = {};
                for (var groupValue in sourceDictionaryJson) {
                    result[groupValue] = {};
                    for (var i = 0; i < sourceDictionaryJson[groupValue].length; i++) {
                        result[groupValue][sourceDictionaryJson[groupValue][i].dictValue] = sourceDictionaryJson[groupValue][i].dictText;
                    }
                }
                this._GroupValueListJsonToSimpleJson=result;
            }
        }
        return this._GroupValueListJsonToSimpleJson;
    }
}

var CacheDataUtility={
    IninClientCache:function () {
        this.GetCurrentUserInfo();
    },
    //用户相关信息
    _CurrentUserInfo:null,
    GetCurrentUserInfo:function () {
        if(this._CurrentUserInfo==null){
            if(window.parent.CacheDataUtility._CurrentUserInfo!=null){
                return window.parent.CacheDataUtility._CurrentUserInfo;
            }
            else{
                AjaxUtility.PostSync("/PlatForm/MyInfo/GetUserInfo",{},function (result) {
                    if(result.success){
                        CacheDataUtility._CurrentUserInfo=result.data;
                    }
                    else{

                    }
                },"json");
                return this._CurrentUserInfo;
            }
        }
        else{
            return this._CurrentUserInfo;
        }
    }
}

var CookieUtility = {
    /**
     * 设置cookie
     * @param name  cookie名称
     * @param value  cookie值
     */
    SetCookie1Day:function(name, value){
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000); //1天
        // 这里一定要加上path。不然到index.jsp页面去清除cookie的时候会出现找不到cookie的问题。
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+";path=/";
    },
    SetCookie1Month:function(name,value){
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000); //1月
        // 这里一定要加上path。不然到index.jsp页面去清除cookie的时候会出现找不到cookie的问题。
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+";path=/";
    },
    SetCookie1Year:function(name,value){
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 365 * 1000); //1年
        // 这里一定要加上path。不然到index.jsp页面去清除cookie的时候会出现找不到cookie的问题。
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+";path=/";
    },
    /**
     * 读取cookies函数
     * @param name
     * @returns
     */
    GetCookie:function(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]); return null;
    },
    /**
     * 删除cookie
     * @param name cookie名称
     */
    DelCookie:function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()+";path=/";
    }
};