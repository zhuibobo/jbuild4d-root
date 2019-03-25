package com.jbuild4d.platform.sso.core;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.platform.sso.core.vo.SSOCodeVo;

public interface ISSOLoginStore {
    SSOCodeVo createAccessCode(JB4DSession jb4DSession,String returnUrl,String appId);
}
