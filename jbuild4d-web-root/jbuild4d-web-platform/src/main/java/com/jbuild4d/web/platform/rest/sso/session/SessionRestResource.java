package com.jbuild4d.web.platform.rest.sso.session;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.vo.JBuild4DResponseVo;
import com.jbuild4d.platform.sso.core.ISSOLoginStore;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/PlatFormRest/SSO/Session")
public class SessionRestResource {

    @Autowired
    ISSOLoginStore ssoLoginStore;

    @RequestMapping(value = "GetSession", method = RequestMethod.POST)
    public JBuild4DResponseVo getSession(String JBuild4DSSOCode){
        JB4DSession jb4DSession=ssoLoginStore.getSession(JBuild4DSSOCode);
        return JBuild4DResponseVo.getDataSuccess(jb4DSession);
    }
}
