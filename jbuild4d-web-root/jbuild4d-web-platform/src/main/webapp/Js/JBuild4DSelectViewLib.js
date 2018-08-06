var SelectEnvVariable={
    URL:BaseUtility.GetRootPath()+"/PlatForm/SelectView/SelectEnvVariable/Select.do",
    beginSelect:function (instanceName) {
        var url=this.URL+"?instanceName="+instanceName;
        DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "选择变量",modal:true}, 2);
    },
    formatText:function (type,text) {
        if(type=="Const"){
            return "静态值:【"+text+"】";
        }
        else if(type=="DateTime"){
            return "日期时间:【"+text+"】";
        }
        else if(type=="ApiVar"){
            return "API变量:【"+text+"】";
        }
        else if(type=="NumberCode"){
            return "序号编码:【"+text+"】";
        }
        return "未知类型"+text;
    }
}