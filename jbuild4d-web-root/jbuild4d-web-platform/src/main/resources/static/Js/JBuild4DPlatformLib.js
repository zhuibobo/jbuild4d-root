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
        }
      },
      open: function open() {},
      close: function close() {}
    };
    $(htmlElem).html("<pre class='json-pre'>" + json + "</pre>");
    $(htmlElem).dialog(defaultConfig);
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
  DefaultListHeight: 678,
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkFqYXhVdGlsaXR5LmpzIiwiQmFzZVV0aWxpdHkuanMiLCJCcm93c2VySW5mb1V0aWxpdHkuanMiLCJDYWNoZURhdGFVdGlsaXR5LmpzIiwiQ29va2llVXRpbGl0eS5qcyIsIkRhdGVVdGlsaXR5LmpzIiwiRGV0YWlsUGFnZVV0aWxpdHkuanMiLCJEaWFsb2dVdGlsaXR5LmpzIiwiRGljdGlvbmFyeVV0aWxpdHkuanMiLCJKQnVpbGQ0REJhc2VMaWIuanMiLCJKc29uVXRpbGl0eS5qcyIsIkxpc3RQYWdlVXRpbGl0eS5qcyIsIlBhZ2VTdHlsZVV0aWxpdHkuanMiLCJTZWFyY2hVdGlsaXR5LmpzIiwiU2VsZWN0Vmlld0xpYi5qcyIsIlN0cmluZ1V0aWxpdHkuanMiLCJYTUxVdGlsaXR5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNWZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBIiwiZmlsZSI6IkpCdWlsZDREUGxhdGZvcm1MaWIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIEFqYXhVdGlsaXR5ID0ge1xuICBQb3N0UmVxdWVzdEJvZHk6IGZ1bmN0aW9uIFBvc3RSZXF1ZXN0Qm9keShfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUpIHtcbiAgICB0aGlzLlBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBcImFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLThcIik7XG4gIH0sXG4gIFBvc3RTeW5jOiBmdW5jdGlvbiBQb3N0U3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGNvbnRlbnRUeXBlKSB7XG4gICAgdmFyIHJlc3VsdCA9IHRoaXMuUG9zdChfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGNvbnRlbnRUeXBlLCBmYWxzZSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSxcbiAgUG9zdDogZnVuY3Rpb24gUG9zdChfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUsIGNvbnRlbnRUeXBlLCBpc0FzeW5jKSB7XG4gICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKF91cmwpO1xuXG4gICAgaWYgKGRhdGFUeXBlID09IHVuZGVmaW5lZCB8fCBkYXRhVHlwZSA9PSBudWxsKSB7XG4gICAgICBkYXRhVHlwZSA9IFwidGV4dFwiO1xuICAgIH1cblxuICAgIGlmIChpc0FzeW5jID09IHVuZGVmaW5lZCB8fCBpc0FzeW5jID09IG51bGwpIHtcbiAgICAgIGlzQXN5bmMgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChjb250ZW50VHlwZSA9PSB1bmRlZmluZWQgfHwgY29udGVudFR5cGUgPT0gbnVsbCkge1xuICAgICAgY29udGVudFR5cGUgPSBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOFwiO1xuICAgIH1cblxuICAgIHZhciBpbm5lclJlc3VsdCA9IG51bGw7XG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgdXJsOiB1cmwsXG4gICAgICBjYWNoZTogZmFsc2UsXG4gICAgICBhc3luYzogaXNBc3luYyxcbiAgICAgIGNvbnRlbnRUeXBlOiBjb250ZW50VHlwZSxcbiAgICAgIGRhdGFUeXBlOiBkYXRhVHlwZSxcbiAgICAgIGRhdGE6IHNlbmREYXRhLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gc3VjY2VzcyhyZXN1bHQpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBpZiAocmVzdWx0ICE9IG51bGwgJiYgcmVzdWx0LnN1Y2Nlc3MgIT0gbnVsbCAmJiAhcmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgICAgIGlmIChyZXN1bHQubWVzc2FnZSA9PSBcIueZu+W9lVNlc3Npb27ov4fmnJ9cIikge1xuICAgICAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgXCJTZXNzaW9u6LaF5pe277yM6K+36YeN5paw55m76ZmG57O757ufXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBCYXNlVXRpbGl0eS5SZWRpcmVjdFRvTG9naW4oKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCJBamF4VXRpbGl0eS5Qb3N0IEV4Y2VwdGlvbiBcIiArIHVybCk7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jKHJlc3VsdCk7XG4gICAgICAgIGlubmVyUmVzdWx0ID0gcmVzdWx0O1xuICAgICAgfSxcbiAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZShtc2cpIHt9LFxuICAgICAgZXJyb3I6IGZ1bmN0aW9uIGVycm9yKG1zZykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmIChtc2cucmVzcG9uc2VUZXh0LmluZGV4T2YoXCLor7fph43mlrDnmbvpmYbns7vnu59cIikgPj0gMCkge1xuICAgICAgICAgICAgQmFzZVV0aWxpdHkuUmVkaXJlY3RUb0xvZ2luKCk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc29sZS5sb2cobXNnKTtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgXCJBamF4VXRpbGl0eS5Qb3N0LkVycm9yXCIsIHt9LCBcIkFqYXjor7fmsYLlj5HnlJ/plJnor6/vvIFcIiArIFwic3RhdHVzOlwiICsgbXNnLnN0YXR1cyArIFwiLHJlc3BvbnNlVGV4dDpcIiArIG1zZy5yZXNwb25zZVRleHQsIG51bGwpO1xuICAgICAgICB9IGNhdGNoIChlKSB7fVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBpbm5lclJlc3VsdDtcbiAgfSxcbiAgR2V0U3luYzogZnVuY3Rpb24gR2V0U3luYyhfdXJsLCBzZW5kRGF0YSwgZnVuYywgZGF0YVR5cGUpIHtcbiAgICB0aGlzLlBvc3QoX3VybCwgc2VuZERhdGEsIGZ1bmMsIGRhdGFUeXBlLCBmYWxzZSk7XG4gIH0sXG4gIEdldDogZnVuY3Rpb24gR2V0KF91cmwsIHNlbmREYXRhLCBmdW5jLCBkYXRhVHlwZSwgaXNBc3luYykge1xuICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZFVybChfdXJsKTtcblxuICAgIGlmIChkYXRhVHlwZSA9PSB1bmRlZmluZWQgfHwgZGF0YVR5cGUgPT0gbnVsbCkge1xuICAgICAgZGF0YVR5cGUgPSBcInRleHRcIjtcbiAgICB9XG5cbiAgICBpZiAoaXNBc3luYyA9PSB1bmRlZmluZWQgfHwgaXNBc3luYyA9PSBudWxsKSB7XG4gICAgICBpc0FzeW5jID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgIHVybDogdXJsLFxuICAgICAgY2FjaGU6IGZhbHNlLFxuICAgICAgYXN5bmM6IGlzQXN5bmMsXG4gICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04XCIsXG4gICAgICBkYXRhVHlwZTogZGF0YVR5cGUsXG4gICAgICBkYXRhOiBzZW5kRGF0YSxcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIHN1Y2Nlc3MocmVzdWx0KSB7XG4gICAgICAgIGZ1bmMocmVzdWx0KTtcbiAgICAgIH0sXG4gICAgICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUobXNnKSB7fSxcbiAgICAgIGVycm9yOiBmdW5jdGlvbiBlcnJvcihtc2cpIHtcbiAgICAgICAgZGVidWdnZXI7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBCYXNlVXRpbGl0eSA9IHtcbiAgR2V0Um9vdFBhdGg6IGZ1bmN0aW9uIEdldFJvb3RQYXRoKCkge1xuICAgIHZhciBmdWxsSHJlZiA9IHdpbmRvdy5kb2N1bWVudC5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBwYXRoTmFtZSA9IHdpbmRvdy5kb2N1bWVudC5sb2NhdGlvbi5wYXRobmFtZTtcbiAgICB2YXIgbGFjID0gZnVsbEhyZWYuaW5kZXhPZihwYXRoTmFtZSk7XG4gICAgdmFyIGxvY2FsaG9zdFBhdGggPSBmdWxsSHJlZi5zdWJzdHJpbmcoMCwgbGFjKTtcbiAgICB2YXIgcHJvamVjdE5hbWUgPSBwYXRoTmFtZS5zdWJzdHJpbmcoMCwgcGF0aE5hbWUuc3Vic3RyKDEpLmluZGV4T2YoJy8nKSArIDEpO1xuICAgIHJldHVybiBsb2NhbGhvc3RQYXRoICsgcHJvamVjdE5hbWU7XG4gIH0sXG4gIFJlcGxhY2VVcmxWYXJpYWJsZTogZnVuY3Rpb24gUmVwbGFjZVVybFZhcmlhYmxlKHNvdXJjZVVybCkge1xuICAgIGFsZXJ0KFwiUmVwbGFjZVVybFZhcmlhYmxl6L+B56e75YiwQnVpbGRBY3Rpb25cIik7XG4gIH0sXG4gIEdldFRvcFdpbmRvdzogZnVuY3Rpb24gR2V0VG9wV2luZG93KCkge1xuICAgIGFsZXJ0KFwiQmFzZVV0aWxpdHkuR2V0VG9wV2luZG93IOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgVHJ5U2V0Q29udHJvbEZvY3VzOiBmdW5jdGlvbiBUcnlTZXRDb250cm9sRm9jdXMoKSB7XG4gICAgYWxlcnQoXCJCYXNlVXRpbGl0eS5UcnlTZXRDb250cm9sRm9jdXMg5bey5YGc55SoXCIpO1xuICB9LFxuICBCdWlsZFVybDogZnVuY3Rpb24gQnVpbGRVcmwodXJsKSB7XG4gICAgYWxlcnQoXCJCYXNlVXRpbGl0eS5CdWlsZFVybCDlt7LlgZznlKhcIik7XG4gIH0sXG4gIEJ1aWxkVmlldzogZnVuY3Rpb24gQnVpbGRWaWV3KGFjdGlvbiwgcGFyYSkge1xuICAgIGlmIChTdHJpbmdVdGlsaXR5LkVuZFdpdGgoYWN0aW9uLCBcIlZpZXdcIikpIHtcbiAgICAgIHJldHVybiB0aGlzLkJ1aWxkQWN0aW9uKGFjdGlvbiwgcGFyYSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRUZXh0KGFjdGlvbiArIFwi6KeG5Zu+VXJs6K+355SoVmlld+S9nOS4uue7k+Wwvi5cIik7XG4gICAgICByZXR1cm4gXCJcIjtcbiAgICB9XG4gIH0sXG4gIEJ1aWxkQWN0aW9uOiBmdW5jdGlvbiBCdWlsZEFjdGlvbihhY3Rpb24sIHBhcmEpIHtcbiAgICB2YXIgdXJsUGFyYSA9IFwiXCI7XG5cbiAgICBpZiAocGFyYSkge1xuICAgICAgdXJsUGFyYSA9ICQucGFyYW0ocGFyYSk7XG4gICAgfVxuXG4gICAgdmFyIF91cmwgPSB0aGlzLkdldFJvb3RQYXRoKCkgKyBhY3Rpb24gKyBcIi5kb1wiO1xuXG4gICAgaWYgKHVybFBhcmEgIT0gXCJcIikge1xuICAgICAgX3VybCArPSBcIj9cIiArIHVybFBhcmE7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuQXBwZW5kVGltZVN0YW1wVXJsKF91cmwpO1xuICB9LFxuICBSZWRpcmVjdFRvTG9naW46IGZ1bmN0aW9uIFJlZGlyZWN0VG9Mb2dpbigpIHtcbiAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuR2V0Um9vdFBhdGgoKSArIFwiL0xvZ2luVmlldy5kb1wiO1xuICAgIHdpbmRvdy5wYXJlbnQucGFyZW50LmxvY2F0aW9uLmhyZWYgPSB1cmw7XG4gIH0sXG4gIEFwcGVuZFRpbWVTdGFtcFVybDogZnVuY3Rpb24gQXBwZW5kVGltZVN0YW1wVXJsKHVybCkge1xuICAgIGlmICh1cmwuaW5kZXhPZihcInRpbWVzdGFtcFwiKSA+IFwiMFwiKSB7XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH1cblxuICAgIHZhciBnZXRUaW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIGlmICh1cmwuaW5kZXhPZihcIj9cIikgPiAtMSkge1xuICAgICAgdXJsID0gdXJsICsgXCImdGltZXN0YW1wPVwiICsgZ2V0VGltZXN0YW1wO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSB1cmwgKyBcIj90aW1lc3RhbXA9XCIgKyBnZXRUaW1lc3RhbXA7XG4gICAgfVxuXG4gICAgcmV0dXJuIHVybDtcbiAgfSxcbiAgR2V0VXJsUGFyYVZhbHVlOiBmdW5jdGlvbiBHZXRVcmxQYXJhVmFsdWUocGFyYU5hbWUpIHtcbiAgICByZXR1cm4gdGhpcy5HZXRVcmxQYXJhVmFsdWVCeVN0cmluZyhwYXJhTmFtZSwgd2luZG93LmxvY2F0aW9uLnNlYXJjaCk7XG4gIH0sXG4gIEdldFVybFBhcmFWYWx1ZUJ5U3RyaW5nOiBmdW5jdGlvbiBHZXRVcmxQYXJhVmFsdWVCeVN0cmluZyhwYXJhTmFtZSwgdXJsU3RyaW5nKSB7XG4gICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAoXCIoXnwmKVwiICsgcGFyYU5hbWUgKyBcIj0oW14mXSopKCZ8JClcIik7XG4gICAgdmFyIHIgPSB1cmxTdHJpbmcuc3Vic3RyKDEpLm1hdGNoKHJlZyk7XG4gICAgaWYgKHIgIT0gbnVsbCkgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChyWzJdKTtcbiAgICByZXR1cm4gXCJcIjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIEJyb3dzZXJJbmZvVXRpbGl0eSA9IHtcbiAgQnJvd3NlckFwcE5hbWU6IGZ1bmN0aW9uIEJyb3dzZXJBcHBOYW1lKCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJGaXJlZm94XCIpID4gMCkge1xuICAgICAgcmV0dXJuIFwiRmlyZWZveFwiO1xuICAgIH0gZWxzZSBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRVwiKSA+IDApIHtcbiAgICAgIHJldHVybiBcIklFXCI7XG4gICAgfSBlbHNlIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJDaHJvbWVcIikgPiAwKSB7XG4gICAgICByZXR1cm4gXCJDaHJvbWVcIjtcbiAgICB9XG4gIH0sXG4gIElzSUU6IGZ1bmN0aW9uIElzSUUoKSB7XG4gICAgaWYgKCEhd2luZG93LkFjdGl2ZVhPYmplY3QgfHwgXCJBY3RpdmVYT2JqZWN0XCIgaW4gd2luZG93KSByZXR1cm4gdHJ1ZTtlbHNlIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNJRTY6IGZ1bmN0aW9uIElzSUU2KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDYuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU3OiBmdW5jdGlvbiBJc0lFNygpIHtcbiAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA3LjBcIikgPiAwO1xuICB9LFxuICBJc0lFODogZnVuY3Rpb24gSXNJRTgoKSB7XG4gICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIk1TSUUgOC4wXCIpID4gMDtcbiAgfSxcbiAgSXNJRThYNjQ6IGZ1bmN0aW9uIElzSUU4WDY0KCkge1xuICAgIGlmIChuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDguMFwiKSA+IDApIHtcbiAgICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJ4NjRcIikgPiAwO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcbiAgSXNJRTk6IGZ1bmN0aW9uIElzSUU5KCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDkuMFwiKSA+IDA7XG4gIH0sXG4gIElzSUU5WDY0OiBmdW5jdGlvbiBJc0lFOVg2NCgpIHtcbiAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSA5LjBcIikgPiAwKSB7XG4gICAgICByZXR1cm4gbmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwieDY0XCIpID4gMDtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG4gIElzSUUxMDogZnVuY3Rpb24gSXNJRTEwKCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluZGV4T2YoXCJNU0lFIDEwLjBcIikgPiAwO1xuICB9LFxuICBJc0lFMTBYNjQ6IGZ1bmN0aW9uIElzSUUxMFg2NCgpIHtcbiAgICBpZiAobmF2aWdhdG9yLnVzZXJBZ2VudC5pbmRleE9mKFwiTVNJRSAxMC4wXCIpID4gMCkge1xuICAgICAgcmV0dXJuIG5hdmlnYXRvci51c2VyQWdlbnQuaW5kZXhPZihcIng2NFwiKSA+IDA7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBJRURvY3VtZW50TW9kZTogZnVuY3Rpb24gSUVEb2N1bWVudE1vZGUoKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmRvY3VtZW50TW9kZTtcbiAgfSxcbiAgSXNJRThEb2N1bWVudE1vZGU6IGZ1bmN0aW9uIElzSUU4RG9jdW1lbnRNb2RlKCkge1xuICAgIHJldHVybiB0aGlzLklFRG9jdW1lbnRNb2RlKCkgPT0gODtcbiAgfSxcbiAgSXNGaXJlZm94OiBmdW5jdGlvbiBJc0ZpcmVmb3goKSB7XG4gICAgcmV0dXJuIHRoaXMuQnJvd3NlckFwcE5hbWUoKSA9PSBcIkZpcmVmb3hcIjtcbiAgfSxcbiAgSXNDaHJvbWU6IGZ1bmN0aW9uIElzQ2hyb21lKCkge1xuICAgIHJldHVybiB0aGlzLkJyb3dzZXJBcHBOYW1lKCkgPT0gXCJDaHJvbWVcIjtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENhY2hlRGF0YVV0aWxpdHkgPSB7XG4gIEluaW5DbGllbnRDYWNoZTogZnVuY3Rpb24gSW5pbkNsaWVudENhY2hlKCkge1xuICAgIHRoaXMuR2V0Q3VycmVudFVzZXJJbmZvKCk7XG4gIH0sXG4gIF9DdXJyZW50VXNlckluZm86IG51bGwsXG4gIEdldEN1cnJlbnRVc2VySW5mbzogZnVuY3Rpb24gR2V0Q3VycmVudFVzZXJJbmZvKCkge1xuICAgIGlmICh0aGlzLl9DdXJyZW50VXNlckluZm8gPT0gbnVsbCkge1xuICAgICAgaWYgKHdpbmRvdy5wYXJlbnQuQ2FjaGVEYXRhVXRpbGl0eS5fQ3VycmVudFVzZXJJbmZvICE9IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5wYXJlbnQuQ2FjaGVEYXRhVXRpbGl0eS5fQ3VycmVudFVzZXJJbmZvO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgQWpheFV0aWxpdHkuUG9zdFN5bmMoXCIvUGxhdEZvcm0vTXlJbmZvL0dldFVzZXJJbmZvXCIsIHt9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgICBDYWNoZURhdGFVdGlsaXR5Ll9DdXJyZW50VXNlckluZm8gPSByZXN1bHQuZGF0YTtcbiAgICAgICAgICB9IGVsc2Uge31cbiAgICAgICAgfSwgXCJqc29uXCIpO1xuICAgICAgICByZXR1cm4gdGhpcy5fQ3VycmVudFVzZXJJbmZvO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fQ3VycmVudFVzZXJJbmZvO1xuICAgIH1cbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIENvb2tpZVV0aWxpdHkgPSB7XG4gIFNldENvb2tpZTFEYXk6IGZ1bmN0aW9uIFNldENvb2tpZTFEYXkobmFtZSwgdmFsdWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpICsgMjQgKiA2MCAqIDYwICogMTAwMCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBTZXRDb29raWUxTW9udGg6IGZ1bmN0aW9uIFNldENvb2tpZTFNb250aChuYW1lLCB2YWx1ZSkge1xuICAgIHZhciBleHAgPSBuZXcgRGF0ZSgpO1xuICAgIGV4cC5zZXRUaW1lKGV4cC5nZXRUaW1lKCkgKyAzMCAqIDI0ICogNjAgKiA2MCAqIDEwMDApO1xuICAgIGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGVzY2FwZSh2YWx1ZSkgKyBcIjtleHBpcmVzPVwiICsgZXhwLnRvR01UU3RyaW5nKCkgKyBcIjtwYXRoPS9cIjtcbiAgfSxcbiAgU2V0Q29va2llMVllYXI6IGZ1bmN0aW9uIFNldENvb2tpZTFZZWFyKG5hbWUsIHZhbHVlKSB7XG4gICAgdmFyIGV4cCA9IG5ldyBEYXRlKCk7XG4gICAgZXhwLnNldFRpbWUoZXhwLmdldFRpbWUoKSArIDMwICogMjQgKiA2MCAqIDYwICogMzY1ICogMTAwMCk7XG4gICAgZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgZXNjYXBlKHZhbHVlKSArIFwiO2V4cGlyZXM9XCIgKyBleHAudG9HTVRTdHJpbmcoKSArIFwiO3BhdGg9L1wiO1xuICB9LFxuICBHZXRDb29raWU6IGZ1bmN0aW9uIEdldENvb2tpZShuYW1lKSB7XG4gICAgdmFyIGFyciA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKFwiKF58IClcIiArIG5hbWUgKyBcIj0oW147XSopKDt8JClcIikpO1xuICAgIGlmIChhcnIgIT0gbnVsbCkgcmV0dXJuIHVuZXNjYXBlKGFyclsyXSk7XG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIERlbENvb2tpZTogZnVuY3Rpb24gRGVsQ29va2llKG5hbWUpIHtcbiAgICB2YXIgZXhwID0gbmV3IERhdGUoKTtcbiAgICBleHAuc2V0VGltZShleHAuZ2V0VGltZSgpIC0gMSk7XG4gICAgdmFyIGN2YWwgPSB0aGlzLmdldENvb2tpZShuYW1lKTtcbiAgICBpZiAoY3ZhbCAhPSBudWxsKSBkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyBjdmFsICsgXCI7ZXhwaXJlcz1cIiArIGV4cC50b0dNVFN0cmluZygpICsgXCI7cGF0aD0vXCI7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEYXRlVXRpbGl0eSA9IHtcbiAgR2V0Q3VycmVudERhdGFTdHJpbmc6IGZ1bmN0aW9uIEdldEN1cnJlbnREYXRhU3RyaW5nKHNwbGl0KSB7XG4gICAgYWxlcnQoXCJEYXRlVXRpbGl0eS5HZXRDdXJyZW50RGF0YVN0cmluZyDlt7LlgZznlKhcIik7XG4gIH0sXG4gIERhdGVGb3JtYXQ6IGZ1bmN0aW9uIERhdGVGb3JtYXQobXlEYXRlLCBzcGxpdCkge1xuICAgIGFsZXJ0KFwiRGF0ZVV0aWxpdHkuR2V0Q3VycmVudERhdGFTdHJpbmcg5bey5YGc55SoXCIpO1xuICB9LFxuICBGb3JtYXQ6IGZ1bmN0aW9uIEZvcm1hdChteURhdGUsIGZvcm1hdFN0cmluZykge1xuICAgIHZhciBvID0ge1xuICAgICAgXCJNK1wiOiBteURhdGUuZ2V0TW9udGgoKSArIDEsXG4gICAgICBcImQrXCI6IG15RGF0ZS5nZXREYXRlKCksXG4gICAgICBcImgrXCI6IG15RGF0ZS5nZXRIb3VycygpLFxuICAgICAgXCJtK1wiOiBteURhdGUuZ2V0TWludXRlcygpLFxuICAgICAgXCJzK1wiOiBteURhdGUuZ2V0U2Vjb25kcygpLFxuICAgICAgXCJxK1wiOiBNYXRoLmZsb29yKChteURhdGUuZ2V0TW9udGgoKSArIDMpIC8gMyksXG4gICAgICBcIlNcIjogbXlEYXRlLmdldE1pbGxpc2Vjb25kcygpXG4gICAgfTtcbiAgICBpZiAoLyh5KykvLnRlc3QoZm9ybWF0U3RyaW5nKSkgZm9ybWF0U3RyaW5nID0gZm9ybWF0U3RyaW5nLnJlcGxhY2UoUmVnRXhwLiQxLCAobXlEYXRlLmdldEZ1bGxZZWFyKCkgKyBcIlwiKS5zdWJzdHIoNCAtIFJlZ0V4cC4kMS5sZW5ndGgpKTtcblxuICAgIGZvciAodmFyIGsgaW4gbykge1xuICAgICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm9ybWF0U3RyaW5nKSkgZm9ybWF0U3RyaW5nID0gZm9ybWF0U3RyaW5nLnJlcGxhY2UoUmVnRXhwLiQxLCBSZWdFeHAuJDEubGVuZ3RoID09IDEgPyBvW2tdIDogKFwiMDBcIiArIG9ba10pLnN1YnN0cigoXCJcIiArIG9ba10pLmxlbmd0aCkpO1xuICAgIH1cblxuICAgIHJldHVybiBmb3JtYXRTdHJpbmc7XG4gIH0sXG4gIEZvcm1hdEN1cnJlbnREYXRhOiBmdW5jdGlvbiBGb3JtYXRDdXJyZW50RGF0YShmb3JtYXRTdHJpbmcpIHtcbiAgICB2YXIgbXlEYXRlID0gbmV3IERhdGUoKTtcbiAgICByZXR1cm4gdGhpcy5Gb3JtYXQobXlEYXRlLCBmb3JtYXRTdHJpbmcpO1xuICB9LFxuICBHZXRDdXJyZW50RGF0YTogZnVuY3Rpb24gR2V0Q3VycmVudERhdGEoKSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEZXRhaWxQYWdlVXRpbGl0eSA9IHtcbiAgSVZpZXdQYWdlVG9WaWV3U3RhdHVzOiBmdW5jdGlvbiBJVmlld1BhZ2VUb1ZpZXdTdGF0dXMoKSB7XG4gICAgcmV0dXJuO1xuICAgIHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICQoXCJpbnB1dFwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5oaWRlKCk7XG4gICAgICAgIHZhciB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAkKHRoaXMpLmFmdGVyKCQoXCI8bGFiZWwgLz5cIikudGV4dCh2YWwpKTtcbiAgICAgIH0pO1xuICAgICAgJChcIi5pdnUtZGF0ZS1waWNrZXItZWRpdG9yXCIpLmZpbmQoXCIuaXZ1LWljb25cIikuaGlkZSgpO1xuICAgICAgJChcIi5pdnUtcmFkaW9cIikuaGlkZSgpO1xuICAgICAgJChcIi5pdnUtcmFkaW8tZ3JvdXAtaXRlbVwiKS5oaWRlKCk7XG4gICAgICAkKFwiLml2dS1yYWRpby13cmFwcGVyLWNoZWNrZWRcIikuc2hvdygpO1xuICAgICAgJChcIi5pdnUtcmFkaW8td3JhcHBlci1jaGVja2VkXCIpLmZpbmQoXCJzcGFuXCIpLmhpZGUoKTtcbiAgICAgICQoXCJ0ZXh0YXJlYVwiKS5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJCh0aGlzKS5oaWRlKCk7XG4gICAgICAgIHZhciB2YWwgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAkKHRoaXMpLmFmdGVyKCQoXCI8bGFiZWwgLz5cIikudGV4dCh2YWwpKTtcbiAgICAgIH0pO1xuICAgIH0sIDEwMCk7XG4gIH0sXG4gIE92ZXJyaWRlT2JqZWN0VmFsdWU6IGZ1bmN0aW9uIE92ZXJyaWRlT2JqZWN0VmFsdWUoc291cmNlT2JqZWN0LCBkYXRhT2JqZWN0KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZU9iamVjdCkge1xuICAgICAgaWYgKGRhdGFPYmplY3Rba2V5XSAhPSB1bmRlZmluZWQgJiYgZGF0YU9iamVjdFtrZXldICE9IG51bGwgJiYgZGF0YU9iamVjdFtrZXldICE9IFwiXCIpIHtcbiAgICAgICAgc291cmNlT2JqZWN0W2tleV0gPSBkYXRhT2JqZWN0W2tleV07XG4gICAgICB9XG4gICAgfVxuICB9LFxuICBPdmVycmlkZU9iamVjdFZhbHVlRnVsbDogZnVuY3Rpb24gT3ZlcnJpZGVPYmplY3RWYWx1ZUZ1bGwoc291cmNlT2JqZWN0LCBkYXRhT2JqZWN0KSB7XG4gICAgZm9yICh2YXIga2V5IGluIHNvdXJjZU9iamVjdCkge1xuICAgICAgc291cmNlT2JqZWN0W2tleV0gPSBkYXRhT2JqZWN0W2tleV07XG4gICAgfVxuICB9LFxuICBCaW5kRm9ybURhdGE6IGZ1bmN0aW9uIEJpbmRGb3JtRGF0YShpbnRlcmZhY2VVcmwsIHZ1ZUZvcm1EYXRhLCByZWNvcmRJZCwgb3AsIGJlZkZ1bmMsIGFmRnVuYykge1xuICAgIEFqYXhVdGlsaXR5LlBvc3QoaW50ZXJmYWNlVXJsLCB7XG4gICAgICByZWNvcmRJZDogcmVjb3JkSWQsXG4gICAgICBvcDogb3BcbiAgICB9LCBmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICBpZiAocmVzdWx0LnN1Y2Nlc3MpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiZWZGdW5jID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGJlZkZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIERldGFpbFBhZ2VVdGlsaXR5Lk92ZXJyaWRlT2JqZWN0VmFsdWUodnVlRm9ybURhdGEsIHJlc3VsdC5kYXRhKTtcblxuICAgICAgICBpZiAodHlwZW9mIGFmRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBhZkZ1bmMocmVzdWx0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcCA9PSBcInZpZXdcIikge1xuICAgICAgICAgIERldGFpbFBhZ2VVdGlsaXR5LklWaWV3UGFnZVRvVmlld1N0YXR1cygpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIG51bGwpO1xuICAgICAgfVxuICAgIH0sIFwianNvblwiKTtcbiAgfVxufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIERpYWxvZ1V0aWxpdHkgPSB7XG4gIERpYWxvZ0FsZXJ0SWQ6IFwiRGVmYXVsdERpYWxvZ0FsZXJ0VXRpbGl0eTAxXCIsXG4gIERpYWxvZ1Byb21wdElkOiBcIkRlZmF1bHREaWFsb2dQcm9tcHRVdGlsaXR5MDFcIixcbiAgRGlhbG9nSWQ6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwMVwiLFxuICBEaWFsb2dJZDAyOiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDJcIixcbiAgRGlhbG9nSWQwMzogXCJEZWZhdWx0RGlhbG9nVXRpbGl0eTAzXCIsXG4gIERpYWxvZ0lkMDQ6IFwiRGVmYXVsdERpYWxvZ1V0aWxpdHkwNFwiLFxuICBEaWFsb2dJZDA1OiBcIkRlZmF1bHREaWFsb2dVdGlsaXR5MDVcIixcbiAgX0dldEVsZW06IGZ1bmN0aW9uIF9HZXRFbGVtKGRpYWxvZ0lkKSB7XG4gICAgcmV0dXJuICQoXCIjXCIgKyBkaWFsb2dJZCk7XG4gIH0sXG4gIF9DcmVhdGVEaWFsb2dFbGVtOiBmdW5jdGlvbiBfQ3JlYXRlRGlhbG9nRWxlbShkb2NvYmosIGRpYWxvZ0lkKSB7XG4gICAgaWYgKHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpLmxlbmd0aCA9PSAwKSB7XG4gICAgICB2YXIgZGlhbG9nRWxlID0gJChcIjxkaXYgaWQ9XCIgKyBkaWFsb2dJZCArIFwiIHRpdGxlPSfns7vnu5/mj5DnpLonIHN0eWxlPSdkaXNwbGF5Om5vbmUnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICAgJChkb2NvYmouYm9keSkuYXBwZW5kKGRpYWxvZ0VsZSk7XG4gICAgICByZXR1cm4gZGlhbG9nRWxlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fR2V0RWxlbShkaWFsb2dJZCk7XG4gICAgfVxuICB9LFxuICBfQ3JlYXRlQWxlcnRMb2FkaW5nTXNnRWxlbWVudDogZnVuY3Rpb24gX0NyZWF0ZUFsZXJ0TG9hZGluZ01zZ0VsZW1lbnQoZG9jb2JqLCBkaWFsb2dJZCkge1xuICAgIGlmICh0aGlzLl9HZXRFbGVtKGRpYWxvZ0lkKS5sZW5ndGggPT0gMCkge1xuICAgICAgdmFyIGRpYWxvZ0VsZSA9ICQoXCI8ZGl2IGlkPVwiICsgZGlhbG9nSWQgKyBcIiB0aXRsZT0n57O757uf5o+Q56S6JyBzdHlsZT0nZGlzcGxheTpub25lJz5cXFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nYWxlcnRsb2FkaW5nLWltZyc+PC9kaXY+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J2FsZXJ0bG9hZGluZy10eHQnPjwvZGl2PlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlwiKTtcbiAgICAgICQoZG9jb2JqLmJvZHkpLmFwcGVuZChkaWFsb2dFbGUpO1xuICAgICAgcmV0dXJuIGRpYWxvZ0VsZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX0dldEVsZW0oZGlhbG9nSWQpO1xuICAgIH1cbiAgfSxcbiAgX0NyZWF0ZUlmcm1hZURpYWxvZ0VsZW1lbnQ6IGZ1bmN0aW9uIF9DcmVhdGVJZnJtYWVEaWFsb2dFbGVtZW50KGRvY29iaiwgZGlhbG9naWQsIHVybCkge1xuICAgIHZhciBkaWFsb2dFbGUgPSAkKFwiPGRpdiBpZD1cIiArIGRpYWxvZ2lkICsgXCIgdGl0bGU9J0Jhc2ljIGRpYWxvZyc+XFxcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGlmcmFtZSBuYW1lPSdkaWFsb2dJZnJhbWUnIHdpZHRoPScxMDAlJyBoZWlnaHQ9Jzk4JScgZnJhbWVib3JkZXI9JzAnPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvaWZyYW1lPlxcXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XCIpO1xuICAgICQoZG9jb2JqLmJvZHkpLmFwcGVuZChkaWFsb2dFbGUpO1xuICAgIHJldHVybiBkaWFsb2dFbGU7XG4gIH0sXG4gIF9UZXN0RGlhbG9nRWxlbUlzRXhpc3Q6IGZ1bmN0aW9uIF9UZXN0RGlhbG9nRWxlbUlzRXhpc3QoZGlhbG9nSWQpIHtcbiAgICBpZiAodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuICBfVGVzdFJ1bkVuYWJsZTogZnVuY3Rpb24gX1Rlc3RSdW5FbmFibGUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0sXG4gIEFsZXJ0RXJyb3I6IGZ1bmN0aW9uIEFsZXJ0RXJyb3Iob3BlcmVyV2luZG93LCBkaWFsb2dJZCwgY29uZmlnLCBodG1sbXNnLCBzRnVuYykge1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICB3aWR0aDogNjAwXG4gICAgfTtcbiAgICBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgdGhpcy5BbGVydChvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBkZWZhdWx0Q29uZmlnLCBodG1sbXNnLCBzRnVuYyk7XG4gIH0sXG4gIEFsZXJ0VGV4dDogZnVuY3Rpb24gQWxlcnRUZXh0KHRleHQpIHtcbiAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgdGV4dCwgbnVsbCk7XG4gIH0sXG4gIEFsZXJ0OiBmdW5jdGlvbiBBbGVydChvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxtc2csIHNGdW5jKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVyZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgZGlhbG9nSWQpO1xuXG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSB7XG4gICAgICBoZWlnaHQ6IDIwMCxcbiAgICAgIHdpZHRoOiAzMDAsXG4gICAgICB0aXRsZTogXCLns7vnu5/mj5DnpLpcIixcbiAgICAgIHNob3c6IHRydWUsXG4gICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgIGJ1dHRvbnM6IHtcbiAgICAgICAgXCLlhbPpl61cIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIG9wZW46IGZ1bmN0aW9uIG9wZW4oKSB7fSxcbiAgICAgIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICAgICAgaWYgKHNGdW5jKSB7XG4gICAgICAgICAgc0Z1bmMoKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKGh0bWxFbGVtKS5odG1sKGh0bWxtc2cpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgQWxlcnRKc29uQ29kZTogZnVuY3Rpb24gQWxlcnRKc29uQ29kZShqc29uKSB7XG4gICAganNvbiA9IEpzb25VdGlsaXR5Lkpzb25Ub1N0cmluZ0Zvcm1hdChqc29uKTtcbiAgICBqc29uID0ganNvbi5yZXBsYWNlKC8mL2csICcmJykucmVwbGFjZSgvPC9nLCAnPCcpLnJlcGxhY2UoLz4vZywgJz4nKTtcbiAgICBqc29uID0ganNvbi5yZXBsYWNlKC8oXCIoXFxcXHVbYS16QS1aMC05XXs0fXxcXFxcW151XXxbXlxcXFxcIl0pKlwiKFxccyo6KT98XFxiKHRydWV8ZmFsc2V8bnVsbClcXGJ8LT9cXGQrKD86XFwuXFxkKik/KD86W2VFXVsrXFwtXT9cXGQrKT8pL2csIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgICAgdmFyIGNscyA9ICdqc29uLW51bWJlcic7XG5cbiAgICAgIGlmICgvXlwiLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBpZiAoLzokLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICAgIGNscyA9ICdqc29uLWtleSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2xzID0gJ2pzb24tc3RyaW5nJztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICgvdHJ1ZXxmYWxzZS8udGVzdChtYXRjaCkpIHtcbiAgICAgICAgY2xzID0gJ2pzb24tYm9vbGVhbic7XG4gICAgICB9IGVsc2UgaWYgKC9udWxsLy50ZXN0KG1hdGNoKSkge1xuICAgICAgICBjbHMgPSAnanNvbi1udWxsJztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuICc8c3BhbiBjbGFzcz1cIicgKyBjbHMgKyAnXCI+JyArIG1hdGNoICsgJzwvc3Bhbj4nO1xuICAgIH0pO1xuXG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbSh3aW5kb3cuZG9jdW1lbnQuYm9keSwgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkKTtcblxuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICB3aWR0aDogOTAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIFwi5YWz6ZetXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH0sXG4gICAgICAgIFwi5aSN5Yi25bm25YWz6ZetXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBvcGVuOiBmdW5jdGlvbiBvcGVuKCkge30sXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7fVxuICAgIH07XG4gICAgJChodG1sRWxlbSkuaHRtbChcIjxwcmUgY2xhc3M9J2pzb24tcHJlJz5cIiArIGpzb24gKyBcIjwvcHJlPlwiKTtcbiAgICAkKGh0bWxFbGVtKS5kaWFsb2coZGVmYXVsdENvbmZpZyk7XG4gIH0sXG4gIFNob3dIVE1MOiBmdW5jdGlvbiBTaG93SFRNTChvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxtc2csIGNsb3NlX2FmdGVyX2V2ZW50LCBwYXJhbXMpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVEaWFsb2dFbGVtKG9wZXJlcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIHRpdGxlOiBcIuezu+e7n+aPkOekulwiLFxuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKGV2ZW50LCB1aSkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGlmICh0eXBlb2YgY2xvc2VfYWZ0ZXJfZXZlbnQgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICBjbG9zZV9hZnRlcl9ldmVudChwYXJhbXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRDb25maWcsIGNvbmZpZyk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sbXNnKTtcbiAgICByZXR1cm4gJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBBbGVydExvYWRpbmc6IGZ1bmN0aW9uIEFsZXJ0TG9hZGluZyhvcGVyZXJXaW5kb3csIGRpYWxvZ0lkLCBjb25maWcsIGh0bWxtc2cpIHtcbiAgICB2YXIgaHRtbEVsZW0gPSB0aGlzLl9DcmVhdGVBbGVydExvYWRpbmdNc2dFbGVtZW50KG9wZXJlcldpbmRvdy5kb2N1bWVudC5ib2R5LCBkaWFsb2dJZCk7XG5cbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIGhlaWdodDogMjAwLFxuICAgICAgd2lkdGg6IDMwMCxcbiAgICAgIHRpdGxlOiBcIlwiLFxuICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgIG1vZGFsOiB0cnVlXG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQoaHRtbEVsZW0pLmZpbmQoXCIuYWxlcnRsb2FkaW5nLXR4dFwiKS5odG1sKGh0bWxtc2cpO1xuICAgICQoaHRtbEVsZW0pLmRpYWxvZyhkZWZhdWx0Q29uZmlnKTtcbiAgfSxcbiAgQ29uZmlybTogZnVuY3Rpb24gQ29uZmlybShvcGVyZXJXaW5kb3csIGh0bWxtc2csIG9rRm4pIHtcbiAgICB0aGlzLkNvbmZpcm1Db25maWcob3BlcmVyV2luZG93LCBodG1sbXNnLCBudWxsLCBva0ZuKTtcbiAgfSxcbiAgQ29uZmlybUNvbmZpZzogZnVuY3Rpb24gQ29uZmlybUNvbmZpZyhvcGVyZXJXaW5kb3csIGh0bWxtc2csIGNvbmZpZywgb2tGbikge1xuICAgIHZhciBodG1sRWxlbSA9IHRoaXMuX0NyZWF0ZURpYWxvZ0VsZW0ob3BlcmVyV2luZG93LmRvY3VtZW50LmJvZHksIFwiQWxlcnRDb25maXJtTXNnXCIpO1xuXG4gICAgdmFyIHBhcmFzID0gbnVsbDtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9IHtcbiAgICAgIG9rZnVuYzogZnVuY3Rpb24gb2tmdW5jKHBhcmFzKSB7XG4gICAgICAgIGlmIChva0ZuICE9IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHJldHVybiBva0ZuKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb3BlcmVyV2luZG93LmNsb3NlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBjYW5jZWxmdW5jOiBmdW5jdGlvbiBjYW5jZWxmdW5jKHBhcmFzKSB7fSxcbiAgICAgIHZhbGlkYXRlZnVuYzogZnVuY3Rpb24gdmFsaWRhdGVmdW5jKHBhcmFzKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIGNsb3NlYWZ0ZXJmdW5jOiB0cnVlLFxuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwi57O757uf5o+Q56S6XCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIFwi56Gu6K6kXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgaWYgKGRlZmF1bHRDb25maWcudmFsaWRhdGVmdW5jKHBhcmFzKSkge1xuICAgICAgICAgICAgdmFyIHIgPSBkZWZhdWx0Q29uZmlnLm9rZnVuYyhwYXJhcyk7XG4gICAgICAgICAgICByID0gciA9PSBudWxsID8gdHJ1ZSA6IHI7XG5cbiAgICAgICAgICAgIGlmIChyICYmIGRlZmF1bHRDb25maWcuY2xvc2VhZnRlcmZ1bmMpIHtcbiAgICAgICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBcIuWPlua2iFwiOiBmdW5jdGlvbiBfKCkge1xuICAgICAgICAgIGRlZmF1bHRDb25maWcuY2FuY2VsZnVuYyhwYXJhcyk7XG5cbiAgICAgICAgICBpZiAoZGVmYXVsdENvbmZpZy5jbG9zZWFmdGVyZnVuYykge1xuICAgICAgICAgICAgJChodG1sRWxlbSkuZGlhbG9nKFwiY2xvc2VcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfTtcbiAgICB2YXIgZGVmYXVsdENvbmZpZyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0Q29uZmlnLCBjb25maWcpO1xuICAgICQoaHRtbEVsZW0pLmh0bWwoaHRtbG1zZyk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICAgIHBhcmFzID0ge1xuICAgICAgXCJFbGVtZW50T2JqXCI6IGh0bWxFbGVtXG4gICAgfTtcbiAgfSxcbiAgUHJvbXB0OiBmdW5jdGlvbiBQcm9tcHQob3BlcmVyV2luZG93LCBjb25maWcsIGRpYWxvZ0lkLCBsYWJlbE1zZywgb2tGdW5jKSB7XG4gICAgdmFyIGh0bWxFbGVtID0gdGhpcy5fQ3JlYXRlRGlhbG9nRWxlbShvcGVyZXJXaW5kb3cuZG9jdW1lbnQuYm9keSwgZGlhbG9nSWQpO1xuXG4gICAgdmFyIHBhcmFzID0gbnVsbDtcbiAgICB2YXIgdGV4dEFyZWEgPSAkKFwiPHRleHRhcmVhIC8+XCIpO1xuICAgIHZhciBkZWZhdWx0Q29uZmlnID0ge1xuICAgICAgaGVpZ2h0OiAyMDAsXG4gICAgICB3aWR0aDogMzAwLFxuICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICBzaG93OiB0cnVlLFxuICAgICAgbW9kYWw6IHRydWUsXG4gICAgICBidXR0b25zOiB7XG4gICAgICAgIFwi56Gu6K6kXCI6IGZ1bmN0aW9uIF8oKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBva0Z1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICB2YXIgaW5wdXRUZXh0ID0gdGV4dEFyZWEudmFsKCk7XG4gICAgICAgICAgICBva0Z1bmMoaW5wdXRUZXh0KTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfSxcbiAgICAgICAgXCLlj5bmtohcIjogZnVuY3Rpb24gXygpIHtcbiAgICAgICAgICAkKGh0bWxFbGVtKS5kaWFsb2coXCJjbG9zZVwiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gICAgdmFyIGRlZmF1bHRDb25maWcgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdENvbmZpZywgY29uZmlnKTtcbiAgICAkKHRleHRBcmVhKS5jc3MoXCJoZWlnaHRcIiwgZGVmYXVsdENvbmZpZy5oZWlnaHQgLSAxMzApLmNzcyhcIndpZHRoXCIsIFwiMTAwJVwiKTtcbiAgICB2YXIgaHRtbENvbnRlbnQgPSAkKFwiPGRpdj48ZGl2IHN0eWxlPSd3aWR0aDogMTAwJSc+XCIgKyBsYWJlbE1zZyArIFwi77yaPC9kaXY+PC9kaXY+XCIpLmFwcGVuZCh0ZXh0QXJlYSk7XG4gICAgJChodG1sRWxlbSkuaHRtbChodG1sQ29udGVudCk7XG4gICAgJChodG1sRWxlbSkuZGlhbG9nKGRlZmF1bHRDb25maWcpO1xuICB9LFxuICBEaWFsb2dFbGVtOiBmdW5jdGlvbiBEaWFsb2dFbGVtKGVsZW1JZCwgY29uZmlnKSB7XG4gICAgJChcIiNcIiArIGVsZW1JZCkuZGlhbG9nKGNvbmZpZyk7XG4gIH0sXG4gIE9wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIE9wZW5JZnJhbWVXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICB2YXIgZGVmYXVsdG9wdGlvbnMgPSB7XG4gICAgICBoZWlnaHQ6IDQxMCxcbiAgICAgIHdpZHRoOiA2MDAsXG4gICAgICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoZXZlbnQsIHVpKSB7XG4gICAgICAgIHZhciBhdXRvZGlhbG9naWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgJCh0aGlzKS5maW5kKFwiaWZyYW1lXCIpLnJlbW92ZSgpO1xuICAgICAgICAkKHRoaXMpLmRpYWxvZygnY2xvc2UnKTtcbiAgICAgICAgJCh0aGlzKS5kaWFsb2coXCJkZXN0cm95XCIpO1xuICAgICAgICAkKFwiI1wiICsgYXV0b2RpYWxvZ2lkKS5yZW1vdmUoKTtcblxuICAgICAgICBpZiAoQnJvd3NlckluZm9VdGlsaXR5LklzSUU4RG9jdW1lbnRNb2RlKCkpIHtcbiAgICAgICAgICBDb2xsZWN0R2FyYmFnZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBvcHRpb25zLmNsb3NlX2FmdGVyX2V2ZW50ID09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgaWYgKCQoXCIjRm9yZm9jdXNcIikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJChcIiNGb3Jmb2N1c1wiKVswXS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBjYXRjaCAoZSkge31cbiAgICAgIH1cbiAgICB9O1xuXG4gICAgaWYgKHdodHlwZSA9PSAxKSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDY4MCxcbiAgICAgICAgd2lkdGg6IDk4MFxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gMikge1xuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgIHdpZHRoOiA4MDBcbiAgICAgIH0pO1xuICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDQpIHtcbiAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgIGhlaWdodDogMzgwLFxuICAgICAgICB3aWR0aDogNDgwXG4gICAgICB9KTtcbiAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSA1KSB7XG4gICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICBoZWlnaHQ6IDE4MCxcbiAgICAgICAgd2lkdGg6IDMwMFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG9wdGlvbnMud2lkdGggPT0gMCkge1xuICAgICAgb3B0aW9ucy53aWR0aCA9IFBhZ2VTdHlsZVV0aWwuR2V0UGFnZVdpZHRoKCkgLSAyMDtcbiAgICB9XG5cbiAgICBpZiAob3B0aW9ucy5oZWlnaHQgPT0gMCkge1xuICAgICAgb3B0aW9ucy5oZWlnaHQgPSBQYWdlU3R5bGVVdGlsLkdldFBhZ2VIZWlnaHQoKSAtIDEwO1xuICAgIH1cblxuICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCBvcHRpb25zKTtcbiAgICB2YXIgYXV0b2RpYWxvZ2lkID0gZGlhbG9nSWQ7XG5cbiAgICB2YXIgZGlhbG9nRWxlID0gdGhpcy5fQ3JlYXRlSWZybWFlRGlhbG9nRWxlbWVudChvcGVuZXJ3aW5kb3cuZG9jdW1lbnQsIGF1dG9kaWFsb2dpZCwgdXJsKTtcblxuICAgIHZhciBkaWFsb2dPYmogPSAkKGRpYWxvZ0VsZSkuZGlhbG9nKGRlZmF1bHRvcHRpb25zKTtcbiAgICB2YXIgJGlmcmFtZW9iaiA9ICQoZGlhbG9nRWxlKS5maW5kKFwiaWZyYW1lXCIpO1xuICAgICRpZnJhbWVvYmouYXR0cihzcmMsIHVybCk7XG4gICAgJGlmcmFtZW9ialswXS5jb250ZW50V2luZG93LkZyYW1lV2luZG93SWQgPSBhdXRvZGlhbG9naWQ7XG4gICAgJGlmcmFtZW9ialswXS5jb250ZW50V2luZG93Lk9wZW5lcldpbmRvd09iaiA9IG9wZW5lcndpbmRvdztcbiAgICByZXR1cm4gZGlhbG9nT2JqO1xuICB9LFxuICBDbG9zZU9wZW5JZnJhbWVXaW5kb3c6IGZ1bmN0aW9uIENsb3NlT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkKSB7XG4gICAgb3BlbmVyd2luZG93Lk9wZW5lcldpbmRvd09iai5EaWFsb2dVdGlsaXR5LkNsb3NlRGlhbG9nKGRpYWxvZ0lkKTtcbiAgfSxcbiAgQ2xvc2VEaWFsb2c6IGZ1bmN0aW9uIENsb3NlRGlhbG9nKGRpYWxvZ0lkKSB7XG4gICAgdGhpcy5fR2V0RWxlbShkaWFsb2dJZCkuZmluZChcImlmcmFtZVwiKS5yZW1vdmUoKTtcblxuICAgICQodGhpcy5fR2V0RWxlbShkaWFsb2dJZCkpLmRpYWxvZyhcImNsb3NlXCIpO1xuXG4gICAgdHJ5IHtcbiAgICAgIGlmICgkKFwiI0ZvcmZvY3VzXCIpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgJChcIiNGb3Jmb2N1c1wiKVswXS5mb2N1cygpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHt9XG4gIH0sXG4gIE9wZW5OZXdXaW5kb3c6IGZ1bmN0aW9uIE9wZW5OZXdXaW5kb3cob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICB2YXIgd2lkdGggPSAwO1xuICAgIHZhciBoZWlnaHQgPSAwO1xuXG4gICAgaWYgKG9wdGlvbnMpIHtcbiAgICAgIHdpZHRoID0gb3B0aW9ucy53aWR0aDtcbiAgICAgIGhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xuICAgIH1cblxuICAgIHZhciBsZWZ0ID0gcGFyc2VJbnQoKHNjcmVlbi5hdmFpbFdpZHRoIC0gd2lkdGgpIC8gMikudG9TdHJpbmcoKTtcbiAgICB2YXIgdG9wID0gcGFyc2VJbnQoKHNjcmVlbi5hdmFpbEhlaWdodCAtIGhlaWdodCkgLyAyKS50b1N0cmluZygpO1xuXG4gICAgaWYgKHdpZHRoLnRvU3RyaW5nKCkgPT0gXCIwXCIgJiYgaGVpZ2h0LnRvU3RyaW5nKCkgPT0gXCIwXCIpIHtcbiAgICAgIHdpZHRoID0gd2luZG93LnNjcmVlbi5hdmFpbFdpZHRoIC0gMzA7XG4gICAgICBoZWlnaHQgPSB3aW5kb3cuc2NyZWVuLmF2YWlsSGVpZ2h0IC0gNjA7XG4gICAgICBsZWZ0ID0gXCIwXCI7XG4gICAgICB0b3AgPSBcIjBcIjtcbiAgICB9XG5cbiAgICB2YXIgd2luSGFuZGxlID0gd2luZG93Lm9wZW4odXJsLCBcIlwiLCBcInNjcm9sbGJhcnM9bm8sdG9vbGJhcj1ubyxtZW51YmFyPW5vLHJlc2l6YWJsZT15ZXMsY2VudGVyPXllcyxoZWxwPW5vLCBzdGF0dXM9eWVzLHRvcD0gXCIgKyB0b3AgKyBcInB4LGxlZnQ9XCIgKyBsZWZ0ICsgXCJweCx3aWR0aD1cIiArIHdpZHRoICsgXCJweCxoZWlnaHQ9XCIgKyBoZWlnaHQgKyBcInB4XCIpO1xuXG4gICAgaWYgKHdpbkhhbmRsZSA9PSBudWxsKSB7XG4gICAgICBhbGVydChcIuivt+ino+mZpOa1j+iniOWZqOWvueacrOezu+e7n+W8ueWHuueql+WPo+eahOmYu+atouiuvue9ru+8gVwiKTtcbiAgICB9XG4gIH0sXG4gIF9UcnlHZXRQYXJlbnRXaW5kb3c6IGZ1bmN0aW9uIF9UcnlHZXRQYXJlbnRXaW5kb3cod2luKSB7XG4gICAgaWYgKHdpbi5wYXJlbnQgIT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHdpbi5wYXJlbnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIF9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iajogZnVuY3Rpb24gX0ZyYW1lX1RyeUdldEZyYW1lV2luZG93T2JqKHdpbiwgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSkge1xuICAgIGlmICh0cnlmaW5kdGltZSA+IGN1cnJlbnR0cnlmaW5kdGltZSkge1xuICAgICAgdmFyIGlzdG9wRnJhbWVwYWdlID0gZmFsc2U7XG4gICAgICBjdXJyZW50dHJ5ZmluZHRpbWUrKztcblxuICAgICAgdHJ5IHtcbiAgICAgICAgaXN0b3BGcmFtZXBhZ2UgPSB3aW4uSXNUb3BGcmFtZVBhZ2U7XG5cbiAgICAgICAgaWYgKGlzdG9wRnJhbWVwYWdlKSB7XG4gICAgICAgICAgcmV0dXJuIHdpbjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5fRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmoodGhpcy5fVHJ5R2V0UGFyZW50V2luZG93KHdpbiksIHRyeWZpbmR0aW1lLCBjdXJyZW50dHJ5ZmluZHRpbWUpO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaih0aGlzLl9UcnlHZXRQYXJlbnRXaW5kb3cod2luKSwgdHJ5ZmluZHRpbWUsIGN1cnJlbnR0cnlmaW5kdGltZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG4gIH0sXG4gIF9PcGVuV2luZG93SW5GcmFtZVBhZ2U6IGZ1bmN0aW9uIF9PcGVuV2luZG93SW5GcmFtZVBhZ2Uob3BlbmVyd2luZG93LCBkaWFsb2dJZCwgdXJsLCBvcHRpb25zLCB3aHR5cGUpIHtcbiAgICBpZiAoU3RyaW5nVXRpbGl0eS5Jc051bGxPckVtcHR5KGRpYWxvZ0lkKSkge1xuICAgICAgYWxlcnQoXCJkaWFsb2dJZOS4jeiDveS4uuepulwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB1cmwgPSBCYXNlVXRpbGl0eS5BcHBlbmRUaW1lU3RhbXBVcmwodXJsKTtcbiAgICB2YXIgYXV0b2RpYWxvZ2lkID0gXCJGcmFtZURpYWxvZ0VsZVwiICsgZGlhbG9nSWQ7XG5cbiAgICBpZiAoJCh0aGlzLkZyYW1lUGFnZVJlZi5kb2N1bWVudCkuZmluZChcIiNcIiArIGF1dG9kaWFsb2dpZCkubGVuZ3RoID09IDApIHtcbiAgICAgIHZhciBkaWFsb2dFbGUgPSB0aGlzLl9DcmVhdGVJZnJtYWVEaWFsb2dFbGVtZW50KHRoaXMuRnJhbWVQYWdlUmVmLmRvY3VtZW50LCBhdXRvZGlhbG9naWQsIHVybCk7XG5cbiAgICAgIHZhciBkZWZhdWx0b3B0aW9ucyA9IHtcbiAgICAgICAgaGVpZ2h0OiA0MDAsXG4gICAgICAgIHdpZHRoOiA2MDAsXG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCLns7vnu59cIixcbiAgICAgICAgY2xvc2U6IGZ1bmN0aW9uIGNsb3NlKGV2ZW50LCB1aSkge1xuICAgICAgICAgIHZhciBhdXRvZGlhbG9naWQgPSAkKHRoaXMpLmF0dHIoXCJpZFwiKTtcbiAgICAgICAgICAkKHRoaXMpLmZpbmQoXCJpZnJhbWVcIikucmVtb3ZlKCk7XG4gICAgICAgICAgJCh0aGlzKS5kaWFsb2coJ2Nsb3NlJyk7XG4gICAgICAgICAgJCh0aGlzKS5kaWFsb2coXCJkZXN0cm95XCIpO1xuICAgICAgICAgICQoXCIjXCIgKyBhdXRvZGlhbG9naWQpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgaWYgKEJyb3dzZXJJbmZvVXRpbGl0eS5Jc0lFOERvY3VtZW50TW9kZSgpKSB7XG4gICAgICAgICAgICBDb2xsZWN0R2FyYmFnZSgpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0eXBlb2Ygb3B0aW9ucy5jbG9zZV9hZnRlcl9ldmVudCA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIG9wdGlvbnMuY2xvc2VfYWZ0ZXJfZXZlbnQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmICh3aHR5cGUgPT0gMCkge1xuICAgICAgICBvcHRpb25zLndpZHRoID0gUGFnZVN0eWxlVXRpbGl0eS5HZXRQYWdlV2lkdGgoKSAtIDIwO1xuICAgICAgICBvcHRpb25zLmhlaWdodCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZUhlaWdodCgpIC0gMTgwO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gMSkge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogNjgwLFxuICAgICAgICAgIHdpZHRoOiA5ODBcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2UgaWYgKHdodHlwZSA9PSAyKSB7XG4gICAgICAgIGRlZmF1bHRvcHRpb25zID0gJC5leHRlbmQodHJ1ZSwge30sIGRlZmF1bHRvcHRpb25zLCB7XG4gICAgICAgICAgaGVpZ2h0OiA2MDAsXG4gICAgICAgICAgd2lkdGg6IDgwMFxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAod2h0eXBlID09IDQpIHtcbiAgICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIHtcbiAgICAgICAgICBoZWlnaHQ6IDM4MCxcbiAgICAgICAgICB3aWR0aDogNDgwXG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIGlmICh3aHR5cGUgPT0gNSkge1xuICAgICAgICBkZWZhdWx0b3B0aW9ucyA9ICQuZXh0ZW5kKHRydWUsIHt9LCBkZWZhdWx0b3B0aW9ucywge1xuICAgICAgICAgIGhlaWdodDogMTgwLFxuICAgICAgICAgIHdpZHRoOiAzMDBcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLndpZHRoID09IDApIHtcbiAgICAgICAgb3B0aW9ucy53aWR0aCA9IFBhZ2VTdHlsZVV0aWxpdHkuR2V0UGFnZVdpZHRoKCkgLSAyMDtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuaGVpZ2h0ID09IDApIHtcbiAgICAgICAgb3B0aW9ucy5oZWlnaHQgPSBQYWdlU3R5bGVVdGlsaXR5LkdldFBhZ2VIZWlnaHQoKSAtIDE4MDtcbiAgICAgIH1cblxuICAgICAgZGVmYXVsdG9wdGlvbnMgPSAkLmV4dGVuZCh0cnVlLCB7fSwgZGVmYXVsdG9wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgJChkaWFsb2dFbGUpLmRpYWxvZyhkZWZhdWx0b3B0aW9ucyk7XG4gICAgICAkKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCBcIjIwMDBcIik7XG4gICAgICAkKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgXCIyMDAxXCIpO1xuICAgICAgdmFyICRpZnJhbWVvYmogPSAkKGRpYWxvZ0VsZSkuZmluZChcImlmcmFtZVwiKTtcbiAgICAgICRpZnJhbWVvYmoub24oXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKFN0cmluZ1V0aWxpdHkuSXNTYW1lT3JnaW4od2luZG93LmxvY2F0aW9uLmhyZWYsIHVybCkpIHtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuRnJhbWVXaW5kb3dJZCA9IGF1dG9kaWFsb2dpZDtcbiAgICAgICAgICB0aGlzLmNvbnRlbnRXaW5kb3cuT3BlbmVyV2luZG93T2JqID0gb3BlbmVyd2luZG93O1xuICAgICAgICAgIHRoaXMuY29udGVudFdpbmRvdy5Jc09wZW5Gb3JGcmFtZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coXCLot6jln59JZnJhbWUs5peg5rOV6K6+572u5bGe5oCnIVwiKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAkaWZyYW1lb2JqLmF0dHIoXCJzcmNcIiwgdXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJChcIiNcIiArIGF1dG9kaWFsb2dpZCkuZGlhbG9nKFwibW92ZVRvVG9wXCIpO1xuICAgIH1cbiAgfSxcbiAgX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nOiBmdW5jdGlvbiBfRnJhbWVfRnJhbWVQYWdlQ2xvc2VEaWFsb2coZGlhbG9naWQpIHtcbiAgICAkKFwiI1wiICsgZGlhbG9naWQpLmRpYWxvZyhcImNsb3NlXCIpO1xuICB9LFxuICBGcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iajogZnVuY3Rpb24gRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKSB7XG4gICAgdmFyIHRyeWZpbmR0aW1lID0gNTtcbiAgICB2YXIgY3VycmVudHRyeWZpbmR0aW1lID0gMTtcbiAgICByZXR1cm4gdGhpcy5fRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmood2luZG93LCB0cnlmaW5kdGltZSwgY3VycmVudHRyeWZpbmR0aW1lKTtcbiAgfSxcbiAgRnJhbWVfQWxlcnQ6IGZ1bmN0aW9uIEZyYW1lX0FsZXJ0KCkge30sXG4gIEZyYW1lX0NvbWZpcm06IGZ1bmN0aW9uIEZyYW1lX0NvbWZpcm0oKSB7fSxcbiAgRnJhbWVfT3BlbklmcmFtZVdpbmRvdzogZnVuY3Rpb24gRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSkge1xuICAgIGlmICh1cmwgPT0gXCJcIikge1xuICAgICAgYWxlcnQoXCJ1cmzkuI3og73kuLrnqbrlrZfnrKbkuLIhXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHZhciB3cndpbiA9IHRoaXMuRnJhbWVfVHJ5R2V0RnJhbWVXaW5kb3dPYmooKTtcbiAgICB0aGlzLkZyYW1lUGFnZVJlZiA9IHdyd2luO1xuXG4gICAgaWYgKHdyd2luICE9IG51bGwpIHtcbiAgICAgIHRoaXMuRnJhbWVQYWdlUmVmLkRpYWxvZ1V0aWxpdHkuRnJhbWVQYWdlUmVmID0gd3J3aW47XG5cbiAgICAgIHRoaXMuRnJhbWVQYWdlUmVmLkRpYWxvZ1V0aWxpdHkuX09wZW5XaW5kb3dJbkZyYW1lUGFnZShvcGVuZXJ3aW5kb3csIGRpYWxvZ0lkLCB1cmwsIG9wdGlvbnMsIHdodHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsZXJ0KFwi5om+5LiN5YiwRnJhbWVQYWdlISFcIik7XG4gICAgfVxuICB9LFxuICBGcmFtZV9DbG9zZURpYWxvZzogZnVuY3Rpb24gRnJhbWVfQ2xvc2VEaWFsb2cob3BlcmVyV2luZG93KSB7XG4gICAgdmFyIHdyd2luID0gdGhpcy5GcmFtZV9UcnlHZXRGcmFtZVdpbmRvd09iaigpO1xuICAgIHZhciBvcGVuZXJ3aW4gPSBvcGVyZXJXaW5kb3cuT3BlbmVyV2luZG93T2JqO1xuICAgIHZhciBhdXRvZGlhbG9naWQgPSBvcGVyZXJXaW5kb3cuRnJhbWVXaW5kb3dJZDtcblxuICAgIHdyd2luLkRpYWxvZ1V0aWxpdHkuX0ZyYW1lX0ZyYW1lUGFnZUNsb3NlRGlhbG9nKGF1dG9kaWFsb2dpZCk7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBEaWN0aW9uYXJ5VXRpbGl0eSA9IHtcbiAgX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbjogbnVsbCxcbiAgR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uOiBmdW5jdGlvbiBHcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24oc291cmNlRGljdGlvbmFyeUpzb24pIHtcbiAgICBpZiAodGhpcy5fR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uID09IG51bGwpIHtcbiAgICAgIGlmIChzb3VyY2VEaWN0aW9uYXJ5SnNvbiAhPSBudWxsKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSB7fTtcblxuICAgICAgICBmb3IgKHZhciBncm91cFZhbHVlIGluIHNvdXJjZURpY3Rpb25hcnlKc29uKSB7XG4gICAgICAgICAgcmVzdWx0W2dyb3VwVmFsdWVdID0ge307XG5cbiAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNvdXJjZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICByZXN1bHRbZ3JvdXBWYWx1ZV1bc291cmNlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1baV0uZGljdFZhbHVlXSA9IHNvdXJjZURpY3Rpb25hcnlKc29uW2dyb3VwVmFsdWVdW2ldLmRpY3RUZXh0O1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX0dyb3VwVmFsdWVMaXN0SnNvblRvU2ltcGxlSnNvbiA9IHJlc3VsdDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fR3JvdXBWYWx1ZUxpc3RKc29uVG9TaW1wbGVKc29uO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgY29uc29sZSA9IGNvbnNvbGUgfHwge1xuICBsb2c6IGZ1bmN0aW9uIGxvZygpIHt9LFxuICB3YXJuOiBmdW5jdGlvbiB3YXJuKCkge30sXG4gIGVycm9yOiBmdW5jdGlvbiBlcnJvcigpIHt9XG59O1xuXG5mdW5jdGlvbiBEYXRlRXh0ZW5kX0RhdGVGb3JtYXQoZGF0ZSwgZm10KSB7XG4gIGlmIChudWxsID09IGRhdGUgfHwgdW5kZWZpbmVkID09IGRhdGUpIHJldHVybiAnJztcbiAgdmFyIG8gPSB7XG4gICAgXCJNK1wiOiBkYXRlLmdldE1vbnRoKCkgKyAxLFxuICAgIFwiZCtcIjogZGF0ZS5nZXREYXRlKCksXG4gICAgXCJoK1wiOiBkYXRlLmdldEhvdXJzKCksXG4gICAgXCJtK1wiOiBkYXRlLmdldE1pbnV0ZXMoKSxcbiAgICBcInMrXCI6IGRhdGUuZ2V0U2Vjb25kcygpLFxuICAgIFwiU1wiOiBkYXRlLmdldE1pbGxpc2Vjb25kcygpXG4gIH07XG4gIGlmICgvKHkrKS8udGVzdChmbXQpKSBmbXQgPSBmbXQucmVwbGFjZShSZWdFeHAuJDEsIChkYXRlLmdldEZ1bGxZZWFyKCkgKyBcIlwiKS5zdWJzdHIoNCAtIFJlZ0V4cC4kMS5sZW5ndGgpKTtcblxuICBmb3IgKHZhciBrIGluIG8pIHtcbiAgICBpZiAobmV3IFJlZ0V4cChcIihcIiArIGsgKyBcIilcIikudGVzdChmbXQpKSBmbXQgPSBmbXQucmVwbGFjZShSZWdFeHAuJDEsIFJlZ0V4cC4kMS5sZW5ndGggPT0gMSA/IG9ba10gOiAoXCIwMFwiICsgb1trXSkuc3Vic3RyKChcIlwiICsgb1trXSkubGVuZ3RoKSk7XG4gIH1cblxuICByZXR1cm4gZm10O1xufVxuXG5EYXRlLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBEYXRlRXh0ZW5kX0RhdGVGb3JtYXQodGhpcywgJ3l5eXktTU0tZGQgbW06aGg6c3MnKTtcbn07XG5cbmlmICghT2JqZWN0LmNyZWF0ZSkge1xuICBPYmplY3QuY3JlYXRlID0gZnVuY3Rpb24gKCkge1xuICAgIGFsZXJ0KFwiRXh0ZW5kIE9iamVjdC5jcmVhdGVcIik7XG5cbiAgICBmdW5jdGlvbiBGKCkge31cblxuICAgIHJldHVybiBmdW5jdGlvbiAobykge1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggIT09IDEpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPYmplY3QuY3JlYXRlIGltcGxlbWVudGF0aW9uIG9ubHkgYWNjZXB0cyBvbmUgcGFyYW1ldGVyLicpO1xuICAgICAgfVxuXG4gICAgICBGLnByb3RvdHlwZSA9IG87XG4gICAgICByZXR1cm4gbmV3IEYoKTtcbiAgICB9O1xuICB9KCk7XG59XG5cbiQuZm4ub3V0ZXJIVE1MID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gIXRoaXMubGVuZ3RoID8gdGhpcyA6IHRoaXNbMF0ub3V0ZXJIVE1MIHx8IGZ1bmN0aW9uIChlbCkge1xuICAgIHZhciBkaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkaXYuYXBwZW5kQ2hpbGQoZWwuY2xvbmVOb2RlKHRydWUpKTtcbiAgICB2YXIgY29udGVudHMgPSBkaXYuaW5uZXJIVE1MO1xuICAgIGRpdiA9IG51bGw7XG4gICAgYWxlcnQoY29udGVudHMpO1xuICAgIHJldHVybiBjb250ZW50cztcbiAgfSh0aGlzWzBdKTtcbn07XG5cbmZ1bmN0aW9uIHJlZkNzc0xpbmsoaHJlZikge1xuICB2YXIgaGVhZCA9IGRvY3VtZW50LmhlYWQgfHwgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICBzdHlsZS50eXBlID0gJ3RleHQvY3NzJztcbiAgc3R5bGUucmVsID0gJ3N0eWxlc2hlZXQnO1xuICBzdHlsZS5ocmVmID0gaHJlZjtcbiAgaGVhZC5hcHBlbmRDaGlsZChzdHlsZSk7XG4gIHJldHVybiBzdHlsZS5zaGVldCB8fCBzdHlsZS5zdHlsZVNoZWV0O1xufSIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSnNvblV0aWxpdHkgPSB7XG4gIFBhcnNlQXJyYXlKc29uVG9UcmVlSnNvbjogZnVuY3Rpb24gUGFyc2VBcnJheUpzb25Ub1RyZWVKc29uKGNvbmZpZywgc291cmNlQXJyYXksIHJvb3RJZCkge1xuICAgIHZhciBfY29uZmlnID0ge1xuICAgICAgS2V5RmllbGQ6IFwiXCIsXG4gICAgICBSZWxhdGlvbkZpZWxkOiBcIlwiLFxuICAgICAgQ2hpbGRGaWVsZE5hbWU6IFwiXCJcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gRmluZEpzb25CeUlkKGtleUZpZWxkLCBpZCkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzb3VyY2VBcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAoc291cmNlQXJyYXlbaV1ba2V5RmllbGRdID09IGlkKSB7XG4gICAgICAgICAgcmV0dXJuIHNvdXJjZUFycmF5W2ldO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGFsZXJ0KFwiUGFyc2VBcnJheUpzb25Ub1RyZWVKc29uLkZpbmRKc29uQnlJZDrlnKhzb3VyY2VBcnJheeS4reaJvuS4jeWIsOaMh+Wumklk55qE6K6w5b2VXCIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIEZpbmRDaGlsZEpzb24ocmVsYXRpb25GaWVsZCwgcGlkKSB7XG4gICAgICB2YXIgcmVzdWx0ID0gW107XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc291cmNlQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHNvdXJjZUFycmF5W2ldW3JlbGF0aW9uRmllbGRdID09IHBpZCkge1xuICAgICAgICAgIHJlc3VsdC5wdXNoKHNvdXJjZUFycmF5W2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIEZpbmRDaGlsZE5vZGVBbmRQYXJzZShwaWQsIHJlc3VsdCkge1xuICAgICAgdmFyIGNoaWxkanNvbnMgPSBGaW5kQ2hpbGRKc29uKGNvbmZpZy5SZWxhdGlvbkZpZWxkLCBwaWQpO1xuXG4gICAgICBpZiAoY2hpbGRqc29ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgIGlmIChyZXN1bHRbY29uZmlnLkNoaWxkRmllbGROYW1lXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICByZXN1bHRbY29uZmlnLkNoaWxkRmllbGROYW1lXSA9IFtdO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZGpzb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgdmFyIHRvT2JqID0ge307XG4gICAgICAgICAgdG9PYmogPSBKc29uVXRpbGl0eS5TaW1wbGVDbG9uZUF0dHIodG9PYmosIGNoaWxkanNvbnNbaV0pO1xuICAgICAgICAgIHJlc3VsdFtjb25maWcuQ2hpbGRGaWVsZE5hbWVdLnB1c2godG9PYmopO1xuICAgICAgICAgIHZhciBpZCA9IHRvT2JqW2NvbmZpZy5LZXlGaWVsZF07XG4gICAgICAgICAgRmluZENoaWxkTm9kZUFuZFBhcnNlKGlkLCB0b09iaik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcmVzdWx0ID0ge307XG4gICAgdmFyIHJvb3RKc29uID0gRmluZEpzb25CeUlkKGNvbmZpZy5LZXlGaWVsZCwgcm9vdElkKTtcbiAgICByZXN1bHQgPSB0aGlzLlNpbXBsZUNsb25lQXR0cihyZXN1bHQsIHJvb3RKc29uKTtcbiAgICBGaW5kQ2hpbGROb2RlQW5kUGFyc2Uocm9vdElkLCByZXN1bHQpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0sXG4gIFJlc29sdmVTaW1wbGVBcnJheUpzb25Ub1RyZWVKc29uOiBmdW5jdGlvbiBSZXNvbHZlU2ltcGxlQXJyYXlKc29uVG9UcmVlSnNvbihjb25maWcsIHNvdXJjZUpzb24sIHJvb3ROb2RlSWQpIHtcbiAgICBhbGVydChcIkpzb25VdGlsaXR5LlJlc29sdmVTaW1wbGVBcnJheUpzb25Ub1RyZWVKc29uIOW3suWBnOeUqFwiKTtcbiAgfSxcbiAgU2ltcGxlQ2xvbmVBdHRyOiBmdW5jdGlvbiBTaW1wbGVDbG9uZUF0dHIodG9PYmosIGZyb21PYmopIHtcbiAgICBmb3IgKHZhciBhdHRyIGluIGZyb21PYmopIHtcbiAgICAgIHRvT2JqW2F0dHJdID0gZnJvbU9ialthdHRyXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdG9PYmo7XG4gIH0sXG4gIENsb25lU2ltcGxlOiBmdW5jdGlvbiBDbG9uZVNpbXBsZShzb3VyY2UpIHtcbiAgICB2YXIgbmV3SnNvbiA9IGpRdWVyeS5leHRlbmQodHJ1ZSwge30sIHNvdXJjZSk7XG4gICAgcmV0dXJuIG5ld0pzb247XG4gIH0sXG4gIEpzb25Ub1N0cmluZzogZnVuY3Rpb24gSnNvblRvU3RyaW5nKG9iaikge1xuICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShvYmopO1xuICB9LFxuICBKc29uVG9TdHJpbmdGb3JtYXQ6IGZ1bmN0aW9uIEpzb25Ub1N0cmluZ0Zvcm1hdChvYmopIHtcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqLCBudWxsLCAyKTtcbiAgfSxcbiAgU3RyaW5nVG9Kc29uOiBmdW5jdGlvbiBTdHJpbmdUb0pzb24oc3RyKSB7XG4gICAgcmV0dXJuIGV2YWwoXCIoXCIgKyBzdHIgKyBcIilcIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBMaXN0UGFnZVV0aWxpdHkgPSB7XG4gIERlZmF1bHRMaXN0SGVpZ2h0OiA2NzgsXG4gIEdldEdlbmVyYWxQYWdlSGVpZ2h0OiBmdW5jdGlvbiBHZXRHZW5lcmFsUGFnZUhlaWdodChmaXhIZWlnaHQpIHtcbiAgICB2YXIgcGFnZUhlaWdodCA9IGpRdWVyeShkb2N1bWVudCkuaGVpZ2h0KCk7XG5cbiAgICBpZiAoJChcIiNsaXN0LXNpbXBsZS1zZWFyY2gtd3JhcFwiKS5sZW5ndGggPiAwKSB7XG4gICAgICBwYWdlSGVpZ2h0ID0gcGFnZUhlaWdodCAtICQoXCIjbGlzdC1zaW1wbGUtc2VhcmNoLXdyYXBcIikub3V0ZXJIZWlnaHQoKSArIGZpeEhlaWdodCAtICQoXCIjbGlzdC1idXR0b24td3JhcFwiKS5vdXRlckhlaWdodCgpIC0gJChcIiNsaXN0LXBhZ2VyLXdyYXBcIikub3V0ZXJIZWlnaHQoKSAtIDMwO1xuICAgIH0gZWxzZSB7XG4gICAgICBwYWdlSGVpZ2h0ID0gcGFnZUhlaWdodCAtICQoXCIjbGlzdC1idXR0b24td3JhcFwiKS5vdXRlckhlaWdodCgpICsgZml4SGVpZ2h0IC0gKCQoXCIjbGlzdC1wYWdlci13cmFwXCIpLmxlbmd0aCA+IDAgPyAkKFwiI2xpc3QtcGFnZXItd3JhcFwiKS5vdXRlckhlaWdodCgpIDogMCkgLSAzMDtcbiAgICB9XG5cbiAgICByZXR1cm4gcGFnZUhlaWdodDtcbiAgfSxcbiAgR2V0Rml4SGVpZ2h0OiBmdW5jdGlvbiBHZXRGaXhIZWlnaHQoKSB7XG4gICAgcmV0dXJuIC03MDtcbiAgfSxcbiAgSVZpZXdUYWJsZVJlbmRlcmVyOiB7XG4gICAgVG9EYXRlWVlZWV9NTV9ERDogZnVuY3Rpb24gVG9EYXRlWVlZWV9NTV9ERChoLCBkYXRldGltZSkge1xuICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZShkYXRldGltZSk7XG4gICAgICB2YXIgZGF0ZVN0ciA9IERhdGVVdGlsaXR5LkZvcm1hdChkYXRlLCAneXl5eS1NTS1kZCcpO1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIGRhdGVTdHIpO1xuICAgIH0sXG4gICAgU3RyaW5nVG9EYXRlWVlZWV9NTV9ERDogZnVuY3Rpb24gU3RyaW5nVG9EYXRlWVlZWV9NTV9ERChoLCBkYXRldGltZSkge1xuICAgICAgdmFyIGRhdGVTdHIgPSBkYXRldGltZS5zcGxpdChcIiBcIilbMF07XG4gICAgICByZXR1cm4gaCgnZGl2JywgZGF0ZVN0cik7XG4gICAgfSxcbiAgICBUb1N0YXR1c0VuYWJsZTogZnVuY3Rpb24gVG9TdGF0dXNFbmFibGUoaCwgc3RhdHVzKSB7XG4gICAgICBpZiAoc3RhdHVzID09IDApIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi56aB55SoXCIpO1xuICAgICAgfSBlbHNlIGlmIChzdGF0dXMgPT0gMSkge1xuICAgICAgICByZXR1cm4gaCgnZGl2JywgXCLlkK/nlKhcIik7XG4gICAgICB9XG4gICAgfSxcbiAgICBUb1llc05vRW5hYmxlOiBmdW5jdGlvbiBUb1llc05vRW5hYmxlKGgsIHN0YXR1cykge1xuICAgICAgaWYgKHN0YXR1cyA9PSAwKSB7XG4gICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuWQplwiKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdHVzID09IDEpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5pivXCIpO1xuICAgICAgfVxuICAgIH0sXG4gICAgVG9EaWN0aW9uYXJ5VGV4dDogZnVuY3Rpb24gVG9EaWN0aW9uYXJ5VGV4dChoLCBkaWN0aW9uYXJ5SnNvbiwgZ3JvdXBWYWx1ZSwgZGljdGlvbmFyeVZhbHVlKSB7XG4gICAgICB2YXIgc2ltcGxlRGljdGlvbmFyeUpzb24gPSBEaWN0aW9uYXJ5VXRpbGl0eS5Hcm91cFZhbHVlTGlzdEpzb25Ub1NpbXBsZUpzb24oZGljdGlvbmFyeUpzb24pO1xuXG4gICAgICBpZiAoZGljdGlvbmFyeVZhbHVlID09IG51bGwgfHwgZGljdGlvbmFyeVZhbHVlID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwiXCIpO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV0gIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXSkge1xuICAgICAgICAgIGlmIChzaW1wbGVEaWN0aW9uYXJ5SnNvbltncm91cFZhbHVlXVtkaWN0aW9uYXJ5VmFsdWVdKSB7XG4gICAgICAgICAgICByZXR1cm4gaCgnZGl2Jywgc2ltcGxlRGljdGlvbmFyeUpzb25bZ3JvdXBWYWx1ZV1bZGljdGlvbmFyeVZhbHVlXSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaJvuS4jeWIsOijheaNoueahFRFWFRcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBoKCdkaXYnLCBcIuaJvuS4jeWIsOijheaNoueahOWIhue7hFwiKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGgoJ2RpdicsIFwi5om+5LiN5Yiw6KOF5o2i55qE5YiG57uEXCIpO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWQ6IGZ1bmN0aW9uIElWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkKHNlbGVjdGlvblJvd3MpIHtcbiAgICBpZiAoc2VsZWN0aW9uUm93cyAhPSBudWxsICYmIHNlbGVjdGlvblJvd3MubGVuZ3RoID4gMCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdGhlbjogZnVuY3Rpb24gdGhlbihmdW5jKSB7XG4gICAgICAgICAgZnVuYyhzZWxlY3Rpb25Sb3dzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIFwi6K+36YCJ5Lit6ZyA6KaB5pON5L2c55qE6KGMIVwiLCBudWxsKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge31cbiAgICAgIH07XG4gICAgfVxuICB9LFxuICBJVmlld1RhYmxlTWFyZVN1cmVTZWxlY3RlZE9uZTogZnVuY3Rpb24gSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUoc2VsZWN0aW9uUm93cykge1xuICAgIGlmIChzZWxlY3Rpb25Sb3dzICE9IG51bGwgJiYgc2VsZWN0aW9uUm93cy5sZW5ndGggPiAwICYmIHNlbGVjdGlvblJvd3MubGVuZ3RoID09IDEpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4oZnVuYykge1xuICAgICAgICAgIGZ1bmMoc2VsZWN0aW9uUm93cyk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCBcIuivt+mAieS4remcgOimgeaTjeS9nOeahOihjO+8jOavj+asoeWPquiDvemAieS4reS4gOihjCFcIiwgbnVsbCk7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKGZ1bmMpIHt9XG4gICAgICB9O1xuICAgIH1cbiAgfSxcbiAgSVZpZXdDaGFuZ2VTZXJ2ZXJTdGF0dXM6IGZ1bmN0aW9uIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgc3RhdHVzTmFtZSwgcGFnZUFwcE9iaikge1xuICAgIHZhciBpZEFycmF5ID0gbmV3IEFycmF5KCk7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNlbGVjdGlvblJvd3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlkQXJyYXkucHVzaChzZWxlY3Rpb25Sb3dzW2ldW2lkRmllbGRdKTtcbiAgICB9XG5cbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgaWRzOiBpZEFycmF5LmpvaW4oXCI7XCIpLFxuICAgICAgc3RhdHVzOiBzdGF0dXNOYW1lXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgZnVuY3Rpb24gKCkge30pO1xuICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnQod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0FsZXJ0SWQsIHt9LCByZXN1bHQubWVzc2FnZSwgbnVsbCk7XG4gICAgICB9XG4gICAgfSwgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld01vdmVGYWNlOiBmdW5jdGlvbiBJVmlld01vdmVGYWNlKHVybCwgc2VsZWN0aW9uUm93cywgaWRGaWVsZCwgdHlwZSwgcGFnZUFwcE9iaikge1xuICAgIHRoaXMuSVZpZXdUYWJsZU1hcmVTdXJlU2VsZWN0ZWRPbmUoc2VsZWN0aW9uUm93cykudGhlbihmdW5jdGlvbiAoc2VsZWN0aW9uUm93cykge1xuICAgICAgQWpheFV0aWxpdHkuUG9zdCh1cmwsIHtcbiAgICAgICAgcmVjb3JkSWQ6IHNlbGVjdGlvblJvd3NbMF1baWRGaWVsZF0sXG4gICAgICAgIHR5cGU6IHR5cGVcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgcGFnZUFwcE9iai5yZWxvYWREYXRhKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBudWxsKTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0pO1xuICB9LFxuICBJVmlld0NoYW5nZVNlcnZlclN0YXR1c0ZhY2U6IGZ1bmN0aW9uIElWaWV3Q2hhbmdlU2VydmVyU3RhdHVzRmFjZSh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHN0YXR1c05hbWUsIHBhZ2VBcHBPYmopIHtcbiAgICB0aGlzLklWaWV3VGFibGVNYXJlU3VyZVNlbGVjdGVkKHNlbGVjdGlvblJvd3MpLnRoZW4oZnVuY3Rpb24gKHNlbGVjdGlvblJvd3MpIHtcbiAgICAgIExpc3RQYWdlVXRpbGl0eS5JVmlld0NoYW5nZVNlcnZlclN0YXR1cyh1cmwsIHNlbGVjdGlvblJvd3MsIGlkRmllbGQsIHN0YXR1c05hbWUsIHBhZ2VBcHBPYmopO1xuICAgIH0pO1xuICB9LFxuICBJVmlld1RhYmxlRGVsZXRlUm93OiBmdW5jdGlvbiBJVmlld1RhYmxlRGVsZXRlUm93KHVybCwgcmVjb3JkSWQsIHBhZ2VBcHBPYmopIHtcbiAgICBEaWFsb2dVdGlsaXR5LkNvbmZpcm0od2luZG93LCBcIuehruiupOimgeWIoOmZpOW9k+WJjeiusOW9leWQl++8n1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgICByZWNvcmRJZDogcmVjb3JkSWRcbiAgICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgICAgRGlhbG9nVXRpbGl0eS5BbGVydCh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLnJlbG9hZERhdGEoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBEaWFsb2dVdGlsaXR5LkFsZXJ0KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dBbGVydElkLCB7fSwgcmVzdWx0Lm1lc3NhZ2UsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICAgICAgfVxuICAgICAgfSwgXCJqc29uXCIpO1xuICAgIH0pO1xuICB9LFxuICBJVmlld1RhYmxlTG9hZERhdGFTZWFyY2g6IGZ1bmN0aW9uIElWaWV3VGFibGVMb2FkRGF0YVNlYXJjaCh1cmwsIHBhZ2VOdW0sIHBhZ2VTaXplLCBzZWFyY2hDb25kaXRpb24sIHBhZ2VBcHBPYmosIGlkRmllbGQsIGF1dG9TZWxlY3RlZE9sZFJvd3MsIHN1Y2Nlc3NGdW5jLCBsb2FkRGljdCkge1xuICAgIGlmIChsb2FkRGljdCA9PSB1bmRlZmluZWQgfHwgbG9hZERpY3QgPT0gbnVsbCkge1xuICAgICAgbG9hZERpY3QgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgXCJwYWdlTnVtXCI6IHBhZ2VOdW0sXG4gICAgICBcInBhZ2VTaXplXCI6IHBhZ2VTaXplLFxuICAgICAgXCJzZWFyY2hDb25kaXRpb25cIjogU2VhcmNoVXRpbGl0eS5TZXJpYWxpemF0aW9uU2VhcmNoQ29uZGl0aW9uKHNlYXJjaENvbmRpdGlvbiksXG4gICAgICBcImxvYWREaWN0XCI6IGxvYWREaWN0XG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgaWYgKHJlc3VsdC5zdWNjZXNzKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3VjY2Vzc0Z1bmMgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgc3VjY2Vzc0Z1bmMocmVzdWx0LCBwYWdlQXBwT2JqKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhID0gbmV3IEFycmF5KCk7XG4gICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhID0gcmVzdWx0LmRhdGEubGlzdDtcbiAgICAgICAgcGFnZUFwcE9iai5wYWdlVG90YWwgPSByZXN1bHQuZGF0YS50b3RhbDtcblxuICAgICAgICBpZiAoYXV0b1NlbGVjdGVkT2xkUm93cykge1xuICAgICAgICAgIGlmIChwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MgIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlQXBwT2JqLnRhYmxlRGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhZ2VBcHBPYmouc2VsZWN0aW9uUm93cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGlmIChwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3Nbal1baWRGaWVsZF0gPT0gcGFnZUFwcE9iai50YWJsZURhdGFbaV1baWRGaWVsZF0pIHtcbiAgICAgICAgICAgICAgICAgIHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldLl9jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERpYWxvZ1V0aWxpdHkuQWxlcnRFcnJvcih3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nQWxlcnRJZCwge30sIHJlc3VsdC5tZXNzYWdlLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgICB9XG4gICAgfSwgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld1RhYmxlTG9hZERhdGFOb1NlYXJjaDogZnVuY3Rpb24gSVZpZXdUYWJsZUxvYWREYXRhTm9TZWFyY2godXJsLCBwYWdlTnVtLCBwYWdlU2l6ZSwgcGFnZUFwcE9iaiwgaWRGaWVsZCwgYXV0b1NlbGVjdGVkT2xkUm93cywgc3VjY2Vzc0Z1bmMpIHtcbiAgICBBamF4VXRpbGl0eS5Qb3N0KHVybCwge1xuICAgICAgcGFnZU51bTogcGFnZU51bSxcbiAgICAgIHBhZ2VTaXplOiBwYWdlU2l6ZVxuICAgIH0sIGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgIGlmIChyZXN1bHQuc3VjY2Vzcykge1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IG5ldyBBcnJheSgpO1xuICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YSA9IHJlc3VsdC5kYXRhLmxpc3Q7XG4gICAgICAgIHBhZ2VBcHBPYmoucGFnZVRvdGFsID0gcmVzdWx0LmRhdGEudG90YWw7XG5cbiAgICAgICAgaWYgKGF1dG9TZWxlY3RlZE9sZFJvd3MpIHtcbiAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzICE9IG51bGwpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZUFwcE9iai50YWJsZURhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlQXBwT2JqLnNlbGVjdGlvblJvd3MubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBpZiAocGFnZUFwcE9iai5zZWxlY3Rpb25Sb3dzW2pdW2lkRmllbGRdID09IHBhZ2VBcHBPYmoudGFibGVEYXRhW2ldW2lkRmllbGRdKSB7XG4gICAgICAgICAgICAgICAgICBwYWdlQXBwT2JqLnRhYmxlRGF0YVtpXS5fY2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBzdWNjZXNzRnVuYyA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICBzdWNjZXNzRnVuYyhyZXN1bHQsIHBhZ2VBcHBPYmopO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSwgXCJqc29uXCIpO1xuICB9LFxuICBJVmlld1RhYmxlSW5uZXJCdXR0b246IHtcbiAgICBWaWV3QnV0dG9uOiBmdW5jdGlvbiBWaWV3QnV0dG9uKGgsIHBhcmFtcywgaWRGaWVsZCwgcGFnZUFwcE9iaikge1xuICAgICAgcmV0dXJuIGgoJ2RpdicsIHtcbiAgICAgICAgY2xhc3M6IFwibGlzdC1yb3ctYnV0dG9uIHZpZXdcIixcbiAgICAgICAgb246IHtcbiAgICAgICAgICBjbGljazogZnVuY3Rpb24gY2xpY2soKSB7XG4gICAgICAgICAgICBwYWdlQXBwT2JqLnZpZXcocGFyYW1zLnJvd1tpZEZpZWxkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9LFxuICAgIEVkaXRCdXR0b246IGZ1bmN0aW9uIEVkaXRCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gZWRpdFwiLFxuICAgICAgICBvbjoge1xuICAgICAgICAgIGNsaWNrOiBmdW5jdGlvbiBjbGljaygpIHtcbiAgICAgICAgICAgIHBhZ2VBcHBPYmouZWRpdChwYXJhbXMucm93W2lkRmllbGRdKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0sXG4gICAgRGVsZXRlQnV0dG9uOiBmdW5jdGlvbiBEZWxldGVCdXR0b24oaCwgcGFyYW1zLCBpZEZpZWxkLCBwYWdlQXBwT2JqKSB7XG4gICAgICByZXR1cm4gaCgnZGl2Jywge1xuICAgICAgICBjbGFzczogXCJsaXN0LXJvdy1idXR0b24gZGVsXCIsXG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgY2xpY2s6IGZ1bmN0aW9uIGNsaWNrKCkge1xuICAgICAgICAgICAgcGFnZUFwcE9iai5kZWwocGFyYW1zLnJvd1tpZEZpZWxkXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBQYWdlU3R5bGVVdGlsaXR5ID0ge1xuICBHZXRQYWdlSGVpZ2h0OiBmdW5jdGlvbiBHZXRQYWdlSGVpZ2h0KCkge1xuICAgIHJldHVybiBqUXVlcnkod2luZG93LmRvY3VtZW50KS5oZWlnaHQoKTtcbiAgfSxcbiAgR2V0UGFnZVdpZHRoOiBmdW5jdGlvbiBHZXRQYWdlV2lkdGgoKSB7XG4gICAgcmV0dXJuIGpRdWVyeSh3aW5kb3cuZG9jdW1lbnQpLndpZHRoKCk7XG4gIH0sXG4gIEdldFdpbmRvd0hlaWdodDogZnVuY3Rpb24gR2V0V2luZG93SGVpZ2h0KCkge1xuICAgIHJldHVybiAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gIH0sXG4gIEdldFdpbmRvd1dpZHRoOiBmdW5jdGlvbiBHZXRXaW5kb3dXaWR0aCgpIHtcbiAgICByZXR1cm4gJCh3aW5kb3cpLndpZHRoKCk7XG4gIH0sXG4gIEdldExpc3RCdXR0b25PdXRlckhlaWdodDogZnVuY3Rpb24gR2V0TGlzdEJ1dHRvbk91dGVySGVpZ2h0KCkge1xuICAgIGFsZXJ0KFwiUGFnZVN0eWxlVXRpbGl0eS5HZXRMaXN0QnV0dG9uT3V0ZXJIZWlnaHQg5bey5YGc55SoXCIpO1xuICAgIHJldHVybiBqUXVlcnkoXCIubGlzdC1idXR0b24tb3V0ZXItY1wiKS5vdXRlckhlaWdodCgpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgU2VhcmNoVXRpbGl0eSA9IHtcbiAgU2VhcmNoRmllbGRUeXBlOiB7XG4gICAgSW50VHlwZTogXCJJbnRUeXBlXCIsXG4gICAgTnVtYmVyVHlwZTogXCJOdW1iZXJUeXBlXCIsXG4gICAgRGF0YVR5cGU6IFwiRGF0ZVR5cGVcIixcbiAgICBMaWtlU3RyaW5nVHlwZTogXCJMaWtlU3RyaW5nVHlwZVwiLFxuICAgIExlZnRMaWtlU3RyaW5nVHlwZTogXCJMZWZ0TGlrZVN0cmluZ1R5cGVcIixcbiAgICBSaWdodExpa2VTdHJpbmdUeXBlOiBcIlJpZ2h0TGlrZVN0cmluZ1R5cGVcIixcbiAgICBTdHJpbmdUeXBlOiBcIlN0cmluZ1R5cGVcIixcbiAgICBEYXRhU3RyaW5nVHlwZTogXCJEYXRlU3RyaW5nVHlwZVwiLFxuICAgIEFycmF5TGlrZVN0cmluZ1R5cGU6IFwiQXJyYXlMaWtlU3RyaW5nVHlwZVwiXG4gIH0sXG4gIFNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb246IGZ1bmN0aW9uIFNlcmlhbGl6YXRpb25TZWFyY2hDb25kaXRpb24oc2VhcmNoQ29uZGl0aW9uKSB7XG4gICAgdmFyIHNlYXJjaENvbmRpdGlvbkNsb25lID0gSnNvblV0aWxpdHkuQ2xvbmVTaW1wbGUoc2VhcmNoQ29uZGl0aW9uKTtcblxuICAgIGZvciAodmFyIGtleSBpbiBzZWFyY2hDb25kaXRpb25DbG9uZSkge1xuICAgICAgaWYgKHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udHlwZSA9PSBTZWFyY2hVdGlsaXR5LlNlYXJjaEZpZWxkVHlwZS5BcnJheUxpa2VTdHJpbmdUeXBlKSB7XG4gICAgICAgIGlmIChzZWFyY2hDb25kaXRpb25DbG9uZVtrZXldLnZhbHVlICE9IG51bGwgJiYgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSA9IHNlYXJjaENvbmRpdGlvbkNsb25lW2tleV0udmFsdWUuam9pbihcIjtcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc2VhcmNoQ29uZGl0aW9uQ2xvbmVba2V5XS52YWx1ZSA9IFwiXCI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoc2VhcmNoQ29uZGl0aW9uQ2xvbmUpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgSkJ1aWxkNERTZWxlY3RWaWV3ID0ge1xuICBTZWxlY3RFbnZWYXJpYWJsZToge1xuICAgIFVSTDogXCIvUGxhdEZvcm0vU2VsZWN0Vmlldy9TZWxlY3RFbnZWYXJpYWJsZS9TZWxlY3RcIixcbiAgICBiZWdpblNlbGVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3QoaW5zdGFuY2VOYW1lKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24odGhpcy5VUkwsIHtcbiAgICAgICAgXCJpbnN0YW5jZU5hbWVcIjogaW5zdGFuY2VOYW1lXG4gICAgICB9KTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuT3BlbklmcmFtZVdpbmRvdyh3aW5kb3csIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQsIHVybCwge1xuICAgICAgICB0aXRsZTogXCLpgInmi6nlj5jph49cIixcbiAgICAgICAgbW9kYWw6IHRydWVcbiAgICAgIH0sIDIpO1xuICAgIH0sXG4gICAgYmVnaW5TZWxlY3RJbkZyYW1lOiBmdW5jdGlvbiBiZWdpblNlbGVjdEluRnJhbWUob3BlbmVyLCBpbnN0YW5jZU5hbWUsIG9wdGlvbikge1xuICAgICAgdmFyIHVybCA9IEJhc2VVdGlsaXR5LkJ1aWxkQWN0aW9uKHRoaXMuVVJMLCB7XG4gICAgICAgIFwiaW5zdGFuY2VOYW1lXCI6IGluc3RhbmNlTmFtZVxuICAgICAgfSk7XG4gICAgICB2YXIgb3B0aW9uID0gJC5leHRlbmQodHJ1ZSwge30sIHtcbiAgICAgICAgbW9kYWw6IHRydWUsXG4gICAgICAgIHRpdGxlOiBcIumAieaLqeWPmOmHj1wiXG4gICAgICB9LCBvcHRpb24pO1xuICAgICAgRGlhbG9nVXRpbGl0eS5GcmFtZV9PcGVuSWZyYW1lV2luZG93KG9wZW5lciwgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZDA1LCB1cmwsIG9wdGlvbiwgMSk7XG4gICAgICAkKHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQpLmZpbmQoXCIudWktd2lkZ2V0LW92ZXJsYXlcIikuY3NzKFwiekluZGV4XCIsIDEwMTAwKTtcbiAgICAgICQod2luZG93LnBhcmVudC5kb2N1bWVudCkuZmluZChcIi51aS1kaWFsb2dcIikuY3NzKFwiekluZGV4XCIsIDEwMTAxKTtcbiAgICB9LFxuICAgIGZvcm1hdFRleHQ6IGZ1bmN0aW9uIGZvcm1hdFRleHQodHlwZSwgdGV4dCkge1xuICAgICAgaWYgKHR5cGUgPT0gXCJDb25zdFwiKSB7XG4gICAgICAgIHJldHVybiBcIumdmeaAgeWAvDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiRGF0ZVRpbWVcIikge1xuICAgICAgICByZXR1cm4gXCLml6XmnJ/ml7bpl7Q644CQXCIgKyB0ZXh0ICsgXCLjgJFcIjtcbiAgICAgIH0gZWxzZSBpZiAodHlwZSA9PSBcIkFwaVZhclwiKSB7XG4gICAgICAgIHJldHVybiBcIkFQSeWPmOmHjzrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiTnVtYmVyQ29kZVwiKSB7XG4gICAgICAgIHJldHVybiBcIuW6j+WPt+e8lueggTrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiSWRDb2RlclwiKSB7XG4gICAgICAgIHJldHVybiBcIuS4u+mUrueUn+aIkDrjgJBcIiArIHRleHQgKyBcIuOAkVwiO1xuICAgICAgfSBlbHNlIGlmICh0eXBlID09IFwiXCIpIHtcbiAgICAgICAgcmV0dXJuIFwi44CQ5peg44CRXCI7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBcIuacquefpeexu+Wei1wiICsgdGV4dDtcbiAgICB9XG4gIH0sXG4gIFNlbGVjdEJpbmRUb0ZpZWxkOiB7XG4gICAgVVJMOiBcIi9QbGF0Rm9ybS9TZWxlY3RWaWV3L1NlbGVjdEJpbmRUb1RhYmxlRmllbGQvU2VsZWN0XCIsXG4gICAgYmVnaW5TZWxlY3Q6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0KGluc3RhbmNlTmFtZSkge1xuICAgICAgdmFyIHVybCA9IHRoaXMuVVJMICsgXCI/aW5zdGFuY2VOYW1lPVwiICsgaW5zdGFuY2VOYW1lO1xuICAgICAgRGlhbG9nVXRpbGl0eS5PcGVuSWZyYW1lV2luZG93KHdpbmRvdywgRGlhbG9nVXRpbGl0eS5EaWFsb2dJZCwgdXJsLCB7XG4gICAgICAgIHRpdGxlOiBcIumAieaLqeWPmOmHj1wiLFxuICAgICAgICBtb2RhbDogdHJ1ZVxuICAgICAgfSwgMik7XG4gICAgfSxcbiAgICBiZWdpblNlbGVjdEluRnJhbWU6IGZ1bmN0aW9uIGJlZ2luU2VsZWN0SW5GcmFtZShvcGVuZXIsIGluc3RhbmNlTmFtZSwgb3B0aW9uKSB7XG4gICAgICB2YXIgdXJsID0gQmFzZVV0aWxpdHkuQnVpbGRBY3Rpb24odGhpcy5VUkwsIHtcbiAgICAgICAgXCJpbnN0YW5jZU5hbWVcIjogaW5zdGFuY2VOYW1lXG4gICAgICB9KTtcbiAgICAgIHZhciBvcHRpb24gPSAkLmV4dGVuZCh0cnVlLCB7fSwge1xuICAgICAgICBtb2RhbDogdHJ1ZSxcbiAgICAgICAgdGl0bGU6IFwi6YCJ5oup57uR5a6a5a2X5q61XCJcbiAgICAgIH0sIG9wdGlvbik7XG4gICAgICBEaWFsb2dVdGlsaXR5LkZyYW1lX09wZW5JZnJhbWVXaW5kb3cob3BlbmVyLCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkMDUsIHVybCwgb3B0aW9uLCAxKTtcbiAgICAgICQod2luZG93LnBhcmVudC5kb2N1bWVudCkuZmluZChcIi51aS13aWRnZXQtb3ZlcmxheVwiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDApO1xuICAgICAgJCh3aW5kb3cucGFyZW50LmRvY3VtZW50KS5maW5kKFwiLnVpLWRpYWxvZ1wiKS5jc3MoXCJ6SW5kZXhcIiwgMTAxMDEpO1xuICAgIH1cbiAgfSxcbiAgU2VsZWN0VmFsaWRhdGVSdWxlOiB7XG4gICAgVVJMOiBcIi9QbGF0Rm9ybS9TZWxlY3RWaWV3L1NlbGVjdFZhbGlkYXRlUnVsZS9TZWxlY3RcIixcbiAgICBiZWdpblNlbGVjdDogZnVuY3Rpb24gYmVnaW5TZWxlY3QoaW5zdGFuY2VOYW1lKSB7XG4gICAgICB2YXIgdXJsID0gdGhpcy5VUkwgKyBcIj9pbnN0YW5jZU5hbWU9XCIgKyBpbnN0YW5jZU5hbWU7XG4gICAgICBEaWFsb2dVdGlsaXR5Lk9wZW5JZnJhbWVXaW5kb3cod2luZG93LCBEaWFsb2dVdGlsaXR5LkRpYWxvZ0lkLCB1cmwsIHtcbiAgICAgICAgdGl0bGU6IFwi6aqM6K+B6KeE5YiZXCIsXG4gICAgICAgIG1vZGFsOiB0cnVlXG4gICAgICB9LCAyKTtcbiAgICB9LFxuICAgIGJlZ2luU2VsZWN0SW5GcmFtZTogZnVuY3Rpb24gYmVnaW5TZWxlY3RJbkZyYW1lKG9wZW5lciwgaW5zdGFuY2VOYW1lLCBvcHRpb24pIHtcbiAgICAgIHZhciB1cmwgPSBCYXNlVXRpbGl0eS5CdWlsZEFjdGlvbih0aGlzLlVSTCwge1xuICAgICAgICBcImluc3RhbmNlTmFtZVwiOiBpbnN0YW5jZU5hbWVcbiAgICAgIH0pO1xuICAgICAgdmFyIG9wdGlvbiA9ICQuZXh0ZW5kKHRydWUsIHt9LCB7XG4gICAgICAgIG1vZGFsOiB0cnVlLFxuICAgICAgICB0aXRsZTogXCLpqozor4Hop4TliJlcIlxuICAgICAgfSwgb3B0aW9uKTtcbiAgICAgIERpYWxvZ1V0aWxpdHkuRnJhbWVfT3BlbklmcmFtZVdpbmRvdyhvcGVuZXIsIERpYWxvZ1V0aWxpdHkuRGlhbG9nSWQwNSwgdXJsLCBvcHRpb24sIDEpO1xuICAgICAgJCh3aW5kb3cucGFyZW50LmRvY3VtZW50KS5maW5kKFwiLnVpLXdpZGdldC1vdmVybGF5XCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMCk7XG4gICAgICAkKHdpbmRvdy5wYXJlbnQuZG9jdW1lbnQpLmZpbmQoXCIudWktZGlhbG9nXCIpLmNzcyhcInpJbmRleFwiLCAxMDEwMSk7XG4gICAgfVxuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5mdW5jdGlvbiBfdHlwZW9mKG9iaikgeyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG52YXIgU3RyaW5nVXRpbGl0eSA9IHtcbiAgR3VpZFNwbGl0OiBmdW5jdGlvbiBHdWlkU3BsaXQoc3BsaXQpIHtcbiAgICB2YXIgZ3VpZCA9IFwiXCI7XG5cbiAgICBmb3IgKHZhciBpID0gMTsgaSA8PSAzMjsgaSsrKSB7XG4gICAgICBndWlkICs9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2LjApLnRvU3RyaW5nKDE2KTtcbiAgICAgIGlmIChpID09IDggfHwgaSA9PSAxMiB8fCBpID09IDE2IHx8IGkgPT0gMjApIGd1aWQgKz0gc3BsaXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGd1aWQ7XG4gIH0sXG4gIEd1aWQ6IGZ1bmN0aW9uIEd1aWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuR3VpZFNwbGl0KFwiLVwiKTtcbiAgfSxcbiAgVGltZXN0YW1wOiBmdW5jdGlvbiBUaW1lc3RhbXAoKSB7XG4gICAgdmFyIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHJldHVybiB0aW1lc3RhbXAudG9TdHJpbmcoKS5zdWJzdHIoNCwgMTApO1xuICB9LFxuICBUcmltOiBmdW5jdGlvbiBUcmltKHN0cikge1xuICAgIHJldHVybiBzdHIucmVwbGFjZSgvKF5b44CAXFxzXSopfChb44CAXFxzXSokKS9nLCBcIlwiKTtcbiAgfSxcbiAgUmVtb3ZlTGFzdENoYXI6IGZ1bmN0aW9uIFJlbW92ZUxhc3RDaGFyKHN0cikge1xuICAgIHJldHVybiBzdHIuc3Vic3RyaW5nKDAsIHN0ci5sZW5ndGggLSAxKTtcbiAgfSxcbiAgSXNOdWxsT3JFbXB0eTogZnVuY3Rpb24gSXNOdWxsT3JFbXB0eShvYmopIHtcbiAgICByZXR1cm4gb2JqID09IHVuZGVmaW5lZCB8fCBvYmogPT0gXCJcIiB8fCBvYmogPT0gbnVsbCB8fCBvYmogPT0gXCJ1bmRlZmluZWRcIiB8fCBvYmogPT0gXCJudWxsXCI7XG4gIH0sXG4gIEdldEZ1bnRpb25OYW1lOiBmdW5jdGlvbiBHZXRGdW50aW9uTmFtZShmdW5jKSB7XG4gICAgaWYgKHR5cGVvZiBmdW5jID09IFwiZnVuY3Rpb25cIiB8fCBfdHlwZW9mKGZ1bmMpID09IFwib2JqZWN0XCIpIHZhciBmTmFtZSA9IChcIlwiICsgZnVuYykubWF0Y2goL2Z1bmN0aW9uXFxzKihbXFx3XFwkXSopXFxzKlxcKC8pO1xuICAgIGlmIChmTmFtZSAhPT0gbnVsbCkgcmV0dXJuIGZOYW1lWzFdO1xuICB9LFxuICBUb0xvd2VyQ2FzZTogZnVuY3Rpb24gVG9Mb3dlckNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b0xvd2VyQ2FzZSgpO1xuICB9LFxuICB0b1VwcGVyQ2FzZTogZnVuY3Rpb24gdG9VcHBlckNhc2Uoc3RyKSB7XG4gICAgcmV0dXJuIHN0ci50b1VwcGVyQ2FzZSgpO1xuICB9LFxuICBFbmRXaXRoOiBmdW5jdGlvbiBFbmRXaXRoKHN0ciwgZW5kU3RyKSB7XG4gICAgdmFyIGQgPSBzdHIubGVuZ3RoIC0gZW5kU3RyLmxlbmd0aDtcbiAgICByZXR1cm4gZCA+PSAwICYmIHN0ci5sYXN0SW5kZXhPZihlbmRTdHIpID09IGQ7XG4gIH0sXG4gIElzU2FtZU9yZ2luOiBmdW5jdGlvbiBJc1NhbWVPcmdpbih1cmwxLCB1cmwyKSB7XG4gICAgdmFyIG9yaWdpbjEgPSAvXFwvXFwvW1xcdy0uXSsoOlxcZCspPy9pLmV4ZWModXJsMSlbMF07XG4gICAgdmFyIG9yaWdpbjIgPSAvXFwvXFwvW1xcdy0uXSsoOlxcZCspPy9pLmV4ZWModXJsMilbMF07XG5cbiAgICBpZiAob3JpZ2luMSA9PSBvcmlnaW4yKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBYTUxVdGlsaXR5ID0ge307Il19
