var SelectEnvVariable={
    URL:BaseUtility.GetRootPath+"/PlatForm/SelectView/SelectEnvVariable/Select.do",
    beginSelect:function (instanceName) {
        var url=this.URL+"?instanceName="+instanceName;
        DialogUtility.Frame_OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "选择变量"}, 2);
    }
}