//查询处理工具类
var SearchUtility={
    SearchFieldType:{
        IntType:"IntType",
        NumberType:"NumberType",
        DataType:"DateType",
        LikeStringType:"LikeStringType",
        LeftLikeStringType:"LeftLikeStringType",
        RightLikeStringType:"RightLikeStringType",
        StringType:"StringType",
        DataStringType:"DateStringType",
        ArrayLikeStringType:"ArrayLikeStringType"
    },
    SerializationSearchCondition:function (searchCondition) {
        var searchConditionClone=JsonUtility.CloneSimple(searchCondition);
        //debugger;
        for(var key in searchConditionClone){
            if(searchConditionClone[key].type==SearchUtility.SearchFieldType.ArrayLikeStringType){
                if(searchConditionClone[key].value!=null&&searchConditionClone[key].value.length>0) {
                    searchConditionClone[key].value = searchConditionClone[key].value.join(";");
                }
                else{
                    searchConditionClone[key].value="";
                }
            }
        }
        //debugger;
        return JSON.stringify(searchConditionClone);
    }
}