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
    }

    return this.AppendTimeStampUrl(_url);
  },
  RedirectToLogin: function RedirectToLogin() {
    var url = BaseUtility.GetRootPath() + "/LoginView.do";
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
    $iframeobj.attr(src, url);
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
      DialogUtility.Frame_OpenIframeWindow(opener, DialogUtility.DialogId05, url, option, 1);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFqYXhVdGlsaXR5LmpzIiwiQmFzZVV0aWxpdHkuanMiLCJCcm93c2VySW5mb1V0aWxpdHkuanMiLCJDYWNoZURhdGFVdGlsaXR5LmpzIiwiQ29va2llVXRpbGl0eS5qcyIsIkRhdGVVdGlsaXR5LmpzIiwiRGV0YWlsUGFnZVV0aWxpdHkuanMiLCJEaWFsb2dVdGlsaXR5LmpzIiwiRGljdGlvbmFyeVV0aWxpdHkuanMiLCJKQnVpbGQ0REJhc2VMaWIuanMiLCJKc29uVXRpbGl0eS5qcyIsIkxpc3RQYWdlVXRpbGl0eS5qcyIsIlBhZ2VTdHlsZVV0aWxpdHkuanMiLCJTZWFyY2hVdGlsaXR5LmpzIiwiU2VsZWN0Vmlld0xpYi5qcyIsIlN0cmluZ1V0aWxpdHkuanMiLCJYTUxVdGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQSIsImZpbGUiOiJKQnVpbGQ0RFBsYXRmb3JtTGliLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBBamF4VXRpbGl0eSA9IHtcbiAgUG9zdFJlcXVlc3RCb2R5OiBmdW5jdGlvbiBQb3N0UmVxdWVzdEJvZHkoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlKSB7XG4gICAgdGhpcy5Qb3N0KF91cmwsIHNlbmREYXRhLCBmdW5jLCBkYXRhVHlwZSwgXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIpO1xuICB9LFxuICBQb3N0U3luYzogZnVuY3Rpb24gUG9zdFN5bmMoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBjb250ZW50VHlwZSkge1xuICAgIHZhciByZXN1bHQgPSB0aGlzLlBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBjb250ZW50VHlwZSwgZmFsc2UpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFBvc3Q6IGZ1bmN0aW9uIFBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBjb250ZW50VHlwZSwgaXNBc3luYykge1xuICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbihfdXJsKTtcblxuICAgIGlmIChkYXRhVHlwZSA9PSB1bmRlZmluZWQgfHwgZGF0YVR5cGUgPT0gbnVsbCkge1xuICAgICAgZGF0YVR5cGUgPSBcInRleHRcIjtcbiAgICB9XG5cbiAgICBpZiAoaXNBc3luYyA9PSB1bmRlZmluZWQgfHwgaXNBc3luYyA9PSBudWxsKSB7XG4gICAgICBpc0FzeW5jID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY29udGVudFR5cGUgPT0gdW5kZWZpbmVkIHx8IGNvbnRlbnRUeXBlID09IG51bGwpIHtcbiAgICAgIGNvbnRlbnRUeXBlID0gXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLThcIjtcbiAgICB9XG5cbiAgICB2YXIgaW5uZXJSZXN1bHQgPSBudWxsO1xuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIHVybDogdXJsLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgYXN5bmM6IGlzQXN5bmMsXG4gICAgICBjb250ZW50VHlwZTogY29udGVudFR5cGUsXG4gICAgICBkYXRhVHlwZTogZGF0YVR5cGUsXG4gICAgICBkYXRhOiBzZW5kRGF0YSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0KSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHJlc3VsdCAhPSBudWxsICYmIHJlc3VsdC5zdWNjZXNzICE9IG51bGwgJiYgIXJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBpZiAocmVzdWx0Lm1lc3NhZ2UgPT0gXCLnmbvlvZVTZXNzaW9u6L+H5pyfXCIpIHtcbiAgICAgICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwiU2Vzc2lvbui2heaXtu+8jOivt+mHjeaWsOeZu+mZhuezu+e7n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgQmFzZVV0aWxpdHkuUmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWpheFV0aWxpdHkuUG9zdCBFeGNlcHRpb24gXCIgKyB1cmwpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuYyhyZXN1bHQpO1xuICAgICAgICBpbm5lclJlc3VsdCA9IHJlc3VsdDtcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUobXNnKSB7fSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAobXNnLnJlc3BvbnNlVGV4dC5pbmRleE9mKFwi6K+36YeN5paw55m76ZmG57O757ufXCIpID49IDApIHtcbiAgICAgICAgICAgIEJhc2VVdGlsaXR5LlJlZGlyZWN0VG9Mb2dpbigpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIFwiQWpheFV0aWxpdHkuUG9zdC5FcnJvclwiLCB7fSwgXCJBamF46K+35rGC5Y+R55Sf6ZSZ6K+v77yBXCIgKyBcInN0YXR1czpcIiArIG1zZy5zdGF0dXMgKyBcIixyZXNwb25zZVRleHQ6XCIgKyBtc2cucmVzcG9uc2VUZXh0LCBudWxsKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gaW5uZXJSZXN1bHQ7XG4gIH0sXG4gIEdldFN5bmM6IGZ1bmN0aW9uIEdldFN5bmMoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlKSB7XG4gICAgdGhpcy5Qb3N0KF91cmwsIHNlbmREYXRhLCBmdW5jLCBkYXRhVHlwZSwgZmFsc2UpO1xuICB9LFxuICBHZXQ6IGZ1bmN0aW9uIEdldChfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGlzQXN5bmMpIHtcbiAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRVcmwoX3VybCk7XG5cbiAgICBpZiAoZGF0YVR5cGUgPT0gdW5kZWZpbmVkIHx8IGRhdGFUeXBlID09IG51bGwpIHtcbiAgICAgIGRhdGFUeXBlID0gXCJ0ZXh0XCI7XG4gICAgfVxuXG4gICAgaWYgKGlzQXN5bmMgPT0gdW5kZWZpbmVkIHx8IGlzQXN5bmMgPT0gbnVsbCkge1xuICAgICAgaXNBc3luYyA9IHRydWU7XG4gICAgfVxuXG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICB1cmw6IHVybCxcbiAgICAgIGNhY2hlOiBmYWxzZSxcbiAgICAgIGFzeW5jOiBpc0FzeW5jLFxuICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLFxuICAgICAgZGF0YVR5cGU6IGRhdGFUeXBlLFxuICAgICAgZGF0YTogc2VuZERhdGEsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiBzdWNjZXNzKHJlc3VsdCkge1xuICAgICAgICBmdW5jKHJlc3VsdCk7XG4gICAgICB9LFxuICAgICAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKG1zZykge30sXG4gICAgICBlcnJvcjogZnVuY3Rpb24gZXJyb3IobXNnKSB7XG4gICAgICAgIGRlYnVnZ2VyO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQmFzZVV0aWxpdHkgPSB7XG4gIEdldFJvb3RQYXRoOiBmdW5jdGlvbiBHZXRSb290UGF0aCgpIHtcbiAgICB2YXIgZnVsbEhyZWYgPSB3aW5kb3cuZG9jdW1lbnQubG9jYXRpb24uaHJlZjtcbiAgICB2YXIgcGF0aE5hbWUgPSB3aW5kb3cuZG9jdW1lbnQubG9jYXRpb24ucGF0aG5hbWU7XG4gICAgdmFyIGxhYyA9IGZ1bGxIcmVmLmluZGV4T2YocGF0aE5hbWUpO1xuICAgIHZhciBsb2NhbGhvc3RQYXRoID0gZnVsbEhyZWYuc3Vic3RyaW5nKDAsIGxhYyk7XG4gICAgdmFyIHByb2plY3ROYW1lID0gcGF0aE5hbWUuc3Vic3RyaW5nKDAsIHBhdGhOYW1lLnN1YnN0cigxKS5pbmRleE9mKCcvJykgKyAxKTtcbiAgICByZXR1cm4gbG9jYWxob3N0UGF0aCArIHByb2plY3ROYW1lO1xuICB9LFxuICBSZXBsYWNlVXJsVmFyaWFibGU6IGZ1bmN0aW9uIFJlcGxhY2VVcmxWYXJpYWJsZShzb3VyY2VVcmwpIHtcbiAgICBhbGVydChcIlJlcGxhY2VVcmxWYXJpYWJsZei/geenu+WIsEJ1aWxkQWN0aW9uXCIpO1xuICB9LFxuICBHZXRUb3BXaW5kb3c6IGZ1bmN0aW9uIEdldFRvcFdpbmRvdygpIHtcbiAgICBhbGVydChcIkJhc2VVdGlsaXR5LkdldFRvcFdpbmRvdyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIFRyeVNldENvbnRyb2xGb2N1czogZnVuY3Rpb24gVHJ5U2V0Q29udHJvbEZvY3VzKCkge1xuICAgIGFsZXJ0KFwiQmFzZVV0aWxpdHkuVHJ5U2V0Q29udHJvbEZvY3VzIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgQnVpbGRVcmw6IGZ1bmN0aW9uIEJ1aWxkVXJsKHVybCkge1xuICAgIGFsZXJ0KFwiQmFzZVV0aWxpdHkuQnVpbGRVcmwg5bey5YGc55SoXCIpO1xuICB9LFxuICBCdWlsZFZpZXc6IGZ1bmN0aW9uIEJ1aWxkVmlldyhhY3Rpb24sIHBhcmEpIHtcbiAgICBpZiAoU3RyaW5nVXRpbGl0eS5FbmRXaXRoKGFjdGlvbiwgXCJWaWV3XCIpKSB7XG4gICAgICByZXR1cm4gdGhpcy5CdWlsZEFjdGlvbihhY3Rpb24sIHBhcmEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0VGV4dChhY3Rpb24gKyBcIuinhuWbvlVybOivt+eUqFZpZXfkvZzkuLrnu5PlsL4uXCIpO1xuICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfVxuICB9LFxuICBCdWlsZEFjdGlvbjogZnVuY3Rpb24gQnVpbGRBY3Rpb24oYWN0aW9uLCBwYXJhKSB7XG4gICAgdmFyIHVybFBhcmEgPSBcIlwiO1xuXG4gICAgaWYgKHBhcmEpIHtcbiAgICAgIHVybFBhcmEgPSAkLnBhcmFtKHBhcmEpO1xuICAgIH1cblxuICAgIHZhciBfdXJsID0gdGhpcy5HZXRSb290UGF0aCgpICsgYWN0aW9uICsgXCIuZG9cIjtcblxuICAgIGlmICh1cmxQYXJhICE9IFwiXCIpIHtcbiAgICAgIF91cmwgKz0gXCI/XCIgKyB1cmxQYXJhO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLkFwcGVuZFRpbWVTdGFtcFVybChfdXJsKTtcbiAgfSxcbiAgUmVkaXJlY3RUb0xvZ2luOiBmdW5jdGlvbiBSZWRpcmVjdFRvTG9naW4oKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkdldFJvb3RQYXRoKCkgKyBcIi9Mb2dpblZpZXcuZG9cIjtcbiAgICB3aW5kb3cucGFyZW50LnBhcmVudC5sb2NhdGlvbi5ocmVmID0gdXJsO1xuICB9LFxuICBBcHBlbmRUaW1lU3RhbXBVcmw6IGZ1bmN0aW9uIEFwcGVuZFRpbWVTdGFtcFVybCh1cmwpIHtcbiAgICBpZiAodXJsLmluZGV4T2YoXCJ0aW1lc3RhbXBcIikgPiBcIjBcIikge1xuICAgICAgcmV0dXJuIHVybDtcbiAgICB9XG5cbiAgICB2YXIgZ2V0VGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICBpZiAodXJsLmluZGV4T2YoXCI/XCIpID4gLTEpIHtcbiAgICAgIHVybCA9IHVybCArIFwiJnRpbWVzdGFtcD1cIiArIGdldFRpbWVzdGFtcDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXJsID0gdXJsICsgXCI/dGltZXN0YW1wPVwiICsgZ2V0VGltZXN0YW1wO1xuICAgIH1cblxuICAgIHJldHVybiB1cmw7XG4gIH0sXG4gIEdldFVybFBhcmFWYWx1ZTogZnVuY3Rpb24gR2V0VXJsUGFyYVZhbHVlKHBhcmFOYW1lKSB7XG4gICAgcmV0dXJuIHRoaXMuR2V0VXJsUGFyYVZhbHVlQnlTdHJpbmcocGFyYU5hbWUsIHdpbmRvdy5sb2NhdGlvbi5zZWFyY2gpO1xuICB9LFxuICBHZXRVcmxQYXJhVmFsdWVCeVN0cmluZzogZnVuY3Rpb24gR2V0VXJsUGFyYVZhbHVlQnlTdHJpbmcocGFyYU5hbWUsIHVybFN0cmluZykge1xuICAgIHZhciByZWcgPSBuZXcgUmVnRXhwKFwiKF58JilcIiArIHBhcmFOYW1lICsgXCI9KFteJl0qKSgmfCQpXCIpO1xuICAgIHZhciByID0gdXJsU3RyaW5nLnN1YnN0cigxKS5tYXRjaChyZWcpO1xuICAgIGlmIChyICE9IG51bGwpIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoclsyXSk7XG4gICAgcmV0dXJuIFwiXCI7XG4gIH0sXG4gIENvcHlWYWx1ZUNsaXBib2FyZDogZnVuY3Rpb24gQ29weVZhbHVlQ2xpcGJvYXJkKHZhbHVlKSB7XG4gICAgdmFyIHRyYW5zZmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ0pfQ29weVRyYW5zZmVyJyk7XG5cbiAgICBpZiAoIXRyYW5zZmVyKSB7XG4gICAgICB0cmFuc2ZlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3RleHRhcmVhJyk7XG4gICAgICB0cmFuc2Zlci5pZCA9ICdKX0NvcHlUcmFuc2Zlcic7XG4gICAgICB0cmFuc2Zlci5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICB0cmFuc2Zlci5zdHlsZS5sZWZ0ID0gJy05OTk5cHgnO1xuICAgICAgdHJhbnNmZXIuc3R5bGUudG9wID0gJy05OTk5cHgnO1xuICAgICAgdHJhbnNmZXIuc3R5bGUuekluZGV4ID0gOTk5OTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodHJhbnNmZXIpO1xuICAgIH1cblxuICAgIHRyYW5zZmVyLnZhbHVlID0gdmFsdWU7XG4gICAgdHJhbnNmZXIuZm9jdXMoKTtcbiAgICB0cmFuc2Zlci5zZWxlY3QoKTtcbiAgICBkb2N1bWVudC5leGVjQ29tbWFuZCgnY29weScpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQnJvd3NlckluZm9VdGlsaXR5ID0ge1xuICBCcm93c2VyQXBwTmFtZTogZnVuY3Rpb24gQnJvd3NlckFwcE5hbWUoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkZpcmVmb3hcIikgPiAwKSB7XG4gICAgICByZXR1cm4gXCJGaXJlZm94XCI7XG4gICAgfSBlbHNlIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFXCIpID4gMCkge1xuICAgICAgcmV0dXJuIFwiSUVcIjtcbiAgICB9IGVsc2UgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIkNocm9tZVwiKSA+IDApIHtcbiAgICAgIHJldHVybiBcIkNocm9tZVwiO1xuICAgIH1cbiAgfSxcbiAgSXNJRTogZnVuY3Rpb24gSXNJRSgpIHtcbiAgICBpZiAoISF3aW5kb3cuQWN0aXZlWE9iamVjdCB8fCBcIkFjdGl2ZVhPYmplY3RcIiBpbiB3aW5kb3cpIHJldHVybiB0cnVlO2Vsc2UgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFNjogZnVuY3Rpb24gSXNJRTYoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgNi4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTc6IGZ1bmN0aW9uIElzSUU3KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDcuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU4OiBmdW5jdGlvbiBJc0lFOCgpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA4LjBcIikgPiAwO1xuICB9LFxuICBJc0lFOFg2NDogZnVuY3Rpb24gSXNJRThYNjQoKSB7XG4gICAgaWYgKG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOC4wXCIpID4gMCkge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIng2NFwiKSA+IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJc0lFOTogZnVuY3Rpb24gSXNJRTkoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOS4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRTlYNjQ6IGZ1bmN0aW9uIElzSUU5WDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDkuMFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJ4NjRcIikgPiAwO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNJRTEwOiBmdW5jdGlvbiBJc0lFMTAoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgMTAuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUUxMFg2NDogZnVuY3Rpb24gSXNJRTEwWDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDEwLjBcIikgPiAwKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwieDY0XCIpID4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElFRG9jdW1lbnRNb2RlOiBmdW5jdGlvbiBJRURvY3VtZW50TW9kZSgpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuZG9jdW1lbnRNb2RlO1xuICB9LFxuICBJc0lFOERvY3VtZW50TW9kZTogZnVuY3Rpb24gSXNJRThEb2N1bWVudE1vZGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuSUVEb2N1bWVudE1vZGUoKSA9PSA4O1xuICB9LFxuICBJc0ZpcmVmb3g6IGZ1bmN0aW9uIElzRmlyZWZveCgpIHtcbiAgICByZXR1cm4gdGhpcy5Ccm93c2VyQXBwTmFtZSgpID09IFwiRmlyZWZveFwiO1xuICB9LFxuICBJc0Nocm9tZTogZnVuY3Rpb24gSXNDaHJvbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuQnJvd3NlckFwcE5hbWUoKSA9PSBcIkNocm9tZVwiO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ2FjaGVEYXRhVXRpbGl0eSA9IHtcbiAgSW5pbkNsaWVudENhY2hlOiBmdW5jdGlvbiBJbmluQ2xpZW50Q2FjaGUoKSB7XG4gICAgdGhpcy5HZXRDdXJyZW50VXNlckluZm8oKTtcbiAgfSxcbiAgX0N1cnJlbnRVc2VySW5mbzogbnVsbCxcbiAgR2V0Q3VycmVudFVzZXJJbmZvOiBmdW5jdGlvbiBHZXRDdXJyZW50VXNlckluZm8oKSB7XG4gICAgaWYgKHRoaXMuX0N1cnJlbnRVc2VySW5mbyA9PSBudWxsKSB7XG4gICAgICBpZiAod2luZG93LnBhcmVudC5DYWNoZURhdGFVdGlsaXR5Ll9DdXJyZW50VXNlckluZm8gIT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gd2luZG93LnBhcmVudC5DYWNoZURhdGFVdGlsaXR5Ll9DdXJyZW50VXNlckluZm87XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBBamF4VXRpbGl0eS5Qb3N0U3luYyhcIi9QbGF0Rm9ybS9NeUluZm8vR2V0VXNlckluZm9cIiwge30sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIENhY2hlRGF0YVV0aWxpdHkuX0N1cnJlbnRVc2VySW5mbyA9IHJlc3VsdC5kYXRhO1xuICAgICAgICAgIH0gZWxzZSB7fVxuICAgICAgICB9LCBcImpzb25cIik7XG4gICAgICAgIHJldHVybiB0aGlzLl9DdXJyZW50VXNlckluZm87XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9DdXJyZW50VXNlckluZm87XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgQ29va2llVXRpbGl0eSA9IHtcbiAgU2V0Q29va2llMURheTogZnVuY3Rpb24gU2V0Q29va2llMURheShuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgKyAyNCAqIDYwICogNjAgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIFNldENvb2tpZTFNb250aDogZnVuY3Rpb24gU2V0Q29va2llMU1vbnRoKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGV4cCA9IG5ldyBEYXRlKCk7XG4gICAgZXhwLnNldFRpbWUoZXhwLmdldFRpbWUoKSArIDMwICogMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBTZXRDb29raWUxWWVhcjogZnVuY3Rpb24gU2V0Q29va2llMVllYXIobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpICsgMzAgKiAyNCAqIDYwICogNjAgKiAzNjUgKiAxMDAwKTtcbiAgICBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBlc2NhcGUodmFsdWUpICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH0sXG4gIEdldENvb2tpZTogZnVuY3Rpb24gR2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgYXJyID0gZG9jdW1lbnQuY29va2llLm1hdGNoKG5ldyBSZWdFeHAoXCIoXnwgKVwiICsgbmFtZSArIFwiPShbXjtdKikoO3wkKVwiKSk7XG4gICAgaWYgKGFyciAhPSBudWxsKSByZXR1cm4gdW5lc2NhcGUoYXJyWzJdKTtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgRGVsQ29va2llOiBmdW5jdGlvbiBEZWxDb29raWUobmFtZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgLSAxKTtcbiAgICB2YXIgY3ZhbCA9IHRoaXMuZ2V0Q29va2llKG5hbWUpO1xuICAgIGlmIChjdmFsICE9IG51bGwpIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGN2YWwgKyBcIjtleHBpcmVzPVwiICsgZXhwLnRvR01UU3RyaW5nKCkgKyBcIjtwYXRoPS9cIjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERhdGVVdGlsaXR5ID0ge1xuICBHZXRDdXJyZW50RGF0YVN0cmluZzogZnVuY3Rpb24gR2V0Q3VycmVudERhdGFTdHJpbmcoc3BsaXQpIHtcbiAgICBhbGVydChcIkRhdGVVdGlsaXR5LkdldEN1cnJlbnREYXRhU3RyaW5nIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgRGF0ZUZvcm1hdDogZnVuY3Rpb24gRGF0ZUZvcm1hdChteURhdGUsIHNwbGl0KSB7XG4gICAgYWxlcnQoXCJEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YVN0cmluZyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIEZvcm1hdDogZnVuY3Rpb24gRm9ybWF0KG15RGF0ZSwgZm9ybWF0U3RyaW5nKSB7XG4gICAgdmFyIG8gPSB7XG4gICAgICBcIk0rXCI6IG15RGF0ZS5nZXRNb250aCgpICsgMSxcbiAgICAgIFwiZCtcIjogbXlEYXRlLmdldERhdGUoKSxcbiAgICAgIFwiaCtcIjogbXlEYXRlLmdldEhvdXJzKCksXG4gICAgICBcIm0rXCI6IG15RGF0ZS5nZXRNaW51dGVzKCksXG4gICAgICBcInMrXCI6IG15RGF0ZS5nZXRTZWNvbmRzKCksXG4gICAgICBcInErXCI6IE1hdGguZmxvb3IoKG15RGF0ZS5nZXRNb250aCgpICsgMykgLyAzKSxcbiAgICAgIFwiU1wiOiBteURhdGUuZ2V0TWlsbGlzZWNvbmRzKClcbiAgICB9O1xuICAgIGlmICgvKHkrKS8udGVzdChmb3JtYXRTdHJpbmcpKSBmb3JtYXRTdHJpbmcgPSBmb3JtYXRTdHJpbmcucmVwbGFjZShSZWdFeHAuJDEsIChteURhdGUuZ2V0RnVsbFllYXIoKSArIFwiXCIpLnN1YnN0cig0IC0gUmVnRXhwLiQxLmxlbmd0aCkpO1xuXG4gICAgZm9yICh2YXIgayBpbiBvKSB7XG4gICAgICBpZiAobmV3IFJlZ0V4cChcIihcIiArIGsgKyBcIilcIikudGVzdChmb3JtYXRTdHJpbmcpKSBmb3JtYXRTdHJpbmcgPSBmb3JtYXRTdHJpbmcucmVwbGFjZShSZWdFeHAuJDEsIFJlZ0V4cC4kMS5sZW5ndGggPT0gMSA/IG9ba10gOiAoXCIwMFwiICsgb1trXSkuc3Vic3RyKChcIlwiICsgb1trXSkubGVuZ3RoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvcm1hdFN0cmluZztcbiAgfSxcbiAgRm9ybWF0Q3VycmVudERhdGE6IGZ1bmN0aW9uIEZvcm1hdEN1cnJlbnREYXRhKGZvcm1hdFN0cmluZykge1xuICAgIHZhciBteURhdGUgPSBuZXcgRGF0ZSgpO1xuICAgIHJldHVybiB0aGlzLkZvcm1hdChteURhdGUsIGZvcm1hdFN0cmluZyk7XG4gIH0sXG4gIEdldEN1cnJlbnREYXRhOiBmdW5jdGlvbiBHZXRDdXJyZW50RGF0YSgpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERldGFpbFBhZ2VVdGlsaXR5ID0ge1xuICBJVmlld1BhZ2VUb1ZpZXdTdGF0dXM6IGZ1bmN0aW9uIElWaWV3UGFnZVRvVmlld1N0YXR1cygpIHtcbiAgICByZXR1cm47XG4gICAgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgJChcImlucHV0XCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmhpZGUoKTtcbiAgICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICQodGhpcykuYWZ0ZXIoJChcIjxsYWJlbCAvPlwiKS50ZXh0KHZhbCkpO1xuICAgICAgfSk7XG4gICAgICAkKFwiLml2dS1kYXRlLXBpY2tlci1lZGl0b3JcIikuZmluZChcIi5pdnUtaWNvblwiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpb1wiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpby1ncm91cC1pdGVtXCIpLmhpZGUoKTtcbiAgICAgICQoXCIuaXZ1LXJhZGlvLXdyYXBwZXItY2hlY2tlZFwiKS5zaG93KCk7XG4gICAgICAkKFwiLml2dS1yYWRpby13cmFwcGVyLWNoZWNrZWRcIikuZmluZChcInNwYW5cIikuaGlkZSgpO1xuICAgICAgJChcInRleHRhcmVhXCIpLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAkKHRoaXMpLmhpZGUoKTtcbiAgICAgICAgdmFyIHZhbCA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICQodGhpcykuYWZ0ZXIoJChcIjxsYWJlbCAvPlwiKS50ZXh0KHZhbCkpO1xuICAgICAgfSk7XG4gICAgfSwgMTAwKTtcbiAgfSxcbiAgT3ZlcnJpZGVPYmplY3RWYWx1ZTogZnVuY3Rpb24gT3ZlcnJpZGVPYmplY3RWYWx1ZShzb3VyY2VPYmplY3QsIGRhdGFPYmplY3QpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlT2JqZWN0KSB7XG4gICAgICBpZiAoZGF0YU9iamVjdFtrZXldICE9IHVuZGVmaW5lZCAmJiBkYXRhT2JqZWN0W2tleV0gIT0gbnVsbCAmJiBkYXRhT2JqZWN0W2tleV0gIT0gXCJcIikge1xuICAgICAgICBzb3VyY2VPYmplY3Rba2V5XSA9IGRhdGFPYmplY3Rba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIE92ZXJyaWRlT2JqZWN0VmFsdWVGdWxsOiBmdW5jdGlvbiBPdmVycmlkZU9iamVjdFZhbHVlRnVsbChzb3VyY2VPYmplY3QsIGRhdGFPYmplY3QpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gc291cmNlT2JqZWN0KSB7XG4gICAgICBzb3VyY2VPYmplY3Rba2V5XSA9IGRhdGFPYmplY3Rba2V5XTtcbiAgICB9XG4gIH0sXG4gIEJpbmRGb3JtRGF0YTogZnVuY3Rpb24gQmluZEZvcm1EYXRhKGludGVyZmFjZVVybCwgdnVlRm9ybURhdGEsIHJlY29yZElkLCBvcCwgYmVmRnVuYywgYWZGdW5jKSB7XG4gICAgQWpheFV0aWxpdHkuUG9zdChpbnRlcmZhY2VVcmwsIHtcbiAgICAgIHJlY29yZElkOiByZWNvcmRJZCxcbiAgICAgIG9wOiBvcFxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIGJlZkZ1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgYmVmRnVuYyhyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgRGV0YWlsUGFnZVV0aWxpdHkuT3ZlcnJpZGVPYmplY3RWYWx1ZSh2dWVGb3JtRGF0YSwgcmVzdWx0LmRhdGEpO1xuXG4gICAgICAgIGlmICh0eXBlb2YgYWZGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGFmRnVuYyhyZXN1bHQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wID09IFwidmlld1wiKSB7XG4gICAgICAgICAgRGV0YWlsUGFnZVV0aWxpdHkuSVZpZXdQYWdlVG9WaWV3U3RhdHVzKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICB9XG4gICAgfSwgXCJqc29uXCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgRGlhbG9nVXRpbGl0eSA9IHtcbiAgRGlhbG9nQWxlcnRJZDogXCJEZWZhdWx0RGlhbG9nQWxlcnRVdGlsaXR5MDFcIixcbiAgRGlhbG9nUHJvbXB0SWQ6IFwiRGVmYXVsdERpYWxvZ1Byb21wdFV0aWxpdHkwMVwiLFxuICBEaWFsb2dJZDogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTAxXCIsXG4gIERpYWxvZ0lkMDI6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwMlwiLFxuICBEaWFsb2dJZDAzOiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDNcIixcbiAgRGlhbG9nSWQwNDogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTA0XCIsXG4gIERpYWxvZ0lkMDU6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwNVwiLFxuICBfR2V0RWxlbTogZnVuY3Rpb24gX0dldEVsZW0oZGlhbG9nSWQpIHtcbiAgICByZXR1cm4gJChcIiNcIiArIGRpYWxvZ0lkKTtcbiAgfSxcbiAgX0NyZWF0ZURpYWxvZ0VsZW06IGZ1bmN0aW9uIF9DcmVhdGVEaWFsb2dFbGVtKGRvY29iaiwgZGlhbG9nSWQpIHtcbiAgICBpZiAodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkubGVuZ3RoID09IDApIHtcbiAgICAgIHZhciBkaWFsb2dFbGUgPSAkKFwiPGRpdiBpZD1cIiArIGRpYWxvZ0lkICsgXCIgdGl0bGU9J+ezu+e7n+aPkOekuicgc3R5bGU9J2Rpc3BsYXk6bm9uZSc+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAkKGRvY29iai5ib2R5KS5hcHBlbmQoZGlhbG9nRWxlKTtcbiAgICAgIHJldHVybiBkaWFsb2dFbGU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKTtcbiAgICB9XG4gIH0sXG4gIF9DcmVhdGVBbGVydExvYWRpbmdNc2dFbGVtZW50OiBmdW5jdGlvbiBfQ3JlYXRlQWxlcnRMb2FkaW5nTXNnRWxlbWVudChkb2NvYmosIGRpYWxvZ0lkKSB7XG4gICAgaWYgKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICB2YXIgZGlhbG9nRWxlID0gJChcIjxkaXYgaWQ9XCIgKyBkaWFsb2dJZCArIFwiIHRpdGxlPSfns7vnu5/mj5DnpLonIHN0eWxlPSdkaXNwbGF5Om5vbmUnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPSdhbGVydGxvYWRpbmctaW1nJz48L2Rpdj5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nYWxlcnRsb2FkaW5nLXR4dCc+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICAgJChkb2NvYmouYm9keSkuYXBwZW5kKGRpYWxvZ0VsZSk7XG4gICAgICByZXR1cm4gZGlhbG9nRWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fR2V0RWxlbShkaWFsb2dJZCk7XG4gICAgfVxuICB9LFxuICBfQ3JlYXRlSWZybWFlRGlhbG9nRWxlbWVudDogZnVuY3Rpb24gX0NyZWF0ZUlmcm1hZURpYWxvZ0VsZW1lbnQoZG9jb2JqLCBkaWFsb2dpZCwgdXJsKSB7XG4gICAgdmFyIGRpYWxvZ0VsZSA9ICQoXCI8ZGl2IGlkPVwiICsgZGlhbG9naWQgKyBcIiB0aXRsZT0nQmFzaWMgZGlhbG9nJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aWZyYW1lIG5hbWU9J2RpYWxvZ0lmcmFtZScgd2lkdGg9JzEwMCUnIGhlaWdodD0nOTglJyBmcmFtZWJvcmRlcj0nMCc+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9pZnJhbWU+XFxcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgJChkb2NvYmouYm9keSkuYXBwZW5kKGRpYWxvZ0VsZSk7XG4gICAgcmV0dXJuIGRpYWxvZ0VsZTtcbiAgfSxcbiAgX1Rlc3REaWFsb2dFbGVtSXNFeGlzdDogZnVuY3Rpb24gX1Rlc3REaWFsb2dFbGVtSXNFeGlzdChkaWFsb2dJZCkge1xuICAgIGlmICh0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIF9UZXN0UnVuRW5hYmxlOiBmdW5jdGlvbiBfVGVzdFJ1bkVuYWJsZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcbiAgQWxlcnRFcnJvcjogZnVuY3Rpb24gQWxlcnRFcnJvcihvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxtc2csIHNGdW5jKSB7XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgIHdpZHRoOiA2MDBcbiAgICB9O1xuICAgIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICB0aGlzLkFsZXJ0KG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGRlZmF1bHRDb25maWcsIGh0bWxtc2csIHNGdW5jKTtcbiAgfSxcbiAgQWxlcnRUZXh0OiBmdW5jdGlvbiBBbGVydFRleHQodGV4dCkge1xuICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCB0ZXh0LCBudWxsKTtcbiAgfSxcbiAgQWxlcnQ6IGZ1bmN0aW9uIEFsZXJ0KG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbG1zZywgc0Z1bmMpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKG9wZXJlcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIHRpdGxlOiBcIuezu+e7n+aPkOekulwiLFxuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgYnV0dG9uczoge1xuICAgICAgICBcIuWFs+mXrVwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHt9LFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKCkge1xuICAgICAgICBpZiAoc0Z1bmMpIHtcbiAgICAgICAgICBzRnVuYygpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQoaHRtbEVsZW0pLmh0bWwoaHRtbG1zZyk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBBbGVydEpzb25Db2RlOiBmdW5jdGlvbiBBbGVydEpzb25Db2RlKGpzb24pIHtcbiAgICBqc29uID0gSnNvblV0aWxpdHkuSnNvblRvU3RyaW5nRm9ybWF0KGpzb24pO1xuICAgIGpzb24gPSBqc29uLnJlcGxhY2UoLyYvZywgJyYnKS5yZXBsYWNlKC88L2csICc8JykucmVwbGFjZSgvPi9nLCAnPicpO1xuICAgIGpzb24gPSBqc29uLnJlcGxhY2UoLyhcIihcXFxcdVthLXpBLVowLTldezR9fFxcXFxbXnVdfFteXFxcXFwiXSkqXCIoXFxzKjopP3xcXGIodHJ1ZXxmYWxzZXxudWxsKVxcYnwtP1xcZCsoPzpcXC5cXGQqKT8oPzpbZUVdWytcXC1dP1xcZCspPykvZywgZnVuY3Rpb24gKG1hdGNoKSB7XG4gICAgICB2YXIgY2xzID0gJ2pzb24tbnVtYmVyJztcblxuICAgICAgaWYgKC9eXCIvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIGlmICgvOiQvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgICAgY2xzID0gJ2pzb24ta2V5JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjbHMgPSAnanNvbi1zdHJpbmcnO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKC90cnVlfGZhbHNlLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBjbHMgPSAnanNvbi1ib29sZWFuJztcbiAgICAgIH0gZWxzZSBpZiAoL251bGwvLnRlc3QobWF0Y2gpKSB7XG4gICAgICAgIGNscyA9ICdqc29uLW51bGwnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gJzxzcGFuIGNsYXNzPVwiJyArIGNscyArICdcIj4nICsgbWF0Y2ggKyAnPC9zcGFuPic7XG4gICAgfSk7XG5cbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKHdpbmRvdy5kb2N1bWVudC5ib2R5LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQpO1xuXG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgIHdpZHRoOiA5MDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLlhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCLlpI3liLblubblhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICBCYXNlVXRpbGl0eS5Db3B5VmFsdWVDbGlwYm9hcmQoJChcIi5qc29uLXByZVwiKS50ZXh0KCkpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHt9LFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKCkge31cbiAgICB9O1xuICAgICQoaHRtbEVsZW0pLmh0bWwoXCI8ZGl2IGlkPSdwc2NvbnRhaW5lcicgc3R5bGU9J3dpZHRoOiAxMDAlO2hlaWdodDogMTAwJTtvdmVyZmxvdzogYXV0bztwb3NpdGlvbjogcmVsYXRpdmU7Jz48cHJlIGNsYXNzPSdqc29uLXByZSc+XCIgKyBqc29uICsgXCI8L3ByZT48L2Rpdj5cIik7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICAgIHZhciBwcyA9IG5ldyBQZXJmZWN0U2Nyb2xsYmFyKCcjcHNjb250YWluZXInKTtcbiAgfSxcbiAgU2hvd0hUTUw6IGZ1bmN0aW9uIFNob3dIVE1MKG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbG1zZywgY2xvc2VfYWZ0ZXJfZXZlbnQsIHBhcmFtcykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlcmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIGNsb3NlX2FmdGVyX2V2ZW50KHBhcmFtcyk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxtc2cpO1xuICAgIHJldHVybiAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIEFsZXJ0TG9hZGluZzogZnVuY3Rpb24gQWxlcnRMb2FkaW5nKG9wZXJlcldpbmRvdywgZGlhbG9nSWQsIGNvbmZpZywgaHRtbG1zZykge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQob3BlcmVyV2luZG93LmRvY3VtZW50LmJvZHksIGRpYWxvZ0lkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWVcbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuZmluZChcIi5hbGVydGxvYWRpbmctdHh0XCIpLmh0bWwoaHRtbG1zZyk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBDb25maXJtOiBmdW5jdGlvbiBDb25maXJtKG9wZXJlcldpbmRvdywgaHRtbG1zZywgb2tGbikge1xuICAgIHRoaXMuQ29uZmlybUNvbmZpZyhvcGVyZXJXaW5kb3csIGh0bWxtc2csIG51bGwsIG9rRm4pO1xuICB9LFxuICBDb25maXJtQ29uZmlnOiBmdW5jdGlvbiBDb25maXJtQ29uZmlnKG9wZXJlcldpbmRvdywgaHRtbG1zZywgY29uZmlnLCBva0ZuKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVyZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgXCJBbGVydENvbmZpcm1Nc2dcIik7XG5cbiAgICB2YXIgcGFyYXMgPSBudWxsO1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgb2tmdW5jOiBmdW5jdGlvbiBva2Z1bmMocGFyYXMpIHtcbiAgICAgICAgaWYgKG9rRm4gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIG9rRm4oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBvcGVyZXJXaW5kb3cuY2xvc2UoKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGNhbmNlbGZ1bmM6IGZ1bmN0aW9uIGNhbmNlbGZ1bmMocGFyYXMpIHt9LFxuICAgICAgdmFsaWRhdGVmdW5jOiBmdW5jdGlvbiB2YWxpZGF0ZWZ1bmMocGFyYXMpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgY2xvc2VhZnRlcmZ1bmM6IHRydWUsXG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBpZiAoZGVmYXVsdENvbmZpZy52YWxpZGF0ZWZ1bmMocGFyYXMpKSB7XG4gICAgICAgICAgICB2YXIgciA9IGRlZmF1bHRDb25maWcub2tmdW5jKHBhcmFzKTtcbiAgICAgICAgICAgIHIgPSByID09IG51bGwgPyB0cnVlIDogcjtcblxuICAgICAgICAgICAgaWYgKHIgJiYgZGVmYXVsdENvbmZpZy5jbG9zZWFmdGVyZnVuYykge1xuICAgICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIFwi5Y+W5raIXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgZGVmYXVsdENvbmZpZy5jYW5jZWxmdW5jKHBhcmFzKTtcblxuICAgICAgICAgIGlmIChkZWZhdWx0Q29uZmlnLmNsb3NlYWZ0ZXJmdW5jKSB7XG4gICAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sbXNnKTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gICAgcGFyYXMgPSB7XG4gICAgICBcIkVsZW1lbnRPYmpcIjogaHRtbEVsZW1cbiAgICB9O1xuICB9LFxuICBQcm9tcHQ6IGZ1bmN0aW9uIFByb21wdChvcGVyZXJXaW5kb3csIGNvbmZpZywgZGlhbG9nSWQsIGxhYmVsTXNnLCBva0Z1bmMpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKG9wZXJlcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgcGFyYXMgPSBudWxsO1xuICAgIHZhciB0ZXh0QXJlYSA9ICQoXCI8dGV4dGFyZWEgLz5cIik7XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLnoa7orqRcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICBpZiAodHlwZW9mIG9rRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHZhciBpbnB1dFRleHQgPSB0ZXh0QXJlYS52YWwoKTtcbiAgICAgICAgICAgIG9rRnVuYyhpbnB1dFRleHQpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9LFxuICAgICAgICBcIuWPlua2iFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgICQoaHRtbEVsZW0pLmRpYWxvZyhcImNsb3NlXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQodGV4dEFyZWEpLmNzcyhcImhlaWdodFwiLCBkZWZhdWx0Q29uZmlnLmhlaWdodCAtIDEzMCkuY3NzKFwid2lkdGhcIiwgXCIxMDAlXCIpO1xuICAgIHZhciBodG1sQ29udGVudCA9ICQoXCI8ZGl2PjxkaXYgc3R5bGU9J3dpZHRoOiAxMDAlJz5cIiArIGxhYmVsTXNnICsgXCLvvJo8L2Rpdj48L2Rpdj5cIikuYXBwZW5kKHRleHRBcmVhKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxDb250ZW50KTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIERpYWxvZ0VsZW06IGZ1bmN0aW9uIERpYWxvZ0VsZW0oZWxlbUlkLCBjb25maWcpIHtcbiAgICAkKFwiI1wiICsgZWxlbUlkKS5kaWFsb2coY29uZmlnKTtcbiAgfSxcbiAgT3BlbklmcmFtZVdpbmRvdzogZnVuY3Rpb24gT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIHZhciBkZWZhdWx0b3B0aW9ucyA9IHtcbiAgICAgIGhlaWdodDogNDEwLFxuICAgICAgd2lkdGg6IDYwMCxcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZShldmVudCwgdWkpIHtcbiAgICAgICAgdmFyIGF1dG9kaWFsb2dpZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAkKHRoaXMpLmZpbmQoXCJpZnJhbWVcIikucmVtb3ZlKCk7XG4gICAgICAgICQodGhpcykuZGlhbG9nKCdjbG9zZScpO1xuICAgICAgICAkKHRoaXMpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gICAgICAgICQoXCIjXCIgKyBhdXRvZGlhbG9naWQpLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmIChCcm93c2VySW5mb1V0aWxpdHkuSXNJRThEb2N1bWVudE1vZGUoKSkge1xuICAgICAgICAgIENvbGxlY3RHYXJiYWdlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZW9mIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAoJChcIiNGb3Jmb2N1c1wiKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkKFwiI0ZvcmZvY3VzXCIpWzBdLmZvY3VzKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH07XG5cbiAgICBpZiAod2h0eXBlID09IDEpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogNjgwLFxuICAgICAgICB3aWR0aDogOTgwXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAyKSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgd2lkdGg6IDgwMFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNCkge1xuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgaGVpZ2h0OiAzODAsXG4gICAgICAgIHdpZHRoOiA0ODBcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDUpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogMTgwLFxuICAgICAgICB3aWR0aDogMzAwXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy53aWR0aCA9PSAwKSB7XG4gICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbC5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgIH1cblxuICAgIGlmIChvcHRpb25zLmhlaWdodCA9PSAwKSB7XG4gICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWwuR2V0UGFnZUhlaWdodCgpIC0gMTA7XG4gICAgfVxuXG4gICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHZhciBhdXRvZGlhbG9naWQgPSBkaWFsb2dJZDtcblxuICAgIHZhciBkaWFsb2dFbGUgPSB0aGlzLl9DcmVhdGVJZnJtYWVEaWFsb2dFbGVtZW50KG9wZW5lcndpbmRvdy5kb2N1bWVudCwgYXV0b2RpYWxvZ2lkLCB1cmwpO1xuXG4gICAgdmFyIGRpYWxvZ09iaiA9ICQoZGlhbG9nRWxlKS5kaWFsb2coZGVmYXVsdG9wdGlvbnMpO1xuICAgIHZhciAkaWZyYW1lb2JqID0gJChkaWFsb2dFbGUpLmZpbmQoXCJpZnJhbWVcIik7XG4gICAgJGlmcmFtZW9iai5hdHRyKHNyYywgdXJsKTtcbiAgICAkaWZyYW1lb2JqWzBdLmNvbnRlbnRXaW5kb3cuRnJhbWVXaW5kb3dJZCA9IGF1dG9kaWFsb2dpZDtcbiAgICAkaWZyYW1lb2JqWzBdLmNvbnRlbnRXaW5kb3cuT3BlbmVyV2luZG93T2JqID0gb3BlbmVyd2luZG93O1xuICAgIHJldHVybiBkaWFsb2dPYmo7XG4gIH0sXG4gIENsb3NlT3BlbklmcmFtZVdpbmRvdzogZnVuY3Rpb24gQ2xvc2VPcGVuSWZyYW1lV2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQpIHtcbiAgICBvcGVuZXJ3aW5kb3cuT3BlbmVyV2luZG93T2JqLkRpYWxvZ1V0aWxpdHkuQ2xvc2VEaWFsb2coZGlhbG9nSWQpO1xuICB9LFxuICBDbG9zZURpYWxvZzogZnVuY3Rpb24gQ2xvc2VEaWFsb2coZGlhbG9nSWQpIHtcbiAgICB0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKS5maW5kKFwiaWZyYW1lXCIpLnJlbW92ZSgpO1xuXG4gICAgJCh0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKSkuZGlhbG9nKFwiY2xvc2VcIik7XG5cbiAgICB0cnkge1xuICAgICAgaWYgKCQoXCIjRm9yZm9jdXNcIikubGVuZ3RoID4gMCkge1xuICAgICAgICAkKFwiI0ZvcmZvY3VzXCIpWzBdLmZvY3VzKCk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge31cbiAgfSxcbiAgT3Blbk5ld1dpbmRvdzogZnVuY3Rpb24gT3Blbk5ld1dpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIHZhciB3aWR0aCA9IDA7XG4gICAgdmFyIGhlaWdodCA9IDA7XG5cbiAgICBpZiAob3B0aW9ucykge1xuICAgICAgd2lkdGggPSBvcHRpb25zLndpZHRoO1xuICAgICAgaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG4gICAgfVxuXG4gICAgdmFyIGxlZnQgPSBwYXJzZUludCgoc2NyZWVuLmF2YWlsV2lkdGggLSB3aWR0aCkgLyAyKS50b1N0cmluZygpO1xuICAgIHZhciB0b3AgPSBwYXJzZUludCgoc2NyZWVuLmF2YWlsSGVpZ2h0IC0gaGVpZ2h0KSAvIDIpLnRvU3RyaW5nKCk7XG5cbiAgICBpZiAod2lkdGgudG9TdHJpbmcoKSA9PSBcIjBcIiAmJiBoZWlnaHQudG9TdHJpbmcoKSA9PSBcIjBcIikge1xuICAgICAgd2lkdGggPSB3aW5kb3cuc2NyZWVuLmF2YWlsV2lkdGggLSAzMDtcbiAgICAgIGhlaWdodCA9IHdpbmRvdy5zY3JlZW4uYXZhaWxIZWlnaHQgLSA2MDtcbiAgICAgIGxlZnQgPSBcIjBcIjtcbiAgICAgIHRvcCA9IFwiMFwiO1xuICAgIH1cblxuICAgIHZhciB3aW5IYW5kbGUgPSB3aW5kb3cub3Blbih1cmwsIFwiXCIsIFwic2Nyb2xsYmFycz1ubyx0b29sYmFyPW5vLG1lbnViYXI9bm8scmVzaXphYmxlPXllcyxjZW50ZXI9eWVzLGhlbHA9bm8sIHN0YXR1cz15ZXMsdG9wPSBcIiArIHRvcCArIFwicHgsbGVmdD1cIiArIGxlZnQgKyBcInB4LHdpZHRoPVwiICsgd2lkdGggKyBcInB4LGhlaWdodD1cIiArIGhlaWdodCArIFwicHhcIik7XG5cbiAgICBpZiAod2luSGFuZGxlID09IG51bGwpIHtcbiAgICAgIGFsZXJ0KFwi6K+36Kej6Zmk5rWP6KeI5Zmo5a+55pys57O757uf5by55Ye656qX5Y+j55qE6Zi75q2i6K6+572u77yBXCIpO1xuICAgIH1cbiAgfSxcbiAgX1RyeUdldFBhcmVudFdpbmRvdzogZnVuY3Rpb24gX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pIHtcbiAgICBpZiAod2luLnBhcmVudCAhPSBudWxsKSB7XG4gICAgICByZXR1cm4gd2luLnBhcmVudDtcbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqOiBmdW5jdGlvbiBfRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKSB7XG4gICAgaWYgKHRyeWZpbmR0aW1lID4gY3VycmVudHRyeWZpbmR0aW1lKSB7XG4gICAgICB2YXIgaXN0b3BGcmFtZXBhZ2UgPSBmYWxzZTtcbiAgICAgIGN1cnJlbnR0cnlmaW5kdGltZSsrO1xuXG4gICAgICB0cnkge1xuICAgICAgICBpc3RvcEZyYW1lcGFnZSA9IHdpbi5Jc1RvcEZyYW1lUGFnZTtcblxuICAgICAgICBpZiAoaXN0b3BGcmFtZXBhZ2UpIHtcbiAgICAgICAgICByZXR1cm4gd2luO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLl9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih0aGlzLl9UcnlHZXRQYXJlbnRXaW5kb3cod2luKSwgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKHRoaXMuX1RyeUdldFBhcmVudFdpbmRvdyh3aW4pLCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcbiAgX09wZW5XaW5kb3dJbkZyYW1lUGFnZTogZnVuY3Rpb24gX09wZW5XaW5kb3dJbkZyYW1lUGFnZShvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIGlmIChTdHJpbmdVdGlsaXR5LklzTnVsbE9yRW1wdHkoZGlhbG9nSWQpKSB7XG4gICAgICBhbGVydChcImRpYWxvZ0lk5LiN6IO95Li656m6XCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHVybCA9IEJhc2VVdGlsaXR5LkFwcGVuZFRpbWVTdGFtcFVybCh1cmwpO1xuICAgIHZhciBhdXRvZGlhbG9naWQgPSBcIkZyYW1lRGlhbG9nRWxlXCIgKyBkaWFsb2dJZDtcblxuICAgIGlmICgkKHRoaXMuRnJhbWVQYWdlUmVmLmRvY3VtZW50KS5maW5kKFwiI1wiICsgYXV0b2RpYWxvZ2lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgdmFyIGRpYWxvZ0VsZSA9IHRoaXMuX0NyZWF0ZUlmcm1hZURpYWxvZ0VsZW1lbnQodGhpcy5GcmFtZVBhZ2VSZWYuZG9jdW1lbnQsIGF1dG9kaWFsb2dpZCwgdXJsKTtcblxuICAgICAgdmFyIGRlZmF1bHRvcHRpb25zID0ge1xuICAgICAgICBoZWlnaHQ6IDQwMCxcbiAgICAgICAgd2lkdGg6IDYwMCxcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIuezu+e7n1wiLFxuICAgICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgICAgdmFyIGF1dG9kaWFsb2dpZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICAgICQodGhpcykuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgICAkKHRoaXMpLmRpYWxvZyhcImRlc3Ryb3lcIik7XG4gICAgICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dpZCkucmVtb3ZlKCk7XG5cbiAgICAgICAgICBpZiAoQnJvd3NlckluZm9VdGlsaXR5LklzSUU4RG9jdW1lbnRNb2RlKCkpIHtcbiAgICAgICAgICAgIENvbGxlY3RHYXJiYWdlKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgaWYgKHdodHlwZSA9PSAwKSB7XG4gICAgICAgIG9wdGlvbnMud2lkdGggPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VXaWR0aCgpIC0gMjA7XG4gICAgICAgIG9wdGlvbnMuaGVpZ2h0ID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlSGVpZ2h0KCkgLSAxODA7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAxKSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiA2ODAsXG4gICAgICAgICAgd2lkdGg6IDk4MFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDIpIHtcbiAgICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgICBoZWlnaHQ6IDYwMCxcbiAgICAgICAgICB3aWR0aDogODAwXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNCkge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICAgIHdpZHRoOiA0ODBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA1KSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiAxODAsXG4gICAgICAgICAgd2lkdGg6IDMwMFxuICAgICAgICB9KTtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMud2lkdGggPT0gMCkge1xuICAgICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5oZWlnaHQgPT0gMCkge1xuICAgICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTgwO1xuICAgICAgfVxuXG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAkKGRpYWxvZ0VsZSkuZGlhbG9nKGRlZmF1bHRvcHRpb25zKTtcbiAgICAgICQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIFwiMjAwMFwiKTtcbiAgICAgICQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCBcIjIwMDFcIik7XG4gICAgICB2YXIgJGlmcmFtZW9iaiA9ICQoZGlhbG9nRWxlKS5maW5kKFwiaWZyYW1lXCIpO1xuICAgICAgJGlmcmFtZW9iai5vbihcImxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoU3RyaW5nVXRpbGl0eS5Jc1NhbWVPcmdpbih3aW5kb3cubG9jYXRpb24uaHJlZiwgdXJsKSkge1xuICAgICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5GcmFtZVdpbmRvd0lkID0gYXV0b2RpYWxvZ2lkO1xuICAgICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5PcGVuZXJXaW5kb3dPYmogPSBvcGVuZXJ3aW5kb3c7XG4gICAgICAgICAgdGhpcy5jb250ZW50V2luZG93LklzT3BlbkZvckZyYW1lID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhcIui3qOWfn0lmcmFtZSzml6Dms5Xorr7nva7lsZ7mgKchXCIpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgICRpZnJhbWVvYmouYXR0cihcInNyY1wiLCB1cmwpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKFwiI1wiICsgYXV0b2RpYWxvZ2lkKS5kaWFsb2coXCJtb3ZlVG9Ub3BcIik7XG4gICAgfVxuICB9LFxuICBfRnJhbWVfRnJhbWVQYWdlQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIF9GcmFtZV9GcmFtZVBhZ2VDbG9zZURpYWxvZyhkaWFsb2dpZCkge1xuICAgICQoXCIjXCIgKyBkaWFsb2dpZCkuZGlhbG9nKFwiY2xvc2VcIik7XG4gIH0sXG4gIEZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqOiBmdW5jdGlvbiBGcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaigpIHtcbiAgICB2YXIgdHJ5ZmluZHRpbWUgPSA1O1xuICAgIHZhciBjdXJyZW50dHJ5ZmluZHRpbWUgPSAxO1xuICAgIHJldHVybiB0aGlzLl9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih3aW5kb3csIHRyeWZpbmR0aW1lLCBjdXJyZW50dHJ5ZmluZHRpbWUpO1xuICB9LFxuICBGcmFtZV9BbGVydDogZnVuY3Rpb24gRnJhbWVfQWxlcnQoKSB7fSxcbiAgRnJhbWVfQ29tZmlybTogZnVuY3Rpb24gRnJhbWVfQ29tZmlybSgpIHt9LFxuICBGcmFtZV9PcGVuSWZyYW1lV2luZG93OiBmdW5jdGlvbiBGcmFtZV9PcGVuSWZyYW1lV2luZG93KG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKSB7XG4gICAgaWYgKHVybCA9PSBcIlwiKSB7XG4gICAgICBhbGVydChcInVybOS4jeiDveS4uuepuuWtl+espuS4siFcIik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdmFyIHdyd2luID0gdGhpcy5GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaigpO1xuICAgIHRoaXMuRnJhbWVQYWdlUmVmID0gd3J3aW47XG5cbiAgICBpZiAod3J3aW4gIT0gbnVsbCkge1xuICAgICAgdGhpcy5GcmFtZVBhZ2VSZWYuRGlhbG9nVXRpbGl0eS5GcmFtZVBhZ2VSZWYgPSB3cndpbjtcblxuICAgICAgdGhpcy5GcmFtZVBhZ2VSZWYuRGlhbG9nVXRpbGl0eS5fT3BlbldpbmRvd0luRnJhbWVQYWdlKG9wZW5lcndpbmRvdywgZGlhbG9nSWQsIHVybCwgb3B0aW9ucywgd2h0eXBlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYWxlcnQoXCLmib7kuI3liLBGcmFtZVBhZ2UhIVwiKTtcbiAgICB9XG4gIH0sXG4gIEZyYW1lX0Nsb3NlRGlhbG9nOiBmdW5jdGlvbiBGcmFtZV9DbG9zZURpYWxvZyhvcGVyZXJXaW5kb3cpIHtcbiAgICB2YXIgd3J3aW4gPSB0aGlzLkZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKCk7XG4gICAgdmFyIG9wZW5lcndpbiA9IG9wZXJlcldpbmRvdy5PcGVuZXJXaW5kb3dPYmo7XG4gICAgdmFyIGF1dG9kaWFsb2dpZCA9IG9wZXJlcldpbmRvdy5GcmFtZVdpbmRvd0lkO1xuXG4gICAgd3J3aW4uRGlhbG9nVXRpbGl0eS5fRnJhbWVfRnJhbWVQYWdlQ2xvc2VEaWFsb2coYXV0b2RpYWxvZ2lkKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERpY3Rpb25hcnlVdGlsaXR5ID0ge1xuICBfR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uOiBudWxsLFxuICBHcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb246IGZ1bmN0aW9uIEdyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbihzb3VyY2VEaWN0aW9uYXJ5SnNvbikge1xuICAgIGlmICh0aGlzLl9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24gPT0gbnVsbCkge1xuICAgICAgaWYgKHNvdXJjZURpY3Rpb25hcnlKc29uICE9IG51bGwpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xuXG4gICAgICAgIGZvciAodmFyIGdyb3VwVmFsdWUgaW4gc291cmNlRGljdGlvbmFyeUpzb24pIHtcbiAgICAgICAgICByZXN1bHRbZ3JvdXBWYWx1ZV0gPSB7fTtcblxuICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHJlc3VsdFtncm91cFZhbHVlXVtzb3VyY2VEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtpXS5kaWN0VmFsdWVdID0gc291cmNlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1baV0uZGljdFRleHQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uID0gcmVzdWx0O1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb247XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBjb25zb2xlID0gY29uc29sZSB8fCB7XG4gIGxvZzogZnVuY3Rpb24gbG9nKCkge30sXG4gIHdhcm46IGZ1bmN0aW9uIHdhcm4oKSB7fSxcbiAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKCkge31cbn07XG5cbmZ1bmN0aW9uIERhdGVFeHRlbmRfRGF0ZUZvcm1hdChkYXRlLCBmbXQpIHtcbiAgaWYgKG51bGwgPT0gZGF0ZSB8fCB1bmRlZmluZWQgPT0gZGF0ZSkgcmV0dXJuICcnO1xuICB2YXIgbyA9IHtcbiAgICBcIk0rXCI6IGRhdGUuZ2V0TW9udGgoKSArIDEsXG4gICAgXCJkK1wiOiBkYXRlLmdldERhdGUoKSxcbiAgICBcImgrXCI6IGRhdGUuZ2V0SG91cnMoKSxcbiAgICBcIm0rXCI6IGRhdGUuZ2V0TWludXRlcygpLFxuICAgIFwicytcIjogZGF0ZS5nZXRTZWNvbmRzKCksXG4gICAgXCJTXCI6IGRhdGUuZ2V0TWlsbGlzZWNvbmRzKClcbiAgfTtcbiAgaWYgKC8oeSspLy50ZXN0KGZtdCkpIGZtdCA9IGZtdC5yZXBsYWNlKFJlZ0V4cC4kMSwgKGRhdGUuZ2V0RnVsbFllYXIoKSArIFwiXCIpLnN1YnN0cig0IC0gUmVnRXhwLiQxLmxlbmd0aCkpO1xuXG4gIGZvciAodmFyIGsgaW4gbykge1xuICAgIGlmIChuZXcgUmVnRXhwKFwiKFwiICsgayArIFwiKVwiKS50ZXN0KGZtdCkpIGZtdCA9IGZtdC5yZXBsYWNlKFJlZ0V4cC4kMSwgUmVnRXhwLiQxLmxlbmd0aCA9PSAxID8gb1trXSA6IChcIjAwXCIgKyBvW2tdKS5zdWJzdHIoKFwiXCIgKyBvW2tdKS5sZW5ndGgpKTtcbiAgfVxuXG4gIHJldHVybiBmbXQ7XG59XG5cbkRhdGUucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIERhdGVFeHRlbmRfRGF0ZUZvcm1hdCh0aGlzLCAneXl5eS1NTS1kZCBtbTpoaDpzcycpO1xufTtcblxuaWYgKCFPYmplY3QuY3JlYXRlKSB7XG4gIE9iamVjdC5jcmVhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgYWxlcnQoXCJFeHRlbmQgT2JqZWN0LmNyZWF0ZVwiKTtcblxuICAgIGZ1bmN0aW9uIEYoKSB7fVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChvKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09iamVjdC5jcmVhdGUgaW1wbGVtZW50YXRpb24gb25seSBhY2NlcHRzIG9uZSBwYXJhbWV0ZXIuJyk7XG4gICAgICB9XG5cbiAgICAgIEYucHJvdG90eXBlID0gbztcbiAgICAgIHJldHVybiBuZXcgRigpO1xuICAgIH07XG4gIH0oKTtcbn1cblxuJC5mbi5vdXRlckhUTUwgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiAhdGhpcy5sZW5ndGggPyB0aGlzIDogdGhpc1swXS5vdXRlckhUTUwgfHwgZnVuY3Rpb24gKGVsKSB7XG4gICAgdmFyIGRpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRpdi5hcHBlbmRDaGlsZChlbC5jbG9uZU5vZGUodHJ1ZSkpO1xuICAgIHZhciBjb250ZW50cyA9IGRpdi5pbm5lckhUTUw7XG4gICAgZGl2ID0gbnVsbDtcbiAgICBhbGVydChjb250ZW50cyk7XG4gICAgcmV0dXJuIGNvbnRlbnRzO1xuICB9KHRoaXNbMF0pO1xufTtcblxuZnVuY3Rpb24gcmVmQ3NzTGluayhocmVmKSB7XG4gIHZhciBoZWFkID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gIHN0eWxlLnR5cGUgPSAndGV4dC9jc3MnO1xuICBzdHlsZS5yZWwgPSAnc3R5bGVzaGVldCc7XG4gIHN0eWxlLmhyZWYgPSBocmVmO1xuICBoZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcbiAgcmV0dXJuIHN0eWxlLnNoZWV0IHx8IHN0eWxlLnN0eWxlU2hlZXQ7XG59IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBKc29uVXRpbGl0eSA9IHtcbiAgUGFyc2VBcnJheUpzb25Ub1RyZWVKc29uOiBmdW5jdGlvbiBQYXJzZUFycmF5SnNvblRvVHJlZUpzb24oY29uZmlnLCBzb3VyY2VBcnJheSwgcm9vdElkKSB7XG4gICAgdmFyIF9jb25maWcgPSB7XG4gICAgICBLZXlGaWVsZDogXCJcIixcbiAgICAgIFJlbGF0aW9uRmllbGQ6IFwiXCIsXG4gICAgICBDaGlsZEZpZWxkTmFtZTogXCJcIlxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBGaW5kSnNvbkJ5SWQoa2V5RmllbGQsIGlkKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZUFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChzb3VyY2VBcnJheVtpXVtrZXlGaWVsZF0gPT0gaWQpIHtcbiAgICAgICAgICByZXR1cm4gc291cmNlQXJyYXlbaV07XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgYWxlcnQoXCJQYXJzZUFycmF5SnNvblRvVHJlZUpzb24uRmluZEpzb25CeUlkOuWcqHNvdXJjZUFycmF55Lit5om+5LiN5Yiw5oyH5a6aSWTnmoTorrDlvZVcIik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRmluZENoaWxkSnNvbihyZWxhdGlvbkZpZWxkLCBwaWQpIHtcbiAgICAgIHZhciByZXN1bHQgPSBbXTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc291cmNlQXJyYXlbaV1bcmVsYXRpb25GaWVsZF0gPT0gcGlkKSB7XG4gICAgICAgICAgcmVzdWx0LnB1c2goc291cmNlQXJyYXlbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gRmluZENoaWxkTm9kZUFuZFBhcnNlKHBpZCwgcmVzdWx0KSB7XG4gICAgICB2YXIgY2hpbGRqc29ucyA9IEZpbmRDaGlsZEpzb24oY29uZmlnLlJlbGF0aW9uRmllbGQsIHBpZCk7XG5cbiAgICAgIGlmIChjaGlsZGpzb25zLmxlbmd0aCA+IDApIHtcbiAgICAgICAgaWYgKHJlc3VsdFtjb25maWcuQ2hpbGRGaWVsZE5hbWVdID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJlc3VsdFtjb25maWcuQ2hpbGRGaWVsZE5hbWVdID0gW107XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkanNvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICB2YXIgdG9PYmogPSB7fTtcbiAgICAgICAgICB0b09iaiA9IEpzb25VdGlsaXR5LlNpbXBsZUNsb25lQXR0cih0b09iaiwgY2hpbGRqc29uc1tpXSk7XG4gICAgICAgICAgcmVzdWx0W2NvbmZpZy5DaGlsZEZpZWxkTmFtZV0ucHVzaCh0b09iaik7XG4gICAgICAgICAgdmFyIGlkID0gdG9PYmpbY29uZmlnLktleUZpZWxkXTtcbiAgICAgICAgICBGaW5kQ2hpbGROb2RlQW5kUGFyc2UoaWQsIHRvT2JqKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHZhciByZXN1bHQgPSB7fTtcbiAgICB2YXIgcm9vdEpzb24gPSBGaW5kSnNvbkJ5SWQoY29uZmlnLktleUZpZWxkLCByb290SWQpO1xuICAgIHJlc3VsdCA9IHRoaXMuU2ltcGxlQ2xvbmVBdHRyKHJlc3VsdCwgcm9vdEpzb24pO1xuICAgIEZpbmRDaGlsZE5vZGVBbmRQYXJzZShyb290SWQsIHJlc3VsdCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgUmVzb2x2ZVNpbXBsZUFycmF5SnNvblRvVHJlZUpzb246IGZ1bmN0aW9uIFJlc29sdmVTaW1wbGVBcnJheUpzb25Ub1RyZWVKc29uKGNvbmZpZywgc291cmNlSnNvbiwgcm9vdE5vZGVJZCkge1xuICAgIGFsZXJ0KFwiSnNvblV0aWxpdHkuUmVzb2x2ZVNpbXBsZUFycmF5SnNvblRvVHJlZUpzb24g5bey5YGc55SoXCIpO1xuICB9LFxuICBTaW1wbGVDbG9uZUF0dHI6IGZ1bmN0aW9uIFNpbXBsZUNsb25lQXR0cih0b09iaiwgZnJvbU9iaikge1xuICAgIGZvciAodmFyIGF0dHIgaW4gZnJvbU9iaikge1xuICAgICAgdG9PYmpbYXR0cl0gPSBmcm9tT2JqW2F0dHJdO1xuICAgIH1cblxuICAgIHJldHVybiB0b09iajtcbiAgfSxcbiAgQ2xvbmVTaW1wbGU6IGZ1bmN0aW9uIENsb25lU2ltcGxlKHNvdXJjZSkge1xuICAgIHZhciBuZXdKc29uID0galF1ZXJ5LmV4dGVuZCh0cnVlLCB7fSwgc291cmNlKTtcbiAgICByZXR1cm4gbmV3SnNvbjtcbiAgfSxcbiAgSnNvblRvU3RyaW5nOiBmdW5jdGlvbiBKc29uVG9TdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gIH0sXG4gIEpzb25Ub1N0cmluZ0Zvcm1hdDogZnVuY3Rpb24gSnNvblRvU3RyaW5nRm9ybWF0KG9iaikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmosIG51bGwsIDIpO1xuICB9LFxuICBTdHJpbmdUb0pzb246IGZ1bmN0aW9uIFN0cmluZ1RvSnNvbihzdHIpIHtcbiAgICByZXR1cm4gZXZhbChcIihcIiArIHN0ciArIFwiKVwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIExpc3RQYWdlVXRpbGl0eSA9IHtcbiAgRGVmYXVsdExpc3RIZWlnaHQ6IGZ1bmN0aW9uIERlZmF1bHRMaXN0SGVpZ2h0KCkge1xuICAgIGlmIChQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSA+IDc4MCkge1xuICAgICAgcmV0dXJuIDY3ODtcbiAgICB9XG5cbiAgICByZXR1cm4gNTAwO1xuICB9LFxuICBEZWZhdWx0TGlzdEhlaWdodF81MDogZnVuY3Rpb24gRGVmYXVsdExpc3RIZWlnaHRfNTAoKSB7XG4gICAgcmV0dXJuIHRoaXMuRGVmYXVsdExpc3RIZWlnaHQoKSAtIDUwO1xuICB9LFxuICBEZWZhdWx0TGlzdEhlaWdodF8xMDA6IGZ1bmN0aW9uIERlZmF1bHRMaXN0SGVpZ2h0XzEwMCgpIHtcbiAgICByZXR1cm4gdGhpcy5EZWZhdWx0TGlzdEhlaWdodCgpIC0gMTAwO1xuICB9LFxuICBHZXRHZW5lcmFsUGFnZUhlaWdodDogZnVuY3Rpb24gR2V0R2VuZXJhbFBhZ2VIZWlnaHQoZml4SGVpZ2h0KSB7XG4gICAgdmFyIHBhZ2VIZWlnaHQgPSBqUXVlcnkoZG9jdW1lbnQpLmhlaWdodCgpO1xuXG4gICAgaWYgKCQoXCIjbGlzdC1zaW1wbGUtc2VhcmNoLXdyYXBcIikubGVuZ3RoID4gMCkge1xuICAgICAgcGFnZUhlaWdodCA9IHBhZ2VIZWlnaHQgLSAkKFwiI2xpc3Qtc2ltcGxlLXNlYXJjaC13cmFwXCIpLm91dGVySGVpZ2h0KCkgKyBmaXhIZWlnaHQgLSAkKFwiI2xpc3QtYnV0dG9uLXdyYXBcIikub3V0ZXJIZWlnaHQoKSAtICQoXCIjbGlzdC1wYWdlci13cmFwXCIpLm91dGVySGVpZ2h0KCkgLSAzMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFnZUhlaWdodCA9IHBhZ2VIZWlnaHQgLSAkKFwiI2xpc3QtYnV0dG9uLXdyYXBcIikub3V0ZXJIZWlnaHQoKSArIGZpeEhlaWdodCAtICgkKFwiI2xpc3QtcGFnZXItd3JhcFwiKS5sZW5ndGggPiAwID8gJChcIiNsaXN0LXBhZ2VyLXdyYXBcIikub3V0ZXJIZWlnaHQoKSA6IDApIC0gMzA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHBhZ2VIZWlnaHQ7XG4gIH0sXG4gIEdldEZpeEhlaWdodDogZnVuY3Rpb24gR2V0Rml4SGVpZ2h0KCkge1xuICAgIHJldHVybiAtNzA7XG4gIH0sXG4gIElWaWV3VGFibGVSZW5kZXJlcjoge1xuICAgIFRvRGF0ZVlZWVlfTU1fREQ6IGZ1bmN0aW9uIFRvRGF0ZVlZWVlfTU1fREQoaCwgZGF0ZXRpbWUpIHtcbiAgICAgIHZhciBkYXRlID0gbmV3IERhdGUoZGF0ZXRpbWUpO1xuICAgICAgdmFyIGRhdGVTdHIgPSBEYXRlVXRpbGl0eS5Gb3JtYXQoZGF0ZSwgJ3l5eXktTU0tZGQnKTtcbiAgICAgIHJldHVybiBoKCdkaXYnLCBkYXRlU3RyKTtcbiAgICB9LFxuICAgIFN0cmluZ1RvRGF0ZVlZWVlfTU1fREQ6IGZ1bmN0aW9uIFN0cmluZ1RvRGF0ZVlZWVlfTU1fREQoaCwgZGF0ZXRpbWUpIHtcbiAgICAgIHZhciBkYXRlU3RyID0gZGF0ZXRpbWUuc3BsaXQoXCIgXCIpWzBdO1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIGRhdGVTdHIpO1xuICAgIH0sXG4gICAgVG9TdGF0dXNFbmFibGU6IGZ1bmN0aW9uIFRvU3RhdHVzRW5hYmxlKGgsIHN0YXR1cykge1xuICAgICAgaWYgKHN0YXR1cyA9PSAwKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuemgeeUqFwiKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IDEpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5ZCv55SoXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgVG9ZZXNOb0VuYWJsZTogZnVuY3Rpb24gVG9ZZXNOb0VuYWJsZShoLCBzdGF0dXMpIHtcbiAgICAgIGlmIChzdGF0dXMgPT0gMCkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLlkKZcIik7XG4gICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PSAxKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaYr1wiKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFRvRGljdGlvbmFyeVRleHQ6IGZ1bmN0aW9uIFRvRGljdGlvbmFyeVRleHQoaCwgZGljdGlvbmFyeUpzb24sIGdyb3VwVmFsdWUsIGRpY3Rpb25hcnlWYWx1ZSkge1xuICAgICAgdmFyIHNpbXBsZURpY3Rpb25hcnlKc29uID0gRGljdGlvbmFyeVV0aWxpdHkuR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uKGRpY3Rpb25hcnlKc29uKTtcblxuICAgICAgaWYgKGRpY3Rpb25hcnlWYWx1ZSA9PSBudWxsIHx8IGRpY3Rpb25hcnlWYWx1ZSA9PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIlwiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHNpbXBsZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdICE9IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV0pIHtcbiAgICAgICAgICBpZiAoc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1bZGljdGlvbmFyeVZhbHVlXSkge1xuICAgICAgICAgICAgcmV0dXJuIGgoJ2RpdicsIHNpbXBsZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2RpY3Rpb25hcnlWYWx1ZV0pO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLmib7kuI3liLDoo4XmjaLnmoRURVhUXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLmib7kuI3liLDoo4XmjaLnmoTliIbnu4RcIik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaJvuS4jeWIsOijheaNoueahOWIhue7hFwiKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkOiBmdW5jdGlvbiBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgaWYgKHNlbGVjdGlvblJvd3MgIT0gbnVsbCAmJiBzZWxlY3Rpb25Sb3dzLmxlbmd0aCA+IDApIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge1xuICAgICAgICAgIGZ1bmMoc2VsZWN0aW9uUm93cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieS4remcgOimgeaTjeS9nOeahOihjCFcIiwgbnVsbCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHt9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmU6IGZ1bmN0aW9uIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkT25lKHNlbGVjdGlvblJvd3MpIHtcbiAgICBpZiAoc2VsZWN0aW9uUm93cyAhPSBudWxsICYmIHNlbGVjdGlvblJvd3MubGVuZ3RoID4gMCAmJiBzZWxlY3Rpb25Sb3dzLmxlbmd0aCA9PSAxKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHtcbiAgICAgICAgICBmdW5jKHNlbGVjdGlvblJvd3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCLor7fpgInkuK3pnIDopoHmk43kvZznmoTooYzvvIzmr4/mrKHlj6rog73pgInkuK3kuIDooYwhXCIsIG51bGwpO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7fVxuICAgICAgfTtcbiAgICB9XG4gIH0sXG4gIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzOiBmdW5jdGlvbiBJVmlld0NoYW5nZVNlcnZlclN0YXR1cyh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHN0YXR1c05hbWUsIHBhZ2VBcHBPYmopIHtcbiAgICB2YXIgaWRBcnJheSA9IG5ldyBBcnJheSgpO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxlY3Rpb25Sb3dzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZEFycmF5LnB1c2goc2VsZWN0aW9uUm93c1tpXVtpZEZpZWxkXSk7XG4gICAgfVxuXG4gICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgIGlkczogaWRBcnJheS5qb2luKFwiO1wiKSxcbiAgICAgIHN0YXR1czogc3RhdHVzTmFtZVxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgcGFnZUFwcE9iai5yZWxvYWREYXRhKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfSxcbiAgSVZpZXdNb3ZlRmFjZTogZnVuY3Rpb24gSVZpZXdNb3ZlRmFjZSh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHR5cGUsIHBhZ2VBcHBPYmopIHtcbiAgICB0aGlzLklWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkT25lKHNlbGVjdGlvblJvd3MpLnRoZW4oZnVuY3Rpb24gKHNlbGVjdGlvblJvd3MpIHtcbiAgICAgIEFqYXhVdGlsaXR5LlBvc3QodXJsLCB7XG4gICAgICAgIHJlY29yZElkOiBzZWxlY3Rpb25Sb3dzWzBdW2lkRmllbGRdLFxuICAgICAgICB0eXBlOiB0eXBlXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIHBhZ2VBcHBPYmoucmVsb2FkRGF0YSgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9KTtcbiAgfSxcbiAgSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXNGYWNlOiBmdW5jdGlvbiBJVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2UodXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCBzdGF0dXNOYW1lLCBwYWdlQXBwT2JqKSB7XG4gICAgdGhpcy5JVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZChzZWxlY3Rpb25Sb3dzKS50aGVuKGZ1bmN0aW9uIChzZWxlY3Rpb25Sb3dzKSB7XG4gICAgICBMaXN0UGFnZVV0aWxpdHkuSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXModXJsLCBzZWxlY3Rpb25Sb3dzLCBpZEZpZWxkLCBzdGF0dXNOYW1lLCBwYWdlQXBwT2JqKTtcbiAgICB9KTtcbiAgfSxcbiAgSVZpZXdUYWJsZURlbGV0ZVJvdzogZnVuY3Rpb24gSVZpZXdUYWJsZURlbGV0ZVJvdyh1cmwsIHJlY29yZElkLCBwYWdlQXBwT2JqKSB7XG4gICAgRGlhbG9nVXRpbGl0eS5Db25maXJtKHdpbmRvdywgXCLnoa7orqTopoHliKDpmaTlvZPliY3orrDlvZXlkJfvvJ9cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgICAgcmVjb3JkSWQ6IHJlY29yZElkXG4gICAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5yZWxvYWREYXRhKCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICAgIH1cbiAgICAgIH0sIFwianNvblwiKTtcbiAgICB9KTtcbiAgfSxcbiAgSVZpZXdUYWJsZUxvYWREYXRhU2VhcmNoOiBmdW5jdGlvbiBJVmlld1RhYmxlTG9hZERhdGFTZWFyY2godXJsLCBwYWdlTnVtLCBwYWdlU2l6ZSwgc2VhcmNoQ29uZGl0aW9uLCBwYWdlQXBwT2JqLCBpZEZpZWxkLCBhdXRvU2VsZWN0ZWRPbGRSb3dzLCBzdWNjZXNzRnVuYywgbG9hZERpY3QpIHtcbiAgICBpZiAobG9hZERpY3QgPT0gdW5kZWZpbmVkIHx8IGxvYWREaWN0ID09IG51bGwpIHtcbiAgICAgIGxvYWREaWN0ID0gZmFsc2U7XG4gICAgfVxuXG4gICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgIFwicGFnZU51bVwiOiBwYWdlTnVtLFxuICAgICAgXCJwYWdlU2l6ZVwiOiBwYWdlU2l6ZSxcbiAgICAgIFwic2VhcmNoQ29uZGl0aW9uXCI6IFNlYXJjaFV0aWxpdHkuU2VyaWFsaXphdGlvblNlYXJjaENvbmRpdGlvbihzZWFyY2hDb25kaXRpb24pLFxuICAgICAgXCJsb2FkRGljdFwiOiBsb2FkRGljdFxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBpZiAodHlwZW9mIHN1Y2Nlc3NGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIHN1Y2Nlc3NGdW5jKHJlc3VsdCwgcGFnZUFwcE9iaik7XG4gICAgICAgIH1cblxuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIHBhZ2VBcHBPYmoucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGF1dG9TZWxlY3RlZE9sZFJvd3MpIHtcbiAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZUFwcE9iai50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzW2pdW2lkRmllbGRdID09IHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldW2lkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0RXJyb3Iod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfSxcbiAgSVZpZXdUYWJsZUxvYWREYXRhTm9TZWFyY2g6IGZ1bmN0aW9uIElWaWV3VGFibGVMb2FkRGF0YU5vU2VhcmNoKHVybCwgcGFnZU51bSwgcGFnZVNpemUsIHBhZ2VBcHBPYmosIGlkRmllbGQsIGF1dG9TZWxlY3RlZE9sZFJvd3MsIHN1Y2Nlc3NGdW5jKSB7XG4gICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgIHBhZ2VOdW06IHBhZ2VOdW0sXG4gICAgICBwYWdlU2l6ZTogcGFnZVNpemVcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGEgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGEgPSByZXN1bHQuZGF0YS5saXN0O1xuICAgICAgICBwYWdlQXBwT2JqLnBhZ2VUb3RhbCA9IHJlc3VsdC5kYXRhLnRvdGFsO1xuXG4gICAgICAgIGlmIChhdXRvU2VsZWN0ZWRPbGRSb3dzKSB7XG4gICAgICAgICAgaWYgKHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93cyAhPSBudWxsKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VBcHBPYmoudGFibGVEYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93c1tqXVtpZEZpZWxkXSA9PSBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXVtpZEZpZWxkXSkge1xuICAgICAgICAgICAgICAgICAgcGFnZUFwcE9iai50YWJsZURhdGFbaV0uX2NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2Ygc3VjY2Vzc0Z1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3VjY2Vzc0Z1bmMocmVzdWx0LCBwYWdlQXBwT2JqKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfSxcbiAgSVZpZXdUYWJsZUlubmVyQnV0dG9uOiB7XG4gICAgVmlld0J1dHRvbjogZnVuY3Rpb24gVmlld0J1dHRvbihoLCBwYXJhbXMsIGlkRmllbGQsIHBhZ2VBcHBPYmopIHtcbiAgICAgIHJldHVybiBoKCdkaXYnLCB7XG4gICAgICAgIGNsYXNzOiBcImxpc3Qtcm93LWJ1dHRvbiB2aWV3XCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai52aWV3KHBhcmFtcy5yb3dbaWRGaWVsZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSxcbiAgICBFZGl0QnV0dG9uOiBmdW5jdGlvbiBFZGl0QnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIGVkaXRcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLmVkaXQocGFyYW1zLnJvd1tpZEZpZWxkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIERlbGV0ZUJ1dHRvbjogZnVuY3Rpb24gRGVsZXRlQnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIGRlbFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmouZGVsKHBhcmFtcy5yb3dbaWRGaWVsZF0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgUGFnZVN0eWxlVXRpbGl0eSA9IHtcbiAgR2V0UGFnZUhlaWdodDogZnVuY3Rpb24gR2V0UGFnZUhlaWdodCgpIHtcbiAgICByZXR1cm4galF1ZXJ5KHdpbmRvdy5kb2N1bWVudCkuaGVpZ2h0KCk7XG4gIH0sXG4gIEdldFBhZ2VXaWR0aDogZnVuY3Rpb24gR2V0UGFnZVdpZHRoKCkge1xuICAgIHJldHVybiBqUXVlcnkod2luZG93LmRvY3VtZW50KS53aWR0aCgpO1xuICB9LFxuICBHZXRXaW5kb3dIZWlnaHQ6IGZ1bmN0aW9uIEdldFdpbmRvd0hlaWdodCgpIHtcbiAgICByZXR1cm4gJCh3aW5kb3cpLmhlaWdodCgpO1xuICB9LFxuICBHZXRXaW5kb3dXaWR0aDogZnVuY3Rpb24gR2V0V2luZG93V2lkdGgoKSB7XG4gICAgcmV0dXJuICQod2luZG93KS53aWR0aCgpO1xuICB9LFxuICBHZXRMaXN0QnV0dG9uT3V0ZXJIZWlnaHQ6IGZ1bmN0aW9uIEdldExpc3RCdXR0b25PdXRlckhlaWdodCgpIHtcbiAgICBhbGVydChcIlBhZ2VTdHlsZVV0aWxpdHkuR2V0TGlzdEJ1dHRvbk91dGVySGVpZ2h0IOW3suWBnOeUqFwiKTtcbiAgICByZXR1cm4galF1ZXJ5KFwiLmxpc3QtYnV0dG9uLW91dGVyLWNcIikub3V0ZXJIZWlnaHQoKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNlYXJjaFV0aWxpdHkgPSB7XG4gIFNlYXJjaEZpZWxkVHlwZToge1xuICAgIEludFR5cGU6IFwiSW50VHlwZVwiLFxuICAgIE51bWJlclR5cGU6IFwiTnVtYmVyVHlwZVwiLFxuICAgIERhdGFUeXBlOiBcIkRhdGVUeXBlXCIsXG4gICAgTGlrZVN0cmluZ1R5cGU6IFwiTGlrZVN0cmluZ1R5cGVcIixcbiAgICBMZWZ0TGlrZVN0cmluZ1R5cGU6IFwiTGVmdExpa2VTdHJpbmdUeXBlXCIsXG4gICAgUmlnaHRMaWtlU3RyaW5nVHlwZTogXCJSaWdodExpa2VTdHJpbmdUeXBlXCIsXG4gICAgU3RyaW5nVHlwZTogXCJTdHJpbmdUeXBlXCIsXG4gICAgRGF0YVN0cmluZ1R5cGU6IFwiRGF0ZVN0cmluZ1R5cGVcIixcbiAgICBBcnJheUxpa2VTdHJpbmdUeXBlOiBcIkFycmF5TGlrZVN0cmluZ1R5cGVcIlxuICB9LFxuICBTZXJpYWxpemF0aW9uU2VhcmNoQ29uZGl0aW9uOiBmdW5jdGlvbiBTZXJpYWxpemF0aW9uU2VhcmNoQ29uZGl0aW9uKHNlYXJjaENvbmRpdGlvbikge1xuICAgIHZhciBzZWFyY2hDb25kaXRpb25DbG9uZSA9IEpzb25VdGlsaXR5LkNsb25lU2ltcGxlKHNlYXJjaENvbmRpdGlvbik7XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc2VhcmNoQ29uZGl0aW9uQ2xvbmUpIHtcbiAgICAgIGlmIChzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnR5cGUgPT0gU2VhcmNoVXRpbGl0eS5TZWFyY2hGaWVsZFR5cGUuQXJyYXlMaWtlU3RyaW5nVHlwZSkge1xuICAgICAgICBpZiAoc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSAhPSBudWxsICYmIHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUgPSBzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlLmpvaW4oXCI7XCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUgPSBcIlwiO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHNlYXJjaENvbmRpdGlvbkNsb25lKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEpCdWlsZDREU2VsZWN0VmlldyA9IHtcbiAgU2VsZWN0RW52VmFyaWFibGU6IHtcbiAgICBVUkw6IFwiL1BsYXRGb3JtL1NlbGVjdFZpZXcvU2VsZWN0RW52VmFyaWFibGUvU2VsZWN0XCIsXG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KGluc3RhbmNlTmFtZSkge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHRoaXMuVVJMLCB7XG4gICAgICAgIFwiaW5zdGFuY2VOYW1lXCI6IGluc3RhbmNlTmFtZVxuICAgICAgfSk7XG4gICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup5Y+Y6YePXCIsXG4gICAgICAgIG1vZGFsOiB0cnVlXG4gICAgICB9LCAyKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0SW5GcmFtZTogZnVuY3Rpb24gYmVnaW5TZWxlY3RJbkZyYW1lKG9wZW5lciwgaW5zdGFuY2VOYW1lLCBvcHRpb24pIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLlVSTCwge1xuICAgICAgICBcImluc3RhbmNlTmFtZVwiOiBpbnN0YW5jZU5hbWVcbiAgICAgIH0pO1xuICAgICAgdmFyIG9wdGlvbiA9ICQuZXh0ZW5kKHRydWUsIHt9LCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCLpgInmi6nlj5jph49cIlxuICAgICAgfSwgb3B0aW9uKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXIsIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwNSwgdXJsLCBvcHRpb24sIDEpO1xuICAgICAgJCh3aW5kb3cucGFyZW50LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAkKHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG4gICAgfSxcbiAgICBmb3JtYXRUZXh0OiBmdW5jdGlvbiBmb3JtYXRUZXh0KHR5cGUsIHRleHQpIHtcbiAgICAgIGlmICh0eXBlID09IFwiQ29uc3RcIikge1xuICAgICAgICByZXR1cm4gXCLpnZnmgIHlgLw644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIkRhdGVUaW1lXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi5pel5pyf5pe26Ze0OuOAkFwiICsgdGV4dCArIFwi44CRXCI7XG4gICAgICB9IGVsc2UgaWYgKHR5cGUgPT0gXCJBcGlWYXJcIikge1xuICAgICAgICByZXR1cm4gXCJBUEnlj5jph48644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIk51bWJlckNvZGVcIikge1xuICAgICAgICByZXR1cm4gXCLluo/lj7fnvJbnoIE644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIklkQ29kZXJcIikge1xuICAgICAgICByZXR1cm4gXCLkuLvplK7nlJ/miJA644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIlwiKSB7XG4gICAgICAgIHJldHVybiBcIuOAkOaXoOOAkVwiO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gXCLmnKrnn6XnsbvlnotcIiArIHRleHQ7XG4gICAgfVxuICB9LFxuICBTZWxlY3RCaW5kVG9GaWVsZDoge1xuICAgIFVSTDogXCIvUGxhdEZvcm0vU2VsZWN0Vmlldy9TZWxlY3RCaW5kVG9UYWJsZUZpZWxkL1NlbGVjdFwiLFxuICAgIGJlZ2luU2VsZWN0OiBmdW5jdGlvbiBiZWdpblNlbGVjdChpbnN0YW5jZU5hbWUpIHtcbiAgICAgIHZhciB1cmwgPSB0aGlzLlVSTCArIFwiP2luc3RhbmNlTmFtZT1cIiArIGluc3RhbmNlTmFtZTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB0aXRsZTogXCLpgInmi6nlj5jph49cIixcbiAgICAgICAgbW9kYWw6IHRydWVcbiAgICAgIH0sIDIpO1xuICAgIH0sXG4gICAgYmVnaW5TZWxlY3RJbkZyYW1lOiBmdW5jdGlvbiBiZWdpblNlbGVjdEluRnJhbWUob3BlbmVyLCBpbnN0YW5jZU5hbWUsIG9wdGlvbikge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHRoaXMuVVJMLCB7XG4gICAgICAgIFwiaW5zdGFuY2VOYW1lXCI6IGluc3RhbmNlTmFtZVxuICAgICAgfSk7XG4gICAgICB2YXIgb3B0aW9uID0gJC5leHRlbmQodHJ1ZSwge30sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqee7keWumuWtl+autVwiXG4gICAgICB9LCBvcHRpb24pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KG9wZW5lciwgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZDA1LCB1cmwsIG9wdGlvbiwgMSk7XG4gICAgICAkKHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQpLmZpbmQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIDEwMTAwKTtcbiAgICAgICQod2luZG93LnBhcmVudC5kb2N1bWVudCkuZmluZChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIDEwMTAxKTtcbiAgICB9XG4gIH0sXG4gIFNlbGVjdFZhbGlkYXRlUnVsZToge1xuICAgIFVSTDogXCIvUGxhdEZvcm0vU2VsZWN0Vmlldy9TZWxlY3RWYWxpZGF0ZVJ1bGUvU2VsZWN0XCIsXG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KGluc3RhbmNlTmFtZSkge1xuICAgICAgdmFyIHVybCA9IHRoaXMuVVJMICsgXCI/aW5zdGFuY2VOYW1lPVwiICsgaW5zdGFuY2VOYW1lO1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHRpdGxlOiBcIumqjOivgeinhOWImVwiLFxuICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdEluRnJhbWU6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0SW5GcmFtZShvcGVuZXIsIGluc3RhbmNlTmFtZSwgb3B0aW9uKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24odGhpcy5VUkwsIHtcbiAgICAgICAgXCJpbnN0YW5jZU5hbWVcIjogaW5zdGFuY2VOYW1lXG4gICAgICB9KTtcbiAgICAgIHZhciBvcHRpb24gPSAkLmV4dGVuZCh0cnVlLCB7fSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgdGl0bGU6IFwi6aqM6K+B6KeE5YiZXCJcbiAgICAgIH0sIG9wdGlvbik7XG4gICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cob3BlbmVyLCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkMDUsIHVybCwgb3B0aW9uLCAxKTtcbiAgICAgICQod2luZG93LnBhcmVudC5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgJCh3aW5kb3cucGFyZW50LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgaWYgKHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiKSB7IF90eXBlb2YgPSBmdW5jdGlvbiBfdHlwZW9mKG9iaikgeyByZXR1cm4gdHlwZW9mIG9iajsgfTsgfSBlbHNlIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9OyB9IHJldHVybiBfdHlwZW9mKG9iaik7IH1cblxudmFyIFN0cmluZ1V0aWxpdHkgPSB7XG4gIEd1aWRTcGxpdDogZnVuY3Rpb24gR3VpZFNwbGl0KHNwbGl0KSB7XG4gICAgdmFyIGd1aWQgPSBcIlwiO1xuXG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzI7IGkrKykge1xuICAgICAgZ3VpZCArPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAxNi4wKS50b1N0cmluZygxNik7XG4gICAgICBpZiAoaSA9PSA4IHx8IGkgPT0gMTIgfHwgaSA9PSAxNiB8fCBpID09IDIwKSBndWlkICs9IHNwbGl0O1xuICAgIH1cblxuICAgIHJldHVybiBndWlkO1xuICB9LFxuICBHdWlkOiBmdW5jdGlvbiBHdWlkKCkge1xuICAgIHJldHVybiB0aGlzLkd1aWRTcGxpdChcIi1cIik7XG4gIH0sXG4gIFRpbWVzdGFtcDogZnVuY3Rpb24gVGltZXN0YW1wKCkge1xuICAgIHZhciB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICByZXR1cm4gdGltZXN0YW1wLnRvU3RyaW5nKCkuc3Vic3RyKDQsIDEwKTtcbiAgfSxcbiAgVHJpbTogZnVuY3Rpb24gVHJpbShzdHIpIHtcbiAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyheW+OAgFxcc10qKXwoW+OAgFxcc10qJCkvZywgXCJcIik7XG4gIH0sXG4gIFJlbW92ZUxhc3RDaGFyOiBmdW5jdGlvbiBSZW1vdmVMYXN0Q2hhcihzdHIpIHtcbiAgICByZXR1cm4gc3RyLnN1YnN0cmluZygwLCBzdHIubGVuZ3RoIC0gMSk7XG4gIH0sXG4gIElzTnVsbE9yRW1wdHk6IGZ1bmN0aW9uIElzTnVsbE9yRW1wdHkob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PSB1bmRlZmluZWQgfHwgb2JqID09IFwiXCIgfHwgb2JqID09IG51bGwgfHwgb2JqID09IFwidW5kZWZpbmVkXCIgfHwgb2JqID09IFwibnVsbFwiO1xuICB9LFxuICBHZXRGdW50aW9uTmFtZTogZnVuY3Rpb24gR2V0RnVudGlvbk5hbWUoZnVuYykge1xuICAgIGlmICh0eXBlb2YgZnVuYyA9PSBcImZ1bmN0aW9uXCIgfHwgX3R5cGVvZihmdW5jKSA9PSBcIm9iamVjdFwiKSB2YXIgZk5hbWUgPSAoXCJcIiArIGZ1bmMpLm1hdGNoKC9mdW5jdGlvblxccyooW1xcd1xcJF0qKVxccypcXCgvKTtcbiAgICBpZiAoZk5hbWUgIT09IG51bGwpIHJldHVybiBmTmFtZVsxXTtcbiAgfSxcbiAgVG9Mb3dlckNhc2U6IGZ1bmN0aW9uIFRvTG93ZXJDYXNlKHN0cikge1xuICAgIHJldHVybiBzdHIudG9Mb3dlckNhc2UoKTtcbiAgfSxcbiAgdG9VcHBlckNhc2U6IGZ1bmN0aW9uIHRvVXBwZXJDYXNlKHN0cikge1xuICAgIHJldHVybiBzdHIudG9VcHBlckNhc2UoKTtcbiAgfSxcbiAgRW5kV2l0aDogZnVuY3Rpb24gRW5kV2l0aChzdHIsIGVuZFN0cikge1xuICAgIHZhciBkID0gc3RyLmxlbmd0aCAtIGVuZFN0ci5sZW5ndGg7XG4gICAgcmV0dXJuIGQgPj0gMCAmJiBzdHIubGFzdEluZGV4T2YoZW5kU3RyKSA9PSBkO1xuICB9LFxuICBJc1NhbWVPcmdpbjogZnVuY3Rpb24gSXNTYW1lT3JnaW4odXJsMSwgdXJsMikge1xuICAgIHZhciBvcmlnaW4xID0gL1xcL1xcL1tcXHctLl0rKDpcXGQrKT8vaS5leGVjKHVybDEpWzBdO1xuICAgIHZhciBvcmlnaW4yID0gL1xcL1xcL1tcXHctLl0rKDpcXGQrKT8vaS5leGVjKHVybDIpWzBdO1xuXG4gICAgaWYgKG9yaWdpbjEgPT0gb3JpZ2luMikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgWE1MVXRpbGl0eSA9IHt9OyJdfQ==
