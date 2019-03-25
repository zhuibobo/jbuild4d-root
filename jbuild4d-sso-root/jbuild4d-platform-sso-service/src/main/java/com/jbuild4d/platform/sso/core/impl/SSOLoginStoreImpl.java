package com.jbuild4d.platform.sso.core.impl;

import com.jbuild4d.base.tools.cache.JB4DCacheManager;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.tools.DateUtility;
import com.jbuild4d.core.base.tools.UUIDUtility;
import com.jbuild4d.platform.sso.core.ISSOLoginStore;
import com.jbuild4d.platform.sso.core.vo.SSOCodeVo;

public class SSOLoginStoreImpl implements ISSOLoginStore {
    @Override
    public SSOCodeVo createAccessCode(JB4DSession jb4DSession,String returnUrl,String appId) {
        String jBuild4DSSOCode= UUIDUtility.getUUIDNotSplit();
        JB4DCacheManager.put(JB4DCacheManager.jb4dPlatformSSOSessionStoreName,jBuild4DSSOCode,jb4DSession);
        SSOCodeVo codeVo=new SSOCodeVo();
        codeVo.setCode(jBuild4DSSOCode);
        codeVo.setTime(DateUtility.getDate_yyyy_MM_dd_HH_mm_ss());
        codeVo.setRedirectUrl(returnUrl);
        return codeVo;
    }

    @Override
    public JB4DSession getSession(String jBuild4DSSOCode) {
        JB4DSession jb4DSession=JB4DCacheManager.getObject(JB4DCacheManager.jb4dPlatformSSOSessionStoreName,jBuild4DSSOCode);
        jb4DSession.setSsoCode(jBuild4DSSOCode);
        return jb4DSession;
    }
}
