var CacheDataUtility={
    IninClientCache:function () {
        this.GetCurrentUserInfo();
    },
    //用户相关信息
    _CurrentUserInfo:null,
    GetCurrentUserInfo:function () {
        if(this._CurrentUserInfo==null){
            if(window.parent.CacheDataUtility._CurrentUserInfo!=null){
                return window.parent.CacheDataUtility._CurrentUserInfo;
            }
            else{
                AjaxUtility.PostSync("/PlatFormRest/MyInfo/GetUserInfo",{},function (result) {
                    if(result.success){
                        CacheDataUtility._CurrentUserInfo=result.data;
                    }
                    else{

                    }
                },"json");
                return this._CurrentUserInfo;
            }
        }
        else{
            return this._CurrentUserInfo;
        }
    }
}
