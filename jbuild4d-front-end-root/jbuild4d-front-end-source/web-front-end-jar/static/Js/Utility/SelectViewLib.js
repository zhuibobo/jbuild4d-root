var JBuild4DSelectView={
    SelectEnvVariable:{
        /*URL:"/HTML/SelectView/SelectEnvVariable.html",
        beginSelect:function (instanceName) {
            var url=BaseUtility.BuildView(this.URL, {"instanceName": instanceName});
            DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "选择变量",modal:true}, 2);
        },
        beginSelectInFrame:function(opener,instanceName,option){
            var url=BaseUtility.BuildView(this.URL, {"instanceName": instanceName});
            var option = $.extend(true, {}, {
                modal: true,
                title: "选择变量"
            },option);
            DialogUtility.Frame_OpenIframeWindow(opener,DialogUtility.DialogId05,url,option,1);
            //alert("1");
            $(window.parent.document).find(".ui-widget-overlay").css("zIndex",10100);
            $(window.parent.document).find(".ui-dialog").css("zIndex",10101);
        },*/
        formatText:function (type,text) {
            //debugger;
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
            else if(type=="IdCoder"){
                return "主键生成:【"+text+"】";
            }
            else if(type==""){
                return "【无】";
            }
            return "未知类型"+text;
        }
    }
    /*,
    SelectBindToField:{
        URL:"/HTML/SelectView/SelectBindToField.html",
        beginSelect:function (instanceName) {
            var url=this.URL+"?instanceName="+instanceName;
            DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "选择变量",modal:true}, 2);
        },
        beginSelectInFrame:function (opener,instanceName,option) {
            var url=BaseUtility.BuildView(this.URL, {"instanceName": instanceName});
            var option = $.extend(true, {}, {
                modal: true,
                title: "选择绑定字段"
            },option);
            DialogUtility.Frame_OpenIframeWindow(opener,DialogUtility.DialogId05,url,option,1);
            //alert("1");
            $(window.parent.document).find(".ui-widget-overlay").css("zIndex",10100);
            $(window.parent.document).find(".ui-dialog").css("zIndex",10101);
        },
    },
    SelectValidateRule:{
        URL:"/HTML/SelectView/SelectValidateRule.html",
        beginSelect:function (instanceName) {
            var url=this.URL+"?instanceName="+instanceName;
            DialogUtility.OpenIframeWindow(window, DialogUtility.DialogId, url, {title: "验证规则",modal:true}, 2);
        },
        beginSelectInFrame:function (opener,instanceName,option) {
            var url=BaseUtility.BuildView(this.URL, {"instanceName": instanceName});
            var option = $.extend(true, {}, {
                modal: true,
                title: "验证规则"
            },option);
            DialogUtility.Frame_OpenIframeWindow(opener,DialogUtility.DialogId05,url,option,1);
            //alert("1");
            $(window.parent.document).find(".ui-widget-overlay").css("zIndex",10100);
            $(window.parent.document).find(".ui-dialog").css("zIndex",10101);
        }
    }*/
}