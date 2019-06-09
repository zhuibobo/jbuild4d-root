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