var DictionaryUtility={
    _GroupValueListJsonToSimpleJson:null,
    GroupValueListJsonToSimpleJson:function (sourceDictionaryJson) {
        if(this._GroupValueListJsonToSimpleJson==null) {
            if (sourceDictionaryJson != null) {
                var result = {};
                for (var groupValue in sourceDictionaryJson) {
                    result[groupValue] = {};
                    for (var i = 0; i < sourceDictionaryJson[groupValue].length; i++) {
                        result[groupValue][sourceDictionaryJson[groupValue][i].dictValue] = sourceDictionaryJson[groupValue][i].dictText;
                    }
                }
                this._GroupValueListJsonToSimpleJson=result;
            }
        }
        return this._GroupValueListJsonToSimpleJson;
    }
}
