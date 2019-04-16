//Json操作工具类
var JsonUtility = {
    ParseArrayJsonToTreeJson:function (config, sourceArray, rootId){
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
    ResolveSimpleArrayJsonToTreeJson: function (config, sourceJson, rootNodeId) {
        alert("JsonUtility.ResolveSimpleArrayJsonToTreeJson 已停用");
    },
    SimpleCloneAttr: function (toObj, fromObj) {
        for (var attr in fromObj) {
            toObj[attr] = fromObj[attr];
        }
        return toObj;
    },
    CloneSimple:function (source) {
        var newJson = jQuery.extend(true,{}, source);
        return newJson;
    },
    CloneStringify:function(source){
        var newJson=this.JsonToString(source);
        return this.StringToJson(newJson);
    },
    JsonToString:function (obj) {
        return JSON.stringify(obj);
    },
    JsonToStringFormat:function (obj) {
        return JSON.stringify(obj, null, 2);
    },
    StringToJson: function (str) {
        return eval("(" + str + ")");
    }
};