"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var console = console || {
  log: function log() {},
  warn: function warn() {},
  error: function error() {}
}; //重写Date方法，解决T16:00:00.000Z问题

function DateExtend_DateFormat(date, fmt) {
  if (null == date || undefined == date) return '';
  var o = {
    "M+": date.getMonth() + 1,
    //月份
    "d+": date.getDate(),
    //日
    "h+": date.getHours(),
    //小时
    "m+": date.getMinutes(),
    //分
    "s+": date.getSeconds(),
    //秒
    "S": date.getMilliseconds() //毫秒

  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }

  return fmt;
}

Date.prototype.toJSON = function () {
  return DateExtend_DateFormat(this, 'yyyy-MM-dd mm:hh:ss');
}; //扩展js对象功能


if (!Object.create) {
  Object.create = function () {
    alert("Extend Object.create");

    function F() {}

    return function (o) {
      if (arguments.length !== 1) {
        throw new Error('Object.create implementation only accepts one parameter.');
      }

      F.prototype = o;
      return new F();
    };
  }();
}

$.fn.outerHTML = function () {
  // IE, Chrome & Safari will comply with the non-standard outerHTML, all others (FF) will have a fall-back for cloning
  return !this.length ? this : this[0].outerHTML || function (el) {
    var div = document.createElement('div');
    div.appendChild(el.cloneNode(true));
    var contents = div.innerHTML;
    div = null;
    alert(contents);
    return contents;
  }(this[0]);
}; //浏览下信息类


var BrowserInfoUtility = {
  BrowserAppName: function BrowserAppName() {
    if (navigator.userAgent.indexOf("Firefox") > 0) {
      return "Firefox";
    } else if (navigator.userAgent.indexOf("MSIE") > 0) {
      return "IE";
    } else if (navigator.userAgent.indexOf("Chrome") > 0) {
      return "Chrome";
    }
  },
  IsIE: function IsIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window) return true;else return false;
  },
  IsIE6: function IsIE6() {
    return navigator.userAgent.indexOf("MSIE 6.0") > 0;
  },
  IsIE7: function IsIE7() {
    return navigator.userAgent.indexOf("MSIE 7.0") > 0;
  },
  IsIE8: function IsIE8() {
    return navigator.userAgent.indexOf("MSIE 8.0") > 0;
  },
  IsIE8X64: function IsIE8X64() {
    if (navigator.userAgent.indexOf("MSIE 8.0") > 0) {
      return navigator.userAgent.indexOf("x64") > 0;
    }

    return false;
  },
  IsIE9: function IsIE9() {
    return navigator.userAgent.indexOf("MSIE 9.0") > 0;
  },
  IsIE9X64: function IsIE9X64() {
    if (navigator.userAgent.indexOf("MSIE 9.0") > 0) {
      return navigator.userAgent.indexOf("x64") > 0;
    }

    return false;
  },
  IsIE10: function IsIE10() {
    return navigator.userAgent.indexOf("MSIE 10.0") > 0;
  },
  IsIE10X64: function IsIE10X64() {
    if (navigator.userAgent.indexOf("MSIE 10.0") > 0) {
      return navigator.userAgent.indexOf("x64") > 0;
    }

    return false;
  },
  IEDocumentMode: function IEDocumentMode() {
    return document.documentMode;
  },
  IsIE8DocumentMode: function IsIE8DocumentMode() {
    return this.IEDocumentMode() == 8;
  },
  IsFirefox: function IsFirefox() {
    return this.BrowserAppName() == "Firefox";
  },
  IsChrome: function IsChrome() {
    return this.BrowserAppName() == "Chrome";
  }
}; //字符串操作类

var StringUtility = {
  GetTimeStampUrl: function GetTimeStampUrl(url) {
    alert("迁移到BaseUtility.AppendTimeStampUrl");
  },
  GetAllQueryString: function GetAllQueryString() {
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
  QueryString: function QueryString(fieldName) {
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
  QueryStringUrlString: function QueryStringUrlString(fieldName, urlString) {
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
  XMLEncode: function XMLEncode(str) {
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
  XMLDeCode: function XMLDeCode(str) {
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
  HTMLEncode: function HTMLEncode(str) {
    alert("StringUtility.HTMLEncode 已停用");
    /*var temp = $("<div />");
    temp.text(str);
    return temp.html();*/
  },
  HTMLDecode: function HTMLDecode(str) {
    alert("StringUtility.HTMLDecode 已停用");
    /*var temp = $("<div />");
    temp.html(str);
    return temp.text();*/
  },
  Format: function Format() {
    alert("StringUtility.HTMLDecode 已停用");
    /*if (arguments.length == 0) return null;
    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;*/
  },
  GuidNotSplit: function GuidNotSplit() {
    alert("StringUtility.GuidNotSplit 已停用");
  },
  GuidSplit: function GuidSplit(split) {
    var guid = "";

    for (var i = 1; i <= 32; i++) {
      guid += Math.floor(Math.random() * 16.0).toString(16);
      if (i == 8 || i == 12 || i == 16 || i == 20) guid += split;
    }

    return guid;
  },
  Guid: function Guid() {
    return this.GuidSplit("-");
  },
  RTimestamp: function RTimestamp() {
    alert("迁移到StringUtility.Timestamp");
    /*var getTimestamp = new Date().getTime();
    //var n = Math.floor(Math.random() * 100.0).toString(5);
    return getTimestamp.toString().substr(4, 9);*/
  },
  Timestamp: function Timestamp() {
    var timestamp = new Date().getTime();
    return timestamp.toString().substr(4, 10);
  },
  Trim: function Trim(str) {
    return str.replace(/(^[　\s]*)|([　\s]*$)/g, "");
  },
  LTrim: function LTrim(str) {
    alert("StringUtility.LTrim 已停用"); //return str.replace(/(^[　\s]*)/g, "");
  },
  RTrim: function RTrim(str) {
    alert("StringUtility.RTrim 已停用"); //return str.replace(/([　\s]*$)/g, "");
  },
  TrimLastChar: function TrimLastChar(str) {
    alert("迁移到StringUtility.RemoveLastChar");
    return str.substring(0, str.length - 1);
  },
  RemoveLastChar: function RemoveLastChar(str) {
    return str.substring(0, str.length - 1);
  },
  StringToJson: function StringToJson(str) {
    alert("迁移到JsonUtility.StringToJson"); //return eval("(" + str + ")");
  },
  Level1JsonToString: function Level1JsonToString(jsonObj) {
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
  Level1JsonToStringKeyString: function Level1JsonToStringKeyString(jsonObj) {
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
  Level1JsonToStringValueEncode: function Level1JsonToStringValueEncode(jsonObj) {
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
  Level1StringToJsonValueDecode: function Level1StringToJsonValueDecode(str) {
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
  GetBrithdayByIdCard: function GetBrithdayByIdCard(str) {
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
  GetSexByIdCard: function GetSexByIdCard(str) {
    alert("StringUtility.GetSexByIdCard 已停用");
    /*if (parseInt(str.substr(16, 1)) % 2 == 1) {
        return "男性";
    } else {
        return "女性";
    }*/
  },
  IsNullOrEmpty: function IsNullOrEmpty(obj) {
    return obj == undefined || obj == "" || obj == null || obj == "undefined" || obj == "null";
  },
  IsNullOrEmptyObject: function IsNullOrEmptyObject(obj) {
    alert("StringUtility.IsNullOrEmptyObject 已停用"); //return obj == undefined || obj == null
  },
  GetFuntionName: function GetFuntionName(func) {
    if (typeof func == "function" || _typeof(func) == "object") var fName = ("" + func).match(/function\s*([\w\$]*)\s*\(/);
    if (fName !== null) return fName[1];
  },
  ToLowerCase: function ToLowerCase(str) {
    return str.toLowerCase();
  },
  toUpperCase: function toUpperCase(str) {
    return str.toUpperCase();
  },
  Padding: function Padding(num, length) {
    alert("StringUtility.Padding 已停用");
    /*var len = (num + "").length;
    var diff = length - len;
    if(diff > 0) {
        return Array(diff).join("0") + num;
    }
    return num;*/
  }
}; //日期时间工具类

var DateUtility = {
  GetCurrentDataString: function GetCurrentDataString(split) {
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
  DateFormat: function DateFormat(myDate, split) {
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
  Format: function Format(myDate, formatString) {
    var o = {
      "M+": myDate.getMonth() + 1,
      //month
      "d+": myDate.getDate(),
      //day
      "h+": myDate.getHours(),
      //hour
      "m+": myDate.getMinutes(),
      //minute
      "s+": myDate.getSeconds(),
      //second
      "q+": Math.floor((myDate.getMonth() + 3) / 3),
      //quarter
      "S": myDate.getMilliseconds() //millisecond

    };
    if (/(y+)/.test(formatString)) formatString = formatString.replace(RegExp.$1, (myDate.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(formatString)) formatString = formatString.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }

    return formatString;
  },
  FormatCurrentData: function FormatCurrentData(formatString) {
    var myDate = new Date();
    return this.Format(myDate, formatString);
  },
  GetCurrentData: function GetCurrentData() {
    return new Date();
  }
}; //Json操作工具类

var JsonUtility = {
  ParseArrayJsonToTreeJson: function ParseArrayJsonToTreeJson(config, sourceArray, rootId) {
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
  ResolveSimpleArrayJsonToTreeJson: function ResolveSimpleArrayJsonToTreeJson(config, sourceJson, rootNodeId) {
    alert("JsonUtility.ResolveSimpleArrayJsonToTreeJson 已停用");
  },
  SimpleCloneAttr: function SimpleCloneAttr(toObj, fromObj) {
    for (var attr in fromObj) {
      toObj[attr] = fromObj[attr];
    }

    return toObj;
  },
  CloneSimple: function CloneSimple(source) {
    var newJson = jQuery.extend(true, {}, source);
    return newJson;
  },
  JsonToString: function JsonToString(obj) {
    return JSON.stringify(obj);
  },
  JsonToStringFormat: function JsonToStringFormat(obj) {
    return JSON.stringify(obj, null, 2);
  },
  StringToJson: function StringToJson(str) {
    return eval("(" + str + ")");
  }
}; //页面样式辅助功能类

var PageStyleUtility = {
  GetPageHeight: function GetPageHeight() {
    return jQuery(window.document).height();
  },
  GetPageWidth: function GetPageWidth() {
    return jQuery(window.document).width();
  },
  GetWindowHeight: function GetWindowHeight() {
    return $(window).height();
  },
  GetWindowWidth: function GetWindowWidth() {
    return $(window).width();
  },
  GetListButtonOuterHeight: function GetListButtonOuterHeight() {
    alert("PageStyleUtility.GetListButtonOuterHeight 已停用");
    return jQuery(".list-button-outer-c").outerHeight();
  }
}; //XML处理工具类

var XMLUtility = {}; //对话框工具类

var DialogUtility = {
  DialogAlertId: "DefaultDialogAlertUtility01",
  DialogPromptId: "DefaultDialogPromptUtility01",
  DialogId: "DefaultDialogUtility01",
  DialogId02: "DefaultDialogUtility02",
  DialogId03: "DefaultDialogUtility03",
  DialogId04: "DefaultDialogUtility04",
  DialogId05: "DefaultDialogUtility05",
  _GetElem: function _GetElem(dialogId) {
    return $("#" + dialogId);
  },
  _CreateDialogElem: function _CreateDialogElem(docobj, dialogId) {
    if (this._GetElem(dialogId).length == 0) {
      var dialogEle = $("<div id=" + dialogId + " title='系统提示' style='display:none'>\
                    </div>");
      $(docobj.body).append(dialogEle);
      return dialogEle;
    } else {
      return this._GetElem(dialogId);
    }
  },
  _CreateAlertLoadingMsgElement: function _CreateAlertLoadingMsgElement(docobj, dialogId) {
    if (this._GetElem(dialogId).length == 0) {
      var dialogEle = $("<div id=" + dialogId + " title='系统提示' style='display:none'>\
                               <div class='alertloading-img'></div>\
                               <div class='alertloading-txt'></div>\
                           </div>");
      $(docobj.body).append(dialogEle);
      return dialogEle;
    } else {
      return this._GetElem(dialogId);
    }
  },
  _CreateIfrmaeDialogElement: function _CreateIfrmaeDialogElement(docobj, dialogid, url) {
    var dialogEle = $("<div id=" + dialogid + " title='Basic dialog' style='display:none'>\
                        <iframe width='100%' height='98%' frameborder='0' src='" + url + "'>\
                        </iframe>\
                    </div>");
    $(docobj.body).append(dialogEle);
    return dialogEle;
  },
  _TestDialogElemIsExist: function _TestDialogElemIsExist(dialogId) {
    if (this._GetElem(dialogId).length > 0) {
      return true;
    }

    return false;
  },
  _TestRunEnable: function _TestRunEnable() {
    return true;
  },
  AlertError: function AlertError(opererWindow, dialogId, config, htmlmsg, sFunc) {
    var defaultConfig = {
      height: 400,
      width: 600
    };
    defaultConfig = $.extend(true, {}, defaultConfig, config);
    this.Alert(opererWindow, dialogId, defaultConfig, htmlmsg, sFunc);
  },
  AlertText: function AlertText(text) {
    DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, text, null);
  },
  Alert: function Alert(opererWindow, dialogId, config, htmlmsg, sFunc) {
    //debugger;
    var htmlElem = this._CreateDialogElem(opererWindow.document.body, dialogId);

    var defaultConfig = {
      height: 200,
      width: 300,
      title: "系统提示",
      show: true,
      modal: true,
      buttons: {
        "关闭": function _() {
          $(htmlElem).dialog("close");
        }
      },
      open: function open() {},
      close: function close() {
        if (sFunc) {
          sFunc();
        }
      }
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).html(htmlmsg);
    $(htmlElem).dialog(defaultConfig);
  },
  AlertJsonCode: function AlertJsonCode(json) {
    json = JsonUtility.JsonToStringFormat(json);
    json = json.replace(/&/g, '&').replace(/</g, '<').replace(/>/g, '>');
    json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
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
    this.Alert(window, DialogUtility.DialogAlertId, {
      width: 900,
      height: 600
    }, "<pre class='json-pre'>" + json + "</pre>", null);
  },
  ShowHTML: function ShowHTML(opererWindow, dialogId, config, htmlmsg, close_after_event, params) {
    var htmlElem = this._CreateDialogElem(opererWindow.document.body, dialogId);

    var defaultConfig = {
      height: 200,
      width: 300,
      title: "系统提示",
      show: true,
      modal: true,
      close: function close(event, ui) {
        try {
          if (typeof close_after_event == "function") {
            close_after_event(params);
          }
        } catch (e) {}
      }
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).html(htmlmsg);
    return $(htmlElem).dialog(defaultConfig);
  },
  AlertLoading: function AlertLoading(opererWindow, dialogId, config, htmlmsg) {
    var htmlElem = this._CreateAlertLoadingMsgElement(opererWindow.document.body, dialogId);

    var defaultConfig = {
      height: 200,
      width: 300,
      title: "",
      show: true,
      modal: true
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).find(".alertloading-txt").html(htmlmsg);
    $(htmlElem).dialog(defaultConfig);
  },
  Confirm: function Confirm(opererWindow, htmlmsg, okFn) {
    this.ConfirmConfig(opererWindow, htmlmsg, null, okFn);
  },
  ConfirmConfig: function ConfirmConfig(opererWindow, htmlmsg, config, okFn) {
    var htmlElem = this._CreateDialogElem(opererWindow.document.body, "AlertConfirmMsg");

    var paras = null;
    var defaultConfig = {
      okfunc: function okfunc(paras) {
        if (okFn != undefined) {
          return okFn();
        } else {
          opererWindow.close();
        }
      },
      cancelfunc: function cancelfunc(paras) {},
      validatefunc: function validatefunc(paras) {
        return true;
      },
      closeafterfunc: true,
      height: 200,
      width: 300,
      title: "系统提示",
      show: true,
      modal: true,
      buttons: {
        "确认": function _() {
          if (defaultConfig.validatefunc(paras)) {
            var r = defaultConfig.okfunc(paras);
            r = r == null ? true : r;

            if (r && defaultConfig.closeafterfunc) {
              $(htmlElem).dialog("close");
            }
          }
        },
        "取消": function _() {
          defaultConfig.cancelfunc(paras);

          if (defaultConfig.closeafterfunc) {
            $(htmlElem).dialog("close");
          }
        }
      }
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(htmlElem).html(htmlmsg);
    $(htmlElem).dialog(defaultConfig);
    paras = {
      "ElementObj": htmlElem
    };
  },
  Prompt: function Prompt(opererWindow, config, dialogId, labelMsg, okFunc) {
    var htmlElem = this._CreateDialogElem(opererWindow.document.body, dialogId);

    var paras = null;
    var textArea = $("<textarea />");
    var defaultConfig = {
      height: 200,
      width: 300,
      title: "",
      show: true,
      modal: true,
      buttons: {
        "确认": function _() {
          //debugger;
          if (typeof okFunc == "function") {
            var inputText = textArea.val();
            okFunc(inputText);
          }

          $(htmlElem).dialog("close");
        },
        "取消": function _() {
          $(htmlElem).dialog("close");
        }
      }
    };
    var defaultConfig = $.extend(true, {}, defaultConfig, config);
    $(textArea).css("height", defaultConfig.height - 130);
    var htmlContent = $("<div>" + labelMsg + "：</div>").append(textArea);
    $(htmlElem).html(htmlContent);
    $(htmlElem).dialog(defaultConfig); //dialog.textAreaObj=textArea;
  },
  DialogElem: function DialogElem(elem, config) {
    $(elem).dialog(config);
  },
  OpenIframeWindow: function OpenIframeWindow(openerwindow, dialogId, url, options, whtype) {
    var defaultoptions = {
      height: 410,
      width: 600,
      close: function close(event, ui) {
        var autodialogid = $(this).attr("id");
        $(this).find("iframe").remove();
        $(this).dialog('close');
        $(this).dialog("destroy");
        $("#" + autodialogid).remove();

        if (BrowserInfoUtility.IsIE8DocumentMode()) {
          CollectGarbage();
        }

        if (typeof options.close_after_event == "function") {
          options.close_after_event();
        }

        try {
          if ($("#Forfocus").length > 0) {
            $("#Forfocus")[0].focus();
          }
        } catch (e) {}
      }
    }; //debugger;

    if (whtype == 1) {
      defaultoptions = $.extend(true, {}, defaultoptions, {
        height: 680,
        width: 980
      });
    } else if (whtype == 2) {
      defaultoptions = $.extend(true, {}, defaultoptions, {
        height: 600,
        width: 800
      });
    } else if (whtype == 4) {
      defaultoptions = $.extend(true, {}, defaultoptions, {
        height: 380,
        width: 480
      });
    } else if (whtype == 5) {
      defaultoptions = $.extend(true, {}, defaultoptions, {
        height: 180,
        width: 300
      });
    } //如果宽度，高度设置为0，则自动设置为全屏


    if (options.width == 0) {
      options.width = PageStyleUtil.GetPageWidth() - 20;
    }

    if (options.height == 0) {
      options.height = PageStyleUtil.GetPageHeight() - 10;
    }

    defaultoptions = $.extend(true, {}, defaultoptions, options);
    var autodialogid = dialogId;

    var dialogEle = this._CreateIfrmaeDialogElement(openerwindow.document, autodialogid, url);

    var dialogObj = $(dialogEle).dialog(defaultoptions);
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
  CloseOpenIframeWindow: function CloseOpenIframeWindow(openerwindow, dialogId) {
    //alert(dialogId);
    openerwindow.OpenerWindowObj.DialogUtility.CloseDialog(dialogId);
  },
  CloseDialog: function CloseDialog(dialogId) {
    //debugger;
    this._GetElem(dialogId).find("iframe").remove();

    $(this._GetElem(dialogId)).dialog("close");

    try {
      if ($("#Forfocus").length > 0) {
        $("#Forfocus")[0].focus();
      }
    } catch (e) {}
  },
  OpenNewWindow: function OpenNewWindow(openerwindow, dialogId, url, options, whtype) {
    var width = options.width;
    var height = options.height;
    var left = parseInt((screen.availWidth - width) / 2).toString();
    var top = parseInt((screen.availHeight - height) / 2).toString();

    if (width.toString() == "0" && height.toString() == "0") {
      width = window.screen.availWidth - 30;
      height = window.screen.availHeight - 60;
      left = "0";
      top = "0";
    }

    var winHandle = window.open(url, "", "scrollbars=no,toolbar=no,menubar=no,resizable=yes,center=yes,help=no, status=yes,top= " + top + "px,left=" + left + "px,width=" + width + "px,height=" + height + "px");

    if (winHandle == null) {
      alert("请解除浏览器对本系统弹出窗口的阻止设置！");
    }
  },
  _TryGetParentWindow: function _TryGetParentWindow(win) {
    if (win.parent != null) {
      return win.parent;
    }

    return null;
  },
  _Frame_TryGetFrameWindowObj: function _Frame_TryGetFrameWindowObj(win, tryfindtime, currenttryfindtime) {
    if (tryfindtime > currenttryfindtime) {
      //var document = win;
      var istopFramepage = false;
      currenttryfindtime++;

      try {
        istopFramepage = win.IsTopFramePage;

        if (istopFramepage) {
          return win;
        } else {
          return this._Frame_TryGetFrameWindowObj(this._TryGetParentWindow(win), tryfindtime, currenttryfindtime);
        }
      } catch (e) {
        return this._Frame_TryGetFrameWindowObj(this._TryGetParentWindow(win), tryfindtime, currenttryfindtime);
      }
    }

    return null;
  },
  _OpenWindowInFramePage: function _OpenWindowInFramePage(openerwindow, dialogId, url, options, whtype) {
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
        modal: true,
        title: "系统",
        close: function close(event, ui) {
          var autodialogid = $(this).attr("id");
          $(this).find("iframe").remove();
          $(this).dialog('close');
          $(this).dialog("destroy");
          $("#" + autodialogid).remove();

          if (BrowserInfoUtility.IsIE8DocumentMode()) {
            CollectGarbage();
          }

          if (typeof options.close_after_event == "function") {
            options.close_after_event();
          }
        }
      };

      if (whtype == 0) {
        options.width = PageStyleUtility.GetPageWidth() - 20;
        options.height = PageStyleUtility.GetPageHeight() - 10;
      } else if (whtype == 1) {
        defaultoptions = $.extend(true, {}, defaultoptions, {
          height: 680,
          width: 980
        });
      } else if (whtype == 2) {
        defaultoptions = $.extend(true, {}, defaultoptions, {
          height: 600,
          width: 800
        });
      } else if (whtype == 4) {
        defaultoptions = $.extend(true, {}, defaultoptions, {
          height: 380,
          width: 480
        });
      } else if (whtype == 5) {
        defaultoptions = $.extend(true, {}, defaultoptions, {
          height: 180,
          width: 300
        });
      } //如果宽度，高度设置为0，则自动设置为全屏


      if (options.width == 0) {
        options.width = PageStyleUtility.GetPageWidth() - 20;
      }

      if (options.height == 0) {
        options.height = PageStyleUtility.GetPageHeight() - 10;
      }

      defaultoptions = $.extend(true, {}, defaultoptions, options);
      $(dialogEle).dialog(defaultoptions);
      $(".ui-widget-overlay").css("zIndex", "1000");
      $(".ui-dialog").css("zIndex", "1001");
      var $iframeobj = $(dialogEle).find("iframe");
      $iframeobj[0].contentWindow.FrameWindowId = autodialogid;
      $iframeobj[0].contentWindow.OpenerWindowObj = openerwindow;
      $iframeobj[0].contentWindow.IsOpenForFrame = true;
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
    } else {
      $("#" + autodialogid).dialog("moveToTop");
    }
  },
  _Frame_FramePageCloseDialog: function _Frame_FramePageCloseDialog(dialogid) {
    $("#" + dialogid).dialog("close");
  },
  Frame_TryGetFrameWindowObj: function Frame_TryGetFrameWindowObj() {
    var tryfindtime = 5;
    var currenttryfindtime = 1;
    return this._Frame_TryGetFrameWindowObj(window, tryfindtime, currenttryfindtime);
  },
  Frame_Alert: function Frame_Alert() {},
  Frame_Comfirm: function Frame_Comfirm() {},
  Frame_OpenIframeWindow: function Frame_OpenIframeWindow(openerwindow, dialogId, url, options, whtype) {
    var wrwin = this.Frame_TryGetFrameWindowObj();
    this.FramePageRef = wrwin;

    if (wrwin != null) {
      //alert("show");
      this.FramePageRef.DialogUtility.FramePageRef = wrwin;

      this.FramePageRef.DialogUtility._OpenWindowInFramePage(openerwindow, dialogId, url, options, whtype);
    } else {
      alert("找不到FramePage!!");
    }
  },
  Frame_CloseDialog: function Frame_CloseDialog(opererWindow) {
    var wrwin = this.Frame_TryGetFrameWindowObj();
    var openerwin = opererWindow.OpenerWindowObj;
    var autodialogid = opererWindow.FrameWindowId;

    wrwin.DialogUtility._Frame_FramePageCloseDialog(autodialogid);
  } //Ajax处理工具类

};
var AjaxUtility = {
  PostRequestBody: function PostRequestBody(_url, sendData, func, dataType) {
    this.Post(_url, sendData, func, dataType, "application/json; charset=utf-8");
  },
  PostSync: function PostSync(_url, sendData, func, dataType, contentType) {
    var result = this.Post(_url, sendData, func, dataType, contentType, false);
    return result;
  },
  Post: function Post(_url, sendData, func, dataType, contentType, isAsync) {
    var url = BaseUtility.BuildAction(_url);

    if (dataType == undefined || dataType == null) {
      dataType = "text";
    }

    if (isAsync == undefined || isAsync == null) {
      isAsync = true;
    }

    if (contentType == undefined || contentType == null) {
      contentType = "application/x-www-form-urlencoded; charset=UTF-8";
    }

    var innerResult = null;
    $.ajax({
      type: "POST",
      url: url,
      cache: false,
      async: isAsync,
      contentType: contentType,
      //"application/json; charset=utf-8",*/
      dataType: dataType,
      data: sendData,
      success: function success(result) {
        try {
          if (result != null && result.success != null && !result.success) {
            if (result.message == "登录Session过期") {
              DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "Session超时，请重新登陆系统", function () {
                BaseUtility.RedirectToLogin();
              });
            }
          }
        } catch (e) {
          console.log("AjaxUtility.Post Exception " + url);
        }

        func(result);
        innerResult = result;
      },
      complete: function complete(msg) {//debugger;
      },
      error: function error(msg) {
        //debugger;
        try {
          if (msg.responseText.indexOf("请重新登陆系统") >= 0) {
            BaseUtility.RedirectToLogin();
          }

          console.log(msg);
          DialogUtility.Alert(window, "AjaxUtility.Post.Error", {}, "Ajax请求发生错误！" + "status:" + msg.status + ",responseText:" + msg.responseText, null);
        } catch (e) {}
      }
    });
    return innerResult;
  },
  GetSync: function GetSync(_url, sendData, func, dataType) {
    this.Post(_url, sendData, func, dataType, false);
  },
  Get: function Get(_url, sendData, func, dataType, isAsync) {
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
      async: isAsync,
      contentType: "application/json; charset=utf-8",
      dataType: dataType,
      data: sendData,
      success: function success(result) {
        func(result);
      },
      complete: function complete(msg) {//debugger;
      },
      error: function error(msg) {
        debugger;
      }
    });
  } //查询处理工具类

};
var SearchUtility = {
  SearchFieldType: {
    IntType: "IntType",
    NumberType: "NumberType",
    DataType: "DateType",
    LikeStringType: "LikeStringType",
    LeftLikeStringType: "LeftLikeStringType",
    RightLikeStringType: "RightLikeStringType",
    StringType: "StringType",
    DataStringType: "DateStringType",
    ArrayLikeStringType: "ArrayLikeStringType"
  },
  SerializationSearchCondition: function SerializationSearchCondition(searchCondition) {
    var searchConditionClone = JsonUtility.CloneSimple(searchCondition); //debugger;

    for (var key in searchConditionClone) {
      if (searchConditionClone[key].type == SearchUtility.SearchFieldType.ArrayLikeStringType) {
        if (searchConditionClone[key].value != null && searchConditionClone[key].value.length > 0) {
          searchConditionClone[key].value = searchConditionClone[key].value.join(";");
        } else {
          searchConditionClone[key].value = "";
        }
      }
    } //debugger;


    return JSON.stringify(searchConditionClone);
  } //列表页面处理工具类

};
var ListPageUtility = {
  GetGeneralPageHeight: function GetGeneralPageHeight(fixHeight) {
    var pageHeight = jQuery(document).height(); //alert(pageHeight);
    //alert(pageHeight);

    if ($("#list-simple-search-wrap").length > 0) {
      //alert($("#list-button-wrap").height()+"||"+$("#list-simple-search-wrap").outerHeight());
      pageHeight = pageHeight - $("#list-simple-search-wrap").outerHeight() + fixHeight - $("#list-button-wrap").outerHeight() - $("#list-pager-wrap").outerHeight() - 30;
    } else {
      pageHeight = pageHeight - $("#list-button-wrap").outerHeight() + fixHeight - $("#list-pager-wrap").outerHeight() - 30;
    } //alert(pageHeight);


    return pageHeight;
  },
  GetFixHeight: function GetFixHeight() {
    return -70;
  },
  IViewTableRenderer: {
    ToDateYYYY_MM_DD: function ToDateYYYY_MM_DD(h, datetime) {
      //debugger;
      var date = new Date(datetime);
      var dateStr = DateUtility.Format(date, 'yyyy-MM-dd'); //var dateStr=datetime.split(" ")[0];

      return h('div', dateStr);
    },
    StringToDateYYYY_MM_DD: function StringToDateYYYY_MM_DD(h, datetime) {
      //debugger;
      //debugger;
      //var date=new Date(datetime);
      //var dateStr=DateUtility.Format(date,'yyyy-MM-dd');
      var dateStr = datetime.split(" ")[0];
      return h('div', dateStr);
    },
    ToStatusEnable: function ToStatusEnable(h, status) {
      if (status == 0) {
        return h('div', "禁用");
      } else if (status == 1) {
        return h('div', "启用");
      }
    },
    ToYesNoEnable: function ToYesNoEnable(h, status) {
      if (status == 0) {
        return h('div', "否");
      } else if (status == 1) {
        return h('div', "是");
      }
    },
    ToDictionaryText: function ToDictionaryText(h, dictionaryJson, groupValue, dictionaryValue) {
      //debugger;
      var simpleDictionaryJson = DictionaryUtility.GroupValueListJsonToSimpleJson(dictionaryJson);

      if (dictionaryValue == null || dictionaryValue == "") {
        return h('div', "");
      }

      if (simpleDictionaryJson[groupValue] != undefined) {
        if (simpleDictionaryJson[groupValue]) {
          if (simpleDictionaryJson[groupValue][dictionaryValue]) {
            return h('div', simpleDictionaryJson[groupValue][dictionaryValue]);
          } else {
            return h('div', "找不到装换的TEXT");
          }
        } else {
          return h('div', "找不到装换的分组");
        }
      } else {
        return h('div', "找不到装换的分组");
      }
    }
  },
  IViewTableMareSureSelected: function IViewTableMareSureSelected(selectionRows) {
    if (selectionRows != null && selectionRows.length > 0) {
      return {
        then: function then(func) {
          func(selectionRows);
        }
      };
    } else {
      DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的行!", null);
      return {
        then: function then(func) {}
      };
    }
  },
  IViewTableMareSureSelectedOne: function IViewTableMareSureSelectedOne(selectionRows) {
    if (selectionRows != null && selectionRows.length > 0 && selectionRows.length == 1) {
      return {
        then: function then(func) {
          func(selectionRows);
        }
      };
    } else {
      DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, "请选中需要操作的行，每次只能选中一行!", null);
      return {
        then: function then(func) {}
      };
    }
  },
  IViewChangeServerStatus: function IViewChangeServerStatus(url, selectionRows, idField, statusName, pageAppObj) {
    var idArray = new Array();

    for (var i = 0; i < selectionRows.length; i++) {
      idArray.push(selectionRows[i][idField]);
    }

    AjaxUtility.Post(url, {
      ids: idArray.join(";"),
      status: statusName
    }, function (result) {
      if (result.success) {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
        pageAppObj.reloadData();
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
      }
    }, "json");
  },
  //上下移动封装
  IViewMoveFace: function IViewMoveFace(url, selectionRows, idField, type, pageAppObj) {
    this.IViewTableMareSureSelectedOne(selectionRows).then(function (selectionRows) {
      //debugger;
      AjaxUtility.Post(url, {
        recordId: selectionRows[0][idField],
        type: type
      }, function (result) {
        if (result.success) {
          pageAppObj.reloadData();
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
        }
      }, "json");
    });
  },
  //改变状态封装
  IViewChangeServerStatusFace: function IViewChangeServerStatusFace(url, selectionRows, idField, statusName, pageAppObj) {
    this.IViewTableMareSureSelected(selectionRows).then(function (selectionRows) {
      ListPageUtility.IViewChangeServerStatus(url, selectionRows, idField, statusName, pageAppObj);
    });
  },
  IViewTableDeleteRow: function IViewTableDeleteRow(url, recordId, pageAppObj) {
    DialogUtility.Confirm(window, "确认要删除当前记录吗？", function () {
      AjaxUtility.Post(url, {
        recordId: recordId
      }, function (result) {
        if (result.success) {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {
            pageAppObj.reloadData();
          });
        } else {
          DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
        }
      }, "json");
    });
  },
  IViewTableLoadDataSearch: function IViewTableLoadDataSearch(url, pageNum, pageSize, searchCondition, pageAppObj, idField, autoSelectedOldRows, successFunc, loadDict) {
    //var loadDict=false;
    //if(pageNum===1) {
    //    loadDict = true;
    //}
    if (loadDict == undefined || loadDict == null) {
      loadDict = false;
    } //debugger;


    AjaxUtility.Post(url, {
      "pageNum": pageNum,
      "pageSize": pageSize,
      "searchCondition": SearchUtility.SerializationSearchCondition(searchCondition),
      "loadDict": loadDict
    }, function (result) {
      if (result.success) {
        if (typeof successFunc == "function") {
          successFunc(result, pageAppObj);
        }

        pageAppObj.tableData = new Array();
        pageAppObj.tableData = result.data.list;
        pageAppObj.pageTotal = result.data.total;

        if (autoSelectedOldRows) {
          if (pageAppObj.selectionRows != null) {
            for (var i = 0; i < pageAppObj.tableData.length; i++) {
              for (var j = 0; j < pageAppObj.selectionRows.length; j++) {
                if (pageAppObj.selectionRows[j][idField] == pageAppObj.tableData[i][idField]) {
                  pageAppObj.tableData[i]._checked = true;
                }
              }
            }
          }
        }
      } else {
        DialogUtility.AlertError(window, DialogUtility.DialogAlertId, {}, result.message, function () {});
      }
    }, "json");
  },
  IViewTableLoadDataNoSearch: function IViewTableLoadDataNoSearch(url, pageNum, pageSize, pageAppObj, idField, autoSelectedOldRows, successFunc) {
    //debugger;
    AjaxUtility.Post(url, {
      pageNum: pageNum,
      pageSize: pageSize
    }, function (result) {
      if (result.success) {
        pageAppObj.tableData = new Array();
        pageAppObj.tableData = result.data.list;
        pageAppObj.pageTotal = result.data.total;

        if (autoSelectedOldRows) {
          if (pageAppObj.selectionRows != null) {
            for (var i = 0; i < pageAppObj.tableData.length; i++) {
              for (var j = 0; j < pageAppObj.selectionRows.length; j++) {
                if (pageAppObj.selectionRows[j][idField] == pageAppObj.tableData[i][idField]) {
                  pageAppObj.tableData[i]._checked = true;
                }
              }
            }
          }
        }

        if (typeof successFunc == "function") {
          successFunc(result, pageAppObj);
        }
      }
    }, "json");
  },
  IViewTableInnerButton: {
    ViewButton: function ViewButton(h, params, idField, pageAppObj) {
      return h('div', {
        class: "list-row-button list-row-button-view",
        on: {
          click: function click() {
            pageAppObj.view(params.row[idField]);
          }
        }
      });
    },
    EditButton: function EditButton(h, params, idField, pageAppObj) {
      return h('div', {
        class: "list-row-button list-row-button-edit",
        on: {
          click: function click() {
            pageAppObj.edit(params.row[idField]);
          }
        }
      });
    },
    DeleteButton: function DeleteButton(h, params, idField, pageAppObj) {
      return h('div', {
        class: "list-row-button list-row-button-del",
        on: {
          click: function click() {
            //debugger;
            pageAppObj.del(params.row[idField]);
          }
        }
      });
    }
  }
};
var DetailPageUtility = {
  IViewPageToViewStatus: function IViewPageToViewStatus() {
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
    }, 100);
  },
  OverrideObjectValue: function OverrideObjectValue(sourceObject, dataObject) {
    //console.log(dataObject);
    for (var key in sourceObject) {
      if (dataObject[key] != undefined && dataObject[key] != null && dataObject[key] != "") {
        sourceObject[key] = dataObject[key];
      }
    }
  },
  BindFormData: function BindFormData(interfaceUrl, vueFormData, recordId, op, befFunc, afFunc) {
    //获取数据并赋值
    AjaxUtility.Post(interfaceUrl, {
      recordId: recordId,
      op: op
    }, function (result) {
      if (result.success) {
        if (typeof befFunc == "function") {
          befFunc(result);
        }

        DetailPageUtility.OverrideObjectValue(vueFormData, result.data);

        if (typeof afFunc == "function") {
          afFunc(result);
        }

        if (op == "view") {
          DetailPageUtility.IViewPageToViewStatus();
        }
      } else {
        DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
      }
    }, "json");
  }
};
var DictionaryUtility = {
  _GroupValueListJsonToSimpleJson: null,
  GroupValueListJsonToSimpleJson: function GroupValueListJsonToSimpleJson(sourceDictionaryJson) {
    if (this._GroupValueListJsonToSimpleJson == null) {
      if (sourceDictionaryJson != null) {
        var result = {};

        for (var groupValue in sourceDictionaryJson) {
          result[groupValue] = {};

          for (var i = 0; i < sourceDictionaryJson[groupValue].length; i++) {
            result[groupValue][sourceDictionaryJson[groupValue][i].dictValue] = sourceDictionaryJson[groupValue][i].dictText;
          }
        }

        this._GroupValueListJsonToSimpleJson = result;
      }
    }

    return this._GroupValueListJsonToSimpleJson;
  }
};
var CacheDataUtility = {
  IninClientCache: function IninClientCache() {
    this.GetCurrentUserInfo();
  },
  //用户相关信息
  _CurrentUserInfo: null,
  GetCurrentUserInfo: function GetCurrentUserInfo() {
    if (this._CurrentUserInfo == null) {
      if (window.parent.CacheDataUtility._CurrentUserInfo != null) {
        return window.parent.CacheDataUtility._CurrentUserInfo;
      } else {
        AjaxUtility.PostSync("/PlatForm/MyInfo/GetUserInfo", {}, function (result) {
          if (result.success) {
            CacheDataUtility._CurrentUserInfo = result.data;
          } else {}
        }, "json");
        return this._CurrentUserInfo;
      }
    } else {
      return this._CurrentUserInfo;
    }
  }
};
var CookieUtility = {
  /**
   * 设置cookie
   * @param name  cookie名称
   * @param value  cookie值
   */
  SetCookie1Day: function SetCookie1Day(name, value) {
    var exp = new Date(); //new Date("December 31, 9998");

    exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000); //1天
    // 这里一定要加上path。不然到index.jsp页面去清除cookie的时候会出现找不到cookie的问题。

    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },
  SetCookie1Month: function SetCookie1Month(name, value) {
    var exp = new Date(); //new Date("December 31, 9998");

    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000); //1月
    // 这里一定要加上path。不然到index.jsp页面去清除cookie的时候会出现找不到cookie的问题。

    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },
  SetCookie1Year: function SetCookie1Year(name, value) {
    var exp = new Date(); //new Date("December 31, 9998");

    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 365 * 1000); //1年
    // 这里一定要加上path。不然到index.jsp页面去清除cookie的时候会出现找不到cookie的问题。

    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },

  /**
   * 读取cookies函数
   * @param name
   * @returns
   */
  GetCookie: function GetCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
  },

  /**
   * 删除cookie
   * @param name cookie名称
   */
  DelCookie: function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
  }
};
"use strict";

//基础工具
var BaseUtility = {
  GetRootPath: function GetRootPath() {
    var fullHref = window.document.location.href;
    var pathName = window.document.location.pathname;
    var lac = fullHref.indexOf(pathName);
    var localhostPath = fullHref.substring(0, lac);
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return localhostPath + projectName;
  },
  ReplaceUrlVariable: function ReplaceUrlVariable(sourceUrl) {
    alert("ReplaceUrlVariable迁移到BuildAction"); //return sourceUrl.replace("${ctxpath}", this.GetRootPath());
  },
  GetTopWindow: function GetTopWindow() {
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
  TrySetControlFocus: function TrySetControlFocus() {
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
  BuildUrl: function BuildUrl(url) {
    alert("BaseUtility.BuildUrl 已停用");
    /*var _url=this.GetRootPath()+url;
    return StringUtility.GetTimeStampUrl(_url);*/
  },
  BuildAction: function BuildAction(action, para) {
    var urlPara = "";

    if (para) {
      urlPara = $.param(para);
    }

    var _url = this.GetRootPath() + action + ".do";

    if (urlPara != "") {
      _url += "?" + urlPara;
    } //alert(_url);


    return this.AppendTimeStampUrl(_url);
  },
  RedirectToLogin: function RedirectToLogin() {
    var url = BaseUtility.GetRootPath() + "/Login.do";
    window.parent.parent.location.href = url;
  },
  AppendTimeStampUrl: function AppendTimeStampUrl(url) {
    if (url.indexOf("timestamp") > "0") {
      return url;
    }

    var getTimestamp = new Date().getTime();

    if (url.indexOf("?") > -1) {
      url = url + "&timestamp=" + getTimestamp;
    } else {
      url = url + "?timestamp=" + getTimestamp;
    }

    return url;
  },
  GetUrlParaValue: function GetUrlParaValue(paraName) {
    return this.GetUrlParaValueByString(paraName, window.location.search);
  },
  GetUrlParaValueByString: function GetUrlParaValueByString(paraName, urlString) {
    var reg = new RegExp("(^|&)" + paraName + "=([^&]*)(&|$)");
    var r = urlString.substr(1).match(reg);
    if (r != null) return decodeURIComponent(r[2]);
    return "";
  }
};