var DetailPageUtility={
    IViewPageToViewStatus:function () {
        //alert("1");
        return;
        window.setTimeout(function () {
            //alert("1");
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
        },100)
    },
    OverrideObjectValue:function (sourceObject, dataObject) {
        //console.log(dataObject);
        for(var key in sourceObject){
            if(dataObject[key]!=undefined&&dataObject[key]!=null&&dataObject[key]!=""){
                sourceObject[key]=dataObject[key];
            }
        }
    },
    OverrideObjectValueFull:function (sourceObject, dataObject) {
        //console.log(dataObject);
        for(var key in sourceObject) {
            sourceObject[key] = dataObject[key];
        }
    },
    BindFormData:function(interfaceUrl,vueFormData,recordId,op,befFunc,afFunc){
        //获取数据并赋值
        AjaxUtility.Post(interfaceUrl,{recordId:recordId,op:op},function (result) {
            if(result.success) {
                if(typeof(befFunc)=="function"){
                    befFunc(result);
                }
                DetailPageUtility.OverrideObjectValue(vueFormData, result.data);
                if(typeof(afFunc)=="function"){
                    afFunc(result);
                }
                if(op=="view") {
                    DetailPageUtility.IViewPageToViewStatus();
                }
            }
            else {
                DialogUtility.Alert(window, DialogUtility.DialogAlertId, {}, result.message, null);
            }
        },"json");
    },
}
