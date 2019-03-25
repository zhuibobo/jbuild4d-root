package com.jbuild4d.platform.sso.core;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.sso.core.vo.SSOCodeVo;

public interface ISSOLogin {
    JB4DSession LoginMainSystem(String account, String password);

    SSOCodeVo LoginSSOSystem(String account, String password,String redirectUrl,String appId);
}
