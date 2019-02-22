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

function refCssLink(href) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('link');
    style.type = 'text/css';
    style.rel='stylesheet';
    style.href=href;
    head.appendChild(style);
    return style.sheet ||style.styleSheet;
}