package com.jbuild4d.sso.client.filter;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.sso.client.proxy.LoginProxyUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.*;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class SsoWebFilter extends HttpServlet implements Filter {

    public static final String KEY_SSO_SERVER = "SSO_SERVER";
    public static final String KEY_SSO_LOGOUT_PATH = "SSO_LOGOUT_PATH";
    public static final String KEY_SSO_EXCLUDED_PATHS = "SSO_EXCLUDED_PATHS";

    private static Logger logger = LoggerFactory.getLogger(SsoWebFilter.class);

    private String ssoServer;
    private String logoutPath;
    private String excludedPaths;

    public void init(FilterConfig filterConfig) throws ServletException {
        ssoServer = filterConfig.getInitParameter(KEY_SSO_SERVER);
        logoutPath = filterConfig.getInitParameter(KEY_SSO_LOGOUT_PATH);
        excludedPaths = filterConfig.getInitParameter(KEY_SSO_EXCLUDED_PATHS);

        logger.info("SsoWebFilter init.");
    }

    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest req = (HttpServletRequest) request;
        HttpServletResponse res = (HttpServletResponse) response;

        // make url
        String servletPath = req.getServletPath();

        JB4DSession jb4DSession=LoginProxyUtility.loginCheck(req,res);

        chain.doFilter(request, response);
        return;
    }
}
