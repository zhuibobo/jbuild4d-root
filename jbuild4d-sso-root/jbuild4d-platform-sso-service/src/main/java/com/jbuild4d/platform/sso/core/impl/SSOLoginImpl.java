package com.jbuild4d.platform.sso.core.impl;

import com.jbuild4d.base.service.general.JB4DSessionUtility;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.sso.core.ISSOLogin;
import com.jbuild4d.platform.sso.core.ISSOLoginStore;
import com.jbuild4d.platform.sso.core.vo.SSOCodeVo;

public class SSOLoginImpl implements ISSOLogin {
    ISSOLoginStore ssoLoginStore;

    public SSOLoginImpl(ISSOLoginStore _ssoLoginStore) {
        this.ssoLoginStore=_ssoLoginStore;
    }

    @Override
    public JB4DSession LoginMainSystem(String account, String password) {

        JB4DSession b4DSession = new JB4DSession();
        b4DSession.setOrganName("4D");
        b4DSession.setOrganId("OrganId");
        b4DSession.setUserName("Alex");
        b4DSession.setUserId("UserId");

        SSOCodeVo code=ssoLoginStore.createSSOCode("","");
        b4DSession.setSsoCode(code.getCode());

        ssoLoginStore.storeSSOSession(b4DSession,code);

        JB4DSessionUtility.addSessionAttr(JB4DSessionUtility.UserLoginSessionKey, b4DSession);

        return b4DSession;
    }

    @Override
    public SSOCodeVo LoginSSOSystem(String account, String password,String redirectUrl,String appId) {
        JB4DSession b4DSession = new JB4DSession();
        b4DSession.setOrganName("4D");
        b4DSession.setOrganId("OrganId");
        b4DSession.setUserName("Alex");
        b4DSession.setUserId("UserId");

        SSOCodeVo code=ssoLoginStore.createSSOCode(redirectUrl,appId);
        b4DSession.setSsoCode(code.getCode());

        ssoLoginStore.storeSSOSession(b4DSession,code);

        JB4DSessionUtility.addSessionAttr(JB4DSessionUtility.UserLoginSessionKey, b4DSession);

        return code;
    }


}
