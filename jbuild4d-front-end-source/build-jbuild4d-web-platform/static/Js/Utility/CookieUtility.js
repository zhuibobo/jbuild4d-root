var CookieUtility = {
    /**
     * 设置cookie
     * @param name  cookie名称
     * @param value  cookie值
     */
    SetCookie1Day:function(name, value){
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + 24 * 60 * 60 * 1000); //1天
        // 这里一定要加上path。不然到index.jsp页面去清除cookie的时候会出现找不到cookie的问题。
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+";path=/";
    },
    SetCookie1Month:function(name,value){
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 1000); //1月
        // 这里一定要加上path。不然到index.jsp页面去清除cookie的时候会出现找不到cookie的问题。
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+";path=/";
    },
    SetCookie1Year:function(name,value){
        var exp = new Date();    //new Date("December 31, 9998");
        exp.setTime(exp.getTime() + 30 * 24 * 60 * 60 * 365 * 1000); //1年
        // 这里一定要加上path。不然到index.jsp页面去清除cookie的时候会出现找不到cookie的问题。
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString()+";path=/";
    },
    /**
     * 读取cookies函数
     * @param name
     * @returns
     */
    GetCookie:function(name) {
        var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
        if (arr != null) return unescape(arr[2]); return null;
    },
    /**
     * 删除cookie
     * @param name cookie名称
     */
    DelCookie:function(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = this.getCookie(name);
        if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()+";path=/";
    }
};