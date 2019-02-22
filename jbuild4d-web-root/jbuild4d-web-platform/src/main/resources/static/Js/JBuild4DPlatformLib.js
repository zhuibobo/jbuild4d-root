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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFqYXhVdGlsaXR5LmpzIiwiQmFzZVV0aWxpdHkuanMiLCJCcm93c2VySW5mb1V0aWxpdHkuanMiLCJDYWNoZURhdGFVdGlsaXR5LmpzIiwiQ29va2llVXRpbGl0eS5qcyIsIkRhdGVVdGlsaXR5LmpzIiwiRGV0YWlsUGFnZVV0aWxpdHkuanMiLCJEaWFsb2dVdGlsaXR5LmpzIiwiRGljdGlvbmFyeVV0aWxpdHkuanMiLCJKQnVpbGQ0REJhc2VMaWIuanMiLCJKc29uVXRpbGl0eS5qcyIsIkxpc3RQYWdlVXRpbGl0eS5qcyIsIlBhZ2VTdHlsZVV0aWxpdHkuanMiLCJTZWFyY2hVdGlsaXR5LmpzIiwiU2VsZWN0Vmlld0xpYi5qcyIsIlN0cmluZ1V0aWxpdHkuanMiLCJYTUxVdGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOWZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBIiwiZmlsZSI6IkpCdWlsZDREUGxhdGZvcm1MaWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIEFqYXhVdGlsaXR5ID0ge1xuICBQb3N0UmVxdWVzdEJvZHk6IGZ1bmN0aW9uIFBvc3RSZXF1ZXN0Qm9keShfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUpIHtcbiAgICB0aGlzLlBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIik7XG4gIH0sXG4gIFBvc3RTeW5jOiBmdW5jdGlvbiBQb3N0U3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGNvbnRlbnRUeXBlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuUG9zdChfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGNvbnRlbnRUeXBlLCBmYWxzZSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgUG9zdDogZnVuY3Rpb24gUG9zdChfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGNvbnRlbnRUeXBlLCBpc0FzeW5jKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKF91cmwpO1xuXG4gICAgaWYgKGRhdGFUeXBlID09IHVuZGVmaW5lZCB8fCBkYXRhVHlwZSA9PSBudWxsKSB7XG4gICAgICBkYXRhVHlwZSA9IFwidGV4dFwiO1xuICAgIH1cblxuICAgIGlmIChpc0FzeW5jID09IHVuZGVmaW5lZCB8fCBpc0FzeW5jID09IG51bGwpIHtcbiAgICAgIGlzQXN5bmMgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjb250ZW50VHlwZSA9PSB1bmRlZmluZWQgfHwgY29udGVudFR5cGUgPT0gbnVsbCkge1xuICAgICAgY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiO1xuICAgIH1cblxuICAgIHZhciBpbm5lclJlc3VsdCA9IG51bGw7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBhc3luYzogaXNBc3luYyxcbiAgICAgIGNvbnRlbnRUeXBlOiBjb250ZW50VHlwZSxcbiAgICAgIGRhdGFUeXBlOiBkYXRhVHlwZSxcbiAgICAgIGRhdGE6IHNlbmREYXRhLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXN1bHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgJiYgcmVzdWx0LnN1Y2Nlc3MgIT0gbnVsbCAmJiAhcmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQubWVzc2FnZSA9PSBcIueZu+W9lVNlc3Npb27ov4fmnJ9cIikge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCJTZXNzaW9u6LaF5pe277yM6K+36YeN5paw55m76ZmG57O757ufXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBCYXNlVXRpbGl0eS5SZWRpcmVjdFRvTG9naW4oKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJBamF4VXRpbGl0eS5Qb3N0IEV4Y2VwdGlvbiBcIiArIHVybCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jKHJlc3VsdCk7XG4gICAgICAgIGlubmVyUmVzdWx0ID0gcmVzdWx0O1xuICAgICAgfSxcbiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShtc2cpIHt9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKG1zZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChtc2cucmVzcG9uc2VUZXh0LmluZGV4T2YoXCLor7fph43mlrDnmbvpmYbns7vnu59cIikgPj0gMCkge1xuICAgICAgICAgICAgQmFzZVV0aWxpdHkuUmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgXCJBamF4VXRpbGl0eS5Qb3N0LkVycm9yXCIsIHt9LCBcIkFqYXjor7fmsYLlj5HnlJ/plJnor6/vvIFcIiArIFwic3RhdHVzOlwiICsgbXNnLnN0YXR1cyArIFwiLHJlc3BvbnNlVGV4dDpcIiArIG1zZy5yZXNwb25zZVRleHQsIG51bGwpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpbm5lclJlc3VsdDtcbiAgfSxcbiAgR2V0U3luYzogZnVuY3Rpb24gR2V0U3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUpIHtcbiAgICB0aGlzLlBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBmYWxzZSk7XG4gIH0sXG4gIEdldDogZnVuY3Rpb24gR2V0KF91cmwsIHNlbmREYXRhLCBmdW5jLCBkYXRhVHlwZSwgaXNBc3luYykge1xuICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFVybChfdXJsKTtcblxuICAgIGlmIChkYXRhVHlwZSA9PSB1bmRlZmluZWQgfHwgZGF0YVR5cGUgPT0gbnVsbCkge1xuICAgICAgZGF0YVR5cGUgPSBcInRleHRcIjtcbiAgICB9XG5cbiAgICBpZiAoaXNBc3luYyA9PSB1bmRlZmluZWQgfHwgaXNBc3luYyA9PSBudWxsKSB7XG4gICAgICBpc0FzeW5jID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIHVybDogdXJsLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgYXN5bmM6IGlzQXN5bmMsXG4gICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICBkYXRhVHlwZTogZGF0YVR5cGUsXG4gICAgICBkYXRhOiBzZW5kRGF0YSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0KSB7XG4gICAgICAgIGZ1bmMocmVzdWx0KTtcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUobXNnKSB7fSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBCYXNlVXRpbGl0eSA9IHtcbiAgR2V0Um9vdFBhdGg6IGZ1bmN0aW9uIEdldFJvb3RQYXRoKCkge1xuICAgIHZhciBmdWxsSHJlZiA9IHdpbmRvdy5kb2N1bWVudC5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBwYXRoTmFtZSA9IHdpbmRvdy5kb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICB2YXIgbGFjID0gZnVsbEhyZWYuaW5kZXhPZihwYXRoTmFtZSk7XG4gICAgdmFyIGxvY2FsaG9zdFBhdGggPSBmdWxsSHJlZi5zdWJzdHJpbmcoMCwgbGFjKTtcbiAgICB2YXIgcHJvamVjdE5hbWUgPSBwYXRoTmFtZS5zdWJzdHJpbmcoMCwgcGF0aE5hbWUuc3Vic3RyKDEpLmluZGV4T2YoJy8nKSArIDEpO1xuICAgIHJldHVybiBsb2NhbGhvc3RQYXRoICsgcHJvamVjdE5hbWU7XG4gIH0sXG4gIFJlcGxhY2VVcmxWYXJpYWJsZTogZnVuY3Rpb24gUmVwbGFjZVVybFZhcmlhYmxlKHNvdXJjZVVybCkge1xuICAgIGFsZXJ0KFwiUmVwbGFjZVVybFZhcmlhYmxl6L+B56e75YiwQnVpbGRBY3Rpb25cIik7XG4gIH0sXG4gIEdldFRvcFdpbmRvdzogZnVuY3Rpb24gR2V0VG9wV2luZG93KCkge1xuICAgIGFsZXJ0KFwiQmFzZVV0aWxpdHkuR2V0VG9wV2luZG93IOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgVHJ5U2V0Q29udHJvbEZvY3VzOiBmdW5jdGlvbiBUcnlTZXRDb250cm9sRm9jdXMoKSB7XG4gICAgYWxlcnQoXCJCYXNlVXRpbGl0eS5UcnlTZXRDb250cm9sRm9jdXMg5bey5YGc55SoXCIpO1xuICB9LFxuICBCdWlsZFVybDogZnVuY3Rpb24gQnVpbGRVcmwodXJsKSB7XG4gICAgYWxlcnQoXCJCYXNlVXRpbGl0eS5CdWlsZFVybCDlt7LlgZznlKhcIik7XG4gIH0sXG4gIEJ1aWxkVmlldzogZnVuY3Rpb24gQnVpbGRWaWV3KGFjdGlvbiwgcGFyYSkge1xuICAgIHZhciB1cmxQYXJhID0gXCJcIjtcblxuICAgIGlmIChwYXJhKSB7XG4gICAgICB1cmxQYXJhID0gJC5wYXJhbShwYXJhKTtcbiAgICB9XG5cbiAgICB2YXIgX3VybCA9IHRoaXMuR2V0Um9vdFBhdGgoKSArIGFjdGlvbjtcblxuICAgIGlmICh1cmxQYXJhICE9IFwiXCIpIHtcbiAgICAgIF91cmwgKz0gXCI/XCIgKyB1cmxQYXJhO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLkFwcGVuZFRpbWVTdGFtcFVybChfdXJsKTtcbiAgfSxcbiAgQnVpbGRGcmFtZUlubmVyVmlldzogZnVuY3Rpb24gQnVpbGRGcmFtZUlubmVyVmlldyhhY3Rpb24sIHBhcmEpIHtcbiAgICB2YXIgdXJsUGFyYSA9IFwiXCI7XG5cbiAgICBpZiAocGFyYSkge1xuICAgICAgdXJsUGFyYSA9ICQucGFyYW0ocGFyYSk7XG4gICAgfVxuXG4gICAgdmFyIF91cmwgPSB0aGlzLkdldFJvb3RQYXRoKCkgKyBcIi9IVE1ML1wiICsgYWN0aW9uO1xuXG4gICAgaWYgKHVybFBhcmEgIT0gXCJcIikge1xuICAgICAgX3VybCArPSBcIj9cIiArIHVybFBhcmE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuQXBwZW5kVGltZVN0YW1wVXJsKF91cmwpO1xuICB9LFxuICBCdWlsZEFjdGlvbjogZnVuY3Rpb24gQnVpbGRBY3Rpb24oYWN0aW9uLCBwYXJhKSB7XG4gICAgdmFyIHVybFBhcmEgPSBcIlwiO1xuXG4gICAgaWYgKHBhcmEpIHtcbiAgICAgIHVybFBhcmEgPSAkLnBhcmFtKHBhcmEpO1xuICAgIH1cblxuICAgIHZhciBfdXJsID0gdGhpcy5HZXRSb290UGF0aCgpICsgYWN0aW9uICsgXCIuZG9cIjtcblxuICAgIGlmICh1cmxQYXJhICE9IFwiXCIpIHtcbiAgICAgIF91cmwgKz0gXCI/XCIgKyB1cmxQYXJhO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLkFwcGVuZFRpbWVTdGFtcFVybChfdXJsKTtcbiAgfSxcbiAgUmVkaXJlY3RUb0xvZ2luOiBmdW5jdGlvbiBSZWRpcmVjdFRvTG9naW4oKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9QbGF0Rm9ybS9Mb2dpblZpZXcuZG9cIjtcbiAgICB3aW5kb3cucGFyZW50LnBhcmVudC5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICB9LFxuICBBcHBlbmRUaW1lU3RhbXBVcmw6IGZ1bmN0aW9uIEFwcGVuZFRpbWVTdGFtcFVybCh1cmwpIHtcbiAgICBpZiAodXJsLmluZGV4T2YoXCJ0aW1lc3RhbXBcIikgPiBcIjBcIikge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICB2YXIgZ2V0VGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIHVybCA9IHVybCArIFwiJnRpbWVzdGFtcD1cIiArIGdldFRpbWVzdGFtcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gdXJsICsgXCI/dGltZXN0YW1wPVwiICsgZ2V0VGltZXN0YW1wO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG4gIH0sXG4gIEdldFVybFBhcmFWYWx1ZTogZnVuY3Rpb24gR2V0VXJsUGFyYVZhbHVlKHBhcmFOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuR2V0VXJsUGFyYVZhbHVlQnlTdHJpbmcocGFyYU5hbWUsIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICB9LFxuICBHZXRVcmxQYXJhVmFsdWVCeVN0cmluZzogZnVuY3Rpb24gR2V0VXJsUGFyYVZhbHVlQnlTdHJpbmcocGFyYU5hbWUsIHVybFN0cmluZykge1xuICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKFwiKF58JilcIiArIHBhcmFOYW1lICsgXCI9KFteJl0qKSgmfCQpXCIpO1xuICAgIHZhciByID0gdXJsU3RyaW5nLnN1YnN0cigxKS5tYXRjaChyZWcpO1xuICAgIGlmIChyICE9IG51bGwpIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoclsyXSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH0sXG4gIENvcHlWYWx1ZUNsaXBib2FyZDogZnVuY3Rpb24gQ29weVZhbHVlQ2xpcGJvYXJkKHZhbHVlKSB7XG4gICAgdmFyIHRyYW5zZmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0pfQ29weVRyYW5zZmVyJyk7XG5cbiAgICBpZiAoIXRyYW5zZmVyKSB7XG4gICAgICB0cmFuc2ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgICB0cmFuc2Zlci5pZCA9ICdKX0NvcHlUcmFuc2Zlcic7XG4gICAgICB0cmFuc2Zlci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS5sZWZ0ID0gJy05OTk5cHgnO1xuICAgICAgdHJhbnNmZXIuc3R5bGUudG9wID0gJy05OTk5cHgnO1xuICAgICAgdHJhbnNmZXIuc3R5bGUuekluZGV4ID0gOTk5OTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodHJhbnNmZXIpO1xuICAgIH1cblxuICAgIHRyYW5zZmVyLnZhbHVlID0gdmFsdWU7XG4gICAgdHJhbnNmZXIuZm9jdXMoKTtcbiAgICB0cmFuc2Zlci5zZWxlY3QoKTtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQnJvd3NlckluZm9VdGlsaXR5ID0ge1xuICBCcm93c2VyQXBwTmFtZTogZnVuY3Rpb24gQnJvd3NlckFwcE5hbWUoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkZpcmVmb3hcIikgPiAwKSB7XG4gICAgICByZXR1cm4gXCJGaXJlZm94XCI7XG4gICAgfSBlbHNlIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpID4gMCkge1xuICAgICAgcmV0dXJuIFwiSUVcIjtcbiAgICB9IGVsc2UgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkNocm9tZVwiKSA+IDApIHtcbiAgICAgIHJldHVybiBcIkNocm9tZVwiO1xuICAgIH1cbiAgfSxcbiAgSXNJRTogZnVuY3Rpb24gSXNJRSgpIHtcbiAgICBpZiAoISF3aW5kb3cuQWN0aXZlWE9iamVjdCB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3cpIHJldHVybiB0cnVlO2Vsc2UgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFNjogZnVuY3Rpb24gSXNJRTYoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgNi4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTc6IGZ1bmN0aW9uIElzSUU3KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDcuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU4OiBmdW5jdGlvbiBJc0lFOCgpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA4LjBcIikgPiAwO1xuICB9LFxuICBJc0lFOFg2NDogZnVuY3Rpb24gSXNJRThYNjQoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOC4wXCIpID4gMCkge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIng2NFwiKSA+IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFOTogZnVuY3Rpb24gSXNJRTkoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOS4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTlYNjQ6IGZ1bmN0aW9uIElzSUU5WDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDkuMFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJ4NjRcIikgPiAwO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNJRTEwOiBmdW5jdGlvbiBJc0lFMTAoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgMTAuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUUxMFg2NDogZnVuY3Rpb24gSXNJRTEwWDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDEwLjBcIikgPiAwKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwieDY0XCIpID4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElFRG9jdW1lbnRNb2RlOiBmdW5jdGlvbiBJRURvY3VtZW50TW9kZSgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuICB9LFxuICBJc0lFOERvY3VtZW50TW9kZTogZnVuY3Rpb24gSXNJRThEb2N1bWVudE1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuSUVEb2N1bWVudE1vZGUoKSA9PSA4O1xuICB9LFxuICBJc0ZpcmVmb3g6IGZ1bmN0aW9uIElzRmlyZWZveCgpIHtcbiAgICByZXR1cm4gdGhpcy5Ccm93c2VyQXBwTmFtZSgpID09IFwiRmlyZWZveFwiO1xuICB9LFxuICBJc0Nocm9tZTogZnVuY3Rpb24gSXNDaHJvbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuQnJvd3NlckFwcE5hbWUoKSA9PSBcIkNocm9tZVwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2FjaGVEYXRhVXRpbGl0eSA9IHtcbiAgSW5pbkNsaWVudENhY2hlOiBmdW5jdGlvbiBJbmluQ2xpZW50Q2FjaGUoKSB7XG4gICAgdGhpcy5HZXRDdXJyZW50VXNlckluZm8oKTtcbiAgfSxcbiAgX0N1cnJlbnRVc2VySW5mbzogbnVsbCxcbiAgR2V0Q3VycmVudFVzZXJJbmZvOiBmdW5jdGlvbiBHZXRDdXJyZW50VXNlckluZm8oKSB7XG4gICAgaWYgKHRoaXMuX0N1cnJlbnRVc2VySW5mbyA9PSBudWxsKSB7XG4gICAgICBpZiAod2luZG93LnBhcmVudC5DYWNoZURhdGFVdGlsaXR5Ll9DdXJyZW50VXNlckluZm8gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnBhcmVudC5DYWNoZURhdGFVdGlsaXR5Ll9DdXJyZW50VXNlckluZm87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0U3luYyhcIi9QbGF0Rm9ybVJlc3QvTXlJbmZvL0dldFVzZXJJbmZvXCIsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBDYWNoZURhdGFVdGlsaXR5Ll9DdXJyZW50VXNlckluZm8gPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB9IGVsc2Uge31cbiAgICAgICAgfSwgXCJqc29uXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5fQ3VycmVudFVzZXJJbmZvO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fQ3VycmVudFVzZXJJbmZvO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENvb2tpZVV0aWxpdHkgPSB7XG4gIFNldENvb2tpZTFEYXk6IGZ1bmN0aW9uIFNldENvb2tpZTFEYXkobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpICsgMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBTZXRDb29raWUxTW9udGg6IGZ1bmN0aW9uIFNldENvb2tpZTFNb250aChuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgKyAzMCAqIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGVzY2FwZSh2YWx1ZSkgKyBcIjtleHBpcmVzPVwiICsgZXhwLnRvR01UU3RyaW5nKCkgKyBcIjtwYXRoPS9cIjtcbiAgfSxcbiAgU2V0Q29va2llMVllYXI6IGZ1bmN0aW9uIFNldENvb2tpZTFZZWFyKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGV4cCA9IG5ldyBEYXRlKCk7XG4gICAgZXhwLnNldFRpbWUoZXhwLmdldFRpbWUoKSArIDMwICogMjQgKiA2MCAqIDYwICogMzY1ICogMTAwMCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBHZXRDb29raWU6IGZ1bmN0aW9uIEdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGFyciA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKFwiKF58IClcIiArIG5hbWUgKyBcIj0oW147XSopKDt8JClcIikpO1xuICAgIGlmIChhcnIgIT0gbnVsbCkgcmV0dXJuIHVuZXNjYXBlKGFyclsyXSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIERlbENvb2tpZTogZnVuY3Rpb24gRGVsQ29va2llKG5hbWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpIC0gMSk7XG4gICAgdmFyIGN2YWwgPSB0aGlzLmdldENvb2tpZShuYW1lKTtcbiAgICBpZiAoY3ZhbCAhPSBudWxsKSBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBjdmFsICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEYXRlVXRpbGl0eSA9IHtcbiAgR2V0Q3VycmVudERhdGFTdHJpbmc6IGZ1bmN0aW9uIEdldEN1cnJlbnREYXRhU3RyaW5nKHNwbGl0KSB7XG4gICAgYWxlcnQoXCJEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YVN0cmluZyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIERhdGVGb3JtYXQ6IGZ1bmN0aW9uIERhdGVGb3JtYXQobXlEYXRlLCBzcGxpdCkge1xuICAgIGFsZXJ0KFwiRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGFTdHJpbmcg5bey5YGc55SoXCIpO1xuICB9LFxuICBGb3JtYXQ6IGZ1bmN0aW9uIEZvcm1hdChteURhdGUsIGZvcm1hdFN0cmluZykge1xuICAgIHZhciBvID0ge1xuICAgICAgXCJNK1wiOiBteURhdGUuZ2V0TW9udGgoKSArIDEsXG4gICAgICBcImQrXCI6IG15RGF0ZS5nZXREYXRlKCksXG4gICAgICBcImgrXCI6IG15RGF0ZS5nZXRIb3VycygpLFxuICAgICAgXCJtK1wiOiBteURhdGUuZ2V0TWludXRlcygpLFxuICAgICAgXCJzK1wiOiBteURhdGUuZ2V0U2Vjb25kcygpLFxuICAgICAgXCJxK1wiOiBNYXRoLmZsb29yKChteURhdGUuZ2V0TW9udGgoKSArIDMpIC8gMyksXG4gICAgICBcIlNcIjogbXlEYXRlLmdldE1pbGxpc2Vjb25kcygpXG4gICAgfTtcbiAgICBpZiAoLyh5KykvLnRlc3QoZm9ybWF0U3RyaW5nKSkgZm9ybWF0U3RyaW5nID0gZm9ybWF0U3RyaW5nLnJlcGxhY2UoUmVnRXhwLiQxLCAobXlEYXRlLmdldEZ1bGxZZWFyKCkgKyBcIlwiKS5zdWJzdHIoNCAtIFJlZ0V4cC4kMS5sZW5ndGgpKTtcblxuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm9ybWF0U3RyaW5nKSkgZm9ybWF0U3RyaW5nID0gZm9ybWF0U3RyaW5nLnJlcGxhY2UoUmVnRXhwLiQxLCBSZWdFeHAuJDEubGVuZ3RoID09IDEgPyBvW2tdIDogKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aCkpO1xuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXRTdHJpbmc7XG4gIH0sXG4gIEZvcm1hdEN1cnJlbnREYXRhOiBmdW5jdGlvbiBGb3JtYXRDdXJyZW50RGF0YShmb3JtYXRTdHJpbmcpIHtcbiAgICB2YXIgbXlEYXRlID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gdGhpcy5Gb3JtYXQobXlEYXRlLCBmb3JtYXRTdHJpbmcpO1xuICB9LFxuICBHZXRDdXJyZW50RGF0YTogZnVuY3Rpb24gR2V0Q3VycmVudERhdGEoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEZXRhaWxQYWdlVXRpbGl0eSA9IHtcbiAgSVZpZXdQYWdlVG9WaWV3U3RhdHVzOiBmdW5jdGlvbiBJVmlld1BhZ2VUb1ZpZXdTdGF0dXMoKSB7XG4gICAgcmV0dXJuO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoXCJpbnB1dFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5oaWRlKCk7XG4gICAgICAgIHZhciB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAkKHRoaXMpLmFmdGVyKCQoXCI8bGFiZWwgLz5cIikudGV4dCh2YWwpKTtcbiAgICAgIH0pO1xuICAgICAgJChcIi5pdnUtZGF0ZS1waWNrZXItZWRpdG9yXCIpLmZpbmQoXCIuaXZ1LWljb25cIikuaGlkZSgpO1xuICAgICAgJChcIi5pdnUtcmFkaW9cIikuaGlkZSgpO1xuICAgICAgJChcIi5pdnUtcmFkaW8tZ3JvdXAtaXRlbVwiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpby13cmFwcGVyLWNoZWNrZWRcIikuc2hvdygpO1xuICAgICAgJChcIi5pdnUtcmFkaW8td3JhcHBlci1jaGVja2VkXCIpLmZpbmQoXCJzcGFuXCIpLmhpZGUoKTtcbiAgICAgICQoXCJ0ZXh0YXJlYVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5oaWRlKCk7XG4gICAgICAgIHZhciB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAkKHRoaXMpLmFmdGVyKCQoXCI8bGFiZWwgLz5cIikudGV4dCh2YWwpKTtcbiAgICAgIH0pO1xuICAgIH0sIDEwMCk7XG4gIH0sXG4gIE92ZXJyaWRlT2JqZWN0VmFsdWU6IGZ1bmN0aW9uIE92ZXJyaWRlT2JqZWN0VmFsdWUoc291cmNlT2JqZWN0LCBkYXRhT2JqZWN0KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZU9iamVjdCkge1xuICAgICAgaWYgKGRhdGFPYmplY3Rba2V5XSAhPSB1bmRlZmluZWQgJiYgZGF0YU9iamVjdFtrZXldICE9IG51bGwgJiYgZGF0YU9iamVjdFtrZXldICE9IFwiXCIpIHtcbiAgICAgICAgc291cmNlT2JqZWN0W2tleV0gPSBkYXRhT2JqZWN0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBPdmVycmlkZU9iamVjdFZhbHVlRnVsbDogZnVuY3Rpb24gT3ZlcnJpZGVPYmplY3RWYWx1ZUZ1bGwoc291cmNlT2JqZWN0LCBkYXRhT2JqZWN0KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZU9iamVjdCkge1xuICAgICAgc291cmNlT2JqZWN0W2tleV0gPSBkYXRhT2JqZWN0W2tleV07XG4gICAgfVxuICB9LFxuICBCaW5kRm9ybURhdGE6IGZ1bmN0aW9uIEJpbmRGb3JtRGF0YShpbnRlcmZhY2VVcmwsIHZ1ZUZvcm1EYXRhLCByZWNvcmRJZCwgb3AsIGJlZkZ1bmMsIGFmRnVuYykge1xuICAgIEFqYXhVdGlsaXR5LlBvc3QoaW50ZXJmYWNlVXJsLCB7XG4gICAgICByZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICBvcDogb3BcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiZWZGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGJlZkZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIERldGFpbFBhZ2VVdGlsaXR5Lk92ZXJyaWRlT2JqZWN0VmFsdWUodnVlRm9ybURhdGEsIHJlc3VsdC5kYXRhKTtcblxuICAgICAgICBpZiAodHlwZW9mIGFmRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBhZkZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcCA9PSBcInZpZXdcIikge1xuICAgICAgICAgIERldGFpbFBhZ2VVdGlsaXR5LklWaWV3UGFnZVRvVmlld1N0YXR1cygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERpYWxvZ1V0aWxpdHkgPSB7XG4gIERpYWxvZ0FsZXJ0SWQ6IFwiRGVmYXVsdERpYWxvZ0FsZXJ0VXRpbGl0eTAxXCIsXG4gIERpYWxvZ1Byb21wdElkOiBcIkRlZmF1bHREaWFsb2dQcm9tcHRVdGlsaXR5MDFcIixcbiAgRGlhbG9nSWQ6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwMVwiLFxuICBEaWFsb2dJZDAyOiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDJcIixcbiAgRGlhbG9nSWQwMzogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTAzXCIsXG4gIERpYWxvZ0lkMDQ6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwNFwiLFxuICBEaWFsb2dJZDA1OiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDVcIixcbiAgX0dldEVsZW06IGZ1bmN0aW9uIF9HZXRFbGVtKGRpYWxvZ0lkKSB7XG4gICAgcmV0dXJuICQoXCIjXCIgKyBkaWFsb2dJZCk7XG4gIH0sXG4gIF9DcmVhdGVEaWFsb2dFbGVtOiBmdW5jdGlvbiBfQ3JlYXRlRGlhbG9nRWxlbShkb2NvYmosIGRpYWxvZ0lkKSB7XG4gICAgaWYgKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICB2YXIgZGlhbG9nRWxlID0gJChcIjxkaXYgaWQ9XCIgKyBkaWFsb2dJZCArIFwiIHRpdGxlPSfns7vnu5/mj5DnpLonIHN0eWxlPSdkaXNwbGF5Om5vbmUnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICAgJChkb2NvYmouYm9keSkuYXBwZW5kKGRpYWxvZ0VsZSk7XG4gICAgICByZXR1cm4gZGlhbG9nRWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fR2V0RWxlbShkaWFsb2dJZCk7XG4gICAgfVxuICB9LFxuICBfQ3JlYXRlQWxlcnRMb2FkaW5nTXNnRWxlbWVudDogZnVuY3Rpb24gX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQoZG9jb2JqLCBkaWFsb2dJZCkge1xuICAgIGlmICh0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgdmFyIGRpYWxvZ0VsZSA9ICQoXCI8ZGl2IGlkPVwiICsgZGlhbG9nSWQgKyBcIiB0aXRsZT0n57O757uf5o+Q56S6JyBzdHlsZT0nZGlzcGxheTpub25lJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nYWxlcnRsb2FkaW5nLWltZyc+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2FsZXJ0bG9hZGluZy10eHQnPjwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICQoZG9jb2JqLmJvZHkpLmFwcGVuZChkaWFsb2dFbGUpO1xuICAgICAgcmV0dXJuIGRpYWxvZ0VsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpO1xuICAgIH1cbiAgfSxcbiAgX0NyZWF0ZUlmcm1hZURpYWxvZ0VsZW1lbnQ6IGZ1bmN0aW9uIF9DcmVhdGVJZnJtYWVEaWFsb2dFbGVtZW50KGRvY29iaiwgZGlhbG9naWQsIHVybCkge1xuICAgIHZhciBkaWFsb2dFbGUgPSAkKFwiPGRpdiBpZD1cIiArIGRpYWxvZ2lkICsgXCIgdGl0bGU9J0Jhc2ljIGRpYWxvZyc+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlmcmFtZSBuYW1lPSdkaWFsb2dJZnJhbWUnIHdpZHRoPScxMDAlJyBoZWlnaHQ9Jzk4JScgZnJhbWVib3JkZXI9JzAnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaWZyYW1lPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICQoZG9jb2JqLmJvZHkpLmFwcGVuZChkaWFsb2dFbGUpO1xuICAgIHJldHVybiBkaWFsb2dFbGU7XG4gIH0sXG4gIF9UZXN0RGlhbG9nRWxlbUlzRXhpc3Q6IGZ1bmN0aW9uIF9UZXN0RGlhbG9nRWxlbUlzRXhpc3QoZGlhbG9nSWQpIHtcbiAgICBpZiAodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBfVGVzdFJ1bkVuYWJsZTogZnVuY3Rpb24gX1Rlc3RSdW5FbmFibGUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIEFsZXJ0RXJyb3I6IGZ1bmN0aW9uIEFsZXJ0RXJyb3Iob3BlcmVyV2luZG93LCBkaWFsb2dJZCwgY29uZmlnLCBodG1sbXNnLCBzRnVuYykge1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICB3aWR0aDogNjAwXG4gICAgfTtcbiAgICBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgdGhpcy5BbGVydChvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBkZWZhdWx0Q29uZmlnLCBodG1sbXNnLCBzRnVuYyk7XG4gIH0sXG4gIEFsZXJ0VGV4dDogZnVuY3Rpb24gQWxlcnRUZXh0KHRleHQpIHtcbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgdGV4dCwgbnVsbCk7XG4gIH0sXG4gIEFsZXJ0OiBmdW5jdGlvbiBBbGVydChvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxtc2csIHNGdW5jKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVyZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgZGlhbG9nSWQpO1xuXG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLlhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oKSB7fSxcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgaWYgKHNGdW5jKSB7XG4gICAgICAgICAgc0Z1bmMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxtc2cpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgQWxlcnRKc29uQ29kZTogZnVuY3Rpb24gQWxlcnRKc29uQ29kZShqc29uKSB7XG4gICAganNvbiA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZ0Zvcm1hdChqc29uKTtcbiAgICBqc29uID0ganNvbi5yZXBsYWNlKC8mL2csICcmJykucmVwbGFjZSgvPC9nLCAnPCcpLnJlcGxhY2UoLz4vZywgJz4nKTtcbiAgICBqc29uID0ganNvbi5yZXBsYWNlKC8oXCIoXFxcXHVbYS16QS1aMC05XXs0fXxcXFxcW151XXxbXlxcXFxcIl0pKlwiKFxccyo6KT98XFxiKHRydWV8ZmFsc2V8bnVsbClcXGJ8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8pL2csIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgdmFyIGNscyA9ICdqc29uLW51bWJlcic7XG5cbiAgICAgIGlmICgvXlwiLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBpZiAoLzokLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICAgIGNscyA9ICdqc29uLWtleSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2xzID0gJ2pzb24tc3RyaW5nJztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgvdHJ1ZXxmYWxzZS8udGVzdChtYXRjaCkpIHtcbiAgICAgICAgY2xzID0gJ2pzb24tYm9vbGVhbic7XG4gICAgICB9IGVsc2UgaWYgKC9udWxsLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBjbHMgPSAnanNvbi1udWxsJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbHMgKyAnXCI+JyArIG1hdGNoICsgJzwvc3Bhbj4nO1xuICAgIH0pO1xuXG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbSh3aW5kb3cuZG9jdW1lbnQuYm9keSwgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICB3aWR0aDogOTAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIFwi5YWz6ZetXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH0sXG4gICAgICAgIFwi5aSN5Yi25bm25YWz6ZetXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgICAgQmFzZVV0aWxpdHkuQ29weVZhbHVlQ2xpcGJvYXJkKCQoXCIuanNvbi1wcmVcIikudGV4dCgpKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oKSB7fSxcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHt9XG4gICAgfTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKFwiPGRpdiBpZD0ncHNjb250YWluZXInIHN0eWxlPSd3aWR0aDogMTAwJTtoZWlnaHQ6IDEwMCU7b3ZlcmZsb3c6IGF1dG87cG9zaXRpb246IHJlbGF0aXZlOyc+PHByZSBjbGFzcz0nanNvbi1wcmUnPlwiICsganNvbiArIFwiPC9wcmU+PC9kaXY+XCIpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgICB2YXIgcHMgPSBuZXcgUGVyZmVjdFNjcm9sbGJhcignI3BzY29udGFpbmVyJyk7XG4gIH0sXG4gIFNob3dIVE1MOiBmdW5jdGlvbiBTaG93SFRNTChvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxtc2csIGNsb3NlX2FmdGVyX2V2ZW50LCBwYXJhbXMpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKG9wZXJlcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIHRpdGxlOiBcIuezu+e7n+aPkOekulwiLFxuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKGV2ZW50LCB1aSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2xvc2VfYWZ0ZXJfZXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjbG9zZV9hZnRlcl9ldmVudChwYXJhbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sbXNnKTtcbiAgICByZXR1cm4gJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBBbGVydExvYWRpbmc6IGZ1bmN0aW9uIEFsZXJ0TG9hZGluZyhvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxtc2cpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVBbGVydExvYWRpbmdNc2dFbGVtZW50KG9wZXJlcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIG1vZGFsOiB0cnVlXG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQoaHRtbEVsZW0pLmZpbmQoXCIuYWxlcnRsb2FkaW5nLXR4dFwiKS5odG1sKGh0bWxtc2cpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgQ29uZmlybTogZnVuY3Rpb24gQ29uZmlybShvcGVyZXJXaW5kb3csIGh0bWxtc2csIG9rRm4pIHtcbiAgICB0aGlzLkNvbmZpcm1Db25maWcob3BlcmVyV2luZG93LCBodG1sbXNnLCBudWxsLCBva0ZuKTtcbiAgfSxcbiAgQ29uZmlybUNvbmZpZzogZnVuY3Rpb24gQ29uZmlybUNvbmZpZyhvcGVyZXJXaW5kb3csIGh0bWxtc2csIGNvbmZpZywgb2tGbikge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlcmVyV2luZG93LmRvY3VtZW50LmJvZHksIFwiQWxlcnRDb25maXJtTXNnXCIpO1xuXG4gICAgdmFyIHBhcmFzID0gbnVsbDtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIG9rZnVuYzogZnVuY3Rpb24gb2tmdW5jKHBhcmFzKSB7XG4gICAgICAgIGlmIChva0ZuICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBva0ZuKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3BlcmVyV2luZG93LmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjYW5jZWxmdW5jOiBmdW5jdGlvbiBjYW5jZWxmdW5jKHBhcmFzKSB7fSxcbiAgICAgIHZhbGlkYXRlZnVuYzogZnVuY3Rpb24gdmFsaWRhdGVmdW5jKHBhcmFzKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIGNsb3NlYWZ0ZXJmdW5jOiB0cnVlLFxuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIFwi56Gu6K6kXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgaWYgKGRlZmF1bHRDb25maWcudmFsaWRhdGVmdW5jKHBhcmFzKSkge1xuICAgICAgICAgICAgdmFyIHIgPSBkZWZhdWx0Q29uZmlnLm9rZnVuYyhwYXJhcyk7XG4gICAgICAgICAgICByID0gciA9PSBudWxsID8gdHJ1ZSA6IHI7XG5cbiAgICAgICAgICAgIGlmIChyICYmIGRlZmF1bHRDb25maWcuY2xvc2VhZnRlcmZ1bmMpIHtcbiAgICAgICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIuWPlua2iFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgIGRlZmF1bHRDb25maWcuY2FuY2VsZnVuYyhwYXJhcyk7XG5cbiAgICAgICAgICBpZiAoZGVmYXVsdENvbmZpZy5jbG9zZWFmdGVyZnVuYykge1xuICAgICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQoaHRtbEVsZW0pLmh0bWwoaHRtbG1zZyk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICAgIHBhcmFzID0ge1xuICAgICAgXCJFbGVtZW50T2JqXCI6IGh0bWxFbGVtXG4gICAgfTtcbiAgfSxcbiAgUHJvbXB0OiBmdW5jdGlvbiBQcm9tcHQob3BlcmVyV2luZG93LCBjb25maWcsIGRpYWxvZ0lkLCBsYWJlbE1zZywgb2tGdW5jKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVyZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgZGlhbG9nSWQpO1xuXG4gICAgdmFyIHBhcmFzID0gbnVsbDtcbiAgICB2YXIgdGV4dEFyZWEgPSAkKFwiPHRleHRhcmVhIC8+XCIpO1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIFwi56Gu6K6kXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBva0Z1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRUZXh0ID0gdGV4dEFyZWEudmFsKCk7XG4gICAgICAgICAgICBva0Z1bmMoaW5wdXRUZXh0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCLlj5bmtohcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKHRleHRBcmVhKS5jc3MoXCJoZWlnaHRcIiwgZGVmYXVsdENvbmZpZy5oZWlnaHQgLSAxMzApLmNzcyhcIndpZHRoXCIsIFwiMTAwJVwiKTtcbiAgICB2YXIgaHRtbENvbnRlbnQgPSAkKFwiPGRpdj48ZGl2IHN0eWxlPSd3aWR0aDogMTAwJSc+XCIgKyBsYWJlbE1zZyArIFwi77yaPC9kaXY+PC9kaXY+XCIpLmFwcGVuZCh0ZXh0QXJlYSk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sQ29udGVudCk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBEaWFsb2dFbGVtOiBmdW5jdGlvbiBEaWFsb2dFbGVtKGVsZW1JZCwgY29uZmlnKSB7XG4gICAgJChcIiNcIiArIGVsZW1JZCkuZGlhbG9nKGNvbmZpZyk7XG4gIH0sXG4gIE9wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIE9wZW5JZnJhbWVXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICB2YXIgZGVmYXVsdG9wdGlvbnMgPSB7XG4gICAgICBoZWlnaHQ6IDQxMCxcbiAgICAgIHdpZHRoOiA2MDAsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHZhciBhdXRvZGlhbG9naWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgJCh0aGlzKS5maW5kKFwiaWZyYW1lXCIpLnJlbW92ZSgpO1xuICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgJCh0aGlzKS5kaWFsb2coXCJkZXN0cm95XCIpO1xuICAgICAgICAkKFwiI1wiICsgYXV0b2RpYWxvZ2lkKS5yZW1vdmUoKTtcblxuICAgICAgICBpZiAoQnJvd3NlckluZm9VdGlsaXR5LklzSUU4RG9jdW1lbnRNb2RlKCkpIHtcbiAgICAgICAgICBDb2xsZWN0R2FyYmFnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCQoXCIjRm9yZm9jdXNcIikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJChcIiNGb3Jmb2N1c1wiKVswXS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHdodHlwZSA9PSAxKSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDY4MCxcbiAgICAgICAgd2lkdGg6IDk4MFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gMikge1xuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgIHdpZHRoOiA4MDBcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDQpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICB3aWR0aDogNDgwXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA1KSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDE4MCxcbiAgICAgICAgd2lkdGg6IDMwMFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMud2lkdGggPT0gMCkge1xuICAgICAgb3B0aW9ucy53aWR0aCA9IFBhZ2VTdHlsZVV0aWwuR2V0UGFnZVdpZHRoKCkgLSAyMDtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5oZWlnaHQgPT0gMCkge1xuICAgICAgb3B0aW9ucy5oZWlnaHQgPSBQYWdlU3R5bGVVdGlsLkdldFBhZ2VIZWlnaHQoKSAtIDEwO1xuICAgIH1cblxuICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCBvcHRpb25zKTtcbiAgICB2YXIgYXV0b2RpYWxvZ2lkID0gZGlhbG9nSWQ7XG5cbiAgICB2YXIgZGlhbG9nRWxlID0gdGhpcy5fQ3JlYXRlSWZybWFlRGlhbG9nRWxlbWVudChvcGVuZXJ3aW5kb3cuZG9jdW1lbnQsIGF1dG9kaWFsb2dpZCwgdXJsKTtcblxuICAgIHZhciBkaWFsb2dPYmogPSAkKGRpYWxvZ0VsZSkuZGlhbG9nKGRlZmF1bHRvcHRpb25zKTtcbiAgICB2YXIgJGlmcmFtZW9iaiA9ICQoZGlhbG9nRWxlKS5maW5kKFwiaWZyYW1lXCIpO1xuICAgICRpZnJhbWVvYmouYXR0cihcInNyY1wiLCB1cmwpO1xuICAgICRpZnJhbWVvYmpbMF0uY29udGVudFdpbmRvdy5GcmFtZVdpbmRvd0lkID0gYXV0b2RpYWxvZ2lkO1xuICAgICRpZnJhbWVvYmpbMF0uY29udGVudFdpbmRvdy5PcGVuZXJXaW5kb3dPYmogPSBvcGVuZXJ3aW5kb3c7XG4gICAgcmV0dXJuIGRpYWxvZ09iajtcbiAgfSxcbiAgQ2xvc2VPcGVuSWZyYW1lV2luZG93OiBmdW5jdGlvbiBDbG9zZU9wZW5JZnJhbWVXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCkge1xuICAgIG9wZW5lcndpbmRvdy5PcGVuZXJXaW5kb3dPYmouRGlhbG9nVXRpbGl0eS5DbG9zZURpYWxvZyhkaWFsb2dJZCk7XG4gIH0sXG4gIENsb3NlRGlhbG9nOiBmdW5jdGlvbiBDbG9zZURpYWxvZyhkaWFsb2dJZCkge1xuICAgIHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpLmZpbmQoXCJpZnJhbWVcIikucmVtb3ZlKCk7XG5cbiAgICAkKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpKS5kaWFsb2coXCJjbG9zZVwiKTtcblxuICAgIHRyeSB7XG4gICAgICBpZiAoJChcIiNGb3Jmb2N1c1wiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICQoXCIjRm9yZm9jdXNcIilbMF0uZm9jdXMoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7fVxuICB9LFxuICBPcGVuTmV3V2luZG93OiBmdW5jdGlvbiBPcGVuTmV3V2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKSB7XG4gICAgdmFyIHdpZHRoID0gMDtcbiAgICB2YXIgaGVpZ2h0ID0gMDtcblxuICAgIGlmIChvcHRpb25zKSB7XG4gICAgICB3aWR0aCA9IG9wdGlvbnMud2lkdGg7XG4gICAgICBoZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcbiAgICB9XG5cbiAgICB2YXIgbGVmdCA9IHBhcnNlSW50KChzY3JlZW4uYXZhaWxXaWR0aCAtIHdpZHRoKSAvIDIpLnRvU3RyaW5nKCk7XG4gICAgdmFyIHRvcCA9IHBhcnNlSW50KChzY3JlZW4uYXZhaWxIZWlnaHQgLSBoZWlnaHQpIC8gMikudG9TdHJpbmcoKTtcblxuICAgIGlmICh3aWR0aC50b1N0cmluZygpID09IFwiMFwiICYmIGhlaWdodC50b1N0cmluZygpID09IFwiMFwiKSB7XG4gICAgICB3aWR0aCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxXaWR0aCAtIDMwO1xuICAgICAgaGVpZ2h0ID0gd2luZG93LnNjcmVlbi5hdmFpbEhlaWdodCAtIDYwO1xuICAgICAgbGVmdCA9IFwiMFwiO1xuICAgICAgdG9wID0gXCIwXCI7XG4gICAgfVxuXG4gICAgdmFyIHdpbkhhbmRsZSA9IHdpbmRvdy5vcGVuKHVybCwgXCJcIiwgXCJzY3JvbGxiYXJzPW5vLHRvb2xiYXI9bm8sbWVudWJhcj1ubyxyZXNpemFibGU9eWVzLGNlbnRlcj15ZXMsaGVscD1ubywgc3RhdHVzPXllcyx0b3A9IFwiICsgdG9wICsgXCJweCxsZWZ0PVwiICsgbGVmdCArIFwicHgsd2lkdGg9XCIgKyB3aWR0aCArIFwicHgsaGVpZ2h0PVwiICsgaGVpZ2h0ICsgXCJweFwiKTtcblxuICAgIGlmICh3aW5IYW5kbGUgPT0gbnVsbCkge1xuICAgICAgYWxlcnQoXCLor7fop6PpmaTmtY/op4jlmajlr7nmnKzns7vnu5/lvLnlh7rnqpflj6PnmoTpmLvmraLorr7nva7vvIFcIik7XG4gICAgfVxuICB9LFxuICBfVHJ5R2V0UGFyZW50V2luZG93OiBmdW5jdGlvbiBfVHJ5R2V0UGFyZW50V2luZG93KHdpbikge1xuICAgIGlmICh3aW4ucGFyZW50ICE9IG51bGwpIHtcbiAgICAgIHJldHVybiB3aW4ucGFyZW50O1xuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBfRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmo6IGZ1bmN0aW9uIF9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih3aW4sIHRyeWZpbmR0aW1lLCBjdXJyZW50dHJ5ZmluZHRpbWUpIHtcbiAgICBpZiAodHJ5ZmluZHRpbWUgPiBjdXJyZW50dHJ5ZmluZHRpbWUpIHtcbiAgICAgIHZhciBpc3RvcEZyYW1lcGFnZSA9IGZhbHNlO1xuICAgICAgY3VycmVudHRyeWZpbmR0aW1lKys7XG5cbiAgICAgIHRyeSB7XG4gICAgICAgIGlzdG9wRnJhbWVwYWdlID0gd2luLklzVG9wRnJhbWVQYWdlO1xuXG4gICAgICAgIGlmIChpc3RvcEZyYW1lcGFnZSkge1xuICAgICAgICAgIHJldHVybiB3aW47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKHRoaXMuX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmoodGhpcy5fVHJ5R2V0UGFyZW50V2luZG93KHdpbiksIHRyeWZpbmR0aW1lLCBjdXJyZW50dHJ5ZmluZHRpbWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xuICB9LFxuICBfT3BlbldpbmRvd0luRnJhbWVQYWdlOiBmdW5jdGlvbiBfT3BlbldpbmRvd0luRnJhbWVQYWdlKG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKSB7XG4gICAgaWYgKFN0cmluZ1V0aWxpdHkuSXNOdWxsT3JFbXB0eShkaWFsb2dJZCkpIHtcbiAgICAgIGFsZXJ0KFwiZGlhbG9nSWTkuI3og73kuLrnqbpcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdXJsID0gQmFzZVV0aWxpdHkuQXBwZW5kVGltZVN0YW1wVXJsKHVybCk7XG4gICAgdmFyIGF1dG9kaWFsb2dpZCA9IFwiRnJhbWVEaWFsb2dFbGVcIiArIGRpYWxvZ0lkO1xuXG4gICAgaWYgKCQodGhpcy5GcmFtZVBhZ2VSZWYuZG9jdW1lbnQpLmZpbmQoXCIjXCIgKyBhdXRvZGlhbG9naWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICB2YXIgZGlhbG9nRWxlID0gdGhpcy5fQ3JlYXRlSWZybWFlRGlhbG9nRWxlbWVudCh0aGlzLkZyYW1lUGFnZVJlZi5kb2N1bWVudCwgYXV0b2RpYWxvZ2lkLCB1cmwpO1xuXG4gICAgICB2YXIgZGVmYXVsdG9wdGlvbnMgPSB7XG4gICAgICAgIGhlaWdodDogNDAwLFxuICAgICAgICB3aWR0aDogNjAwLFxuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgdGl0bGU6IFwi57O757ufXCIsXG4gICAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZShldmVudCwgdWkpIHtcbiAgICAgICAgICB2YXIgYXV0b2RpYWxvZ2lkID0gJCh0aGlzKS5hdHRyKFwiaWRcIik7XG4gICAgICAgICAgJCh0aGlzKS5maW5kKFwiaWZyYW1lXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAgICQodGhpcykuZGlhbG9nKFwiZGVzdHJveVwiKTtcbiAgICAgICAgICAkKFwiI1wiICsgYXV0b2RpYWxvZ2lkKS5yZW1vdmUoKTtcblxuICAgICAgICAgIGlmIChCcm93c2VySW5mb1V0aWxpdHkuSXNJRThEb2N1bWVudE1vZGUoKSkge1xuICAgICAgICAgICAgQ29sbGVjdEdhcmJhZ2UoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50KCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBpZiAod2h0eXBlID09IDApIHtcbiAgICAgICAgb3B0aW9ucy53aWR0aCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZVdpZHRoKCkgLSAyMDtcbiAgICAgICAgb3B0aW9ucy5oZWlnaHQgPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSAtIDE4MDtcbiAgICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDEpIHtcbiAgICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgICBoZWlnaHQ6IDY4MCxcbiAgICAgICAgICB3aWR0aDogOTgwXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gMikge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogNjAwLFxuICAgICAgICAgIHdpZHRoOiA4MDBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA0KSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiAzODAsXG4gICAgICAgICAgd2lkdGg6IDQ4MFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDUpIHtcbiAgICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgICBoZWlnaHQ6IDE4MCxcbiAgICAgICAgICB3aWR0aDogMzAwXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy53aWR0aCA9PSAwKSB7XG4gICAgICAgIG9wdGlvbnMud2lkdGggPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpIC0gMjA7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmhlaWdodCA9PSAwKSB7XG4gICAgICAgIG9wdGlvbnMuaGVpZ2h0ID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgLSAxODA7XG4gICAgICB9XG5cbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICQoZGlhbG9nRWxlKS5kaWFsb2coZGVmYXVsdG9wdGlvbnMpO1xuICAgICAgJChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgXCIyMDAwXCIpO1xuICAgICAgJChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIFwiMjAwMVwiKTtcbiAgICAgIHZhciAkaWZyYW1lb2JqID0gJChkaWFsb2dFbGUpLmZpbmQoXCJpZnJhbWVcIik7XG4gICAgICAkaWZyYW1lb2JqLm9uKFwibG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChTdHJpbmdVdGlsaXR5LklzU2FtZU9yZ2luKHdpbmRvdy5sb2NhdGlvbi5ocmVmLCB1cmwpKSB7XG4gICAgICAgICAgdGhpcy5jb250ZW50V2luZG93LkZyYW1lV2luZG93SWQgPSBhdXRvZGlhbG9naWQ7XG4gICAgICAgICAgdGhpcy5jb250ZW50V2luZG93Lk9wZW5lcldpbmRvd09iaiA9IG9wZW5lcndpbmRvdztcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuSXNPcGVuRm9yRnJhbWUgPSB0cnVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwi6Leo5Z+fSWZyYW1lLOaXoOazleiuvue9ruWxnuaApyFcIik7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgJGlmcmFtZW9iai5hdHRyKFwic3JjXCIsIHVybCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoXCIjXCIgKyBhdXRvZGlhbG9naWQpLmRpYWxvZyhcIm1vdmVUb1RvcFwiKTtcbiAgICB9XG4gIH0sXG4gIF9GcmFtZV9GcmFtZVBhZ2VDbG9zZURpYWxvZzogZnVuY3Rpb24gX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nKGRpYWxvZ2lkKSB7XG4gICAgJChcIiNcIiArIGRpYWxvZ2lkKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgfSxcbiAgRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmo6IGZ1bmN0aW9uIEZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKCkge1xuICAgIHZhciB0cnlmaW5kdGltZSA9IDU7XG4gICAgdmFyIGN1cnJlbnR0cnlmaW5kdGltZSA9IDE7XG4gICAgcmV0dXJuIHRoaXMuX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKHdpbmRvdywgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSk7XG4gIH0sXG4gIEZyYW1lX0FsZXJ0OiBmdW5jdGlvbiBGcmFtZV9BbGVydCgpIHt9LFxuICBGcmFtZV9Db21maXJtOiBmdW5jdGlvbiBGcmFtZV9Db21maXJtKCkge30sXG4gIEZyYW1lX09wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIEZyYW1lX09wZW5JZnJhbWVXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICBpZiAodXJsID09IFwiXCIpIHtcbiAgICAgIGFsZXJ0KFwidXJs5LiN6IO95Li656m65a2X56ym5LiyIVwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgd3J3aW4gPSB0aGlzLkZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKCk7XG4gICAgdGhpcy5GcmFtZVBhZ2VSZWYgPSB3cndpbjtcblxuICAgIGlmICh3cndpbiAhPSBudWxsKSB7XG4gICAgICB0aGlzLkZyYW1lUGFnZVJlZi5EaWFsb2dVdGlsaXR5LkZyYW1lUGFnZVJlZiA9IHdyd2luO1xuXG4gICAgICB0aGlzLkZyYW1lUGFnZVJlZi5EaWFsb2dVdGlsaXR5Ll9PcGVuV2luZG93SW5GcmFtZVBhZ2Uob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhbGVydChcIuaJvuS4jeWIsEZyYW1lUGFnZSEhXCIpO1xuICAgIH1cbiAgfSxcbiAgRnJhbWVfQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIEZyYW1lX0Nsb3NlRGlhbG9nKG9wZXJlcldpbmRvdykge1xuICAgIHZhciB3cndpbiA9IHRoaXMuRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKTtcbiAgICB2YXIgb3BlbmVyd2luID0gb3BlcmVyV2luZG93Lk9wZW5lcldpbmRvd09iajtcbiAgICB2YXIgYXV0b2RpYWxvZ2lkID0gb3BlcmVyV2luZG93LkZyYW1lV2luZG93SWQ7XG5cbiAgICB3cndpbi5EaWFsb2dVdGlsaXR5Ll9GcmFtZV9GcmFtZVBhZ2VDbG9zZURpYWxvZyhhdXRvZGlhbG9naWQpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGljdGlvbmFyeVV0aWxpdHkgPSB7XG4gIF9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb246IG51bGwsXG4gIEdyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjogZnVuY3Rpb24gR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uKHNvdXJjZURpY3Rpb25hcnlKc29uKSB7XG4gICAgaWYgKHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbiA9PSBudWxsKSB7XG4gICAgICBpZiAoc291cmNlRGljdGlvbmFyeUpzb24gIT0gbnVsbCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0ge307XG5cbiAgICAgICAgZm9yICh2YXIgZ3JvdXBWYWx1ZSBpbiBzb3VyY2VEaWN0aW9uYXJ5SnNvbikge1xuICAgICAgICAgIHJlc3VsdFtncm91cFZhbHVlXSA9IHt9O1xuXG4gICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgcmVzdWx0W2dyb3VwVmFsdWVdW3NvdXJjZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2ldLmRpY3RWYWx1ZV0gPSBzb3VyY2VEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtpXS5kaWN0VGV4dDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24gPSByZXN1bHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIGNvbnNvbGUgPSBjb25zb2xlIHx8IHtcbiAgbG9nOiBmdW5jdGlvbiBsb2coKSB7fSxcbiAgd2FybjogZnVuY3Rpb24gd2FybigpIHt9LFxuICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoKSB7fVxufTtcblxuZnVuY3Rpb24gRGF0ZUV4dGVuZF9EYXRlRm9ybWF0KGRhdGUsIGZtdCkge1xuICBpZiAobnVsbCA9PSBkYXRlIHx8IHVuZGVmaW5lZCA9PSBkYXRlKSByZXR1cm4gJyc7XG4gIHZhciBvID0ge1xuICAgIFwiTStcIjogZGF0ZS5nZXRNb250aCgpICsgMSxcbiAgICBcImQrXCI6IGRhdGUuZ2V0RGF0ZSgpLFxuICAgIFwiaCtcIjogZGF0ZS5nZXRIb3VycygpLFxuICAgIFwibStcIjogZGF0ZS5nZXRNaW51dGVzKCksXG4gICAgXCJzK1wiOiBkYXRlLmdldFNlY29uZHMoKSxcbiAgICBcIlNcIjogZGF0ZS5nZXRNaWxsaXNlY29uZHMoKVxuICB9O1xuICBpZiAoLyh5KykvLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAoZGF0ZS5nZXRGdWxsWWVhcigpICsgXCJcIikuc3Vic3RyKDQgLSBSZWdFeHAuJDEubGVuZ3RoKSk7XG5cbiAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCBSZWdFeHAuJDEubGVuZ3RoID09IDEgPyBvW2tdIDogKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aCkpO1xuICB9XG5cbiAgcmV0dXJuIGZtdDtcbn1cblxuRGF0ZS5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gRGF0ZUV4dGVuZF9EYXRlRm9ybWF0KHRoaXMsICd5eXl5LU1NLWRkIG1tOmhoOnNzJyk7XG59O1xuXG5pZiAoIU9iamVjdC5jcmVhdGUpIHtcbiAgT2JqZWN0LmNyZWF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICBhbGVydChcIkV4dGVuZCBPYmplY3QuY3JlYXRlXCIpO1xuXG4gICAgZnVuY3Rpb24gRigpIHt9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKG8pIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignT2JqZWN0LmNyZWF0ZSBpbXBsZW1lbnRhdGlvbiBvbmx5IGFjY2VwdHMgb25lIHBhcmFtZXRlci4nKTtcbiAgICAgIH1cblxuICAgICAgRi5wcm90b3R5cGUgPSBvO1xuICAgICAgcmV0dXJuIG5ldyBGKCk7XG4gICAgfTtcbiAgfSgpO1xufVxuXG4kLmZuLm91dGVySFRNTCA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuICF0aGlzLmxlbmd0aCA/IHRoaXMgOiB0aGlzWzBdLm91dGVySFRNTCB8fCBmdW5jdGlvbiAoZWwpIHtcbiAgICB2YXIgZGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgZGl2LmFwcGVuZENoaWxkKGVsLmNsb25lTm9kZSh0cnVlKSk7XG4gICAgdmFyIGNvbnRlbnRzID0gZGl2LmlubmVySFRNTDtcbiAgICBkaXYgPSBudWxsO1xuICAgIGFsZXJ0KGNvbnRlbnRzKTtcbiAgICByZXR1cm4gY29udGVudHM7XG4gIH0odGhpc1swXSk7XG59O1xuXG5mdW5jdGlvbiByZWZDc3NMaW5rKGhyZWYpIHtcbiAgdmFyIGhlYWQgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpbmsnKTtcbiAgc3R5bGUudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gIHN0eWxlLnJlbCA9ICdzdHlsZXNoZWV0JztcbiAgc3R5bGUuaHJlZiA9IGhyZWY7XG4gIGhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICByZXR1cm4gc3R5bGUuc2hlZXQgfHwgc3R5bGUuc3R5bGVTaGVldDtcbn0iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEpzb25VdGlsaXR5ID0ge1xuICBQYXJzZUFycmF5SnNvblRvVHJlZUpzb246IGZ1bmN0aW9uIFBhcnNlQXJyYXlKc29uVG9UcmVlSnNvbihjb25maWcsIHNvdXJjZUFycmF5LCByb290SWQpIHtcbiAgICB2YXIgX2NvbmZpZyA9IHtcbiAgICAgIEtleUZpZWxkOiBcIlwiLFxuICAgICAgUmVsYXRpb25GaWVsZDogXCJcIixcbiAgICAgIENoaWxkRmllbGROYW1lOiBcIlwiXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIEZpbmRKc29uQnlJZChrZXlGaWVsZCwgaWQpIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvdXJjZUFycmF5W2ldW2tleUZpZWxkXSA9PSBpZCkge1xuICAgICAgICAgIHJldHVybiBzb3VyY2VBcnJheVtpXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBhbGVydChcIlBhcnNlQXJyYXlKc29uVG9UcmVlSnNvbi5GaW5kSnNvbkJ5SWQ65Zyoc291cmNlQXJyYXnkuK3mib7kuI3liLDmjIflrppJZOeahOiusOW9lVwiKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBGaW5kQ2hpbGRKc29uKHJlbGF0aW9uRmllbGQsIHBpZCkge1xuICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VBcnJheVtpXVtyZWxhdGlvbkZpZWxkXSA9PSBwaWQpIHtcbiAgICAgICAgICByZXN1bHQucHVzaChzb3VyY2VBcnJheVtpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBGaW5kQ2hpbGROb2RlQW5kUGFyc2UocGlkLCByZXN1bHQpIHtcbiAgICAgIHZhciBjaGlsZGpzb25zID0gRmluZENoaWxkSnNvbihjb25maWcuUmVsYXRpb25GaWVsZCwgcGlkKTtcblxuICAgICAgaWYgKGNoaWxkanNvbnMubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAocmVzdWx0W2NvbmZpZy5DaGlsZEZpZWxkTmFtZV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmVzdWx0W2NvbmZpZy5DaGlsZEZpZWxkTmFtZV0gPSBbXTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRqc29ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHZhciB0b09iaiA9IHt9O1xuICAgICAgICAgIHRvT2JqID0gSnNvblV0aWxpdHkuU2ltcGxlQ2xvbmVBdHRyKHRvT2JqLCBjaGlsZGpzb25zW2ldKTtcbiAgICAgICAgICByZXN1bHRbY29uZmlnLkNoaWxkRmllbGROYW1lXS5wdXNoKHRvT2JqKTtcbiAgICAgICAgICB2YXIgaWQgPSB0b09ialtjb25maWcuS2V5RmllbGRdO1xuICAgICAgICAgIEZpbmRDaGlsZE5vZGVBbmRQYXJzZShpZCwgdG9PYmopO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIHZhciByb290SnNvbiA9IEZpbmRKc29uQnlJZChjb25maWcuS2V5RmllbGQsIHJvb3RJZCk7XG4gICAgcmVzdWx0ID0gdGhpcy5TaW1wbGVDbG9uZUF0dHIocmVzdWx0LCByb290SnNvbik7XG4gICAgRmluZENoaWxkTm9kZUFuZFBhcnNlKHJvb3RJZCwgcmVzdWx0KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9LFxuICBSZXNvbHZlU2ltcGxlQXJyYXlKc29uVG9UcmVlSnNvbjogZnVuY3Rpb24gUmVzb2x2ZVNpbXBsZUFycmF5SnNvblRvVHJlZUpzb24oY29uZmlnLCBzb3VyY2VKc29uLCByb290Tm9kZUlkKSB7XG4gICAgYWxlcnQoXCJKc29uVXRpbGl0eS5SZXNvbHZlU2ltcGxlQXJyYXlKc29uVG9UcmVlSnNvbiDlt7LlgZznlKhcIik7XG4gIH0sXG4gIFNpbXBsZUNsb25lQXR0cjogZnVuY3Rpb24gU2ltcGxlQ2xvbmVBdHRyKHRvT2JqLCBmcm9tT2JqKSB7XG4gICAgZm9yICh2YXIgYXR0ciBpbiBmcm9tT2JqKSB7XG4gICAgICB0b09ialthdHRyXSA9IGZyb21PYmpbYXR0cl07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRvT2JqO1xuICB9LFxuICBDbG9uZVNpbXBsZTogZnVuY3Rpb24gQ2xvbmVTaW1wbGUoc291cmNlKSB7XG4gICAgdmFyIG5ld0pzb24gPSBqUXVlcnkuZXh0ZW5kKHRydWUsIHt9LCBzb3VyY2UpO1xuICAgIHJldHVybiBuZXdKc29uO1xuICB9LFxuICBKc29uVG9TdHJpbmc6IGZ1bmN0aW9uIEpzb25Ub1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqKTtcbiAgfSxcbiAgSnNvblRvU3RyaW5nRm9ybWF0OiBmdW5jdGlvbiBKc29uVG9TdHJpbmdGb3JtYXQob2JqKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaiwgbnVsbCwgMik7XG4gIH0sXG4gIFN0cmluZ1RvSnNvbjogZnVuY3Rpb24gU3RyaW5nVG9Kc29uKHN0cikge1xuICAgIHJldHVybiBldmFsKFwiKFwiICsgc3RyICsgXCIpXCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgTGlzdFBhZ2VVdGlsaXR5ID0ge1xuICBEZWZhdWx0TGlzdEhlaWdodDogZnVuY3Rpb24gRGVmYXVsdExpc3RIZWlnaHQoKSB7XG4gICAgaWYgKFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpID4gNzgwKSB7XG4gICAgICByZXR1cm4gNjc4O1xuICAgIH1cblxuICAgIHJldHVybiA1MDA7XG4gIH0sXG4gIERlZmF1bHRMaXN0SGVpZ2h0XzUwOiBmdW5jdGlvbiBEZWZhdWx0TGlzdEhlaWdodF81MCgpIHtcbiAgICByZXR1cm4gdGhpcy5EZWZhdWx0TGlzdEhlaWdodCgpIC0gNTA7XG4gIH0sXG4gIERlZmF1bHRMaXN0SGVpZ2h0XzEwMDogZnVuY3Rpb24gRGVmYXVsdExpc3RIZWlnaHRfMTAwKCkge1xuICAgIHJldHVybiB0aGlzLkRlZmF1bHRMaXN0SGVpZ2h0KCkgLSAxMDA7XG4gIH0sXG4gIEdldEdlbmVyYWxQYWdlSGVpZ2h0OiBmdW5jdGlvbiBHZXRHZW5lcmFsUGFnZUhlaWdodChmaXhIZWlnaHQpIHtcbiAgICB2YXIgcGFnZUhlaWdodCA9IGpRdWVyeShkb2N1bWVudCkuaGVpZ2h0KCk7XG5cbiAgICBpZiAoJChcIiNsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFwiKS5sZW5ndGggPiAwKSB7XG4gICAgICBwYWdlSGVpZ2h0ID0gcGFnZUhlaWdodCAtICQoXCIjbGlzdC1zaW1wbGUtc2VhcmNoLXdyYXBcIikub3V0ZXJIZWlnaHQoKSArIGZpeEhlaWdodCAtICQoXCIjbGlzdC1idXR0b24td3JhcFwiKS5vdXRlckhlaWdodCgpIC0gJChcIiNsaXN0LXBhZ2VyLXdyYXBcIikub3V0ZXJIZWlnaHQoKSAtIDMwO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlSGVpZ2h0ID0gcGFnZUhlaWdodCAtICQoXCIjbGlzdC1idXR0b24td3JhcFwiKS5vdXRlckhlaWdodCgpICsgZml4SGVpZ2h0IC0gKCQoXCIjbGlzdC1wYWdlci13cmFwXCIpLmxlbmd0aCA+IDAgPyAkKFwiI2xpc3QtcGFnZXItd3JhcFwiKS5vdXRlckhlaWdodCgpIDogMCkgLSAzMDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFnZUhlaWdodDtcbiAgfSxcbiAgR2V0Rml4SGVpZ2h0OiBmdW5jdGlvbiBHZXRGaXhIZWlnaHQoKSB7XG4gICAgcmV0dXJuIC03MDtcbiAgfSxcbiAgSVZpZXdUYWJsZVJlbmRlcmVyOiB7XG4gICAgVG9EYXRlWVlZWV9NTV9ERDogZnVuY3Rpb24gVG9EYXRlWVlZWV9NTV9ERChoLCBkYXRldGltZSkge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRldGltZSk7XG4gICAgICB2YXIgZGF0ZVN0ciA9IERhdGVVdGlsaXR5LkZvcm1hdChkYXRlLCAneXl5eS1NTS1kZCcpO1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIGRhdGVTdHIpO1xuICAgIH0sXG4gICAgU3RyaW5nVG9EYXRlWVlZWV9NTV9ERDogZnVuY3Rpb24gU3RyaW5nVG9EYXRlWVlZWV9NTV9ERChoLCBkYXRldGltZSkge1xuICAgICAgdmFyIGRhdGVTdHIgPSBkYXRldGltZS5zcGxpdChcIiBcIilbMF07XG4gICAgICByZXR1cm4gaCgnZGl2JywgZGF0ZVN0cik7XG4gICAgfSxcbiAgICBUb1N0YXR1c0VuYWJsZTogZnVuY3Rpb24gVG9TdGF0dXNFbmFibGUoaCwgc3RhdHVzKSB7XG4gICAgICBpZiAoc3RhdHVzID09IDApIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi56aB55SoXCIpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gMSkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLlkK/nlKhcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBUb1llc05vRW5hYmxlOiBmdW5jdGlvbiBUb1llc05vRW5hYmxlKGgsIHN0YXR1cykge1xuICAgICAgaWYgKHN0YXR1cyA9PSAwKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuWQplwiKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IDEpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5pivXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgVG9EaWN0aW9uYXJ5VGV4dDogZnVuY3Rpb24gVG9EaWN0aW9uYXJ5VGV4dChoLCBkaWN0aW9uYXJ5SnNvbiwgZ3JvdXBWYWx1ZSwgZGljdGlvbmFyeVZhbHVlKSB7XG4gICAgICB2YXIgc2ltcGxlRGljdGlvbmFyeUpzb24gPSBEaWN0aW9uYXJ5VXRpbGl0eS5Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24oZGljdGlvbmFyeUpzb24pO1xuXG4gICAgICBpZiAoZGljdGlvbmFyeVZhbHVlID09IG51bGwgfHwgZGljdGlvbmFyeVZhbHVlID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwiXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXSkge1xuICAgICAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtkaWN0aW9uYXJ5VmFsdWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2Jywgc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1bZGljdGlvbmFyeVZhbHVlXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaJvuS4jeWIsOijheaNoueahFRFWFRcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaJvuS4jeWIsOijheaNoueahOWIhue7hFwiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5om+5LiN5Yiw6KOF5o2i55qE5YiG57uEXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWQ6IGZ1bmN0aW9uIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkKHNlbGVjdGlvblJvd3MpIHtcbiAgICBpZiAoc2VsZWN0aW9uUm93cyAhPSBudWxsICYmIHNlbGVjdGlvblJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7XG4gICAgICAgICAgZnVuYyhzZWxlY3Rpb25Sb3dzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5Lit6ZyA6KaB5pON5L2c55qE6KGMIVwiLCBudWxsKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge31cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZTogZnVuY3Rpb24gSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUoc2VsZWN0aW9uUm93cykge1xuICAgIGlmIChzZWxlY3Rpb25Sb3dzICE9IG51bGwgJiYgc2VsZWN0aW9uUm93cy5sZW5ndGggPiAwICYmIHNlbGVjdGlvblJvd3MubGVuZ3RoID09IDEpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge1xuICAgICAgICAgIGZ1bmMoc2VsZWN0aW9uUm93cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieS4remcgOimgeaTjeS9nOeahOihjO+8jOavj+asoeWPquiDvemAieS4reS4gOihjCFcIiwgbnVsbCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHt9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXM6IGZ1bmN0aW9uIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgc3RhdHVzTmFtZSwgcGFnZUFwcE9iaikge1xuICAgIHZhciBpZEFycmF5ID0gbmV3IEFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGlvblJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlkQXJyYXkucHVzaChzZWxlY3Rpb25Sb3dzW2ldW2lkRmllbGRdKTtcbiAgICB9XG5cbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgaWRzOiBpZEFycmF5LmpvaW4oXCI7XCIpLFxuICAgICAgc3RhdHVzOiBzdGF0dXNOYW1lXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICB9XG4gICAgfSwgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld01vdmVGYWNlOiBmdW5jdGlvbiBJVmlld01vdmVGYWNlKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgdHlwZSwgcGFnZUFwcE9iaikge1xuICAgIHRoaXMuSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUoc2VsZWN0aW9uUm93cykudGhlbihmdW5jdGlvbiAoc2VsZWN0aW9uUm93cykge1xuICAgICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgICAgcmVjb3JkSWQ6IHNlbGVjdGlvblJvd3NbMF1baWRGaWVsZF0sXG4gICAgICAgIHR5cGU6IHR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgcGFnZUFwcE9iai5yZWxvYWREYXRhKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0pO1xuICB9LFxuICBJVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2U6IGZ1bmN0aW9uIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZSh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHN0YXR1c05hbWUsIHBhZ2VBcHBPYmopIHtcbiAgICB0aGlzLklWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkKHNlbGVjdGlvblJvd3MpLnRoZW4oZnVuY3Rpb24gKHNlbGVjdGlvblJvd3MpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld0NoYW5nZVNlcnZlclN0YXR1cyh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHN0YXR1c05hbWUsIHBhZ2VBcHBPYmopO1xuICAgIH0pO1xuICB9LFxuICBJVmlld1RhYmxlRGVsZXRlUm93OiBmdW5jdGlvbiBJVmlld1RhYmxlRGVsZXRlUm93KHVybCwgcmVjb3JkSWQsIHBhZ2VBcHBPYmopIHtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOimgeWIoOmZpOW9k+WJjeiusOW9leWQl++8n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgICByZWNvcmRJZDogcmVjb3JkSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0pO1xuICB9LFxuICBJVmlld1RhYmxlTG9hZERhdGFTZWFyY2g6IGZ1bmN0aW9uIElWaWV3VGFibGVMb2FkRGF0YVNlYXJjaCh1cmwsIHBhZ2VOdW0sIHBhZ2VTaXplLCBzZWFyY2hDb25kaXRpb24sIHBhZ2VBcHBPYmosIGlkRmllbGQsIGF1dG9TZWxlY3RlZE9sZFJvd3MsIHN1Y2Nlc3NGdW5jLCBsb2FkRGljdCkge1xuICAgIGlmIChsb2FkRGljdCA9PSB1bmRlZmluZWQgfHwgbG9hZERpY3QgPT0gbnVsbCkge1xuICAgICAgbG9hZERpY3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgXCJwYWdlTnVtXCI6IHBhZ2VOdW0sXG4gICAgICBcInBhZ2VTaXplXCI6IHBhZ2VTaXplLFxuICAgICAgXCJzZWFyY2hDb25kaXRpb25cIjogU2VhcmNoVXRpbGl0eS5TZXJpYWxpemF0aW9uU2VhcmNoQ29uZGl0aW9uKHNlYXJjaENvbmRpdGlvbiksXG4gICAgICBcImxvYWREaWN0XCI6IGxvYWREaWN0XG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3VjY2Vzc0Z1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3VjY2Vzc0Z1bmMocmVzdWx0LCBwYWdlQXBwT2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhID0gcmVzdWx0LmRhdGEubGlzdDtcbiAgICAgICAgcGFnZUFwcE9iai5wYWdlVG90YWwgPSByZXN1bHQuZGF0YS50b3RhbDtcblxuICAgICAgICBpZiAoYXV0b1NlbGVjdGVkT2xkUm93cykge1xuICAgICAgICAgIGlmIChwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlQXBwT2JqLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3Nbal1baWRGaWVsZF0gPT0gcGFnZUFwcE9iai50YWJsZURhdGFbaV1baWRGaWVsZF0pIHtcbiAgICAgICAgICAgICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldLl9jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICB9XG4gICAgfSwgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld1RhYmxlTG9hZERhdGFOb1NlYXJjaDogZnVuY3Rpb24gSVZpZXdUYWJsZUxvYWREYXRhTm9TZWFyY2godXJsLCBwYWdlTnVtLCBwYWdlU2l6ZSwgcGFnZUFwcE9iaiwgaWRGaWVsZCwgYXV0b1NlbGVjdGVkT2xkUm93cywgc3VjY2Vzc0Z1bmMpIHtcbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgcGFnZU51bTogcGFnZU51bSxcbiAgICAgIHBhZ2VTaXplOiBwYWdlU2l6ZVxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIHBhZ2VBcHBPYmoucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGF1dG9TZWxlY3RlZE9sZFJvd3MpIHtcbiAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZUFwcE9iai50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzW2pdW2lkRmllbGRdID09IHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldW2lkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBzdWNjZXNzRnVuYyhyZXN1bHQsIHBhZ2VBcHBPYmopO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld1RhYmxlSW5uZXJCdXR0b246IHtcbiAgICBWaWV3QnV0dG9uOiBmdW5jdGlvbiBWaWV3QnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIHZpZXdcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLnZpZXcocGFyYW1zLnJvd1tpZEZpZWxkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIEVkaXRCdXR0b246IGZ1bmN0aW9uIEVkaXRCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gZWRpdFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmouZWRpdChwYXJhbXMucm93W2lkRmllbGRdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgRGVsZXRlQnV0dG9uOiBmdW5jdGlvbiBEZWxldGVCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gZGVsXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5kZWwocGFyYW1zLnJvd1tpZEZpZWxkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQYWdlU3R5bGVVdGlsaXR5ID0ge1xuICBHZXRQYWdlSGVpZ2h0OiBmdW5jdGlvbiBHZXRQYWdlSGVpZ2h0KCkge1xuICAgIHJldHVybiBqUXVlcnkod2luZG93LmRvY3VtZW50KS5oZWlnaHQoKTtcbiAgfSxcbiAgR2V0UGFnZVdpZHRoOiBmdW5jdGlvbiBHZXRQYWdlV2lkdGgoKSB7XG4gICAgcmV0dXJuIGpRdWVyeSh3aW5kb3cuZG9jdW1lbnQpLndpZHRoKCk7XG4gIH0sXG4gIEdldFdpbmRvd0hlaWdodDogZnVuY3Rpb24gR2V0V2luZG93SGVpZ2h0KCkge1xuICAgIHJldHVybiAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gIH0sXG4gIEdldFdpbmRvd1dpZHRoOiBmdW5jdGlvbiBHZXRXaW5kb3dXaWR0aCgpIHtcbiAgICByZXR1cm4gJCh3aW5kb3cpLndpZHRoKCk7XG4gIH0sXG4gIEdldExpc3RCdXR0b25PdXRlckhlaWdodDogZnVuY3Rpb24gR2V0TGlzdEJ1dHRvbk91dGVySGVpZ2h0KCkge1xuICAgIGFsZXJ0KFwiUGFnZVN0eWxlVXRpbGl0eS5HZXRMaXN0QnV0dG9uT3V0ZXJIZWlnaHQg5bey5YGc55SoXCIpO1xuICAgIHJldHVybiBqUXVlcnkoXCIubGlzdC1idXR0b24tb3V0ZXItY1wiKS5vdXRlckhlaWdodCgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgU2VhcmNoVXRpbGl0eSA9IHtcbiAgU2VhcmNoRmllbGRUeXBlOiB7XG4gICAgSW50VHlwZTogXCJJbnRUeXBlXCIsXG4gICAgTnVtYmVyVHlwZTogXCJOdW1iZXJUeXBlXCIsXG4gICAgRGF0YVR5cGU6IFwiRGF0ZVR5cGVcIixcbiAgICBMaWtlU3RyaW5nVHlwZTogXCJMaWtlU3RyaW5nVHlwZVwiLFxuICAgIExlZnRMaWtlU3RyaW5nVHlwZTogXCJMZWZ0TGlrZVN0cmluZ1R5cGVcIixcbiAgICBSaWdodExpa2VTdHJpbmdUeXBlOiBcIlJpZ2h0TGlrZVN0cmluZ1R5cGVcIixcbiAgICBTdHJpbmdUeXBlOiBcIlN0cmluZ1R5cGVcIixcbiAgICBEYXRhU3RyaW5nVHlwZTogXCJEYXRlU3RyaW5nVHlwZVwiLFxuICAgIEFycmF5TGlrZVN0cmluZ1R5cGU6IFwiQXJyYXlMaWtlU3RyaW5nVHlwZVwiXG4gIH0sXG4gIFNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb246IGZ1bmN0aW9uIFNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb24oc2VhcmNoQ29uZGl0aW9uKSB7XG4gICAgdmFyIHNlYXJjaENvbmRpdGlvbkNsb25lID0gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUoc2VhcmNoQ29uZGl0aW9uKTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzZWFyY2hDb25kaXRpb25DbG9uZSkge1xuICAgICAgaWYgKHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udHlwZSA9PSBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5BcnJheUxpa2VTdHJpbmdUeXBlKSB7XG4gICAgICAgIGlmIChzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlICE9IG51bGwgJiYgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSA9IHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUuam9pbihcIjtcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc2VhcmNoQ29uZGl0aW9uQ2xvbmUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSkJ1aWxkNERTZWxlY3RWaWV3ID0ge1xuICBTZWxlY3RFbnZWYXJpYWJsZToge1xuICAgIFVSTDogXCIvSFRNTC9TZWxlY3RWaWV3L1NlbGVjdEVudlZhcmlhYmxlLmh0bWxcIixcbiAgICBiZWdpblNlbGVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3QoaW5zdGFuY2VOYW1lKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuVVJMLCB7XG4gICAgICAgIFwiaW5zdGFuY2VOYW1lXCI6IGluc3RhbmNlTmFtZVxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup5Y+Y6YePXCIsXG4gICAgICAgIG1vZGFsOiB0cnVlXG4gICAgICB9LCAyKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0SW5GcmFtZTogZnVuY3Rpb24gYmVnaW5TZWxlY3RJbkZyYW1lKG9wZW5lciwgaW5zdGFuY2VOYW1lLCBvcHRpb24pIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFZpZXcodGhpcy5VUkwsIHtcbiAgICAgICAgXCJpbnN0YW5jZU5hbWVcIjogaW5zdGFuY2VOYW1lXG4gICAgICB9KTtcbiAgICAgIHZhciBvcHRpb24gPSAkLmV4dGVuZCh0cnVlLCB7fSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup5Y+Y6YePXCJcbiAgICAgIH0sIG9wdGlvbik7XG4gICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cob3BlbmVyLCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkMDUsIHVybCwgb3B0aW9uLCAxKTtcbiAgICAgICQod2luZG93LnBhcmVudC5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgJCh3aW5kb3cucGFyZW50LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgIH0sXG4gICAgZm9ybWF0VGV4dDogZnVuY3Rpb24gZm9ybWF0VGV4dCh0eXBlLCB0ZXh0KSB7XG4gICAgICBpZiAodHlwZSA9PSBcIkNvbnN0XCIpIHtcbiAgICAgICAgcmV0dXJuIFwi6Z2Z5oCB5YC8OuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJEYXRlVGltZVwiKSB7XG4gICAgICAgIHJldHVybiBcIuaXpeacn+aXtumXtDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiQXBpVmFyXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiQVBJ5Y+Y6YePOuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJOdW1iZXJDb2RlXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi5bqP5Y+357yW56CBOuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJJZENvZGVyXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi5Li76ZSu55Sf5oiQOuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJcIikge1xuICAgICAgICByZXR1cm4gXCLjgJDml6DjgJFcIjtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIFwi5pyq55+l57G75Z6LXCIgKyB0ZXh0O1xuICAgIH1cbiAgfSxcbiAgU2VsZWN0QmluZFRvRmllbGQ6IHtcbiAgICBVUkw6IFwiL0hUTUwvU2VsZWN0Vmlldy9TZWxlY3RCaW5kVG9GaWVsZC5odG1sXCIsXG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KGluc3RhbmNlTmFtZSkge1xuICAgICAgdmFyIHVybCA9IHRoaXMuVVJMICsgXCI/aW5zdGFuY2VOYW1lPVwiICsgaW5zdGFuY2VOYW1lO1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHRpdGxlOiBcIumAieaLqeWPmOmHj1wiLFxuICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdEluRnJhbWU6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0SW5GcmFtZShvcGVuZXIsIGluc3RhbmNlTmFtZSwgb3B0aW9uKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuVVJMLCB7XG4gICAgICAgIFwiaW5zdGFuY2VOYW1lXCI6IGluc3RhbmNlTmFtZVxuICAgICAgfSk7XG4gICAgICB2YXIgb3B0aW9uID0gJC5leHRlbmQodHJ1ZSwge30sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqee7keWumuWtl+autVwiXG4gICAgICB9LCBvcHRpb24pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KG9wZW5lciwgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZDA1LCB1cmwsIG9wdGlvbiwgMSk7XG4gICAgICAkKHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQpLmZpbmQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIDEwMTAwKTtcbiAgICAgICQod2luZG93LnBhcmVudC5kb2N1bWVudCkuZmluZChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIDEwMTAxKTtcbiAgICB9XG4gIH0sXG4gIFNlbGVjdFZhbGlkYXRlUnVsZToge1xuICAgIFVSTDogXCIvSFRNTC9TZWxlY3RWaWV3L1NlbGVjdFZhbGlkYXRlUnVsZS5odG1sXCIsXG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KGluc3RhbmNlTmFtZSkge1xuICAgICAgdmFyIHVybCA9IHRoaXMuVVJMICsgXCI/aW5zdGFuY2VOYW1lPVwiICsgaW5zdGFuY2VOYW1lO1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHRpdGxlOiBcIumqjOivgeinhOWImVwiLFxuICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdEluRnJhbWU6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0SW5GcmFtZShvcGVuZXIsIGluc3RhbmNlTmFtZSwgb3B0aW9uKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRWaWV3KHRoaXMuVVJMLCB7XG4gICAgICAgIFwiaW5zdGFuY2VOYW1lXCI6IGluc3RhbmNlTmFtZVxuICAgICAgfSk7XG4gICAgICB2YXIgb3B0aW9uID0gJC5leHRlbmQodHJ1ZSwge30sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIumqjOivgeinhOWImVwiXG4gICAgICB9LCBvcHRpb24pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KG9wZW5lciwgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZDA1LCB1cmwsIG9wdGlvbiwgMSk7XG4gICAgICAkKHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQpLmZpbmQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIDEwMTAwKTtcbiAgICAgICQod2luZG93LnBhcmVudC5kb2N1bWVudCkuZmluZChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIDEwMTAxKTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IGlmICh0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIFN5bWJvbC5pdGVyYXRvciA9PT0gXCJzeW1ib2xcIikgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH07IH0gZWxzZSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IFN5bWJvbCAmJiBvYmogIT09IFN5bWJvbC5wcm90b3R5cGUgPyBcInN5bWJvbFwiIDogdHlwZW9mIG9iajsgfTsgfSByZXR1cm4gX3R5cGVvZihvYmopOyB9XG5cbnZhciBTdHJpbmdVdGlsaXR5ID0ge1xuICBHdWlkU3BsaXQ6IGZ1bmN0aW9uIEd1aWRTcGxpdChzcGxpdCkge1xuICAgIHZhciBndWlkID0gXCJcIjtcblxuICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IDMyOyBpKyspIHtcbiAgICAgIGd1aWQgKz0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMTYuMCkudG9TdHJpbmcoMTYpO1xuICAgICAgaWYgKGkgPT0gOCB8fCBpID09IDEyIHx8IGkgPT0gMTYgfHwgaSA9PSAyMCkgZ3VpZCArPSBzcGxpdDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3VpZDtcbiAgfSxcbiAgR3VpZDogZnVuY3Rpb24gR3VpZCgpIHtcbiAgICByZXR1cm4gdGhpcy5HdWlkU3BsaXQoXCItXCIpO1xuICB9LFxuICBUaW1lc3RhbXA6IGZ1bmN0aW9uIFRpbWVzdGFtcCgpIHtcbiAgICB2YXIgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgcmV0dXJuIHRpbWVzdGFtcC50b1N0cmluZygpLnN1YnN0cig0LCAxMCk7XG4gIH0sXG4gIFRyaW06IGZ1bmN0aW9uIFRyaW0oc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5yZXBsYWNlKC8oXlvjgIBcXHNdKil8KFvjgIBcXHNdKiQpL2csIFwiXCIpO1xuICB9LFxuICBSZW1vdmVMYXN0Q2hhcjogZnVuY3Rpb24gUmVtb3ZlTGFzdENoYXIoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci5zdWJzdHJpbmcoMCwgc3RyLmxlbmd0aCAtIDEpO1xuICB9LFxuICBJc051bGxPckVtcHR5OiBmdW5jdGlvbiBJc051bGxPckVtcHR5KG9iaikge1xuICAgIHJldHVybiBvYmogPT0gdW5kZWZpbmVkIHx8IG9iaiA9PSBcIlwiIHx8IG9iaiA9PSBudWxsIHx8IG9iaiA9PSBcInVuZGVmaW5lZFwiIHx8IG9iaiA9PSBcIm51bGxcIjtcbiAgfSxcbiAgR2V0RnVudGlvbk5hbWU6IGZ1bmN0aW9uIEdldEZ1bnRpb25OYW1lKGZ1bmMpIHtcbiAgICBpZiAodHlwZW9mIGZ1bmMgPT0gXCJmdW5jdGlvblwiIHx8IF90eXBlb2YoZnVuYykgPT0gXCJvYmplY3RcIikgdmFyIGZOYW1lID0gKFwiXCIgKyBmdW5jKS5tYXRjaCgvZnVuY3Rpb25cXHMqKFtcXHdcXCRdKilcXHMqXFwoLyk7XG4gICAgaWYgKGZOYW1lICE9PSBudWxsKSByZXR1cm4gZk5hbWVbMV07XG4gIH0sXG4gIFRvTG93ZXJDYXNlOiBmdW5jdGlvbiBUb0xvd2VyQ2FzZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRvTG93ZXJDYXNlKCk7XG4gIH0sXG4gIHRvVXBwZXJDYXNlOiBmdW5jdGlvbiB0b1VwcGVyQ2FzZShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnRvVXBwZXJDYXNlKCk7XG4gIH0sXG4gIEVuZFdpdGg6IGZ1bmN0aW9uIEVuZFdpdGgoc3RyLCBlbmRTdHIpIHtcbiAgICB2YXIgZCA9IHN0ci5sZW5ndGggLSBlbmRTdHIubGVuZ3RoO1xuICAgIHJldHVybiBkID49IDAgJiYgc3RyLmxhc3RJbmRleE9mKGVuZFN0cikgPT0gZDtcbiAgfSxcbiAgSXNTYW1lT3JnaW46IGZ1bmN0aW9uIElzU2FtZU9yZ2luKHVybDEsIHVybDIpIHtcbiAgICB2YXIgb3JpZ2luMSA9IC9cXC9cXC9bXFx3LS5dKyg6XFxkKyk/L2kuZXhlYyh1cmwxKVswXTtcbiAgICB2YXIgb3JpZ2luMiA9IC9cXC9cXC9bXFx3LS5dKyg6XFxkKyk/L2kuZXhlYyh1cmwyKVswXTtcblxuICAgIGlmIChvcmlnaW4xID09IG9yaWdpbjIpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFhNTFV0aWxpdHkgPSB7fTsiXX0=
