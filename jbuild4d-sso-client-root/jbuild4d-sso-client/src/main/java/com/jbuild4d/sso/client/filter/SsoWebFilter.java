package com.jbuild4d.sso.client.filter;

import com.jbuild4d.core.base.session.JB4DSession;
import com.jbuild4d.sso.client.conf.Conf;
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
    public static final String KEY_SSO_LOGIN_PATH="SSO_LOGIN_PATH";
    public static final String KEY_SSO_LOGOUT_PATH = "SSO_LOGOUT_PATH";
    public static final String KEY_SSO_EXCLUDED_PATHS = "SSO_EXCLUDED_PATHS";

    private static Logger logger = LoggerFactory.getLogger(SsoWebFilter.class);

    private String ssoServer;
    private String loginPath;
    private String logoutPath;
    private String excludedPaths;

    public void init(FilterConfig filterConfig) throws ServletException {
        ssoServer = filterConfig.getInitParameter(KEY_SSO_SERVER);
        loginPath = filterConfig.getInitParameter(KEY_SSO_LOGIN_PATH);
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

        if(jb4DSession==null){
            String header = req.getHeader("content-type");
            boolean isJson=  header!=null && header.contains("json");
            if (isJson) {
                //如果是Ajax请求?
                //json msg
                res.setContentType("application/json;charset=utf-8");
                res.getWriter().println("{\"code\":"+ Conf.SSO_LOGIN_FAIL_RESULT.getErrorCode()+", \"msg\":\""+ Conf.SSO_LOGIN_FAIL_RESULT.getMessage() +"\"}");
                return;
            } else {
                // total link
                String link = req.getRequestURL().toString();
                // 重定向到登录页面,带上原始的地址,登录后返回原始页面.
                String loginPageUrl = ssoServer.concat(loginPath)
                        + "?" + Conf.REDIRECT_URL + "=" + link;

                res.sendRedirect(loginPageUrl);
                return;
            }
        }

        chain.doFilter(request, response);
        return;
    }
}
