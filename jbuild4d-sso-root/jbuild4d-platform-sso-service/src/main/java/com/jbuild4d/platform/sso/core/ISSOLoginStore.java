package com.jbuild4d.platform.sso.core;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.sso.core.vo.SSOCodeVo;

public interface ISSOLoginStore {
    void storeSSOSession(JB4DSession jb4DSession,SSOCodeVo ssoCodeVo);

    JB4DSession getSession(String jBuild4DSSOCode);

    SSOCodeVo createSSOCode(String returnUrl, String appId);
}
