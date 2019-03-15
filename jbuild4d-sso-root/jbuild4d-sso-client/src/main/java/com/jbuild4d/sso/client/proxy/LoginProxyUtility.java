package com.jbuild4d.sso.client.proxy;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.core.base.tools.CookieUtility;
import com.jbuild4d.sso.client.conf.Conf;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class LoginProxyUtility {

    public static JB4DSession loginCheck(HttpServletRequest request, HttpServletResponse response) {

        String cookieSessionId = CookieUtility.getValue(request, Conf.SSO_SESSIONID);

        return null;
    }
}
