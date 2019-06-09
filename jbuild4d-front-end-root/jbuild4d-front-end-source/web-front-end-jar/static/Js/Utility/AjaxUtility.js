//Ajax处理工具类
var AjaxUtility={
    PostRequestBody:function (_url,sendData,func,dataType) {
        this.Post(_url,sendData,func,dataType,"application/json; charset=utf-8");
    },
    PostSync:function (_url,sendData,func,dataType,contentType) {
        var result=this.Post(_url,sendData,func,dataType,contentType,false);
        return result;
    },
    Post:function (_url,sendData,func,dataType,contentType,isAsync) {
        var url = BaseUtility.BuildAction(_url);
        if (dataType == undefined || dataType == null) {
            dataType = "text";
        }
        if (isAsync == undefined || isAsync == null) {
            isAsync = true;
        }
        if(contentType==undefined||contentType==null){
            contentType="application/x-www-form-urlencoded; charset=UTF-8";
        }
        var innerResult=null;
        $.ajax({
            type: "POST",
            url: url,
            cache: false,
            async:isAsync,
            contentType: contentType,//"application/json; charset=utf-8",*/
            dataType: dataType,
            data: sendData,
            success: function (result) {
                try{
                    if(result!=null&&result.success!=null&&!result.success){
                        if(result.message=="登录Session过期"){
                            DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"Session超时，请重新登陆系统",function () {
                                BaseUtility.RedirectToLogin();
                            });
                        }
                    }
                }
                catch(e) {
                    console.log("AjaxUtility.Post Exception "+url);
                }
                func(result);
                innerResult=result;
            },
            complete: function (msg) {
                //debugger;
            },
            error: function (msg) {
                //debugger;
                try{
                    if(msg.responseText.indexOf("请重新登陆系统")>=0){
                        BaseUtility.RedirectToLogin();
                    }
                    console.log(msg);
                    DialogUtility.Alert(window,"AjaxUtility.Post.Error",{},"Ajax请求发生错误！"+"status:"+msg.status+",responseText:"+msg.responseText,null);
                }catch (e){

                }
            }
        });
        return innerResult;
    },
    GetSync:function (_url,sendData,func,dataType) {
        this.Post(_url,sendData,func,dataType,false);
    },
    Get:function (_url,sendData,func,dataType,isAsync) {
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
            async:isAsync,
            contentType: "application/json; charset=utf-8",
            dataType: dataType,
            data: sendData,
            success: function (result) {
                func(result);
            },
            complete: function (msg) {
                //debugger;
            },
            error: function (msg) {
                debugger;
            }
        });
    },
    Delete:function (_url,sendData,func,dataType,contentType,isAsync) {
        var url = BaseUtility.BuildAction(_url);
        if (dataType == undefined || dataType == null) {
            dataType = "text";
        }
        if (isAsync == undefined || isAsync == null) {
            isAsync = true;
        }
        if(contentType==undefined||contentType==null){
            contentType="application/x-www-form-urlencoded; charset=UTF-8";
        }
        var innerResult=null;
        $.ajax({
            type: "DELETE",
            url: url,
            cache: false,
            async:isAsync,
            contentType: contentType,//"application/json; charset=utf-8",*/
            dataType: dataType,
            data: sendData,
            success: function (result) {
                try{
                    if(result!=null&&result.success!=null&&!result.success){
                        if(result.message=="登录Session过期"){
                            DialogUtility.Alert(window,DialogUtility.DialogAlertId,{},"Session超时，请重新登陆系统",function () {
                                BaseUtility.RedirectToLogin();
                            });
                        }
                    }
                }
                catch(e) {
                    console.log("AjaxUtility.Post Exception "+url);
                }
                func(result);
                innerResult=result;
            },
            complete: function (msg) {
                //debugger;
            },
            error: function (msg) {
                //debugger;
                try{
                    if(msg.responseText.indexOf("请重新登陆系统")>=0){
                        BaseUtility.RedirectToLogin();
                    }
                    console.log(msg);
                    DialogUtility.Alert(window,"AjaxUtility.Delete.Error",{},"Ajax请求发生错误！"+"status:"+msg.status+",responseText:"+msg.responseText,null);
                }catch (e){

                }
            }
        });
        return innerResult;
    }
}