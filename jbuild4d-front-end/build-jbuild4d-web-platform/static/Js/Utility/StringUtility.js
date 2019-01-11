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
    },
    EndWith:function (str,endStr) {
        var d=str.length-endStr.length;
        return (d>=0&&str.lastIndexOf(endStr)==d);
    }
};