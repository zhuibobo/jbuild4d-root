"use strict";

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
      complete: function complete(msg) {},
      error: function error(msg) {
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
      complete: function complete(msg) {},
      error: function error(msg) {
        debugger;
      }
    });
  },
  Delete: function Delete(_url, sendData, func, dataType, contentType, isAsync) {
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
      type: "DELETE",
      url: url,
      cache: false,
      async: isAsync,
      contentType: contentType,
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
      complete: function complete(msg) {},
      error: function error(msg) {
        try {
          if (msg.responseText.indexOf("请重新登陆系统") >= 0) {
            BaseUtility.RedirectToLogin();
          }

          console.log(msg);
          DialogUtility.Alert(window, "AjaxUtility.Delete.Error", {}, "Ajax请求发生错误！" + "status:" + msg.status + ",responseText:" + msg.responseText, null);
        } catch (e) {}
      }
    });
    return innerResult;
  }
};
"use strict";

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
    alert("ReplaceUrlVariable迁移到BuildAction");
  },
  GetTopWindow: function GetTopWindow() {
    alert("BaseUtility.GetTopWindow 已停用");
  },
  TrySetControlFocus: function TrySetControlFocus() {
    alert("BaseUtility.TrySetControlFocus 已停用");
  },
  BuildUrl: function BuildUrl(url) {
    alert("BaseUtility.BuildUrl 已停用");
  },
  BuildView: function BuildView(action, para) {
    var urlPara = "";

    if (para) {
      urlPara = $.param(para);
    }

    var _url = this.GetRootPath() + action;

    if (urlPara != "") {
      _url += "?" + urlPara;
    }

    return this.AppendTimeStampUrl(_url);
  },
  BuildFrameInnerView: function BuildFrameInnerView(action, para) {
    var urlPara = "";

    if (para) {
      urlPara = $.param(para);
    }

    var _url = this.GetRootPath() + "/HTML/" + action;

    if (urlPara != "") {
      _url += "?" + urlPara;
    }

    return this.AppendTimeStampUrl(_url);
  },
  BuildAction: function BuildAction(action, para) {
    var urlPara = "";

    if (para) {
      urlPara = $.param(para);
    }

    var _url = this.GetRootPath() + action + ".do";

    if (urlPara != "") {
      _url += "?" + urlPara;
    }

    return this.AppendTimeStampUrl(_url);
  },
  RedirectToLogin: function RedirectToLogin() {
    var url = BaseUtility.GetRootPath() + "/PlatForm/LoginView.do";
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
  },
  CopyValueClipboard: function CopyValueClipboard(value) {
    var transfer = document.getElementById('J_CopyTransfer');

    if (!transfer) {
      transfer = document.createElement('textarea');
      transfer.id = 'J_CopyTransfer';
      transfer.style.position = 'absolute';
      transfer.style.left = '-9999px';
      transfer.style.top = '-9999px';
      transfer.style.zIndex = 9999;
      document.body.appendChild(transfer);
    }

    transfer.value = value;
    transfer.focus();
    transfer.select();
    document.execCommand('copy');
  }
};
"use strict";

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
  _CurrentUserInfo: null,
  GetCurrentUserInfo: function GetCurrentUserInfo() {
    if (this._CurrentUserInfo == null) {
      if (window.parent.CacheDataUtility._CurrentUserInfo != null) {
        return window.parent.CacheDataUtility._CurrentUserInfo;
      } else {
        AjaxUtility.PostSync("/PlatFormRest/MyInfo/GetUserInfo", {}, function (result) {
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
  SetCookie1Day: function SetCookie1Day(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },
  SetCookie1Month: function SetCookie1Month(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },
  SetCookie1Year: function SetCookie1Year(name, value) {
    var exp = new Date();
    exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 365 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";
  },
  GetCookie: function GetCookie(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr != null) return unescape(arr[2]);
    return null;
  },
  DelCookie: function DelCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = this.getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString() + ";path=/";
  }
};
"use strict";

var DateUtility = {
  GetCurrentDataString: function GetCurrentDataString(split) {
    alert("DateUtility.GetCurrentDataString 已停用");
  },
  DateFormat: function DateFormat(myDate, split) {
    alert("DateUtility.GetCurrentDataString 已停用");
  },
  Format: function Format(myDate, formatString) {
    var o = {
      "M+": myDate.getMonth() + 1,
      "d+": myDate.getDate(),
      "h+": myDate.getHours(),
      "m+": myDate.getMinutes(),
      "s+": myDate.getSeconds(),
      "q+": Math.floor((myDate.getMonth() + 3) / 3),
      "S": myDate.getMilliseconds()
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
    return;
    window.setTimeout(function () {
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
    for (var key in sourceObject) {
      if (dataObject[key] != undefined && dataObject[key] != null && dataObject[key] != "") {
        sourceObject[key] = dataObject[key];
      }
    }
  },
  OverrideObjectValueFull: function OverrideObjectValueFull(sourceObject, dataObject) {
    for (var key in sourceObject) {
      sourceObject[key] = dataObject[key];
    }
  },
  BindFormData: function BindFormData(interfaceUrl, vueFormData, recordId, op, befFunc, afFunc) {
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
    var dialogEle = $("<div id=" + dialogid + " title='Basic dialog'>\
                        <iframe name='dialogIframe' width='100%' height='98%' frameborder='0'>\
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

    var htmlElem = this._CreateDialogElem(window.document.body, DialogUtility.DialogAlertId);

    var defaultConfig = {
      height: 600,
      width: 900,
      title: "系统提示",
      show: true,
      modal: true,
      buttons: {
        "关闭": function _() {
          $(htmlElem).dialog("close");
        },
        "复制并关闭": function _() {
          $(htmlElem).dialog("close");
          BaseUtility.CopyValueClipboard($(".json-pre").text());
        }
      },
      open: function open() {},
      close: function close() {}
    };
    $(htmlElem).html("<div id='pscontainer' style='width: 100%;height: 100%;overflow: auto;position: relative;'><pre class='json-pre'>" + json + "</pre></div>");
    $(htmlElem).dialog(defaultConfig);
    var ps = new PerfectScrollbar('#pscontainer');
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
    $(textArea).css("height", defaultConfig.height - 130).css("width", "100%");
    var htmlContent = $("<div><div style='width: 100%'>" + labelMsg + "：</div></div>").append(textArea);
    $(htmlElem).html(htmlContent);
    $(htmlElem).dialog(defaultConfig);
  },
  DialogElem: function DialogElem(elemId, config) {
    $("#" + elemId).dialog(config);
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
    };

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
    }

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
    $iframeobj.attr("src", url);
    $iframeobj[0].contentWindow.FrameWindowId = autodialogid;
    $iframeobj[0].contentWindow.OpenerWindowObj = openerwindow;
    return dialogObj;
  },
  CloseOpenIframeWindow: function CloseOpenIframeWindow(openerwindow, dialogId) {
    openerwindow.OpenerWindowObj.DialogUtility.CloseDialog(dialogId);
  },
  CloseDialog: function CloseDialog(dialogId) {
    this._GetElem(dialogId).find("iframe").remove();

    $(this._GetElem(dialogId)).dialog("close");

    try {
      if ($("#Forfocus").length > 0) {
        $("#Forfocus")[0].focus();
      }
    } catch (e) {}
  },
  OpenNewWindow: function OpenNewWindow(openerwindow, dialogId, url, options, whtype) {
    var width = 0;
    var height = 0;

    if (options) {
      width = options.width;
      height = options.height;
    }

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
        options.height = PageStyleUtility.GetPageHeight() - 180;
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
      }

      if (options.width == 0) {
        options.width = PageStyleUtility.GetPageWidth() - 20;
      }

      if (options.height == 0) {
        options.height = PageStyleUtility.GetPageHeight() - 180;
      }

      defaultoptions = $.extend(true, {}, defaultoptions, options);
      $(dialogEle).dialog(defaultoptions);
      $(".ui-widget-overlay").css("zIndex", "2000");
      $(".ui-dialog").css("zIndex", "2001");
      var $iframeobj = $(dialogEle).find("iframe");
      $iframeobj.on("load", function () {
        if (StringUtility.IsSameOrgin(window.location.href, url)) {
          this.contentWindow.FrameWindowId = autodialogid;
          this.contentWindow.OpenerWindowObj = openerwindow;
          this.contentWindow.IsOpenForFrame = true;
        } else {
          console.log("跨域Iframe,无法设置属性!");
        }
      });
      $iframeobj.attr("src", url);
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
    if (url == "") {
      alert("url不能为空字符串!");
      return;
    }

    var wrwin = this.Frame_TryGetFrameWindowObj();
    this.FramePageRef = wrwin;

    if (wrwin != null) {
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
};

function DateExtend_DateFormat(date, fmt) {
  if (null == date || undefined == date) return '';
  var o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "S": date.getMilliseconds()
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  }

  return fmt;
}

Date.prototype.toJSON = function () {
  return DateExtend_DateFormat(this, 'yyyy-MM-dd mm:hh:ss');
};

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

var ListPageUtility = {
  DefaultListHeight: function DefaultListHeight() {
    if (PageStyleUtility.GetPageHeight() > 780) {
      return 678;
    }

    return 500;
  },
  DefaultListHeight_50: function DefaultListHeight_50() {
    return this.DefaultListHeight() - 50;
  },
  DefaultListHeight_100: function DefaultListHeight_100() {
    return this.DefaultListHeight() - 100;
  },
  GetGeneralPageHeight: function GetGeneralPageHeight(fixHeight) {
    var pageHeight = jQuery(document).height();

    if ($("#list-simple-search-wrap").length > 0) {
      pageHeight = pageHeight - $("#list-simple-search-wrap").outerHeight() + fixHeight - $("#list-button-wrap").outerHeight() - $("#list-pager-wrap").outerHeight() - 30;
    } else {
      pageHeight = pageHeight - $("#list-button-wrap").outerHeight() + fixHeight - ($("#list-pager-wrap").length > 0 ? $("#list-pager-wrap").outerHeight() : 0) - 30;
    }

    return pageHeight;
  },
  GetFixHeight: function GetFixHeight() {
    return -70;
  },
  IViewTableRenderer: {
    ToDateYYYY_MM_DD: function ToDateYYYY_MM_DD(h, datetime) {
      var date = new Date(datetime);
      var dateStr = DateUtility.Format(date, 'yyyy-MM-dd');
      return h('div', dateStr);
    },
    StringToDateYYYY_MM_DD: function StringToDateYYYY_MM_DD(h, datetime) {
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
  IViewMoveFace: function IViewMoveFace(url, selectionRows, idField, type, pageAppObj) {
    this.IViewTableMareSureSelectedOne(selectionRows).then(function (selectionRows) {
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
  IViewChangeServerStatusFace: function IViewChangeServerStatusFace(url, selectionRows, idField, statusName, pageAppObj) {
    this.IViewTableMareSureSelected(selectionRows).then(function (selectionRows) {
      ListPageUtility.IViewChangeServerStatus(url, selectionRows, idField, statusName, pageAppObj);
    });
  },
  IViewTableDeleteRow: function IViewTableDeleteRow(url, recordId, pageAppObj) {
    DialogUtility.Confirm(window, "确认要删除当前记录吗？", function () {
      AjaxUtility.Delete(url, {
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
    if (loadDict == undefined || loadDict == null) {
      loadDict = false;
    }

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
        class: "list-row-button view",
        on: {
          click: function click() {
            pageAppObj.view(params.row[idField]);
          }
        }
      });
    },
    EditButton: function EditButton(h, params, idField, pageAppObj) {
      return h('div', {
        class: "list-row-button edit",
        on: {
          click: function click() {
            pageAppObj.edit(params.row[idField]);
          }
        }
      });
    },
    DeleteButton: function DeleteButton(h, params, idField, pageAppObj) {
      return h('div', {
        class: "list-row-button del",
        on: {
          click: function click() {
            pageAppObj.del(params.row[idField]);
          }
        }
      });
    }
  }
};
"use strict";

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
    var searchConditionClone = JsonUtility.CloneSimple(searchCondition);

    for (var key in searchConditionClone) {
      if (searchConditionClone[key].type == SearchUtility.SearchFieldType.ArrayLikeStringType) {
        if (searchConditionClone[key].value != null && searchConditionClone[key].value.length > 0) {
          searchConditionClone[key].value = searchConditionClone[key].value.join(";");
        } else {
          searchConditionClone[key].value = "";
        }
      }
    }

    return JSON.stringify(searchConditionClone);
  }
};
"use strict";

var JBuild4DSelectView = {
  SelectEnvVariable: {
    URL: "/HTML/SelectView/SelectEnvVariable.html",
    beginSelect: function beginSelect(instanceName) {
      var url = BaseUtility.BuildView(this.URL, {
        "instanceName": instanceName
      });
      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: "选择变量",
        modal: true
      }, 2);
    },
    beginSelectInFrame: function beginSelectInFrame(opener, instanceName, option) {
      var url = BaseUtility.BuildView(this.URL, {
        "instanceName": instanceName
      });
      var option = $.extend(true, {}, {
        modal: true,
        title: "选择变量"
      }, option);
      DialogUtility.Frame_OpenIframeWindow(opener, DialogUtility.DialogId05, url, option, 1);
      $(window.parent.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.parent.document).find(".ui-dialog").css("zIndex", 10101);
    },
    formatText: function formatText(type, text) {
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
    URL: "/HTML/SelectView/SelectBindToField.html",
    beginSelect: function beginSelect(instanceName) {
      var url = this.URL + "?instanceName=" + instanceName;
      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: "选择变量",
        modal: true
      }, 2);
    },
    beginSelectInFrame: function beginSelectInFrame(opener, instanceName, option) {
      var url = BaseUtility.BuildView(this.URL, {
        "instanceName": instanceName
      });
      var option = $.extend(true, {}, {
        modal: true,
        title: "选择绑定字段"
      }, option);
      DialogUtility.Frame_OpenIframeWindow(opener, DialogUtility.DialogId05, url, option, 1);
      $(window.parent.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.parent.document).find(".ui-dialog").css("zIndex", 10101);
    }
  },
  SelectValidateRule: {
    URL: "/HTML/SelectView/SelectValidateRule.html",
    beginSelect: function beginSelect(instanceName) {
      var url = this.URL + "?instanceName=" + instanceName;
      DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {
        title: "验证规则",
        modal: true
      }, 2);
    },
    beginSelectInFrame: function beginSelectInFrame(opener, instanceName, option) {
      var url = BaseUtility.BuildView(this.URL, {
        "instanceName": instanceName
      });
      var option = $.extend(true, {}, {
        modal: true,
        title: "验证规则"
      }, option);
      DialogUtility.Frame_OpenIframeWindow(opener, DialogUtility.DialogId05, url, option, 1);
      $(window.parent.document).find(".ui-widget-overlay").css("zIndex", 10100);
      $(window.parent.document).find(".ui-dialog").css("zIndex", 10101);
    }
  }
};
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var StringUtility = {
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
  Timestamp: function Timestamp() {
    var timestamp = new Date().getTime();
    return timestamp.toString().substr(4, 10);
  },
  Trim: function Trim(str) {
    return str.replace(/(^[　\s]*)|([　\s]*$)/g, "");
  },
  RemoveLastChar: function RemoveLastChar(str) {
    return str.substring(0, str.length - 1);
  },
  IsNullOrEmpty: function IsNullOrEmpty(obj) {
    return obj == undefined || obj == "" || obj == null || obj == "undefined" || obj == "null";
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
  EndWith: function EndWith(str, endStr) {
    var d = str.length - endStr.length;
    return d >= 0 && str.lastIndexOf(endStr) == d;
  },
  IsSameOrgin: function IsSameOrgin(url1, url2) {
    var origin1 = /\/\/[\w-.]+(:\d+)?/i.exec(url1)[0];
    var origin2 = /\/\/[\w-.]+(:\d+)?/i.exec(url2)[0];

    if (origin1 == origin2) {
      return true;
    }

    return false;
  }
};
"use strict";

var XMLUtility = {};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFqYXhVdGlsaXR5LmpzIiwiQmFzZVV0aWxpdHkuanMiLCJCcm93c2VySW5mb1V0aWxpdHkuanMiLCJDYWNoZURhdGFVdGlsaXR5LmpzIiwiQ29va2llVXRpbGl0eS5qcyIsIkRhdGVVdGlsaXR5LmpzIiwiRGV0YWlsUGFnZVV0aWxpdHkuanMiLCJEaWFsb2dVdGlsaXR5LmpzIiwiRGljdGlvbmFyeVV0aWxpdHkuanMiLCJKQnVpbGQ0REJhc2VMaWIuanMiLCJKc29uVXRpbGl0eS5qcyIsIkxpc3RQYWdlVXRpbGl0eS5qcyIsIlBhZ2VTdHlsZVV0aWxpdHkuanMiLCJTZWFyY2hVdGlsaXR5LmpzIiwiU2VsZWN0Vmlld0xpYi5qcyIsIlN0cmluZ1V0aWxpdHkuanMiLCJYTUxVdGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOWZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBIiwiZmlsZSI6IkpCdWlsZDREUGxhdGZvcm1MaWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIEFqYXhVdGlsaXR5ID0ge1xuICBQb3N0UmVxdWVzdEJvZHk6IGZ1bmN0aW9uIFBvc3RSZXF1ZXN0Qm9keShfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUpIHtcbiAgICB0aGlzLlBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIik7XG4gIH0sXG4gIFBvc3RTeW5jOiBmdW5jdGlvbiBQb3N0U3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGNvbnRlbnRUeXBlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuUG9zdChfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGNvbnRlbnRUeXBlLCBmYWxzZSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgUG9zdDogZnVuY3Rpb24gUG9zdChfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGNvbnRlbnRUeXBlLCBpc0FzeW5jKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKF91cmwpO1xuXG4gICAgaWYgKGRhdGFUeXBlID09IHVuZGVmaW5lZCB8fCBkYXRhVHlwZSA9PSBudWxsKSB7XG4gICAgICBkYXRhVHlwZSA9IFwidGV4dFwiO1xuICAgIH1cblxuICAgIGlmIChpc0FzeW5jID09IHVuZGVmaW5lZCB8fCBpc0FzeW5jID09IG51bGwpIHtcbiAgICAgIGlzQXN5bmMgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjb250ZW50VHlwZSA9PSB1bmRlZmluZWQgfHwgY29udGVudFR5cGUgPT0gbnVsbCkge1xuICAgICAgY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiO1xuICAgIH1cblxuICAgIHZhciBpbm5lclJlc3VsdCA9IG51bGw7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBhc3luYzogaXNBc3luYyxcbiAgICAgIGNvbnRlbnRUeXBlOiBjb250ZW50VHlwZSxcbiAgICAgIGRhdGFUeXBlOiBkYXRhVHlwZSxcbiAgICAgIGRhdGE6IHNlbmREYXRhLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXN1bHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgJiYgcmVzdWx0LnN1Y2Nlc3MgIT0gbnVsbCAmJiAhcmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQubWVzc2FnZSA9PSBcIueZu+W9lVNlc3Npb27ov4fmnJ9cIikge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCJTZXNzaW9u6LaF5pe277yM6K+36YeN5paw55m76ZmG57O757ufXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBCYXNlVXRpbGl0eS5SZWRpcmVjdFRvTG9naW4oKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJBamF4VXRpbGl0eS5Qb3N0IEV4Y2VwdGlvbiBcIiArIHVybCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jKHJlc3VsdCk7XG4gICAgICAgIGlubmVyUmVzdWx0ID0gcmVzdWx0O1xuICAgICAgfSxcbiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShtc2cpIHt9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKG1zZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChtc2cucmVzcG9uc2VUZXh0LmluZGV4T2YoXCLor7fph43mlrDnmbvpmYbns7vnu59cIikgPj0gMCkge1xuICAgICAgICAgICAgQmFzZVV0aWxpdHkuUmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgXCJBamF4VXRpbGl0eS5Qb3N0LkVycm9yXCIsIHt9LCBcIkFqYXjor7fmsYLlj5HnlJ/plJnor6/vvIFcIiArIFwic3RhdHVzOlwiICsgbXNnLnN0YXR1cyArIFwiLHJlc3BvbnNlVGV4dDpcIiArIG1zZy5yZXNwb25zZVRleHQsIG51bGwpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpbm5lclJlc3VsdDtcbiAgfSxcbiAgR2V0U3luYzogZnVuY3Rpb24gR2V0U3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUpIHtcbiAgICB0aGlzLlBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBmYWxzZSk7XG4gIH0sXG4gIEdldDogZnVuY3Rpb24gR2V0KF91cmwsIHNlbmREYXRhLCBmdW5jLCBkYXRhVHlwZSwgaXNBc3luYykge1xuICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFVybChfdXJsKTtcblxuICAgIGlmIChkYXRhVHlwZSA9PSB1bmRlZmluZWQgfHwgZGF0YVR5cGUgPT0gbnVsbCkge1xuICAgICAgZGF0YVR5cGUgPSBcInRleHRcIjtcbiAgICB9XG5cbiAgICBpZiAoaXNBc3luYyA9PSB1bmRlZmluZWQgfHwgaXNBc3luYyA9PSBudWxsKSB7XG4gICAgICBpc0FzeW5jID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIHVybDogdXJsLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgYXN5bmM6IGlzQXN5bmMsXG4gICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICBkYXRhVHlwZTogZGF0YVR5cGUsXG4gICAgICBkYXRhOiBzZW5kRGF0YSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0KSB7XG4gICAgICAgIGZ1bmMocmVzdWx0KTtcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUobXNnKSB7fSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sXG4gIERlbGV0ZTogZnVuY3Rpb24gRGVsZXRlKF91cmwsIHNlbmREYXRhLCBmdW5jLCBkYXRhVHlwZSwgY29udGVudFR5cGUsIGlzQXN5bmMpIHtcbiAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24oX3VybCk7XG5cbiAgICBpZiAoZGF0YVR5cGUgPT0gdW5kZWZpbmVkIHx8IGRhdGFUeXBlID09IG51bGwpIHtcbiAgICAgIGRhdGFUeXBlID0gXCJ0ZXh0XCI7XG4gICAgfVxuXG4gICAgaWYgKGlzQXN5bmMgPT0gdW5kZWZpbmVkIHx8IGlzQXN5bmMgPT0gbnVsbCkge1xuICAgICAgaXNBc3luYyA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRlbnRUeXBlID09IHVuZGVmaW5lZCB8fCBjb250ZW50VHlwZSA9PSBudWxsKSB7XG4gICAgICBjb250ZW50VHlwZSA9IFwiYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04XCI7XG4gICAgfVxuXG4gICAgdmFyIGlubmVyUmVzdWx0ID0gbnVsbDtcbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgIHVybDogdXJsLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgYXN5bmM6IGlzQXN5bmMsXG4gICAgICBjb250ZW50VHlwZTogY29udGVudFR5cGUsXG4gICAgICBkYXRhVHlwZTogZGF0YVR5cGUsXG4gICAgICBkYXRhOiBzZW5kRGF0YSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsICYmIHJlc3VsdC5zdWNjZXNzICE9IG51bGwgJiYgIXJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0Lm1lc3NhZ2UgPT0gXCLnmbvlvZVTZXNzaW9u6L+H5pyfXCIpIHtcbiAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwiU2Vzc2lvbui2heaXtu+8jOivt+mHjeaWsOeZu+mZhuezu+e7n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQmFzZVV0aWxpdHkuUmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWpheFV0aWxpdHkuUG9zdCBFeGNlcHRpb24gXCIgKyB1cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuYyhyZXN1bHQpO1xuICAgICAgICBpbm5lclJlc3VsdCA9IHJlc3VsdDtcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUobXNnKSB7fSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAobXNnLnJlc3BvbnNlVGV4dC5pbmRleE9mKFwi6K+36YeN5paw55m76ZmG57O757ufXCIpID49IDApIHtcbiAgICAgICAgICAgIEJhc2VVdGlsaXR5LlJlZGlyZWN0VG9Mb2dpbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIFwiQWpheFV0aWxpdHkuRGVsZXRlLkVycm9yXCIsIHt9LCBcIkFqYXjor7fmsYLlj5HnlJ/plJnor6/vvIFcIiArIFwic3RhdHVzOlwiICsgbXNnLnN0YXR1cyArIFwiLHJlc3BvbnNlVGV4dDpcIiArIG1zZy5yZXNwb25zZVRleHQsIG51bGwpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpbm5lclJlc3VsdDtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEJhc2VVdGlsaXR5ID0ge1xuICBHZXRSb290UGF0aDogZnVuY3Rpb24gR2V0Um9vdFBhdGgoKSB7XG4gICAgdmFyIGZ1bGxIcmVmID0gd2luZG93LmRvY3VtZW50LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIHBhdGhOYW1lID0gd2luZG93LmRvY3VtZW50LmxvY2F0aW9uLnBhdGhuYW1lO1xuICAgIHZhciBsYWMgPSBmdWxsSHJlZi5pbmRleE9mKHBhdGhOYW1lKTtcbiAgICB2YXIgbG9jYWxob3N0UGF0aCA9IGZ1bGxIcmVmLnN1YnN0cmluZygwLCBsYWMpO1xuICAgIHZhciBwcm9qZWN0TmFtZSA9IHBhdGhOYW1lLnN1YnN0cmluZygwLCBwYXRoTmFtZS5zdWJzdHIoMSkuaW5kZXhPZignLycpICsgMSk7XG4gICAgcmV0dXJuIGxvY2FsaG9zdFBhdGggKyBwcm9qZWN0TmFtZTtcbiAgfSxcbiAgUmVwbGFjZVVybFZhcmlhYmxlOiBmdW5jdGlvbiBSZXBsYWNlVXJsVmFyaWFibGUoc291cmNlVXJsKSB7XG4gICAgYWxlcnQoXCJSZXBsYWNlVXJsVmFyaWFibGXov4Hnp7vliLBCdWlsZEFjdGlvblwiKTtcbiAgfSxcbiAgR2V0VG9wV2luZG93OiBmdW5jdGlvbiBHZXRUb3BXaW5kb3coKSB7XG4gICAgYWxlcnQoXCJCYXNlVXRpbGl0eS5HZXRUb3BXaW5kb3cg5bey5YGc55SoXCIpO1xuICB9LFxuICBUcnlTZXRDb250cm9sRm9jdXM6IGZ1bmN0aW9uIFRyeVNldENvbnRyb2xGb2N1cygpIHtcbiAgICBhbGVydChcIkJhc2VVdGlsaXR5LlRyeVNldENvbnRyb2xGb2N1cyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIEJ1aWxkVXJsOiBmdW5jdGlvbiBCdWlsZFVybCh1cmwpIHtcbiAgICBhbGVydChcIkJhc2VVdGlsaXR5LkJ1aWxkVXJsIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgQnVpbGRWaWV3OiBmdW5jdGlvbiBCdWlsZFZpZXcoYWN0aW9uLCBwYXJhKSB7XG4gICAgdmFyIHVybFBhcmEgPSBcIlwiO1xuXG4gICAgaWYgKHBhcmEpIHtcbiAgICAgIHVybFBhcmEgPSAkLnBhcmFtKHBhcmEpO1xuICAgIH1cblxuICAgIHZhciBfdXJsID0gdGhpcy5HZXRSb290UGF0aCgpICsgYWN0aW9uO1xuXG4gICAgaWYgKHVybFBhcmEgIT0gXCJcIikge1xuICAgICAgX3VybCArPSBcIj9cIiArIHVybFBhcmE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuQXBwZW5kVGltZVN0YW1wVXJsKF91cmwpO1xuICB9LFxuICBCdWlsZEZyYW1lSW5uZXJWaWV3OiBmdW5jdGlvbiBCdWlsZEZyYW1lSW5uZXJWaWV3KGFjdGlvbiwgcGFyYSkge1xuICAgIHZhciB1cmxQYXJhID0gXCJcIjtcblxuICAgIGlmIChwYXJhKSB7XG4gICAgICB1cmxQYXJhID0gJC5wYXJhbShwYXJhKTtcbiAgICB9XG5cbiAgICB2YXIgX3VybCA9IHRoaXMuR2V0Um9vdFBhdGgoKSArIFwiL0hUTUwvXCIgKyBhY3Rpb247XG5cbiAgICBpZiAodXJsUGFyYSAhPSBcIlwiKSB7XG4gICAgICBfdXJsICs9IFwiP1wiICsgdXJsUGFyYTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5BcHBlbmRUaW1lU3RhbXBVcmwoX3VybCk7XG4gIH0sXG4gIEJ1aWxkQWN0aW9uOiBmdW5jdGlvbiBCdWlsZEFjdGlvbihhY3Rpb24sIHBhcmEpIHtcbiAgICB2YXIgdXJsUGFyYSA9IFwiXCI7XG5cbiAgICBpZiAocGFyYSkge1xuICAgICAgdXJsUGFyYSA9ICQucGFyYW0ocGFyYSk7XG4gICAgfVxuXG4gICAgdmFyIF91cmwgPSB0aGlzLkdldFJvb3RQYXRoKCkgKyBhY3Rpb24gKyBcIi5kb1wiO1xuXG4gICAgaWYgKHVybFBhcmEgIT0gXCJcIikge1xuICAgICAgX3VybCArPSBcIj9cIiArIHVybFBhcmE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuQXBwZW5kVGltZVN0YW1wVXJsKF91cmwpO1xuICB9LFxuICBSZWRpcmVjdFRvTG9naW46IGZ1bmN0aW9uIFJlZGlyZWN0VG9Mb2dpbigpIHtcbiAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL1BsYXRGb3JtL0xvZ2luVmlldy5kb1wiO1xuICAgIHdpbmRvdy5wYXJlbnQucGFyZW50LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gIH0sXG4gIEFwcGVuZFRpbWVTdGFtcFVybDogZnVuY3Rpb24gQXBwZW5kVGltZVN0YW1wVXJsKHVybCkge1xuICAgIGlmICh1cmwuaW5kZXhPZihcInRpbWVzdGFtcFwiKSA+IFwiMFwiKSB7XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH1cblxuICAgIHZhciBnZXRUaW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgdXJsID0gdXJsICsgXCImdGltZXN0YW1wPVwiICsgZ2V0VGltZXN0YW1wO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSB1cmwgKyBcIj90aW1lc3RhbXA9XCIgKyBnZXRUaW1lc3RhbXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbiAgfSxcbiAgR2V0VXJsUGFyYVZhbHVlOiBmdW5jdGlvbiBHZXRVcmxQYXJhVmFsdWUocGFyYU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5HZXRVcmxQYXJhVmFsdWVCeVN0cmluZyhwYXJhTmFtZSwgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gIH0sXG4gIEdldFVybFBhcmFWYWx1ZUJ5U3RyaW5nOiBmdW5jdGlvbiBHZXRVcmxQYXJhVmFsdWVCeVN0cmluZyhwYXJhTmFtZSwgdXJsU3RyaW5nKSB7XG4gICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXnwmKVwiICsgcGFyYU5hbWUgKyBcIj0oW14mXSopKCZ8JClcIik7XG4gICAgdmFyIHIgPSB1cmxTdHJpbmcuc3Vic3RyKDEpLm1hdGNoKHJlZyk7XG4gICAgaWYgKHIgIT0gbnVsbCkgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyWzJdKTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfSxcbiAgQ29weVZhbHVlQ2xpcGJvYXJkOiBmdW5jdGlvbiBDb3B5VmFsdWVDbGlwYm9hcmQodmFsdWUpIHtcbiAgICB2YXIgdHJhbnNmZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnSl9Db3B5VHJhbnNmZXInKTtcblxuICAgIGlmICghdHJhbnNmZXIpIHtcbiAgICAgIHRyYW5zZmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndGV4dGFyZWEnKTtcbiAgICAgIHRyYW5zZmVyLmlkID0gJ0pfQ29weVRyYW5zZmVyJztcbiAgICAgIHRyYW5zZmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIHRyYW5zZmVyLnN0eWxlLmxlZnQgPSAnLTk5OTlweCc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS56SW5kZXggPSA5OTk5O1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0cmFuc2Zlcik7XG4gICAgfVxuXG4gICAgdHJhbnNmZXIudmFsdWUgPSB2YWx1ZTtcbiAgICB0cmFuc2Zlci5mb2N1cygpO1xuICAgIHRyYW5zZmVyLnNlbGVjdCgpO1xuICAgIGRvY3VtZW50LmV4ZWNDb21tYW5kKCdjb3B5Jyk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBCcm93c2VySW5mb1V0aWxpdHkgPSB7XG4gIEJyb3dzZXJBcHBOYW1lOiBmdW5jdGlvbiBCcm93c2VyQXBwTmFtZSgpIHtcbiAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiRmlyZWZveFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBcIkZpcmVmb3hcIjtcbiAgICB9IGVsc2UgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUVcIikgPiAwKSB7XG4gICAgICByZXR1cm4gXCJJRVwiO1xuICAgIH0gZWxzZSBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiQ2hyb21lXCIpID4gMCkge1xuICAgICAgcmV0dXJuIFwiQ2hyb21lXCI7XG4gICAgfVxuICB9LFxuICBJc0lFOiBmdW5jdGlvbiBJc0lFKCkge1xuICAgIGlmICghIXdpbmRvdy5BY3RpdmVYT2JqZWN0IHx8IFwiQWN0aXZlWE9iamVjdFwiIGluIHdpbmRvdykgcmV0dXJuIHRydWU7ZWxzZSByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElzSUU2OiBmdW5jdGlvbiBJc0lFNigpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA2LjBcIikgPiAwO1xuICB9LFxuICBJc0lFNzogZnVuY3Rpb24gSXNJRTcoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgNy4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTg6IGZ1bmN0aW9uIElzSUU4KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDguMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU4WDY0OiBmdW5jdGlvbiBJc0lFOFg2NCgpIHtcbiAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA4LjBcIikgPiAwKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwieDY0XCIpID4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElzSUU5OiBmdW5jdGlvbiBJc0lFOSgpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA5LjBcIikgPiAwO1xuICB9LFxuICBJc0lFOVg2NDogZnVuY3Rpb24gSXNJRTlYNjQoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOS4wXCIpID4gMCkge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIng2NFwiKSA+IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFMTA6IGZ1bmN0aW9uIElzSUUxMCgpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSAxMC4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTEwWDY0OiBmdW5jdGlvbiBJc0lFMTBYNjQoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgMTAuMFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJ4NjRcIikgPiAwO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSUVEb2N1bWVudE1vZGU6IGZ1bmN0aW9uIElFRG9jdW1lbnRNb2RlKCkge1xuICAgIHJldHVybiBkb2N1bWVudC5kb2N1bWVudE1vZGU7XG4gIH0sXG4gIElzSUU4RG9jdW1lbnRNb2RlOiBmdW5jdGlvbiBJc0lFOERvY3VtZW50TW9kZSgpIHtcbiAgICByZXR1cm4gdGhpcy5JRURvY3VtZW50TW9kZSgpID09IDg7XG4gIH0sXG4gIElzRmlyZWZveDogZnVuY3Rpb24gSXNGaXJlZm94KCkge1xuICAgIHJldHVybiB0aGlzLkJyb3dzZXJBcHBOYW1lKCkgPT0gXCJGaXJlZm94XCI7XG4gIH0sXG4gIElzQ2hyb21lOiBmdW5jdGlvbiBJc0Nocm9tZSgpIHtcbiAgICByZXR1cm4gdGhpcy5Ccm93c2VyQXBwTmFtZSgpID09IFwiQ2hyb21lXCI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBDYWNoZURhdGFVdGlsaXR5ID0ge1xuICBJbmluQ2xpZW50Q2FjaGU6IGZ1bmN0aW9uIEluaW5DbGllbnRDYWNoZSgpIHtcbiAgICB0aGlzLkdldEN1cnJlbnRVc2VySW5mbygpO1xuICB9LFxuICBfQ3VycmVudFVzZXJJbmZvOiBudWxsLFxuICBHZXRDdXJyZW50VXNlckluZm86IGZ1bmN0aW9uIEdldEN1cnJlbnRVc2VySW5mbygpIHtcbiAgICBpZiAodGhpcy5fQ3VycmVudFVzZXJJbmZvID09IG51bGwpIHtcbiAgICAgIGlmICh3aW5kb3cucGFyZW50LkNhY2hlRGF0YVV0aWxpdHkuX0N1cnJlbnRVc2VySW5mbyAhPSBudWxsKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cucGFyZW50LkNhY2hlRGF0YVV0aWxpdHkuX0N1cnJlbnRVc2VySW5mbztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIEFqYXhVdGlsaXR5LlBvc3RTeW5jKFwiL1BsYXRGb3JtUmVzdC9NeUluZm8vR2V0VXNlckluZm9cIiwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIENhY2hlRGF0YVV0aWxpdHkuX0N1cnJlbnRVc2VySW5mbyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIH0gZWxzZSB7fVxuICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9DdXJyZW50VXNlckluZm87XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9DdXJyZW50VXNlckluZm87XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29va2llVXRpbGl0eSA9IHtcbiAgU2V0Q29va2llMURheTogZnVuY3Rpb24gU2V0Q29va2llMURheShuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIFNldENvb2tpZTFNb250aDogZnVuY3Rpb24gU2V0Q29va2llMU1vbnRoKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGV4cCA9IG5ldyBEYXRlKCk7XG4gICAgZXhwLnNldFRpbWUoZXhwLmdldFRpbWUoKSArIDMwICogMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBTZXRDb29raWUxWWVhcjogZnVuY3Rpb24gU2V0Q29va2llMVllYXIobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpICsgMzAgKiAyNCAqIDYwICogNjAgKiAzNjUgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIEdldENvb2tpZTogZnVuY3Rpb24gR2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgYXJyID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoXCIoXnwgKVwiICsgbmFtZSArIFwiPShbXjtdKikoO3wkKVwiKSk7XG4gICAgaWYgKGFyciAhPSBudWxsKSByZXR1cm4gdW5lc2NhcGUoYXJyWzJdKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgRGVsQ29va2llOiBmdW5jdGlvbiBEZWxDb29raWUobmFtZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgLSAxKTtcbiAgICB2YXIgY3ZhbCA9IHRoaXMuZ2V0Q29va2llKG5hbWUpO1xuICAgIGlmIChjdmFsICE9IG51bGwpIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGN2YWwgKyBcIjtleHBpcmVzPVwiICsgZXhwLnRvR01UU3RyaW5nKCkgKyBcIjtwYXRoPS9cIjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERhdGVVdGlsaXR5ID0ge1xuICBHZXRDdXJyZW50RGF0YVN0cmluZzogZnVuY3Rpb24gR2V0Q3VycmVudERhdGFTdHJpbmcoc3BsaXQpIHtcbiAgICBhbGVydChcIkRhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhU3RyaW5nIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgRGF0ZUZvcm1hdDogZnVuY3Rpb24gRGF0ZUZvcm1hdChteURhdGUsIHNwbGl0KSB7XG4gICAgYWxlcnQoXCJEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YVN0cmluZyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIEZvcm1hdDogZnVuY3Rpb24gRm9ybWF0KG15RGF0ZSwgZm9ybWF0U3RyaW5nKSB7XG4gICAgdmFyIG8gPSB7XG4gICAgICBcIk0rXCI6IG15RGF0ZS5nZXRNb250aCgpICsgMSxcbiAgICAgIFwiZCtcIjogbXlEYXRlLmdldERhdGUoKSxcbiAgICAgIFwiaCtcIjogbXlEYXRlLmdldEhvdXJzKCksXG4gICAgICBcIm0rXCI6IG15RGF0ZS5nZXRNaW51dGVzKCksXG4gICAgICBcInMrXCI6IG15RGF0ZS5nZXRTZWNvbmRzKCksXG4gICAgICBcInErXCI6IE1hdGguZmxvb3IoKG15RGF0ZS5nZXRNb250aCgpICsgMykgLyAzKSxcbiAgICAgIFwiU1wiOiBteURhdGUuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICB9O1xuICAgIGlmICgvKHkrKS8udGVzdChmb3JtYXRTdHJpbmcpKSBmb3JtYXRTdHJpbmcgPSBmb3JtYXRTdHJpbmcucmVwbGFjZShSZWdFeHAuJDEsIChteURhdGUuZ2V0RnVsbFllYXIoKSArIFwiXCIpLnN1YnN0cig0IC0gUmVnRXhwLiQxLmxlbmd0aCkpO1xuXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICBpZiAobmV3IFJlZ0V4cChcIihcIiArIGsgKyBcIilcIikudGVzdChmb3JtYXRTdHJpbmcpKSBmb3JtYXRTdHJpbmcgPSBmb3JtYXRTdHJpbmcucmVwbGFjZShSZWdFeHAuJDEsIFJlZ0V4cC4kMS5sZW5ndGggPT0gMSA/IG9ba10gOiAoXCIwMFwiICsgb1trXSkuc3Vic3RyKChcIlwiICsgb1trXSkubGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdFN0cmluZztcbiAgfSxcbiAgRm9ybWF0Q3VycmVudERhdGE6IGZ1bmN0aW9uIEZvcm1hdEN1cnJlbnREYXRhKGZvcm1hdFN0cmluZykge1xuICAgIHZhciBteURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiB0aGlzLkZvcm1hdChteURhdGUsIGZvcm1hdFN0cmluZyk7XG4gIH0sXG4gIEdldEN1cnJlbnREYXRhOiBmdW5jdGlvbiBHZXRDdXJyZW50RGF0YSgpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERldGFpbFBhZ2VVdGlsaXR5ID0ge1xuICBJVmlld1BhZ2VUb1ZpZXdTdGF0dXM6IGZ1bmN0aW9uIElWaWV3UGFnZVRvVmlld1N0YXR1cygpIHtcbiAgICByZXR1cm47XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJChcImlucHV0XCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmhpZGUoKTtcbiAgICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICQodGhpcykuYWZ0ZXIoJChcIjxsYWJlbCAvPlwiKS50ZXh0KHZhbCkpO1xuICAgICAgfSk7XG4gICAgICAkKFwiLml2dS1kYXRlLXBpY2tlci1lZGl0b3JcIikuZmluZChcIi5pdnUtaWNvblwiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpb1wiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpby1ncm91cC1pdGVtXCIpLmhpZGUoKTtcbiAgICAgICQoXCIuaXZ1LXJhZGlvLXdyYXBwZXItY2hlY2tlZFwiKS5zaG93KCk7XG4gICAgICAkKFwiLml2dS1yYWRpby13cmFwcGVyLWNoZWNrZWRcIikuZmluZChcInNwYW5cIikuaGlkZSgpO1xuICAgICAgJChcInRleHRhcmVhXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmhpZGUoKTtcbiAgICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICQodGhpcykuYWZ0ZXIoJChcIjxsYWJlbCAvPlwiKS50ZXh0KHZhbCkpO1xuICAgICAgfSk7XG4gICAgfSwgMTAwKTtcbiAgfSxcbiAgT3ZlcnJpZGVPYmplY3RWYWx1ZTogZnVuY3Rpb24gT3ZlcnJpZGVPYmplY3RWYWx1ZShzb3VyY2VPYmplY3QsIGRhdGFPYmplY3QpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlT2JqZWN0KSB7XG4gICAgICBpZiAoZGF0YU9iamVjdFtrZXldICE9IHVuZGVmaW5lZCAmJiBkYXRhT2JqZWN0W2tleV0gIT0gbnVsbCAmJiBkYXRhT2JqZWN0W2tleV0gIT0gXCJcIikge1xuICAgICAgICBzb3VyY2VPYmplY3Rba2V5XSA9IGRhdGFPYmplY3Rba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIE92ZXJyaWRlT2JqZWN0VmFsdWVGdWxsOiBmdW5jdGlvbiBPdmVycmlkZU9iamVjdFZhbHVlRnVsbChzb3VyY2VPYmplY3QsIGRhdGFPYmplY3QpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlT2JqZWN0KSB7XG4gICAgICBzb3VyY2VPYmplY3Rba2V5XSA9IGRhdGFPYmplY3Rba2V5XTtcbiAgICB9XG4gIH0sXG4gIEJpbmRGb3JtRGF0YTogZnVuY3Rpb24gQmluZEZvcm1EYXRhKGludGVyZmFjZVVybCwgdnVlRm9ybURhdGEsIHJlY29yZElkLCBvcCwgYmVmRnVuYywgYWZGdW5jKSB7XG4gICAgQWpheFV0aWxpdHkuUG9zdChpbnRlcmZhY2VVcmwsIHtcbiAgICAgIHJlY29yZElkOiByZWNvcmRJZCxcbiAgICAgIG9wOiBvcFxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIGJlZkZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgYmVmRnVuYyhyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgRGV0YWlsUGFnZVV0aWxpdHkuT3ZlcnJpZGVPYmplY3RWYWx1ZSh2dWVGb3JtRGF0YSwgcmVzdWx0LmRhdGEpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYWZGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGFmRnVuYyhyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wID09IFwidmlld1wiKSB7XG4gICAgICAgICAgRGV0YWlsUGFnZVV0aWxpdHkuSVZpZXdQYWdlVG9WaWV3U3RhdHVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICB9XG4gICAgfSwgXCJqc29uXCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGlhbG9nVXRpbGl0eSA9IHtcbiAgRGlhbG9nQWxlcnRJZDogXCJEZWZhdWx0RGlhbG9nQWxlcnRVdGlsaXR5MDFcIixcbiAgRGlhbG9nUHJvbXB0SWQ6IFwiRGVmYXVsdERpYWxvZ1Byb21wdFV0aWxpdHkwMVwiLFxuICBEaWFsb2dJZDogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTAxXCIsXG4gIERpYWxvZ0lkMDI6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwMlwiLFxuICBEaWFsb2dJZDAzOiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDNcIixcbiAgRGlhbG9nSWQwNDogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTA0XCIsXG4gIERpYWxvZ0lkMDU6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwNVwiLFxuICBfR2V0RWxlbTogZnVuY3Rpb24gX0dldEVsZW0oZGlhbG9nSWQpIHtcbiAgICByZXR1cm4gJChcIiNcIiArIGRpYWxvZ0lkKTtcbiAgfSxcbiAgX0NyZWF0ZURpYWxvZ0VsZW06IGZ1bmN0aW9uIF9DcmVhdGVEaWFsb2dFbGVtKGRvY29iaiwgZGlhbG9nSWQpIHtcbiAgICBpZiAodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkubGVuZ3RoID09IDApIHtcbiAgICAgIHZhciBkaWFsb2dFbGUgPSAkKFwiPGRpdiBpZD1cIiArIGRpYWxvZ0lkICsgXCIgdGl0bGU9J+ezu+e7n+aPkOekuicgc3R5bGU9J2Rpc3BsYXk6bm9uZSc+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAkKGRvY29iai5ib2R5KS5hcHBlbmQoZGlhbG9nRWxlKTtcbiAgICAgIHJldHVybiBkaWFsb2dFbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKTtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVBbGVydExvYWRpbmdNc2dFbGVtZW50OiBmdW5jdGlvbiBfQ3JlYXRlQWxlcnRMb2FkaW5nTXNnRWxlbWVudChkb2NvYmosIGRpYWxvZ0lkKSB7XG4gICAgaWYgKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICB2YXIgZGlhbG9nRWxlID0gJChcIjxkaXYgaWQ9XCIgKyBkaWFsb2dJZCArIFwiIHRpdGxlPSfns7vnu5/mj5DnpLonIHN0eWxlPSdkaXNwbGF5Om5vbmUnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdhbGVydGxvYWRpbmctaW1nJz48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nYWxlcnRsb2FkaW5nLXR4dCc+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICAgJChkb2NvYmouYm9keSkuYXBwZW5kKGRpYWxvZ0VsZSk7XG4gICAgICByZXR1cm4gZGlhbG9nRWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fR2V0RWxlbShkaWFsb2dJZCk7XG4gICAgfVxuICB9LFxuICBfQ3JlYXRlSWZybWFlRGlhbG9nRWxlbWVudDogZnVuY3Rpb24gX0NyZWF0ZUlmcm1hZURpYWxvZ0VsZW1lbnQoZG9jb2JqLCBkaWFsb2dpZCwgdXJsKSB7XG4gICAgdmFyIGRpYWxvZ0VsZSA9ICQoXCI8ZGl2IGlkPVwiICsgZGlhbG9naWQgKyBcIiB0aXRsZT0nQmFzaWMgZGlhbG9nJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIG5hbWU9J2RpYWxvZ0lmcmFtZScgd2lkdGg9JzEwMCUnIGhlaWdodD0nOTglJyBmcmFtZWJvcmRlcj0nMCc+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pZnJhbWU+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgJChkb2NvYmouYm9keSkuYXBwZW5kKGRpYWxvZ0VsZSk7XG4gICAgcmV0dXJuIGRpYWxvZ0VsZTtcbiAgfSxcbiAgX1Rlc3REaWFsb2dFbGVtSXNFeGlzdDogZnVuY3Rpb24gX1Rlc3REaWFsb2dFbGVtSXNFeGlzdChkaWFsb2dJZCkge1xuICAgIGlmICh0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIF9UZXN0UnVuRW5hYmxlOiBmdW5jdGlvbiBfVGVzdFJ1bkVuYWJsZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgQWxlcnRFcnJvcjogZnVuY3Rpb24gQWxlcnRFcnJvcihvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxtc2csIHNGdW5jKSB7XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgIHdpZHRoOiA2MDBcbiAgICB9O1xuICAgIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICB0aGlzLkFsZXJ0KG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGRlZmF1bHRDb25maWcsIGh0bWxtc2csIHNGdW5jKTtcbiAgfSxcbiAgQWxlcnRUZXh0OiBmdW5jdGlvbiBBbGVydFRleHQodGV4dCkge1xuICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCB0ZXh0LCBudWxsKTtcbiAgfSxcbiAgQWxlcnQ6IGZ1bmN0aW9uIEFsZXJ0KG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbG1zZywgc0Z1bmMpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKG9wZXJlcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIHRpdGxlOiBcIuezu+e7n+aPkOekulwiLFxuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgYnV0dG9uczoge1xuICAgICAgICBcIuWFs+mXrVwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHt9LFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICBpZiAoc0Z1bmMpIHtcbiAgICAgICAgICBzRnVuYygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQoaHRtbEVsZW0pLmh0bWwoaHRtbG1zZyk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBBbGVydEpzb25Db2RlOiBmdW5jdGlvbiBBbGVydEpzb25Db2RlKGpzb24pIHtcbiAgICBqc29uID0gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nRm9ybWF0KGpzb24pO1xuICAgIGpzb24gPSBqc29uLnJlcGxhY2UoLyYvZywgJyYnKS5yZXBsYWNlKC88L2csICc8JykucmVwbGFjZSgvPi9nLCAnPicpO1xuICAgIGpzb24gPSBqc29uLnJlcGxhY2UoLyhcIihcXFxcdVthLXpBLVowLTldezR9fFxcXFxbXnVdfFteXFxcXFwiXSkqXCIoXFxzKjopP3xcXGIodHJ1ZXxmYWxzZXxudWxsKVxcYnwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPykvZywgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICB2YXIgY2xzID0gJ2pzb24tbnVtYmVyJztcblxuICAgICAgaWYgKC9eXCIvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIGlmICgvOiQvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgICAgY2xzID0gJ2pzb24ta2V5JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbHMgPSAnanNvbi1zdHJpbmcnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKC90cnVlfGZhbHNlLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBjbHMgPSAnanNvbi1ib29sZWFuJztcbiAgICAgIH0gZWxzZSBpZiAoL251bGwvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIGNscyA9ICdqc29uLW51bGwnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwiJyArIGNscyArICdcIj4nICsgbWF0Y2ggKyAnPC9zcGFuPic7XG4gICAgfSk7XG5cbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKHdpbmRvdy5kb2N1bWVudC5ib2R5LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQpO1xuXG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgIHdpZHRoOiA5MDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLlhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCLlpI3liLblubblhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICBCYXNlVXRpbGl0eS5Db3B5VmFsdWVDbGlwYm9hcmQoJChcIi5qc29uLXByZVwiKS50ZXh0KCkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHt9LFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKCkge31cbiAgICB9O1xuICAgICQoaHRtbEVsZW0pLmh0bWwoXCI8ZGl2IGlkPSdwc2NvbnRhaW5lcicgc3R5bGU9J3dpZHRoOiAxMDAlO2hlaWdodDogMTAwJTtvdmVyZmxvdzogYXV0bztwb3NpdGlvbjogcmVsYXRpdmU7Jz48cHJlIGNsYXNzPSdqc29uLXByZSc+XCIgKyBqc29uICsgXCI8L3ByZT48L2Rpdj5cIik7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICAgIHZhciBwcyA9IG5ldyBQZXJmZWN0U2Nyb2xsYmFyKCcjcHNjb250YWluZXInKTtcbiAgfSxcbiAgU2hvd0hUTUw6IGZ1bmN0aW9uIFNob3dIVE1MKG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbG1zZywgY2xvc2VfYWZ0ZXJfZXZlbnQsIHBhcmFtcykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlcmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNsb3NlX2FmdGVyX2V2ZW50KHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxtc2cpO1xuICAgIHJldHVybiAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIEFsZXJ0TG9hZGluZzogZnVuY3Rpb24gQWxlcnRMb2FkaW5nKG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbG1zZykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQob3BlcmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWVcbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuZmluZChcIi5hbGVydGxvYWRpbmctdHh0XCIpLmh0bWwoaHRtbG1zZyk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBDb25maXJtOiBmdW5jdGlvbiBDb25maXJtKG9wZXJlcldpbmRvdywgaHRtbG1zZywgb2tGbikge1xuICAgIHRoaXMuQ29uZmlybUNvbmZpZyhvcGVyZXJXaW5kb3csIGh0bWxtc2csIG51bGwsIG9rRm4pO1xuICB9LFxuICBDb25maXJtQ29uZmlnOiBmdW5jdGlvbiBDb25maXJtQ29uZmlnKG9wZXJlcldpbmRvdywgaHRtbG1zZywgY29uZmlnLCBva0ZuKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVyZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgXCJBbGVydENvbmZpcm1Nc2dcIik7XG5cbiAgICB2YXIgcGFyYXMgPSBudWxsO1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgb2tmdW5jOiBmdW5jdGlvbiBva2Z1bmMocGFyYXMpIHtcbiAgICAgICAgaWYgKG9rRm4gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIG9rRm4oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVyZXJXaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNhbmNlbGZ1bmM6IGZ1bmN0aW9uIGNhbmNlbGZ1bmMocGFyYXMpIHt9LFxuICAgICAgdmFsaWRhdGVmdW5jOiBmdW5jdGlvbiB2YWxpZGF0ZWZ1bmMocGFyYXMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgY2xvc2VhZnRlcmZ1bmM6IHRydWUsXG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdENvbmZpZy52YWxpZGF0ZWZ1bmMocGFyYXMpKSB7XG4gICAgICAgICAgICB2YXIgciA9IGRlZmF1bHRDb25maWcub2tmdW5jKHBhcmFzKTtcbiAgICAgICAgICAgIHIgPSByID09IG51bGwgPyB0cnVlIDogcjtcblxuICAgICAgICAgICAgaWYgKHIgJiYgZGVmYXVsdENvbmZpZy5jbG9zZWFmdGVyZnVuYykge1xuICAgICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgZGVmYXVsdENvbmZpZy5jYW5jZWxmdW5jKHBhcmFzKTtcblxuICAgICAgICAgIGlmIChkZWZhdWx0Q29uZmlnLmNsb3NlYWZ0ZXJmdW5jKSB7XG4gICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sbXNnKTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gICAgcGFyYXMgPSB7XG4gICAgICBcIkVsZW1lbnRPYmpcIjogaHRtbEVsZW1cbiAgICB9O1xuICB9LFxuICBQcm9tcHQ6IGZ1bmN0aW9uIFByb21wdChvcGVyZXJXaW5kb3csIGNvbmZpZywgZGlhbG9nSWQsIGxhYmVsTXNnLCBva0Z1bmMpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKG9wZXJlcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgcGFyYXMgPSBudWxsO1xuICAgIHZhciB0ZXh0QXJlYSA9ICQoXCI8dGV4dGFyZWEgLz5cIik7XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG9rRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHZhciBpbnB1dFRleHQgPSB0ZXh0QXJlYS52YWwoKTtcbiAgICAgICAgICAgIG9rRnVuYyhpbnB1dFRleHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9LFxuICAgICAgICBcIuWPlua2iFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQodGV4dEFyZWEpLmNzcyhcImhlaWdodFwiLCBkZWZhdWx0Q29uZmlnLmhlaWdodCAtIDEzMCkuY3NzKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xuICAgIHZhciBodG1sQ29udGVudCA9ICQoXCI8ZGl2PjxkaXYgc3R5bGU9J3dpZHRoOiAxMDAlJz5cIiArIGxhYmVsTXNnICsgXCLvvJo8L2Rpdj48L2Rpdj5cIikuYXBwZW5kKHRleHRBcmVhKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxDb250ZW50KTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIERpYWxvZ0VsZW06IGZ1bmN0aW9uIERpYWxvZ0VsZW0oZWxlbUlkLCBjb25maWcpIHtcbiAgICAkKFwiI1wiICsgZWxlbUlkKS5kaWFsb2coY29uZmlnKTtcbiAgfSxcbiAgT3BlbklmcmFtZVdpbmRvdzogZnVuY3Rpb24gT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIHZhciBkZWZhdWx0b3B0aW9ucyA9IHtcbiAgICAgIGhlaWdodDogNDEwLFxuICAgICAgd2lkdGg6IDYwMCxcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZShldmVudCwgdWkpIHtcbiAgICAgICAgdmFyIGF1dG9kaWFsb2dpZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAkKHRoaXMpLmZpbmQoXCJpZnJhbWVcIikucmVtb3ZlKCk7XG4gICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAkKHRoaXMpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gICAgICAgICQoXCIjXCIgKyBhdXRvZGlhbG9naWQpLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmIChCcm93c2VySW5mb1V0aWxpdHkuSXNJRThEb2N1bWVudE1vZGUoKSkge1xuICAgICAgICAgIENvbGxlY3RHYXJiYWdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoJChcIiNGb3Jmb2N1c1wiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkKFwiI0ZvcmZvY3VzXCIpWzBdLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAod2h0eXBlID09IDEpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogNjgwLFxuICAgICAgICB3aWR0aDogOTgwXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAyKSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgd2lkdGg6IDgwMFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNCkge1xuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgaGVpZ2h0OiAzODAsXG4gICAgICAgIHdpZHRoOiA0ODBcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDUpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogMTgwLFxuICAgICAgICB3aWR0aDogMzAwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy53aWR0aCA9PSAwKSB7XG4gICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbC5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmhlaWdodCA9PSAwKSB7XG4gICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWwuR2V0UGFnZUhlaWdodCgpIC0gMTA7XG4gICAgfVxuXG4gICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHZhciBhdXRvZGlhbG9naWQgPSBkaWFsb2dJZDtcblxuICAgIHZhciBkaWFsb2dFbGUgPSB0aGlzLl9DcmVhdGVJZnJtYWVEaWFsb2dFbGVtZW50KG9wZW5lcndpbmRvdy5kb2N1bWVudCwgYXV0b2RpYWxvZ2lkLCB1cmwpO1xuXG4gICAgdmFyIGRpYWxvZ09iaiA9ICQoZGlhbG9nRWxlKS5kaWFsb2coZGVmYXVsdG9wdGlvbnMpO1xuICAgIHZhciAkaWZyYW1lb2JqID0gJChkaWFsb2dFbGUpLmZpbmQoXCJpZnJhbWVcIik7XG4gICAgJGlmcmFtZW9iai5hdHRyKFwic3JjXCIsIHVybCk7XG4gICAgJGlmcmFtZW9ialswXS5jb250ZW50V2luZG93LkZyYW1lV2luZG93SWQgPSBhdXRvZGlhbG9naWQ7XG4gICAgJGlmcmFtZW9ialswXS5jb250ZW50V2luZG93Lk9wZW5lcldpbmRvd09iaiA9IG9wZW5lcndpbmRvdztcbiAgICByZXR1cm4gZGlhbG9nT2JqO1xuICB9LFxuICBDbG9zZU9wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIENsb3NlT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkKSB7XG4gICAgb3BlbmVyd2luZG93Lk9wZW5lcldpbmRvd09iai5EaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKGRpYWxvZ0lkKTtcbiAgfSxcbiAgQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIENsb3NlRGlhbG9nKGRpYWxvZ0lkKSB7XG4gICAgdGhpcy5fR2V0RWxlbShkaWFsb2dJZCkuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcblxuICAgICQodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkpLmRpYWxvZyhcImNsb3NlXCIpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICgkKFwiI0ZvcmZvY3VzXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJChcIiNGb3Jmb2N1c1wiKVswXS5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0sXG4gIE9wZW5OZXdXaW5kb3c6IGZ1bmN0aW9uIE9wZW5OZXdXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICB2YXIgd2lkdGggPSAwO1xuICAgIHZhciBoZWlnaHQgPSAwO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHdpZHRoID0gb3B0aW9ucy53aWR0aDtcbiAgICAgIGhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuICAgIH1cblxuICAgIHZhciBsZWZ0ID0gcGFyc2VJbnQoKHNjcmVlbi5hdmFpbFdpZHRoIC0gd2lkdGgpIC8gMikudG9TdHJpbmcoKTtcbiAgICB2YXIgdG9wID0gcGFyc2VJbnQoKHNjcmVlbi5hdmFpbEhlaWdodCAtIGhlaWdodCkgLyAyKS50b1N0cmluZygpO1xuXG4gICAgaWYgKHdpZHRoLnRvU3RyaW5nKCkgPT0gXCIwXCIgJiYgaGVpZ2h0LnRvU3RyaW5nKCkgPT0gXCIwXCIpIHtcbiAgICAgIHdpZHRoID0gd2luZG93LnNjcmVlbi5hdmFpbFdpZHRoIC0gMzA7XG4gICAgICBoZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmF2YWlsSGVpZ2h0IC0gNjA7XG4gICAgICBsZWZ0ID0gXCIwXCI7XG4gICAgICB0b3AgPSBcIjBcIjtcbiAgICB9XG5cbiAgICB2YXIgd2luSGFuZGxlID0gd2luZG93Lm9wZW4odXJsLCBcIlwiLCBcInNjcm9sbGJhcnM9bm8sdG9vbGJhcj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT15ZXMsY2VudGVyPXllcyxoZWxwPW5vLCBzdGF0dXM9eWVzLHRvcD0gXCIgKyB0b3AgKyBcInB4LGxlZnQ9XCIgKyBsZWZ0ICsgXCJweCx3aWR0aD1cIiArIHdpZHRoICsgXCJweCxoZWlnaHQ9XCIgKyBoZWlnaHQgKyBcInB4XCIpO1xuXG4gICAgaWYgKHdpbkhhbmRsZSA9PSBudWxsKSB7XG4gICAgICBhbGVydChcIuivt+ino+mZpOa1j+iniOWZqOWvueacrOezu+e7n+W8ueWHuueql+WPo+eahOmYu+atouiuvue9ru+8gVwiKTtcbiAgICB9XG4gIH0sXG4gIF9UcnlHZXRQYXJlbnRXaW5kb3c6IGZ1bmN0aW9uIF9UcnlHZXRQYXJlbnRXaW5kb3cod2luKSB7XG4gICAgaWYgKHdpbi5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHdpbi5wYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIF9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iajogZnVuY3Rpb24gX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKHdpbiwgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSkge1xuICAgIGlmICh0cnlmaW5kdGltZSA+IGN1cnJlbnR0cnlmaW5kdGltZSkge1xuICAgICAgdmFyIGlzdG9wRnJhbWVwYWdlID0gZmFsc2U7XG4gICAgICBjdXJyZW50dHJ5ZmluZHRpbWUrKztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaXN0b3BGcmFtZXBhZ2UgPSB3aW4uSXNUb3BGcmFtZVBhZ2U7XG5cbiAgICAgICAgaWYgKGlzdG9wRnJhbWVwYWdlKSB7XG4gICAgICAgICAgcmV0dXJuIHdpbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmoodGhpcy5fVHJ5R2V0UGFyZW50V2luZG93KHdpbiksIHRyeWZpbmR0aW1lLCBjdXJyZW50dHJ5ZmluZHRpbWUpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih0aGlzLl9UcnlHZXRQYXJlbnRXaW5kb3cod2luKSwgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIF9PcGVuV2luZG93SW5GcmFtZVBhZ2U6IGZ1bmN0aW9uIF9PcGVuV2luZG93SW5GcmFtZVBhZ2Uob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICBpZiAoU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KGRpYWxvZ0lkKSkge1xuICAgICAgYWxlcnQoXCJkaWFsb2dJZOS4jeiDveS4uuepulwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB1cmwgPSBCYXNlVXRpbGl0eS5BcHBlbmRUaW1lU3RhbXBVcmwodXJsKTtcbiAgICB2YXIgYXV0b2RpYWxvZ2lkID0gXCJGcmFtZURpYWxvZ0VsZVwiICsgZGlhbG9nSWQ7XG5cbiAgICBpZiAoJCh0aGlzLkZyYW1lUGFnZVJlZi5kb2N1bWVudCkuZmluZChcIiNcIiArIGF1dG9kaWFsb2dpZCkubGVuZ3RoID09IDApIHtcbiAgICAgIHZhciBkaWFsb2dFbGUgPSB0aGlzLl9DcmVhdGVJZnJtYWVEaWFsb2dFbGVtZW50KHRoaXMuRnJhbWVQYWdlUmVmLmRvY3VtZW50LCBhdXRvZGlhbG9naWQsIHVybCk7XG5cbiAgICAgIHZhciBkZWZhdWx0b3B0aW9ucyA9IHtcbiAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCLns7vnu59cIixcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKGV2ZW50LCB1aSkge1xuICAgICAgICAgIHZhciBhdXRvZGlhbG9naWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgICAkKHRoaXMpLmZpbmQoXCJpZnJhbWVcIikucmVtb3ZlKCk7XG4gICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgJCh0aGlzKS5kaWFsb2coXCJkZXN0cm95XCIpO1xuICAgICAgICAgICQoXCIjXCIgKyBhdXRvZGlhbG9naWQpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgaWYgKEJyb3dzZXJJbmZvVXRpbGl0eS5Jc0lFOERvY3VtZW50TW9kZSgpKSB7XG4gICAgICAgICAgICBDb2xsZWN0R2FyYmFnZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmICh3aHR5cGUgPT0gMCkge1xuICAgICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTgwO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gMSkge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogNjgwLFxuICAgICAgICAgIHdpZHRoOiA5ODBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAyKSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgICAgd2lkdGg6IDgwMFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDQpIHtcbiAgICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgICBoZWlnaHQ6IDM4MCxcbiAgICAgICAgICB3aWR0aDogNDgwXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNSkge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogMTgwLFxuICAgICAgICAgIHdpZHRoOiAzMDBcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLndpZHRoID09IDApIHtcbiAgICAgICAgb3B0aW9ucy53aWR0aCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZVdpZHRoKCkgLSAyMDtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuaGVpZ2h0ID09IDApIHtcbiAgICAgICAgb3B0aW9ucy5oZWlnaHQgPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSAtIDE4MDtcbiAgICAgIH1cblxuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgJChkaWFsb2dFbGUpLmRpYWxvZyhkZWZhdWx0b3B0aW9ucyk7XG4gICAgICAkKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCBcIjIwMDBcIik7XG4gICAgICAkKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgXCIyMDAxXCIpO1xuICAgICAgdmFyICRpZnJhbWVvYmogPSAkKGRpYWxvZ0VsZSkuZmluZChcImlmcmFtZVwiKTtcbiAgICAgICRpZnJhbWVvYmoub24oXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKFN0cmluZ1V0aWxpdHkuSXNTYW1lT3JnaW4od2luZG93LmxvY2F0aW9uLmhyZWYsIHVybCkpIHtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuRnJhbWVXaW5kb3dJZCA9IGF1dG9kaWFsb2dpZDtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuT3BlbmVyV2luZG93T2JqID0gb3BlbmVyd2luZG93O1xuICAgICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5Jc09wZW5Gb3JGcmFtZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCLot6jln59JZnJhbWUs5peg5rOV6K6+572u5bGe5oCnIVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAkaWZyYW1lb2JqLmF0dHIoXCJzcmNcIiwgdXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dpZCkuZGlhbG9nKFwibW92ZVRvVG9wXCIpO1xuICAgIH1cbiAgfSxcbiAgX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nOiBmdW5jdGlvbiBfRnJhbWVfRnJhbWVQYWdlQ2xvc2VEaWFsb2coZGlhbG9naWQpIHtcbiAgICAkKFwiI1wiICsgZGlhbG9naWQpLmRpYWxvZyhcImNsb3NlXCIpO1xuICB9LFxuICBGcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iajogZnVuY3Rpb24gRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKSB7XG4gICAgdmFyIHRyeWZpbmR0aW1lID0gNTtcbiAgICB2YXIgY3VycmVudHRyeWZpbmR0aW1lID0gMTtcbiAgICByZXR1cm4gdGhpcy5fRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luZG93LCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgfSxcbiAgRnJhbWVfQWxlcnQ6IGZ1bmN0aW9uIEZyYW1lX0FsZXJ0KCkge30sXG4gIEZyYW1lX0NvbWZpcm06IGZ1bmN0aW9uIEZyYW1lX0NvbWZpcm0oKSB7fSxcbiAgRnJhbWVfT3BlbklmcmFtZVdpbmRvdzogZnVuY3Rpb24gRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIGlmICh1cmwgPT0gXCJcIikge1xuICAgICAgYWxlcnQoXCJ1cmzkuI3og73kuLrnqbrlrZfnrKbkuLIhXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB3cndpbiA9IHRoaXMuRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKTtcbiAgICB0aGlzLkZyYW1lUGFnZVJlZiA9IHdyd2luO1xuXG4gICAgaWYgKHdyd2luICE9IG51bGwpIHtcbiAgICAgIHRoaXMuRnJhbWVQYWdlUmVmLkRpYWxvZ1V0aWxpdHkuRnJhbWVQYWdlUmVmID0gd3J3aW47XG5cbiAgICAgIHRoaXMuRnJhbWVQYWdlUmVmLkRpYWxvZ1V0aWxpdHkuX09wZW5XaW5kb3dJbkZyYW1lUGFnZShvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsZXJ0KFwi5om+5LiN5YiwRnJhbWVQYWdlISFcIik7XG4gICAgfVxuICB9LFxuICBGcmFtZV9DbG9zZURpYWxvZzogZnVuY3Rpb24gRnJhbWVfQ2xvc2VEaWFsb2cob3BlcmVyV2luZG93KSB7XG4gICAgdmFyIHdyd2luID0gdGhpcy5GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaigpO1xuICAgIHZhciBvcGVuZXJ3aW4gPSBvcGVyZXJXaW5kb3cuT3BlbmVyV2luZG93T2JqO1xuICAgIHZhciBhdXRvZGlhbG9naWQgPSBvcGVyZXJXaW5kb3cuRnJhbWVXaW5kb3dJZDtcblxuICAgIHdyd2luLkRpYWxvZ1V0aWxpdHkuX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nKGF1dG9kaWFsb2dpZCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEaWN0aW9uYXJ5VXRpbGl0eSA9IHtcbiAgX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjogbnVsbCxcbiAgR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uOiBmdW5jdGlvbiBHcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24oc291cmNlRGljdGlvbmFyeUpzb24pIHtcbiAgICBpZiAodGhpcy5fR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uID09IG51bGwpIHtcbiAgICAgIGlmIChzb3VyY2VEaWN0aW9uYXJ5SnNvbiAhPSBudWxsKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBncm91cFZhbHVlIGluIHNvdXJjZURpY3Rpb25hcnlKc29uKSB7XG4gICAgICAgICAgcmVzdWx0W2dyb3VwVmFsdWVdID0ge307XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHRbZ3JvdXBWYWx1ZV1bc291cmNlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1baV0uZGljdFZhbHVlXSA9IHNvdXJjZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2ldLmRpY3RUZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbiA9IHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY29uc29sZSA9IGNvbnNvbGUgfHwge1xuICBsb2c6IGZ1bmN0aW9uIGxvZygpIHt9LFxuICB3YXJuOiBmdW5jdGlvbiB3YXJuKCkge30sXG4gIGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHt9XG59O1xuXG5mdW5jdGlvbiBEYXRlRXh0ZW5kX0RhdGVGb3JtYXQoZGF0ZSwgZm10KSB7XG4gIGlmIChudWxsID09IGRhdGUgfHwgdW5kZWZpbmVkID09IGRhdGUpIHJldHVybiAnJztcbiAgdmFyIG8gPSB7XG4gICAgXCJNK1wiOiBkYXRlLmdldE1vbnRoKCkgKyAxLFxuICAgIFwiZCtcIjogZGF0ZS5nZXREYXRlKCksXG4gICAgXCJoK1wiOiBkYXRlLmdldEhvdXJzKCksXG4gICAgXCJtK1wiOiBkYXRlLmdldE1pbnV0ZXMoKSxcbiAgICBcInMrXCI6IGRhdGUuZ2V0U2Vjb25kcygpLFxuICAgIFwiU1wiOiBkYXRlLmdldE1pbGxpc2Vjb25kcygpXG4gIH07XG4gIGlmICgvKHkrKS8udGVzdChmbXQpKSBmbXQgPSBmbXQucmVwbGFjZShSZWdFeHAuJDEsIChkYXRlLmdldEZ1bGxZZWFyKCkgKyBcIlwiKS5zdWJzdHIoNCAtIFJlZ0V4cC4kMS5sZW5ndGgpKTtcblxuICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICBpZiAobmV3IFJlZ0V4cChcIihcIiArIGsgKyBcIilcIikudGVzdChmbXQpKSBmbXQgPSBmbXQucmVwbGFjZShSZWdFeHAuJDEsIFJlZ0V4cC4kMS5sZW5ndGggPT0gMSA/IG9ba10gOiAoXCIwMFwiICsgb1trXSkuc3Vic3RyKChcIlwiICsgb1trXSkubGVuZ3RoKSk7XG4gIH1cblxuICByZXR1cm4gZm10O1xufVxuXG5EYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBEYXRlRXh0ZW5kX0RhdGVGb3JtYXQodGhpcywgJ3l5eXktTU0tZGQgbW06aGg6c3MnKTtcbn07XG5cbmlmICghT2JqZWN0LmNyZWF0ZSkge1xuICBPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIGFsZXJ0KFwiRXh0ZW5kIE9iamVjdC5jcmVhdGVcIik7XG5cbiAgICBmdW5jdGlvbiBGKCkge31cblxuICAgIHJldHVybiBmdW5jdGlvbiAobykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPYmplY3QuY3JlYXRlIGltcGxlbWVudGF0aW9uIG9ubHkgYWNjZXB0cyBvbmUgcGFyYW1ldGVyLicpO1xuICAgICAgfVxuXG4gICAgICBGLnByb3RvdHlwZSA9IG87XG4gICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICB9O1xuICB9KCk7XG59XG5cbiQuZm4ub3V0ZXJIVE1MID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gIXRoaXMubGVuZ3RoID8gdGhpcyA6IHRoaXNbMF0ub3V0ZXJIVE1MIHx8IGZ1bmN0aW9uIChlbCkge1xuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZWwuY2xvbmVOb2RlKHRydWUpKTtcbiAgICB2YXIgY29udGVudHMgPSBkaXYuaW5uZXJIVE1MO1xuICAgIGRpdiA9IG51bGw7XG4gICAgYWxlcnQoY29udGVudHMpO1xuICAgIHJldHVybiBjb250ZW50cztcbiAgfSh0aGlzWzBdKTtcbn07XG5cbmZ1bmN0aW9uIHJlZkNzc0xpbmsoaHJlZikge1xuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgc3R5bGUucmVsID0gJ3N0eWxlc2hlZXQnO1xuICBzdHlsZS5ocmVmID0gaHJlZjtcbiAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIHJldHVybiBzdHlsZS5zaGVldCB8fCBzdHlsZS5zdHlsZVNoZWV0O1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSnNvblV0aWxpdHkgPSB7XG4gIFBhcnNlQXJyYXlKc29uVG9UcmVlSnNvbjogZnVuY3Rpb24gUGFyc2VBcnJheUpzb25Ub1RyZWVKc29uKGNvbmZpZywgc291cmNlQXJyYXksIHJvb3RJZCkge1xuICAgIHZhciBfY29uZmlnID0ge1xuICAgICAgS2V5RmllbGQ6IFwiXCIsXG4gICAgICBSZWxhdGlvbkZpZWxkOiBcIlwiLFxuICAgICAgQ2hpbGRGaWVsZE5hbWU6IFwiXCJcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gRmluZEpzb25CeUlkKGtleUZpZWxkLCBpZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc291cmNlQXJyYXlbaV1ba2V5RmllbGRdID09IGlkKSB7XG4gICAgICAgICAgcmV0dXJuIHNvdXJjZUFycmF5W2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGFsZXJ0KFwiUGFyc2VBcnJheUpzb25Ub1RyZWVKc29uLkZpbmRKc29uQnlJZDrlnKhzb3VyY2VBcnJheeS4reaJvuS4jeWIsOaMh+Wumklk55qE6K6w5b2VXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIEZpbmRDaGlsZEpzb24ocmVsYXRpb25GaWVsZCwgcGlkKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvdXJjZUFycmF5W2ldW3JlbGF0aW9uRmllbGRdID09IHBpZCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHNvdXJjZUFycmF5W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIEZpbmRDaGlsZE5vZGVBbmRQYXJzZShwaWQsIHJlc3VsdCkge1xuICAgICAgdmFyIGNoaWxkanNvbnMgPSBGaW5kQ2hpbGRKc29uKGNvbmZpZy5SZWxhdGlvbkZpZWxkLCBwaWQpO1xuXG4gICAgICBpZiAoY2hpbGRqc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChyZXN1bHRbY29uZmlnLkNoaWxkRmllbGROYW1lXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXN1bHRbY29uZmlnLkNoaWxkRmllbGROYW1lXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZGpzb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHRvT2JqID0ge307XG4gICAgICAgICAgdG9PYmogPSBKc29uVXRpbGl0eS5TaW1wbGVDbG9uZUF0dHIodG9PYmosIGNoaWxkanNvbnNbaV0pO1xuICAgICAgICAgIHJlc3VsdFtjb25maWcuQ2hpbGRGaWVsZE5hbWVdLnB1c2godG9PYmopO1xuICAgICAgICAgIHZhciBpZCA9IHRvT2JqW2NvbmZpZy5LZXlGaWVsZF07XG4gICAgICAgICAgRmluZENoaWxkTm9kZUFuZFBhcnNlKGlkLCB0b09iaik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIHJvb3RKc29uID0gRmluZEpzb25CeUlkKGNvbmZpZy5LZXlGaWVsZCwgcm9vdElkKTtcbiAgICByZXN1bHQgPSB0aGlzLlNpbXBsZUNsb25lQXR0cihyZXN1bHQsIHJvb3RKc29uKTtcbiAgICBGaW5kQ2hpbGROb2RlQW5kUGFyc2Uocm9vdElkLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFJlc29sdmVTaW1wbGVBcnJheUpzb25Ub1RyZWVKc29uOiBmdW5jdGlvbiBSZXNvbHZlU2ltcGxlQXJyYXlKc29uVG9UcmVlSnNvbihjb25maWcsIHNvdXJjZUpzb24sIHJvb3ROb2RlSWQpIHtcbiAgICBhbGVydChcIkpzb25VdGlsaXR5LlJlc29sdmVTaW1wbGVBcnJheUpzb25Ub1RyZWVKc29uIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgU2ltcGxlQ2xvbmVBdHRyOiBmdW5jdGlvbiBTaW1wbGVDbG9uZUF0dHIodG9PYmosIGZyb21PYmopIHtcbiAgICBmb3IgKHZhciBhdHRyIGluIGZyb21PYmopIHtcbiAgICAgIHRvT2JqW2F0dHJdID0gZnJvbU9ialthdHRyXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9PYmo7XG4gIH0sXG4gIENsb25lU2ltcGxlOiBmdW5jdGlvbiBDbG9uZVNpbXBsZShzb3VyY2UpIHtcbiAgICB2YXIgbmV3SnNvbiA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIHNvdXJjZSk7XG4gICAgcmV0dXJuIG5ld0pzb247XG4gIH0sXG4gIEpzb25Ub1N0cmluZzogZnVuY3Rpb24gSnNvblRvU3RyaW5nKG9iaikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICB9LFxuICBKc29uVG9TdHJpbmdGb3JtYXQ6IGZ1bmN0aW9uIEpzb25Ub1N0cmluZ0Zvcm1hdChvYmopIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCAyKTtcbiAgfSxcbiAgU3RyaW5nVG9Kc29uOiBmdW5jdGlvbiBTdHJpbmdUb0pzb24oc3RyKSB7XG4gICAgcmV0dXJuIGV2YWwoXCIoXCIgKyBzdHIgKyBcIilcIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMaXN0UGFnZVV0aWxpdHkgPSB7XG4gIERlZmF1bHRMaXN0SGVpZ2h0OiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodCgpIHtcbiAgICBpZiAoUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgPiA3ODApIHtcbiAgICAgIHJldHVybiA2Nzg7XG4gICAgfVxuXG4gICAgcmV0dXJuIDUwMDtcbiAgfSxcbiAgRGVmYXVsdExpc3RIZWlnaHRfNTA6IGZ1bmN0aW9uIERlZmF1bHRMaXN0SGVpZ2h0XzUwKCkge1xuICAgIHJldHVybiB0aGlzLkRlZmF1bHRMaXN0SGVpZ2h0KCkgLSA1MDtcbiAgfSxcbiAgRGVmYXVsdExpc3RIZWlnaHRfMTAwOiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodF8xMDAoKSB7XG4gICAgcmV0dXJuIHRoaXMuRGVmYXVsdExpc3RIZWlnaHQoKSAtIDEwMDtcbiAgfSxcbiAgR2V0R2VuZXJhbFBhZ2VIZWlnaHQ6IGZ1bmN0aW9uIEdldEdlbmVyYWxQYWdlSGVpZ2h0KGZpeEhlaWdodCkge1xuICAgIHZhciBwYWdlSGVpZ2h0ID0galF1ZXJ5KGRvY3VtZW50KS5oZWlnaHQoKTtcblxuICAgIGlmICgkKFwiI2xpc3Qtc2ltcGxlLXNlYXJjaC13cmFwXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgIHBhZ2VIZWlnaHQgPSBwYWdlSGVpZ2h0IC0gJChcIiNsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFwiKS5vdXRlckhlaWdodCgpICsgZml4SGVpZ2h0IC0gJChcIiNsaXN0LWJ1dHRvbi13cmFwXCIpLm91dGVySGVpZ2h0KCkgLSAkKFwiI2xpc3QtcGFnZXItd3JhcFwiKS5vdXRlckhlaWdodCgpIC0gMzA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHBhZ2VIZWlnaHQgPSBwYWdlSGVpZ2h0IC0gJChcIiNsaXN0LWJ1dHRvbi13cmFwXCIpLm91dGVySGVpZ2h0KCkgKyBmaXhIZWlnaHQgLSAoJChcIiNsaXN0LXBhZ2VyLXdyYXBcIikubGVuZ3RoID4gMCA/ICQoXCIjbGlzdC1wYWdlci13cmFwXCIpLm91dGVySGVpZ2h0KCkgOiAwKSAtIDMwO1xuICAgIH1cblxuICAgIHJldHVybiBwYWdlSGVpZ2h0O1xuICB9LFxuICBHZXRGaXhIZWlnaHQ6IGZ1bmN0aW9uIEdldEZpeEhlaWdodCgpIHtcbiAgICByZXR1cm4gLTcwO1xuICB9LFxuICBJVmlld1RhYmxlUmVuZGVyZXI6IHtcbiAgICBUb0RhdGVZWVlZX01NX0REOiBmdW5jdGlvbiBUb0RhdGVZWVlZX01NX0REKGgsIGRhdGV0aW1lKSB7XG4gICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKGRhdGV0aW1lKTtcbiAgICAgIHZhciBkYXRlU3RyID0gRGF0ZVV0aWxpdHkuRm9ybWF0KGRhdGUsICd5eXl5LU1NLWRkJyk7XG4gICAgICByZXR1cm4gaCgnZGl2JywgZGF0ZVN0cik7XG4gICAgfSxcbiAgICBTdHJpbmdUb0RhdGVZWVlZX01NX0REOiBmdW5jdGlvbiBTdHJpbmdUb0RhdGVZWVlZX01NX0REKGgsIGRhdGV0aW1lKSB7XG4gICAgICB2YXIgZGF0ZVN0ciA9IGRhdGV0aW1lLnNwbGl0KFwiIFwiKVswXTtcbiAgICAgIHJldHVybiBoKCdkaXYnLCBkYXRlU3RyKTtcbiAgICB9LFxuICAgIFRvU3RhdHVzRW5hYmxlOiBmdW5jdGlvbiBUb1N0YXR1c0VuYWJsZShoLCBzdGF0dXMpIHtcbiAgICAgIGlmIChzdGF0dXMgPT0gMCkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLnpoHnlKhcIik7XG4gICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PSAxKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuWQr+eUqFwiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFRvWWVzTm9FbmFibGU6IGZ1bmN0aW9uIFRvWWVzTm9FbmFibGUoaCwgc3RhdHVzKSB7XG4gICAgICBpZiAoc3RhdHVzID09IDApIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5ZCmXCIpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gMSkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLmmK9cIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBUb0RpY3Rpb25hcnlUZXh0OiBmdW5jdGlvbiBUb0RpY3Rpb25hcnlUZXh0KGgsIGRpY3Rpb25hcnlKc29uLCBncm91cFZhbHVlLCBkaWN0aW9uYXJ5VmFsdWUpIHtcbiAgICAgIHZhciBzaW1wbGVEaWN0aW9uYXJ5SnNvbiA9IERpY3Rpb25hcnlVdGlsaXR5Lkdyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbihkaWN0aW9uYXJ5SnNvbik7XG5cbiAgICAgIGlmIChkaWN0aW9uYXJ5VmFsdWUgPT0gbnVsbCB8fCBkaWN0aW9uYXJ5VmFsdWUgPT0gXCJcIikge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCJcIik7XG4gICAgICB9XG5cbiAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXSAhPSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKHNpbXBsZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdKSB7XG4gICAgICAgICAgaWYgKHNpbXBsZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2RpY3Rpb25hcnlWYWx1ZV0pIHtcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtkaWN0aW9uYXJ5VmFsdWVdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5om+5LiN5Yiw6KOF5o2i55qEVEVYVFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5om+5LiN5Yiw6KOF5o2i55qE5YiG57uEXCIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLmib7kuI3liLDoo4XmjaLnmoTliIbnu4RcIik7XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZDogZnVuY3Rpb24gSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWQoc2VsZWN0aW9uUm93cykge1xuICAgIGlmIChzZWxlY3Rpb25Sb3dzICE9IG51bGwgJiYgc2VsZWN0aW9uUm93cy5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHtcbiAgICAgICAgICBmdW5jKHNlbGVjdGlvblJvd3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInkuK3pnIDopoHmk43kvZznmoTooYwhXCIsIG51bGwpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7fVxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkT25lOiBmdW5jdGlvbiBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZShzZWxlY3Rpb25Sb3dzKSB7XG4gICAgaWYgKHNlbGVjdGlvblJvd3MgIT0gbnVsbCAmJiBzZWxlY3Rpb25Sb3dzLmxlbmd0aCA+IDAgJiYgc2VsZWN0aW9uUm93cy5sZW5ndGggPT0gMSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7XG4gICAgICAgICAgZnVuYyhzZWxlY3Rpb25Sb3dzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5Lit6ZyA6KaB5pON5L2c55qE6KGM77yM5q+P5qyh5Y+q6IO96YCJ5Lit5LiA6KGMIVwiLCBudWxsKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge31cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBJVmlld0NoYW5nZVNlcnZlclN0YXR1czogZnVuY3Rpb24gSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXModXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCBzdGF0dXNOYW1lLCBwYWdlQXBwT2JqKSB7XG4gICAgdmFyIGlkQXJyYXkgPSBuZXcgQXJyYXkoKTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2VsZWN0aW9uUm93cy5sZW5ndGg7IGkrKykge1xuICAgICAgaWRBcnJheS5wdXNoKHNlbGVjdGlvblJvd3NbaV1baWRGaWVsZF0pO1xuICAgIH1cblxuICAgIEFqYXhVdGlsaXR5LlBvc3QodXJsLCB7XG4gICAgICBpZHM6IGlkQXJyYXkuam9pbihcIjtcIiksXG4gICAgICBzdGF0dXM6IHN0YXR1c05hbWVcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIHBhZ2VBcHBPYmoucmVsb2FkRGF0YSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgIH1cbiAgICB9LCBcImpzb25cIik7XG4gIH0sXG4gIElWaWV3TW92ZUZhY2U6IGZ1bmN0aW9uIElWaWV3TW92ZUZhY2UodXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCB0eXBlLCBwYWdlQXBwT2JqKSB7XG4gICAgdGhpcy5JVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZShzZWxlY3Rpb25Sb3dzKS50aGVuKGZ1bmN0aW9uIChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgICByZWNvcmRJZDogc2VsZWN0aW9uUm93c1swXVtpZEZpZWxkXSxcbiAgICAgICAgdHlwZTogdHlwZVxuICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgICB9XG4gICAgICB9LCBcImpzb25cIik7XG4gICAgfSk7XG4gIH0sXG4gIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZTogZnVuY3Rpb24gSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgc3RhdHVzTmFtZSwgcGFnZUFwcE9iaikge1xuICAgIHRoaXMuSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWQoc2VsZWN0aW9uUm93cykudGhlbihmdW5jdGlvbiAoc2VsZWN0aW9uUm93cykge1xuICAgICAgTGlzdFBhZ2VVdGlsaXR5LklWaWV3Q2hhbmdlU2VydmVyU3RhdHVzKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgc3RhdHVzTmFtZSwgcGFnZUFwcE9iaik7XG4gICAgfSk7XG4gIH0sXG4gIElWaWV3VGFibGVEZWxldGVSb3c6IGZ1bmN0aW9uIElWaWV3VGFibGVEZWxldGVSb3codXJsLCByZWNvcmRJZCwgcGFnZUFwcE9iaikge1xuICAgIERpYWxvZ1V0aWxpdHkuQ29uZmlybSh3aW5kb3csIFwi56Gu6K6k6KaB5Yig6Zmk5b2T5YmN6K6w5b2V5ZCX77yfXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgIEFqYXhVdGlsaXR5LkRlbGV0ZSh1cmwsIHtcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZElkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9KTtcbiAgfSxcbiAgSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNoOiBmdW5jdGlvbiBJVmlld1RhYmxlTG9hZERhdGFTZWFyY2godXJsLCBwYWdlTnVtLCBwYWdlU2l6ZSwgc2VhcmNoQ29uZGl0aW9uLCBwYWdlQXBwT2JqLCBpZEZpZWxkLCBhdXRvU2VsZWN0ZWRPbGRSb3dzLCBzdWNjZXNzRnVuYywgbG9hZERpY3QpIHtcbiAgICBpZiAobG9hZERpY3QgPT0gdW5kZWZpbmVkIHx8IGxvYWREaWN0ID09IG51bGwpIHtcbiAgICAgIGxvYWREaWN0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgIFwicGFnZU51bVwiOiBwYWdlTnVtLFxuICAgICAgXCJwYWdlU2l6ZVwiOiBwYWdlU2l6ZSxcbiAgICAgIFwic2VhcmNoQ29uZGl0aW9uXCI6IFNlYXJjaFV0aWxpdHkuU2VyaWFsaXphdGlvblNlYXJjaENvbmRpdGlvbihzZWFyY2hDb25kaXRpb24pLFxuICAgICAgXCJsb2FkRGljdFwiOiBsb2FkRGljdFxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIHN1Y2Nlc3NGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN1Y2Nlc3NGdW5jKHJlc3VsdCwgcGFnZUFwcE9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIHBhZ2VBcHBPYmoucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGF1dG9TZWxlY3RlZE9sZFJvd3MpIHtcbiAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZUFwcE9iai50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzW2pdW2lkRmllbGRdID09IHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldW2lkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0RXJyb3Iod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfSxcbiAgSVZpZXdUYWJsZUxvYWREYXRhTm9TZWFyY2g6IGZ1bmN0aW9uIElWaWV3VGFibGVMb2FkRGF0YU5vU2VhcmNoKHVybCwgcGFnZU51bSwgcGFnZVNpemUsIHBhZ2VBcHBPYmosIGlkRmllbGQsIGF1dG9TZWxlY3RlZE9sZFJvd3MsIHN1Y2Nlc3NGdW5jKSB7XG4gICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgIHBhZ2VOdW06IHBhZ2VOdW0sXG4gICAgICBwYWdlU2l6ZTogcGFnZVNpemVcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGEgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICBwYWdlQXBwT2JqLnBhZ2VUb3RhbCA9IHJlc3VsdC5kYXRhLnRvdGFsO1xuXG4gICAgICAgIGlmIChhdXRvU2VsZWN0ZWRPbGRSb3dzKSB7XG4gICAgICAgICAgaWYgKHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93cyAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VBcHBPYmoudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93c1tqXVtpZEZpZWxkXSA9PSBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXVtpZEZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFbaV0uX2NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3VjY2Vzc0Z1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3VjY2Vzc0Z1bmMocmVzdWx0LCBwYWdlQXBwT2JqKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfSxcbiAgSVZpZXdUYWJsZUlubmVyQnV0dG9uOiB7XG4gICAgVmlld0J1dHRvbjogZnVuY3Rpb24gVmlld0J1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiB2aWV3XCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai52aWV3KHBhcmFtcy5yb3dbaWRGaWVsZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBFZGl0QnV0dG9uOiBmdW5jdGlvbiBFZGl0QnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIGVkaXRcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLmVkaXQocGFyYW1zLnJvd1tpZEZpZWxkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIERlbGV0ZUJ1dHRvbjogZnVuY3Rpb24gRGVsZXRlQnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIGRlbFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmouZGVsKHBhcmFtcy5yb3dbaWRGaWVsZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUGFnZVN0eWxlVXRpbGl0eSA9IHtcbiAgR2V0UGFnZUhlaWdodDogZnVuY3Rpb24gR2V0UGFnZUhlaWdodCgpIHtcbiAgICByZXR1cm4galF1ZXJ5KHdpbmRvdy5kb2N1bWVudCkuaGVpZ2h0KCk7XG4gIH0sXG4gIEdldFBhZ2VXaWR0aDogZnVuY3Rpb24gR2V0UGFnZVdpZHRoKCkge1xuICAgIHJldHVybiBqUXVlcnkod2luZG93LmRvY3VtZW50KS53aWR0aCgpO1xuICB9LFxuICBHZXRXaW5kb3dIZWlnaHQ6IGZ1bmN0aW9uIEdldFdpbmRvd0hlaWdodCgpIHtcbiAgICByZXR1cm4gJCh3aW5kb3cpLmhlaWdodCgpO1xuICB9LFxuICBHZXRXaW5kb3dXaWR0aDogZnVuY3Rpb24gR2V0V2luZG93V2lkdGgoKSB7XG4gICAgcmV0dXJuICQod2luZG93KS53aWR0aCgpO1xuICB9LFxuICBHZXRMaXN0QnV0dG9uT3V0ZXJIZWlnaHQ6IGZ1bmN0aW9uIEdldExpc3RCdXR0b25PdXRlckhlaWdodCgpIHtcbiAgICBhbGVydChcIlBhZ2VTdHlsZVV0aWxpdHkuR2V0TGlzdEJ1dHRvbk91dGVySGVpZ2h0IOW3suWBnOeUqFwiKTtcbiAgICByZXR1cm4galF1ZXJ5KFwiLmxpc3QtYnV0dG9uLW91dGVyLWNcIikub3V0ZXJIZWlnaHQoKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNlYXJjaFV0aWxpdHkgPSB7XG4gIFNlYXJjaEZpZWxkVHlwZToge1xuICAgIEludFR5cGU6IFwiSW50VHlwZVwiLFxuICAgIE51bWJlclR5cGU6IFwiTnVtYmVyVHlwZVwiLFxuICAgIERhdGFUeXBlOiBcIkRhdGVUeXBlXCIsXG4gICAgTGlrZVN0cmluZ1R5cGU6IFwiTGlrZVN0cmluZ1R5cGVcIixcbiAgICBMZWZ0TGlrZVN0cmluZ1R5cGU6IFwiTGVmdExpa2VTdHJpbmdUeXBlXCIsXG4gICAgUmlnaHRMaWtlU3RyaW5nVHlwZTogXCJSaWdodExpa2VTdHJpbmdUeXBlXCIsXG4gICAgU3RyaW5nVHlwZTogXCJTdHJpbmdUeXBlXCIsXG4gICAgRGF0YVN0cmluZ1R5cGU6IFwiRGF0ZVN0cmluZ1R5cGVcIixcbiAgICBBcnJheUxpa2VTdHJpbmdUeXBlOiBcIkFycmF5TGlrZVN0cmluZ1R5cGVcIlxuICB9LFxuICBTZXJpYWxpemF0aW9uU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBTZXJpYWxpemF0aW9uU2VhcmNoQ29uZGl0aW9uKHNlYXJjaENvbmRpdGlvbikge1xuICAgIHZhciBzZWFyY2hDb25kaXRpb25DbG9uZSA9IEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHNlYXJjaENvbmRpdGlvbik7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc2VhcmNoQ29uZGl0aW9uQ2xvbmUpIHtcbiAgICAgIGlmIChzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnR5cGUgPT0gU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuQXJyYXlMaWtlU3RyaW5nVHlwZSkge1xuICAgICAgICBpZiAoc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSAhPSBudWxsICYmIHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUgPSBzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlLmpvaW4oXCI7XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHNlYXJjaENvbmRpdGlvbkNsb25lKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEpCdWlsZDREU2VsZWN0VmlldyA9IHtcbiAgU2VsZWN0RW52VmFyaWFibGU6IHtcbiAgICBVUkw6IFwiL0hUTUwvU2VsZWN0Vmlldy9TZWxlY3RFbnZWYXJpYWJsZS5odG1sXCIsXG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KGluc3RhbmNlTmFtZSkge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLlVSTCwge1xuICAgICAgICBcImluc3RhbmNlTmFtZVwiOiBpbnN0YW5jZU5hbWVcbiAgICAgIH0pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHRpdGxlOiBcIumAieaLqeWPmOmHj1wiLFxuICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdEluRnJhbWU6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0SW5GcmFtZShvcGVuZXIsIGluc3RhbmNlTmFtZSwgb3B0aW9uKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuVVJMLCB7XG4gICAgICAgIFwiaW5zdGFuY2VOYW1lXCI6IGluc3RhbmNlTmFtZVxuICAgICAgfSk7XG4gICAgICB2YXIgb3B0aW9uID0gJC5leHRlbmQodHJ1ZSwge30sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqeWPmOmHj1wiXG4gICAgICB9LCBvcHRpb24pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KG9wZW5lciwgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZDA1LCB1cmwsIG9wdGlvbiwgMSk7XG4gICAgICAkKHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQpLmZpbmQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIDEwMTAwKTtcbiAgICAgICQod2luZG93LnBhcmVudC5kb2N1bWVudCkuZmluZChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIDEwMTAxKTtcbiAgICB9LFxuICAgIGZvcm1hdFRleHQ6IGZ1bmN0aW9uIGZvcm1hdFRleHQodHlwZSwgdGV4dCkge1xuICAgICAgaWYgKHR5cGUgPT0gXCJDb25zdFwiKSB7XG4gICAgICAgIHJldHVybiBcIumdmeaAgeWAvDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiRGF0ZVRpbWVcIikge1xuICAgICAgICByZXR1cm4gXCLml6XmnJ/ml7bpl7Q644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIkFwaVZhclwiKSB7XG4gICAgICAgIHJldHVybiBcIkFQSeWPmOmHjzrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiTnVtYmVyQ29kZVwiKSB7XG4gICAgICAgIHJldHVybiBcIuW6j+WPt+e8lueggTrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiSWRDb2RlclwiKSB7XG4gICAgICAgIHJldHVybiBcIuS4u+mUrueUn+aIkDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi44CQ5peg44CRXCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBcIuacquefpeexu+Wei1wiICsgdGV4dDtcbiAgICB9XG4gIH0sXG4gIFNlbGVjdEJpbmRUb0ZpZWxkOiB7XG4gICAgVVJMOiBcIi9IVE1ML1NlbGVjdFZpZXcvU2VsZWN0QmluZFRvRmllbGQuaHRtbFwiLFxuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdChpbnN0YW5jZU5hbWUpIHtcbiAgICAgIHZhciB1cmwgPSB0aGlzLlVSTCArIFwiP2luc3RhbmNlTmFtZT1cIiArIGluc3RhbmNlTmFtZTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB0aXRsZTogXCLpgInmi6nlj5jph49cIixcbiAgICAgICAgbW9kYWw6IHRydWVcbiAgICAgIH0sIDIpO1xuICAgIH0sXG4gICAgYmVnaW5TZWxlY3RJbkZyYW1lOiBmdW5jdGlvbiBiZWdpblNlbGVjdEluRnJhbWUob3BlbmVyLCBpbnN0YW5jZU5hbWUsIG9wdGlvbikge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLlVSTCwge1xuICAgICAgICBcImluc3RhbmNlTmFtZVwiOiBpbnN0YW5jZU5hbWVcbiAgICAgIH0pO1xuICAgICAgdmFyIG9wdGlvbiA9ICQuZXh0ZW5kKHRydWUsIHt9LCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCLpgInmi6nnu5HlrprlrZfmrrVcIlxuICAgICAgfSwgb3B0aW9uKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXIsIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwNSwgdXJsLCBvcHRpb24sIDEpO1xuICAgICAgJCh3aW5kb3cucGFyZW50LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAkKHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG4gICAgfVxuICB9LFxuICBTZWxlY3RWYWxpZGF0ZVJ1bGU6IHtcbiAgICBVUkw6IFwiL0hUTUwvU2VsZWN0Vmlldy9TZWxlY3RWYWxpZGF0ZVJ1bGUuaHRtbFwiLFxuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdChpbnN0YW5jZU5hbWUpIHtcbiAgICAgIHZhciB1cmwgPSB0aGlzLlVSTCArIFwiP2luc3RhbmNlTmFtZT1cIiArIGluc3RhbmNlTmFtZTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB0aXRsZTogXCLpqozor4Hop4TliJlcIixcbiAgICAgICAgbW9kYWw6IHRydWVcbiAgICAgIH0sIDIpO1xuICAgIH0sXG4gICAgYmVnaW5TZWxlY3RJbkZyYW1lOiBmdW5jdGlvbiBiZWdpblNlbGVjdEluRnJhbWUob3BlbmVyLCBpbnN0YW5jZU5hbWUsIG9wdGlvbikge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkVmlldyh0aGlzLlVSTCwge1xuICAgICAgICBcImluc3RhbmNlTmFtZVwiOiBpbnN0YW5jZU5hbWVcbiAgICAgIH0pO1xuICAgICAgdmFyIG9wdGlvbiA9ICQuZXh0ZW5kKHRydWUsIHt9LCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCLpqozor4Hop4TliJlcIlxuICAgICAgfSwgb3B0aW9uKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXIsIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwNSwgdXJsLCBvcHRpb24sIDEpO1xuICAgICAgJCh3aW5kb3cucGFyZW50LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAkKHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG52YXIgU3RyaW5nVXRpbGl0eSA9IHtcbiAgR3VpZFNwbGl0OiBmdW5jdGlvbiBHdWlkU3BsaXQoc3BsaXQpIHtcbiAgICB2YXIgZ3VpZCA9IFwiXCI7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzMjsgaSsrKSB7XG4gICAgICBndWlkICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2LjApLnRvU3RyaW5nKDE2KTtcbiAgICAgIGlmIChpID09IDggfHwgaSA9PSAxMiB8fCBpID09IDE2IHx8IGkgPT0gMjApIGd1aWQgKz0gc3BsaXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGd1aWQ7XG4gIH0sXG4gIEd1aWQ6IGZ1bmN0aW9uIEd1aWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuR3VpZFNwbGl0KFwiLVwiKTtcbiAgfSxcbiAgVGltZXN0YW1wOiBmdW5jdGlvbiBUaW1lc3RhbXAoKSB7XG4gICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHJldHVybiB0aW1lc3RhbXAudG9TdHJpbmcoKS5zdWJzdHIoNCwgMTApO1xuICB9LFxuICBUcmltOiBmdW5jdGlvbiBUcmltKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKF5b44CAXFxzXSopfChb44CAXFxzXSokKS9nLCBcIlwiKTtcbiAgfSxcbiAgUmVtb3ZlTGFzdENoYXI6IGZ1bmN0aW9uIFJlbW92ZUxhc3RDaGFyKHN0cikge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKDAsIHN0ci5sZW5ndGggLSAxKTtcbiAgfSxcbiAgSXNOdWxsT3JFbXB0eTogZnVuY3Rpb24gSXNOdWxsT3JFbXB0eShvYmopIHtcbiAgICByZXR1cm4gb2JqID09IHVuZGVmaW5lZCB8fCBvYmogPT0gXCJcIiB8fCBvYmogPT0gbnVsbCB8fCBvYmogPT0gXCJ1bmRlZmluZWRcIiB8fCBvYmogPT0gXCJudWxsXCI7XG4gIH0sXG4gIEdldEZ1bnRpb25OYW1lOiBmdW5jdGlvbiBHZXRGdW50aW9uTmFtZShmdW5jKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09IFwiZnVuY3Rpb25cIiB8fCBfdHlwZW9mKGZ1bmMpID09IFwib2JqZWN0XCIpIHZhciBmTmFtZSA9IChcIlwiICsgZnVuYykubWF0Y2goL2Z1bmN0aW9uXFxzKihbXFx3XFwkXSopXFxzKlxcKC8pO1xuICAgIGlmIChmTmFtZSAhPT0gbnVsbCkgcmV0dXJuIGZOYW1lWzFdO1xuICB9LFxuICBUb0xvd2VyQ2FzZTogZnVuY3Rpb24gVG9Mb3dlckNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xuICB9LFxuICB0b1VwcGVyQ2FzZTogZnVuY3Rpb24gdG9VcHBlckNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpO1xuICB9LFxuICBFbmRXaXRoOiBmdW5jdGlvbiBFbmRXaXRoKHN0ciwgZW5kU3RyKSB7XG4gICAgdmFyIGQgPSBzdHIubGVuZ3RoIC0gZW5kU3RyLmxlbmd0aDtcbiAgICByZXR1cm4gZCA+PSAwICYmIHN0ci5sYXN0SW5kZXhPZihlbmRTdHIpID09IGQ7XG4gIH0sXG4gIElzU2FtZU9yZ2luOiBmdW5jdGlvbiBJc1NhbWVPcmdpbih1cmwxLCB1cmwyKSB7XG4gICAgdmFyIG9yaWdpbjEgPSAvXFwvXFwvW1xcdy0uXSsoOlxcZCspPy9pLmV4ZWModXJsMSlbMF07XG4gICAgdmFyIG9yaWdpbjIgPSAvXFwvXFwvW1xcdy0uXSsoOlxcZCspPy9pLmV4ZWModXJsMilbMF07XG5cbiAgICBpZiAob3JpZ2luMSA9PSBvcmlnaW4yKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBYTUxVdGlsaXR5ID0ge307Il19
