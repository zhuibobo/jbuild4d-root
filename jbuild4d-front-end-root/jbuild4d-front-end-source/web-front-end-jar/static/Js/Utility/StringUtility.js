//字符串操作类
var StringUtility = {
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
    Timestamp: function () {
        var timestamp = new Date().getTime();
        return timestamp.toString().substr(4, 10);
    },
    Trim: function (str) {
        return str.replace(/(^[　\s]*)|([　\s]*$)/g, "");
    },
    RemoveLastChar: function (str) {
        return str.substring(0, str.length - 1)
    },
    IsNullOrEmpty: function (obj) {
        return obj == undefined || obj == "" || obj == null || obj == "undefined" || obj == "null"
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
    EndWith:function (str,endStr) {
        var d=str.length-endStr.length;
        //alert(str.lastIndexOf(endStr)==d);
        return (d>=0&&str.lastIndexOf(endStr)==d);
    },
    /*GetURLHost:function (url) {
        var origin = /\/\/[\w-.]+(:\d+)?/i.exec(url)[0];
        return origin;
    },*/
    IsSameOrgin:function (url1, url2) {
        var origin1 = /\/\/[\w-.]+(:\d+)?/i.exec(url1)[0];

        var open=/\/\/[\w-.]+(:\d+)?/i.exec(url2);
        if(open==null){
            return true;
        }
        else {
            var origin2 = open[0];
            if (origin1 == origin2) {
                return true;
            }
            return false;
        }
    }
};