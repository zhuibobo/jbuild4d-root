"use strict";

//Ajax处理工具类
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
  BuildView: function BuildView(action, para) {
    //debugger;
    //alert(11);
    //alert(StringUtility.EndWith(action,"View"));
    if (StringUtility.EndWith(action, "View")) {
      return this.BuildAction(action, para);
    } else {
      DialogUtility.AlertText(action + "视图Url请用View作为结尾.");
      return "";
    }
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
"use strict";

//浏览下信息类
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
};
"use strict";

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
"use strict";

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

//日期时间工具类
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
};
"use strict";

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
"use strict";

//对话框工具类
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
    /*var dialogEle = $("<div id=" + dialogid + " title='Basic dialog'>\
                    <iframe name='dialogIframe' width='100%' height='98%' frameborder='0' src='" + url + "'>\
                    </iframe>\
                </div>");*/
    //直接设置iframe的src会造成一次请求http的canceled.
    var dialogEle = $("<div id=" + dialogid + " title='Basic dialog'>\
                        <iframe name='dialogIframe' width='100%' height='98%' frameborder='0'>\
                        </iframe>\
                    </div>");
    $(docobj.body).append(dialogEle); //alert(url);

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
    $iframeobj.attr(src, url);
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
      $iframeobj.attr("src", url);
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
    //debugger;
    var wrwin = this.Frame_TryGetFrameWindowObj();
    var openerwin = opererWindow.OpenerWindowObj;
    var autodialogid = opererWindow.FrameWindowId;

    wrwin.DialogUtility._Frame_FramePageCloseDialog(autodialogid);
  }
};
"use strict";

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
"use strict";

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
};

function refCssLink(href) {
  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('link');
  style.type = 'text/css';
  style.rel = 'stylesheet';
  style.href = href;
  head.appendChild(style);
  return style.sheet || style.styleSheet;
}
"use strict";

//Json操作工具类
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
};
"use strict";

//列表页面处理工具类
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
"use strict";

//页面样式辅助功能类
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
};
"use strict";

//查询处理工具类
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
  }
};
"use strict";

var JBuild4DSelectView = {
  SelectEnvVariable: {
    URL: "/PlatForm/SelectView/SelectEnvVariable/Select",
    beginSelect: function beginSelect(instanceName) {
      var url = BaseUtility.BuildAction(this.URL, {
        "instanceName": instanceName
      });
      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: "选择变量",
        modal: true
      }, 2);
    },
    beginSelectInFrame: function beginSelectInFrame(opener, instanceName, option) {
      var url = BaseUtility.BuildAction(this.URL, {
        "instanceName": instanceName
      });
      var option = $.extend(true, {}, {
        modal: true,
        title: "选择变量"
      }, option);
      DialogUtility.Frame_OpenIframeWindow(opener, DialogUtility.DialogId05, url, option, 1); //alert("1");

      $(window.parent.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.parent.document).find(".ui-dialog").css("zIndex", 10101);
    },
    formatText: function formatText(type, text) {
      //debugger;
      if (type == "Const") {
        return "静态值:【" + text + "】";
      } else if (type == "DateTime") {
        return "日期时间:【" + text + "】";
      } else if (type == "ApiVar") {
        return "API变量:【" + text + "】";
      } else if (type == "NumberCode") {
        return "序号编码:【" + text + "】";
      } else if (type == "IdCoder") {
        return "主键生成:【" + text + "】";
      } else if (type == "") {
        return "【无】";
      }

      return "未知类型" + text;
    }
  },
  SelectBindToField: {
    URL: "/PlatForm/SelectView/SelectBindToTableField/Select",
    beginSelect: function beginSelect(instanceName) {
      var url = this.URL + "?instanceName=" + instanceName;
      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: "选择变量",
        modal: true
      }, 2);
    },
    beginSelectInFrame: function beginSelectInFrame(opener, instanceName, option) {
      var url = BaseUtility.BuildAction(this.URL, {
        "instanceName": instanceName
      });
      var option = $.extend(true, {}, {
        modal: true,
        title: "选择绑定字段"
      }, option);
      DialogUtility.Frame_OpenIframeWindow(opener, DialogUtility.DialogId05, url, option, 1); //alert("1");

      $(window.parent.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.parent.document).find(".ui-dialog").css("zIndex", 10101);
    }
  },
  SelectValidateRule: {
    URL: "/PlatForm/SelectView/SelectValidateRule/Select",
    beginSelect: function beginSelect(instanceName) {
      var url = this.URL + "?instanceName=" + instanceName;
      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: "验证规则",
        modal: true
      }, 2);
    },
    beginSelectInFrame: function beginSelectInFrame(opener, instanceName, option) {
      var url = BaseUtility.BuildAction(this.URL, {
        "instanceName": instanceName
      });
      var option = $.extend(true, {}, {
        modal: true,
        title: "验证规则"
      }, option);
      DialogUtility.Frame_OpenIframeWindow(opener, DialogUtility.DialogId05, url, option, 1); //alert("1");

      $(window.parent.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.parent.document).find(".ui-dialog").css("zIndex", 10101);
    }
  }
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

//字符串操作类
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
  },
  EndWith: function EndWith(str, endStr) {
    var d = str.length - endStr.length; //alert(str.lastIndexOf(endStr)==d);

    return d >= 0 && str.lastIndexOf(endStr) == d;
  }
};
"use strict";

//XML处理工具类
var XMLUtility = {};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFqYXhVdGlsaXR5LmpzIiwiQmFzZVV0aWxpdHkuanMiLCJCcm93c2VySW5mb1V0aWxpdHkuanMiLCJDYWNoZURhdGFVdGlsaXR5LmpzIiwiQ29va2llVXRpbGl0eS5qcyIsIkRhdGVVdGlsaXR5LmpzIiwiRGV0YWlsUGFnZVV0aWxpdHkuanMiLCJEaWFsb2dVdGlsaXR5LmpzIiwiRGljdGlvbmFyeVV0aWxpdHkuanMiLCJKQnVpbGQ0REJhc2VMaWIuanMiLCJKc29uVXRpbGl0eS5qcyIsIkxpc3RQYWdlVXRpbGl0eS5qcyIsIlBhZ2VTdHlsZVV0aWxpdHkuanMiLCJTZWFyY2hVdGlsaXR5LmpzIiwiU2VsZWN0Vmlld0xpYi5qcyIsIlN0cmluZ1V0aWxpdHkuanMiLCJYTUxVdGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcGhCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDclFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyVkE7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiSkJ1aWxkNERQbGF0Zm9ybUxpYi5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vL0FqYXjlpITnkIblt6XlhbfnsbtcbnZhciBBamF4VXRpbGl0eSA9IHtcbiAgUG9zdFJlcXVlc3RCb2R5OiBmdW5jdGlvbiBQb3N0UmVxdWVzdEJvZHkoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlKSB7XG4gICAgdGhpcy5Qb3N0KF91cmwsIHNlbmREYXRhLCBmdW5jLCBkYXRhVHlwZSwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpO1xuICB9LFxuICBQb3N0U3luYzogZnVuY3Rpb24gUG9zdFN5bmMoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBjb250ZW50VHlwZSkge1xuICAgIHZhciByZXN1bHQgPSB0aGlzLlBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBjb250ZW50VHlwZSwgZmFsc2UpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFBvc3Q6IGZ1bmN0aW9uIFBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBjb250ZW50VHlwZSwgaXNBc3luYykge1xuICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbihfdXJsKTtcblxuICAgIGlmIChkYXRhVHlwZSA9PSB1bmRlZmluZWQgfHwgZGF0YVR5cGUgPT0gbnVsbCkge1xuICAgICAgZGF0YVR5cGUgPSBcInRleHRcIjtcbiAgICB9XG5cbiAgICBpZiAoaXNBc3luYyA9PSB1bmRlZmluZWQgfHwgaXNBc3luYyA9PSBudWxsKSB7XG4gICAgICBpc0FzeW5jID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudFR5cGUgPT0gdW5kZWZpbmVkIHx8IGNvbnRlbnRUeXBlID09IG51bGwpIHtcbiAgICAgIGNvbnRlbnRUeXBlID0gXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLThcIjtcbiAgICB9XG5cbiAgICB2YXIgaW5uZXJSZXN1bHQgPSBudWxsO1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIHVybDogdXJsLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgYXN5bmM6IGlzQXN5bmMsXG4gICAgICBjb250ZW50VHlwZTogY29udGVudFR5cGUsXG4gICAgICAvL1wiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLCovXG4gICAgICBkYXRhVHlwZTogZGF0YVR5cGUsXG4gICAgICBkYXRhOiBzZW5kRGF0YSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsICYmIHJlc3VsdC5zdWNjZXNzICE9IG51bGwgJiYgIXJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0Lm1lc3NhZ2UgPT0gXCLnmbvlvZVTZXNzaW9u6L+H5pyfXCIpIHtcbiAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwiU2Vzc2lvbui2heaXtu+8jOivt+mHjeaWsOeZu+mZhuezu+e7n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQmFzZVV0aWxpdHkuUmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWpheFV0aWxpdHkuUG9zdCBFeGNlcHRpb24gXCIgKyB1cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuYyhyZXN1bHQpO1xuICAgICAgICBpbm5lclJlc3VsdCA9IHJlc3VsdDtcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUobXNnKSB7Ly9kZWJ1Z2dlcjtcbiAgICAgIH0sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IobXNnKSB7XG4gICAgICAgIC8vZGVidWdnZXI7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKG1zZy5yZXNwb25zZVRleHQuaW5kZXhPZihcIuivt+mHjeaWsOeZu+mZhuezu+e7n1wiKSA+PSAwKSB7XG4gICAgICAgICAgICBCYXNlVXRpbGl0eS5SZWRpcmVjdFRvTG9naW4oKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb25zb2xlLmxvZyhtc2cpO1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBcIkFqYXhVdGlsaXR5LlBvc3QuRXJyb3JcIiwge30sIFwiQWpheOivt+axguWPkeeUn+mUmeivr++8gVwiICsgXCJzdGF0dXM6XCIgKyBtc2cuc3RhdHVzICsgXCIscmVzcG9uc2VUZXh0OlwiICsgbXNnLnJlc3BvbnNlVGV4dCwgbnVsbCk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHt9XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGlubmVyUmVzdWx0O1xuICB9LFxuICBHZXRTeW5jOiBmdW5jdGlvbiBHZXRTeW5jKF91cmwsIHNlbmREYXRhLCBmdW5jLCBkYXRhVHlwZSkge1xuICAgIHRoaXMuUG9zdChfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGZhbHNlKTtcbiAgfSxcbiAgR2V0OiBmdW5jdGlvbiBHZXQoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBpc0FzeW5jKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVXJsKF91cmwpO1xuXG4gICAgaWYgKGRhdGFUeXBlID09IHVuZGVmaW5lZCB8fCBkYXRhVHlwZSA9PSBudWxsKSB7XG4gICAgICBkYXRhVHlwZSA9IFwidGV4dFwiO1xuICAgIH1cblxuICAgIGlmIChpc0FzeW5jID09IHVuZGVmaW5lZCB8fCBpc0FzeW5jID09IG51bGwpIHtcbiAgICAgIGlzQXN5bmMgPSB0cnVlO1xuICAgIH1cblxuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBhc3luYzogaXNBc3luYyxcbiAgICAgIGNvbnRlbnRUeXBlOiBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIixcbiAgICAgIGRhdGFUeXBlOiBkYXRhVHlwZSxcbiAgICAgIGRhdGE6IHNlbmREYXRhLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXN1bHQpIHtcbiAgICAgICAgZnVuYyhyZXN1bHQpO1xuICAgICAgfSxcbiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShtc2cpIHsvL2RlYnVnZ2VyO1xuICAgICAgfSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8v5Z+656GA5bel5YW3XG52YXIgQmFzZVV0aWxpdHkgPSB7XG4gIEdldFJvb3RQYXRoOiBmdW5jdGlvbiBHZXRSb290UGF0aCgpIHtcbiAgICB2YXIgZnVsbEhyZWYgPSB3aW5kb3cuZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgcGF0aE5hbWUgPSB3aW5kb3cuZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgdmFyIGxhYyA9IGZ1bGxIcmVmLmluZGV4T2YocGF0aE5hbWUpO1xuICAgIHZhciBsb2NhbGhvc3RQYXRoID0gZnVsbEhyZWYuc3Vic3RyaW5nKDAsIGxhYyk7XG4gICAgdmFyIHByb2plY3ROYW1lID0gcGF0aE5hbWUuc3Vic3RyaW5nKDAsIHBhdGhOYW1lLnN1YnN0cigxKS5pbmRleE9mKCcvJykgKyAxKTtcbiAgICByZXR1cm4gbG9jYWxob3N0UGF0aCArIHByb2plY3ROYW1lO1xuICB9LFxuICBSZXBsYWNlVXJsVmFyaWFibGU6IGZ1bmN0aW9uIFJlcGxhY2VVcmxWYXJpYWJsZShzb3VyY2VVcmwpIHtcbiAgICBhbGVydChcIlJlcGxhY2VVcmxWYXJpYWJsZei/geenu+WIsEJ1aWxkQWN0aW9uXCIpOyAvL3JldHVybiBzb3VyY2VVcmwucmVwbGFjZShcIiR7Y3R4cGF0aH1cIiwgdGhpcy5HZXRSb290UGF0aCgpKTtcbiAgfSxcbiAgR2V0VG9wV2luZG93OiBmdW5jdGlvbiBHZXRUb3BXaW5kb3coKSB7XG4gICAgYWxlcnQoXCJCYXNlVXRpbGl0eS5HZXRUb3BXaW5kb3cg5bey5YGc55SoXCIpO1xuICAgIC8qdmFyIHdpbmRvd1RvcCA9IHdpbmRvdztcclxuICAgIHZhciB3aW5kb3dQYXJlbnQgPSB3aW5kb3cuZGlhbG9nQXJndW1lbnRzIHx8IG9wZW5lciB8fCBwYXJlbnQ7XHJcbiAgICB3aGlsZSAod2luZG93UGFyZW50ICYmIHdpbmRvd1RvcCAhPSB3aW5kb3dQYXJlbnQpIHtcclxuICAgICAgICB3aW5kb3dUb3AgPSB3aW5kb3dQYXJlbnQ7XHJcbiAgICAgICAgaWYod2luZG93VG9wLklzVG9wV29ya2Fyb3VuZFBhZ2Upe1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgICAgd2luZG93UGFyZW50ID0gd2luZG93UGFyZW50LmRpYWxvZ0FyZ3VtZW50cyB8fCB3aW5kb3dQYXJlbnQub3BlbmVyIHx8IHdpbmRvd1BhcmVudC5wYXJlbnQ7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gd2luZG93VG9wOyovXG4gIH0sXG4gIFRyeVNldENvbnRyb2xGb2N1czogZnVuY3Rpb24gVHJ5U2V0Q29udHJvbEZvY3VzKCkge1xuICAgIGFsZXJ0KFwiQmFzZVV0aWxpdHkuVHJ5U2V0Q29udHJvbEZvY3VzIOW3suWBnOeUqFwiKTtcbiAgICAvKnZhciBjdHM9JChcImlucHV0W3R5cGU9J3RleHQnXVwiKTtcclxuICAgIGZvcih2YXIgaT0wO2k8Y3RzLmxlbmd0aDtpKyspe1xyXG4gICAgICAgIHZhciBjdD0kKGN0c1tpXSk7XHJcbiAgICAgICAgaWYgKGN0LmF0dHIoXCJyZWFkb25seVwiKSAhPSBcInJlYWRvbmx5XCImJiBjdC5hdHRyKFwiZGlzYWJsZWRcIikgIT0gXCJkaXNhYmxlZFwiKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICBjdFswXS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgfSovXG4gIH0sXG4gIEJ1aWxkVXJsOiBmdW5jdGlvbiBCdWlsZFVybCh1cmwpIHtcbiAgICBhbGVydChcIkJhc2VVdGlsaXR5LkJ1aWxkVXJsIOW3suWBnOeUqFwiKTtcbiAgICAvKnZhciBfdXJsPXRoaXMuR2V0Um9vdFBhdGgoKSt1cmw7XHJcbiAgICByZXR1cm4gU3RyaW5nVXRpbGl0eS5HZXRUaW1lU3RhbXBVcmwoX3VybCk7Ki9cbiAgfSxcbiAgQnVpbGRWaWV3OiBmdW5jdGlvbiBCdWlsZFZpZXcoYWN0aW9uLCBwYXJhKSB7XG4gICAgLy9kZWJ1Z2dlcjtcbiAgICAvL2FsZXJ0KDExKTtcbiAgICAvL2FsZXJ0KFN0cmluZ1V0aWxpdHkuRW5kV2l0aChhY3Rpb24sXCJWaWV3XCIpKTtcbiAgICBpZiAoU3RyaW5nVXRpbGl0eS5FbmRXaXRoKGFjdGlvbiwgXCJWaWV3XCIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5CdWlsZEFjdGlvbihhY3Rpb24sIHBhcmEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChhY3Rpb24gKyBcIuinhuWbvlVybOivt+eUqFZpZXfkvZzkuLrnu5PlsL4uXCIpO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICBCdWlsZEFjdGlvbjogZnVuY3Rpb24gQnVpbGRBY3Rpb24oYWN0aW9uLCBwYXJhKSB7XG4gICAgdmFyIHVybFBhcmEgPSBcIlwiO1xuXG4gICAgaWYgKHBhcmEpIHtcbiAgICAgIHVybFBhcmEgPSAkLnBhcmFtKHBhcmEpO1xuICAgIH1cblxuICAgIHZhciBfdXJsID0gdGhpcy5HZXRSb290UGF0aCgpICsgYWN0aW9uICsgXCIuZG9cIjtcblxuICAgIGlmICh1cmxQYXJhICE9IFwiXCIpIHtcbiAgICAgIF91cmwgKz0gXCI/XCIgKyB1cmxQYXJhO1xuICAgIH0gLy9hbGVydChfdXJsKTtcblxuXG4gICAgcmV0dXJuIHRoaXMuQXBwZW5kVGltZVN0YW1wVXJsKF91cmwpO1xuICB9LFxuICBSZWRpcmVjdFRvTG9naW46IGZ1bmN0aW9uIFJlZGlyZWN0VG9Mb2dpbigpIHtcbiAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL0xvZ2luLmRvXCI7XG4gICAgd2luZG93LnBhcmVudC5wYXJlbnQubG9jYXRpb24uaHJlZiA9IHVybDtcbiAgfSxcbiAgQXBwZW5kVGltZVN0YW1wVXJsOiBmdW5jdGlvbiBBcHBlbmRUaW1lU3RhbXBVcmwodXJsKSB7XG4gICAgaWYgKHVybC5pbmRleE9mKFwidGltZXN0YW1wXCIpID4gXCIwXCIpIHtcbiAgICAgIHJldHVybiB1cmw7XG4gICAgfVxuXG4gICAgdmFyIGdldFRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXG4gICAgaWYgKHVybC5pbmRleE9mKFwiP1wiKSA+IC0xKSB7XG4gICAgICB1cmwgPSB1cmwgKyBcIiZ0aW1lc3RhbXA9XCIgKyBnZXRUaW1lc3RhbXA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVybCA9IHVybCArIFwiP3RpbWVzdGFtcD1cIiArIGdldFRpbWVzdGFtcDtcbiAgICB9XG5cbiAgICByZXR1cm4gdXJsO1xuICB9LFxuICBHZXRVcmxQYXJhVmFsdWU6IGZ1bmN0aW9uIEdldFVybFBhcmFWYWx1ZShwYXJhTmFtZSkge1xuICAgIHJldHVybiB0aGlzLkdldFVybFBhcmFWYWx1ZUJ5U3RyaW5nKHBhcmFOYW1lLCB3aW5kb3cubG9jYXRpb24uc2VhcmNoKTtcbiAgfSxcbiAgR2V0VXJsUGFyYVZhbHVlQnlTdHJpbmc6IGZ1bmN0aW9uIEdldFVybFBhcmFWYWx1ZUJ5U3RyaW5nKHBhcmFOYW1lLCB1cmxTdHJpbmcpIHtcbiAgICB2YXIgcmVnID0gbmV3IFJlZ0V4cChcIihefCYpXCIgKyBwYXJhTmFtZSArIFwiPShbXiZdKikoJnwkKVwiKTtcbiAgICB2YXIgciA9IHVybFN0cmluZy5zdWJzdHIoMSkubWF0Y2gocmVnKTtcbiAgICBpZiAociAhPSBudWxsKSByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHJbMl0pO1xuICAgIHJldHVybiBcIlwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vL+a1j+iniOS4i+S/oeaBr+exu1xudmFyIEJyb3dzZXJJbmZvVXRpbGl0eSA9IHtcbiAgQnJvd3NlckFwcE5hbWU6IGZ1bmN0aW9uIEJyb3dzZXJBcHBOYW1lKCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJGaXJlZm94XCIpID4gMCkge1xuICAgICAgcmV0dXJuIFwiRmlyZWZveFwiO1xuICAgIH0gZWxzZSBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKSA+IDApIHtcbiAgICAgIHJldHVybiBcIklFXCI7XG4gICAgfSBlbHNlIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJDaHJvbWVcIikgPiAwKSB7XG4gICAgICByZXR1cm4gXCJDaHJvbWVcIjtcbiAgICB9XG4gIH0sXG4gIElzSUU6IGZ1bmN0aW9uIElzSUUoKSB7XG4gICAgaWYgKCEhd2luZG93LkFjdGl2ZVhPYmplY3QgfHwgXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93KSByZXR1cm4gdHJ1ZTtlbHNlIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNJRTY6IGZ1bmN0aW9uIElzSUU2KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDYuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU3OiBmdW5jdGlvbiBJc0lFNygpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA3LjBcIikgPiAwO1xuICB9LFxuICBJc0lFODogZnVuY3Rpb24gSXNJRTgoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOC4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRThYNjQ6IGZ1bmN0aW9uIElzSUU4WDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDguMFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJ4NjRcIikgPiAwO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNJRTk6IGZ1bmN0aW9uIElzSUU5KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDkuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU5WDY0OiBmdW5jdGlvbiBJc0lFOVg2NCgpIHtcbiAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA5LjBcIikgPiAwKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwieDY0XCIpID4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElzSUUxMDogZnVuY3Rpb24gSXNJRTEwKCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDEwLjBcIikgPiAwO1xuICB9LFxuICBJc0lFMTBYNjQ6IGZ1bmN0aW9uIElzSUUxMFg2NCgpIHtcbiAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSAxMC4wXCIpID4gMCkge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIng2NFwiKSA+IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJRURvY3VtZW50TW9kZTogZnVuY3Rpb24gSUVEb2N1bWVudE1vZGUoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50TW9kZTtcbiAgfSxcbiAgSXNJRThEb2N1bWVudE1vZGU6IGZ1bmN0aW9uIElzSUU4RG9jdW1lbnRNb2RlKCkge1xuICAgIHJldHVybiB0aGlzLklFRG9jdW1lbnRNb2RlKCkgPT0gODtcbiAgfSxcbiAgSXNGaXJlZm94OiBmdW5jdGlvbiBJc0ZpcmVmb3goKSB7XG4gICAgcmV0dXJuIHRoaXMuQnJvd3NlckFwcE5hbWUoKSA9PSBcIkZpcmVmb3hcIjtcbiAgfSxcbiAgSXNDaHJvbWU6IGZ1bmN0aW9uIElzQ2hyb21lKCkge1xuICAgIHJldHVybiB0aGlzLkJyb3dzZXJBcHBOYW1lKCkgPT0gXCJDaHJvbWVcIjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENhY2hlRGF0YVV0aWxpdHkgPSB7XG4gIEluaW5DbGllbnRDYWNoZTogZnVuY3Rpb24gSW5pbkNsaWVudENhY2hlKCkge1xuICAgIHRoaXMuR2V0Q3VycmVudFVzZXJJbmZvKCk7XG4gIH0sXG4gIC8v55So5oi355u45YWz5L+h5oGvXG4gIF9DdXJyZW50VXNlckluZm86IG51bGwsXG4gIEdldEN1cnJlbnRVc2VySW5mbzogZnVuY3Rpb24gR2V0Q3VycmVudFVzZXJJbmZvKCkge1xuICAgIGlmICh0aGlzLl9DdXJyZW50VXNlckluZm8gPT0gbnVsbCkge1xuICAgICAgaWYgKHdpbmRvdy5wYXJlbnQuQ2FjaGVEYXRhVXRpbGl0eS5fQ3VycmVudFVzZXJJbmZvICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5wYXJlbnQuQ2FjaGVEYXRhVXRpbGl0eS5fQ3VycmVudFVzZXJJbmZvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmMoXCIvUGxhdEZvcm0vTXlJbmZvL0dldFVzZXJJbmZvXCIsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBDYWNoZURhdGFVdGlsaXR5Ll9DdXJyZW50VXNlckluZm8gPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB9IGVsc2Uge31cbiAgICAgICAgfSwgXCJqc29uXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5fQ3VycmVudFVzZXJJbmZvO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fQ3VycmVudFVzZXJJbmZvO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENvb2tpZVV0aWxpdHkgPSB7XG4gIC8qKlxyXG4gICAqIOiuvue9rmNvb2tpZVxyXG4gICAqIEBwYXJhbSBuYW1lICBjb29raWXlkI3np7BcclxuICAgKiBAcGFyYW0gdmFsdWUgIGNvb2tpZeWAvFxyXG4gICAqL1xuICBTZXRDb29raWUxRGF5OiBmdW5jdGlvbiBTZXRDb29raWUxRGF5KG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGV4cCA9IG5ldyBEYXRlKCk7IC8vbmV3IERhdGUoXCJEZWNlbWJlciAzMSwgOTk5OFwiKTtcblxuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTsgLy8x5aSpXG4gICAgLy8g6L+Z6YeM5LiA5a6a6KaB5Yqg5LiKcGF0aOOAguS4jeeEtuWIsGluZGV4LmpzcOmhtemdouWOu+a4hemZpGNvb2tpZeeahOaXtuWAmeS8muWHuueOsOaJvuS4jeWIsGNvb2tpZeeahOmXrumimOOAglxuXG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBTZXRDb29raWUxTW9udGg6IGZ1bmN0aW9uIFNldENvb2tpZTFNb250aChuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpOyAvL25ldyBEYXRlKFwiRGVjZW1iZXIgMzEsIDk5OThcIik7XG5cbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpICsgMzAgKiAyNCAqIDYwICogNjAgKiAxMDAwKTsgLy8x5pyIXG4gICAgLy8g6L+Z6YeM5LiA5a6a6KaB5Yqg5LiKcGF0aOOAguS4jeeEtuWIsGluZGV4LmpzcOmhtemdouWOu+a4hemZpGNvb2tpZeeahOaXtuWAmeS8muWHuueOsOaJvuS4jeWIsGNvb2tpZeeahOmXrumimOOAglxuXG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBTZXRDb29raWUxWWVhcjogZnVuY3Rpb24gU2V0Q29va2llMVllYXIobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTsgLy9uZXcgRGF0ZShcIkRlY2VtYmVyIDMxLCA5OTk4XCIpO1xuXG4gICAgZXhwLnNldFRpbWUoZXhwLmdldFRpbWUoKSArIDMwICogMjQgKiA2MCAqIDYwICogMzY1ICogMTAwMCk7IC8vMeW5tFxuICAgIC8vIOi/memHjOS4gOWumuimgeWKoOS4inBhdGjjgILkuI3nhLbliLBpbmRleC5qc3DpobXpnaLljrvmuIXpmaRjb29raWXnmoTml7blgJnkvJrlh7rnjrDmib7kuI3liLBjb29raWXnmoTpl67popjjgIJcblxuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGVzY2FwZSh2YWx1ZSkgKyBcIjtleHBpcmVzPVwiICsgZXhwLnRvR01UU3RyaW5nKCkgKyBcIjtwYXRoPS9cIjtcbiAgfSxcblxuICAvKipcclxuICAgKiDor7vlj5Zjb29raWVz5Ye95pWwXHJcbiAgICogQHBhcmFtIG5hbWVcclxuICAgKiBAcmV0dXJuc1xyXG4gICAqL1xuICBHZXRDb29raWU6IGZ1bmN0aW9uIEdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGFyciA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKFwiKF58IClcIiArIG5hbWUgKyBcIj0oW147XSopKDt8JClcIikpO1xuICAgIGlmIChhcnIgIT0gbnVsbCkgcmV0dXJuIHVuZXNjYXBlKGFyclsyXSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG5cbiAgLyoqXHJcbiAgICog5Yig6ZmkY29va2llXHJcbiAgICogQHBhcmFtIG5hbWUgY29va2ll5ZCN56ewXHJcbiAgICovXG4gIERlbENvb2tpZTogZnVuY3Rpb24gRGVsQ29va2llKG5hbWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpIC0gMSk7XG4gICAgdmFyIGN2YWwgPSB0aGlzLmdldENvb2tpZShuYW1lKTtcbiAgICBpZiAoY3ZhbCAhPSBudWxsKSBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBjdmFsICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8v5pel5pyf5pe26Ze05bel5YW357G7XG52YXIgRGF0ZVV0aWxpdHkgPSB7XG4gIEdldEN1cnJlbnREYXRhU3RyaW5nOiBmdW5jdGlvbiBHZXRDdXJyZW50RGF0YVN0cmluZyhzcGxpdCkge1xuICAgIGFsZXJ0KFwiRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGFTdHJpbmcg5bey5YGc55SoXCIpO1xuICAgIC8qdGhpcy5TZXRTcGxpdChzcGxpdCk7Ki9cblxuICAgIC8qdmFyIG15RGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICB2YXIgeWVhciA9IG15RGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgdmFyIG1vbnRoID0gbXlEYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgaWYgKG1vbnRoIDwgMTApIHtcclxuICAgICAgICBtb250aCA9IFwiMFwiICsgbW9udGg7XHJcbiAgICB9XHJcbiAgICB2YXIgZGF5ID0gbXlEYXRlLmdldERhdGUoKTtcclxuICAgIGlmIChkYXkgPCAxMCkge1xyXG4gICAgICAgIGRheSA9IFwiMFwiICsgZGF5O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHllYXIgKyBzcGxpdCArIG1vbnRoICsgc3BsaXQgKyBkYXk7Ki9cbiAgfSxcbiAgRGF0ZUZvcm1hdDogZnVuY3Rpb24gRGF0ZUZvcm1hdChteURhdGUsIHNwbGl0KSB7XG4gICAgYWxlcnQoXCJEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YVN0cmluZyDlt7LlgZznlKhcIik7XG4gICAgLyp0aGlzLlNldFNwbGl0KHNwbGl0KTsqL1xuXG4gICAgLyp2YXIgeWVhciA9IG15RGF0ZS5nZXRGdWxsWWVhcigpO1xyXG4gICAgdmFyIG1vbnRoID0gbXlEYXRlLmdldE1vbnRoKCkgKyAxO1xyXG4gICAgaWYgKG1vbnRoIDwgMTApIHtcclxuICAgICAgICBtb250aCA9IFwiMFwiICsgbW9udGg7XHJcbiAgICB9XHJcbiAgICB2YXIgZGF5ID0gbXlEYXRlLmdldERhdGUoKTtcclxuICAgIGlmIChkYXkgPCAxMCkge1xyXG4gICAgICAgIGRheSA9IFwiMFwiICsgZGF5O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHllYXIgKyBzcGxpdCArIG1vbnRoICsgc3BsaXQgKyBkYXk7Ki9cbiAgfSxcbiAgRm9ybWF0OiBmdW5jdGlvbiBGb3JtYXQobXlEYXRlLCBmb3JtYXRTdHJpbmcpIHtcbiAgICB2YXIgbyA9IHtcbiAgICAgIFwiTStcIjogbXlEYXRlLmdldE1vbnRoKCkgKyAxLFxuICAgICAgLy9tb250aFxuICAgICAgXCJkK1wiOiBteURhdGUuZ2V0RGF0ZSgpLFxuICAgICAgLy9kYXlcbiAgICAgIFwiaCtcIjogbXlEYXRlLmdldEhvdXJzKCksXG4gICAgICAvL2hvdXJcbiAgICAgIFwibStcIjogbXlEYXRlLmdldE1pbnV0ZXMoKSxcbiAgICAgIC8vbWludXRlXG4gICAgICBcInMrXCI6IG15RGF0ZS5nZXRTZWNvbmRzKCksXG4gICAgICAvL3NlY29uZFxuICAgICAgXCJxK1wiOiBNYXRoLmZsb29yKChteURhdGUuZ2V0TW9udGgoKSArIDMpIC8gMyksXG4gICAgICAvL3F1YXJ0ZXJcbiAgICAgIFwiU1wiOiBteURhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgLy9taWxsaXNlY29uZFxuXG4gICAgfTtcbiAgICBpZiAoLyh5KykvLnRlc3QoZm9ybWF0U3RyaW5nKSkgZm9ybWF0U3RyaW5nID0gZm9ybWF0U3RyaW5nLnJlcGxhY2UoUmVnRXhwLiQxLCAobXlEYXRlLmdldEZ1bGxZZWFyKCkgKyBcIlwiKS5zdWJzdHIoNCAtIFJlZ0V4cC4kMS5sZW5ndGgpKTtcblxuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm9ybWF0U3RyaW5nKSkgZm9ybWF0U3RyaW5nID0gZm9ybWF0U3RyaW5nLnJlcGxhY2UoUmVnRXhwLiQxLCBSZWdFeHAuJDEubGVuZ3RoID09IDEgPyBvW2tdIDogKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aCkpO1xuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXRTdHJpbmc7XG4gIH0sXG4gIEZvcm1hdEN1cnJlbnREYXRhOiBmdW5jdGlvbiBGb3JtYXRDdXJyZW50RGF0YShmb3JtYXRTdHJpbmcpIHtcbiAgICB2YXIgbXlEYXRlID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gdGhpcy5Gb3JtYXQobXlEYXRlLCBmb3JtYXRTdHJpbmcpO1xuICB9LFxuICBHZXRDdXJyZW50RGF0YTogZnVuY3Rpb24gR2V0Q3VycmVudERhdGEoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEZXRhaWxQYWdlVXRpbGl0eSA9IHtcbiAgSVZpZXdQYWdlVG9WaWV3U3RhdHVzOiBmdW5jdGlvbiBJVmlld1BhZ2VUb1ZpZXdTdGF0dXMoKSB7XG4gICAgLy9hbGVydChcIjFcIik7XG4gICAgcmV0dXJuO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vYWxlcnQoXCIxXCIpO1xuICAgICAgJChcImlucHV0XCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmhpZGUoKTtcbiAgICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICQodGhpcykuYWZ0ZXIoJChcIjxsYWJlbCAvPlwiKS50ZXh0KHZhbCkpO1xuICAgICAgfSk7XG4gICAgICAkKFwiLml2dS1kYXRlLXBpY2tlci1lZGl0b3JcIikuZmluZChcIi5pdnUtaWNvblwiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpb1wiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpby1ncm91cC1pdGVtXCIpLmhpZGUoKTtcbiAgICAgICQoXCIuaXZ1LXJhZGlvLXdyYXBwZXItY2hlY2tlZFwiKS5zaG93KCk7XG4gICAgICAkKFwiLml2dS1yYWRpby13cmFwcGVyLWNoZWNrZWRcIikuZmluZChcInNwYW5cIikuaGlkZSgpO1xuICAgICAgJChcInRleHRhcmVhXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmhpZGUoKTtcbiAgICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICQodGhpcykuYWZ0ZXIoJChcIjxsYWJlbCAvPlwiKS50ZXh0KHZhbCkpO1xuICAgICAgfSk7XG4gICAgfSwgMTAwKTtcbiAgfSxcbiAgT3ZlcnJpZGVPYmplY3RWYWx1ZTogZnVuY3Rpb24gT3ZlcnJpZGVPYmplY3RWYWx1ZShzb3VyY2VPYmplY3QsIGRhdGFPYmplY3QpIHtcbiAgICAvL2NvbnNvbGUubG9nKGRhdGFPYmplY3QpO1xuICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2VPYmplY3QpIHtcbiAgICAgIGlmIChkYXRhT2JqZWN0W2tleV0gIT0gdW5kZWZpbmVkICYmIGRhdGFPYmplY3Rba2V5XSAhPSBudWxsICYmIGRhdGFPYmplY3Rba2V5XSAhPSBcIlwiKSB7XG4gICAgICAgIHNvdXJjZU9iamVjdFtrZXldID0gZGF0YU9iamVjdFtrZXldO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgQmluZEZvcm1EYXRhOiBmdW5jdGlvbiBCaW5kRm9ybURhdGEoaW50ZXJmYWNlVXJsLCB2dWVGb3JtRGF0YSwgcmVjb3JkSWQsIG9wLCBiZWZGdW5jLCBhZkZ1bmMpIHtcbiAgICAvL+iOt+WPluaVsOaNruW5tui1i+WAvFxuICAgIEFqYXhVdGlsaXR5LlBvc3QoaW50ZXJmYWNlVXJsLCB7XG4gICAgICByZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICBvcDogb3BcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiZWZGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGJlZkZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIERldGFpbFBhZ2VVdGlsaXR5Lk92ZXJyaWRlT2JqZWN0VmFsdWUodnVlRm9ybURhdGEsIHJlc3VsdC5kYXRhKTtcblxuICAgICAgICBpZiAodHlwZW9mIGFmRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBhZkZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcCA9PSBcInZpZXdcIikge1xuICAgICAgICAgIERldGFpbFBhZ2VVdGlsaXR5LklWaWV3UGFnZVRvVmlld1N0YXR1cygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLy/lr7nor53moYblt6XlhbfnsbtcbnZhciBEaWFsb2dVdGlsaXR5ID0ge1xuICBEaWFsb2dBbGVydElkOiBcIkRlZmF1bHREaWFsb2dBbGVydFV0aWxpdHkwMVwiLFxuICBEaWFsb2dQcm9tcHRJZDogXCJEZWZhdWx0RGlhbG9nUHJvbXB0VXRpbGl0eTAxXCIsXG4gIERpYWxvZ0lkOiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDFcIixcbiAgRGlhbG9nSWQwMjogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTAyXCIsXG4gIERpYWxvZ0lkMDM6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwM1wiLFxuICBEaWFsb2dJZDA0OiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDRcIixcbiAgRGlhbG9nSWQwNTogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTA1XCIsXG4gIF9HZXRFbGVtOiBmdW5jdGlvbiBfR2V0RWxlbShkaWFsb2dJZCkge1xuICAgIHJldHVybiAkKFwiI1wiICsgZGlhbG9nSWQpO1xuICB9LFxuICBfQ3JlYXRlRGlhbG9nRWxlbTogZnVuY3Rpb24gX0NyZWF0ZURpYWxvZ0VsZW0oZG9jb2JqLCBkaWFsb2dJZCkge1xuICAgIGlmICh0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgdmFyIGRpYWxvZ0VsZSA9ICQoXCI8ZGl2IGlkPVwiICsgZGlhbG9nSWQgKyBcIiB0aXRsZT0n57O757uf5o+Q56S6JyBzdHlsZT0nZGlzcGxheTpub25lJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICQoZG9jb2JqLmJvZHkpLmFwcGVuZChkaWFsb2dFbGUpO1xuICAgICAgcmV0dXJuIGRpYWxvZ0VsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpO1xuICAgIH1cbiAgfSxcbiAgX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQ6IGZ1bmN0aW9uIF9DcmVhdGVBbGVydExvYWRpbmdNc2dFbGVtZW50KGRvY29iaiwgZGlhbG9nSWQpIHtcbiAgICBpZiAodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkubGVuZ3RoID09IDApIHtcbiAgICAgIHZhciBkaWFsb2dFbGUgPSAkKFwiPGRpdiBpZD1cIiArIGRpYWxvZ0lkICsgXCIgdGl0bGU9J+ezu+e7n+aPkOekuicgc3R5bGU9J2Rpc3BsYXk6bm9uZSc+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2FsZXJ0bG9hZGluZy1pbWcnPjwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdhbGVydGxvYWRpbmctdHh0Jz48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAkKGRvY29iai5ib2R5KS5hcHBlbmQoZGlhbG9nRWxlKTtcbiAgICAgIHJldHVybiBkaWFsb2dFbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKTtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVJZnJtYWVEaWFsb2dFbGVtZW50OiBmdW5jdGlvbiBfQ3JlYXRlSWZybWFlRGlhbG9nRWxlbWVudChkb2NvYmosIGRpYWxvZ2lkLCB1cmwpIHtcbiAgICAvKnZhciBkaWFsb2dFbGUgPSAkKFwiPGRpdiBpZD1cIiArIGRpYWxvZ2lkICsgXCIgdGl0bGU9J0Jhc2ljIGRpYWxvZyc+XFxcclxuICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIG5hbWU9J2RpYWxvZ0lmcmFtZScgd2lkdGg9JzEwMCUnIGhlaWdodD0nOTglJyBmcmFtZWJvcmRlcj0nMCcgc3JjPSdcIiArIHVybCArIFwiJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvaWZyYW1lPlxcXHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIik7Ki9cbiAgICAvL+ebtOaOpeiuvue9rmlmcmFtZeeahHNyY+S8mumAoOaIkOS4gOasoeivt+axgmh0dHDnmoRjYW5jZWxlZC5cbiAgICB2YXIgZGlhbG9nRWxlID0gJChcIjxkaXYgaWQ9XCIgKyBkaWFsb2dpZCArIFwiIHRpdGxlPSdCYXNpYyBkaWFsb2cnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpZnJhbWUgbmFtZT0nZGlhbG9nSWZyYW1lJyB3aWR0aD0nMTAwJScgaGVpZ2h0PSc5OCUnIGZyYW1lYm9yZGVyPScwJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2lmcmFtZT5cXFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAkKGRvY29iai5ib2R5KS5hcHBlbmQoZGlhbG9nRWxlKTsgLy9hbGVydCh1cmwpO1xuXG4gICAgcmV0dXJuIGRpYWxvZ0VsZTtcbiAgfSxcbiAgX1Rlc3REaWFsb2dFbGVtSXNFeGlzdDogZnVuY3Rpb24gX1Rlc3REaWFsb2dFbGVtSXNFeGlzdChkaWFsb2dJZCkge1xuICAgIGlmICh0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIF9UZXN0UnVuRW5hYmxlOiBmdW5jdGlvbiBfVGVzdFJ1bkVuYWJsZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgQWxlcnRFcnJvcjogZnVuY3Rpb24gQWxlcnRFcnJvcihvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxtc2csIHNGdW5jKSB7XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgIHdpZHRoOiA2MDBcbiAgICB9O1xuICAgIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICB0aGlzLkFsZXJ0KG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGRlZmF1bHRDb25maWcsIGh0bWxtc2csIHNGdW5jKTtcbiAgfSxcbiAgQWxlcnRUZXh0OiBmdW5jdGlvbiBBbGVydFRleHQodGV4dCkge1xuICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCB0ZXh0LCBudWxsKTtcbiAgfSxcbiAgQWxlcnQ6IGZ1bmN0aW9uIEFsZXJ0KG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbG1zZywgc0Z1bmMpIHtcbiAgICAvL2RlYnVnZ2VyO1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlcmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIFwi5YWz6ZetXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvcGVuOiBmdW5jdGlvbiBvcGVuKCkge30sXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgICAgIGlmIChzRnVuYykge1xuICAgICAgICAgIHNGdW5jKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sbXNnKTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIEFsZXJ0SnNvbkNvZGU6IGZ1bmN0aW9uIEFsZXJ0SnNvbkNvZGUoanNvbikge1xuICAgIGpzb24gPSBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmdGb3JtYXQoanNvbik7XG4gICAganNvbiA9IGpzb24ucmVwbGFjZSgvJi9nLCAnJicpLnJlcGxhY2UoLzwvZywgJzwnKS5yZXBsYWNlKC8+L2csICc+Jyk7XG4gICAganNvbiA9IGpzb24ucmVwbGFjZSgvKFwiKFxcXFx1W2EtekEtWjAtOV17NH18XFxcXFtedV18W15cXFxcXCJdKSpcIihcXHMqOik/fFxcYih0cnVlfGZhbHNlfG51bGwpXFxifC0/XFxkKyg/OlxcLlxcZCopPyg/OltlRV1bK1xcLV0/XFxkKyk/KS9nLCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICAgIHZhciBjbHMgPSAnanNvbi1udW1iZXInO1xuXG4gICAgICBpZiAoL15cIi8udGVzdChtYXRjaCkpIHtcbiAgICAgICAgaWYgKC86JC8udGVzdChtYXRjaCkpIHtcbiAgICAgICAgICBjbHMgPSAnanNvbi1rZXknO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNscyA9ICdqc29uLXN0cmluZyc7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoL3RydWV8ZmFsc2UvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIGNscyA9ICdqc29uLWJvb2xlYW4nO1xuICAgICAgfSBlbHNlIGlmICgvbnVsbC8udGVzdChtYXRjaCkpIHtcbiAgICAgICAgY2xzID0gJ2pzb24tbnVsbCc7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAnPHNwYW4gY2xhc3M9XCInICsgY2xzICsgJ1wiPicgKyBtYXRjaCArICc8L3NwYW4+JztcbiAgICB9KTtcbiAgICB0aGlzLkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7XG4gICAgICB3aWR0aDogOTAwLFxuICAgICAgaGVpZ2h0OiA2MDBcbiAgICB9LCBcIjxwcmUgY2xhc3M9J2pzb24tcHJlJz5cIiArIGpzb24gKyBcIjwvcHJlPlwiLCBudWxsKTtcbiAgfSxcbiAgU2hvd0hUTUw6IGZ1bmN0aW9uIFNob3dIVE1MKG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbG1zZywgY2xvc2VfYWZ0ZXJfZXZlbnQsIHBhcmFtcykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlcmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNsb3NlX2FmdGVyX2V2ZW50KHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxtc2cpO1xuICAgIHJldHVybiAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIEFsZXJ0TG9hZGluZzogZnVuY3Rpb24gQWxlcnRMb2FkaW5nKG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbG1zZykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQob3BlcmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWVcbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuZmluZChcIi5hbGVydGxvYWRpbmctdHh0XCIpLmh0bWwoaHRtbG1zZyk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBDb25maXJtOiBmdW5jdGlvbiBDb25maXJtKG9wZXJlcldpbmRvdywgaHRtbG1zZywgb2tGbikge1xuICAgIHRoaXMuQ29uZmlybUNvbmZpZyhvcGVyZXJXaW5kb3csIGh0bWxtc2csIG51bGwsIG9rRm4pO1xuICB9LFxuICBDb25maXJtQ29uZmlnOiBmdW5jdGlvbiBDb25maXJtQ29uZmlnKG9wZXJlcldpbmRvdywgaHRtbG1zZywgY29uZmlnLCBva0ZuKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVyZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgXCJBbGVydENvbmZpcm1Nc2dcIik7XG5cbiAgICB2YXIgcGFyYXMgPSBudWxsO1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgb2tmdW5jOiBmdW5jdGlvbiBva2Z1bmMocGFyYXMpIHtcbiAgICAgICAgaWYgKG9rRm4gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIG9rRm4oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVyZXJXaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNhbmNlbGZ1bmM6IGZ1bmN0aW9uIGNhbmNlbGZ1bmMocGFyYXMpIHt9LFxuICAgICAgdmFsaWRhdGVmdW5jOiBmdW5jdGlvbiB2YWxpZGF0ZWZ1bmMocGFyYXMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgY2xvc2VhZnRlcmZ1bmM6IHRydWUsXG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdENvbmZpZy52YWxpZGF0ZWZ1bmMocGFyYXMpKSB7XG4gICAgICAgICAgICB2YXIgciA9IGRlZmF1bHRDb25maWcub2tmdW5jKHBhcmFzKTtcbiAgICAgICAgICAgIHIgPSByID09IG51bGwgPyB0cnVlIDogcjtcblxuICAgICAgICAgICAgaWYgKHIgJiYgZGVmYXVsdENvbmZpZy5jbG9zZWFmdGVyZnVuYykge1xuICAgICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgZGVmYXVsdENvbmZpZy5jYW5jZWxmdW5jKHBhcmFzKTtcblxuICAgICAgICAgIGlmIChkZWZhdWx0Q29uZmlnLmNsb3NlYWZ0ZXJmdW5jKSB7XG4gICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sbXNnKTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gICAgcGFyYXMgPSB7XG4gICAgICBcIkVsZW1lbnRPYmpcIjogaHRtbEVsZW1cbiAgICB9O1xuICB9LFxuICBQcm9tcHQ6IGZ1bmN0aW9uIFByb21wdChvcGVyZXJXaW5kb3csIGNvbmZpZywgZGlhbG9nSWQsIGxhYmVsTXNnLCBva0Z1bmMpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKG9wZXJlcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgcGFyYXMgPSBudWxsO1xuICAgIHZhciB0ZXh0QXJlYSA9ICQoXCI8dGV4dGFyZWEgLz5cIik7XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAvL2RlYnVnZ2VyO1xuICAgICAgICAgIGlmICh0eXBlb2Ygb2tGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgdmFyIGlucHV0VGV4dCA9IHRleHRBcmVhLnZhbCgpO1xuICAgICAgICAgICAgb2tGdW5jKGlucHV0VGV4dCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH0sXG4gICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJCh0ZXh0QXJlYSkuY3NzKFwiaGVpZ2h0XCIsIGRlZmF1bHRDb25maWcuaGVpZ2h0IC0gMTMwKTtcbiAgICB2YXIgaHRtbENvbnRlbnQgPSAkKFwiPGRpdj5cIiArIGxhYmVsTXNnICsgXCLvvJo8L2Rpdj5cIikuYXBwZW5kKHRleHRBcmVhKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxDb250ZW50KTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7IC8vZGlhbG9nLnRleHRBcmVhT2JqPXRleHRBcmVhO1xuICB9LFxuICBEaWFsb2dFbGVtOiBmdW5jdGlvbiBEaWFsb2dFbGVtKGVsZW0sIGNvbmZpZykge1xuICAgICQoZWxlbSkuZGlhbG9nKGNvbmZpZyk7XG4gIH0sXG4gIE9wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIE9wZW5JZnJhbWVXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICB2YXIgZGVmYXVsdG9wdGlvbnMgPSB7XG4gICAgICBoZWlnaHQ6IDQxMCxcbiAgICAgIHdpZHRoOiA2MDAsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHZhciBhdXRvZGlhbG9naWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgJCh0aGlzKS5maW5kKFwiaWZyYW1lXCIpLnJlbW92ZSgpO1xuICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgJCh0aGlzKS5kaWFsb2coXCJkZXN0cm95XCIpO1xuICAgICAgICAkKFwiI1wiICsgYXV0b2RpYWxvZ2lkKS5yZW1vdmUoKTtcblxuICAgICAgICBpZiAoQnJvd3NlckluZm9VdGlsaXR5LklzSUU4RG9jdW1lbnRNb2RlKCkpIHtcbiAgICAgICAgICBDb2xsZWN0R2FyYmFnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCQoXCIjRm9yZm9jdXNcIikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJChcIiNGb3Jmb2N1c1wiKVswXS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9OyAvL2RlYnVnZ2VyO1xuXG4gICAgaWYgKHdodHlwZSA9PSAxKSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDY4MCxcbiAgICAgICAgd2lkdGg6IDk4MFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gMikge1xuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgIHdpZHRoOiA4MDBcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDQpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICB3aWR0aDogNDgwXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA1KSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDE4MCxcbiAgICAgICAgd2lkdGg6IDMwMFxuICAgICAgfSk7XG4gICAgfSAvL+WmguaenOWuveW6pu+8jOmrmOW6puiuvue9ruS4ujDvvIzliJnoh6rliqjorr7nva7kuLrlhajlsY9cblxuXG4gICAgaWYgKG9wdGlvbnMud2lkdGggPT0gMCkge1xuICAgICAgb3B0aW9ucy53aWR0aCA9IFBhZ2VTdHlsZVV0aWwuR2V0UGFnZVdpZHRoKCkgLSAyMDtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5oZWlnaHQgPT0gMCkge1xuICAgICAgb3B0aW9ucy5oZWlnaHQgPSBQYWdlU3R5bGVVdGlsLkdldFBhZ2VIZWlnaHQoKSAtIDEwO1xuICAgIH1cblxuICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCBvcHRpb25zKTtcbiAgICB2YXIgYXV0b2RpYWxvZ2lkID0gZGlhbG9nSWQ7XG5cbiAgICB2YXIgZGlhbG9nRWxlID0gdGhpcy5fQ3JlYXRlSWZybWFlRGlhbG9nRWxlbWVudChvcGVuZXJ3aW5kb3cuZG9jdW1lbnQsIGF1dG9kaWFsb2dpZCwgdXJsKTtcblxuICAgIHZhciBkaWFsb2dPYmogPSAkKGRpYWxvZ0VsZSkuZGlhbG9nKGRlZmF1bHRvcHRpb25zKTtcbiAgICB2YXIgJGlmcmFtZW9iaiA9ICQoZGlhbG9nRWxlKS5maW5kKFwiaWZyYW1lXCIpO1xuICAgICRpZnJhbWVvYmouYXR0cihzcmMsIHVybCk7XG4gICAgJGlmcmFtZW9ialswXS5jb250ZW50V2luZG93LkZyYW1lV2luZG93SWQgPSBhdXRvZGlhbG9naWQ7XG4gICAgJGlmcmFtZW9ialswXS5jb250ZW50V2luZG93Lk9wZW5lcldpbmRvd09iaiA9IG9wZW5lcndpbmRvdztcbiAgICByZXR1cm4gZGlhbG9nT2JqO1xuICAgIC8qJGlmcmFtZW9iai5sb2FkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICB2YXIgZWxlbSA9ICQodGhpcykuY29udGVudHMoKS5maW5kKFwiaW5wdXQ6dGV4dDpmaXJzdFwiKTtcclxuICAgICAgICAgICAgaWYgKGVsZW0uYXR0cihcInJlYWRvbmx5XCIpICE9IFwicmVhZG9ubHlcIiYmIGVsZW0uYXR0cihcImRpc2FibGVkXCIpICE9IFwiZGlzYWJsZWRcIikge1xyXG4gICAgICAgICAgICAgICAgZWxlbVswXS5mb2N1cygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVsZW1zID0gJCh0aGlzKS5jb250ZW50cygpLmZpbmQoXCJpbnB1dDp0ZXh0XCIpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBlbGVtID0gJChlbGVtc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZW0uYXR0cihcInJlYWRvbmx5XCIpICE9IFwicmVhZG9ubHlcIiYmZWxlbS5hdHRyKFwiZGlzYWJsZWRcIikgIT0gXCJkaXNhYmxlZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1bMF0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7Ki9cbiAgfSxcbiAgQ2xvc2VPcGVuSWZyYW1lV2luZG93OiBmdW5jdGlvbiBDbG9zZU9wZW5JZnJhbWVXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCkge1xuICAgIC8vYWxlcnQoZGlhbG9nSWQpO1xuICAgIG9wZW5lcndpbmRvdy5PcGVuZXJXaW5kb3dPYmouRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhkaWFsb2dJZCk7XG4gIH0sXG4gIENsb3NlRGlhbG9nOiBmdW5jdGlvbiBDbG9zZURpYWxvZyhkaWFsb2dJZCkge1xuICAgIC8vZGVidWdnZXI7XG4gICAgdGhpcy5fR2V0RWxlbShkaWFsb2dJZCkuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcblxuICAgICQodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkpLmRpYWxvZyhcImNsb3NlXCIpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICgkKFwiI0ZvcmZvY3VzXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJChcIiNGb3Jmb2N1c1wiKVswXS5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0sXG4gIE9wZW5OZXdXaW5kb3c6IGZ1bmN0aW9uIE9wZW5OZXdXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICB2YXIgd2lkdGggPSBvcHRpb25zLndpZHRoO1xuICAgIHZhciBoZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcbiAgICB2YXIgbGVmdCA9IHBhcnNlSW50KChzY3JlZW4uYXZhaWxXaWR0aCAtIHdpZHRoKSAvIDIpLnRvU3RyaW5nKCk7XG4gICAgdmFyIHRvcCA9IHBhcnNlSW50KChzY3JlZW4uYXZhaWxIZWlnaHQgLSBoZWlnaHQpIC8gMikudG9TdHJpbmcoKTtcblxuICAgIGlmICh3aWR0aC50b1N0cmluZygpID09IFwiMFwiICYmIGhlaWdodC50b1N0cmluZygpID09IFwiMFwiKSB7XG4gICAgICB3aWR0aCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxXaWR0aCAtIDMwO1xuICAgICAgaGVpZ2h0ID0gd2luZG93LnNjcmVlbi5hdmFpbEhlaWdodCAtIDYwO1xuICAgICAgbGVmdCA9IFwiMFwiO1xuICAgICAgdG9wID0gXCIwXCI7XG4gICAgfVxuXG4gICAgdmFyIHdpbkhhbmRsZSA9IHdpbmRvdy5vcGVuKHVybCwgXCJcIiwgXCJzY3JvbGxiYXJzPW5vLHRvb2xiYXI9bm8sbWVudWJhcj1ubyxyZXNpemFibGU9eWVzLGNlbnRlcj15ZXMsaGVscD1ubywgc3RhdHVzPXllcyx0b3A9IFwiICsgdG9wICsgXCJweCxsZWZ0PVwiICsgbGVmdCArIFwicHgsd2lkdGg9XCIgKyB3aWR0aCArIFwicHgsaGVpZ2h0PVwiICsgaGVpZ2h0ICsgXCJweFwiKTtcblxuICAgIGlmICh3aW5IYW5kbGUgPT0gbnVsbCkge1xuICAgICAgYWxlcnQoXCLor7fop6PpmaTmtY/op4jlmajlr7nmnKzns7vnu5/lvLnlh7rnqpflj6PnmoTpmLvmraLorr7nva7vvIFcIik7XG4gICAgfVxuICB9LFxuICBfVHJ5R2V0UGFyZW50V2luZG93OiBmdW5jdGlvbiBfVHJ5R2V0UGFyZW50V2luZG93KHdpbikge1xuICAgIGlmICh3aW4ucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB3aW4ucGFyZW50O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBfRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmo6IGZ1bmN0aW9uIF9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih3aW4sIHRyeWZpbmR0aW1lLCBjdXJyZW50dHJ5ZmluZHRpbWUpIHtcbiAgICBpZiAodHJ5ZmluZHRpbWUgPiBjdXJyZW50dHJ5ZmluZHRpbWUpIHtcbiAgICAgIC8vdmFyIGRvY3VtZW50ID0gd2luO1xuICAgICAgdmFyIGlzdG9wRnJhbWVwYWdlID0gZmFsc2U7XG4gICAgICBjdXJyZW50dHJ5ZmluZHRpbWUrKztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaXN0b3BGcmFtZXBhZ2UgPSB3aW4uSXNUb3BGcmFtZVBhZ2U7XG5cbiAgICAgICAgaWYgKGlzdG9wRnJhbWVwYWdlKSB7XG4gICAgICAgICAgcmV0dXJuIHdpbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmoodGhpcy5fVHJ5R2V0UGFyZW50V2luZG93KHdpbiksIHRyeWZpbmR0aW1lLCBjdXJyZW50dHJ5ZmluZHRpbWUpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih0aGlzLl9UcnlHZXRQYXJlbnRXaW5kb3cod2luKSwgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIF9PcGVuV2luZG93SW5GcmFtZVBhZ2U6IGZ1bmN0aW9uIF9PcGVuV2luZG93SW5GcmFtZVBhZ2Uob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICBpZiAoU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KGRpYWxvZ0lkKSkge1xuICAgICAgYWxlcnQoXCJkaWFsb2dJZOS4jeiDveS4uuepulwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB1cmwgPSBCYXNlVXRpbGl0eS5BcHBlbmRUaW1lU3RhbXBVcmwodXJsKTtcbiAgICB2YXIgYXV0b2RpYWxvZ2lkID0gXCJGcmFtZURpYWxvZ0VsZVwiICsgZGlhbG9nSWQ7XG5cbiAgICBpZiAoJCh0aGlzLkZyYW1lUGFnZVJlZi5kb2N1bWVudCkuZmluZChcIiNcIiArIGF1dG9kaWFsb2dpZCkubGVuZ3RoID09IDApIHtcbiAgICAgIHZhciBkaWFsb2dFbGUgPSB0aGlzLl9DcmVhdGVJZnJtYWVEaWFsb2dFbGVtZW50KHRoaXMuRnJhbWVQYWdlUmVmLmRvY3VtZW50LCBhdXRvZGlhbG9naWQsIHVybCk7XG5cbiAgICAgIHZhciBkZWZhdWx0b3B0aW9ucyA9IHtcbiAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCLns7vnu59cIixcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKGV2ZW50LCB1aSkge1xuICAgICAgICAgIHZhciBhdXRvZGlhbG9naWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgICAkKHRoaXMpLmZpbmQoXCJpZnJhbWVcIikucmVtb3ZlKCk7XG4gICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgJCh0aGlzKS5kaWFsb2coXCJkZXN0cm95XCIpO1xuICAgICAgICAgICQoXCIjXCIgKyBhdXRvZGlhbG9naWQpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgaWYgKEJyb3dzZXJJbmZvVXRpbGl0eS5Jc0lFOERvY3VtZW50TW9kZSgpKSB7XG4gICAgICAgICAgICBDb2xsZWN0R2FyYmFnZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmICh3aHR5cGUgPT0gMCkge1xuICAgICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTA7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAxKSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiA2ODAsXG4gICAgICAgICAgd2lkdGg6IDk4MFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDIpIHtcbiAgICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICB3aWR0aDogODAwXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNCkge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICAgIHdpZHRoOiA0ODBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA1KSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiAxODAsXG4gICAgICAgICAgd2lkdGg6IDMwMFxuICAgICAgICB9KTtcbiAgICAgIH0gLy/lpoLmnpzlrr3luqbvvIzpq5jluqborr7nva7kuLow77yM5YiZ6Ieq5Yqo6K6+572u5Li65YWo5bGPXG5cblxuICAgICAgaWYgKG9wdGlvbnMud2lkdGggPT0gMCkge1xuICAgICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5oZWlnaHQgPT0gMCkge1xuICAgICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTA7XG4gICAgICB9XG5cbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICQoZGlhbG9nRWxlKS5kaWFsb2coZGVmYXVsdG9wdGlvbnMpO1xuICAgICAgJChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgXCIxMDAwXCIpO1xuICAgICAgJChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIFwiMTAwMVwiKTtcbiAgICAgIHZhciAkaWZyYW1lb2JqID0gJChkaWFsb2dFbGUpLmZpbmQoXCJpZnJhbWVcIik7XG4gICAgICAkaWZyYW1lb2JqLmF0dHIoXCJzcmNcIiwgdXJsKTtcbiAgICAgICRpZnJhbWVvYmpbMF0uY29udGVudFdpbmRvdy5GcmFtZVdpbmRvd0lkID0gYXV0b2RpYWxvZ2lkO1xuICAgICAgJGlmcmFtZW9ialswXS5jb250ZW50V2luZG93Lk9wZW5lcldpbmRvd09iaiA9IG9wZW5lcndpbmRvdztcbiAgICAgICRpZnJhbWVvYmpbMF0uY29udGVudFdpbmRvdy5Jc09wZW5Gb3JGcmFtZSA9IHRydWU7XG4gICAgICAvKiRpZnJhbWVvYmoubG9hZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAvL2FsZXJ0KCQodGhpcykuY29udGVudHMoKS5maW5kKFwiaW5wdXRcIikubGVuZ3RoKTtcclxuICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgLy9kZWJ1Z2dlcjtcclxuICAgICAgICAgICAgICAvL3ZhciBlbGVtPSQodGhpcykuY29udGVudHMoKS5maW5kKFwiaW5wdXQ6Zmlyc3RcIilbMF0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICB2YXIgZWxlbSA9ICQodGhpcykuY29udGVudHMoKS5maW5kKFwiaW5wdXQ6dGV4dDpmaXJzdFwiKTtcclxuICAgICAgICAgICAgICBpZiAoZWxlbS5hdHRyKFwicmVhZG9ubHlcIikgIT0gXCJyZWFkb25seVwiJiYgZWxlbS5hdHRyKFwiZGlzYWJsZWRcIikgIT0gXCJkaXNhYmxlZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgIGVsZW1bMF0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgIHZhciBlbGVtcyA9ICQodGhpcykuY29udGVudHMoKS5maW5kKFwiaW5wdXQ6dGV4dFwiKTtcclxuICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgdmFyIGVsZW0gPSAkKGVsZW1zW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGVtLmF0dHIoXCJyZWFkb25seVwiKSAhPSBcInJlYWRvbmx5XCImJmVsZW0uYXR0cihcImRpc2FibGVkXCIpICE9IFwiZGlzYWJsZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1bMF0uZm9jdXMoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgfSk7Ki9cbiAgICB9IGVsc2Uge1xuICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dpZCkuZGlhbG9nKFwibW92ZVRvVG9wXCIpO1xuICAgIH1cbiAgfSxcbiAgX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nOiBmdW5jdGlvbiBfRnJhbWVfRnJhbWVQYWdlQ2xvc2VEaWFsb2coZGlhbG9naWQpIHtcbiAgICAkKFwiI1wiICsgZGlhbG9naWQpLmRpYWxvZyhcImNsb3NlXCIpO1xuICB9LFxuICBGcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iajogZnVuY3Rpb24gRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKSB7XG4gICAgdmFyIHRyeWZpbmR0aW1lID0gNTtcbiAgICB2YXIgY3VycmVudHRyeWZpbmR0aW1lID0gMTtcbiAgICByZXR1cm4gdGhpcy5fRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luZG93LCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgfSxcbiAgRnJhbWVfQWxlcnQ6IGZ1bmN0aW9uIEZyYW1lX0FsZXJ0KCkge30sXG4gIEZyYW1lX0NvbWZpcm06IGZ1bmN0aW9uIEZyYW1lX0NvbWZpcm0oKSB7fSxcbiAgRnJhbWVfT3BlbklmcmFtZVdpbmRvdzogZnVuY3Rpb24gRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIHZhciB3cndpbiA9IHRoaXMuRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKTtcbiAgICB0aGlzLkZyYW1lUGFnZVJlZiA9IHdyd2luO1xuXG4gICAgaWYgKHdyd2luICE9IG51bGwpIHtcbiAgICAgIC8vYWxlcnQoXCJzaG93XCIpO1xuICAgICAgdGhpcy5GcmFtZVBhZ2VSZWYuRGlhbG9nVXRpbGl0eS5GcmFtZVBhZ2VSZWYgPSB3cndpbjtcblxuICAgICAgdGhpcy5GcmFtZVBhZ2VSZWYuRGlhbG9nVXRpbGl0eS5fT3BlbldpbmRvd0luRnJhbWVQYWdlKG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoXCLmib7kuI3liLBGcmFtZVBhZ2UhIVwiKTtcbiAgICB9XG4gIH0sXG4gIEZyYW1lX0Nsb3NlRGlhbG9nOiBmdW5jdGlvbiBGcmFtZV9DbG9zZURpYWxvZyhvcGVyZXJXaW5kb3cpIHtcbiAgICAvL2RlYnVnZ2VyO1xuICAgIHZhciB3cndpbiA9IHRoaXMuRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKTtcbiAgICB2YXIgb3BlbmVyd2luID0gb3BlcmVyV2luZG93Lk9wZW5lcldpbmRvd09iajtcbiAgICB2YXIgYXV0b2RpYWxvZ2lkID0gb3BlcmVyV2luZG93LkZyYW1lV2luZG93SWQ7XG5cbiAgICB3cndpbi5EaWFsb2dVdGlsaXR5Ll9GcmFtZV9GcmFtZVBhZ2VDbG9zZURpYWxvZyhhdXRvZGlhbG9naWQpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGljdGlvbmFyeVV0aWxpdHkgPSB7XG4gIF9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb246IG51bGwsXG4gIEdyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjogZnVuY3Rpb24gR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uKHNvdXJjZURpY3Rpb25hcnlKc29uKSB7XG4gICAgaWYgKHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbiA9PSBudWxsKSB7XG4gICAgICBpZiAoc291cmNlRGljdGlvbmFyeUpzb24gIT0gbnVsbCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgZm9yICh2YXIgZ3JvdXBWYWx1ZSBpbiBzb3VyY2VEaWN0aW9uYXJ5SnNvbikge1xuICAgICAgICAgIHJlc3VsdFtncm91cFZhbHVlXSA9IHt9O1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0W2dyb3VwVmFsdWVdW3NvdXJjZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2ldLmRpY3RWYWx1ZV0gPSBzb3VyY2VEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtpXS5kaWN0VGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24gPSByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNvbnNvbGUgPSBjb25zb2xlIHx8IHtcbiAgbG9nOiBmdW5jdGlvbiBsb2coKSB7fSxcbiAgd2FybjogZnVuY3Rpb24gd2FybigpIHt9LFxuICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7fVxufTsgLy/ph43lhplEYXRl5pa55rOV77yM6Kej5YazVDE2OjAwOjAwLjAwMFrpl67pophcblxuZnVuY3Rpb24gRGF0ZUV4dGVuZF9EYXRlRm9ybWF0KGRhdGUsIGZtdCkge1xuICBpZiAobnVsbCA9PSBkYXRlIHx8IHVuZGVmaW5lZCA9PSBkYXRlKSByZXR1cm4gJyc7XG4gIHZhciBvID0ge1xuICAgIFwiTStcIjogZGF0ZS5nZXRNb250aCgpICsgMSxcbiAgICAvL+aciOS7vVxuICAgIFwiZCtcIjogZGF0ZS5nZXREYXRlKCksXG4gICAgLy/ml6VcbiAgICBcImgrXCI6IGRhdGUuZ2V0SG91cnMoKSxcbiAgICAvL+Wwj+aXtlxuICAgIFwibStcIjogZGF0ZS5nZXRNaW51dGVzKCksXG4gICAgLy/liIZcbiAgICBcInMrXCI6IGRhdGUuZ2V0U2Vjb25kcygpLFxuICAgIC8v56eSXG4gICAgXCJTXCI6IGRhdGUuZ2V0TWlsbGlzZWNvbmRzKCkgLy/mr6vnp5JcblxuICB9O1xuICBpZiAoLyh5KykvLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAoZGF0ZS5nZXRGdWxsWWVhcigpICsgXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSk7XG5cbiAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCBSZWdFeHAuJDEubGVuZ3RoID09IDEgPyBvW2tdIDogKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aCkpO1xuICB9XG5cbiAgcmV0dXJuIGZtdDtcbn1cblxuRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gRGF0ZUV4dGVuZF9EYXRlRm9ybWF0KHRoaXMsICd5eXl5LU1NLWRkIG1tOmhoOnNzJyk7XG59OyAvL+aJqeWxlWpz5a+56LGh5Yqf6IO9XG5cblxuaWYgKCFPYmplY3QuY3JlYXRlKSB7XG4gIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgYWxlcnQoXCJFeHRlbmQgT2JqZWN0LmNyZWF0ZVwiKTtcblxuICAgIGZ1bmN0aW9uIEYoKSB7fVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09iamVjdC5jcmVhdGUgaW1wbGVtZW50YXRpb24gb25seSBhY2NlcHRzIG9uZSBwYXJhbWV0ZXIuJyk7XG4gICAgICB9XG5cbiAgICAgIEYucHJvdG90eXBlID0gbztcbiAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH07XG4gIH0oKTtcbn1cblxuJC5mbi5vdXRlckhUTUwgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIElFLCBDaHJvbWUgJiBTYWZhcmkgd2lsbCBjb21wbHkgd2l0aCB0aGUgbm9uLXN0YW5kYXJkIG91dGVySFRNTCwgYWxsIG90aGVycyAoRkYpIHdpbGwgaGF2ZSBhIGZhbGwtYmFjayBmb3IgY2xvbmluZ1xuICByZXR1cm4gIXRoaXMubGVuZ3RoID8gdGhpcyA6IHRoaXNbMF0ub3V0ZXJIVE1MIHx8IGZ1bmN0aW9uIChlbCkge1xuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZWwuY2xvbmVOb2RlKHRydWUpKTtcbiAgICB2YXIgY29udGVudHMgPSBkaXYuaW5uZXJIVE1MO1xuICAgIGRpdiA9IG51bGw7XG4gICAgYWxlcnQoY29udGVudHMpO1xuICAgIHJldHVybiBjb250ZW50cztcbiAgfSh0aGlzWzBdKTtcbn07XG5cbmZ1bmN0aW9uIHJlZkNzc0xpbmsoaHJlZikge1xuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgc3R5bGUucmVsID0gJ3N0eWxlc2hlZXQnO1xuICBzdHlsZS5ocmVmID0gaHJlZjtcbiAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIHJldHVybiBzdHlsZS5zaGVldCB8fCBzdHlsZS5zdHlsZVNoZWV0O1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG4vL0pzb27mk43kvZzlt6XlhbfnsbtcbnZhciBKc29uVXRpbGl0eSA9IHtcbiAgUGFyc2VBcnJheUpzb25Ub1RyZWVKc29uOiBmdW5jdGlvbiBQYXJzZUFycmF5SnNvblRvVHJlZUpzb24oY29uZmlnLCBzb3VyY2VBcnJheSwgcm9vdElkKSB7XG4gICAgdmFyIF9jb25maWcgPSB7XG4gICAgICBLZXlGaWVsZDogXCJcIixcbiAgICAgIFJlbGF0aW9uRmllbGQ6IFwiXCIsXG4gICAgICBDaGlsZEZpZWxkTmFtZTogXCJcIlxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBGaW5kSnNvbkJ5SWQoa2V5RmllbGQsIGlkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VBcnJheVtpXVtrZXlGaWVsZF0gPT0gaWQpIHtcbiAgICAgICAgICByZXR1cm4gc291cmNlQXJyYXlbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYWxlcnQoXCJQYXJzZUFycmF5SnNvblRvVHJlZUpzb24uRmluZEpzb25CeUlkOuWcqHNvdXJjZUFycmF55Lit5om+5LiN5Yiw5oyH5a6aSWTnmoTorrDlvZVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRmluZENoaWxkSnNvbihyZWxhdGlvbkZpZWxkLCBwaWQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc291cmNlQXJyYXlbaV1bcmVsYXRpb25GaWVsZF0gPT0gcGlkKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc291cmNlQXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRmluZENoaWxkTm9kZUFuZFBhcnNlKHBpZCwgcmVzdWx0KSB7XG4gICAgICB2YXIgY2hpbGRqc29ucyA9IEZpbmRDaGlsZEpzb24oY29uZmlnLlJlbGF0aW9uRmllbGQsIHBpZCk7XG5cbiAgICAgIGlmIChjaGlsZGpzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHJlc3VsdFtjb25maWcuQ2hpbGRGaWVsZE5hbWVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlc3VsdFtjb25maWcuQ2hpbGRGaWVsZE5hbWVdID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkanNvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgdG9PYmogPSB7fTtcbiAgICAgICAgICB0b09iaiA9IEpzb25VdGlsaXR5LlNpbXBsZUNsb25lQXR0cih0b09iaiwgY2hpbGRqc29uc1tpXSk7XG4gICAgICAgICAgcmVzdWx0W2NvbmZpZy5DaGlsZEZpZWxkTmFtZV0ucHVzaCh0b09iaik7XG4gICAgICAgICAgdmFyIGlkID0gdG9PYmpbY29uZmlnLktleUZpZWxkXTtcbiAgICAgICAgICBGaW5kQ2hpbGROb2RlQW5kUGFyc2UoaWQsIHRvT2JqKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgcm9vdEpzb24gPSBGaW5kSnNvbkJ5SWQoY29uZmlnLktleUZpZWxkLCByb290SWQpO1xuICAgIHJlc3VsdCA9IHRoaXMuU2ltcGxlQ2xvbmVBdHRyKHJlc3VsdCwgcm9vdEpzb24pO1xuICAgIEZpbmRDaGlsZE5vZGVBbmRQYXJzZShyb290SWQsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgUmVzb2x2ZVNpbXBsZUFycmF5SnNvblRvVHJlZUpzb246IGZ1bmN0aW9uIFJlc29sdmVTaW1wbGVBcnJheUpzb25Ub1RyZWVKc29uKGNvbmZpZywgc291cmNlSnNvbiwgcm9vdE5vZGVJZCkge1xuICAgIGFsZXJ0KFwiSnNvblV0aWxpdHkuUmVzb2x2ZVNpbXBsZUFycmF5SnNvblRvVHJlZUpzb24g5bey5YGc55SoXCIpO1xuICB9LFxuICBTaW1wbGVDbG9uZUF0dHI6IGZ1bmN0aW9uIFNpbXBsZUNsb25lQXR0cih0b09iaiwgZnJvbU9iaikge1xuICAgIGZvciAodmFyIGF0dHIgaW4gZnJvbU9iaikge1xuICAgICAgdG9PYmpbYXR0cl0gPSBmcm9tT2JqW2F0dHJdO1xuICAgIH1cblxuICAgIHJldHVybiB0b09iajtcbiAgfSxcbiAgQ2xvbmVTaW1wbGU6IGZ1bmN0aW9uIENsb25lU2ltcGxlKHNvdXJjZSkge1xuICAgIHZhciBuZXdKc29uID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgc291cmNlKTtcbiAgICByZXR1cm4gbmV3SnNvbjtcbiAgfSxcbiAgSnNvblRvU3RyaW5nOiBmdW5jdGlvbiBKc29uVG9TdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0sXG4gIEpzb25Ub1N0cmluZ0Zvcm1hdDogZnVuY3Rpb24gSnNvblRvU3RyaW5nRm9ybWF0KG9iaikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpO1xuICB9LFxuICBTdHJpbmdUb0pzb246IGZ1bmN0aW9uIFN0cmluZ1RvSnNvbihzdHIpIHtcbiAgICByZXR1cm4gZXZhbChcIihcIiArIHN0ciArIFwiKVwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLy/liJfooajpobXpnaLlpITnkIblt6XlhbfnsbtcbnZhciBMaXN0UGFnZVV0aWxpdHkgPSB7XG4gIEdldEdlbmVyYWxQYWdlSGVpZ2h0OiBmdW5jdGlvbiBHZXRHZW5lcmFsUGFnZUhlaWdodChmaXhIZWlnaHQpIHtcbiAgICB2YXIgcGFnZUhlaWdodCA9IGpRdWVyeShkb2N1bWVudCkuaGVpZ2h0KCk7IC8vYWxlcnQocGFnZUhlaWdodCk7XG4gICAgLy9hbGVydChwYWdlSGVpZ2h0KTtcblxuICAgIGlmICgkKFwiI2xpc3Qtc2ltcGxlLXNlYXJjaC13cmFwXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIC8vYWxlcnQoJChcIiNsaXN0LWJ1dHRvbi13cmFwXCIpLmhlaWdodCgpK1wifHxcIiskKFwiI2xpc3Qtc2ltcGxlLXNlYXJjaC13cmFwXCIpLm91dGVySGVpZ2h0KCkpO1xuICAgICAgcGFnZUhlaWdodCA9IHBhZ2VIZWlnaHQgLSAkKFwiI2xpc3Qtc2ltcGxlLXNlYXJjaC13cmFwXCIpLm91dGVySGVpZ2h0KCkgKyBmaXhIZWlnaHQgLSAkKFwiI2xpc3QtYnV0dG9uLXdyYXBcIikub3V0ZXJIZWlnaHQoKSAtICQoXCIjbGlzdC1wYWdlci13cmFwXCIpLm91dGVySGVpZ2h0KCkgLSAzMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFnZUhlaWdodCA9IHBhZ2VIZWlnaHQgLSAkKFwiI2xpc3QtYnV0dG9uLXdyYXBcIikub3V0ZXJIZWlnaHQoKSArIGZpeEhlaWdodCAtICQoXCIjbGlzdC1wYWdlci13cmFwXCIpLm91dGVySGVpZ2h0KCkgLSAzMDtcbiAgICB9IC8vYWxlcnQocGFnZUhlaWdodCk7XG5cblxuICAgIHJldHVybiBwYWdlSGVpZ2h0O1xuICB9LFxuICBHZXRGaXhIZWlnaHQ6IGZ1bmN0aW9uIEdldEZpeEhlaWdodCgpIHtcbiAgICByZXR1cm4gLTcwO1xuICB9LFxuICBJVmlld1RhYmxlUmVuZGVyZXI6IHtcbiAgICBUb0RhdGVZWVlZX01NX0REOiBmdW5jdGlvbiBUb0RhdGVZWVlZX01NX0REKGgsIGRhdGV0aW1lKSB7XG4gICAgICAvL2RlYnVnZ2VyO1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRldGltZSk7XG4gICAgICB2YXIgZGF0ZVN0ciA9IERhdGVVdGlsaXR5LkZvcm1hdChkYXRlLCAneXl5eS1NTS1kZCcpOyAvL3ZhciBkYXRlU3RyPWRhdGV0aW1lLnNwbGl0KFwiIFwiKVswXTtcblxuICAgICAgcmV0dXJuIGgoJ2RpdicsIGRhdGVTdHIpO1xuICAgIH0sXG4gICAgU3RyaW5nVG9EYXRlWVlZWV9NTV9ERDogZnVuY3Rpb24gU3RyaW5nVG9EYXRlWVlZWV9NTV9ERChoLCBkYXRldGltZSkge1xuICAgICAgLy9kZWJ1Z2dlcjtcbiAgICAgIC8vZGVidWdnZXI7XG4gICAgICAvL3ZhciBkYXRlPW5ldyBEYXRlKGRhdGV0aW1lKTtcbiAgICAgIC8vdmFyIGRhdGVTdHI9RGF0ZVV0aWxpdHkuRm9ybWF0KGRhdGUsJ3l5eXktTU0tZGQnKTtcbiAgICAgIHZhciBkYXRlU3RyID0gZGF0ZXRpbWUuc3BsaXQoXCIgXCIpWzBdO1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIGRhdGVTdHIpO1xuICAgIH0sXG4gICAgVG9TdGF0dXNFbmFibGU6IGZ1bmN0aW9uIFRvU3RhdHVzRW5hYmxlKGgsIHN0YXR1cykge1xuICAgICAgaWYgKHN0YXR1cyA9PSAwKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuemgeeUqFwiKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IDEpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5ZCv55SoXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgVG9ZZXNOb0VuYWJsZTogZnVuY3Rpb24gVG9ZZXNOb0VuYWJsZShoLCBzdGF0dXMpIHtcbiAgICAgIGlmIChzdGF0dXMgPT0gMCkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLlkKZcIik7XG4gICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PSAxKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaYr1wiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFRvRGljdGlvbmFyeVRleHQ6IGZ1bmN0aW9uIFRvRGljdGlvbmFyeVRleHQoaCwgZGljdGlvbmFyeUpzb24sIGdyb3VwVmFsdWUsIGRpY3Rpb25hcnlWYWx1ZSkge1xuICAgICAgLy9kZWJ1Z2dlcjtcbiAgICAgIHZhciBzaW1wbGVEaWN0aW9uYXJ5SnNvbiA9IERpY3Rpb25hcnlVdGlsaXR5Lkdyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbihkaWN0aW9uYXJ5SnNvbik7XG5cbiAgICAgIGlmIChkaWN0aW9uYXJ5VmFsdWUgPT0gbnVsbCB8fCBkaWN0aW9uYXJ5VmFsdWUgPT0gXCJcIikge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCJcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHNpbXBsZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdKSB7XG4gICAgICAgICAgaWYgKHNpbXBsZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2RpY3Rpb25hcnlWYWx1ZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtkaWN0aW9uYXJ5VmFsdWVdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5om+5LiN5Yiw6KOF5o2i55qEVEVYVFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5om+5LiN5Yiw6KOF5o2i55qE5YiG57uEXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLmib7kuI3liLDoo4XmjaLnmoTliIbnu4RcIik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZDogZnVuY3Rpb24gSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWQoc2VsZWN0aW9uUm93cykge1xuICAgIGlmIChzZWxlY3Rpb25Sb3dzICE9IG51bGwgJiYgc2VsZWN0aW9uUm93cy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHtcbiAgICAgICAgICBmdW5jKHNlbGVjdGlvblJvd3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInkuK3pnIDopoHmk43kvZznmoTooYwhXCIsIG51bGwpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7fVxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkT25lOiBmdW5jdGlvbiBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZShzZWxlY3Rpb25Sb3dzKSB7XG4gICAgaWYgKHNlbGVjdGlvblJvd3MgIT0gbnVsbCAmJiBzZWxlY3Rpb25Sb3dzLmxlbmd0aCA+IDAgJiYgc2VsZWN0aW9uUm93cy5sZW5ndGggPT0gMSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7XG4gICAgICAgICAgZnVuYyhzZWxlY3Rpb25Sb3dzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5Lit6ZyA6KaB5pON5L2c55qE6KGM77yM5q+P5qyh5Y+q6IO96YCJ5Lit5LiA6KGMIVwiLCBudWxsKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge31cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBJVmlld0NoYW5nZVNlcnZlclN0YXR1czogZnVuY3Rpb24gSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXModXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCBzdGF0dXNOYW1lLCBwYWdlQXBwT2JqKSB7XG4gICAgdmFyIGlkQXJyYXkgPSBuZXcgQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0aW9uUm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWRBcnJheS5wdXNoKHNlbGVjdGlvblJvd3NbaV1baWRGaWVsZF0pO1xuICAgIH1cblxuICAgIEFqYXhVdGlsaXR5LlBvc3QodXJsLCB7XG4gICAgICBpZHM6IGlkQXJyYXkuam9pbihcIjtcIiksXG4gICAgICBzdGF0dXM6IHN0YXR1c05hbWVcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIHBhZ2VBcHBPYmoucmVsb2FkRGF0YSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LCBcImpzb25cIik7XG4gIH0sXG4gIC8v5LiK5LiL56e75Yqo5bCB6KOFXG4gIElWaWV3TW92ZUZhY2U6IGZ1bmN0aW9uIElWaWV3TW92ZUZhY2UodXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCB0eXBlLCBwYWdlQXBwT2JqKSB7XG4gICAgdGhpcy5JVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZShzZWxlY3Rpb25Sb3dzKS50aGVuKGZ1bmN0aW9uIChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgICAvL2RlYnVnZ2VyO1xuICAgICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgICAgcmVjb3JkSWQ6IHNlbGVjdGlvblJvd3NbMF1baWRGaWVsZF0sXG4gICAgICAgIHR5cGU6IHR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgcGFnZUFwcE9iai5yZWxvYWREYXRhKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0pO1xuICB9LFxuICAvL+aUueWPmOeKtuaAgeWwgeijhVxuICBJVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2U6IGZ1bmN0aW9uIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZSh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHN0YXR1c05hbWUsIHBhZ2VBcHBPYmopIHtcbiAgICB0aGlzLklWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkKHNlbGVjdGlvblJvd3MpLnRoZW4oZnVuY3Rpb24gKHNlbGVjdGlvblJvd3MpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld0NoYW5nZVNlcnZlclN0YXR1cyh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHN0YXR1c05hbWUsIHBhZ2VBcHBPYmopO1xuICAgIH0pO1xuICB9LFxuICBJVmlld1RhYmxlRGVsZXRlUm93OiBmdW5jdGlvbiBJVmlld1RhYmxlRGVsZXRlUm93KHVybCwgcmVjb3JkSWQsIHBhZ2VBcHBPYmopIHtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOimgeWIoOmZpOW9k+WJjeiusOW9leWQl++8n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgICByZWNvcmRJZDogcmVjb3JkSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0pO1xuICB9LFxuICBJVmlld1RhYmxlTG9hZERhdGFTZWFyY2g6IGZ1bmN0aW9uIElWaWV3VGFibGVMb2FkRGF0YVNlYXJjaCh1cmwsIHBhZ2VOdW0sIHBhZ2VTaXplLCBzZWFyY2hDb25kaXRpb24sIHBhZ2VBcHBPYmosIGlkRmllbGQsIGF1dG9TZWxlY3RlZE9sZFJvd3MsIHN1Y2Nlc3NGdW5jLCBsb2FkRGljdCkge1xuICAgIC8vdmFyIGxvYWREaWN0PWZhbHNlO1xuICAgIC8vaWYocGFnZU51bT09PTEpIHtcbiAgICAvLyAgICBsb2FkRGljdCA9IHRydWU7XG4gICAgLy99XG4gICAgaWYgKGxvYWREaWN0ID09IHVuZGVmaW5lZCB8fCBsb2FkRGljdCA9PSBudWxsKSB7XG4gICAgICBsb2FkRGljdCA9IGZhbHNlO1xuICAgIH0gLy9kZWJ1Z2dlcjtcblxuXG4gICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgIFwicGFnZU51bVwiOiBwYWdlTnVtLFxuICAgICAgXCJwYWdlU2l6ZVwiOiBwYWdlU2l6ZSxcbiAgICAgIFwic2VhcmNoQ29uZGl0aW9uXCI6IFNlYXJjaFV0aWxpdHkuU2VyaWFsaXphdGlvblNlYXJjaENvbmRpdGlvbihzZWFyY2hDb25kaXRpb24pLFxuICAgICAgXCJsb2FkRGljdFwiOiBsb2FkRGljdFxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIHN1Y2Nlc3NGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN1Y2Nlc3NGdW5jKHJlc3VsdCwgcGFnZUFwcE9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIHBhZ2VBcHBPYmoucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGF1dG9TZWxlY3RlZE9sZFJvd3MpIHtcbiAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZUFwcE9iai50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzW2pdW2lkRmllbGRdID09IHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldW2lkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0RXJyb3Iod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfSxcbiAgSVZpZXdUYWJsZUxvYWREYXRhTm9TZWFyY2g6IGZ1bmN0aW9uIElWaWV3VGFibGVMb2FkRGF0YU5vU2VhcmNoKHVybCwgcGFnZU51bSwgcGFnZVNpemUsIHBhZ2VBcHBPYmosIGlkRmllbGQsIGF1dG9TZWxlY3RlZE9sZFJvd3MsIHN1Y2Nlc3NGdW5jKSB7XG4gICAgLy9kZWJ1Z2dlcjtcbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgcGFnZU51bTogcGFnZU51bSxcbiAgICAgIHBhZ2VTaXplOiBwYWdlU2l6ZVxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIHBhZ2VBcHBPYmoucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGF1dG9TZWxlY3RlZE9sZFJvd3MpIHtcbiAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZUFwcE9iai50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzW2pdW2lkRmllbGRdID09IHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldW2lkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBzdWNjZXNzRnVuYyhyZXN1bHQsIHBhZ2VBcHBPYmopO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld1RhYmxlSW5uZXJCdXR0b246IHtcbiAgICBWaWV3QnV0dG9uOiBmdW5jdGlvbiBWaWV3QnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIGxpc3Qtcm93LWJ1dHRvbi12aWV3XCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai52aWV3KHBhcmFtcy5yb3dbaWRGaWVsZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBFZGl0QnV0dG9uOiBmdW5jdGlvbiBFZGl0QnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIGxpc3Qtcm93LWJ1dHRvbi1lZGl0XCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5lZGl0KHBhcmFtcy5yb3dbaWRGaWVsZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBEZWxldGVCdXR0b246IGZ1bmN0aW9uIERlbGV0ZUJ1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiBsaXN0LXJvdy1idXR0b24tZGVsXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgLy9kZWJ1Z2dlcjtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmouZGVsKHBhcmFtcy5yb3dbaWRGaWVsZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vL+mhtemdouagt+W8j+i+heWKqeWKn+iDveexu1xudmFyIFBhZ2VTdHlsZVV0aWxpdHkgPSB7XG4gIEdldFBhZ2VIZWlnaHQ6IGZ1bmN0aW9uIEdldFBhZ2VIZWlnaHQoKSB7XG4gICAgcmV0dXJuIGpRdWVyeSh3aW5kb3cuZG9jdW1lbnQpLmhlaWdodCgpO1xuICB9LFxuICBHZXRQYWdlV2lkdGg6IGZ1bmN0aW9uIEdldFBhZ2VXaWR0aCgpIHtcbiAgICByZXR1cm4galF1ZXJ5KHdpbmRvdy5kb2N1bWVudCkud2lkdGgoKTtcbiAgfSxcbiAgR2V0V2luZG93SGVpZ2h0OiBmdW5jdGlvbiBHZXRXaW5kb3dIZWlnaHQoKSB7XG4gICAgcmV0dXJuICQod2luZG93KS5oZWlnaHQoKTtcbiAgfSxcbiAgR2V0V2luZG93V2lkdGg6IGZ1bmN0aW9uIEdldFdpbmRvd1dpZHRoKCkge1xuICAgIHJldHVybiAkKHdpbmRvdykud2lkdGgoKTtcbiAgfSxcbiAgR2V0TGlzdEJ1dHRvbk91dGVySGVpZ2h0OiBmdW5jdGlvbiBHZXRMaXN0QnV0dG9uT3V0ZXJIZWlnaHQoKSB7XG4gICAgYWxlcnQoXCJQYWdlU3R5bGVVdGlsaXR5LkdldExpc3RCdXR0b25PdXRlckhlaWdodCDlt7LlgZznlKhcIik7XG4gICAgcmV0dXJuIGpRdWVyeShcIi5saXN0LWJ1dHRvbi1vdXRlci1jXCIpLm91dGVySGVpZ2h0KCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8v5p+l6K+i5aSE55CG5bel5YW357G7XG52YXIgU2VhcmNoVXRpbGl0eSA9IHtcbiAgU2VhcmNoRmllbGRUeXBlOiB7XG4gICAgSW50VHlwZTogXCJJbnRUeXBlXCIsXG4gICAgTnVtYmVyVHlwZTogXCJOdW1iZXJUeXBlXCIsXG4gICAgRGF0YVR5cGU6IFwiRGF0ZVR5cGVcIixcbiAgICBMaWtlU3RyaW5nVHlwZTogXCJMaWtlU3RyaW5nVHlwZVwiLFxuICAgIExlZnRMaWtlU3RyaW5nVHlwZTogXCJMZWZ0TGlrZVN0cmluZ1R5cGVcIixcbiAgICBSaWdodExpa2VTdHJpbmdUeXBlOiBcIlJpZ2h0TGlrZVN0cmluZ1R5cGVcIixcbiAgICBTdHJpbmdUeXBlOiBcIlN0cmluZ1R5cGVcIixcbiAgICBEYXRhU3RyaW5nVHlwZTogXCJEYXRlU3RyaW5nVHlwZVwiLFxuICAgIEFycmF5TGlrZVN0cmluZ1R5cGU6IFwiQXJyYXlMaWtlU3RyaW5nVHlwZVwiXG4gIH0sXG4gIFNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb246IGZ1bmN0aW9uIFNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb24oc2VhcmNoQ29uZGl0aW9uKSB7XG4gICAgdmFyIHNlYXJjaENvbmRpdGlvbkNsb25lID0gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUoc2VhcmNoQ29uZGl0aW9uKTsgLy9kZWJ1Z2dlcjtcblxuICAgIGZvciAodmFyIGtleSBpbiBzZWFyY2hDb25kaXRpb25DbG9uZSkge1xuICAgICAgaWYgKHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udHlwZSA9PSBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5BcnJheUxpa2VTdHJpbmdUeXBlKSB7XG4gICAgICAgIGlmIChzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlICE9IG51bGwgJiYgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSA9IHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUuam9pbihcIjtcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IC8vZGVidWdnZXI7XG5cblxuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShzZWFyY2hDb25kaXRpb25DbG9uZSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBKQnVpbGQ0RFNlbGVjdFZpZXcgPSB7XG4gIFNlbGVjdEVudlZhcmlhYmxlOiB7XG4gICAgVVJMOiBcIi9QbGF0Rm9ybS9TZWxlY3RWaWV3L1NlbGVjdEVudlZhcmlhYmxlL1NlbGVjdFwiLFxuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdChpbnN0YW5jZU5hbWUpIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLlVSTCwge1xuICAgICAgICBcImluc3RhbmNlTmFtZVwiOiBpbnN0YW5jZU5hbWVcbiAgICAgIH0pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHRpdGxlOiBcIumAieaLqeWPmOmHj1wiLFxuICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdEluRnJhbWU6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0SW5GcmFtZShvcGVuZXIsIGluc3RhbmNlTmFtZSwgb3B0aW9uKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24odGhpcy5VUkwsIHtcbiAgICAgICAgXCJpbnN0YW5jZU5hbWVcIjogaW5zdGFuY2VOYW1lXG4gICAgICB9KTtcbiAgICAgIHZhciBvcHRpb24gPSAkLmV4dGVuZCh0cnVlLCB7fSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup5Y+Y6YePXCJcbiAgICAgIH0sIG9wdGlvbik7XG4gICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cob3BlbmVyLCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkMDUsIHVybCwgb3B0aW9uLCAxKTsgLy9hbGVydChcIjFcIik7XG5cbiAgICAgICQod2luZG93LnBhcmVudC5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgJCh3aW5kb3cucGFyZW50LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgIH0sXG4gICAgZm9ybWF0VGV4dDogZnVuY3Rpb24gZm9ybWF0VGV4dCh0eXBlLCB0ZXh0KSB7XG4gICAgICAvL2RlYnVnZ2VyO1xuICAgICAgaWYgKHR5cGUgPT0gXCJDb25zdFwiKSB7XG4gICAgICAgIHJldHVybiBcIumdmeaAgeWAvDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiRGF0ZVRpbWVcIikge1xuICAgICAgICByZXR1cm4gXCLml6XmnJ/ml7bpl7Q644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIkFwaVZhclwiKSB7XG4gICAgICAgIHJldHVybiBcIkFQSeWPmOmHjzrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiTnVtYmVyQ29kZVwiKSB7XG4gICAgICAgIHJldHVybiBcIuW6j+WPt+e8lueggTrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiSWRDb2RlclwiKSB7XG4gICAgICAgIHJldHVybiBcIuS4u+mUrueUn+aIkDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi44CQ5peg44CRXCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBcIuacquefpeexu+Wei1wiICsgdGV4dDtcbiAgICB9XG4gIH0sXG4gIFNlbGVjdEJpbmRUb0ZpZWxkOiB7XG4gICAgVVJMOiBcIi9QbGF0Rm9ybS9TZWxlY3RWaWV3L1NlbGVjdEJpbmRUb1RhYmxlRmllbGQvU2VsZWN0XCIsXG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KGluc3RhbmNlTmFtZSkge1xuICAgICAgdmFyIHVybCA9IHRoaXMuVVJMICsgXCI/aW5zdGFuY2VOYW1lPVwiICsgaW5zdGFuY2VOYW1lO1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHRpdGxlOiBcIumAieaLqeWPmOmHj1wiLFxuICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdEluRnJhbWU6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0SW5GcmFtZShvcGVuZXIsIGluc3RhbmNlTmFtZSwgb3B0aW9uKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24odGhpcy5VUkwsIHtcbiAgICAgICAgXCJpbnN0YW5jZU5hbWVcIjogaW5zdGFuY2VOYW1lXG4gICAgICB9KTtcbiAgICAgIHZhciBvcHRpb24gPSAkLmV4dGVuZCh0cnVlLCB7fSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup57uR5a6a5a2X5q61XCJcbiAgICAgIH0sIG9wdGlvbik7XG4gICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cob3BlbmVyLCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkMDUsIHVybCwgb3B0aW9uLCAxKTsgLy9hbGVydChcIjFcIik7XG5cbiAgICAgICQod2luZG93LnBhcmVudC5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgJCh3aW5kb3cucGFyZW50LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgIH1cbiAgfSxcbiAgU2VsZWN0VmFsaWRhdGVSdWxlOiB7XG4gICAgVVJMOiBcIi9QbGF0Rm9ybS9TZWxlY3RWaWV3L1NlbGVjdFZhbGlkYXRlUnVsZS9TZWxlY3RcIixcbiAgICBiZWdpblNlbGVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3QoaW5zdGFuY2VOYW1lKSB7XG4gICAgICB2YXIgdXJsID0gdGhpcy5VUkwgKyBcIj9pbnN0YW5jZU5hbWU9XCIgKyBpbnN0YW5jZU5hbWU7XG4gICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgdGl0bGU6IFwi6aqM6K+B6KeE5YiZXCIsXG4gICAgICAgIG1vZGFsOiB0cnVlXG4gICAgICB9LCAyKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0SW5GcmFtZTogZnVuY3Rpb24gYmVnaW5TZWxlY3RJbkZyYW1lKG9wZW5lciwgaW5zdGFuY2VOYW1lLCBvcHRpb24pIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLlVSTCwge1xuICAgICAgICBcImluc3RhbmNlTmFtZVwiOiBpbnN0YW5jZU5hbWVcbiAgICAgIH0pO1xuICAgICAgdmFyIG9wdGlvbiA9ICQuZXh0ZW5kKHRydWUsIHt9LCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCLpqozor4Hop4TliJlcIlxuICAgICAgfSwgb3B0aW9uKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXIsIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwNSwgdXJsLCBvcHRpb24sIDEpOyAvL2FsZXJ0KFwiMVwiKTtcblxuICAgICAgJCh3aW5kb3cucGFyZW50LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAkKHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG4vL+Wtl+espuS4suaTjeS9nOexu1xudmFyIFN0cmluZ1V0aWxpdHkgPSB7XG4gIEdldFRpbWVTdGFtcFVybDogZnVuY3Rpb24gR2V0VGltZVN0YW1wVXJsKHVybCkge1xuICAgIGFsZXJ0KFwi6L+B56e75YiwQmFzZVV0aWxpdHkuQXBwZW5kVGltZVN0YW1wVXJsXCIpO1xuICB9LFxuICBHZXRBbGxRdWVyeVN0cmluZzogZnVuY3Rpb24gR2V0QWxsUXVlcnlTdHJpbmcoKSB7XG4gICAgYWxlcnQoXCJTdHJpbmdVdGlsaXR5LkdldEFsbFF1ZXJ5U3RyaW5nIOW3suWBnOeUqFwiKTtcbiAgICAvKnZhciB1cmxTdHJpbmcgPSBkb2N1bWVudC5sb2NhdGlvbi5zZWFyY2g7XHJcbiAgICB2YXIgdXJsU3RyaW5nQXJyYXkgPSBbXTtcclxuICAgIGlmICh1cmxTdHJpbmcgIT0gbnVsbCkge1xyXG4gICAgICAgIHZhciBpdGVtQXJyYXkgPSB1cmxTdHJpbmcuc3BsaXQoXCImXCIpO1xyXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbUFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbUFycmF5W2ldO1xyXG4gICAgICAgICAgICB1cmxTdHJpbmdBcnJheS5wdXNoKHtOYW1lOiBpdGVtLnNwbGl0KFwiPVwiKVswXSwgVmFsdWU6IGl0ZW0uc3BsaXQoXCI9XCIpWzFdfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybFN0cmluZ0FycmF5OyovXG4gIH0sXG4gIFF1ZXJ5U3RyaW5nOiBmdW5jdGlvbiBRdWVyeVN0cmluZyhmaWVsZE5hbWUpIHtcbiAgICBhbGVydChcIui/geenu+WIsEJhc2VVdGlsaXR5LkdldFVybFBhcmFWYWx1ZVwiKTtcbiAgICAvKnZhciB1cmxTdHJpbmcgPSBkb2N1bWVudC5sb2NhdGlvbi5zZWFyY2g7XHJcbiAgICB3aGlsZSAodXJsU3RyaW5nLmluZGV4T2YoXCImIFwiKSA+PSAwKSB7XHJcbiAgICAgICAgdXJsU3RyaW5nID0gdXJsU3RyaW5nLnJlcGxhY2UoXCImIFwiLCBcIiZcIilcclxuICAgIH1cclxuICAgIHdoaWxlICh1cmxTdHJpbmcuaW5kZXhPZihcIj8gXCIpID49IDApIHtcclxuICAgICAgICB1cmxTdHJpbmcgPSB1cmxTdHJpbmcucmVwbGFjZShcIj8gXCIsIFwiP1wiKVxyXG4gICAgfVxyXG4gICAgaWYgKHVybFN0cmluZyAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIHR5cGVRdSA9IFwiP1wiICsgZmllbGROYW1lICsgXCI9XCI7XHJcbiAgICAgICAgdmFyIHVybEVuZCA9IHVybFN0cmluZy50b1VwcGVyQ2FzZSgpLmluZGV4T2YodHlwZVF1LnRvVXBwZXJDYXNlKCkpO1xyXG4gICAgICAgIGlmICh1cmxFbmQgPT0gLTEpIHtcclxuICAgICAgICAgICAgdHlwZVF1ID0gXCImXCIgKyBmaWVsZE5hbWUgKyBcIj1cIjtcclxuICAgICAgICAgICAgdXJsRW5kID0gdXJsU3RyaW5nLnRvVXBwZXJDYXNlKCkuaW5kZXhPZih0eXBlUXUudG9VcHBlckNhc2UoKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVybEVuZCAhPSAtMSkge1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1zVXJsID0gdXJsU3RyaW5nLnN1YnN0cmluZyh1cmxFbmQgKyB0eXBlUXUubGVuZ3RoKTtcclxuICAgICAgICAgICAgdmFyIGlzRW5kID0gcGFyYW1zVXJsLmluZGV4T2YoJyYnKTtcclxuICAgICAgICAgICAgaWYgKGlzRW5kICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW1zVXJsLnN1YnN0cmluZygwLCBpc0VuZClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbXNVcmxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSByZXR1cm4gXCJcIlxyXG4gICAgfSBlbHNlIHJldHVybiBcIlwiOyovXG4gIH0sXG4gIFF1ZXJ5U3RyaW5nVXJsU3RyaW5nOiBmdW5jdGlvbiBRdWVyeVN0cmluZ1VybFN0cmluZyhmaWVsZE5hbWUsIHVybFN0cmluZykge1xuICAgIGFsZXJ0KFwi6L+B56e75YiwQmFzZVV0aWxpdHkuR2V0VXJsUGFyYVZhbHVlQnlTdHJpbmdcIik7XG4gICAgLyp3aGlsZSAodXJsU3RyaW5nLmluZGV4T2YoXCImIFwiKSA+PSAwKSB7XHJcbiAgICAgICAgdXJsU3RyaW5nID0gdXJsU3RyaW5nLnJlcGxhY2UoXCImIFwiLCBcIiZcIilcclxuICAgIH1cclxuICAgIHdoaWxlICh1cmxTdHJpbmcuaW5kZXhPZihcIj8gXCIpID49IDApIHtcclxuICAgICAgICB1cmxTdHJpbmcgPSB1cmxTdHJpbmcucmVwbGFjZShcIj8gXCIsIFwiP1wiKVxyXG4gICAgfVxyXG4gICAgaWYgKHVybFN0cmluZyAhPSBudWxsKSB7XHJcbiAgICAgICAgdmFyIHR5cGVRdSA9IFwiP1wiICsgZmllbGROYW1lICsgXCI9XCI7XHJcbiAgICAgICAgdmFyIHVybEVuZCA9IHVybFN0cmluZy50b1VwcGVyQ2FzZSgpLmluZGV4T2YodHlwZVF1LnRvVXBwZXJDYXNlKCkpO1xyXG4gICAgICAgIGlmICh1cmxFbmQgPT0gLTEpIHtcclxuICAgICAgICAgICAgdHlwZVF1ID0gXCImXCIgKyBmaWVsZE5hbWUgKyBcIj1cIjtcclxuICAgICAgICAgICAgdXJsRW5kID0gdXJsU3RyaW5nLnRvVXBwZXJDYXNlKCkuaW5kZXhPZih0eXBlUXUudG9VcHBlckNhc2UoKSlcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHVybEVuZCAhPSAtMSkge1xyXG4gICAgICAgICAgICB2YXIgcGFyYW1zVXJsID0gdXJsU3RyaW5nLnN1YnN0cmluZyh1cmxFbmQgKyB0eXBlUXUubGVuZ3RoKTtcclxuICAgICAgICAgICAgdmFyIGlzRW5kID0gcGFyYW1zVXJsLmluZGV4T2YoJyYnKTtcclxuICAgICAgICAgICAgaWYgKGlzRW5kICE9IC0xKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcGFyYW1zVXJsLnN1YnN0cmluZygwLCBpc0VuZClcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBwYXJhbXNVcmxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSByZXR1cm4gXCJcIlxyXG4gICAgfSBlbHNlIHJldHVybiBcIlwiOyovXG4gIH0sXG4gIFhNTEVuY29kZTogZnVuY3Rpb24gWE1MRW5jb2RlKHN0cikge1xuICAgIGFsZXJ0KFwiU3RyaW5nVXRpbGl0eS5YTUxFbmNvZGUg5bey5YGc55SoXCIpO1xuICAgIC8qaWYgKHN0cikge1xyXG4gICAgICAgIHZhciByZTtcclxuICAgICAgICByZSA9IG5ldyBSZWdFeHAoXCImXCIsIFwiZ1wiKTtcclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShyZSwgXCImYW1wO1wiKTtcclxuICAgICAgICByZSA9IG5ldyBSZWdFeHAoXCI8XCIsIFwiZ1wiKTtcclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShyZSwgXCImbHQ7XCIpO1xyXG4gICAgICAgIHJlID0gbmV3IFJlZ0V4cChcIj5cIiwgXCJnXCIpO1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHJlLCBcIiZndDtcIik7XHJcbiAgICAgICAgcmUgPSBuZXcgUmVnRXhwKFwiJ1wiLCBcImdcIik7XHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocmUsIFwiJmFwb3M7XCIpO1xyXG4gICAgICAgIHJlID0gbmV3IFJlZ0V4cChcIlxcXCJcIiwgXCJnXCIpO1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHJlLCBcIiZxdW90O1wiKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdHI7Ki9cbiAgfSxcbiAgWE1MRGVDb2RlOiBmdW5jdGlvbiBYTUxEZUNvZGUoc3RyKSB7XG4gICAgYWxlcnQoXCJTdHJpbmdVdGlsaXR5LlhNTERlQ29kZSDlt7LlgZznlKhcIik7XG4gICAgLyppZiAoc3RyKSB7XHJcbiAgICAgICAgdmFyIHJlO1xyXG4gICAgICAgIHJlID0gbmV3IFJlZ0V4cChcIiZsdDtcIiwgXCJnXCIpO1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHJlLCBcIjxcIik7XHJcbiAgICAgICAgcmUgPSBuZXcgUmVnRXhwKFwiJmd0O1wiLCBcImdcIik7XHJcbiAgICAgICAgc3RyID0gc3RyLnJlcGxhY2UocmUsIFwiPlwiKTtcclxuICAgICAgICByZSA9IG5ldyBSZWdFeHAoXCImYXBvcztcIiwgXCJnXCIpO1xyXG4gICAgICAgIHN0ciA9IHN0ci5yZXBsYWNlKHJlLCBcIidcIik7XHJcbiAgICAgICAgcmUgPSBuZXcgUmVnRXhwKFwiJnF1b3Q7XCIsIFwiZ1wiKTtcclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShyZSwgXCJcXFwiXCIpO1xyXG4gICAgICAgIHJlID0gbmV3IFJlZ0V4cChcIiZhbXA7XCIsIFwiZ1wiKTtcclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShyZSwgXCImXCIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHN0cjsqL1xuICB9LFxuICBIVE1MRW5jb2RlOiBmdW5jdGlvbiBIVE1MRW5jb2RlKHN0cikge1xuICAgIGFsZXJ0KFwiU3RyaW5nVXRpbGl0eS5IVE1MRW5jb2RlIOW3suWBnOeUqFwiKTtcbiAgICAvKnZhciB0ZW1wID0gJChcIjxkaXYgLz5cIik7XHJcbiAgICB0ZW1wLnRleHQoc3RyKTtcclxuICAgIHJldHVybiB0ZW1wLmh0bWwoKTsqL1xuICB9LFxuICBIVE1MRGVjb2RlOiBmdW5jdGlvbiBIVE1MRGVjb2RlKHN0cikge1xuICAgIGFsZXJ0KFwiU3RyaW5nVXRpbGl0eS5IVE1MRGVjb2RlIOW3suWBnOeUqFwiKTtcbiAgICAvKnZhciB0ZW1wID0gJChcIjxkaXYgLz5cIik7XHJcbiAgICB0ZW1wLmh0bWwoc3RyKTtcclxuICAgIHJldHVybiB0ZW1wLnRleHQoKTsqL1xuICB9LFxuICBGb3JtYXQ6IGZ1bmN0aW9uIEZvcm1hdCgpIHtcbiAgICBhbGVydChcIlN0cmluZ1V0aWxpdHkuSFRNTERlY29kZSDlt7LlgZznlKhcIik7XG4gICAgLyppZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgIHZhciBzdHIgPSBhcmd1bWVudHNbMF07XHJcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciByZSA9IG5ldyBSZWdFeHAoJ1xcXFx7JyArIChpIC0gMSkgKyAnXFxcXH0nLCAnZ20nKTtcclxuICAgICAgICBzdHIgPSBzdHIucmVwbGFjZShyZSwgYXJndW1lbnRzW2ldKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzdHI7Ki9cbiAgfSxcbiAgR3VpZE5vdFNwbGl0OiBmdW5jdGlvbiBHdWlkTm90U3BsaXQoKSB7XG4gICAgYWxlcnQoXCJTdHJpbmdVdGlsaXR5Lkd1aWROb3RTcGxpdCDlt7LlgZznlKhcIik7XG4gIH0sXG4gIEd1aWRTcGxpdDogZnVuY3Rpb24gR3VpZFNwbGl0KHNwbGl0KSB7XG4gICAgdmFyIGd1aWQgPSBcIlwiO1xuXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzI7IGkrKykge1xuICAgICAgZ3VpZCArPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNi4wKS50b1N0cmluZygxNik7XG4gICAgICBpZiAoaSA9PSA4IHx8IGkgPT0gMTIgfHwgaSA9PSAxNiB8fCBpID09IDIwKSBndWlkICs9IHNwbGl0O1xuICAgIH1cblxuICAgIHJldHVybiBndWlkO1xuICB9LFxuICBHdWlkOiBmdW5jdGlvbiBHdWlkKCkge1xuICAgIHJldHVybiB0aGlzLkd1aWRTcGxpdChcIi1cIik7XG4gIH0sXG4gIFJUaW1lc3RhbXA6IGZ1bmN0aW9uIFJUaW1lc3RhbXAoKSB7XG4gICAgYWxlcnQoXCLov4Hnp7vliLBTdHJpbmdVdGlsaXR5LlRpbWVzdGFtcFwiKTtcbiAgICAvKnZhciBnZXRUaW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuICAgIC8vdmFyIG4gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxMDAuMCkudG9TdHJpbmcoNSk7XHJcbiAgICByZXR1cm4gZ2V0VGltZXN0YW1wLnRvU3RyaW5nKCkuc3Vic3RyKDQsIDkpOyovXG4gIH0sXG4gIFRpbWVzdGFtcDogZnVuY3Rpb24gVGltZXN0YW1wKCkge1xuICAgIHZhciB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICByZXR1cm4gdGltZXN0YW1wLnRvU3RyaW5nKCkuc3Vic3RyKDQsIDEwKTtcbiAgfSxcbiAgVHJpbTogZnVuY3Rpb24gVHJpbShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyheW+OAgFxcc10qKXwoW+OAgFxcc10qJCkvZywgXCJcIik7XG4gIH0sXG4gIExUcmltOiBmdW5jdGlvbiBMVHJpbShzdHIpIHtcbiAgICBhbGVydChcIlN0cmluZ1V0aWxpdHkuTFRyaW0g5bey5YGc55SoXCIpOyAvL3JldHVybiBzdHIucmVwbGFjZSgvKF5b44CAXFxzXSopL2csIFwiXCIpO1xuICB9LFxuICBSVHJpbTogZnVuY3Rpb24gUlRyaW0oc3RyKSB7XG4gICAgYWxlcnQoXCJTdHJpbmdVdGlsaXR5LlJUcmltIOW3suWBnOeUqFwiKTsgLy9yZXR1cm4gc3RyLnJlcGxhY2UoLyhb44CAXFxzXSokKS9nLCBcIlwiKTtcbiAgfSxcbiAgVHJpbUxhc3RDaGFyOiBmdW5jdGlvbiBUcmltTGFzdENoYXIoc3RyKSB7XG4gICAgYWxlcnQoXCLov4Hnp7vliLBTdHJpbmdVdGlsaXR5LlJlbW92ZUxhc3RDaGFyXCIpO1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKDAsIHN0ci5sZW5ndGggLSAxKTtcbiAgfSxcbiAgUmVtb3ZlTGFzdENoYXI6IGZ1bmN0aW9uIFJlbW92ZUxhc3RDaGFyKHN0cikge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKDAsIHN0ci5sZW5ndGggLSAxKTtcbiAgfSxcbiAgU3RyaW5nVG9Kc29uOiBmdW5jdGlvbiBTdHJpbmdUb0pzb24oc3RyKSB7XG4gICAgYWxlcnQoXCLov4Hnp7vliLBKc29uVXRpbGl0eS5TdHJpbmdUb0pzb25cIik7IC8vcmV0dXJuIGV2YWwoXCIoXCIgKyBzdHIgKyBcIilcIik7XG4gIH0sXG4gIExldmVsMUpzb25Ub1N0cmluZzogZnVuY3Rpb24gTGV2ZWwxSnNvblRvU3RyaW5nKGpzb25PYmopIHtcbiAgICBhbGVydChcIui/geenu+WIsEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZ1wiKTtcbiAgICAvKnZhciByZXN1bHQgPSBbXTtcclxuICAgIHJlc3VsdC5wdXNoKFwie1wiKTtcclxuICAgIGZvciAodmFyIGtleSBpbiBqc29uT2JqKSB7XHJcbiAgICAgICAgLy9hbGVydChrZXkrXCI6XFxcIlwiK2pzb25PYmpba2V5XS5yZXBsYWNlKC9cIi9nLFwiXFxcXFxcXCJcIikrXCJcXFwiLFwiKTtcclxuICAgICAgICAvL2FsZXJ0KFwiXFxcXFxcXCJcIik7XHJcbiAgICAgICAgLy9hbGVydCgpO1xyXG4gICAgICAgIGlmIChqUXVlcnkudHlwZShqc29uT2JqW2tleV0pID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goa2V5ICsgXCI6XFxcIlwiICsganNvbk9ialtrZXldLnJlcGxhY2UoL1wiL2csIFwiXFxcXFxcXCJcIikgKyBcIlxcXCIsXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNlIGlmIChqUXVlcnkudHlwZShqc29uT2JqW2tleV0pID09IFwiYXJyYXlcIikge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChrZXkgKyBcIjpbXCIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGpzb25PYmpba2V5XS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlubmpzb24gPSBqc29uT2JqW2tleV1baV07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLkxldmVsMUpzb25Ub1N0cmluZyhpbm5qc29uKSk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChcIixcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGpzb25PYmpba2V5XS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdID0gdGhpcy5UcmltTGFzdENoYXIocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goXCJdXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdLmluZGV4T2YoXCIsXCIpID09IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0ubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gPSB0aGlzLlRyaW1MYXN0Q2hhcihyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdKTtcclxuICAgIH1cclxuICAgIHJlc3VsdC5wdXNoKFwifVwiKTtcclxuICAgIHJldHVybiByZXN1bHQuam9pbihcIlwiKTsqL1xuICB9LFxuICBMZXZlbDFKc29uVG9TdHJpbmdLZXlTdHJpbmc6IGZ1bmN0aW9uIExldmVsMUpzb25Ub1N0cmluZ0tleVN0cmluZyhqc29uT2JqKSB7XG4gICAgYWxlcnQoXCLov4Hnp7vliLBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmdcIik7XG4gICAgLyp2YXIgcmVzdWx0ID0gW107XHJcbiAgICByZXN1bHQucHVzaChcIntcIik7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4ganNvbk9iaikge1xyXG4gICAgICAgIC8vYWxlcnQoa2V5K1wiOlxcXCJcIitqc29uT2JqW2tleV0ucmVwbGFjZSgvXCIvZyxcIlxcXFxcXFwiXCIpK1wiXFxcIixcIik7XHJcbiAgICAgICAgLy9hbGVydChcIlxcXFxcXFwiXCIpO1xyXG4gICAgICAgIC8vYWxlcnQoKTtcclxuICAgICAgICBpZiAoalF1ZXJ5LnR5cGUoanNvbk9ialtrZXldKSA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKFwiXFxcIlwiICsga2V5ICsgXCJcXFwiXCIgKyBcIjpcXFwiXCIgKyBqc29uT2JqW2tleV0ucmVwbGFjZSgvXCIvZywgXCJcXFxcXFxcIlwiKSArIFwiXFxcIixcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGpRdWVyeS50eXBlKGpzb25PYmpba2V5XSkgPT0gXCJhcnJheVwiKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKFwiXFxcIlwiICsga2V5ICsgXCJcXFwiXCIgKyBcIjpbXCIpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGpzb25PYmpba2V5XS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGlubmpzb24gPSBqc29uT2JqW2tleV1baV07XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLkxldmVsMUpzb25Ub1N0cmluZ0tleVN0cmluZyhpbm5qc29uKSk7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChcIixcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGpzb25PYmpba2V5XS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdID0gdGhpcy5UcmltTGFzdENoYXIocmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goXCJdXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdLmluZGV4T2YoXCIsXCIpID09IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0ubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gPSB0aGlzLlRyaW1MYXN0Q2hhcihyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdKTtcclxuICAgIH1cclxuICAgIHJlc3VsdC5wdXNoKFwifVwiKTtcclxuICAgIHJldHVybiByZXN1bHQuam9pbihcIlwiKTsqL1xuICB9LFxuICBMZXZlbDFKc29uVG9TdHJpbmdWYWx1ZUVuY29kZTogZnVuY3Rpb24gTGV2ZWwxSnNvblRvU3RyaW5nVmFsdWVFbmNvZGUoanNvbk9iaikge1xuICAgIGFsZXJ0KFwi6L+B56e75YiwSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nXCIpO1xuICAgIC8qdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgcmVzdWx0LnB1c2goXCJ7XCIpO1xyXG4gICAgZm9yICh2YXIga2V5IGluIGpzb25PYmopIHtcclxuICAgICAgICAvL2FsZXJ0KGtleStcIjpcXFwiXCIranNvbk9ialtrZXldLnJlcGxhY2UoL1wiL2csXCJcXFxcXFxcIlwiKStcIlxcXCIsXCIpO1xyXG4gICAgICAgIC8vYWxlcnQoXCJcXFxcXFxcIlwiKTtcclxuICAgICAgICAvL2FsZXJ0KCk7XHJcbiAgICAgICAgaWYgKGpRdWVyeS50eXBlKGpzb25PYmpba2V5XSkgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICByZXN1bHQucHVzaChrZXkgKyBcIjpcXFwiXCIgKyBlbmNvZGVVUklDb21wb25lbnQoanNvbk9ialtrZXldKSArIFwiXFxcIixcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGpRdWVyeS50eXBlKGpzb25PYmpba2V5XSkgPT0gXCJhcnJheVwiKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKGtleSArIFwiOltcIik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwganNvbk9ialtrZXldLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5uanNvbiA9IGpzb25PYmpba2V5XVtpXTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMuTGV2ZWwxSnNvblRvU3RyaW5nVmFsdWVFbmNvZGUoaW5uanNvbikpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goXCIsXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gPSB0aGlzLlRyaW1MYXN0Q2hhcihyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdKTtcclxuICAgICAgICAgICAgcmVzdWx0LnB1c2goXCJdXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGlmIChyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdLmluZGV4T2YoXCIsXCIpID09IHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0ubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoIC0gMV0gPSB0aGlzLlRyaW1MYXN0Q2hhcihyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdKTtcclxuICAgIH1cclxuICAgIHJlc3VsdC5wdXNoKFwifVwiKTtcclxuICAgIHJldHVybiByZXN1bHQuam9pbihcIlwiKTsqL1xuICB9LFxuICBMZXZlbDFTdHJpbmdUb0pzb25WYWx1ZURlY29kZTogZnVuY3Rpb24gTGV2ZWwxU3RyaW5nVG9Kc29uVmFsdWVEZWNvZGUoc3RyKSB7XG4gICAgYWxlcnQoXCLov4Hnp7vliLBKc29uVXRpbGl0eS5Kc29uVG9TdHJpbmdcIik7XG4gICAgLyp2YXIganNvbiA9IHRoaXMuU3RyaW5nVG9Kc29uKHN0cik7XHJcbiAgICBmb3IgKHZhciBrZXkgaW4ganNvbikge1xyXG4gICAgICAgIGlmIChqUXVlcnkudHlwZShqc29uW2tleV0pID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAganNvbltrZXldID0gZGVjb2RlVVJJQ29tcG9uZW50KGpzb25ba2V5XSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2UgaWYgKGpRdWVyeS50eXBlKGpzb25ba2V5XSkgPT0gXCJhcnJheVwiKSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwganNvbltrZXldLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5ub2JqID0ganNvbltrZXldW2ldO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaW5ua2V5IGluIGlubm9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlubm9ialtpbm5rZXldID0gZGVjb2RlVVJJQ29tcG9uZW50KGlubm9ialtpbm5rZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBqc29uOyovXG4gIH0sXG4gIEdldEJyaXRoZGF5QnlJZENhcmQ6IGZ1bmN0aW9uIEdldEJyaXRoZGF5QnlJZENhcmQoc3RyKSB7XG4gICAgYWxlcnQoXCJTdHJpbmdVdGlsaXR5LkdldEJyaXRoZGF5QnlJZENhcmQg5bey5YGc55SoXCIpO1xuICAgIC8qdmFyIHllYXIsIG1vbnRoLCBkYXk7XHJcbiAgICBpZiAoc3RyLmxlbmd0aCAhPSAxNSAmJiBzdHIubGVuZ3RoICE9IDE4KSB7XHJcbiAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICB9XHJcbiAgICBpZiAoc3RyLmxlbmd0aCA9PSAxNSkge1xyXG4gICAgICAgIHllYXIgPSBzdHIuc3Vic3RyaW5nKDYsIDgpO1xyXG4gICAgICAgIG1vbnRoID0gc3RyLnN1YnN0cmluZyg4LCAxMCk7XHJcbiAgICAgICAgZGF5ID0gc3RyLnN1YnN0cmluZygxMCwgMTIpO1xyXG4gICAgfVxyXG4gICAgZWxzZSBpZiAoc3RyLmxlbmd0aCA9PSAxOCkge1xyXG4gICAgICAgIHllYXIgPSBzdHIuc3Vic3RyaW5nKDYsIDEwKTtcclxuICAgICAgICBtb250aCA9IHN0ci5zdWJzdHJpbmcoMTAsIDEyKTtcclxuICAgICAgICBkYXkgPSBzdHIuc3Vic3RyaW5nKDEyLCAxNCk7XHJcbiAgICB9XHJcbiAgICBpZiAoeWVhci5sZW5ndGggPT0gMikgeWVhciA9IFwiMTlcIiArIHllYXI7XHJcbiAgICBpZiAobW9udGguaW5kZXhPZihcIjBcIikgPT0gMCkgbW9udGggPSBtb250aC5zdWJzdHJpbmcoMSk7XHJcbiAgICBpZiAoZGF5LmluZGV4T2YoXCIwXCIpID09IDApIGRheSA9IGRheS5zdWJzdHJpbmcoMSk7XHJcbiAgICByZXR1cm4geWVhciArIFwiLVwiICsgbW9udGggKyBcIi1cIiArIGRheTsqL1xuICB9LFxuICBHZXRTZXhCeUlkQ2FyZDogZnVuY3Rpb24gR2V0U2V4QnlJZENhcmQoc3RyKSB7XG4gICAgYWxlcnQoXCJTdHJpbmdVdGlsaXR5LkdldFNleEJ5SWRDYXJkIOW3suWBnOeUqFwiKTtcbiAgICAvKmlmIChwYXJzZUludChzdHIuc3Vic3RyKDE2LCAxKSkgJSAyID09IDEpIHtcclxuICAgICAgICByZXR1cm4gXCLnlLfmgKdcIjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIFwi5aWz5oCnXCI7XHJcbiAgICB9Ki9cbiAgfSxcbiAgSXNOdWxsT3JFbXB0eTogZnVuY3Rpb24gSXNOdWxsT3JFbXB0eShvYmopIHtcbiAgICByZXR1cm4gb2JqID09IHVuZGVmaW5lZCB8fCBvYmogPT0gXCJcIiB8fCBvYmogPT0gbnVsbCB8fCBvYmogPT0gXCJ1bmRlZmluZWRcIiB8fCBvYmogPT0gXCJudWxsXCI7XG4gIH0sXG4gIElzTnVsbE9yRW1wdHlPYmplY3Q6IGZ1bmN0aW9uIElzTnVsbE9yRW1wdHlPYmplY3Qob2JqKSB7XG4gICAgYWxlcnQoXCJTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHlPYmplY3Qg5bey5YGc55SoXCIpOyAvL3JldHVybiBvYmogPT0gdW5kZWZpbmVkIHx8IG9iaiA9PSBudWxsXG4gIH0sXG4gIEdldEZ1bnRpb25OYW1lOiBmdW5jdGlvbiBHZXRGdW50aW9uTmFtZShmdW5jKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09IFwiZnVuY3Rpb25cIiB8fCBfdHlwZW9mKGZ1bmMpID09IFwib2JqZWN0XCIpIHZhciBmTmFtZSA9IChcIlwiICsgZnVuYykubWF0Y2goL2Z1bmN0aW9uXFxzKihbXFx3XFwkXSopXFxzKlxcKC8pO1xuICAgIGlmIChmTmFtZSAhPT0gbnVsbCkgcmV0dXJuIGZOYW1lWzFdO1xuICB9LFxuICBUb0xvd2VyQ2FzZTogZnVuY3Rpb24gVG9Mb3dlckNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xuICB9LFxuICB0b1VwcGVyQ2FzZTogZnVuY3Rpb24gdG9VcHBlckNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpO1xuICB9LFxuICBQYWRkaW5nOiBmdW5jdGlvbiBQYWRkaW5nKG51bSwgbGVuZ3RoKSB7XG4gICAgYWxlcnQoXCJTdHJpbmdVdGlsaXR5LlBhZGRpbmcg5bey5YGc55SoXCIpO1xuICAgIC8qdmFyIGxlbiA9IChudW0gKyBcIlwiKS5sZW5ndGg7XHJcbiAgICB2YXIgZGlmZiA9IGxlbmd0aCAtIGxlbjtcclxuICAgIGlmKGRpZmYgPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5KGRpZmYpLmpvaW4oXCIwXCIpICsgbnVtO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bTsqL1xuICB9LFxuICBFbmRXaXRoOiBmdW5jdGlvbiBFbmRXaXRoKHN0ciwgZW5kU3RyKSB7XG4gICAgdmFyIGQgPSBzdHIubGVuZ3RoIC0gZW5kU3RyLmxlbmd0aDsgLy9hbGVydChzdHIubGFzdEluZGV4T2YoZW5kU3RyKT09ZCk7XG5cbiAgICByZXR1cm4gZCA+PSAwICYmIHN0ci5sYXN0SW5kZXhPZihlbmRTdHIpID09IGQ7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vWE1M5aSE55CG5bel5YW357G7XG52YXIgWE1MVXRpbGl0eSA9IHt9OyJdfQ==
