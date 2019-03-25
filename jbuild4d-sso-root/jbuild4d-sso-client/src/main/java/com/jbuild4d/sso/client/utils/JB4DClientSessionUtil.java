package com.jbuild4d.sso.client.utils;

import com.jbuild4d.core.base.exception.SessionTimeoutException;
import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.sso.client.conf.Conf;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

public class JB4DClientSessionUtil {
    public static JB4DSession getSession(HttpServletRequest request) throws SessionTimeoutException {
        //HttpServletRequest request = ServletRequest
        if(request == null) {
            throw new SessionTimeoutException();
        }
        JB4DSession b4DSession = (JB4DSession)request.getSession().getAttribute(Conf.SSO_LOCATION_SESSION_KEY);
        if(b4DSession == null) {
            throw new SessionTimeoutException();
        }
        return b4DSession;
    }
}
